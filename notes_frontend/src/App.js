import Blits from '@lightningjs/blits'
import Header from './components/Header'
import NoteList from './components/NoteList'
import Editor from './components/Editor'

/**
 * NotesApp - LightningJS (Blits) Application
 * Layout:
 *  - Header (top)
 *  - Left pane: NoteList (with search/filter and selection)
 *  - Right pane: Editor (title + body, Save/Delete)
 * State is kept in-memory and synced to localStorage when available.
 * Colors follow Ocean Professional theme.
 */
const THEME = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  shadow: 0.15,
}

function nowIso() {
  return new Date().toISOString()
}

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" :color="$bg">
      <!-- Background subtle gradient block -->
      <Element x="0" y="0" w="1920" h="1080" :color="$bg" alpha="1" />
      <!-- Top Header -->
      <Header :title="$appTitle" :theme="$theme" />

      <!-- Content area -->
      <Element :x="0" :y="120" w="1920" h="960" color="transparent">
        <!-- Left Sidebar: Notes list -->
        <Element :x="60" :y="0" :w="$leftW" :h="$contentH" :color="$surface" :alpha="1" :zIndex="1" radius="24">
          <NoteList
            :notes="$notes"
            :selectedId="$selectedId"
            :query="$query"
            :theme="$theme"
            @select="$onSelect"
            @create="$onCreate"
            @search="$onSearch"
            @delete="$onDelete"
          />
        </Element>

        <!-- Right Pane: Editor -->
        <Element :x="$leftW + 90" :y="0" :w="$rightW" :h="$contentH" :color="$surface" radius="24">
          <Editor
            :note="$activeNote"
            :theme="$theme"
            @save="$onSave"
            @delete="$onDelete"
          />
        </Element>
      </Element>
    </Element>
  `,

  // Register child components
  components: {
    Header,
    NoteList,
    Editor,
  },

  state() {
    // Initialize notes from localStorage if present
    let notes = []
    try {
      const raw = globalThis.localStorage?.getItem('notes') || '[]'
      notes = JSON.parse(raw)
    } catch (e) {
      // ignore parse/storage errors
      notes = []
    }

    // Seed with a sample note if empty
    if (!notes || notes.length === 0) {
      notes = [
        {
          id: 'welcome',
          title: 'Welcome to Notes',
          body:
            'This is your Ocean Professional themed Notes app.\n\n- Use the left pane to select or create notes.\n- Edit the title and body on the right.\n- Press Save to persist locally.\n- Delete removes the note.\n\nKeyboard:\n- Up/Down to navigate list\n- Enter to open\n- Backspace/Delete to delete',
          createdAt: nowIso(),
          updatedAt: nowIso(),
        },
      ]
    }

    const selectedId = notes[0]?.id || null

    return {
      theme: THEME,
      appTitle: 'Ocean Notes',
      bg: THEME.background,
      surface: THEME.surface,
      leftW: 620,
      rightW: 1920 - (620 + 120), // left width + gaps (60+60)
      contentH: 900,
      notes,
      selectedId,
      query: '',
    }
  },

  computed: {
    activeNote() {
      return this.notes.find((n) => n.id === this.selectedId) || null
    },
  },

  methods: {
    persist() {
      try {
        globalThis.localStorage?.setItem('notes', JSON.stringify(this.notes))
      } catch (e) {
        // No-op if storage is unavailable
      }
    },

    // PUBLIC_INTERFACE
    $onCreate() {
      /** Create a new blank note with a timestamp id and select it. */
      const id = `note-${Date.now()}`
      const newNote = {
        id,
        title: 'Untitled',
        body: '',
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }
      this.notes = [newNote, ...this.notes]
      this.selectedId = id
      this.persist()
    },

    // PUBLIC_INTERFACE
    $onSelect({ id }) {
      /** Select a note by id. */
      this.selectedId = id
    },

    // PUBLIC_INTERFACE
    $onSearch({ query }) {
      /** Update search query to filter notes in NoteList. */
      this.query = query
    },

    // PUBLIC_INTERFACE
    $onSave({ id, title, body }) {
      /** Save updates to a note by id. */
      const idx = this.notes.findIndex((n) => n.id === id)
      if (idx >= 0) {
        const updated = {
          ...this.notes[idx],
          title,
          body,
          updatedAt: nowIso(),
        }
        // immutably update list
        this.notes = [
          ...this.notes.slice(0, idx),
          updated,
          ...this.notes.slice(idx + 1),
        ]
        this.persist()
      }
    },

    // PUBLIC_INTERFACE
    $onDelete({ id }) {
      /** Delete a note by id, and select next available. */
      const idx = this.notes.findIndex((n) => n.id === id)
      if (idx >= 0) {
        const nextList = this.notes.filter((n) => n.id !== id)
        this.notes = nextList
        if (this.selectedId === id) {
          this.selectedId = nextList[0]?.id || null
        }
        this.persist()
      }
    },
  },

  input: {
    back() {
      // Reserved for router in future
    },
  },

  hooks: {
    ready() {
      // Smooth background transition effect on load
      this.patch({
        smooth: { alpha: [1, { duration: 0.5 }] },
      })
    },
  },
})
