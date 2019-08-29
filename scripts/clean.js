const data = require('../src/data/data.json')
const _ = require('lodash')
const fs = require('fs')

const filtered = data
  .filter(d => d.Xwidth > 0)
  .map(d => ({ ...d, area: d.Xwidth * d.Yval }))
console.log('filtered.length', filtered.length)

const jsonContent = JSON.stringify(filtered)
// console.log(jsonContent)

fs.writeFile('src/data/cleaned.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log('An error occured while writing JSON Object to File.')
    return console.log(err)
  }

  console.log('JSON file has been saved.')
})
