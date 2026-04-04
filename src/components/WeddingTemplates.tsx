'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

interface WeddingTemplatesProps {
  fontFamily: string
  allFonts?: { family: string; [key: string]: any }[]
  googleFonts?: { family: string; [key: string]: any }[]
  loadGoogleFont?: (family: string) => void
  onClose: () => void
}

interface WeddingSnapshot {
  selectedTemplate: number
  namesFont: string
  detailsFont: string
  customFields: Record<string, string>
  colorSchemeIdx: number
  useCustomColor: boolean
  customBgColor: string
  customTextColor: string
  customAccentColor: string
  decoStyleIdx: number
}

interface TemplateField {
  label: string
  defaultValue: string
  fontSize: number
  fontWeight?: string
  letterSpacing?: string
  opacity?: number
  role: 'name' | 'detail'
  fontStyle?: string
}

interface Template {
  name: string
  category: string
  fields: TemplateField[]
  bg: string
  textColor: string
  accentColor: string
  border: string
  radius: string
  decoType: string
  cardSize: { w: number; h: number }
}

const TEMPLATES: Template[] = [
  // --- Wedding ---
  {
    name: 'Classic Elegance', category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'Together with their families', fontSize: 11, opacity: 0.55, role: 'detail', letterSpacing: '0.12em' },
      { label: 'Name 1', defaultValue: 'Emma Rose', fontSize: 38, role: 'name' },
      { label: '&', defaultValue: '&', fontSize: 26, opacity: 0.4, role: 'detail', fontStyle: 'italic' },
      { label: 'Name 2', defaultValue: 'James William', fontSize: 38, role: 'name' },
      { label: 'Invite', defaultValue: 'request the pleasure of your company\nat the celebration of their marriage', fontSize: 10, opacity: 0.5, role: 'detail', letterSpacing: '0.08em' },
      { label: 'Date', defaultValue: 'Saturday, the Twenty-First of June\nTwo Thousand and Twenty-Six', fontSize: 13, role: 'detail', letterSpacing: '0.06em' },
      { label: 'Venue', defaultValue: 'The Grand Ballroom\nNew York City', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #fef9f0 0%, #fdf6e9 100%)', textColor: '#3d2c1e', accentColor: '#c9a96e',
    border: '1px solid #e8dcc8', radius: '0', decoType: 'line', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Modern Minimal', category: 'wedding',
    fields: [
      { label: 'Name 1', defaultValue: 'SOPHIA', fontSize: 44, fontWeight: 'bold', letterSpacing: '0.35em', role: 'name' },
      { label: 'and', defaultValue: 'and', fontSize: 18, opacity: 0.4, role: 'detail', fontStyle: 'italic' },
      { label: 'Name 2', defaultValue: 'ALEXANDER', fontSize: 44, fontWeight: 'bold', letterSpacing: '0.35em', role: 'name' },
      { label: 'Date', defaultValue: '06 . 21 . 2026', fontSize: 13, letterSpacing: '0.25em', role: 'detail' },
      { label: 'Venue', defaultValue: 'THE RITZ CARLTON\nNEW YORK CITY', fontSize: 9, letterSpacing: '0.3em', opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)', textColor: '#111111', accentColor: '#999999',
    border: '2px solid #111', radius: '0', decoType: 'thick-line', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Save the Date', category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'SAVE THE DATE', fontSize: 11, letterSpacing: '0.4em', fontWeight: 'bold', role: 'detail' },
      { label: 'Name 1', defaultValue: 'Olivia', fontSize: 40, role: 'name' },
      { label: '&', defaultValue: '&', fontSize: 30, opacity: 0.35, role: 'detail' },
      { label: 'Name 2', defaultValue: 'Ethan', fontSize: 40, role: 'name' },
      { label: 'Date', defaultValue: 'August Fifteenth\nTwo Thousand and Twenty-Six', fontSize: 14, letterSpacing: '0.08em', role: 'detail' },
      { label: 'Location', defaultValue: 'Napa Valley, California', fontSize: 10, opacity: 0.5, role: 'detail', letterSpacing: '0.1em' },
    ],
    bg: 'linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%)', textColor: '#f5f0e8', accentColor: '#c9a96e',
    border: '1px solid rgba(201,169,110,0.3)', radius: '0', decoType: 'diamond', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Romantic Garden', category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'You Are Cordially Invited', fontSize: 11, opacity: 0.6, role: 'detail', fontStyle: 'italic', letterSpacing: '0.08em' },
      { label: 'Name 1', defaultValue: 'Isabella', fontSize: 38, role: 'name' },
      { label: 'Heart', defaultValue: '\u2661', fontSize: 22, opacity: 0.4, role: 'detail' },
      { label: 'Name 2', defaultValue: 'Sebastian', fontSize: 38, role: 'name' },
      { label: 'Date', defaultValue: 'Saturday, June 14th, 2026\nat half past four in the afternoon', fontSize: 11, opacity: 0.6, role: 'detail' },
      { label: 'Venue', defaultValue: 'The Botanical Gardens\nSan Francisco', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #fdf2f8 0%, #fff1f2 100%)', textColor: '#4a1942', accentColor: '#be185d',
    border: '2px solid #f9a8d4', radius: '16px', decoType: 'floral', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Art Deco', category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'THE HONOUR OF YOUR PRESENCE\nIS REQUESTED AT THE MARRIAGE OF', fontSize: 8, letterSpacing: '0.35em', opacity: 0.7, role: 'detail' },
      { label: 'Name 1', defaultValue: 'CHARLOTTE', fontSize: 36, letterSpacing: '0.2em', role: 'name' },
      { label: '&', defaultValue: '&', fontSize: 24, opacity: 0.5, role: 'detail' },
      { label: 'Name 2', defaultValue: 'WILLIAM', fontSize: 36, letterSpacing: '0.2em', role: 'name' },
      { label: 'Date', defaultValue: 'THE TWENTY-FIRST OF JUNE\nNINETEEN HUNDRED HOURS', fontSize: 10, letterSpacing: '0.2em', role: 'detail' },
      { label: 'Venue', defaultValue: 'THE PLAZA HOTEL\nNEW YORK', fontSize: 9, letterSpacing: '0.25em', opacity: 0.6, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', textColor: '#d4af37', accentColor: '#d4af37',
    border: '2px solid #d4af37', radius: '0', decoType: 'deco', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Rustic Charm', category: 'wedding',
    fields: [
      { label: 'Header', defaultValue: 'Join us as we say I do', fontSize: 12, opacity: 0.6, role: 'detail', fontStyle: 'italic' },
      { label: 'Name 1', defaultValue: 'Hannah', fontSize: 36, role: 'name' },
      { label: 'and', defaultValue: 'and', fontSize: 18, opacity: 0.4, role: 'detail', fontStyle: 'italic' },
      { label: 'Name 2', defaultValue: 'Noah', fontSize: 36, role: 'name' },
      { label: 'Date', defaultValue: 'September 12, 2026 at 4:00 PM', fontSize: 12, role: 'detail' },
      { label: 'Venue', defaultValue: 'Willow Creek Ranch\nAustin, Texas', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #fefce8 0%, #fef3c7 100%)', textColor: '#451a03', accentColor: '#92400e',
    border: '2px dashed #d97706', radius: '8px', decoType: 'leaf', cardSize: { w: 5, h: 7 },
  },
  // --- Party ---
  {
    name: 'Birthday Bash', category: 'party',
    fields: [
      { label: 'Header', defaultValue: "YOU'RE INVITED TO", fontSize: 9, letterSpacing: '0.3em', opacity: 0.6, role: 'detail' },
      { label: 'Name', defaultValue: "Ava's", fontSize: 38, role: 'name' },
      { label: 'Event', defaultValue: 'Birthday Party!', fontSize: 24, role: 'name' },
      { label: 'Date', defaultValue: 'Saturday, March 15th', fontSize: 12, role: 'detail' },
      { label: 'Time', defaultValue: '2:00 PM - 5:00 PM', fontSize: 11, opacity: 0.65, role: 'detail' },
      { label: 'Location', defaultValue: 'Sunshine Park Pavilion\n123 Oak Street', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5d0fe 100%)', textColor: '#831843', accentColor: '#ec4899',
    border: '2px solid #f9a8d4', radius: '16px', decoType: 'confetti', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Baby Shower', category: 'party',
    fields: [
      { label: 'Header', defaultValue: 'PLEASE JOIN US FOR A', fontSize: 9, letterSpacing: '0.3em', opacity: 0.6, role: 'detail' },
      { label: 'Event', defaultValue: 'Baby Shower', fontSize: 32, role: 'name' },
      { label: 'Honoring', defaultValue: 'honoring', fontSize: 11, opacity: 0.45, role: 'detail', fontStyle: 'italic' },
      { label: 'Name', defaultValue: 'Sarah & David', fontSize: 24, role: 'name' },
      { label: 'Date', defaultValue: 'Sunday, April 20th at 2:00 PM', fontSize: 11, role: 'detail' },
      { label: 'Location', defaultValue: 'The Garden Room\n456 Elm Avenue', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', textColor: '#064e3b', accentColor: '#34d399',
    border: '2px solid #a7f3d0', radius: '16px', decoType: 'dots', cardSize: { w: 5, h: 7 },
  },
  {
    name: 'Graduation', category: 'party',
    fields: [
      { label: 'Header', defaultValue: 'CELEBRATE WITH US', fontSize: 9, letterSpacing: '0.35em', opacity: 0.6, role: 'detail' },
      { label: 'Name', defaultValue: 'Michael Chen', fontSize: 34, role: 'name' },
      { label: 'Event', defaultValue: 'Class of 2026', fontSize: 18, opacity: 0.7, role: 'detail', letterSpacing: '0.15em' },
      { label: 'Degree', defaultValue: 'Bachelor of Computer Science', fontSize: 12, role: 'detail' },
      { label: 'Date', defaultValue: 'Saturday, May 30th at 6:00 PM', fontSize: 11, role: 'detail' },
      { label: 'Venue', defaultValue: 'The Faculty Club\nStanford University', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', textColor: '#e0e7ff', accentColor: '#818cf8',
    border: '2px solid rgba(129,140,248,0.3)', radius: '12px', decoType: 'stars', cardSize: { w: 5, h: 7 },
  },
  // --- Menu ---
  {
    name: 'Dinner Menu', category: 'menu',
    fields: [
      { label: 'Header', defaultValue: 'MENU', fontSize: 16, letterSpacing: '0.5em', fontWeight: 'bold', role: 'name' },
      { label: 'Course 1', defaultValue: 'First Course', fontSize: 11, letterSpacing: '0.2em', opacity: 0.45, role: 'detail' },
      { label: 'Dish 1', defaultValue: 'Heirloom Tomato Gazpacho\nwith basil oil & croutons', fontSize: 12, role: 'detail' },
      { label: 'Course 2', defaultValue: 'Main Course', fontSize: 11, letterSpacing: '0.2em', opacity: 0.45, role: 'detail' },
      { label: 'Dish 2', defaultValue: 'Pan-Seared Chilean Sea Bass\nwith lemon beurre blanc', fontSize: 12, role: 'detail' },
      { label: 'Course 3', defaultValue: 'Dessert', fontSize: 11, letterSpacing: '0.2em', opacity: 0.45, role: 'detail' },
      { label: 'Dish 3', defaultValue: 'Vanilla Bean Crème Brûlée\nwith fresh berries', fontSize: 12, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 100%)', textColor: '#422006', accentColor: '#a16207',
    border: '1px solid #e5d5a0', radius: '0', decoType: 'line', cardSize: { w: 4, h: 9 },
  },
  {
    name: 'Cocktail Menu', category: 'menu',
    fields: [
      { label: 'Header', defaultValue: 'COCKTAILS', fontSize: 14, letterSpacing: '0.5em', fontWeight: 'bold', role: 'name' },
      { label: 'Drink 1', defaultValue: 'Lavender Fizz', fontSize: 13, role: 'name' },
      { label: 'Desc 1', defaultValue: 'Gin, lavender syrup, lemon, prosecco', fontSize: 10, opacity: 0.5, role: 'detail' },
      { label: 'Drink 2', defaultValue: 'Sunset Boulevard', fontSize: 13, role: 'name' },
      { label: 'Desc 2', defaultValue: 'Tequila, blood orange, agave, chili rim', fontSize: 10, opacity: 0.5, role: 'detail' },
      { label: 'Drink 3', defaultValue: 'Garden Party', fontSize: 13, role: 'name' },
      { label: 'Desc 3', defaultValue: 'Vodka, cucumber, elderflower, mint', fontSize: 10, opacity: 0.5, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #1a1a2e 0%, #0f172a 100%)', textColor: '#e2e8f0', accentColor: '#94a3b8',
    border: '1px solid rgba(148,163,184,0.2)', radius: '0', decoType: 'line', cardSize: { w: 4, h: 9 },
  },
  // --- RSVP ---
  {
    name: 'RSVP Card', category: 'rsvp',
    fields: [
      { label: 'Header', defaultValue: 'RSVP', fontSize: 18, letterSpacing: '0.4em', role: 'name' },
      { label: 'Instruction', defaultValue: 'Kindly respond by June 1st, 2026', fontSize: 11, opacity: 0.6, role: 'detail', fontStyle: 'italic' },
      { label: 'Line 1', defaultValue: 'M ___________________________', fontSize: 12, role: 'detail' },
      { label: 'Accept', defaultValue: 'Joyfully Accepts', fontSize: 11, role: 'detail' },
      { label: 'Decline', defaultValue: 'Respectfully Declines', fontSize: 11, role: 'detail' },
      { label: 'Meal', defaultValue: 'Meal Preference: Beef / Fish / Vegetarian', fontSize: 10, opacity: 0.6, role: 'detail' },
    ],
    bg: 'linear-gradient(180deg, #fef9f0 0%, #fdf6e9 100%)', textColor: '#3d2c1e', accentColor: '#c9a96e',
    border: '1px solid #e8dcc8', radius: '0', decoType: 'line', cardSize: { w: 5, h: 3.5 },
  },
  {
    name: 'Thank You', category: 'rsvp',
    fields: [
      { label: 'Header', defaultValue: 'Thank You', fontSize: 34, role: 'name' },
      { label: 'Message', defaultValue: 'Your presence at our celebration\nmade the day even more special', fontSize: 12, opacity: 0.6, role: 'detail', fontStyle: 'italic' },
      { label: 'Names', defaultValue: 'With love,\nEmma & James', fontSize: 14, role: 'name' },
      { label: 'Date', defaultValue: 'June 21, 2026', fontSize: 10, opacity: 0.5, role: 'detail', letterSpacing: '0.1em' },
    ],
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', textColor: '#14532d', accentColor: '#16a34a',
    border: '1px solid #bbf7d0', radius: '12px', decoType: 'leaf', cardSize: { w: 5, h: 3.5 },
  },
  // --- Business ---
  {
    name: 'Clean Professional', category: 'business',
    fields: [
      { label: 'Name', defaultValue: 'John Smith', fontSize: 16, role: 'name' },
      { label: 'Title', defaultValue: 'Senior Designer', fontSize: 10, role: 'detail' },
      { label: 'Company', defaultValue: 'Acme Studio', fontSize: 11, role: 'name' },
      { label: 'Phone', defaultValue: '(555) 123-4567', fontSize: 9, role: 'detail' },
      { label: 'Email', defaultValue: 'john@acmestudio.com', fontSize: 9, role: 'detail' },
      { label: 'Website', defaultValue: 'www.acmestudio.com', fontSize: 9, role: 'detail' },
    ],
    bg: '#ffffff', textColor: '#1a1a1a', accentColor: '#1e40af',
    border: '1px solid #e5e7eb', radius: '0', decoType: 'line', cardSize: { w: 3.5, h: 2 },
  },
  {
    name: 'Bold Modern', category: 'business',
    fields: [
      { label: 'Name', defaultValue: 'Jane Doe', fontSize: 15, fontWeight: 'bold', role: 'name' },
      { label: 'Title', defaultValue: 'Creative Director', fontSize: 9, role: 'detail' },
      { label: 'Company', defaultValue: 'AURORA AGENCY', fontSize: 10, letterSpacing: '0.2em', role: 'name' },
      { label: 'Phone', defaultValue: '(555) 987-6543', fontSize: 8, role: 'detail' },
      { label: 'Email', defaultValue: 'jane@aurora.agency', fontSize: 8, role: 'detail' },
    ],
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)', textColor: '#f1f5f9', accentColor: '#d4af37',
    border: '1px solid rgba(212,175,55,0.3)', radius: '0', decoType: 'line', cardSize: { w: 3.5, h: 2 },
  },
  {
    name: 'Creative Minimal', category: 'business',
    fields: [
      { label: 'Name', defaultValue: 'Alex Rivera', fontSize: 15, role: 'name' },
      { label: 'Title', defaultValue: 'UX Designer', fontSize: 9, fontStyle: 'italic', role: 'detail' },
      { label: 'Company', defaultValue: 'Pixel & Co', fontSize: 10, role: 'name' },
      { label: 'Phone', defaultValue: '(555) 246-8135', fontSize: 8, role: 'detail' },
      { label: 'Email', defaultValue: 'alex@pixelco.design', fontSize: 8, role: 'detail' },
    ],
    bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', textColor: '#1e293b', accentColor: '#0d9488',
    border: '1px solid #e2e8f0', radius: '8px', decoType: 'line', cardSize: { w: 3.5, h: 2 },
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'party', label: 'Party' },
  { id: 'menu', label: 'Menu' },
  { id: 'rsvp', label: 'RSVP & More' },
  { id: 'business', label: 'Business' },
]

const COLOR_SCHEMES = [
  { name: 'Ivory Gold', bg: 'linear-gradient(180deg, #fef9f0, #fdf6e9)', text: '#3d2c1e', accent: '#c9a96e' },
  { name: 'Pure White', bg: 'linear-gradient(180deg, #ffffff, #fafafa)', text: '#111111', accent: '#999999' },
  { name: 'Midnight', bg: 'linear-gradient(135deg, #2d3436, #1a1a2e)', text: '#f5f0e8', accent: '#c9a96e' },
  { name: 'Blush', bg: 'linear-gradient(180deg, #fdf2f8, #fff1f2)', text: '#4a1942', accent: '#be185d' },
  { name: 'Sage', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', text: '#064e3b', accent: '#34d399' },
  { name: 'Navy Gold', bg: 'linear-gradient(180deg, #1a1a2e, #16213e)', text: '#d4af37', accent: '#d4af37' },
  { name: 'Dusty Rose', bg: 'linear-gradient(180deg, #fff1f2, #ffe4e6)', text: '#881337', accent: '#e11d48' },
  { name: 'Ocean', bg: 'linear-gradient(135deg, #0c4a6e, #164e63)', text: '#e0f2fe', accent: '#38bdf8' },
  { name: 'Lavender', bg: 'linear-gradient(180deg, #f5f3ff, #ede9fe)', text: '#3b0764', accent: '#8b5cf6' },
  { name: 'Champagne', bg: 'linear-gradient(180deg, #fffbeb, #fef3c7)', text: '#451a03', accent: '#d97706' },
  { name: 'Moody Dark', bg: 'linear-gradient(180deg, #18181b, #09090b)', text: '#fafafa', accent: '#a1a1aa' },
  { name: 'Terracotta', bg: 'linear-gradient(180deg, #fef2f2, #fee2e2)', text: '#7f1d1d', accent: '#dc2626' },
]

const DECO_STYLES = [
  { name: 'Minimal', type: 'line' },
  { name: 'Ornate', type: 'floral' },
  { name: 'Art Deco', type: 'deco' },
  { name: 'Dots', type: 'dots' },
]

// ============================================================
// Professional AI Font Pairing Engine
// Based on real-world invitation, menu & event design principles
// ============================================================

interface FontProfile {
  cls: string
  weight: string
  width: string
  era: string
  personality: string[]
}

const FONT_PROFILES: Record<string, FontProfile> = {
  'Arial':              { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'clean'] },
  'Arial Black':        { cls: 'sans-serif', weight: 'heavy', width: 'normal', era: 'modern', personality: ['bold', 'impactful'] },
  'Arial Narrow':       { cls: 'sans-serif', weight: 'regular', width: 'condensed', era: 'modern', personality: ['compact', 'efficient'] },
  'Avenir':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'elegant'] },
  'Avenir Next':        { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['refined', 'versatile'] },
  'Calibri':            { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['warm', 'friendly'] },
  'Century Gothic':     { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'clean'] },
  'Futura':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['geometric', 'forward'] },
  'Geneva':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'system'] },
  'Gill Sans':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['humanist', 'British'] },
  'Helvetica':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'Swiss'] },
  'Helvetica Neue':     { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['neutral', 'refined'] },
  'Impact':             { cls: 'display', weight: 'heavy', width: 'condensed', era: 'modern', personality: ['bold', 'impactful'] },
  'Inter':              { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['UI', 'readable'] },
  'Lato':               { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['warm', 'friendly'] },
  'Lucida Grande':      { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['friendly', 'readable'] },
  'Montserrat':         { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'versatile'] },
  'Open Sans':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['friendly', 'readable'] },
  'Optima':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'humanist'] },
  'Oswald':             { cls: 'display', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['condensed', 'editorial'] },
  'Poppins':            { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['geometric', 'clean'] },
  'Raleway':            { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['elegant', 'thin'] },
  'Roboto':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['mechanical', 'versatile'] },
  'Segoe UI':           { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['friendly', 'readable'] },
  'Source Sans Pro':    { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'humanist'] },
  'Tahoma':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['compact', 'readable'] },
  'Trebuchet MS':       { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['dynamic', 'web'] },
  'Verdana':            { cls: 'sans-serif', weight: 'regular', width: 'wide', era: 'modern', personality: ['readable', 'web'] },
  'Work Sans':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'professional'] },
  'Nunito':             { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'friendly'] },
  'Nunito Sans':        { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['clean', 'readable'] },
  'Josefin Sans':       { cls: 'sans-serif', weight: 'light', width: 'normal', era: 'contemporary', personality: ['elegant', 'geometric'] },
  'Rubik':              { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['rounded', 'friendly'] },
  'Fira Sans':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'technical'] },
  'Franklin Gothic':    { cls: 'sans-serif', weight: 'bold', width: 'normal', era: 'transitional', personality: ['editorial', 'strong'] },
  'Archivo':            { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['grotesque', 'editorial'] },
  'Archivo Black':      { cls: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['bold', 'impactful'] },
  'PT Sans':            { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Noto Sans':          { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['neutral', 'readable'] },
  'IBM Plex Sans':      { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'readable'] },
  // Serif
  'Baskerville':        { cls: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'literary'] },
  'Bodoni':             { cls: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['high-contrast', 'fashion'] },
  'Book Antiqua':       { cls: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['book', 'readable'] },
  'Cambria':            { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Caslon':             { cls: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['traditional', 'literary'] },
  'Crimson Text':       { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'elegant'] },
  'Didot':              { cls: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['high-contrast', 'fashion'] },
  'Garamond':           { cls: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['elegant', 'literary'] },
  'Georgia':            { cls: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['readable', 'web'] },
  'Lora':               { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['calligraphic', 'elegant'] },
  'Merriweather':       { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'friendly'] },
  'Palatino':           { cls: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'literary'] },
  'Playfair Display':   { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['high-contrast', 'editorial'] },
  'Source Serif Pro':   { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Times New Roman':    { cls: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['traditional', 'neutral'] },
  'Libre Baskerville':  { cls: 'serif', weight: 'regular', width: 'normal', era: 'transitional', personality: ['elegant', 'web'] },
  'Cardo':              { cls: 'serif', weight: 'regular', width: 'normal', era: 'classical', personality: ['literary', 'academic'] },
  'Cormorant Garamond': { cls: 'serif', weight: 'light', width: 'normal', era: 'classical', personality: ['elegant', 'display'] },
  'Bitter':             { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['slab', 'readable'] },
  'Noto Serif':         { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['neutral', 'readable'] },
  'PT Serif':           { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['readable', 'professional'] },
  'Roboto Slab':        { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['slab', 'mechanical'] },
  'Rockwell':           { cls: 'serif', weight: 'bold', width: 'normal', era: 'modern', personality: ['slab', 'sturdy'] },
  'Copperplate':        { cls: 'serif', weight: 'regular', width: 'normal', era: 'modern', personality: ['engraved', 'formal'] },
  'IBM Plex Serif':     { cls: 'serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'readable'] },
  'Abril Fatface':      { cls: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['editorial', 'dramatic'] },
  // Script
  'Dancing Script':     { cls: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['flowing', 'fun'] },
  'Pacifico':           { cls: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['retro', 'fun'] },
  'Great Vibes':        { cls: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['calligraphic', 'elegant'] },
  'Sacramento':         { cls: 'script', weight: 'light', width: 'normal', era: 'contemporary', personality: ['thin', 'elegant'] },
  'Satisfy':            { cls: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['casual', 'fun'] },
  'Allura':             { cls: 'script', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['calligraphic', 'romantic'] },
  'Lobster':            { cls: 'script', weight: 'bold', width: 'normal', era: 'contemporary', personality: ['retro', 'bold'] },
  // Display
  'Bebas Neue':         { cls: 'display', weight: 'regular', width: 'condensed', era: 'contemporary', personality: ['narrow', 'display'] },
  'Fjalla One':         { cls: 'display', weight: 'bold', width: 'condensed', era: 'contemporary', personality: ['condensed', 'strong'] },
  'Righteous':          { cls: 'display', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['retro', 'funky'] },
  'Anton':              { cls: 'display', weight: 'heavy', width: 'condensed', era: 'contemporary', personality: ['bold', 'impactful'] },
  'Passion One':        { cls: 'display', weight: 'bold', width: 'normal', era: 'contemporary', personality: ['bold', 'impactful'] },
  'Bangers':            { cls: 'display', weight: 'heavy', width: 'normal', era: 'contemporary', personality: ['comic', 'playful'] },
  // Monospace
  'Courier New':        { cls: 'monospace', weight: 'regular', width: 'normal', era: 'modern', personality: ['traditional', 'typewriter'] },
  'Consolas':           { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'readable'] },
  'Fira Code':          { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'ligatures'] },
  'Fira Mono':          { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'readable'] },
  'JetBrains Mono':     { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'readable'] },
  'Source Code Pro':    { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['code', 'professional'] },
  'IBM Plex Mono':      { cls: 'monospace', weight: 'regular', width: 'normal', era: 'contemporary', personality: ['corporate', 'code'] },
}

