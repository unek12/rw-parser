const UserModel = require('../../database/models/Users');

const setFirstStep = async (bot, chatId, messageId, username) => {
  const { message_id } = await bot.sendMessage(
    chatId,
    'Введите станцию отправления',
  );
  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate({ username },{ step: 1, messages: [message_id] }, { new: true })
}

module.exports = setFirstStep;
