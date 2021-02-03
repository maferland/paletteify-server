const vibrant = require('node-vibrant')
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

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST',
}

module.exports = async function (req, res, next) {
  try {
    const {url} = req.body

    const fileName = `./screenshots/${url.hashCode()}.png`

    if (!fs.existsSync(fileName)) {
      await captureWebsite.file(url, fileName, {
        fullPage: true,
      })
    }

    const palette = await vibrant.from(fileName).getPalette()
    const hexPalette = Object.keys(palette).map((key) => {
      const {
        rgb: [r, g, b],
      } = palette[key]
      return {name: key, code: rgbToHex(r, g, b)}
    })

    res.send({
      palette: hexPalette,
    })
  } catch (error) {
    next(error)
  }
}
