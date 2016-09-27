'use strict'

/**
    This module is using JSON query to search my obsucre places json
    https://github.com/mmckegg/json-query
  */

const obscurePlaces = require('../data/places/atlasobscuraPlaces.json')
const jsonQuery = require('json-query')

class Search {
  /**
   * getPlaces allws you to search any json you provide it with regex
   *
   * @param {object} object - Contains 4 keys
   *  var example = {
   *   json: the json object,
   *   select: used to select data from a database,
   *   where: used to extract only those records that fulfill a specified criterion,
   *   sendBack: used to extract the piece of data from the query you want back
   *  }
   *
   * use ~ Search.getPlaces(example)
   * @return {object} - contains the result of your query => {value: 'x', parents: [...], key: 0} ... etc
   *
   */
  static getPlaces(object) {
      let q = jsonQuery(`[*${object.select}~/${object.where}/i].${object.sendBack}`, {
        data: object.json,
        allowRegexp: true
      })
      return q
    } // getPlaces
}

console.log(Search.getPlaces({
  json: obscurePlaces,
  select: 'name',
  where: 'London',
  sendBack: 'subName'
}))

exports.module = Search
