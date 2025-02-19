<template>
  <div>
    <span class="title">Thêm bài viết mới</span>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="login-form"
    >
      <a-form-model-item ref="title" label="Tiêu đề bài viết" prop="title">
        <a-input
          v-model.trim="form.title"
          placeholder="Tiêu đề bài viết..."
          @input="handleInput('title')"
          @blur="handleBlur('title')"
        />
      </a-form-model-item>

      <a-form-model-item ref="slug" label="Đường dẫn" prop="slug">
        <a-input v-model.trim="form.slug" disabled type="slug" />
      </a-form-model-item>
      <a-form-model-item label="Danh mục" prop="type">
        <a-checkbox-group v-model="form.categoryIds">
          <a-checkbox
            v-for="category in listCategories"
            :key="category.id"
            :value="category.id"
            name="category_id"
          >
            {{ category.name }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>

      <a-form-model-item ref="content" label="Nội dung bài viết" prop="content">
        <CommonEditor
          :value.sync="form.content"
          @input="inputContent"
          @blur="blurContent"
          :message="msgContent"
        />
      </a-form-model-item>
      <a-form-model-item>
        <div class="group-btn">
          <a-button class="login-form-button" @click="onReturn">
            Quay lại
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            @click="onSubmit"
          >
            Tạo bài viết
          </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
import general from "~/mixins/general";
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "PostCreate",
  mixins: [ruleValidator, general],
  data() {
    return {
      msgContent: "",
      form: {
        title: "",
        slug: "",
        categoryIds: null,
        content: "",
      },
      rules: {
        title: this.titleRules(),
      },
    };
  },
  computed: {
    ...mapFields("posts", ["listPosts"]),
    ...mapFields("categories", ["listCategories"]),
  },
  async mounted() {
    await this.getListCategories();
  },
  methods: {
    ...mapActions("posts", ["getListPosts", "addPost"]),
    ...mapActions("categories", ["getListCategories"]),
    handleInput(field) {
      if (field === "title") {
        this.form.slug = ``;
      }
      this.$refs.ruleForm.clearValidate();
    },
    inputContent() {
      this.msgContent = "";
    },
    blurContent() {
      if (!this.form.content) {
        this.msgContent = "Vui lòng nhập nội dung bài viết";
      }
    },
    onReturn() {
      this.$router.push("/posts/");
    },
    onSubmit() {
      const payload = {
        ...this.form,
        author_id: this.$auth?.user?.id || 1,
      };
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid && this.form.content && this.form?.categoryIds?.length) {
          try {
            const res = await this.addPost(payload);
            if (res) {
              this.onReturn();
              this.$notification["success"]({
                message: "Thông báo",
                description: "Thêm bài viết thành công!",
              });
            }
          } catch (error) {
            this.$notification["error"]({
              message: "Thông báo",
              description: error.response.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },
    handleBlur(field) {
      this.$refs.title.onFieldBlur();
      if (field === "title" && this.form.title) {
        this.form.slug = this.convertToSlug(this.form.title);
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
.group-btn {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
}
</style>
