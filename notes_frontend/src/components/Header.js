import Blits from '@lightningjs/blits'

/**
 * Header component
 * Renders the app title bar with primary colored accent and soft gradient background.
 */
export default Blits.Component('Header', {
  props: ['title', 'theme'],

  template: `
    <Element :x="0" :y="0" w="1920" h="120" :color="$bg">
      <!-- Gradient overlay block -->
      <Element x="0" y="0" w="1920" h="120" :color="$bg" alpha="1" />
      <!-- Title container with primary underline -->
      <Element :x="60" :y="24" :w="$titleW" h="72" :color="$surface" radius="18" :shader="$shadowShader" :shaderProps="$shadowProps">
        <Text :x="24" :y="20" :content="$title" :textColor="$text" fontSize="36" />
        <Element :x="0" :y="70" :w="$titleW" h="4" :color="$primary" alpha="0.9" />
      </Element>
    </Element>
  `,

  state() {
    const theme = this.theme || {
      primary: '#2563EB',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
    }

    return {
      bg: theme.background,
      surface: theme.surface,
      text: theme.text,
      primary: theme.primary,
      titleW: 800,
      shadowShader: 'FastBlur',
      shadowProps: { amount: 0.15, radius: 16 },
    }
  },

  hooks: {
    ready() {
      // Emphasize the header appearance with a slight fade-in
      this.patch({ smooth: { alpha: [1, { duration: 0.4 }] } })
    },
  },
})
