<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item
          :key="item.key"
          v-for="item in sidebar"
          @click="$router.push(item.link)"
        >
          <a-icon :type="item.icon" />
          <span>{{ item.text }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div
          class="avatar-dropdown"
          @click="() => (collapsedAvatar = !collapsedAvatar)"
        >
          <a-dropdown :trigger="['click']">
            <a-avatar
              v-if="$auth.$state.user?.avatar"
              :src="`${urlImage}/${$auth.$state.user?.avatar}`"
            />
            <a-avatar
              style="color: #f56a00; background-color: #fde3cf"
              v-else
              class="avatar"
              >{{ textAvatar }}</a-avatar
            >
            <a-menu slot="overlay">
              <a-menu-item class="ellipsis" key="1">
                {{ displayName }}
              </a-menu-item>
              <a-menu-item
                key="2"
                @click="$router.push(`/accounts/${$auth.$state.user.id}`)"
              >
                <a-icon type="user" />Thông tin tài khoản
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3" @click="showConfirm">
                <a-icon type="logout" /> Đăng xuất
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '87vh',
        }"
      >
        <nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  name: "defaultLayout",
  middleware: "auth",
  data() {
    return {
      urlImage: process.env.urlImage,
      collapsed: false,
      collapsedAvatar: false,
      sidebar: [
        {
          key: 1,
          text: "Dashboard",
          icon: "dashboard",
          link: "/",
        },
        {
          key: 2,
          text: "Quản lý tài khoản",
          icon: "user",
          link: "/accounts",
        },
        {
          key: 3,
          text: "Quản lý danh mục",
          icon: "unordered-list",
          link: "/categories",
        },
        {
          key: 4,
          text: "Quản lý bài viết",
          icon: "file-text",
          link: "/posts",
        },
      ],
    };
  },
  computed: {
    displayName() {
      return this.$auth.user?.email;
    },
    textAvatar() {
      const lastName = this.displayName?.split(" ");
      return lastName?.pop()[0];
    },
  },
  methods: {
    showConfirm() {
      this.$confirm({
        title: "Bạn có chắc chắn muốn đăng xuất không?",
        okText: "Đăng xuất",
        okType: "danger",
        cancelText: "Huỷ",
        onOk: () => {
          return this.handleLogout();
        },
        onCancel() {},
      });
    },
    clickAvatar() {
      this.collapsedAvatar = !this.collapsedAvatar;
    },
    async handleLogout() {
      await this.$auth.logout();
      this.$auth.reset();
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scope>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 166px;
  font-weight: 700 !important;
  cursor: default;
}

.ant-layout-header {
  display: flex !important;
  align-items: center;
}
.ant-layout-header {
  display: flex;
  justify-content: space-between; /* Aligns items to the left and right edges */
  align-items: center; /* Aligns items vertically center */
  background: rgb(255, 255, 255);
  padding: 0;
}
.avatar-dropdown {
  width: 66px;
  cursor: pointer;
}
</style>