const KEYWORD_RULES: { kw: string[]; profile: Partial<FontProfile> }[] = [
  { kw: ['mono', 'code', 'console', 'terminal', 'courier'], profile: { cls: 'monospace', personality: ['technical', 'code'] } },
  { kw: ['script', 'cursive', 'calligraph'], profile: { cls: 'script', personality: ['calligraphic', 'elegant'] } },
  { kw: ['hand', 'writing', 'handlee', 'finger'], profile: { cls: 'script', personality: ['handwritten', 'casual'] } },
  { kw: ['brush', 'paint', 'ink'], profile: { cls: 'script', personality: ['brush', 'artistic'] } },
  { kw: ['dance', 'dancing', 'lobster', 'pacifico', 'satisfy', 'sacramento'], profile: { cls: 'script', personality: ['flowing', 'fun'] } },
  { kw: ['display', 'poster', 'banner', 'headline'], profile: { cls: 'display', personality: ['display', 'impactful'] } },
  { kw: ['decorat', 'ornament', 'fancy'], profile: { cls: 'display', personality: ['decorative', 'ornate'] } },
  { kw: ['comic', 'cartoon', 'fun', 'playful'], profile: { cls: 'display', personality: ['comic', 'playful'] } },
  { kw: ['slab'], profile: { cls: 'display', personality: ['slab', 'sturdy'] } },
  { kw: ['retro', 'vintage', 'classic', 'old'], profile: { cls: 'display', personality: ['vintage', 'nostalgic'] } },
  { kw: ['garamond', 'caslon', 'jenson'], profile: { cls: 'serif', personality: ['elegant', 'literary'] } },
  { kw: ['baskerville', 'didot', 'bodoni'], profile: { cls: 'serif', personality: ['high-contrast', 'refined'] } },
  { kw: ['times', 'georgia', 'palatino'], profile: { cls: 'serif', personality: ['readable', 'classic'] } },
  { kw: ['serif', 'roman'], profile: { cls: 'serif', personality: ['traditional', 'readable'] } },
  { kw: ['book', 'text', 'reading'], profile: { cls: 'serif', personality: ['book', 'readable'] } },
  { kw: ['black', 'heavy', 'ultra', 'fat'], profile: { weight: 'heavy', personality: ['impactful'] } },
  { kw: ['bold', 'strong'], profile: { weight: 'bold', personality: ['strong'] } },
  { kw: ['light', 'thin', 'hairline'], profile: { weight: 'light', personality: ['delicate'] } },
  { kw: ['condensed', 'narrow', 'compressed'], profile: { width: 'condensed', personality: ['compact'] } },
  { kw: ['wide', 'extended', 'expanded'], profile: { width: 'wide', personality: ['expansive'] } },
  { kw: ['round', 'soft'], profile: { personality: ['rounded', 'friendly'] } },
  { kw: ['grotesque', 'grotesk', 'gothic'], profile: { cls: 'sans-serif', personality: ['grotesque', 'editorial'] } },
  { kw: ['geometric', 'geo'], profile: { cls: 'sans-serif', personality: ['geometric', 'modern'] } },
  { kw: ['humanist'], profile: { cls: 'sans-serif', personality: ['humanist', 'warm'] } },
  { kw: ['wedding', 'love', 'heart', 'bridal'], profile: { cls: 'script', personality: ['romantic', 'wedding'] } },
  { kw: ['tech', 'digital', 'cyber', 'pixel'], profile: { personality: ['tech', 'modern'] } },
  { kw: ['elegant', 'luxury', 'premium', 'royal'], profile: { personality: ['elegant', 'luxurious'] } },
]

