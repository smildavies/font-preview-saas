'use client'

import { useEffect, useState, useCallback } from 'react'

export type LocalFont = {
  family: string
  fullName: string
  postscriptName: string
  style: string
  familyId: string
}

// Comprehensive font list — every macOS, Windows, Linux, Google, Adobe, and common design font
const COMMON_FONTS = [
  // === macOS System Fonts (all versions) ===
  '.AppleSystemUIFont', 'System Font', 'SF Pro', 'SF Pro Display', 'SF Pro Text', 'SF Pro Rounded',
  'SF Compact', 'SF Compact Display', 'SF Compact Text', 'SF Compact Rounded',
  'SF Mono', 'New York', 'New York Small', 'New York Medium', 'New York Large', 'New York Extra Large',
  'Academy Engraved LET', 'Al Bayan', 'Al Nile', 'Al Tarikh', 'American Typewriter',
  'Andale Mono', 'Apple Braille', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo',
  'Apple Symbols', 'AppleGothic', 'AppleMyungjo', 'Arial', 'Arial Black', 'Arial Hebrew',
  'Arial Hebrew Scholar', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS',
  'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Ayuthaya',
  'Baghdad', 'Bangla MN', 'Bangla Sangam MN', 'Baskerville', 'Beirut', 'Big Caslon',
  'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni Ornaments',
  'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster',
  'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Corsiva Hebrew',
  'Courier', 'Courier New', 'Damascus', 'DecoType Naskh', 'Devanagari MT',
  'Devanagari Sangam MN', 'Didot', 'DIN Alternate', 'DIN Condensed',
  'Diwan Kufi', 'Diwan Thuluth', 'Euphemia UCAS', 'Farah', 'Farisi',
  'Futura', 'Galvji', 'Geeza Pro', 'Geneva', 'Georgia', 'Gill Sans',
  'Grantha Sangam MN', 'Gujarati MT', 'Gujarati Sangam MN', 'GungSeo',
  'Gurmukhi MN', 'Gurmukhi MT', 'Gurmukhi Sangam MN',
  'Heiti SC', 'Heiti TC', 'Helvetica', 'Helvetica Neue', 'Herculanum',
  'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', 'Hiragino Kaku Gothic Std',
  'Hiragino Kaku Gothic StdN', 'Hiragino Maru Gothic Pro', 'Hiragino Maru Gothic ProN',
  'Hiragino Mincho Pro', 'Hiragino Mincho ProN', 'Hiragino Sans', 'Hiragino Sans GB',
  'Hoefler Text', 'Impact', 'InaiMathi', 'Iowan Old Style',
  'ITF Devanagari', 'ITF Devanagari Marathi',
  'Kailasa', 'Kannada MN', 'Kannada Sangam MN', 'Kefa', 'Khmer MN', 'Khmer Sangam MN',
  'Kohinoor Bangla', 'Kohinoor Devanagari', 'Kohinoor Gujarati', 'Kohinoor Telugu',
  'Kokonor', 'Krungthep', 'KufiStandardGK', 'Lao MN', 'Lao Sangam MN',
  'Lucida Grande', 'Luminari',
  'Malayalam MN', 'Malayalam Sangam MN', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif',
  'Mishafi', 'Mishafi Gold', 'Monaco', 'Mshtakan', 'Mukta Mahee',
  'Muna', 'Myanmar MN', 'Myanmar Sangam MN', 'Nadeem',
  'Noto Nastaliq Urdu', 'Noteworthy',
  'Optima', 'Oriya MN', 'Oriya Sangam MN',
  'Palatino', 'Papyrus', 'Party LET', 'PCMyungjo', 'Phosphate', 'PilGi',
  'PingFang HK', 'PingFang SC', 'PingFang TC', 'Plantagenet Cherokee',
  'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption',
  'Raanana', 'Rockwell', 'Sana', 'Sathu', 'Savoye LET',
  'Shree Devanagari 714', 'SignPainter', 'Silom', 'Sinhala MN', 'Sinhala Sangam MN',
  'Skia', 'Snell Roundhand', 'Songti SC', 'Songti TC',
  'STFangsong', 'STHeiti', 'STIXGeneral', 'STIXIntegralsD', 'STIXIntegralsSm',
  'STIXIntegralsUp', 'STIXIntegralsUpD', 'STIXIntegralsUpSm', 'STIXNonUnicode',
  'STIXSizeFiveSym', 'STIXSizeFourSym', 'STIXSizeOneSym', 'STIXSizeThreeSym', 'STIXSizeTwoSym',
  'STIXVariants', 'STKaiti', 'STSong', 'Sukhumvit Set',
  'Symbol', 'Tahoma', 'Tamil MN', 'Tamil Sangam MN',
  'Telugu MN', 'Telugu Sangam MN', 'Thonburi', 'Times', 'Times New Roman',
  'Trebuchet MS', 'Verdana', 'Waseem', 'Webdings', 'Wingdings', 'Wingdings 2', 'Wingdings 3',
  'Zapf Dingbats', 'Zapfino',

  // === Windows System Fonts ===
  'Aptos', 'Bahnschrift', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Calibri Light',
  'Cambria', 'Cambria Math', 'Candara', 'Cascadia Code', 'Cascadia Mono',
  'Century', 'Century Gothic', 'Century Schoolbook', 'Consolas', 'Constantia', 'Corbel',
  'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Garamond',
  'Harrington', 'Javanese Text', 'Leelawadee', 'Leelawadee UI',
  'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax',
  'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode',
  'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS Sans Serif', 'MS Serif',
  'MS UI Gothic', 'MV Boli', 'Magneto', 'Maiandra GD', 'Malgun Gothic',
  'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei',
  'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Tai Le',
  'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti',
  'MingLiU', 'MingLiU-ExtB', 'Mongolian Baiti', 'Myanmar Text',
  'Nirmala UI', 'NSimSun', 'Nyala', 'Palatino Linotype',
  'Plantagenet Cherokee', 'Ravie', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script',
  'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Light',
  'Segoe UI Semibold', 'Segoe UI Semilight', 'Segoe UI Symbol',
  'Showcard Gothic', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Sitka Text',
  'Sitka Banner', 'Sitka Display', 'Sitka Heading', 'Sitka Small', 'Sitka Subheading',
  'Snap ITC', 'Stencil', 'Sylfaen', 'Yu Gothic', 'Yu Gothic UI', 'Yu Mincho',

  // === Windows Additional/Office Fonts ===
  'Abadi', 'Agency FB', 'Algerian', 'Baskerville Old Face', 'Bauhaus 93', 'Bell MT',
  'Berlin Sans FB', 'Bernard MT Condensed', 'Blackadder ITC', 'Bodoni MT',
  'Bodoni MT Black', 'Bodoni MT Condensed', 'Bodoni MT Poster Compressed',
  'Bookshelf Symbol 7', 'Britannic Bold', 'Broadway', 'Brush Script MT',
  'Californian FB', 'Calisto MT', 'Castellar', 'Centaur', 'Colonna MT',
  'Cooper Black', 'Curlz MT', 'Dubai', 'Edwardian Script ITC',
  'Elephant', 'Engravers MT', 'Eras Bold ITC', 'Eras Demi ITC',
  'Eras Light ITC', 'Eras Medium ITC', 'Felix Titling', 'Footlight MT Light',
  'Forte', 'Franklin Gothic Book', 'Franklin Gothic Demi', 'Franklin Gothic Heavy',
  'Freestyle Script', 'French Script MT', 'Gigi', 'Gill Sans MT',
  'Gill Sans MT Condensed', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed',
  'Gloucester MT Extra Condensed', 'Goudy Old Style', 'Goudy Stout',
  'Haettenschweiler', 'Harlow Solid Italic', 'High Tower Text',
  'Imprint MT Shadow', 'Informal Roman', 'Jokerman', 'Juice ITC',
  'Kristen ITC', 'Kunstler Script', 'Leelawadee UI Semilight',
  'Lucida Bright', 'Lucida Sans', 'Maiandra GD', 'Matura MT Script Capitals',
  'Mistral', 'Modern No. 20', 'Monotype Corsiva', 'Monotype Sorts',
  'Niagara Engraved', 'Niagara Solid', 'OCR A Extended', 'Old English Text MT',
  'Onyx', 'Palace Script MT', 'Parchment', 'Perpetua', 'Perpetua Titling MT',
  'Playbill', 'Poor Richard', 'Pristina', 'Rage Italic', 'Rockwell Condensed',
  'Rockwell Extra Bold', 'Script MT Bold', 'Tw Cen MT', 'Tw Cen MT Condensed',
  'Viner Hand ITC', 'Vivaldi', 'Vladimir Script', 'Wide Latin',

  // === Google Fonts (commonly installed) ===
  'Roboto', 'Roboto Condensed', 'Roboto Flex', 'Roboto Mono', 'Roboto Slab', 'Roboto Serif',
  'Open Sans', 'Open Sans Condensed', 'Lato', 'Montserrat', 'Montserrat Alternates',
  'Oswald', 'Raleway', 'Poppins', 'Noto Sans', 'Noto Serif', 'Noto Sans JP',
  'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Color Emoji',
  'Ubuntu', 'Ubuntu Mono', 'Ubuntu Condensed',
  'Playfair Display', 'Playfair Display SC', 'Merriweather', 'Merriweather Sans',
  'PT Sans', 'PT Serif', 'PT Mono',
  'Nunito', 'Nunito Sans', 'Source Sans 3', 'Source Sans Pro', 'Source Serif 4',
  'Source Serif Pro', 'Source Code Pro',
  'Fira Sans', 'Fira Sans Condensed', 'Fira Sans Extra Condensed', 'Fira Code', 'Fira Mono',
  'Inter', 'Inter Tight', 'Work Sans', 'Quicksand', 'Barlow', 'Barlow Condensed',
  'Barlow Semi Condensed', 'Rubik', 'Rubik Mono One',
  'Karla', 'Josefin Sans', 'Josefin Slab', 'Libre Baskerville', 'Libre Franklin',
  'Libre Caslon Text', 'Libre Caslon Display', 'Libre Bodoni',
  'Crimson Text', 'Crimson Pro', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant',
  'EB Garamond', 'Bitter', 'Arvo', 'Cabin', 'Cabin Condensed',
  'Catamaran', 'Comfortaa', 'Dancing Script', 'Exo', 'Exo 2',
  'Great Vibes', 'Inconsolata', 'Indie Flower', 'Lobster', 'Lobster Two',
  'Merienda', 'Pacifico', 'Permanent Marker', 'Sacramento',
  'Satisfy', 'Shadows Into Light', 'Shadows Into Light Two',
  'Tangerine', 'Titan One', 'Abril Fatface', 'Alfa Slab One', 'Anton',
  'Archivo', 'Archivo Black', 'Archivo Narrow', 'Asap', 'Asap Condensed',
  'Bebas Neue', 'Cardo', 'Cinzel', 'Cinzel Decorative',
  'Dosis', 'Encode Sans', 'Encode Sans Condensed', 'Fjalla One',
  'Heebo', 'Hind', 'Hind Madurai', 'Hind Siliguri', 'Hind Vadodara',
  'IBM Plex Sans', 'IBM Plex Sans Condensed', 'IBM Plex Serif', 'IBM Plex Mono', 'IBM Plex Sans Arabic',
  'Kanit', 'Maven Pro', 'Mukta', 'Mukta Vaani',
  'Nanum Gothic', 'Nanum Myeongjo', 'Nanum Gothic Coding',
  'Overpass', 'Overpass Mono', 'Oxygen', 'Oxygen Mono',
  'Philosopher', 'Play', 'Prompt', 'Questrial',
  'Rajdhani', 'Righteous', 'Rokkitt', 'Sarabun',
  'Signika', 'Signika Negative', 'Spectral', 'Spectral SC',
  'Teko', 'Titillium Web', 'Varela', 'Varela Round',
  'Yanone Kaffeesatz', 'Yantramanav', 'Zilla Slab', 'Zilla Slab Highlight',
  'Space Grotesk', 'Space Mono', 'DM Sans', 'DM Serif Display', 'DM Serif Text', 'DM Mono',
  'Manrope', 'Lexend', 'Lexend Deca', 'Outfit', 'Sora', 'Plus Jakarta Sans',
  'Red Hat Display', 'Red Hat Text', 'Red Hat Mono',
  'Atkinson Hyperlegible', 'Albert Sans', 'Figtree', 'Onest',
  'Geist', 'Geist Mono',
  'Bricolage Grotesque', 'Instrument Sans', 'Instrument Serif',
  'Fraunces', 'Newsreader', 'Literata', 'Piazzolla',
  'Aleo', 'Alegreya', 'Alegreya Sans', 'Alegreya Sans SC', 'Alegreya SC',
  'Vollkorn', 'Vollkorn SC', 'Lora', 'Domine',
  'Mulish', 'Jost', 'Commissioner', 'Urbanist', 'Syne',
  'Epilogue', 'Anybody', 'Kumbh Sans',
  'Chivo', 'Chivo Mono', 'Rethink Sans',
  'Noto Emoji', 'Noto Music',
  'Caveat', 'Caveat Brush', 'Kalam', 'Patrick Hand', 'Handlee',
  'Architects Daughter', 'Amatic SC', 'Covered By Your Grace',
  'Just Another Hand', 'Coming Soon', 'Gloria Hallelujah',
  'Rock Salt', 'Reenie Beanie', 'Nothing You Could Do',
  'Homemade Apple', 'La Belle Aurore', 'Cedarville Cursive',

  // === Adobe Fonts (commonly installed) ===
  'Adobe Caslon Pro', 'Adobe Garamond Pro', 'Adobe Jenson Pro', 'Adobe Text Pro',
  'Acumin Pro', 'Acumin Pro Condensed', 'Acumin Pro Extra Condensed', 'Acumin Pro Semi Condensed', 'Acumin Pro Wide',
  'Myriad Pro', 'Myriad Pro Condensed', 'Minion Pro', 'Minion 3',
  'Proxima Nova', 'Proxima Nova Condensed', 'Proxima Soft',
  'Brandon Grotesque', 'Brandon Text',
  'Gotham', 'Gotham Narrow', 'Gotham Condensed', 'Gotham Rounded',
  'Futura PT', 'Futura PT Condensed',
  'Museo Sans', 'Museo Slab', 'Museo Sans Rounded',
  'Neue Haas Grotesk Display', 'Neue Haas Grotesk Text',
  'Freight Text Pro', 'Freight Sans Pro', 'Freight Display Pro',
  'Adelle', 'Adelle Sans', 'Aktiv Grotesk',
  'Avenir LT Std', 'Benton Sans', 'Bernina Sans',
  'Calluna', 'Calluna Sans', 'Chaparral Pro',
  'Cronos Pro', 'Din Next', 'Din Next Rounded',
  'Garamond Premier Pro', 'Kepler Std', 'Kozuka Gothic Pro',
  'Kozuka Mincho Pro', 'Expo Sans Pro', 'FF Meta',
  'FF Din', 'Foco', 'ITC Avant Garde Gothic',
  'ITC Officina Sans', 'ITC Franklin Gothic',
  'Neue Frutiger', 'Neue Helvetica', 'Neutraface',
  'Omnes', 'Ratio', 'Sofia Pro', 'Sole Serif',
  'Supria Sans', 'Trajan Pro', 'Trajan Pro 3',

  // === Design/Professional Fonts ===
  'Helvetica LT', 'Helvetica LT Std', 'Helvetica Neue LT Std',
  'Univers', 'Univers LT Std', 'Frutiger', 'Frutiger LT Std',
  'Akzidenz Grotesk', 'Akzidenz-Grotesk', 'DIN', 'DIN Pro', 'DIN Alternate',
  'Trade Gothic', 'Trade Gothic LT Std', 'Trade Gothic Next',
  'News Gothic', 'News Gothic Std', 'News Gothic MT',
  'Franklin Gothic', 'Franklin Gothic URW',
  'Futura', 'Futura Std', 'Futura LT',
  'Gill Sans', 'Gill Sans MT', 'Gill Sans Nova',
  'Sabon', 'Sabon LT Std', 'Sabon Next',
  'Bembo', 'Bembo Std', 'Electra', 'Electra LT Std',
  'Janson Text', 'Janson Text LT Std',
  'Mrs Eaves', 'Mrs Eaves XL', 'Mr Eaves Sans', 'Mr Eaves Mod',
  'Archer', 'Sentinel', 'Whitney', 'Surveyor',
  'Knockout', 'Mercury Text', 'Chronicle Display', 'Chronicle Text',
  'Ideal Sans', 'Decimal', 'Operator', 'Operator Mono',
  'Atlas Grotesk', 'Atlas Typewriter', 'Graphik', 'Graphik Compact',
  'Circular', 'Circular Std', 'Circular Pro',
  'Cera Pro', 'Cera Round Pro', 'Gilroy',
  'Greycliff CF', 'Recoleta', 'Wotfard',

  // === Monospace / Coding Fonts ===
  'JetBrains Mono', 'Hack', 'Victor Mono', 'Iosevka', 'Input Mono',
  'Berkeley Mono', 'Monaspace Argon', 'Monaspace Krypton', 'Monaspace Neon',
  'Monaspace Radon', 'Monaspace Xenon',
  'Anonymous Pro', 'Dank Mono', 'Fantasque Sans Mono', 'Hasklig',
  'Lilex', 'Maple Mono', 'Monocraft', 'PragmataPro',
  'Recursive', 'Recursive Mono', 'SF Mono', 'SFMono Nerd Font',
  'Ubuntu Mono', 'IBM Plex Mono', 'Red Hat Mono', 'Azeret Mono',

  // === Linux System Fonts ===
  'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif',
  'Liberation Mono', 'Liberation Sans', 'Liberation Serif',
  'Cantarell', 'Droid Sans', 'Droid Sans Mono', 'Droid Serif',
  'Noto Sans CJK', 'Noto Serif CJK',
  'FreeMono', 'FreeSans', 'FreeSerif',
  'URW Bookman', 'URW Gothic', 'URW Palladio',
  'Nimbus Mono L', 'Nimbus Roman No9 L', 'Nimbus Sans L',
]

