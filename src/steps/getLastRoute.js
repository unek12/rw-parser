const UserModel = require('../../database/models/Users');
const { READY_FIND_ROUTE, EDIT_ROUTE } = require('../../constants');

const getLastRoute = async (bot, user, chatId, messageId) => {
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [{ text: 'Да, использовать его', callback_data: READY_FIND_ROUTE }],
      [{ text: 'Изменить', callback_data: EDIT_ROUTE }],
    ]
  })

  const message = await bot.sendMessage(
    chatId,
    `Точка отправления: <b>${ user.currentRoute.from }</b>. \nТочка прибытия: <b>${ user.currentRoute.to }</b>. \nДата: <b>${ user.currentRoute.date }</b>`,
    {
      parse_mode: "HTML",
      reply_markup
    }
  )
  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate(
    { username: user.username },
    { step: 6, lastMessageId: message.message_id, messages: [message.message_id] },
    { new: true })
}

module.exports = getLastRoute;