function getFontProfile(name: string): FontProfile {
  const direct = FONT_PROFILES[name]
  if (direct) return direct
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(FONT_PROFILES)) {
    if (key.toLowerCase() === lower) return val
  }
  const profile: FontProfile = { cls: 'sans-serif', weight: 'regular', width: 'normal', era: 'contemporary', personality: [] }
  let clsSet = false
  for (const rule of KEYWORD_RULES) {
    if (rule.kw.some(kw => lower.includes(kw))) {
      if (rule.profile.cls && !clsSet) { profile.cls = rule.profile.cls; clsSet = true }
      if (rule.profile.weight) profile.weight = rule.profile.weight
      if (rule.profile.width) profile.width = rule.profile.width
      if (rule.profile.personality) {
        for (const p of rule.profile.personality) { if (!profile.personality.includes(p)) profile.personality.push(p) }
      }
    }
  }
  if (profile.personality.length === 0) {
    const defaults: Record<string, string[]> = { 'sans-serif': ['clean', 'modern'], 'serif': ['traditional', 'readable'], 'monospace': ['technical', 'structured'], 'script': ['artistic', 'expressive'], 'display': ['eye-catching', 'bold'] }
    profile.personality = defaults[profile.cls] || ['clean', 'modern']
  }
  return profile
}

