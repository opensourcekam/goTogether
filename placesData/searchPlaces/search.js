'use strict'
const jsonQuery = require('json-query')

/**
 *  This module is using JSON query to search my obsucre places json
 *  https://github.com/mmckegg/json-query
 *  getPlacesByLocation allws you to search any json you provide it with regex
 *
 * @param {object} object - Contains 4 keys
 *  var example = {
 *   json: the json object,
 *   selectAll: used to select data from a database,
 *   where: used to extract only those records that fulfill a specified criterion
 *  }
 *
 * use ~ Search.getPlaces(example)
 * @return {object} - contains the result of your query => {value: 'x', parents: [...], key: 0} ... etc
 *
 */

const search = {
  getPlacesByLocation: (object) => {
    let q = jsonQuery(`[*${object.selectAll}~/${object.where}/i]:`, {
      data: object.json,
      allowRegexp: true
    })
    return q
  } // getPlaces
}

/*
 const obscurePlaces = require('../data/places/atlasObscurePlaces.json')
 console.log(Search.getPlaces({
 json: obscurePlaces,
 selectAll: 'name',
 where: 'New York'
 }).value)
 */

module.exports = search
