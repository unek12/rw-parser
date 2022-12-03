const UserModel = require('../../database/models/Users');
const moment = require('moment');
const { READY_FIND_ROUTE, EDIT_ROUTE } = require('../../constants');

const reply_markup = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Да, все верно', callback_data: READY_FIND_ROUTE }],
    [{ text: 'Изменить', callback_data: EDIT_ROUTE }],
  ]
})
const date_reply_markup = JSON.stringify({
  inline_keyboard: [
    [{ text: '1', callback_data: READY_FIND_ROUTE }, { text: '2', callback_data: READY_FIND_ROUTE }, {
      text: '3',
      callback_data: READY_FIND_ROUTE
    }],
    [{ text: 'Изменить', callback_data: EDIT_ROUTE }],
  ]
})

const validateDate = (text) => {
  if (text.length < 9) {
    return false
  }

  const date = moment(text, 'DD-MM-YYYY').format('YYYY-MM-DD')

  if (date === 'Invalid date') {
    return false
  }

  return date
}

const setDateStep = async (bot, user, chatId, messageId, username, text) => {
  const date = await validateDate(text)

  if (!date) {
    const message = await bot.sendMessage(
      chatId,
      `Возможно вы ввели дату неправильно.\nПовторите строго в таком формате:\n<b>день.месяц.год</b> (пример: 20.12.2021)`,
      { parse_mode: "HTML" })
    await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
    return UserModel.findOneAndUpdate({ username }, {
      lastMessageId: messageId,
      messages: [message.message_id]
    }, { new: true })
  }

  const dateToNumber = moment(date).valueOf() + 10800001
  const dateNow = moment.now() - (moment.now() % 86400000)
  if (dateNow >= dateToNumber) {
    const message = await bot.sendMessage(
      chatId,
      `Эта дата уже прошла, еще разок строго в таком формате:\n<b>день.месяц.год</b> (пример: 20.12.2021)`,
      { parse_mode: "HTML" })
    await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
    return UserModel.findOneAndUpdate({ username }, {
      lastMessageId: messageId,
      messages: [message.message_id]
    }, { new: true })
  }

  const message = await bot.sendMessage(
    chatId,
    `Точка отправления: <b>${ user.currentRoute.from }</b>. \nТочка прибытия: <b>${ user.currentRoute.to }</b>. \nДата: <b>${ text }</b>`,
    { parse_mode: "HTML", reply_markup }
  )

  await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
  return UserModel.findOneAndUpdate(
    { username },
    {
      step: 6,
      lastMessageId: messageId,
      currentRoute: {
        from: user.currentRoute.from,
        to: user.currentRoute.to,
        date
      },
      messages: [message.message_id]

    },
    { new: true })
}

module.exports = setDateStep
