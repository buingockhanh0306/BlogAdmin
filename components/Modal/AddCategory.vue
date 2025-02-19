<template>
  <a-modal
    v-model="isShow"
    title="Thêm danh mục"
    ok-text="Thêm"
    cancel-text="Huỷ"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="login-form"
    >
      <a-form-model-item ref="name" label="Tên danh mục" prop="name">
        <a-input
          v-model.trim="form.name"
          placeholder="Tên danh mục..."
          @input="handleInput('name')"
          @blur="handleBlur('name')"
        />
      </a-form-model-item>

      <a-form-model-item ref="slug" label="Đường dẫn" prop="slug">
        <a-input v-model.trim="form.slug" disabled type="slug" />
      </a-form-model-item>

      <a-form-model-item ref="tag_color" label="Màu tag" prop="tag_color">
        <input
          class="color_input"
          type="color"
          id="head"
          name="head"
          v-model="form.tag_color"
        />
      </a-form-model-item>

      <a-form-model-item ref="description" label="Mô tả" prop="description">
        <a-textarea
          v-model.trim="form.description"
          placeholder="Mô tả..."
          :auto-size="{ minRows: 5, maxRows: 8 }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
import general from "~/mixins/general";
export default {
  name: "ModalAddCategory",
  mixins: [ruleValidator, general],
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
        slug: "",
        tag_color: "#ff0000",
        description: "",
      },
      rules: {
        name: this.nameRules(),
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = {
          name: "",
          slug: "",
          tag_color: this.getRandomColor(),
          description: "",
        };
      }
    },
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
  methods: {
    handleInput(field) {
      if (field === "name") {
        this.form.slug = ``;
      }
      this.$refs.ruleForm.clearValidate();
    },
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$emit("handleSubmit", this.form);
        } else {
          return false;
        }
      });
    },
    handleBlur(field) {
      this.$refs.name.onFieldBlur();
      if (field === "name" && this.form.name) {
        this.form.slug = this.convertToSlug(this.form.name);
      }
    },
    cancel() {
      this.$refs.ruleForm.clearValidate();
      this.$emit("handleCancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.color_input {
  border: none;
  outline: none;
  border-radius: 6px;
  transition: box-shadow 0.3s;
  box-shadow: 0 0 0 2px #ddd;
  width: 80px;
  height: 30px;
  cursor: pointer;
  padding: 0;
}
</style>
