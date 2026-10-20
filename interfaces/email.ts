export type Task = "email-tasks";

export interface Template {
  to: string;
  fromName: string;
  subject: string;
  isTemplate: boolean;
  templateId: string;
  params?: Record<string, any>;
  tags?: { name: string; value: string }[];
}
