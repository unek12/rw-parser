const TelegramApi = require('node-telegram-bot-api')
const {
  TOKEN,
  SET_ROUTE,
  USER_LAST_ROUTE,
  READY_FIND_ROUTE,
  EDIT_ROUTE,
  EDIT_ROUTE_WITH,
  EDIT_ROUTE_WITH_EDIT,
  SELECT_ROUTE,
  SET_DATE
} = require('../constants')
const createUserStep = require('./steps/createUserStep')
const startStep = require('./steps/startStep')
const setFromToStep = require('./steps/setFromToStep')
const setDateStep = require('./steps/setDateStep')
const setFirstStep = require('./steps/setFirstStep')
const getRoutes = require('./routes/getRoutes')
const getLastRoute = require('./steps/getLastRoute')
const following = require('./routes/followRoutes')
const { getCalendar } = require('./utils/utils')
const UserModel = require('../database/models/Users')
const { getRWRoute } = require('./utils/request')
const bot = new TelegramApi(TOKEN, { polling: true })

const bootstrapService = async () => {
  const followedRoutes = []

  setInterval(() => {
    following(bot, followedRoutes)
  }, 5000)
  await bot.setMyCommands([{ command: '/start', description: 'Перезапуск' }, {
    command: '/info', description: 'Инструкция'
  },])

  bot.on('message', async (msg) => {
    const name = msg.chat.first_name || 'Пользователь';
    const username = msg.chat.username;
    const chatId = msg.chat.id;
    const text = msg.text;

    const messageId = msg.message_id;

    const user = await UserModel.findOne({ username })

    if (user) {
      const { messages } = user

      if (text === '/start') {
        if (user?.lastMessageId) {
          await bot.deleteMessage(chatId, user.lastMessageId).catch(() => console.log('lastMessage'))
        }
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return startStep(bot, user, chatId, messageId)
      }

      if (user.step === 1) {
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return setFromToStep(bot, chatId, messageId, username, text, user.step)
      }

      if (user.step === 2) {
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return setFromToStep(bot, chatId, messageId, username, text, 1)
      }

      if (user.step === 3) {
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return setFromToStep(bot, chatId, messageId, username, text, user.step)
      }

      if (user.step === 4) {
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return setFromToStep(bot, chatId, messageId, username, text, 3)
      }

      if (user.step === 5) {
        if (messages?.length) {
          messages.map(async (message) => await bot.deleteMessage(chatId, message).catch(() => console.log('messages')))
        }
        return setDateStep(bot, user, chatId, messageId, username, text)
      }
      await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
    } else {
      return createUserStep(bot, name, username, chatId, messageId)
    }
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const messageId = msg.message.message_id;
    const username = msg.message.chat.username;
    const botId = msg.message.from.id
    const user = await UserModel.findOne({ username })

    if (data === SET_ROUTE) {
      return setFirstStep(bot, chatId, messageId, username)
    }

    if (data === EDIT_ROUTE) {
      return setFirstStep(bot, chatId, messageId, username)
    }

    if (data === READY_FIND_ROUTE) {
      return getRoutes(bot, botId, user, chatId, messageId)
    }

    if (data === USER_LAST_ROUTE) {
      return getLastRoute(bot, user, chatId, messageId)
    }


    // изменение даты отправления
    if (data.search(SET_DATE) === 0) {
      console.log(data.split('__')[1])


      return 1
    }

    // добовлне в список отслеживаемых
    if (data.search(SELECT_ROUTE + '__') === 0) {
      const trainId = data.split('__')[1]
      const followTrain = { ...user.currentRoute, trainId, chatId }
      followedRoutes.push(followTrain)
      return 1
    }

    if (user.step === 2) {
      const message = await bot.sendMessage(chatId, 'Tеперь введите точку прибытия',);
      await bot.deleteMessage(chatId, messageId)
      return UserModel.findOneAndUpdate({ username }, {
        step: 3, messages: [message.message_id], currentRoute: {
          from: data
        }
      }, { new: true })
    }

    if (user.step === 4) {
      const message = await bot.sendMessage(chatId, `Tеперь осталось ввсети дату. \nВведи дату строго в таком формате: \n<b>дд.мм.гггг</b> (пример: 10.05.2021)`, {
        parse_mode: 'HTML', reply_markup: JSON.stringify({
          inline_keyboard: getCalendar(),
        })
      })
      await bot.deleteMessage(chatId, messageId)

      return UserModel.findOneAndUpdate({ username }, {
        step: 5, messages: [message.message_id], currentRoute: {
          from: user.currentRoute.from, to: data
        }
      }, { new: true })
    }
  })
}


module.exports = bootstrapService;
