const { get, post } = require('snekfetch')
const cheerio = require('cheerio')

/**
 * Retro Text Generator
 * @typedef {[string, string, string]} Text
 * @typedef {'basicRainbow'|'colorRainbow'|'palmTri'|'palmCircle'|'outlineTri'} BackgroundStyle
 * @typedef {'cyan'|'redOutlined'|'redOutlinedThick'|'chrome'} TextStyle
 */
class RetroText {
  /**
   * @param {Text} text Text Object
   * @param {BackgroundStyle} [backgroundStyle] Background Style
   * @param {TextStyle} [textStyle] Text Style
   */
  constructor (text, backgroundStyle, textStyle) {
    this.text = text
    this.backgroundStyle = backgroundStyle || 'palmTri'
    this.textStyle = textStyle || 'chrome'
  }

  static get backgroundStyles () {
    return {
      basicRainbow: 1,
      colorRainbow: 2,
      palmTri: 3,
      palmCircle: 4,
      outlineTri: 5,
    }
  }

  static get textStyles () {
    return {
      cyan: 1,
      redOutlined: 2,
      redOutlinedThick: 3,
      chrome: 4,
    }
  }

  /**
   * Set Text for Generation
   * @param {Text} text Text Object
   * @returns {this}
   */
  setText (text) {
    this.text = text
    return this
  }

  /**
   * Set text on the top line
   * @param {string} line Line 1 Text
   * @returns {this}
   */
  setLine1 (line) {
    this.text[0] = line.toString()
    return this
  }

  /**
   * Set text on the middle line
   * @param {string} line Line 2 Text
   * @returns {this}
   */
  setLine2 (line) {
    this.text[1] = line.toString()
    return this
  }

  /**
   * Set text on the bottom line
   * @param {string} line Line 3 Text
   * @returns {this}
   */
  setLine3 (line) {
    this.text[2] = line.toString()
    return this
  }

  /**
   * Set a Line's Text for Generation
   * @param {1|2|3} number Line Number
   * @param {string} line Line Text
   * @returns {this}
   */
  setLine (number, line) {
    // Error Checks
    if (Number.isNaN(number)) throw new Error('Line Number is not a Number')
    if (number < 1 || number > 3) throw new Error('Invalid Line Number')

    // Enforce Integer Line Numbers
    if (typeof number === 'string') number = parseInt(number)

    line = line.toString()
    switch (number) {
      case 1:
        return this.setLine1(line)
      case 2:
        return this.setLine2(line)
      case 3:
        return this.setLine3(line)
      default:
        return this
    }
  }

  get backgroundStyleCode () {
    return RetroText.backgroundStyles[this.backgroundStyle] || 3
  }

  /**
   * Set the Background Style for the Image
   * @param {BackgroundStyle} style Background Style
   * @returns {this}
   */
  setBackgroundStyle (style) {
    const styles = Object.keys(RetroText.backgroundStyles)
    if (!styles.includes(style)) throw new Error(`Invalid Background Style. Use one of ${styles}`)

    this.backgroundStyle = style
    return this
  }

  get textStyleCode () {
    return RetroText.textStyles[this.textStyle] || 4
  }

  /**
   * Set the Text Style for the Image
   * @param {TextStyle} style Text Style
   * @returns {this}
   */
  setTextStyle (style) {
    const styles = Object.keys(RetroText.textStyles)
    if (!styles.includes(style)) throw new Error(`Invalid Text Style. Use one of ${styles}`)

    this.textStyle = style
    return this
  }

  /**
   * Fetch the URL to the Generated Image
   * @returns {Promise.<string>}
   */
  async fetchURL () {
    let server = Math.floor(Math.random() * 10)

    let data = await post(`http://photofunia.com/categories/all_effects/retro-wave?server=${server}`)
      .attach('bcg', this.backgroundStyleCode)
      .attach('txt', this.textStyleCode)
      .attach('text1', this.text[0])
      .attach('text2', this.text[1])
      .attach('text3', this.text[2])

    let body = cheerio.load(data.body)
    let url = body('a').filter(function filter () {
      return body(this).text().includes('Large') // eslint-disable-line
    }).attr('href')

    url = url.split('?')[0]
    return url
  }

  /**
   * Fetch the Generated Image as a Buffer Object
   * @returns {Promise.<Buffer>}
   */
  async fetchBuffer () {
    let url = await this.fetchURL()
    let res = await get(url)
    return res.body
  }
}

module.exports = RetroText
