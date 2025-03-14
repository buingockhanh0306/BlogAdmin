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

      <a-form-model-item ref="image_url" label="Ảnh banner" prop="image_url">
        <a-upload-dragger
          name="file"
          :multiple="false"
          :remove="true"
          :showUploadList="false"
          @change="handleChange"
        >
          <template v-if="!imagePreview">
            <p class="ant-upload-drag-icon upload_banner">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">Kéo thả hoặc click để tải ảnh lên</p>
            <p class="ant-upload-hint">
              Chỉ hỗ trợ định dạng ảnh: .jpg, .jpeg, .png
            </p>
          </template>
          <div v-else>
            <img
              :src="imagePreview"
              alt="Preview"
              style="max-width: 300px; margin-top: 10px"
            />
          </div>
        </a-upload-dragger>
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
import { storage, ref, uploadBytes, getDownloadURL } from "~/plugins/firebase";

const DEFAULT_FORM = {
  title: "",
  slug: "",
  categoryIds: null,
  content: "",
  image_url: "",
};

export default {
  name: "PostCreate",
  mixins: [ruleValidator, general],
  data() {
    return {
      msgContent: "",
      imagePreview: null,
      form: { ...DEFAULT_FORM },
      rules: {
        title: this.titleRules(),
      },
      file: null,
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
        this.form.slug = "";
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
    async handleChange(info) {
      this.file = info.file.originFileObj;
      this.imagePreview = URL.createObjectURL(this.file);
    },
    onReturn() {
      this.$router.push("/posts/");
    },
    async onSubmit() {
      await this.handleUploadImage();
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
    async handleUploadImage() {
      const fileRef = ref(storage, `uploads/${this.file.name}`); // Tạo đường dẫn lưu file
      await uploadBytes(fileRef, this.file);
      const url = await getDownloadURL(fileRef);
      this.form.image_url = url;
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
::v-deep(.ant-upload.ant-upload-drag) {
  width: 50%;
  margin: 0 auto;
}
</style>
