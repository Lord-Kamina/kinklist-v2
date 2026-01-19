<template>
  <button @click="cycleTheme">
    <span class="btn-text">{{ currentThemeIcon }} {{ currentThemeLabel }}</span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      theme: 'auto', 
      themes: ['auto', 'light', 'dark']
    };
  },
  computed: {
    currentThemeLabel() {
      return this.theme.charAt(0).toUpperCase() + this.theme.slice(1);
    },
    currentThemeIcon() {
      const icons = { auto: '⚙️', light: '☀️', dark: '🌙' };
      return icons[this.theme];
    }
  },
  watch: {
    theme(newTheme) {
//       localStorage.setItem('theme', newTheme);
      this.applyThemeToDocument(newTheme);
    }
  },
  mounted() {    
    this.applyThemeToDocument('auto');
  },
  methods: {
    cycleTheme() {
      const currentIndex = this.themes.indexOf(this.theme);
      const nextIndex = (currentIndex + 1) % this.themes.length;
      this.theme = this.themes[nextIndex];
    },
    applyThemeToDocument(theme) {
      const html = document.documentElement;
      if (theme === 'auto') {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', theme);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  background-color: --gen-pair(#246);
  color: --gen-pair(#DFE0E2);
  font-weight: bold;
  font-size: 1.2cqw;
  padding: 0.125cqw;
  border: 0;
  width: 100px;
  max-height:40px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-icon, .btn-text {
  position: absolute;
}
</style>