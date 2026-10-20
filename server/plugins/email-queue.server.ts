import { Queue, Worker } from "bullmq";
import { redisConnection } from "../utils/redis";
import { MailService } from "../services/MailServices";

export default defineNitroPlugin((nitroApp) => {
  const Mail = new MailService();

  const EMAIL_QUEUE_NAME = "email-tasks";

  const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: redisConnection,
  });

  const worker = new Worker(
    EMAIL_QUEUE_NAME,
    async (job) => {
      const { to, subject, fromName, isTemplate } = job.data;

      console.log(`Đang xử lý gửi mail cho: ${to}`);

      let success = false;

      if (isTemplate) {
        const { tags = [], templateId = "", params = {} } = job.data;
        success = await Mail.resendWithTemplate(
          fromName,
          to,
          subject,
          templateId,
          params,
          tags
        );
      } else {
        const { html } = job.data;
        success = await Mail.resend(fromName, to, subject, html);
      }

      if (!success)
        throw new Error("Gửi mail thất bại, BullMQ sẽ tự động retry!");
    },
    {
      connection: redisConnection,
      limiter: {
        max: 2,
        duration: 1000,
      },
    }
  );

  nitroApp.emailQueue = emailQueue;
});
