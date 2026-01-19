<template>
  <Dialog
    titleText="About"
    @close="close()"
  >
    <div class="about-dialog-content">
      <p>
        Kinklist was created by <a href="https://www.reddit.com/user/Goctionni/">Goctionni</a> to help people easily and quickly communicate their
        preferences. It is open source under the MIT license. You are thus free modify source
        code in any way you wish. Credit is appreciated but not required.
      </p>
      <p>
        This version was modified by Lord-Kamina. If you have questions, suggestions or fixes, file an issue over at <a href="https://github.com/Lord-Kamina/kinklist-v2" target="_blank">Github</a>.
      </p>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

import Dialog from "./Dialog.vue";

@Component({
  components: {
    Dialog,
  },
})
export default class AboutDialog extends Vue {
  @Prop() message!: string;

  @Emit()
  close(): void { /* Event emitted */ }
}
</script>

<style lang="scss" scoped>
.about-dialog-content {
  width: 400px;
  width: max(400px, min(80vw, 650px));
  padding: 10px;

  p:first-child {
    margin-top: 0;
  }
}
</style>
