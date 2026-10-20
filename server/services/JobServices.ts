import type { Task, Template } from "~~/interfaces/email";
import type { JobsOptions } from "bullmq";
const nitroApp = useNitroApp();
const jobOpts: JobsOptions = {
  attempts: 3, // Thử lại tối đa 3 lần nếu Resend lỗi
  backoff: {
    type: "exponential",
    delay: 5000, // Nếu lỗi, đợi 5s mới thử lại lần 2, rồi 10s lần 3...
  },
  removeOnComplete: true, // Gửi xong thì xóa job khỏi Redis cho nhẹ máy
};
export default class JobService {
  async email(task: Task, template: Template, options: JobsOptions = jobOpts) {
    await nitroApp.emailQueue.add(task, template, options);
  }
}
