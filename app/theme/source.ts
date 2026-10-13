/**
 * Social Geeks theme — warm marketplace neutral.
 *
 * Extends the neutral theme and re-tints its grayscale spine toward a warm,
 * paper-like stone: an off-white canvas, white working surfaces, and a
 * near-black espresso accent for primary actions. Everything not listed
 * here (status hues, categorical palette, badges, banners) is inherited
 * from neutral unchanged.
 *
 * Build after editing:  npx astryx theme build app/theme/source.ts --out app/theme/theme.css
 *
 * Core warm palette (light):
 *   canvas  #f5f4f0   surface #ffffff   muted #efede8
 *   border  #2b26211c (11% espresso)    emphasized #d9d6cf
 *   ink     #26231f   secondary #6b665f   icon #8a857d
 *   accent  #2b2621 (espresso)  on-accent #ffffff
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const SANS = 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = 'var(--font-geist-mono), ui-monospace, "SF Mono", Monaco, Consolas, monospace';

export const socialGeeksTheme = defineTheme({
  name: 'social-geeks',
  extends: neutralTheme,

  tokens: {
    // Typography — Inter (next/font) for body + headings, Geist Mono for code.
    '--font-family-body': SANS,
    '--font-family-heading': SANS,
    '--font-family-code': MONO,

    // Backgrounds: off-white canvas, white working surfaces.
    '--color-background-body': ['#f5f4f0', '#191816'],
    '--color-background-surface': ['#ffffff', '#232220'],
    '--color-background-card': ['#ffffff', '#1f1e1c'],
    '--color-background-popover': ['#ffffff', '#262522'],
    '--color-background-muted': ['#efede8', '#1f1e1c'],
    '--color-background-inverted': ['#2b2621', '#f5f4f0'],

    // Accent — espresso near-black (light) / warm off-white (dark).
    '--color-accent': ['#2b2621', '#edeae4'],
    '--color-accent-muted': ['#ecebe6', '#2e2c29'],
    '--color-text-accent': ['#2b2621', '#edeae4'],
    '--color-icon-accent': ['#2b2621', '#edeae4'],
    '--color-on-accent': ['#ffffff', '#191816'],
    '--color-neutral': ['#2b26210f', '#ffffff1a'],

    // Overlays tinted with the espresso ink instead of pure black.
    '--color-overlay': ['#1a171480', '#000000cc'],
    '--color-overlay-hover': ['#2b26210d', '#ffffff0d'],
    '--color-overlay-pressed': ['#2b26211a', '#ffffff1a'],

    // Text — secondary #6b665f clears 4.9:1 on the canvas, 5.6:1 on white.
    '--color-text-primary': ['#26231f', '#f3f1ed'],
    '--color-text-secondary': ['#6b665f', '#a9a49c'],
    '--color-text-disabled': ['#aba69e', '#5c5852'],
    '--color-on-light': '#26231f',

    // Icons — secondary #8a857d keeps 3.3:1 non-text contrast on the canvas.
    '--color-icon-primary': ['#26231f', '#f3f1ed'],
    '--color-icon-secondary': ['#8a857d', '#a9a49c'],
    '--color-icon-disabled': ['#aba69e', '#5c5852'],

    // Borders and effects.
    '--color-border': ['#2b26211c', '#ffffff1a'],
    '--color-border-emphasized': ['#d9d6cf', '#4a4743'],
    '--color-skeleton': ['#ebe9e4', '#3a3835'],
    '--color-track': ['#e2dfd9', '#4a4743'],
    '--color-shadow': ['#2b26211a', '#0000004d'],

    // Categorical gray re-warmed to sit on the stone canvas.
    '--color-background-gray': ['#ebe9e4', 'var(--color-neutral)'],
    '--color-border-gray': ['#d9d6cf', '#3a3835'],
    '--color-icon-gray': ['#5f5a54', '#a9a49c'],
    '--color-text-gray': ['#2b2621', '#e8e5df'],

    // Soft, wide, espresso-tinted shadows (the floating search pill look).
    '--shadow-low':
      '0 1px 2px light-dark(oklch(0.27 0.01 60 / 5%), oklch(0 0 0 / 25%)), ' +
      '0 2px 6px light-dark(oklch(0.27 0.01 60 / 6%), oklch(0 0 0 / 35%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 8%))',
    '--shadow-med':
      '0 2px 4px light-dark(oklch(0.27 0.01 60 / 5%), oklch(0 0 0 / 35%)), ' +
      '0 6px 18px light-dark(oklch(0.27 0.01 60 / 9%), oklch(0 0 0 / 50%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 12%))',
    '--shadow-high':
      '0 4px 8px light-dark(oklch(0.27 0.01 60 / 8%), oklch(0 0 0 / 50%)), ' +
      '0 16px 32px light-dark(oklch(0.27 0.01 60 / 14%), oklch(0 0 0 / 70%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 15%))',
    '--focus-outline-color': 'var(--color-accent)',
  },

  components: {
    // Secondary = outlined white button ("View →"), not a gray fill.
    button: {
      'variant:secondary': {
        backgroundColor: 'var(--color-background-surface)',
        boxShadow: 'inset 0 0 0 1px var(--color-border-emphasized)',
      },
    },

    // Segmented control: no track; the selected segment is a soft stone chip.
    'segmented-control': {
      base: {
        backgroundColor: 'transparent',
      },
    },
    'segmented-control-item': {
      selected: {
        backgroundColor: 'var(--color-neutral)',
        boxShadow: 'none',
      },
    },

    // Large text input = the floating pill search field.
    'text-input': {
      'size:lg': {
        '--radius-element': 'var(--radius-full)',
        '--size-element-lg': '3rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-med)',
      },
    },

    // Progress fills use the espresso accent instead of neutral's info blue.
    progressbar: {
      'variant:accent': {
        '--color-accent': 'light-dark(#2b2621, #edeae4)',
      },
    },

    // App shell "section": canvas-colored nav + content, hairline dividers.
    'app-shell': {
      'variant:section': {
        backgroundColor: 'var(--color-background-body)',
      },
    },
  },
});
