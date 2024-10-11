<template>
  <a-modal
    v-model="isShow"
    title="Thêm tài khoản"
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
      <a-form-model-item ref="username" label="Tên người dùng" prop="username">
        <a-input
          v-model="form.username"
          placeholder="Tên người dùng"
          @input="handleInput"
          @blur="
            () => {
              $refs.username.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="password" label="Mật khẩu" prop="password">
        <a-input-password
          v-model="form.password"
          type="password"
          placeholder="Mật khẩu"
          @input="handleInput"
          @blur="
            () => {
              $refs.password.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item
        ref="displayName"
        label="Tên hiển thị"
        prop="displayName"
      >
        <a-input
          v-model="form.displayName"
          placeholder="Tên hiển thị"
          @input="handleInput"
          @blur="
            () => {
              $refs.displayName.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item label="Phân quyền" name="role">
        <a-select ref="select" v-model="form.role" style="width: 120px">
          <a-select-option value="1">Quản trị viên</a-select-option>
          <a-select-option value="0">Nhân viên</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
export default {
  name: "ModalAddUser",
  mixins: [ruleValidator],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        displayName: "",
        role: "0",
      },
      rules: {
        username: this.usernameRules(),
        password: this.passwordRules(),
        displayName: this.displayNameRules(),
      },
    };
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
      this.$refs.ruleForm.clearValidate();
    },
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$emit("handleSubmit", { ...this.form, role: +this.form.role });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$refs.ruleForm.clearValidate();
      this.$emit("handleCancel");
    },
  },
};
</script>

<style lang="scss" scoped></style>