function classifyFont(name: string): string {
  return getFontProfile(name).cls
}

// Harmony scoring engine
function calculateHarmony(source: FontProfile, target: FontProfile): number {
  let score = 50
  const cc: Record<string, Record<string, number>> = {
    'serif': { 'sans-serif': 25, 'monospace': 10, 'script': 5, 'display': 8, 'serif': -5 },
    'sans-serif': { 'serif': 25, 'monospace': 12, 'script': 15, 'display': 10, 'sans-serif': -5 },
    'display': { 'sans-serif': 22, 'serif': 18, 'monospace': 8, 'script': -10, 'display': -15 },
    'script': { 'sans-serif': 22, 'serif': 15, 'monospace': 10, 'display': -5, 'script': -20 },
    'monospace': { 'sans-serif': 20, 'serif': 15, 'script': 5, 'display': 8, 'monospace': -10 },
  }
  score += (cc[source.cls]?.[target.cls]) || 0
  if (source.weight !== target.weight) score += 8
  if ((source.weight === 'heavy' || source.weight === 'bold') && target.weight === 'regular') score += 5
  const eras = ['classical', 'transitional', 'modern', 'contemporary']
  const eraGap = Math.abs(eras.indexOf(source.era) - eras.indexOf(target.era))
  if (eraGap <= 1) score += 8; else if (eraGap >= 3) score -= 5
  if (source.width !== target.width) score += 5
  const shared = (source.personality || []).filter(p => (target.personality || []).includes(p))
  score += shared.length * 4
  const complements: [string, string][] = [['geometric', 'humanist'], ['elegant', 'readable'], ['editorial', 'readable'], ['modern', 'classical'], ['bold', 'delicate'], ['industrial', 'elegant'], ['tech', 'humanist'], ['formal', 'casual'], ['warm', 'clean']]
  for (const [a, b] of complements) {
    if (((source.personality || []).includes(a) && (target.personality || []).includes(b)) || ((source.personality || []).includes(b) && (target.personality || []).includes(a))) score += 6
  }
  return Math.max(30, Math.min(98, score))
}

// Wedding-specific pairing rules from real invitation design
const WEDDING_PAIR_RULES = [
  { namesCls: 'script', detailsCls: 'serif', style: 'Elegant & Timeless', desc: 'Script names with serif details — the most classic invitation look', boost: 25 },
  { namesCls: 'script', detailsCls: 'sans-serif', style: 'Romantic & Modern', desc: 'Flowing script names grounded by clean sans-serif details', boost: 22 },
  { namesCls: 'serif', detailsCls: 'sans-serif', style: 'Sophisticated & Clean', desc: 'Refined serif headings with modern detail text', boost: 20 },
  { namesCls: 'sans-serif', detailsCls: 'serif', style: 'Contemporary Classic', desc: 'Bold modern names paired with traditional serif details', boost: 18 },
  { namesCls: 'display', detailsCls: 'sans-serif', style: 'Statement & Minimal', desc: 'Eye-catching display names with understated details', boost: 15 },
  { namesCls: 'display', detailsCls: 'serif', style: 'Dramatic & Refined', desc: 'Bold display font balanced by classic serif details', boost: 14 },
  { namesCls: 'serif', detailsCls: 'serif', style: 'All-Classic', desc: 'Contrasting serif weights create hierarchy', boost: 8 },
  { namesCls: 'sans-serif', detailsCls: 'sans-serif', style: 'Ultra Modern', desc: 'Weight & size differences create the contrast', boost: 6 },
]

// 37 curated real-world wedding font combinations
const WEDDING_CURATED = [
  { names: 'Great Vibes', details: 'Lato', style: 'Elegant & Timeless' },
  { names: 'Great Vibes', details: 'Garamond', style: 'Elegant & Timeless' },
  { names: 'Dancing Script', details: 'Open Sans', style: 'Romantic & Modern' },
  { names: 'Dancing Script', details: 'Lato', style: 'Romantic & Modern' },
  { names: 'Allura', details: 'Raleway', style: 'Romantic & Modern' },
  { names: 'Sacramento', details: 'Montserrat', style: 'Romantic & Modern' },
  { names: 'Pacifico', details: 'Roboto', style: 'Casual & Fun' },
  { names: 'Playfair Display', details: 'Source Sans Pro', style: 'Sophisticated & Clean' },
  { names: 'Playfair Display', details: 'Lato', style: 'Sophisticated & Clean' },
  { names: 'Playfair Display', details: 'Raleway', style: 'Sophisticated & Clean' },
  { names: 'Cormorant Garamond', details: 'Fira Sans', style: 'Elegant & Timeless' },
  { names: 'Cormorant Garamond', details: 'Montserrat', style: 'Sophisticated & Clean' },
  { names: 'Lora', details: 'Open Sans', style: 'Warm & Readable' },
  { names: 'Lora', details: 'Roboto', style: 'Contemporary Classic' },
  { names: 'Libre Baskerville', details: 'Raleway', style: 'Literary & Elegant' },
  { names: 'Libre Baskerville', details: 'Montserrat', style: 'Sophisticated & Clean' },
  { names: 'Crimson Text', details: 'Work Sans', style: 'Editorial & Modern' },
  { names: 'Abril Fatface', details: 'Lato', style: 'Statement & Minimal' },
  { names: 'Abril Fatface', details: 'Poppins', style: 'Bold & Contemporary' },
  { names: 'Bodoni', details: 'Futura', style: 'High Fashion' },
  { names: 'Bodoni', details: 'Gill Sans', style: 'Dramatic & Refined' },
  { names: 'Didot', details: 'Futura', style: 'High Fashion' },
  { names: 'Garamond', details: 'Futura', style: 'Timeless Contrast' },
  { names: 'Garamond', details: 'Helvetica Neue', style: 'Refined & Clean' },
  { names: 'Baskerville', details: 'Futura', style: 'British Elegance' },
  { names: 'Baskerville', details: 'Gill Sans', style: 'Classic English' },
  { names: 'Montserrat', details: 'Merriweather', style: 'Modern & Warm' },
  { names: 'Montserrat', details: 'Lora', style: 'Clean & Elegant' },
  { names: 'Raleway', details: 'Lora', style: 'Light & Airy' },
  { names: 'Poppins', details: 'Merriweather', style: 'Friendly & Classic' },
  { names: 'Josefin Sans', details: 'Lora', style: 'Art Deco Inspired' },
  { names: 'Bebas Neue', details: 'Open Sans', style: 'Bold & Minimal' },
  { names: 'Oswald', details: 'Lato', style: 'Strong & Clean' },
  { names: 'Futura', details: 'Garamond', style: 'Modern Meets Classic' },
  { names: 'Futura', details: 'Georgia', style: 'Geometric & Traditional' },
  { names: 'Optima', details: 'Palatino', style: 'Humanist Elegance' },
  { names: 'Copperplate', details: 'Avenir', style: 'Formal & Engraved' },
]

function getWeddingPairStyle(sourceProfile: FontProfile, targetProfile: FontProfile) {
  for (const rule of WEDDING_PAIR_RULES) {
    if (sourceProfile.cls === rule.namesCls && targetProfile.cls === rule.detailsCls) return rule
  }
  return { style: 'Creative Pairing', desc: 'A unique combination that creates visual interest', boost: 5 }
}

function scoreWeddingPairing(sourceFont: string, targetFont: string, forRole: 'names' | 'details'): number {
  const sp = getFontProfile(sourceFont)
  const tp = getFontProfile(targetFont)
  let score = calculateHarmony(sp, tp)

  const rule = forRole === 'names'
    ? getWeddingPairStyle(tp, sp)
    : getWeddingPairStyle(sp, tp)
  score += rule.boost

  const weddingTraits = ['elegant', 'calligraphic', 'romantic', 'refined', 'literary', 'high-contrast', 'fashion']
  for (const trait of (tp.personality || [])) {
    if (weddingTraits.includes(trait)) score += 3
  }

  if (sp.cls === tp.cls && sp.cls === 'script') score -= 20
  if (sp.cls === tp.cls && sp.cls === 'display') score -= 15
  if (tp.personality?.includes('comic') || tp.personality?.includes('playful')) score -= 10
  if (sp.weight !== tp.weight) score += 5

  return Math.max(30, Math.min(98, score))
}

