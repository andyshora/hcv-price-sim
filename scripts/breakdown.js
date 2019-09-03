const data = require('../src/data/cleaned.json')
const _ = require('lodash')
const fs = require('fs')

function getShortLabel(label) {
  switch (label) {
    case 'Liver transplant':
      return 'Liver Transplant'
    case 'Hepatocellular carcinoma':
      return 'Liver Cancer'
    case 'Late fibrotic stage (F4)':
      return 'Late Liver Disease'
    case 'Early fibrotic stage (F0-3)':
      return 'Early Liver Disease'
    default:
      return label
  }
}

const stageKeys = Object.keys(_.groupBy(data, 'Macro grouping'))
console.log(stageKeys)

const totalArea = _.sumBy(data, d => d.area)
const areas = stageKeys.map(key => {
  const filtered = data.filter(d => d['Macro grouping'] === key)
  const area = _.sumBy(filtered, d => d.area)
  return { key: getShortLabel(key), area, ratio: area / totalArea }
})

const jsonContent = JSON.stringify(areas)

fs.writeFile('src/data/areas.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log('An error occured while writing JSON Object to File.')
    return console.log(err)
  }

  console.log('JSON file has been saved.')
})
