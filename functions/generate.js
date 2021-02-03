const vibrant = require('node-vibrant')
const fs = require('fs')

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const folder = './screenshots'

module.exports = async function (fileName) {
  console.log(`Generating palette for ${url} (${fileName})`)

  if (!fs.existsSync(fileName)) {
    throw new Error(`File does not exists ${fileName}`)
  }
  const palette = await vibrant.from(fileName).quality(0.5).getPalette()
  const result = Object.keys(palette).map((key) => {
    const {
      rgb: [r, g, b],
    } = palette[key]
    return {name: key, code: rgbToHex(r, g, b)}
  })

  console.log(`===== We have a winner =====`)
  result.forEach((color) => console.log(`${color.name} - ${color.code}`))
  console.log(`============================`)

  return result
}
