const data = require('../src/data/cleaned.json')
const _ = require('lodash')

console.log('length', data.length)
console.log('max Xcumsum', _.maxBy(data, d => d.Xcumsum).Xcumsum)
console.log('min Xcumsumleft', _.minBy(data, d => d.Xcumsumleft).Xcumsumleft)
console.log('max yVal', _.maxBy(data, d => d.Yval).Yval)
console.log('area total', _.sumBy(data, d => d.area))

console.log('sum Yvals', _.sumBy(data, d => d.Yval))

console.log(Object.keys(_.groupBy(data, 'Macro grouping')))
