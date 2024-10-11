<template>
  <a-modal
    v-model="isShow"
    title="Thay đổi mật khẩu"
    ok-text="Xác nhận"
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
      <a-form-model-item
        ref="password"
        label="Mật khẩu hiện tại"
        prop="password"
        :validate-status="errorMessage ? 'error' : ''"
        :help="errorMessage"
      >
        <a-input-password
          v-model="form.password"
          type="password"
          placeholder="Mật khẩu hiện tại"
          @input="handleInput('password')"
        />
      </a-form-model-item>
      <a-form-model-item
        ref="newPassword"
        label="Mật khẩu mới"
        prop="newPassword"
      >
        <a-input-password
          v-model="form.newPassword"
          type="password"
          placeholder="Mật khẩu mới"
          @input="handleInput"
          @blur="
            () => {
              $refs.newPassword.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item
        ref="confirmPassword"
        label="Nhập lại mật khẩu mới"
        prop="confirmPassword"
        :validate-status="confirmPasswordError ? 'error' : ''"
        :help="confirmPasswordError"
      >
        <a-input-password
          v-model="form.confirmPassword"
          type="password"
          placeholder="Mật khẩu"
          @input="handleInput"
          @blur="
            () => {
              $refs.confirmPassword.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
import { mapFields } from "vuex-map-fields";
export default {
  name: "ModalChangePassword",
  mixins: [ruleValidator],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmPasswordError: "",
      form: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        password: this.passwordRules(),
        newPassword: this.passwordRules(),
        confirmPassword: this.confirmPasswordRules(),
      },
    };
  },
  computed: {
    ...mapFields("users", ["errorMessage"]),
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
      this.confirmPasswordError = "";
      if (field === "password") {
        this.errorMessage = "";
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$emit("handleChangePassword", {
            password: this.form.password,
            newPassword: this.form.newPassword,
          });
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
