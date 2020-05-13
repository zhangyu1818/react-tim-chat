import { TIMMessageType } from '@/TIMSDK';
export interface CustomPayload {
  data: string;
  description: string;
  extension: string;
}

export interface TextPayload {
  text: string;
}

export interface ImagePayload {
  imageInfoArray: {
    width: number; // 宽度
    height: number; // 高度
    url: string; // 图片地址，可用于渲染
    size: number; // 图片大小，单位：Byte
    sizeType: number; // 图片大小类型。值为 1 时表示原图，数值越大表示压缩比率越高。
  }[];
  uuid: string;
}

export interface VideoPayload {
  videoSecond: number; //视频文件的时长，单位秒，整型
  videoSize: number; //视频文件大小，单位：Byte
  videoUrl: string; //视频文件的地址，可用于播放
  videoUUID: string; //video 唯一标识
  thumbWidth: number;
  thumbHeight: number;
}

export interface FilePayload {
  uuid: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface AudioPayload {
  uuid: string;
  url: string;
  second: number;
}

export interface PayloadTypes {
  [TIMMessageType.MSG_TEXT]: TextPayload;
  [TIMMessageType.MSG_CUSTOM]: CustomPayload;
  [TIMMessageType.MSG_IMAGE]: ImagePayload;
  [TIMMessageType.MSG_VIDEO]: VideoPayload;
  [TIMMessageType.MSG_FILE]: FilePayload;
  [TIMMessageType.MSG_AUDIO]: AudioPayload;
  [key: string]: any;
}

export type MessagePayloadType = PayloadTypes[keyof PayloadTypes];
