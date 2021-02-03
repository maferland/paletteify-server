const captureWebsite = require('capture-website')
const fs = require('fs')

// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
String.prototype.hashCode = function () {
  var hash = 0
  if (this.length == 0) {
    return hash
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

const folder = './screenshots'

module.exports = async function (req, res, next) {
  try {
    const {url} = req.body

    const fileName = `${folder}/${url.hashCode()}.png`

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }

    if (!fs.existsSync(fileName)) {
      await captureWebsite.file(url, fileName, {
        fullPage: true,
        type: 'jpeg',
        quality: '0.8',
        timeout: 15,
        overwrite: true,
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      })
    }

    res.send({
      fileName,
    })
  } catch (error) {
    next(error)
  }
}
