<template>
  <div>
    <span class="title">Quản lý bài viết</span>
    <div class="button-add">
      <a-button type="primary" icon="plus" @click="clickAddPost">
        Thêm bài viết
      </a-button>
    </div>
    <a-table :columns="columns" :data-source="listPosts" row-key="id">
      <div slot="categoryIds" slot-scope="categoryIds">
        <a-tag
          :color="getColor(categoryId)"
          v-for="(categoryId, index) in categoryIds"
          :key="index"
        >
          {{ getCategoryName(categoryId) }}
        </a-tag>
      </div>
      <span
        :style="{
          color: is_active ? '#0D7C66' : '#C75B7A',
          fontWeight: 700,
        }"
        slot="is_active"
        slot-scope="is_active"
      >
        {{ is_active ? "Hoạt động" : "Vô hiệu hoá" }}
      </span>
      <template slot="action" slot-scope="text, record">
        <a-icon
          @click="clickUpdatePost(record)"
          class="icon-edit"
          type="edit"
        />
      </template>
      <span slot="slug" slot-scope="slug"> /{{ slug }} </span>
    </a-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "PostList",
  data() {
    return {
      isShowModalAddCategory: false,
      isShowModalUpdateCategory: false,
      recordSelected: null,
      columns: [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tiêu đề bài viết", dataIndex: "title", key: "title" },
        { title: "Tác giả", dataIndex: "author", key: "author" },
        {
          title: "Đường dẫn",
          dataIndex: "slug",
          key: "slug",
          scopedSlots: { customRender: "slug" },
        },
        {
          title: "Vote",
          dataIndex: "votes",
          key: "votes",
          scopedSlots: { customRender: "votes" },
        },
        {
          title: "Danh mục",
          dataIndex: "categoryIds",
          key: "categoryIds",
          scopedSlots: { customRender: "categoryIds" },
        },
        {
          title: "Trạng thái",
          dataIndex: "is_active",
          key: "is_active",
          scopedSlots: { customRender: "is_active" },
        },
        {
          title: "",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    ...mapFields({
      listCategories: "categories.listCategories",
      listPosts: "posts.listPosts",
      detailPost: "posts.detailPost",
    }),
  },
  async mounted() {
    await this.getListPosts();
    await this.getListCategories();
  },
  methods: {
    ...mapActions("posts", ["getListPosts"]),
    ...mapActions("categories", ["getListCategories"]),
    clickAddPost() {
      this.$router.push("/posts/create/");
    },
    clickUpdatePost(record) {
      this.detailPost = record;
      this.$router.push(`/posts/${record.id}/`);
    },
    getCategoryName(categoryId) {
      return this.listCategories.find((item) => item.id == categoryId)?.name;
    },
    getColor(categoryId) {
      return this.listCategories.find((item) => item.id == categoryId)
        ?.tag_color;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/variables";
.button-add {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.ant-form-item {
  margin: 0;
}
.ant-form-item[name="role"] {
  display: flex;
  margin: 20px 0;
}
.icon-edit {
  color: $blue-color;
  cursor: pointer;
}
</style>
