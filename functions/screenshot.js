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

const capture = async (url) => {
  await captureWebsite
    .file(url, fileName, {
      fullPage: true,
      type: 'jpeg',
      quality: '0.8',
      scaleFactor: 1,
      disableAnimations: true,
      timeout: 60,
      overwrite: true,
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    })
    .then(
      () => {
        console.log(`SUCCESS -> Screenshotting ${url}`)
        return true
      },
      (e) => {
        console.error(`FAIL -> Screenshotting ${url} -> REASON ${e}`)
        return false
      },
    )
}

module.exports = async function (url) {
  console.log(`START -> Screenshotting ${url}`)

  const fileName = `${folder}/${url.hashCode()}.jpeg`

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  let success = capture(url)
  if (!success && !url.contains('www')) {
    console.log(`TENTATIVE -> Screenshotting (WWW) ${url}`)
    success = capture(url.replace('https://', 'https://www'))
  }

  return fileName
}
