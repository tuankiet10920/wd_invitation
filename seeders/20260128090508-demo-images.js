"use strict";

import fs from "fs";
import path from "path";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const typeImageAdmin = 8;
    const data = [
      {
        url: "effect-gif-1.gif",
        id_image_type: 8,
        id_min_package: 2,
        id_user: null,
        type: "img",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "effect-gif-2.gif",
        id_image_type: 8,
        id_min_package: 2,
        id_user: null,
        type: "img",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "effect-gif-3.gif",
        id_image_type: 8,
        id_min_package: 2,
        id_user: null,
        type: "img",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "effect-gif-4.gif",
        id_image_type: 8,
        id_min_package: 2,
        id_user: null,
        type: "img",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // images admin
    ];
 
     // Dynamically load admin-uploaded images from the log file
     const adminLogPath = path.join(process.cwd(), "seeders", "admin_upload_records.txt");
     if (fs.existsSync(adminLogPath)) {
       const logContent = fs.readFileSync(adminLogPath, "utf-8");
       // Extract filenames from the JS-like snippets in the text file
       const urls = [...logContent.matchAll(/url:\s*"(.*?)"/g)].map(m => m[1]);
       for (const filename of urls) {
         data.push({
           url: filename,
           type: "img",
           id_image_type: typeImageAdmin,
           id_user: 1, // Default to admin root
           id_min_package: null,
           createdAt: new Date(),
           updatedAt: new Date(),
         });
       }
     }

    try {
      // Setup base mapping for old logic
      const legacySlugMap = {
        "chu-hy": 4,
        "hoa-cuoi": 3,
        "nhan-vat": 2,
        "trai-tim": 5,
        "yeu-to-dam": 1,
      };

      // Tự động map ID từ DB thực tế cho các Category mới đồng bộ về
      // seeders chạy thẳng query db nếu có (nếu chưa có db thì phải chạy lại db:seed)
      const slugMap = { ...legacySlugMap };
      let bgSystemId = 6; // fallback
      try {
        const [types] = await queryInterface.sequelize.query(
          "SELECT id, slug, `key` FROM image_types",
        );
        for (const t of types) {
          if (t.key === "stock") slugMap[t.slug] = t.id;
          if (t.key === "background-system") bgSystemId = t.id;
        }
      } catch (e) {
        console.log(
          "Could not query DB for mapping, fallback to legacy/hardcoded missing.",
        );
      }

      const listsDir = "./public/images/stocks/lists";
      if (fs.existsSync(listsDir)) {
        const files = fs.readdirSync(listsDir);
        for (const file of files) {
          if (
            file.endsWith(".png") ||
            file.endsWith(".webp") ||
            file.endsWith(".jpg") ||
            file.endsWith(".svg")
          ) {
            // Tìm định dạng <slug>-<số>.wep/png/svg
            // vì file tải về lưu dưới dạng slug + vị trí (vd nhan-vat-1.png)
            const match = file.match(/^(.+?)-?\d*\.\w+$/);
            let currentSlug = "";
            if (match) {
              currentSlug = match[1]; // lấy chữ "nhan-vat"
            }

            // tìm kiếm trong map (nếu thư mục auto tạo là tên <slug>-<số>.png)
            // nhưng tải về ghi đè file có thể là "<slug>1.png" -> fallback cho phép slug có số ở cuối
            let typeId = 1;
            if (slugMap[currentSlug]) typeId = slugMap[currentSlug];
            else {
              // search if StartsWith fallback for old logic
              for (const key in slugMap) {
                if (file.startsWith(key)) {
                  typeId = slugMap[key];
                  break;
                }
              }
            }

            // Extract index if possible or use a counter
            let fileIndex = "1";
            const idxMatch = file.match(/\d+/);
            if (idxMatch) fileIndex = idxMatch[0];

            // Trích xuất phần đuôi mở rộng gốc của file (vd: jpg, png, webp)
            const extStr = file.split(".").pop() || "png";
            const isSvg = extStr === "svg";

            data.push({
              url: `${currentSlug}${fileIndex}.${extStr}`, // Theo đúng format yêu cầu: <slug><stt>.<ext>
              type: isSvg ? "svg" : "img",
              id_image_type: typeId,
              id_min_package: 1,
              id_user: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }

      const stocksDir = "./public/images/stocks";
      if (fs.existsSync(stocksDir)) {
        const files = fs.readdirSync(stocksDir);
        for (const file of files) {
          let typeId = 1;
          for (const key in legacySlugMap) {
            if (file.startsWith(key)) {
              typeId = legacySlugMap[key];
              break;
            }
          }

          if (
            file.endsWith(".png") ||
            file.endsWith(".webp") ||
            file.endsWith(".jpg") ||
            file.endsWith(".svg")
          ) {
            const isSvgOld = file.endsWith(".svg");
            data.push({
              url: file,
              type: isSvgOld ? "svg" : "img",
              id_image_type: typeId,
              id_min_package: 1,
              id_user: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }

      // Quét thư mục background tải về từ API để seed
      const bgDir = "./public/backgrounds/list";
      if (fs.existsSync(bgDir)) {
        const files = fs.readdirSync(bgDir);
        for (const file of files) {
          if (
            file.endsWith(".png") ||
            file.endsWith(".webp") ||
            file.endsWith(".jpg") ||
            file.endsWith(".svg")
          ) {
            const isSvgBg = file.endsWith(".svg");
            data.push({
              url: file, // url chỉ là tên file vì Frontend tự build: `/backgrounds/list/${url}`
              type: isSvgBg ? "svg" : "img",
              id_image_type: bgSystemId,
              id_min_package: 1,
              id_user: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }
    } catch (e) {
      console.log("Error reading stocks directory:", e);
    }

    if (data.length > 0)
      Object.assign(
        data,
        data.map((o) => o),
      ); // To bypass linter if needed
    console.log("Bulk inserting images: ", data.length);
    await queryInterface.bulkInsert("images", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("images", null, {});
  },
};
