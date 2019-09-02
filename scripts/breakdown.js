const data = require('../src/data/cleaned.json')
const _ = require('lodash')
const fs = require('fs')

const stageKeys = Object.keys(_.groupBy(data, 'Macro grouping'))

const totalArea = _.sumBy(data, d => d.area)
const areas = stageKeys.map(key => {
  const filtered = data.filter(d => d['Macro grouping'] === key)
  const area = _.sumBy(filtered, d => d.area)
  return { key, area, ratio: area / totalArea }
})

const jsonContent = JSON.stringify(areas.reverse())

fs.writeFile('src/data/areas.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log('An error occured while writing JSON Object to File.')
    return console.log(err)
  }

  console.log('JSON file has been saved.')
})
