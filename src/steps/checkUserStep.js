const UserModel = require('../../database/models/Users');
const { SET_ROUTE, USER_LAST_ROUTE } = require('../../constants');

const startOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: 'Выбрать маршрут', callback_data: SET_ROUTE}],
    ]
  })
}

const optionsWithRoute = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: 'Выбрать маршрут', callback_data: SET_ROUTE}],
      [{text: 'Мои маршруты', callback_data: USER_LAST_ROUTE}]
    ]
  })
}

const checkUserStep = async (from, name, username, chatId, message_id, bot, user) => {
    if (user) {
      bot.deleteMessage(chatId, message_id)
      const options = user.savedRoute ? optionsWithRoute : startOptions

      const res = await bot.sendMessage(chatId, `Ты уже запускал(-a) меня ${from}, выбери че нужно)`, options)

      await UserModel.findOneAndUpdate({ username }, { step: 0, lastMessageId: res.message_id }, { new: true })

      return res
    }

  const message = await bot.sendMessage(chatId, `Даров! ${from} шо, тоже проблемы с билетами? Постараюсь помочь.`, startOptions)

  const createdUser = await new UserModel({
    name: name || 'Пользователь',
    username,
    step: 0,
    chatId: chatId,
    lastMessageId: message.message_id,
    createdAt: new Date().getTime(),
  });

    return createdUser.save();
}

module.exports = checkUserStep;
