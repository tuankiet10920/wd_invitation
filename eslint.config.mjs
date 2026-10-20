// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  // Thêm một đối tượng cấu hình mới vào mảng
  rules: {
    // Tắt quy tắc "no-unused-vars"
    "no-unused-vars": "off",

    // Tùy chọn: Tắt quy tắc tương tự của TypeScript (nếu bạn dùng TypeScript)
    "@typescript-eslint/no-unused-vars": "off",

    // Tùy chọn: Tắt quy tắc của Vue (nếu bạn dùng Vue Script Setup)
    "vue/no-unused-vars": "off",

    "no-irregular-whitespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "vue/first-attribute-linebreak": "off",
    "vue/attributes-order": "off",
    "vue/html-self-closing": "off",
  },
});
// Your custom configs here
