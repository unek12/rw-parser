const UserModel = require('../models/Users');
const { SET_ROUTE, MY_LAST_ROUTE } = require('../constants');

const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{text: 'Выбрать маршрут', callback_data: SET_ROUTE}],
    ]
  })

const replay_markup_full = {
  inline_keyboard: [
    [{text: 'Выбрать маршрут', callback_data: SET_ROUTE}],
    [{text: 'Сохраненный маршрут', callback_data: MY_LAST_ROUTE}],
  ]
}

const startStep = async (bot, user, chatId, messageId) => {
  const isIncludeRoute = user.currentRoute?.date

  const message = await bot.sendMessage(chatId, `Привет ${user.name}! Проблемы с билетами? Постараюсь помочь.`, { reply_markup: isIncludeRoute ? replay_markup_full : reply_markup })
  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate({ username: user.username }, { step: 0, lastMessageId: messageId, messages: [ message.message_id] }, { new: true })
}

module.exports = startStep