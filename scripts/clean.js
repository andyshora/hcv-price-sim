const data = require('../src/data/pricepatient.json')
const _ = require('lodash')
const fs = require('fs')
const currency = require('currency.js')

const filtered = data
  .filter(d => d.Xwidth > 0)
  .map(d => ({ ...d, area: currency(d.Yval).multiply(d.Xwidth).value }))
console.log('filtered.length', filtered.length)
console.log(filtered[0])

console.log('area total', _.sumBy(filtered, d => d.area))

const jsonContent = JSON.stringify(filtered)
// console.log(jsonContent)

fs.writeFile('src/data/cleaned.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log('An error occured while writing JSON Object to File.')
    return console.log(err)
  }

  console.log('JSON file has been saved.')
})