// Remove duplicates from the list
const UNIQUE_FONTS = [...new Set(COMMON_FONTS)]

// Canvas-based font detection (works in all browsers)
function detectFontsCanvas(): string[] {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return []

  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  const baseFonts = ['monospace', 'sans-serif', 'serif']

  // Get baseline widths
  const baseWidths: Record<string, number> = {}
  for (const base of baseFonts) {
    ctx.font = `${testSize} ${base}`
    baseWidths[base] = ctx.measureText(testString).width
  }

  const detected: string[] = []

  for (const font of UNIQUE_FONTS) {
    let isDetected = false
    for (const base of baseFonts) {
      ctx.font = `${testSize} "${font}", ${base}`
      const width = ctx.measureText(testString).width
      if (width !== baseWidths[base]) {
        isDetected = true
        break
      }
    }
    if (isDetected) {
      detected.push(font)
    }
  }

  return detected
}

export function useLocalFonts() {
  const [fonts, setFonts] = useState<LocalFont[]>([])
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<'api' | 'canvas' | 'none'>('none')

  const detectFonts = useCallback(async () => {
    setLoading(true)

    // Method 1: Local Font Access API (Chrome/Edge only)
    if ('queryLocalFonts' in window) {
      try {
        // @ts-expect-error - queryLocalFonts is not in all TS definitions yet
        const fontData = await window.queryLocalFonts()

        if (fontData.length > 0) {
          const seen = new Set<string>()
          const results: LocalFont[] = []

          for (const font of fontData) {
            if (!seen.has(font.family)) {
              seen.add(font.family)
              results.push({
                family: font.family,
                fullName: font.fullName,
                postscriptName: font.postscriptName,
                style: font.style || 'Regular',
                familyId: `local-${results.length}`,
              })
            }
          }

          results.sort((a, b) => a.family.localeCompare(b.family))
          setFonts(results)
          setMethod('api')
          setLoading(false)
          return
        }
        // API returned 0 fonts (permission denied silently) — fall through to canvas
      } catch {
        // User denied permission or API failed — fall through to canvas
      }
    }

    // Method 2: Canvas-based detection (all browsers, or when API permission denied)
    const detected = detectFontsCanvas()
    const results: LocalFont[] = detected.map((name, i) => ({
      family: name,
      fullName: name,
      postscriptName: name.replace(/\s/g, '-'),
      style: 'Regular',
      familyId: `local-${i}`,
    }))

    setFonts(results)
    setMethod('canvas')
    setLoading(false)
  }, [])

  useEffect(() => {
    detectFonts()
  }, [detectFonts])

  return { fonts, loading, method, refresh: detectFonts, totalCount: fonts.length }
}
