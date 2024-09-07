<template>
  <div class="login-container">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="login-form"
    >
      <a-form-model-item ref="email" label="Email" prop="email">
        <a-input
          v-model="form.email"
          placeholder="Email"
          @input="handleInput('email')"
          @blur="
            () => {
              $refs.email.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="password" label="Mật khẩu" prop="password">
        <a-input
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
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please select Activity zone",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleInput(field) {
      this.$refs.ruleForm.clearValidate();
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await this.$auth.loginWith("local", {
            data: this.form,
          });
          this.$router.push("/admin");
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
}
</style>
