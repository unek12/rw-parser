const UserModel = require('../models/Users');

const setRouteStep = async (bot, user, chatId) => {
  const { message_id } = await bot.sendMessage(chatId, 'Введите станцию отправления')

  await UserModel.findOneAndUpdate(
    { username: user.username },
    { step: 1, messages: [message_id] },
    { new: true }
  )

  return res
}

module.exports = setRouteStep
