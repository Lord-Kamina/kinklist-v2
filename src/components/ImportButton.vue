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
  background-color: #246;
  color: #FFF;
  font-weight: bold;
  font-size: 18px;
  border: 0;
  width: 150px;
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
