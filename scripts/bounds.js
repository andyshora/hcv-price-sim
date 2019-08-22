const data = require('../data/data.json')
const _ = require('lodash')

console.log('length', data.length)
console.log('max Xcumsum', _.maxBy(data, d => d.Xcumsum).Xcumsum)
console.log('min Xcumsumleft', _.minBy(data, d => d.Xcumsumleft).Xcumsumleft)
console.log('max yVal', _.maxBy(data, d => d.Yval).Yval)
