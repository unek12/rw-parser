const UserModel = require('../../database/models/Users');
const { getRWParams } = require('../utils/request');
const { setCustomButtons } = require('../utils/utils');

const getRouteToStep = async (bot, user, chatId, username, text) => {

    const autocompleteData = await getRWParams(text)

    if (autocompleteData.data && autocompleteData.data.length) {
      const buttons = autocompleteData.data.map((item) => ([{ text: item.label, callback_data: item.value }]))

      const buttonItems = setCustomButtons(buttons)

      return bot.sendMessage(chatId, `Вот что нашел, выбери точную точку прибытия`, buttonItems).then(async res => {
        await UserModel.findOneAndUpdate(
          { username },
          { lastMessageId: res.message_id },
          { new: true }
        )
      })
    }

    return bot.sendMessage(chatId, `Не нашел даже приблизительно похожих станций, введи еще раз`)
}

module.exports = getRouteToStep
