const UserModel = require('./models/Users')
const {getRWRoute} = require('./request')

const following = async (bot, followRoutes) => {
    let index = 0
    if (followRoutes.length) {
        for (const {from, to, date, chatId, trainId} of followRoutes) {
            const rwRouteData = await getRWRoute(from, to, date)
            for (const item of rwRouteData) {
                if (item.trainNumber === trainId) {
                    if (item.tickets.length) {
                        followRoutes.splice(index, 1)
                        index--
                        const {message_id} = await bot.sendMessage(chatId, `билет пояаился ${from}-${to}`)
                        UserModel.findOneAndUpdate({chatId}, {
                            lastMessageId: message_id,
                        }, {new: true})
                    }
                }
            }
            index++
        }
    }
}

module.exports = following