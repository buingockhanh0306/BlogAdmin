<template>
  <div class="login-container">
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
          @input="handleInput('username')"
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
          @input="handleInput('password')"
          @blur="
            () => {
              $refs.password.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-checkbox class="checkbox" @change="onChangeStaySignIn"
        >Duy trì đăng nhập
      </a-checkbox>

      <a-form-model-item>
        <div class="login-button">
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            @click="onSubmit"
          >
            Đăng nhập
          </a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import ruleValidator from "~/mixins/ruleValidator";
export default {
  mixins: [ruleValidator],
  name: "ModalAddUser",
  data() {
    return {
      form: {
        username: "",
        password: "",
        staySignIn: false,
      },
      rules: {
        username: this.usernameRules(),
      },
    };
  },
  methods: {
    onChangeStaySignIn(e) {
      this.staySignIn = +e.target.checked;
    },
    handleInput() {
      this.$refs.ruleForm.clearValidate();
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.$auth.loginWith("local", {
              data: this.form,
            });
            this.$router.push("/");
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
  },
};
</script>

<style scoped lang="scss">
// Define some variables for colors and other reusable values
$background-image: url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?cs=srgb&dl=pexels-jplenio-1103970.jpg&fm=jpg");
$white: #ffffff;
$shadow-color: rgba(0, 0, 0, 0.1);
$border-radius: 8px;
$label-color: #000;

.ant-form-item {
  margin-bottom: 0;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: $background-image no-repeat center center;
  background-size: cover;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background: $white;
  box-shadow: 0 4px 8px $shadow-color;
  border-radius: $border-radius;

  // Nested styles for form item labels inside login-form
  .ant-form-item-label {
    > label {
      color: $label-color;
    }
  }
  .login-button {
    display: flex;
    justify-content: center;
    margin: 10px;
  }
  .checkbox {
    margin-top: 10px;
  }
}
</style>
