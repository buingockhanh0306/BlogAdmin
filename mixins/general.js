export default {
  methods: {
    convertToSlug(text) {
      return text
        .normalize("NFD") // Chuẩn hóa văn bản
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d") // Chuyển đổi chữ "đ" thành "d"
        .replace(/Đ/g, "d") // Chuyển đổi chữ "Đ" thành "d"
        .toLowerCase() // Chuyển thành chữ thường
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
        .trim() // Loại bỏ khoảng trắng ở đầu và cuối
        .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, "-");
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
