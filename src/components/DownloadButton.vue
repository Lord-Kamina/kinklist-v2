<template>
  <button @click="emitClick()">
    <span class="btn-text">Download</span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DownloadButton extends Vue {
  emitClick(): void {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
button {
  background-color: --gen-pair(#246);
  color: --gen-pair(#DFE0E2);
  font-weight: bold;
  font-size: .95cqw;
  padding: 0.125cqw;
  border: 0;
  width: 90px;
  max-height:40px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-text {
  position: absolute;
}
</style>