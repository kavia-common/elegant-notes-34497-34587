import Blits from '@lightningjs/blits'

/**
 * NoteList component
 * - Displays a searchable list of notes
 * - Keyboard navigation: up/down, enter to select, delete/backspace to delete
 * - Emits: select({id}), create(), search({query}), delete({id})
 */
export default Blits.Component('NoteList', {
  props: ['notes', 'selectedId', 'query', 'theme'],

  template: `
    <Element x="0" y="0" :w="$w" :h="$h" :color="$surface">
      <!-- Toolbar -->
      <Element x="0" y="0" :w="$w" h="84" :color="$surface" radius="24">
        <Element x="24" y="18" :w="$w - 48" h="48" color="#00000000">
          <!-- Search bar stub -->
          <Element x="0" y="0" :w="$w - 240" h="48" :color="$searchBg" radius="12">
            <Text x="18" y="10" :content="$searchText" :textColor="$searchColor" fontSize="22" />
          </Element>
          <!-- Create button -->
          <Element :x="$w - 210" y="0" w="186" h="48" :color="$primary" radius="12" @enter="$emitCreate" @focus="$focusCreate" @unfocus="$unfocusCreate">
            <Text x="20" y="10" content="➕ New Note" textColor="#ffffff" fontSize="22" />
          </Element>
        </Element>
      </Element>

      <!-- List container -->
      <Element x="0" y="96" :w="$w" :h="$h - 120" color="#00000000">
        <Element
          :for="(item, index) in $filtered"
          :key="$item.id"
          :x="12"
          :y="$index * 86"
          :w="$w - 24"
          h="78"
          :color="$selectedId === $item.id ? $activeBg : $rowBg"
          radius="14"
          @enter="$emitSelect"
        >
          <Element :x="0" :y="0" :w="$w - 24" h="78" color="#00000000">
            <Element :x="0" :y="0" :w="$w - 24" h="78" color="#00000000" />
            <Text :x="18" :y="12" :content="$item.title || 'Untitled'" :textColor="$rowText" fontSize="26" />
            <Text :x="18" :y="44" :content="$itemSnippet($item.body)" :textColor="$muted" fontSize="20" />
            <Element :x="$w - 24 - 96" y="18" w="84" h="42" :color="$danger" radius="10" @enter="$emitDelete">
              <Text x="20" y="8" content="Delete" textColor="#ffffff" fontSize="20" />
            </Element>
          </Element>
        </Element>
      </Element>
    </Element>
  `,

  state() {
    const t = this.theme || {}
    const primary = t.primary || '#2563EB'
    const secondary = t.secondary || '#F59E0B'
    const danger = t.error || '#EF4444'
    const surface = t.surface || '#ffffff'
    const text = t.text || '#111827'
    const background = t.background || '#f9fafb'

    return {
      w: 620,
      h: 900,
      primary,
      secondary,
      danger,
      surface,
      text,
      background,
      rowBg: '#ffffff',
      activeBg: '#E8F0FE', // soft blue for active row
      rowText: text,
      muted: '#6B7280',
      searchBg: '#F3F4F6',
      searchColor: '#6B7280',
      _searchFocused: false,
    }
  },

  computed: {
    filtered() {
      const q = (this.query || '').toLowerCase().trim()
      if (!q) return this.notes || []
      return (this.notes || []).filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.body || '').toLowerCase().includes(q)
      )
    },
    searchText() {
      return this._searchFocused || this.query
        ? `Search: ${this.query || ''}`
        : 'Search notes...'
    },
  },

  methods: {
    $itemSnippet(body) {
      if (!body) return ''
      const trimmed = body.replace(/\s+/g, ' ').slice(0, 48)
      return trimmed + (body.length > 48 ? '…' : '')
    },

    $emitSelect(e) {
      const item = e?.ctx?.item
      if (item && item.id) {
        this.$emit('select', { id: item.id })
      }
    },

    $emitCreate() {
      this.$emit('create')
    },

    $emitDelete(e) {
      const item = e?.ctx?.item
      if (item && item.id) {
        this.$emit('delete', { id: item.id })
      }
    },

    $focusCreate() {
      // Visual feedback could be added here if needed
    },

    $unfocusCreate() {
      // Reset states for create button focus
    },
  },

  input: {
    up() {
      // Move selection up within filtered list
      const list = this.filtered
      if (!list || list.length === 0) return
      const idx = Math.max(
        0,
        list.findIndex((n) => n.id === this.selectedId)
      )
      const next = idx > 0 ? list[idx - 1] : list[0]
      if (next) this.$emit('select', { id: next.id })
    },
    down() {
      const list = this.filtered
      if (!list || list.length === 0) return
      const idx = Math.max(
        0,
        list.findIndex((n) => n.id === this.selectedId)
      )
      const next = idx < list.length - 1 ? list[idx + 1] : list[list.length - 1]
      if (next) this.$emit('select', { id: next.id })
    },
    left() {},
    right() {},
    enter() {
      // selection already handled by @enter on rows
    },
    back() {},
    // Simple search input: simulate typing updates (for MVP without TextInput)
    // In a real app, integrate a proper input plugin or on-screen keyboard where applicable.
    // Here, we accept letters/numbers and backspace to mutate the query.
    any(e) {
      const key = e?.key || ''
      if (key === 'Backspace') {
        this.$emit('search', { query: (this.query || '').slice(0, -1) })
        return
      }
      if (key.length === 1 && key.match(/[\w\s.,-]/)) {
        this.$emit('search', { query: (this.query || '') + key })
      }
    },
    delete() {
      if (this.selectedId) {
        this.$emit('delete', { id: this.selectedId })
      }
    },
  },

  hooks: {
    ready() {
      this.patch({ smooth: { alpha: [1, { duration: 0.25 }] } })
    },
  },
})
