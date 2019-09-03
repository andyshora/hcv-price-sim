const data = require('../src/data/segtime.json')
const _ = require('lodash')

const total = _.sum(data[0]) + _.sum(data[1]) + _.sum(data[2]) + _.sum(data[3])
console.log('total', total)
