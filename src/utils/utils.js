const { SET_DATE } = require('../../constants')

const setCustomButtons = (buttons) => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    })
  }
}

const getCalendar = (props) => {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const current = props?.year ? new Date(props.year, props.month) : new Date()
  const month = current.getMonth()
  let dayOfWeek = new Date(`${ props.year }-${ month + 1 }-2`).getDay()
  dayOfWeek = dayOfWeek ? dayOfWeek - 2 : 6
  const calendarData = [
    ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    []
  ]
  let week = 1
  for (let i = 0; i < dayOfWeek; i++) {
    calendarData[week][i] = '-'
  }
  for (let i = 0; i < monthDays[month]; i++) {
    calendarData[week][dayOfWeek] = i + 1
    if (dayOfWeek !== 6) {
      dayOfWeek++
    } else {
      dayOfWeek = 0
      week++
      if (i + 1 < monthDays[month]) {
        calendarData.push([])
      }
    }
  }
  if (dayOfWeek !== 0) {
    calendarData.push([])
    for (let i = 0; i < 6 - dayOfWeek; i++) {
      calendarData[week][dayOfWeek] = i + 1
      dayOfWeek++
    }
  }

  const nextYear = month === 11 ? current.getFullYear() + 1 : current.getFullYear()
  const prevYear = month === 0 ? current.getFullYear() - 1 : current.getFullYear()

  const btns = [{ text: '<-', callback_data: `${ SET_DATE }__${ prevYear }.${ month - 1 }` }, {
    text: '->',
    callback_data: `${ SET_DATE }__${ nextYear }.${ month + 1 }`
  }]

  const calendar = calendarData.map(row => {
    return row.map(item => {
      return ({
        text: item,
        callback_data: item !== '-' ? `${ SET_DATE }__${ item }.${ month + 1 }.${ current.getFullYear() }` : item
      })
    })
  })
  calendar.push(btns)
  return calendar
}

module.exports = {
  getCalendar,
  setCustomButtons,
};

