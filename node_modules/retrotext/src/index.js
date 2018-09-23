// Type Definitions

/**
 * @typedef {Object} TextObject
 * @property {string} line1
 * @property {string} line2
 * @property {string} line3
 */

/**
 * @typedef {Object} RetroTextProperties
 * @property {TextObject} text
 * @property {number} backgroundStyle
 * @property {number} textStyle
 */

/**
 * @typedef {Object} ParsedOptions
 * @property {number} bcg
 * @property {number} txt
 * @property {string} text1
 * @property {string} text2
 * @property {string} text3
 */

// Package Dependencies
const superagent = require('superagent')
const cheerio = require('cheerio')

/**
 * Retro Text Generator
 */
class RetroText {
  /**
   * @param {RetroTextProperties} data Default Properties
   */
  constructor (data = {
    text: { line1: '', line2: '', line3: '' },
    backgroundStyle: 3,
    textStyle: 4,
  }) {
    this.setup(data)
  }

  /**
   * Setup Class Variables
   * @param {RetroTextProperties} data Default Properties
   */
  setup (data) {
    /**
     * @type {?TextObject}
     */
    this.text = data.text

    /**
     * @type {?number}
     */
    this.backgroundStyle = data.backgroundStyle

    /**
     * @type {?number}
     */
    this.textStyle = data.textStyle
  }

  /**
   * Set Text for Generation
   * @param {TextObject} text Text Object
   * @returns {RetroText}
   */
  setText (text) {
    this.text = text
    return this
  }

  /**
   * Set Line 1 Text for Generation
   * @param {string} line Line 1 Text
   * @returns {RetroText}
   */
  setLine1 (line) {
    this.text.line1 = line.toString()
    return this
  }

  /**
   * Set Line 2 Text for Generation
   * @param {string} line Line 2 Text
   * @returns {RetroText}
   */
  setLine2 (line) {
    this.text.line2 = line.toString()
    return this
  }

  /**
   * Set Line 3 Text for Generation
   * @param {string} line Line 3 Text
   * @returns {RetroText}
   */
  setLine3 (line) {
    this.text.line3 = line.toString()
    return this
  }

  /**
   * Set a Line's Text for Generation
   * @param {number|string} number Line Number (1 - 3)
   * @param {string} line Line Text
   * @returns {RetroText}
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
        this.text.line1 = line
        break
      case 2:
        this.text.line2 = line
        break
      case 3:
        this.text.line3 = line
        break
    }
    return this
  }

  /**
   * Set the Background Style for the Image
   * @param {number} style Background Style (1 - 5)
   * @returns {RetroText}
   */
  setBackgroundStyle (style) {
    // Error Checks
    if (Number.isNaN(style)) throw new Error('Style is not a Number')
    if (style < 1 || style > 5) throw new Error('Invalid Style Number')

    this.backgroundStyle = style
    return this
  }

  /**
   * Set the Text Style for the Image
   * @param {number} style Text Style (1 - 4)
   * @returns {RetroText}
   */
  setTextStyle (style) {
    // Error Checks
    if (Number.isNaN(style)) throw new Error('Style is not a Number')
    if (style < 1 || style > 4) throw new Error('Invalid Style Number')

    this.textStyle = style
    return this
  }

  /**
   * @private
   * @returns {ParsedOptions}
   */
  get _parsedOptions () {
    return {
      bcg: this.backgroundStyle || 3,
      txt: this.textStyle || 4,
      text1: this.text.line1 || '',
      text2: this.text.line2 || '',
      text3: this.text.line3 || '',
    }
  }

  /**
   * Fetch the URL to the Generated Image
   * @returns {Promise.<string>}
   */
  async fetchURL () {
    let { bcg, txt, text1, text2, text3 } = this._parsedOptions
    let server = Math.floor(Math.random() * 10)
    let data = await superagent.post(`http://photofunia.com/categories/all_effects/retro-wave?server=${server}`)
      .field({ bcg })
      .field({ txt })
      .field({ text1 })
      .field({ text2 })
      .field({ text3 })

    let body = cheerio.load(data.text)
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
    let res = await superagent.get(url)
    return res.body
  }
}

module.exports = RetroText
