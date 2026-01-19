<template>
  <button @click="triggerFileInput()">
    <span class="btn-text">Import</span>
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      @change="handleFileSelect"
      style="display: none"
    />
  </button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ImportButton extends Vue {
  triggerFileInput(): void {
    const fileInput = this.$refs.fileInput as HTMLInputElement;
    fileInput.click();
  }

  handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.$emit('fileSelected', file);
      // Reset the input so the same file can be selected again if needed
      target.value = '';
    }
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
