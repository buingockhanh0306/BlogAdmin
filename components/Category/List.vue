<template>
  <div>
    <span class="title">Quản lý danh mục</span>
    <div class="button-add">
      <a-button
        type="primary"
        icon="plus"
        @click="isShowModalAddCategory = true"
      >
        Thêm danh mục
      </a-button>
    </div>
    <a-table :columns="columns" :data-source="listCategories" row-key="id">
      <div
        :style="{
          width: '60px',
          height: '20px',
          'border-radius': '4px',
          'background-color': tag_color || '#666',
        }"
        slot="tag_color"
        slot-scope="tag_color"
      ></div>
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
          @click="openModalUpdateCategory(record)"
          class="icon-edit"
          type="edit"
        />
      </template>
      <span slot="slug" slot-scope="slug"> /{{ slug }} </span>
    </a-table>
    <ModalAddCategory
      :visible="isShowModalAddCategory"
      @handleSubmit="handleAddCategory"
      @handleCancel="closeModalAddCategory"
    />
    <ModalUpdateCategory
      :visible="isShowModalUpdateCategory"
      :recordSelected="recordSelected"
      @handleSubmit="handleUpdateCategory"
      @handleCancel="isShowModalUpdateCategory = false"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "CategoryList",
  data() {
    return {
      isShowModalAddCategory: false,
      isShowModalUpdateCategory: false,
      recordSelected: null,
      columns: [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên danh mục", dataIndex: "name", key: "name" },
        {
          title: "Màu tag",
          dataIndex: "tag_color",
          key: "tag_color",
          scopedSlots: { customRender: "tag_color" },
        },
        {
          title: "Đường dẫn",
          dataIndex: "slug",
          key: "slug",
          scopedSlots: { customRender: "slug" },
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
    ...mapFields("categories", ["listCategories"]),
  },
  async mounted() {
    await this.getListCategories(false);
  },
  methods: {
    ...mapActions("categories", [
      "getListCategories",
      "addCategory",
      "updateCategory",
    ]),
    async handleAddCategory(payload) {
      try {
        const result = await this.addCategory(payload);
        console.log(result);

        if (result.id) {
          await this.getListCategories();
          this.$notification["success"]({
            message: "Thông báo",
            description: "Thêm danh mục thành công!",
          });
          this.closeModalAddCategory();
        }
      } catch (error) {
        this.$notification["error"]({
          message: "Thông báo",
          description: error.response.data.message,
        });
      }
    },
    closeModalAddCategory() {
      this.isShowModalAddCategory = false;
    },
    openModalUpdateCategory(record) {
      this.recordSelected = record;

      this.isShowModalUpdateCategory = true;
    },
    async handleUpdateCategory(payload) {
      try {
        await this.updateCategory(payload);
        await this.getListCategories();
        this.$notification["success"]({
          message: "Thông báo",
          description: "Cập nhật danh mục thành công!",
        });
        this.isShowModalUpdateCategory = false;
      } catch (error) {
        this.$notification["error"]({
          message: "Thông báo",
          description: error.response.data.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/variables.scss";
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
