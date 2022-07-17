const cheerio = require('cheerio');

const parser = async (html) => {
  const $ = await cheerio.load(html);

  const row = await $('.sch-table__body.js-sort-body')
  const htmlArray = await row.find('.sch-table__row-wrap .sch-table__row').toArray()

  return await htmlArray.map(item => {
    const trainNumber = $(item).find('.sch-table__route .train-number').text()
    const trainRoute = $(item).find('.sch-table__route .train-route').text()
    const trainFromName = $(item).find('.train-from-name').text()
    const trainToName = $(item).find('.train-to-name').text()
    const trainFromTime = $(item).find('.train-from-time').text()
    const trainToTime = $(item).find('.train-to-time').text().trim()
    const trainDurationTime = $(item).find('.train-duration-time').text()
    const hasQuant = !!$(item).find('.sch-table__tickets .has-quant').text()

    const ticketsArray = hasQuant ? $(item).find('.sch-table__tickets .has-quant').toArray() : [];

    const tickets = ticketsArray.map(ticket => {
      return {
        label: $(ticket).find('.sch-table__t-name').text(),
        value: $(ticket).find('.sch-table__t-quant').text(),
        price: $(ticket).find('.ticket-cost').text()
      }
    })

    return {
      trainNumber,
      trainRoute,
      trainFromName,
      trainToName,
      trainFromTime,
      trainToTime,
      trainDurationTime,
      tickets
    }
  })
}

module.exports = parser;
