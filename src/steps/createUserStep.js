const UserModel = require('../../database/models/Users');
const { SET_ROUTE, USER_LAST_ROUTE } = require('../../constants');

const reply_markup = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Выбрать маршрут', callback_data: SET_ROUTE }],
  ]
})

const createUserStep = async (bot, name, username, chatId, messageId) => {
  const createdUser = await new UserModel({
    name: name,
    username,
    step: 0,
    lastMessageId: messageId,
    messages: [],
    chatId,
    createdAt: new Date().getTime(),
  });

  await createdUser.save();

  const message = await bot.sendMessage(
    chatId,
    `Даров! ${ name } шо, тоже проблемы с билетами? Постараюсь помочь.`,
    { parse_mode: "HTML", reply_markup, }
  )
  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate({ username }, {
    step: 0,
    lastMessageId: messageId,
    messages: [message.message_id]
  }, { new: true })
}

module.exports = createUserStep