interface PairingSuggestion {
  font: string
  score: number
  style: string
  curated: boolean
  cls: string
  applyTo: 'names' | 'details'
  pairWith: string
}

function generatePairingsForRole(
  currentFont: string,
  roleToSuggest: 'names' | 'details',
  allFontsList: { family: string }[],
  round: number = 0
): PairingSuggestion[] {
  const scored: { font: string; score: number; profile: FontProfile; curated: boolean; style: string }[] = []
  const checked = new Set<string>()

  // Phase 1: Curated wedding pairings
  for (const cp of WEDDING_CURATED) {
    const matchField = roleToSuggest === 'names' ? 'names' : 'details'
    const pairField = roleToSuggest === 'names' ? 'details' : 'names'
    if (cp[pairField].toLowerCase() === currentFont.toLowerCase()) {
      const targetName = cp[matchField]
      const font = allFontsList.find(f => f.family.toLowerCase() === targetName.toLowerCase())
      if (font && !checked.has(font.family)) {
        checked.add(font.family)
        const tp = getFontProfile(font.family)
        const score = Math.min(98, scoreWeddingPairing(currentFont, font.family, roleToSuggest) + 12)
        scored.push({ font: font.family, score, profile: tp, curated: true, style: cp.style })
      }
    }
  }

  // Phase 2: Algorithmic matches with randomization for regenerate variety
  for (const f of allFontsList) {
    if (f.family === currentFont || checked.has(f.family)) continue
    const tp = getFontProfile(f.family)
    const baseScore = scoreWeddingPairing(currentFont, f.family, roleToSuggest)
    const rule = roleToSuggest === 'names'
      ? getWeddingPairStyle(tp, getFontProfile(currentFont))
      : getWeddingPairStyle(getFontProfile(currentFont), tp)
    // Add jitter so regenerate produces different results among similar-scored fonts
    const jitter = (Math.random() - 0.5) * 6
    scored.push({ font: f.family, score: Math.max(30, Math.min(98, baseScore + jitter)), profile: tp, curated: false, style: rule.style })
  }

  scored.sort((a, b) => b.score - a.score)

  // Skip some top results based on round to show different suggestions
  const skipCount = (round % 3) * 2

  // Ensure class diversity
  const results: typeof scored = []
  const usedClasses = new Set<string>()
  let skipped = 0
  for (const s of scored) {
    if (results.length >= 4) break
    if (s.curated) { results.push(s); usedClasses.add(s.profile.cls) }
  }
  for (const s of scored) {
    if (results.length >= 4) break
    if (!s.curated && !usedClasses.has(s.profile.cls)) {
      if (skipped < skipCount) { skipped++; continue }
      results.push(s); usedClasses.add(s.profile.cls)
    }
  }
  for (const s of scored) {
    if (results.length >= 4) break
    if (!results.some(r => r.font === s.font)) {
      if (skipped < skipCount) { skipped++; continue }
      results.push(s)
    }
  }

  return results.map(r => ({
    font: r.font,
    score: r.score,
    style: r.style,
    curated: r.curated,
    cls: r.profile.cls,
    applyTo: roleToSuggest,
    pairWith: currentFont,
  }))
}

function getDecoHTML(type: string, accent: string) {
  switch (type) {
    case 'floral':
      return <div className="flex items-center justify-center gap-2 mt-3 opacity-40">
        <span style={{ fontSize: 14, color: accent }}>{'\u2740'}</span>
        <div style={{ width: 40, height: 1, background: accent }} />
        <span style={{ fontSize: 14, color: accent }}>{'\u2740'}</span>
      </div>
    case 'deco':
      return <div className="flex items-center justify-center gap-1.5 mt-3.5 opacity-50">
        <span style={{ fontSize: 10, color: accent }}>{'\u25C6'}</span>
        <div style={{ width: 50, height: 2, background: accent }} />
        <span style={{ fontSize: 10, color: accent }}>{'\u25C6'}</span>
        <div style={{ width: 50, height: 2, background: accent }} />
        <span style={{ fontSize: 10, color: accent }}>{'\u25C6'}</span>
      </div>
    case 'dots':
      return <div className="flex items-center justify-center gap-1.5 mt-3 opacity-35">
        {[0, 1, 2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'block' }} />)}
      </div>
    case 'thick-line':
      return <div className="mt-3.5 mx-auto opacity-60" style={{ width: 40, height: 3, background: accent }} />
    case 'diamond':
      return <div className="mt-3.5 text-center opacity-35"><span style={{ fontSize: 10, color: accent }}>{'\u25C7'}</span></div>
    case 'leaf':
      return <div className="mt-3 text-center opacity-35"><span style={{ fontSize: 12, color: accent }}>{'\u2767'}</span></div>
    case 'stars':
      return <div className="flex items-center justify-center gap-2 mt-3 opacity-30">
        <span style={{ fontSize: 8, color: accent }}>{'\u2605'}</span>
        <span style={{ fontSize: 12, color: accent }}>{'\u2605'}</span>
        <span style={{ fontSize: 8, color: accent }}>{'\u2605'}</span>
      </div>
    case 'confetti':
      return <div className="mt-3 text-center opacity-40"><span style={{ fontSize: 14 }}>&#127881;</span></div>
    default:
      return <div className="mt-3 mx-auto opacity-40" style={{ width: 60, height: 1, background: accent }} />
  }
}

