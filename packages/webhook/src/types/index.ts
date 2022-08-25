import { BinaryLike } from "crypto";

export type IOnEvents = string | string[] | IGitEventObjct;

export interface IObject {
  [key: string]: any;
}

export interface IGitEventObjct {
	[key: string]: {
		[key: string]: string[];
	};
}

export interface IHookKeyword {
	signatureKey: string;
	eventKey: string;
	idKey?: string;
	verify: (signature: string, data: BinaryLike, json?: { [key: string]: any }) => boolean;
	filterEvent?: (event: string, body: IObject, eventsConfig: IOnEvents) => string | void;
}

export interface IHookPayload {
  headers: {
    [key: string]: string;
  };
  body: string; // webhook 请求体【json 串】
  secret?: string; // 配置 webhook 的 secret
  on: IOnEvents; // 监听的事件
}

export interface IHookOutput {
  success: boolean;
  message?: string;
}

// type IPushEvent = 'paths' | 'paths-ignore' | 'branches' | 'tags' | 'branches-ignore' |'tags-ignore';
// type IPullRequest = 'branches-ignore' |'tags-ignore';