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

String.prototype.contains = function (str) {
  return this.indexOf(str) !== -1
}

const folder = './screenshots'

const capture = async (url, fileName) => {
  return await Promise.race(
    await new Promise((resolve, reject) => {
      setTimeout(() => reject([false, 'Screenshot timed out']), 45 * 1000)
    }),
    await captureWebsite
      .file(url, fileName, {
        fullPage: true,
        type: 'jpeg',
        quality: '0.8',
        scaleFactor: 1,
        disableAnimations: true,
        timeout: 40,
        overwrite: true,
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      })
      .then(
        () => {
          console.log(`SUCCESS -> Screenshotting ${url}`)
          return [true]
        },
        (e) => {
          console.error(`FAIL -> Screenshotting ${url} REASON -> ${e}`)
          return [false, e]
        },
      ),
  )
}

module.exports = async function (url) {
  console.log(`START -> Screenshotting ${url}`)

  const fileName = `${folder}/${url.hashCode()}.jpeg`

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  let [success, error] = await capture(url, fileName)
  if (!success && !url.contains('www')) {
    const wwwURL = url.slice().replace('https://', 'https://www.')
    console.log(`TENTATIVE -> Screenshotting ${wwwURL}`)
    ;[success, error] = await capture(wwwURL, fileName)
  }

  if (!success && error) {
    throw error
  }

  return fileName
}
