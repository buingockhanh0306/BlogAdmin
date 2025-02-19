<template>
  <div>
    <span class="title">Chỉnh sửa bài viết</span>
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

      <a-form-model-item ref="is_active" label="Trạng thái" prop="is_active">
        <a-switch
          :value="!!form.is_active"
          :checked="!!form.is_active"
          @change="form.is_active = !form.is_active"
        />
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
          @input="handleInput('content')"
          @blur="handleBlur('content')"
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
            Cập nhật
          </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import ruleValidator from "~/mixins/ruleValidator";
import general from "~/mixins/general";
import { mapFields } from "vuex-map-fields";
import { mapActions } from "vuex";
export default {
  name: "PostDetail",
  mixins: [ruleValidator, general],
  data() {
    return {
      msgContent: "",
      form: {
        title: "",
        slug: "",
        categoryIds: null,
        content: "",
        is_active: true,
      },
      rules: {
        title: this.titleRules(),
      },
    };
  },
  computed: {
    ...mapFields({
      detailPost: "posts.detailPost",
      listCategories: "categories.listCategories",
    }),
  },
  async mounted() {
    await this.getDetailPost(this.$route.params.id);
    this.form = {
      ...this.form,
      title: this.detailPost.title,
      slug: this.detailPost.slug,
      categoryIds: this.detailPost.categoryIds,
      content: this.detailPost.content,
      is_active: this.detailPost.is_active,
    };
  },

  methods: {
    ...mapActions("posts", ["getDetailPost", "updatePost"]),
    getCategoryName(categoryId) {
      return this.listCategories.find((item) => item.id == categoryId)?.name;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid && this.form.content && this.form?.categoryIds?.length) {
          try {
            await this.updatePost({
              id: this.$route.params.id,
              ...this.form,
            });
            this.onReturn();
            this.$notification["success"]({
              message: "Thông báo",
              description: "Thêm bài viết thành công!",
            });
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
    handleInput(field) {
      if (field === "content") {
        this.msgContent = "";
      }
      if (field === "title") {
        this.form.slug = ``;
        this.$refs.ruleForm.clearValidate();
      }
    },
    handleBlur(field) {
      if (field === "title" && this.form.title) {
        this.$refs.title.onFieldBlur();
        this.form.slug = this.convertToSlug(this.form.title);
      }
      if (field === "content" && !this.form.content) {
        this.msgContent = "Vui lòng nhập nội dung bài viết";
      }
    },
    onReturn() {
      this.$router.push("/posts/");
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
