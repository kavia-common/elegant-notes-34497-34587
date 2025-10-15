import Blits from '@lightningjs/blits'
import App from './App'

/**
 * Entry point for Notes frontend.
 * Configure key mappings and launch the Lightning application.
 */
Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Escape'],
    delete: ['Delete', 'Backspace'],
    any: 'Any', // capture other keys for simple input handling
  },
})
