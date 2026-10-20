import nodemailer from "nodemailer";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { Resend } from "resend";
import mailgunjson from "~~/config/mailgun.json";
import smtpjson from "~~/config/smtp.json";
import resendjson from "~~/config/resend.json";
import { useRuntimeConfig } from "#imports";

interface TagEmailVerify {
  name: string;
  value: string;
}

const config = useRuntimeConfig();

export class MailService {
  async smtp(from: string, to: string, subject: string, html: string) {
    const env = config.environment as keyof typeof smtpjson;
    const mcfg = smtpjson[env];

    const transporter = nodemailer.createTransport({
      host: mcfg.host,
      port: mcfg.port,
      secure: mcfg.secure,
      auth: {
        user: mcfg.user,
        pass: mcfg.pass,
      },
    });

    try {
      const options = { from, to, subject, html };
      await transporter.sendMail(options);
      console.log(`Send mail from <${from}> to <${to}> successfully!`);
      return true;
    } catch (error) {
      console.log("Error while sending email: " + error);
      return false;
    }
  }

  async mailgun(from: string, to: string, subject: string, html: string) {
    const env = config.environment as keyof typeof mailgunjson;
    const mcfg = mailgunjson[env];

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: mcfg.key,
    });

    const domain = mcfg.domain;
    const sender = `"${from}" <support@${domain}>`;

    try {
      await mg.messages.create(domain, {
        from: sender,
        to: [to],
        subject,
        html,
      });
      console.log("Mailgun successfully!");
      return true;
    } catch (error) {
      console.error("Mailgun error:", error);
      return false;
    }
  }

  async resend(
    from: string,
    to: string,
    subject: string,
    html: string,
    nameDomainMail: string = "no-reply"
  ) {
    const env = config.environment as keyof typeof resendjson;
    const mcfg = resendjson[env];
    const resend = new Resend(mcfg.token);
    try {
      await resend.emails.send({
        from: `"${from}" <${nameDomainMail}@${mcfg.domain}>`,
        to,
        subject,
        html,
      });
      console.log(
        "Resend successfully! ",
        `"${from}" <no-reply@${mcfg.domain}>`
      );
      return true;
    } catch (error) {
      console.error("Mailgun error:", error);
      return false;
    }
  }

  async resendWithTemplate(
    from: string,
    to: string,
    subject: string,
    templateId: string,
    params: Record<string, string | number>,
    tags: TagEmailVerify[],
    nameDomainMail: string = "no-reply"
  ) {
    const env = config.environment as keyof typeof resendjson;
    const mcfg = resendjson[env];
    const resend = new Resend(mcfg.token);
    try {
      await resend.emails.send({
        from: `"${from}" <${nameDomainMail}@${mcfg.domain}>`,
        to: [to],
        subject,
        template: {
          id: templateId,
          variables: params,
        },
        tags,
      });
      console.log(
        "Resend successfully! ",
        `"${from}" <${nameDomainMail}@${mcfg.domain}>`
      );
      return true;
    } catch (error) {
      console.error("Mailgun error:", error);
      return false;
    }
  }
}
