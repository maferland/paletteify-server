const vibrant = require('node-vibrant')
const fs = require('fs')

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

module.exports = async function (url, fileName) {
  console.log(`START -> Generating palette for ${url} (${fileName})`)

  if (!fs.existsSync(fileName)) {
    throw new Error(`File does not exists ${fileName}`)
  }
  const palette = await vibrant
    .from(fileName)
    .quality(0.75)
    .getPalette()
    .catch((e) => {
      console.error(
        `FAIL -> Generating palette for ${url} (${fileName}) REASON -> ${e}`,
      )
      throw e
    })

  console.log(`SUCCESS -> Generating palette for ${url} (${fileName})`)

  return Object.keys(palette).map((key) => {
    const {
      rgb: [r, g, b],
    } = palette[key]
    return {name: key, code: vibrant.Util.rgbToHex(r, g, b)}
  })
}
