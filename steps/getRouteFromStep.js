const UserModel = require('../models/Users');
const { getRWParams } = require('../request');
const { setCustomButtons } = require('../utils');

const getRouteFromStep = async (bot, user, chatId, text) => {

    const autocompleteData = await getRWParams(text)

    if (autocompleteData.data && autocompleteData.data.length) {
      const buttons = autocompleteData.data.map((item) => ([{ text: item.label, callback_data: item.value }]))

      const buttonItems = setCustomButtons(buttons)

      return bot.sendMessage(
        chatId,
        `Ты ввел(-a) <b>${text}</b> и вот что я нашел, выбери точную точку отправления`,
        {...buttonItems, parse_mode: "HTML"},
        ).then(async res => {
        await UserModel.findOneAndUpdate(
          { username: user.username },
          { lastMessageId: res.message_id },
          { new: true }
        )
      })
    }

    return bot.sendMessage(
      chatId,
      `Ты ввел(-a) <b>${text}</b>, но я не нашел даже приблизительно похожих станций, введи еще раз`,
      {parse_mode: "HTML"}
      ).then(async res => {
      await UserModel.findOneAndUpdate(
        { username: user.username },
        { lastMessageId: res.message_id },
        { new: true }
      )
    })
}

module.exports = getRouteFromStep
