export default {
  data() {
    return {};
  },
  methods: {
    usernameRules() {
      return [
        {
          required: true,
          message: "Vui lòng nhập tên người dùng.",
          trigger: "blur",
        },
        {
          max: 20,
          message: "Tên người dùng phải ít hơn 20 kí tự.",
          trigger: "blur",
        },
        {
          pattern: /^\S+$/,
          message: "Tên người dùng không được chứa khoảng trắng.",
        },
        {
          pattern: /^[a-zA-Z0-9\s]*$/,
          message: "Tên người dùng không được chứa ký tự đặc biệt.",
        },
      ];
    },
    passwordRules() {
      return [
        { required: true, message: "Vui lòng nhập mật khẩu.", trigger: "blur" },
        {
          min: 8,
          message: "Mật khẩu phải có ít nhất 8 kí tự.",
          trigger: "blur",
        },
      ];
    },
    displayNameRules() {
      return [
        {
          required: true,
          message: "Vui lòng nhập tên hiển thị.",
          trigger: "blur",
        },
        {
          max: 50,
          message: "Tên hiển thị phải ít hơn 50 kí tự.",
          trigger: "blur",
        },
        {
          pattern: /^[\p{L}\p{N}\s]{1,49}$/u,
          message:
            "Tên hiển thị phải ít hơn 50 kí tự và không chứa kí tự đặc biệt",
        },
      ];
    },

    confirmPasswordRules(oldPassword, newPassword) {
      return [
        { required: true, message: "Vui lòng nhập mật khẩu.", trigger: "blur" },
        {
          validator: this.validateConfirmPassword,
          trigger: "blur",
        },
      ];
    },

    validateConfirmPassword(rule, value, callback) {
      const { newPassword } = this.form;

      if (value && value !== newPassword) {
        this.confirmPasswordError = "Mật khẩu xác nhận không khớp!";
        callback("Mật khẩu xác nhận không khớp!");
      } else {
        this.confirmPasswordError = "";
        callback();
      }
    },
  },
};
