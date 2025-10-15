import Blits from '@lightningjs/blits'

/**
 * Editor component
 * - Displays currently selected note
 * - Allows editing title and body within Lightning context (not DOM textareas)
 * - Emits: save({id, title, body}), delete({id})
 * Note: Uses simple keystroke capture to mutate fields.
 */
export default Blits.Component('Editor', {
  props: ['note', 'theme'],

  template: `
    <Element x="0" y="0" :w="$w" :h="$h" :color="$surface">
      <!-- Title row -->
      <Element x="24" y="24" :w="$w - 48" h="72" :color="$titleBg" radius="14">
        <Text x="18" y="18" :content="$titleDisplay" :textColor="$titleColor" fontSize="30" />
      </Element>

      <!-- Body area -->
      <Element x="24" y="114" :w="$w - 48" :h="$h - 220" :color="$bodyBg" radius="14">
        <Text x="18" y="18" :content="$bodyDisplay" :textColor="$bodyColor" fontSize="24" />
      </Element>

      <!-- Buttons -->
      <Element x="24" :y="$h - 86" :w="$w - 48" h="62" color="#00000000">
        <Element x="0" y="0" w="140" h="56" :color="$primary" radius="12" @enter="$emitSave" @focus="$focusSave" @unfocus="$unfocusSave">
          <Text x="28" y="12" content="Save" textColor="#ffffff" fontSize="24" />
        </Element>
        <Element x="160" y="0" w="160" h="56" :color="$danger" radius="12" @enter="$emitDelete" @focus="$focusDelete" @unfocus="$unfocusDelete">
          <Text x="28" y="12" content="Delete" textColor="#ffffff" fontSize="24" />
        </Element>
      </Element>
    </Element>
  `,

  state() {
    const t = this.theme || {}
    const primary = t.primary || '#2563EB'
    const danger = t.error || '#EF4444'
    const surface = t.surface || '#ffffff'
    const text = t.text || '#111827'

    const note = this.note || null

    return {
      w: 1920 - (620 + 120),
      h: 900,
      surface,
      primary,
      danger,
      text,
      titleBg: '#F3F4F6',
      bodyBg: '#F9FAFB',
      titleColor: text,
      bodyColor: '#374151',
      // local edit buffers
      _id: note?.id || null,
      _title: note?.title || '',
      _body: note?.body || '',
      _focus: 'body', // 'title' | 'body'
    }
  },

  watch: {
    // Sync local buffers when active note changes
    note(n) {
      this._id = n?.id || null
      this._title = n?.title || ''
      this._body = n?.body || ''
    },
  },

  computed: {
    titleDisplay() {
      return (this._title || 'Untitled') + (this._focus === 'title' ? '|' : '')
    },
    bodyDisplay() {
      const suffix = this._focus === 'body' ? '|' : ''
      return (this._body || '') + suffix
    },
  },

  methods: {
    $emitSave() {
      if (!this._id) return
      this.$emit('save', { id: this._id, title: this._title || 'Untitled', body: this._body || '' })
    },
    $emitDelete() {
      if (!this._id) return
      this.$emit('delete', { id: this._id })
    },
    $focusSave() {},
    $unfocusSave() {},
    $focusDelete() {},
    $unfocusDelete() {},
  },

  input: {
    up() {
      this._focus = 'title'
    },
    down() {
      this._focus = 'body'
    },
    left() {},
    right() {},
    enter() {
      // Buttons have their own @enter; here we do nothing.
    },
    back() {},
    // Simple text input handling
    any(e) {
      const key = e?.key || ''
      if (!this._id) return
      if (key === 'Backspace') {
        if (this._focus === 'title') this._title = (this._title || '').slice(0, -1)
        else this._body = (this._body || '').slice(0, -1)
        return
      }
      if (key === 'Tab') {
        this._focus = this._focus === 'title' ? 'body' : 'title'
        return
      }
      if (key.length === 1) {
        if (this._focus === 'title') this._title = (this._title || '') + key
        else this._body = (this._body || '') + key
      }
    },
  },

  hooks: {
    ready() {
      this.patch({ smooth: { alpha: [1, { duration: 0.25 }] } })
    },
  },
})
