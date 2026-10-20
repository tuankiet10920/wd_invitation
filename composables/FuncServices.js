// import { imageUrl } from "@/environment";
// import { alertStore } from "./counter";
import slugify from "slugify";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

export const services = {
  formatDay(string) {
    const dateObject = new Date(string);

    const year = dateObject.getFullYear();
    const month =
      dateObject.getMonth() + 1 < 10
        ? `0${dateObject.getMonth() + 1}`
        : dateObject.getMonth() + 1; // getMonth() trả về giá trị từ 0-11
    const day =
      dateObject.getDate() < 10
        ? `0${dateObject.getDate()}`
        : dateObject.getDate();

    return `${day}-${month}-${year}`;
  },
  formatDaytimeOrder(string, { isHasSecond = false } = {}) {
    const dateObject = new Date(string);

    const year = dateObject.getFullYear();
    const month =
      dateObject.getMonth() + 1 < 10
        ? `0${dateObject.getMonth() + 1}`
        : dateObject.getMonth() + 1; // getMonth() trả về giá trị từ 0-11
    const day =
      dateObject.getDate() < 10
        ? `0${dateObject.getDate()}`
        : dateObject.getDate();
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}${
      isHasSecond ? `:${seconds}` : ""
    }`;
  },
  /**
   *
   * @param {string} path
   * @returns {string} - link image
   */
  //   getImage(path, { isOr = false } = {}) {
  //     if (isOr) path = `/${path}`; // tùy vào dữ liệu be trả về sẽ có / hoặc không
  //     return imageUrl + path;
  //   },
  formatMoney(
    number,
    { type = "vi-VN", currency = "VND", style = "currency" } = {},
  ) {
    return new Intl.NumberFormat(type, { style, currency }).format(number);
  },
  calculateDiscount(original, discount) {
    original = parseInt(original);
    discount = parseInt(discount);
    return Math.round(100 - (discount / original) * 100);
  },
  calculatePercent(sum, current) {
    return (parseInt(current) / parseInt(sum)) * 100;
  },
  /**
   *
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns miliseconds
   */
  calculateCountdownTime(hours, minutes, seconds) {
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = MS_IN_SECOND * 60;
    const MS_IN_HOUR = MS_IN_MINUTE * 60;

    return hours * MS_IN_HOUR + minutes * MS_IN_MINUTE + seconds * MS_IN_SECOND;
  },
  /**
   *
   * @param {number} countdownTime -- milisecond
   * @returns {object} hours - minutes - seconds
   */
  getCountdown(countdownTime) {
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = MS_IN_SECOND * 60;
    const MS_IN_HOUR = MS_IN_MINUTE * 60;

    const hours = Math.floor(countdownTime / MS_IN_HOUR);

    const remainderAfterHours = countdownTime % MS_IN_HOUR;

    const minutes = Math.floor(remainderAfterHours / MS_IN_MINUTE);

    const seconds = Math.floor(
      (remainderAfterHours % MS_IN_MINUTE) / MS_IN_SECOND,
    );

    return {
      hours,
      minutes,
      seconds,
    };
  },
  /**
   *
   * @param {number} orderId
   * @return {string} - DH000000
   */
  formatOrderId(orderId) {
    let string;
    if (orderId >= 100000) string = `DH${orderId}`;
    else if (orderId >= 10000) string = `DH0${orderId}`;
    else if (orderId >= 1000) string = `DH00${orderId}`;
    else if (orderId >= 100) string = `DH000${orderId}`;
    else if (orderId >= 10) string = `DH0000${orderId}`;
    else string = `DH00000${orderId}`;
    return string;
  },
  replaceEscape(string) {
    let newString;
    newString = string.replace(/\\/g, "");
    // newString = newString.slice(6)
    return newString;
  },
  //   generateFilesCssAndJs(files, type) {
  //     files.forEach((file) => {
  //       let element;
  //       if (type == "css") {
  //         element = document.createElement("link");
  //         element.rel = "stylesheet";
  //         element.href = file;
  //         element.type = "text/css";
  //       } else if (type == "js") {
  //         element = document.createElement("script");
  //         element.src = file;
  //         element.async = false;
  //       }
  //       document.head.appendChild(element);
  //     });
  //   },
  //   removeFilesCssAndJs(files, type) {
  //     files.forEach((file) => {
  //       let selector;
  //       if (type === "css") {
  //         selector = `link[rel="stylesheet"][href$="${file}"]`;
  //       } else if (type === "js") {
  //         selector = `script[src$="${file}"]`;
  //       }
  //       const element = document.head.querySelector(selector);
  //       if (element) {
  //         document.head.removeChild(element);
  //       }
  //     });
  //   },
  /**
   * @param {*} string
   * @returns slug
   */
  generateSlug(string, replacement = "-") {
    return slugify(string, {
      replacement, // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
    });
  },
  //   fileToBase64(file) {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();

  //       // Đọc file dưới dạng data URL (chuỗi Base64)
  //       reader.readAsDataURL(file);

  //       // Khi đọc xong, kết quả sẽ có trong reader.result
  //       reader.onload = () => {
  //         resolve(reader.result);
  //       };

  //       // Xử lý lỗi nếu có
  //       reader.onerror = (error) => {
  //         reject(error);
  //       };
  //     });
  //   },
  /**
   *
   * @param {array} data
   * @param {string} nameSheat
   * @returns .xlsx
   */
  //   generateExcel(data, name = "Bảng tính Phúc An Solutions") {
  //     const worksheet = XLSX.utils.json_to_sheet(data);

  //     const workbook = XLSX.utils.book_new();

  //     XLSX.utils.book_append_sheet(workbook, worksheet, name);

  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });

  //     const dataBlob = new Blob([excelBuffer], {
  //       type: "application/octet-stream",
  //     });

  //     saveAs(dataBlob, `${this.generateSlug(name, "_")}.xlsx`);
  //   },
  //   /**
  //    * @param {file}
  //    * @returns array or blank array
  //    */
  //   importExcel(file) {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();

  //       // Sự kiện được gọi khi FileReader đọc file hoàn tất
  //       reader.onload = (e) => {
  //         const fileContent = e.target.result;
  //         try {
  //           // Đọc file Excel
  //           const workbook = XLSX.read(fileContent, { type: "binary" });

  //           // Lấy tên sheet đầu tiên
  //           const firstSheetName = workbook.SheetNames[0];
  //           const worksheet = workbook.Sheets[firstSheetName];

  //           // Chuyển đổi dữ liệu từ sheet sang mảng JSON
  //           const dataAsJson = XLSX.utils.sheet_to_json(worksheet);

  //           // Gán dữ liệu vào biến importedData để hiển thị
  //           console.log("Dữ liệu đã nhập:", dataAsJson);
  //           resolve(dataAsJson);
  //         } catch (error) {
  //           console.error("Lỗi khi đọc file Excel:", error);
  //           reject(error);
  //         }
  //       };

  //       // Đọc file dưới dạng binary string
  //       reader.readAsBinaryString(file);
  //     });
  //   },
  /**
   *
   * @param {*} number
   * @returns string point
   */
  formatPoint(number) {
    if (number === null || number === undefined) return "";

    let numStr = String(number);

    const parts = numStr.split(".");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );
    return formattedIntegerPart + decimalPart;
  },
  formatPhone(string) {
    if (string.length == 10)
      return `${string.slice(0, 4)} ${string.slice(4, 6)} ${string.slice(
        6,
        8,
      )} ${string.slice(8, 10)}`;
  },
  /**
   *
   * @param {array} nodes
   * @param {string} slugNeedToFind
   * @returns {array}
   */
  findNodesWithRecursive(nodes, slugNeedToFind) {
    /**
     * {
     *    level: index,
     *    index: current-index
     *    lengthOfList: length of current list in item
     * }
     */
    let arrayOfNodes = [];
    let isCatch = false;

    const recusiveBrowseListItems = (listInItem, level) => {
      if (isCatch) return isCatch; // if isCatch is true in before loop then return

      level++; //  increase level to increase index in array of nodes

      for (let index = 0; index < listInItem.length; index++) {
        if (listInItem[index].slug == slugNeedToFind) {
          // if find target, save target node and return
          arrayOfNodes[level] = {
            level,
            index,
            lengthOfList: listInItem["length"],
            slug: listInItem[index].slug,
          };

          isCatch = true;

          break;
        }

        if (isCatch) return isCatch;

        // if not find target, then save current node
        arrayOfNodes[level] = {
          level,
          index,
          lengthOfList: listInItem["length"],
          slug: listInItem[index].slug,
        };

        if (listInItem[index].list && listInItem[index].list.length > 0)
          recusiveBrowseListItems(listInItem[index].list, level);
      }

      return isCatch;
    };

    const findIndexOfRoute = (ex) => {
      for (let index = 0; index < ex.length; index++) {
        let level = 0;

        arrayOfNodes[level] = {
          level,
          index,
          lengthOfList: ex["length"],
          slug: ex[index]["slug"],
        };

        if (ex[index].list && ex[index].list.length > 0) {
          recusiveBrowseListItems(ex[index].list, level);
          if (isCatch) break;
        }
      }
      if (arrayOfNodes.length > 0) {
        const indexNodeFound = arrayOfNodes.findIndex(
          (node) => node.slug == slugNeedToFind,
        );
        // if index node found increase 1 digit less than length of array of node then delete all of nodes after index node found
        if (indexNodeFound + 1 < arrayOfNodes.length) {
          arrayOfNodes.splice(
            indexNodeFound + 1,
            arrayOfNodes.length - indexNodeFound + 1,
          );
        }
      }
    };

    findIndexOfRoute(nodes);

    return arrayOfNodes;
  },
  scrollToTop() {
    if (window.scrollY == 0) return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
  scrollToBottom() {
    const heightOfBody = document.body.scrollHeight;
    if (window.scrollY == heightOfBody) return;
    window.scrollTo({
      top: heightOfBody,
      behavior: "smooth",
    });
  },
  convertNumberOfDayInWeekToText(number) {
    let day = "";
    switch (number) {
      case 1:
        day = "Chủ nhật";
        break;
      case 2:
        day = "Thứ 2";
        break;
      case 3:
        day = "Thứ 3";
        break;
      case 4:
        day = "Thứ 4";
        break;
      case 5:
        day = "Thứ 5";
        break;
      case 6:
        day = "Thứ 6";
        break;
      case 7:
        day = "Thứ 7";
        break;
      default:
        day = "Thứ 2";
        break;
    }
    return day;
  },
};
