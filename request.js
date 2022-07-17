const axios = require('axios');
const parser = require('./parser');

const getRWParams = async (from) => {
  return axios.get('https://pass.rw.by/ru/ajax/autocomplete/search/', {
    params: {
      term: from,
      limit: 10,
      timestamp: new Date().getTime()
    }
  })
}

const getRWRoute = async (from = 'Минск-Пассажирский', to = 'Ивацевичи', date = '2021-09-10') => {
  const url = encodeURI(`https://pass.rw.by/ru/route/?from=${from}&to=${to}&date=${date}`)
  const { data } = await axios.get(url)
  return parser(data)
}

module.exports = {
  getRWParams,
  getRWRoute,
};
