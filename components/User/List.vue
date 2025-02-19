<template>
  <div>
    <span class="title">Quản lý tài khoản</span>
    <div class="button-add">
      <a-button type="primary" icon="plus" @click="isShowModalAddUser = true">
        Thêm tài khoản
      </a-button>
    </div>
    <a-table :columns="columns" :data-source="listUsers" row-key="id">
      <span
        :style="{
          color: role ? '#0D7C66' : '#C75B7A',
          fontWeight: 700,
        }"
        slot="role"
        slot-scope="role"
      >
        {{ role ? "Quản trị viên" : "Nhân viên" }}
      </span>
      <template slot="action" slot-scope="text, record">
        <span
          :style="{
            color: !record.is_active ? '#0D7C66' : '#C75B7A',
            cursor: 'pointer',
          }"
          @click="handleClickActive(record)"
        >
          {{ record.is_active ? "Huỷ kích hoạt" : "Kích hoạt" }}
        </span>
      </template>
    </a-table>
    <ModalAddUser
      :visible="isShowModalAddUser"
      @handleSubmit="handleAddUser"
      @handleCancel="closeModalAddUser"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "UserList",
  data() {
    return {
      isShowModalAddUser: false,
      columns: [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên người dùng", dataIndex: "username", key: "username" },
        {
          title: "Phân quyền",
          dataIndex: "role",
          key: "role",
          scopedSlots: { customRender: "role" },
        },
        { title: "Tên hiển thị", dataIndex: "displayName", key: "displayName" },
        {
          title: "Thao tác",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    ...mapFields("users", ["listUsers"]),
  },
  async mounted() {
    // await this.getListUsers();
  },
  methods: {
    ...mapActions("users", ["getListUsers", "activeUser", "addUser"]),
    async handleAddUser(payload) {
      try {
        const result = await this.addUser(payload);
        if (result.status === "success") {
          this.getListUsers();
          this.$notification["success"]({
            message: "Thông báo",
            description: "Thêm người dùng thành công",
          });
        }
      } catch (error) {
        this.$notification["error"]({
          message: "Thông báo",
          description: error.response.data.message,
        });
      } finally {
        this.closeModalAddUser();
      }
    },
    async handleClickActive(record) {
      if (record.id === this.$auth.user.id) {
        this.$notification["error"]({
          message: "Thông báo",
          description: "Không thể huỷ kích hoạt khi đang đăng nhập.",
        });
        return;
      }
      if (record.is_active) {
        this.$confirm({
          title: `Bạn có chắc chắn muốn huỷ kích hoạt \"${record.displayName}\" không?`,
          okText: "Huỷ kích hoạt",
          okType: "danger",
          cancelText: "Bỏ qua",
          onOk: () => {
            return this.handleActiveUser({ id: record.id, is_active: 0 });
          },
          onCancel() {},
        });
      } else {
        this.handleActiveUser({ id: record.id, is_active: 1 });
      }
    },
    async handleActiveUser(payload) {
      try {
        const result = await this.activeUser(payload);
        if (result.status === "success") {
          this.$notification["success"]({
            message: "Thông báo",
            description: payload.is_active
              ? "Kích hoạt tài khoản thành công!"
              : "Huỷ kích hoạt tài khoản thành công!",
          });
          this.getListUsers();
        }
      } catch (error) {
        this.$notification["error"]({
          message: "Thông báo",
          description: payload.is_active
            ? "Kích hoạt tài khoản thành công!"
            : "Huỷ kích hoạt tài khoản thành công!",
        });
      }
    },
    closeModalAddUser() {
      this.isShowModalAddUser = false;
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
