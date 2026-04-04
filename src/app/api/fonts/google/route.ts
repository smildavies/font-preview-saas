import { NextResponse } from 'next/server'

// Fetch Google Fonts metadata from the public endpoint (no API key needed)
export async function GET() {
  try {
    const resp = await fetch('https://fonts.google.com/metadata/fonts', {
      next: { revalidate: 86400 }, // cache for 24 hours
    })
    const text = await resp.text()
    // The response starts with )]}' which needs to be stripped
    const json = JSON.parse(text.replace(/^\)\]\}'?\n?/, ''))

    if (json.familyMetadataList) {
      const fonts = json.familyMetadataList.map((f: { family: string; category: string }) => ({
        family: f.family,
        category: f.category || 'sans-serif',
        variants: ['regular', '700'],
      }))
      return NextResponse.json({ items: fonts })
    }

    return NextResponse.json({ items: [] })
  } catch (e) {
    // Fallback: return a curated list of popular fonts
    const popular = [
      'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway', 'Poppins',
      'Nunito', 'Ubuntu', 'Merriweather', 'Playfair Display', 'PT Sans', 'Rubik',
      'Work Sans', 'Inter', 'Lora', 'Fira Sans', 'Barlow', 'Quicksand', 'Mulish',
      'Noto Sans', 'Josefin Sans', 'Nunito Sans', 'Libre Baskerville', 'Crimson Text',
      'Karla', 'Cabin', 'Arimo', 'Inconsolata', 'Source Code Pro', 'Bitter',
      'DM Sans', 'Space Grotesk', 'Outfit', 'Sora', 'Manrope', 'Plus Jakarta Sans',
      'Archivo', 'Lexend', 'Cormorant Garamond', 'Dancing Script', 'Pacifico',
      'Caveat', 'Great Vibes', 'Lobster', 'Bebas Neue', 'Anton', 'Abril Fatface',
      'Righteous', 'Bangers', 'Fredoka One', 'Permanent Marker', 'Satisfy',
      'Amatic SC', 'Patrick Hand', 'Indie Flower', 'Sacramento', 'Comfortaa',
      'Varela Round', 'Exo 2', 'Kanit', 'Titillium Web', 'Source Sans 3',
      'Noto Serif', 'Roboto Slab', 'Libre Franklin', 'Yanone Kaffeesatz',
      'Hind', 'Dosis', 'Abel', 'Asap', 'Catamaran', 'Overpass',
      'Maven Pro', 'Jost', 'Red Hat Display', 'Spectral', 'Vollkorn',
      'Cormorant', 'Eczar', 'Newsreader', 'Fraunces', 'Gilda Display',
      'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Space Mono', 'Roboto Mono',
      'Zilla Slab', 'Alegreya', 'EB Garamond', 'Cardo', 'Old Standard TT',
      'Philosopher', 'Antic Slab', 'Rokkitt', 'Arvo', 'Crete Round',
      'Signika', 'Prompt', 'Sarabun', 'Assistant', 'Heebo',
      'Questrial', 'Urbanist', 'Albert Sans', 'Figtree', 'Onest',
    ].map(family => {
      let category = 'sans-serif'
      if (/serif|garamond|baskerville|crimson|merriweather|lora|bitter|spectral|vollkorn|cormorant|eczar|newsreader|fraunces|gilda|cardo|old standard|philosopher|antic slab|rokkitt|arvo|crete|zilla|alegreya|eb garamond|noto serif|roboto slab/i.test(family)) category = 'serif'
      if (/mono|code|inconsolata|jetbrains/i.test(family)) category = 'monospace'
      if (/dancing|pacifico|caveat|great vibes|lobster|satisfy|sacramento|patrick hand|indie flower|amatic/i.test(family)) category = 'handwriting'
      if (/bebas|anton|abril|righteous|bangers|fredoka|permanent marker|comfortaa/i.test(family)) category = 'display'
      return { family, category, variants: ['regular', '700'] }
    })

    return NextResponse.json({ items: popular })
  }
}
