<template>
  <div>
    <Editor
      :api-key="tinyMCEKey"
      :init="initEditor"
      :value="value"
      @input="onInput"
      @onBlur="onBlur"
    />
    <p class="text-red">{{ message }}</p>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  name: "CommonEditor",
  components: { Editor },
  data() {
    return {
      tinyMCEKey: process.env.tinyMCEKey,
      initEditor: {
        height: 500,
        menubar: false,
        plugins: [],
        toolbar:
          "undo redo | fontselect | formatselect link image | bold italic underline | fontsizeselect  forecolor backcolor |\
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help",
      },
    };
  },
  props: {
    message: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInput(value) {
      this.$emit("update:value", value);
      this.$emit("input");
    },
    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="scss"></style>
