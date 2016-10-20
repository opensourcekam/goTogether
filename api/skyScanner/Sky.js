// const config = require('../../config/config.js')
const axios = require('axios')

class Sky {
  constructor(config) {
    this.apiKey = config.skyScanner.apiKey
  }

  getLocals() {
    return axios.get(`http://partners.api.skyscanner.net/apiservices/reference/v1.0/locales?apiKey=${this.apiKey}`)
  }

  getCheapFlights({market, currency, locale, originPlace, destinationPlace, outboundPartialDate, inboundPartialDate}) {
    console.log(`http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${market}/${currency}/${locale}/${originPlace}/${destinationPlace}/${outboundPartialDate}/${inboundPartialDate}?apiKey=${this.apiKey}`)
    return axios.get(`http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${market}/${currency}/${locale}/${originPlace}/${destinationPlace}/${outboundPartialDate}/${inboundPartialDate}?apiKey=${this.apiKey}`)
  }

  getLocationAutoSuggest({q, callback, market, currency, locale}) {
    return axios.get(`http://partners.api.skyscanner.net/apiservices/xd/autosuggest/v1.0/${market}/${currency}/${locale}/?apikey=${this.apiKey}&query=${q}&callback=${callback}`)
  }
}

module.exports = Sky
