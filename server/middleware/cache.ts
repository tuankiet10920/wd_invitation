// server/middleware/cache.ts
export default defineEventHandler((event) => {
  const url = event.node.req.url;
  const method = event.node.req.method;
  const status =
    event.node.req.statusCode == null ? "OK" : event.node.req.statusCode;

  const now = new Date();

  function checkNumberGreaterThanTen(number: number) {
    return number < 10 ? `0${number}` : number;
  }

  const year = now.getFullYear();
  const month = checkNumberGreaterThanTen(now.getMonth() + 1);
  const day = checkNumberGreaterThanTen(now.getDate());

  const date = `${year}-${month}-${day}`;

  const hours = checkNumberGreaterThanTen(now.getHours());
  const minutes = checkNumberGreaterThanTen(now.getMinutes());
  const seconds = checkNumberGreaterThanTen(now.getSeconds());

  const time = `${hours}:${minutes}:${seconds}`;

  console.log(`[ ${date} | ${time} ] ${method} [${status}] => ${url}`);

  // Static assets cache 1 năm
  if (url?.match(/\.(jpg|jpeg|png|webp|gif|svg|ico|woff|woff2|ttf|css|js)$/)) {
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
  }

  // HTML cache ngắn
  if (url?.endsWith(".html") || url === "/") {
    setHeader(event, "Cache-Control", "public, max-age=300, must-revalidate");
  }
});