export default function WeddingTemplates({ fontFamily, allFonts = [], googleFonts = [], loadGoogleFont, onClose }: WeddingTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [category, setCategory] = useState('all')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [namesFont, setNamesFont] = useState(fontFamily)
  const [detailsFont, setDetailsFont] = useState(fontFamily)
  const [colorSchemeIdx, setColorSchemeIdx] = useState(-1)
  const [decoStyleIdx, setDecoStyleIdx] = useState(-1)
  const [fontPickerTarget, setFontPickerTarget] = useState<'names' | 'details' | null>(null)
  const [fontSearch, setFontSearch] = useState('')
  const [customBgColor, setCustomBgColor] = useState('#fef9f0')
  const [customTextColor, setCustomTextColor] = useState('#3d2c1e')
  const [customAccentColor, setCustomAccentColor] = useState('#c9a96e')
  const [useCustomColor, setUseCustomColor] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Font picker source toggle
  const [pickerSource, setPickerSource] = useState<'installed' | 'google'>('installed')
  const fontGridRef = useRef<HTMLDivElement>(null)

  // Undo/Redo system
  const undoStack = useRef<WeddingSnapshot[]>([])
  const redoStack = useRef<WeddingSnapshot[]>([])
  const [undoRedoTick, setUndoRedoTick] = useState(0) // trigger re-render for button states

  const takeSnapshot = useCallback((): WeddingSnapshot => ({
    selectedTemplate, namesFont, detailsFont,
    customFields: { ...customFields },
    colorSchemeIdx, useCustomColor,
    customBgColor, customTextColor, customAccentColor,
    decoStyleIdx,
  }), [selectedTemplate, namesFont, detailsFont, customFields, colorSchemeIdx, useCustomColor, customBgColor, customTextColor, customAccentColor, decoStyleIdx])

  const saveSnapshot = useCallback(() => {
    const snap = takeSnapshot()
    undoStack.current = [...undoStack.current.slice(-19), snap]
    redoStack.current = []
    setUndoRedoTick(t => t + 1)
  }, [takeSnapshot])

  const restoreSnapshot = useCallback((snap: WeddingSnapshot) => {
    setSelectedTemplate(snap.selectedTemplate)
    setNamesFont(snap.namesFont)
    setDetailsFont(snap.detailsFont)
    setCustomFields(snap.customFields)
    setColorSchemeIdx(snap.colorSchemeIdx)
    setUseCustomColor(snap.useCustomColor)
    setCustomBgColor(snap.customBgColor)
    setCustomTextColor(snap.customTextColor)
    setCustomAccentColor(snap.customAccentColor)
    setDecoStyleIdx(snap.decoStyleIdx)
  }, [])

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return
    const current = takeSnapshot()
    redoStack.current = [...redoStack.current, current]
    const prev = undoStack.current[undoStack.current.length - 1]
    undoStack.current = undoStack.current.slice(0, -1)
    restoreSnapshot(prev)
    setUndoRedoTick(t => t + 1)
  }, [takeSnapshot, restoreSnapshot])

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return
    const current = takeSnapshot()
    undoStack.current = [...undoStack.current, current]
    const next = redoStack.current[redoStack.current.length - 1]
    redoStack.current = redoStack.current.slice(0, -1)
    restoreSnapshot(next)
    setUndoRedoTick(t => t + 1)
  }, [takeSnapshot, restoreSnapshot])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleUndoRedo = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
    }
    window.addEventListener('keydown', handleUndoRedo)
    return () => window.removeEventListener('keydown', handleUndoRedo)
  }, [undo, redo])

  // Lazy-load Google Fonts as they scroll into view in the picker
  useEffect(() => {
    if (pickerSource !== 'google' || !loadGoogleFont || !fontGridRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const family = entry.target.getAttribute('data-font-family')
          if (family) loadGoogleFont(family)
          observer.unobserve(entry.target)
        }
      })
    }, { root: fontGridRef.current, rootMargin: '100px' })
    fontGridRef.current.querySelectorAll('[data-font-family]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [pickerSource, loadGoogleFont, fontSearch, fontPickerTarget])

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fontPickerTarget) setFontPickerTarget(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose, fontPickerTarget])

  const filtered = category === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === category)
  const template = filtered[selectedTemplate] || TEMPLATES[0]

  // Color overrides
  const bg = useCustomColor ? customBgColor : (colorSchemeIdx >= 0 ? COLOR_SCHEMES[colorSchemeIdx].bg : template.bg)
  const textColor = useCustomColor ? customTextColor : (colorSchemeIdx >= 0 ? COLOR_SCHEMES[colorSchemeIdx].text : template.textColor)
  const accentColor = useCustomColor ? customAccentColor : (colorSchemeIdx >= 0 ? COLOR_SCHEMES[colorSchemeIdx].accent : template.accentColor)
  const decoType = decoStyleIdx >= 0 ? DECO_STYLES[decoStyleIdx].type : template.decoType

  const getFieldValue = (fieldLabel: string, defaultValue: string) => {
    const key = `${template.name}-${fieldLabel}`
    return customFields[key] !== undefined ? customFields[key] : defaultValue
  }

  const setFieldValue = (fieldLabel: string, value: string) => {
    const key = `${template.name}-${fieldLabel}`
    setCustomFields(prev => ({ ...prev, [key]: value }))
  }

  // Professional AI pairing suggestions — generates for BOTH roles
  const [pairingKey, setPairingKey] = useState(0) // trigger re-generation
  const aiSuggestions = useMemo(() => {
    if (allFonts.length === 0) return [] as PairingSuggestion[]
    // Suggest detail fonts to pair with current names font
    const namesSugg = generatePairingsForRole(namesFont, 'details', allFonts, pairingKey)
    // Suggest name fonts to pair with current details font
    const detailsSugg = generatePairingsForRole(detailsFont, 'names', allFonts, pairingKey)
    // Interleave: 2 detail suggestions + 2 name suggestions
    const all: PairingSuggestion[] = []
    for (let i = 0; i < 2 && i < namesSugg.length; i++) all.push(namesSugg[i])
    for (let i = 0; i < 2 && i < detailsSugg.length; i++) all.push(detailsSugg[i])
    return all
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namesFont, detailsFont, allFonts, pairingKey])

  const applyAIPairing = useCallback((suggestion: PairingSuggestion) => {
    saveSnapshot()
    if (suggestion.applyTo === 'names') {
      setNamesFont(suggestion.font)
    } else {
      setDetailsFont(suggestion.font)
    }
    // Trigger re-generation of pairings for the new combination
    setPairingKey(k => k + 1)
  }, [saveSnapshot])

  const handleReset = () => {
    setCustomFields({})
    setColorSchemeIdx(-1)
    setDecoStyleIdx(-1)
    setNamesFont(fontFamily)
    setDetailsFont(fontFamily)
    setUseCustomColor(false)
  }

  const [pageSize, setPageSize] = useState('single')
  const [cardsPerPage, setCardsPerPage] = useState(1)
  const [pdfPages, setPdfPages] = useState(1)

  const getMaxCardsPerPage = (cardW: number, cardH: number, pageW: number, pageH: number) => {
    const margin = 0.25
    const usableW = pageW - 2 * margin
    const usableH = pageH - 2 * margin
    // Try both orientations and pick whichever fits more
    const cols1 = Math.floor(usableW / cardW)
    const rows1 = Math.floor(usableH / cardH)
    const fit1 = cols1 * rows1
    const cols2 = Math.floor(usableW / cardH)
    const rows2 = Math.floor(usableH / cardW)
    const fit2 = cols2 * rows2
    return Math.max(fit1, fit2)
  }

  const PAGE_SIZES_INCHES: Record<string, {w:number;h:number}|null> = {
    'single': null,
    '5x7': { w: 5, h: 7 },
    '4x6': { w: 4, h: 6 },
    'letter': { w: 8.5, h: 11 },
    'a4': { w: 8.27, h: 11.69 },
    'a5': { w: 5.83, h: 8.27 },
  }

  const cardsPerPageOptions = useMemo(() => {
    if (pageSize === 'single') return [1]
    const pageDims = PAGE_SIZES_INCHES[pageSize]
    if (!pageDims) return [1]
    const max = getMaxCardsPerPage(template.cardSize.w, template.cardSize.h, pageDims.w, pageDims.h)
    const opts: number[] = []
    for (let i = 1; i <= max; i++) opts.push(i)
    return opts.length > 0 ? opts : [1]
  }, [pageSize, template])

  // Auto-clamp cardsPerPage when options change
  useEffect(() => {
    const max = cardsPerPageOptions[cardsPerPageOptions.length - 1]
    if (cardsPerPage > max) setCardsPerPage(max)
  }, [cardsPerPageOptions, cardsPerPage])

  const PAGE_SIZES: Record<string, {w:number;h:number}|null> = {
    'single': null,
    '5x7': { w: 5*96, h: 7*96 },
    '4x6': { w: 4*96, h: 6*96 },
    'letter': { w: 8.5*96, h: 11*96 },
    'a4': { w: 794, h: 1123 },
    'a5': { w: 559, h: 794 },
  }

  const captureCard = async () => {
    if (!canvasRef.current) return null
    const html2canvas = (await import('html2canvas')).default
    return await html2canvas(canvasRef.current, { backgroundColor: null, scale: 3 })
  }

  const buildPage = async () => {
    const cardCanvas = await captureCard()
    if (!cardCanvas) return null
    if (pageSize === 'single' && cardsPerPage <= 1) return cardCanvas

    const size = PAGE_SIZES[pageSize] || { w: Math.round(cardCanvas.width / 3), h: Math.round(cardCanvas.height / 3) }
    const scale = 3
    const pageW = size.w * scale
    const pageH = size.h * scale
    const page = document.createElement('canvas')
    page.width = pageW; page.height = pageH
    const ctx = page.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pageW, pageH)

    const cardW = template.cardSize.w
    const cardH = template.cardSize.h
    const marginInch = 0.25
    const pageSizeInches = PAGE_SIZES_INCHES[pageSize]
    const pageWInch = pageSizeInches ? pageSizeInches.w : size.w / 96
    const pageHInch = pageSizeInches ? pageSizeInches.h : size.h / 96
    const usableWInch = pageWInch - 2 * marginInch
    const usableHInch = pageHInch - 2 * marginInch
    const cols = Math.max(1, Math.floor(usableWInch / cardW))
    const rows = Math.max(1, Math.floor(usableHInch / cardH))

    const padding = 20 * scale
    const cellW = (pageW - padding * (cols + 1)) / cols
    const cellH = (pageH - padding * (rows + 1)) / rows

    for (let i = 0; i < cardsPerPage; i++) {
      const col = i % cols; const row = Math.floor(i / cols)
      const x = padding + col * (cellW + padding)
      const y = padding + row * (cellH + padding)
      const scaleX = cellW / cardCanvas.width
      const scaleY = cellH / cardCanvas.height
      const fitScale = Math.min(scaleX, scaleY)
      const drawW = cardCanvas.width * fitScale
      const drawH = cardCanvas.height * fitScale
      const cardX = x + (cellW - drawW) / 2
      const cardY = y + (cellH - drawH) / 2
      ctx.drawImage(cardCanvas, cardX, cardY, drawW, drawH)
      if (cardsPerPage > 1) {
        ctx.strokeStyle = 'rgba(200,200,200,0.4)'
        ctx.setLineDash([6 * scale, 4 * scale])
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, cellW, cellH)
        ctx.setLineDash([])

        // Crop marks: L-shaped corner marks at each card position
        const markLen = 0.15 * 96 * scale // 0.15 inches outward
        const gap = 3 * scale             // gap between mark and card edge
        ctx.strokeStyle = '#CCCCCC'
        ctx.lineWidth = 0.5 * scale
        ctx.setLineDash([])

        // Top-left corner
        ctx.beginPath()
        ctx.moveTo(cardX - gap - markLen, cardY - gap)
        ctx.lineTo(cardX - gap, cardY - gap)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cardX - gap, cardY - gap - markLen)
        ctx.lineTo(cardX - gap, cardY - gap)
        ctx.stroke()

        // Top-right corner
        ctx.beginPath()
        ctx.moveTo(cardX + drawW + gap, cardY - gap)
        ctx.lineTo(cardX + drawW + gap + markLen, cardY - gap)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cardX + drawW + gap, cardY - gap - markLen)
        ctx.lineTo(cardX + drawW + gap, cardY - gap)
        ctx.stroke()

        // Bottom-left corner
        ctx.beginPath()
        ctx.moveTo(cardX - gap - markLen, cardY + drawH + gap)
        ctx.lineTo(cardX - gap, cardY + drawH + gap)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cardX - gap, cardY + drawH + gap)
        ctx.lineTo(cardX - gap, cardY + drawH + gap + markLen)
        ctx.stroke()

        // Bottom-right corner
        ctx.beginPath()
        ctx.moveTo(cardX + drawW + gap, cardY + drawH + gap)
        ctx.lineTo(cardX + drawW + gap + markLen, cardY + drawH + gap)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cardX + drawW + gap, cardY + drawH + gap)
        ctx.lineTo(cardX + drawW + gap, cardY + drawH + gap + markLen)
        ctx.stroke()
      }
    }
    return page
  }

  const exportPNG = async () => {
    const page = await buildPage()
    if (!page) return
    const link = document.createElement('a')
    link.download = `${template.name.toLowerCase().replace(/\s/g, '-')}.png`
    link.href = page.toDataURL('image/png')
    link.click()
  }

  const exportSVG = async () => {
    const page = await buildPage()
    if (!page) return
    const w = page.width; const h = page.height
    const dataUrl = page.toDataURL('image/png')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w/3)}" height="${Math.round(h/3)}" viewBox="0 0 ${Math.round(w/3)} ${Math.round(h/3)}"><image href="${dataUrl}" width="${Math.round(w/3)}" height="${Math.round(h/3)}"/></svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = `${template.name.toLowerCase().replace(/\s/g, '-')}.svg`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const exportPDF = async () => {
    const page = await buildPage()
    if (!page) return
    const numPages = pdfPages
    const imgW = page.width / 3; const imgH = page.height / 3
    const imgData = page.toDataURL('image/jpeg', 0.95)
    const base64Data = imgData.split(',')[1]
    const byteString = atob(base64Data)
    const imgBytes = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) imgBytes[i] = byteString.charCodeAt(i)

    const pdfW = imgW * 72 / 96; const pdfH = imgH * 72 / 96

    // Multi-page PDF: obj layout per page:
    // Obj 1: Catalog, Obj 2: Pages
    // Obj 3: Image XObject (shared)
    // Per page p (0-indexed): pageObj = 4 + p*2, contentObj = 5 + p*2
    const totalObjs = 3 + numPages * 2
    let pdf = '%PDF-1.4\n'
    const offsets: number[] = []

    // Obj 1: Catalog
    offsets.push(pdf.length)
    pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'

    // Obj 2: Pages
    const kids = Array.from({ length: numPages }, (_, p) => `${4 + p * 2} 0 R`).join(' ')
    offsets.push(pdf.length)
    pdf += `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${numPages} >>\nendobj\n`

    // Obj 3: Image (placeholder, written with binary later)
    offsets.push(pdf.length)
    pdf += `3 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`

    const beforeImg = new TextEncoder().encode(pdf)
    const afterImgStr = '\nendstream\nendobj\n'

    // Build remaining objects as text after the image
    let restPdf = afterImgStr
    for (let p = 0; p < numPages; p++) {
      const pageObjNum = 4 + p * 2
      const contentObjNum = 5 + p * 2
      // Page object
      offsets.push(beforeImg.length + imgBytes.length + new TextEncoder().encode(restPdf).length)
      restPdf += `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW.toFixed(2)} ${pdfH.toFixed(2)}] /Contents ${contentObjNum} 0 R /Resources << /XObject << /Img 3 0 R >> >> >>\nendobj\n`
      // Content stream
      const contentStr = `q ${pdfW.toFixed(2)} 0 0 ${pdfH.toFixed(2)} 0 0 cm /Img Do Q`
      offsets.push(beforeImg.length + imgBytes.length + new TextEncoder().encode(restPdf).length)
      restPdf += `${contentObjNum} 0 obj\n<< /Length ${contentStr.length} >>\nstream\n${contentStr}\nendstream\nendobj\n`
    }

    const restBytes = new TextEncoder().encode(restPdf)
    const xrefOffset = beforeImg.length + imgBytes.length + restBytes.length
    let xrefStr = `xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`
    for (let i = 0; i < offsets.length; i++) xrefStr += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
    xrefStr += `trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
    const xrefBytes = new TextEncoder().encode(xrefStr)

    const fullPdf = new Uint8Array(beforeImg.length + imgBytes.length + restBytes.length + xrefBytes.length)
    fullPdf.set(beforeImg, 0)
    fullPdf.set(imgBytes, beforeImg.length)
    fullPdf.set(restBytes, beforeImg.length + imgBytes.length)
    fullPdf.set(xrefBytes, beforeImg.length + imgBytes.length + restBytes.length)

    const blob = new Blob([fullPdf], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.download = `${template.name.toLowerCase().replace(/\s/g, '-')}.pdf`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const pickerBaseFonts = pickerSource === 'google' ? googleFonts : allFonts
  const filteredPickerFonts = fontSearch
    ? pickerBaseFonts.filter(f => f.family.toLowerCase().includes(fontSearch.toLowerCase()))
    : pickerBaseFonts

  // Deduplicate picker fonts
  const uniquePickerFonts = useMemo(() => {
    const seen = new Set<string>()
    return filteredPickerFonts.filter(f => {
      if (seen.has(f.family)) return false
      seen.add(f.family)
      return true
    }).slice(0, 100)
  }, [filteredPickerFonts])

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-amber-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Invitation & Event Studio</h2>
                <p className="text-xs text-zinc-500">Starting with &ldquo;{fontFamily}&rdquo; — change fonts per element below</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={undoStack.current.length === 0}
                title="Undo (Cmd+Z)"
                className={`p-2 rounded-lg transition ${
                  undoStack.current.length === 0
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className="text-base leading-none">{'\u21A9'}</span>
              </button>
              <button
                onClick={redo}
                disabled={redoStack.current.length === 0}
                title="Redo (Cmd+Shift+Z)"
                className={`p-2 rounded-lg transition ${
                  redoStack.current.length === 0
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className="text-base leading-none">{'\u21AA'}</span>
              </button>
              <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Category tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setSelectedTemplate(0) }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                    category === cat.id
                      ? 'bg-gradient-to-r from-rose-500/15 to-amber-500/15 text-rose-400 border border-rose-500/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Main grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] overflow-hidden">
              {/* Left: Live Preview */}
              <div className="flex items-center justify-center p-8 bg-zinc-950 relative overflow-auto">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22 fill=%22white%22/%3E%3C/svg%3E')" }} />

                {/* Multi-up preview wrapper */}
                {(pageSize !== 'single' || cardsPerPage > 1) ? (
                  (() => {
                    const pageDims = PAGE_SIZES_INCHES[pageSize]
                    const pgW = pageDims ? pageDims.w : template.cardSize.w
                    const pgH = pageDims ? pageDims.h : template.cardSize.h
                    const mCols = Math.max(1, Math.floor((pgW - 0.5) / template.cardSize.w))
                    const mRows = Math.max(1, Math.floor((pgH - 0.5) / template.cardSize.h))
                    const scaleFactor = cardsPerPage > 4 ? 0.55 : cardsPerPage > 2 ? 0.65 : cardsPerPage > 1 ? 0.85 : 1
                    return (
                      <div className="relative z-10">
                        <div className="bg-white rounded-lg shadow-2xl p-3" style={{ maxWidth: 420 }}>
                          <div className="text-center text-[9px] text-gray-400 uppercase tracking-widest mb-2" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                            {pageSize === '5x7' ? '5\u00D77"' : pageSize === '4x6' ? '4\u00D76"' : pageSize === 'letter' ? '8.5\u00D711"' : pageSize === 'a4' ? 'A4' : pageSize === 'a5' ? 'A5' : 'Single'} &mdash; {cardsPerPage} per page
                          </div>
                          <div
                            className="gap-2"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${mCols}, 1fr)`,
                            }}
                          >
                            {Array.from({ length: cardsPerPage }).map((_, cardIdx) => (
                              <div key={cardIdx} style={{ transform: cardsPerPage > 1 ? `scale(${scaleFactor})` : 'none', transformOrigin: 'center' }}>
                                {/* Hidden ref only on first card for capture */}
                                <div ref={cardIdx === 0 ? canvasRef : undefined}>
                                  <div
                                    className="text-center space-y-1"
                                    style={{
                                      padding: cardsPerPage > 4 ? '16px 12px' : cardsPerPage > 2 ? '24px 18px' : '36px 28px',
                                      background: bg,
                                      border: (useCustomColor || colorSchemeIdx >= 0)
                                        ? `${(template.border || '1px solid').split(' ')[0]} solid ${accentColor}`
                                        : template.border,
                                      borderRadius: template.radius,
                                      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                      aspectRatio: `${template.cardSize.w}/${template.cardSize.h}`,
                                    }}
                                  >
                                    {template.fields.map((field, i) => (
                                      <div
                                        key={i}
                                        className="whitespace-pre-line"
                                        style={{
                                          fontFamily: `"${field.role === 'name' ? namesFont : detailsFont}", serif`,
                                          fontSize: `${(field.fontSize * (cardsPerPage > 4 ? 0.6 : cardsPerPage > 2 ? 0.7 : 0.85))}px`,
                                          fontWeight: field.fontWeight || 'normal',
                                          fontStyle: field.fontStyle || 'normal',
                                          letterSpacing: field.letterSpacing || 'normal',
                                          color: textColor,
                                          opacity: field.opacity || 1,
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {getFieldValue(field.label, field.defaultValue)}
                                      </div>
                                    ))}
                                    {getDecoHTML(decoType, accentColor)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-center">
                            <span className="text-[8px] text-gray-300" style={{ fontFamily: 'Tahoma, sans-serif' }}>Cut lines shown at export</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div ref={canvasRef} className="relative z-10 transition-all duration-300">
                    <div
                      className="text-center space-y-1"
                      style={{
                        padding: '48px 36px',
                        maxWidth: 360,
                        background: bg,
                        border: (useCustomColor || colorSchemeIdx >= 0)
                          ? `${(template.border || '1px solid').split(' ')[0]} solid ${accentColor}`
                          : template.border,
                        borderRadius: template.radius,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                        aspectRatio: `${template.cardSize.w}/${template.cardSize.h}`,
                      }}
                    >
                      {template.fields.map((field, i) => (
                        <div
                          key={i}
                          className="whitespace-pre-line"
                          style={{
                            fontFamily: `"${field.role === 'name' ? namesFont : detailsFont}", serif`,
                            fontSize: `${field.fontSize}px`,
                            fontWeight: field.fontWeight || 'normal',
                            fontStyle: field.fontStyle || 'normal',
                            letterSpacing: field.letterSpacing || 'normal',
                            color: textColor,
                            opacity: field.opacity || 1,
                            lineHeight: 1.5,
                          }}
                        >
                          {getFieldValue(field.label, field.defaultValue)}
                        </div>
                      ))}
                      {getDecoHTML(decoType, accentColor)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Controls */}
              <div className="border-l border-zinc-800 overflow-y-auto">
                {/* Template Selector */}
                <div className="p-4 border-b border-zinc-800">
                  <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 mb-2">Template</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filtered.map((t, i) => (
                      <button
                        key={t.name}
                        onClick={() => { setSelectedTemplate(i); setColorSchemeIdx(-1); setDecoStyleIdx(-1) }}
                        className={`text-left px-3 py-2 rounded-lg text-[11px] transition ${
                          selectedTemplate === i
                            ? 'bg-gradient-to-r from-rose-500/12 to-amber-500/8 border border-rose-500/40 text-rose-400 font-semibold'
                            : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Font Pairing */}
                <div className="p-4 border-b border-zinc-800 bg-gradient-to-b from-violet-500/[0.03] to-transparent">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-violet-400">AI Font Pairing</label>
                    </div>
                    <button
                      onClick={() => setPairingKey(k => k + 1)}
                      className="text-[9px] px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/15 transition"
                    >
                      Regenerate
                    </button>
                  </div>

                  {/* Font picker rows with live previews */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 uppercase tracking-wider">Names</span>
                      </div>
                      <button
                        onClick={() => setFontPickerTarget('names')}
                        className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-white hover:border-violet-500/50 transition truncate max-w-[180px]"
                      >
                        <span className="truncate" style={{ fontFamily: `"${namesFont}", serif` }}>{namesFont}</span>
                        <svg className="w-3 h-3 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                    <div className="rounded-md bg-zinc-800/50 px-3 py-1.5">
                      <span className="text-sm text-zinc-300" style={{ fontFamily: `"${namesFont}", serif` }}>Emma & James</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 uppercase tracking-wider">Details</span>
                      </div>
                      <button
                        onClick={() => setFontPickerTarget('details')}
                        className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-white hover:border-violet-500/50 transition truncate max-w-[180px]"
                      >
                        <span className="truncate" style={{ fontFamily: `"${detailsFont}", serif` }}>{detailsFont}</span>
                        <svg className="w-3 h-3 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                    <div className="rounded-md bg-zinc-800/50 px-3 py-1.5">
                      <span className="text-xs text-zinc-400" style={{ fontFamily: `"${detailsFont}", serif`, letterSpacing: '0.05em' }}>Saturday, the Twenty-First of June</span>
                    </div>
                  </div>

                  {/* AI Pairing Suggestions with live mini-previews */}
                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      {aiSuggestions.map((s) => {
                        const previewNamesFont = s.applyTo === 'names' ? s.font : namesFont
                        const previewDetailsFont = s.applyTo === 'details' ? s.font : detailsFont
                        return (
                          <button
                            key={`${s.font}-${s.applyTo}`}
                            onClick={() => applyAIPairing(s)}
                            className="w-full rounded-[10px] overflow-hidden border border-zinc-700/60 hover:border-violet-500/50 transition-all hover:-translate-y-px bg-zinc-800/50 text-left"
                          >
                            {/* Live mini-invitation preview */}
                            <div className="px-4 py-3 text-center" style={{ background: 'linear-gradient(180deg, #fef9f0, #fdf6e9)' }}>
                              <div style={{ fontFamily: `"${previewNamesFont}", serif`, fontSize: 18, color: '#3d2c1e', lineHeight: 1.3 }}>
                                Emma & James
                              </div>
                              <div style={{ fontFamily: `"${previewDetailsFont}", serif`, fontSize: 9, color: '#3d2c1e', opacity: 0.5, marginTop: 4, letterSpacing: '0.1em' }}>
                                Saturday, the Twenty-First of June
                              </div>
                            </div>
                            {/* Info bar */}
                            <div className="flex items-center gap-2 px-3 py-2">
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: s.score >= 85 ? 'linear-gradient(135deg, #34d399, #06b6d4)' :
                                             s.score >= 70 ? 'linear-gradient(135deg, #a78bfa, #7c3aed)' :
                                             'linear-gradient(135deg, #fbbf24, #f97316)'
                                }}
                              >
                                <span className="text-white font-extrabold text-[9px]">{s.score}%</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[7px] font-bold px-1 py-px rounded uppercase tracking-wider ${
                                    s.applyTo === 'names'
                                      ? 'text-rose-400 bg-rose-500/15'
                                      : 'text-violet-400 bg-violet-500/15'
                                  }`}>
                                    {s.applyTo === 'names' ? 'Names' : 'Details'}
                                  </span>
                                  <span className="text-[11px] text-white truncate" style={{ fontFamily: `"${s.font}", serif` }}>{s.font}</span>
                                </div>
                                <div className="text-[8px] text-zinc-500 mt-0.5">
                                  {s.style}{s.curated ? ' \u00B7 Designer Pick' : ''}
                                </div>
                              </div>
                              <span className="text-[9px] text-violet-400 font-semibold flex-shrink-0">Apply</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-600 text-center py-3">No fonts detected for pairing. Open the font picker to load fonts.</p>
                  )}
                </div>

                {/* Color Scheme */}
                <div className="p-4 border-b border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500">Color Scheme</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-600">Custom:</span>
                      <input type="color" value={customBgColor} onChange={e => { setCustomBgColor(e.target.value); if (useCustomColor) {} }} title="Background" className="w-5 h-5 border border-zinc-700 rounded cursor-pointer bg-transparent p-0" />
                      <input type="color" value={customTextColor} onChange={e => setCustomTextColor(e.target.value)} title="Text" className="w-5 h-5 border border-zinc-700 rounded cursor-pointer bg-transparent p-0" />
                      <input type="color" value={customAccentColor} onChange={e => setCustomAccentColor(e.target.value)} title="Accent" className="w-5 h-5 border border-zinc-700 rounded cursor-pointer bg-transparent p-0" />
                      <button
                        onClick={() => { saveSnapshot(); setUseCustomColor(true); setColorSchemeIdx(-1) }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLOR_SCHEMES.map((cs, i) => (
                      <button
                        key={cs.name}
                        onClick={() => { saveSnapshot(); setColorSchemeIdx(i === colorSchemeIdx ? -1 : i); setUseCustomColor(false) }}
                        title={cs.name}
                        className={`aspect-square rounded-lg transition ${
                          colorSchemeIdx === i && !useCustomColor ? 'ring-2 ring-violet-500 ring-offset-1 ring-offset-zinc-900' : ''
                        }`}
                        style={{ background: cs.bg, border: colorSchemeIdx === i && !useCustomColor ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Border Style */}
                <div className="p-4 border-b border-zinc-800">
                  <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 mb-2">Border & Style</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DECO_STYLES.map((ds, i) => (
                      <button
                        key={ds.name}
                        onClick={() => { saveSnapshot(); setDecoStyleIdx(i === decoStyleIdx ? -1 : i) }}
                        className={`px-2 py-1.5 rounded-md text-[10px] transition ${
                          decoStyleIdx === i
                            ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                            : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {ds.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customize Text */}
                <div className="p-4 border-b border-zinc-800">
                  <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 mb-2">Customize Text</label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {template.fields.map((field, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <label className="text-[9px] text-zinc-600">{field.label}</label>
                          <span className={`text-[8px] px-1 py-px rounded ${
                            field.role === 'name' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500 bg-zinc-800'
                          }`}>
                            {field.role === 'name' ? 'NAME' : 'DETAIL'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={getFieldValue(field.label, field.defaultValue)}
                          onFocus={() => saveSnapshot()}
                          onChange={e => setFieldValue(field.label, e.target.value)}
                          className="w-full rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-white focus:border-violet-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export & Print */}
                <div className="p-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500 mb-1">Export & Print</label>
                  <div className="flex gap-1.5">
                    <select
                      value={pageSize}
                      onChange={e => setPageSize(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-md px-2 py-1.5 text-[11px] focus:outline-none focus:border-violet-600"
                    >
                      <option value="single">Single Card</option>
                      <option value="5x7">5 x 7 in</option>
                      <option value="4x6">4 x 6 in</option>
                      <option value="letter">Letter (8.5 x 11)</option>
                      <option value="a4">A4</option>
                      <option value="a5">A5</option>
                    </select>
                    <select
                      value={cardsPerPage}
                      onChange={e => setCardsPerPage(parseInt(e.target.value))}
                      className="w-24 bg-zinc-800 border border-zinc-700 text-white rounded-md px-2 py-1.5 text-[11px] focus:outline-none focus:border-violet-600"
                    >
                      {cardsPerPageOptions.map(n => (
                        <option key={n} value={n}>{n} per page</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] text-zinc-500">Pages:</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={pdfPages}
                        onChange={e => setPdfPages(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="w-14 bg-zinc-800 border border-zinc-700 text-white rounded-md px-2 py-1.5 text-[11px] focus:outline-none focus:border-violet-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button onClick={exportPNG} className="py-2 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:from-violet-500 hover:to-pink-400 transition">PNG</button>
                    <button onClick={exportSVG} className="py-2 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 transition">SVG</button>
                    <button onClick={exportPDF} className="py-2 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 transition">PDF</button>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-2 rounded-lg text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font Picker Sub-Modal */}
      {fontPickerTarget && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                Choose {fontPickerTarget === 'names' ? 'Names' : 'Details'} Font
              </h3>
              <button onClick={() => setFontPickerTarget(null)} className="p-1.5 text-zinc-500 hover:text-white transition rounded-lg hover:bg-zinc-800">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-3 border-b border-zinc-800 space-y-2">
              {/* Font source toggle */}
              {googleFonts.length > 0 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setPickerSource('installed')}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
                      pickerSource === 'installed'
                        ? 'bg-violet-600/20 text-violet-400 border border-violet-500/40'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    Installed
                  </button>
                  <button
                    onClick={() => setPickerSource('google')}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
                      pickerSource === 'google'
                        ? 'bg-violet-600/20 text-violet-400 border border-violet-500/40'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    Google
                  </button>
                </div>
              )}
              <input
                type="text"
                placeholder="Search fonts..."
                value={fontSearch}
                onChange={e => setFontSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-violet-600 focus:outline-none"
                autoFocus
              />
            </div>
            <div ref={fontGridRef} className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-1.5">
              {uniquePickerFonts.map(f => (
                <button
                  key={f.family}
                  data-font-family={pickerSource === 'google' ? f.family : undefined}
                  onClick={() => {
                    saveSnapshot()
                    if (pickerSource === 'google' && loadGoogleFont) loadGoogleFont(f.family)
                    if (fontPickerTarget === 'names') setNamesFont(f.family)
                    else setDetailsFont(f.family)
                    setFontPickerTarget(null)
                    setFontSearch('')
                  }}
                  className="text-left px-2 py-1.5 rounded-md bg-zinc-800 border border-zinc-700/50 hover:border-violet-500/50 transition overflow-hidden"
                >
                  <span className="block text-base truncate" style={{ fontFamily: `"${f.family}", serif` }}>Abc</span>
                  <span className="block text-[11px] text-zinc-500 truncate" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{f.family}</span>
                </button>
              ))}
              {uniquePickerFonts.length === 0 && (
                <p className="col-span-3 text-center text-xs text-zinc-600 py-8">No fonts found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
