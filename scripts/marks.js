const data = require('../src/data/cleaned.json')
const _ = require('lodash')
const fs = require('fs')

const marks = _.uniqBy(data.map(d => ({ value: ~~d.Xcumsumleft })), 'value')

const jsonContent = JSON.stringify({ marks, min: 0, max: _.last(marks).value })

fs.writeFile('src/data/marks.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log('An error occured while writing JSON Object to File.')
    return console.log(err)
  }

  console.log('JSON file has been saved.')
})
