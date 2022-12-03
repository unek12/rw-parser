const {setCustomButtons} = require("../utils/utils");

const UserModel = require('../../database/models/Users');
const {getRWRoute} = require('../utils/request');
const {EDIT_ROUTE, EDIT_ROUTE_WITH, EDIT_ROUTE_WITH_EDIT, SELECT_ROUTE} = require('../../constants');

const checkRouteOptions = (title, value, keyboard) => {
    if (keyboard) {
        return {
            "reply_markup": JSON.stringify({
                "keyboard": [
                    [{text: "Yes"}],
                    [{text: "No"}]
                ],
                inline_keyboard: [
                    [{text: title, callback_data: value}],
                ],
            })
        }
    }

    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: title, callback_data: value}],
            ],
        }),
    }
}

const getRoutes = async (bot, botId, user, chatId, messageId) => {
    const { message_id } = await bot.sendMessage(chatId, 'Идет загрузка');
    await bot.deleteMessage(chatId, messageId).catch(() => console.log('lastMessageId'))
    let messageIds = []
    const {from, to, date} = user.currentRoute

    const rwRouteData = await getRWRoute(from, to, date)
    if (!rwRouteData.length) {
        const message = await bot.sendMessage(chatId ,'Не нашел поездов по этому маршруту/времени',{
            reply_markup: checkRouteOptions('Изменить маршрут', EDIT_ROUTE_WITH)}
        );
        await bot.deleteMessage(chatId, message_id).catch(() => console.log('lastMessageId'))
        return UserModel.findOneAndUpdate({username: user.username}, {messages: [message.message_id]}, {new: true})
    }
    for (const {
        trainNumber,
        trainRoute,
        trainFromName,
        trainToName,
        trainFromTime,
        trainToTime,
        trainDurationTime,
        tickets,
    } of rwRouteData) {
        const ticketsTemplate = tickets.map(({label, value, price }) => `${label ? label : 'Сидячий'}: <b>${value}</b> (${price}BYN)`)
        const template = `Поезд: <b>${trainNumber} ${trainRoute}</b>\nМаршрут: <b>${trainFromName} - ${trainToName}</b>  \nВремя: <b>${trainFromTime} - ${trainToTime}</b> \nВремя в пути: ${trainDurationTime}\n\n${ticketsTemplate.join('\n')}`
        const {message_id} = await bot.sendMessage(
            chatId,
            template,
            {
                parse_mode: 'HTML',
                ...checkRouteOptions('Отслеживать маршрут', `${SELECT_ROUTE}__${trainNumber}`)
            });
        messageIds.push(message_id)
    }
    await bot.deleteMessage(chatId, message_id).catch(() => console.log('lastMessageId'))
    return UserModel.findOneAndUpdate({username: user.username}, {lastMessageId: messageId, messages: messageIds}, {new: true})
}

module.exports = getRoutes
