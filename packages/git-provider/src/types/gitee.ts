export interface IWebhookParams {
  url: string;
  encryption_type?: 0 | 1; // 加密类型: 0: 密码, 1: 签名密钥
  password?: string;
  push_events?: boolean;
  tag_push_events?: boolean;
  issues_events?: boolean;
  note_events?: boolean;
  merge_requests_events?: boolean;
}
