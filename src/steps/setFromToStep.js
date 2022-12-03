const UserModel = require('../../database/models/Users');
const { getRWParams } = require('../utils/request');
const { setCustomButtons } = require('../utils/utils');

const setFromToStep = async (bot, chatId, messageId, username, text, step) => {
  const autocompleteData = await getRWParams(text)

  if (autocompleteData?.data?.length) {
    const buttons = autocompleteData.data.map((item) => ([{ text: item.label, callback_data: item.value }]))
    const buttonItems = setCustomButtons(buttons)

    const message = await bot.sendMessage(
      chatId,
      `Нажми на подходящую станцию`,
      { parse_mode: "HTML", ...buttonItems }
    )
    await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
    return UserModel.findOneAndUpdate({ username }, {
      step: step + 1,
      lastMessageId: messageId,
      messages: [message.message_id]
    }, { new: true })
  }

  const message = await bot.sendMessage(chatId, `По запросу <b>${ text }</b> я ничего не нашел. \nПопробуй еще разок вести станцию`, { parse_mode: "HTML" })
  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate({ username }, {
    step,
    lastMessageId: messageId,
    messages: [message.message_id]
  }, { new: true })
}

module.exports = setFromToStep
