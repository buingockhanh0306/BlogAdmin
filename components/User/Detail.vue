<template>
  <div>
    <span class="title">Thông tin tài khoản</span>
    <div class="content-edit">
      <div class="avatar-user">
        <a-avatar
          v-if="$auth.$state.user?.avatar"
          :size="128"
          :src="`${urlImage}/${$auth.$state.user?.avatar}`"
        />
        <a-avatar
          v-else
          :size="128"
          style="color: #f56a00; background-color: #fde3cf; font-size: 52px"
        >
          {{ textAvatar }}
        </a-avatar>

        <div class="under-avatar">
          <a-button type="link" @click="isShowModalChangeAvatar = true">
            Thay đổi ảnh
          </a-button>
          <a-button type="link" @click="isShowModalChangePassword = true">
            Đổi mật khẩu
          </a-button>
        </div>
      </div>
      <div class="form">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <a-form-model-item
            ref="username"
            label="Tên người dùng"
            prop="username"
          >
            <a-input
              v-model="form.username"
              placeholder="Tên người dùng"
              @input="handleInput"
              :disabled="isDisableForm"
              @blur="handleBlur('username')"
            />
          </a-form-model-item>

          <a-form-model-item
            ref="displayName"
            label="Tên hiển thị"
            prop="displayName"
          >
            <a-input
              v-model="form.displayName"
              :disabled="isDisableForm"
              placeholder="Tên hiển thị"
              @input="handleInput"
              @blur="handleBlur('displayName')"
            />
          </a-form-model-item>
          <div class="group-btn">
            <a-button
              html-type="submit"
              :type="!isDisableForm ? 'danger' : ''"
              class="login-form-button"
              @click="handleCancel"
            >
              {{ isDisableForm ? "Quay lại" : "Huỷ" }}
            </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :class="{
                'login-form-button': true,
                'green-button': !isDisableForm,
                'disabled-btn': isDisableButton,
              }"
              @click="handleEdit"
            >
              {{ isDisableForm ? "Chỉnh sửa thông tin" : "Xác nhận" }}
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <ModalChangePassword
      :visible="isShowModalChangePassword"
      @handleChangePassword="handleChangePassword"
      @handleCancel="closeModalChangePassword"
    />
    <ModalChangeAvatar
      :visible="isShowModalChangeAvatar"
      @handleCancel="isShowModalChangeAvatar = false"
    />
  </div>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "UserDetail",
  mixins: [ruleValidator],
  data() {
    return {
      urlImage: process.env.urlImage,
      isShowModalChangePassword: false,
      isShowModalChangeAvatar: false,
      isDisableForm: true,
      isError: false,
      isTyping: false,
      form: {
        username: "",
        displayName: "",
      },
      rules: {
        username: this.usernameRules(),
        displayName: this.displayNameRules(),
      },
    };
  },
  computed: {
    ...mapFields("users", ["errorMessage"]),
    textAvatar() {
      const lastName = this.$auth.$state.user?.displayName?.split(" ");
      return lastName?.pop()[0];
    },
    isDisableButton() {
      return (
        (!this.isDisableForm &&
          this.form.username === this.$auth.$state.user.username &&
          this.form.displayName === this.$auth.$state.user?.displayName) ||
        this.isFormError ||
        this.isTyping
      );
    },
    isFormError() {
      return this.isError;
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
  },
  mounted() {
    // this.initData();
  },
  methods: {
    ...mapActions("users", ["changePassword", "updateUser"]),
    validateForm() {
      return new Promise(() => {
        this.$refs.ruleForm.validate((valid) => {
          this.isError = !valid;
        });
      });
    },
    initData() {
      this.form = {
        ...this.form,
        username: this.$auth.$state.user.username,
        displayName: this.$auth.$state.user?.displayName,
      };
    },
    handleCancel() {
      if (this.isDisableForm) {
        return this.$router.go(-1);
      }
      this.isDisableForm = true;
      this.$refs.ruleForm.clearValidate();
      this.initData();
    },
    async handleEdit() {
      if (!this.isDisableForm) {
        try {
          const payload = {
            id: this.$route.params.id,
            username: this.form.username,
            displayName: this.form.displayName,
          };
          const result = await this.updateUser(payload);
          if (result) {
            await this.$auth.fetchUser();
            this.$notification["success"]({
              message: "Thông báo",
              description: "Thay đổi thông tin thành công!",
            });
            this.isDisableForm = true;
            return;
          }
        } catch (error) {
          this.$notification["error"]({
            message: "Thông báo",
            description: error.response.data.message,
          });
          return;
        }
      }
      this.isDisableForm = false;
    },
    closeModalChangePassword() {
      this.isShowModalChangePassword = false;
    },
    handleInput() {
      this.isTyping = true;
    },
    async handleBlur(field) {
      this.isTyping = false;
      this.$refs[field].onFieldBlur();
      await this.validateForm();
    },

    async handleChangePassword(data) {
      try {
        const payload = {
          id: this.$route.params.id,
          ...data,
        };
        await this.changePassword(payload);
        this.closeModalChangePassword();
        this.$notification["success"]({
          message: "Thông báo",
          description: "Đổi mật khẩu thành công!",
        });
      } catch (err) {
        let message;
        if (err.response.data.message === "old_password_incorrect") {
          message = "Bạn đã nhập sai mật khẩu hiện tại!";
        }
        this.errorMessage = message;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .under-avatar {
    margin: 20px;
  }
}
.group-btn {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.form {
  width: 60%;
}
.content-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
