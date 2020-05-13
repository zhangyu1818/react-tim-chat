import React from 'react';
import {
  PayloadTypes,
  MessagePayloadType,
  MessageText,
  MessageImage,
  MessageVideo,
  MessageFile,
  MessageAudio,
} from '../MessageType';
import { TIMMessageType } from '@/TIMSDK';

type TIMMessageTypeValue = TIMMessageType[keyof TIMMessageType];

type RenderPayload<T extends TIMMessageTypeValue> = (payload: PayloadTypes[T]) => React.ReactElement;

type GeneratorMessageContent = {
  [K in TIMMessageTypeValue]?: RenderPayload<K>;
};

const generatorMessageContentMap: GeneratorMessageContent = {
  [TIMMessageType.MSG_TEXT]: (payload) => <MessageText>{payload.text}</MessageText>,
  [TIMMessageType.MSG_IMAGE]: (payload) => {
    // 第一个缩略图
    const [thumbnail] = payload.imageInfoArray;
    // 最后一个原图
    const original = payload.imageInfoArray[payload.imageInfoArray.length - 1];
    return <MessageImage alt="图片消息" thumbnail={thumbnail} original={original} />;
  },
  [TIMMessageType.MSG_VIDEO]: (payload) => (
    <MessageVideo width={payload.thumbWidth} height={payload.thumbHeight} src={payload.videoUrl} />
  ),
  [TIMMessageType.MSG_FILE]: (payload) => <MessageFile fileUrl={payload.fileUrl} name={payload.fileName} />,
  [TIMMessageType.MSG_AUDIO]: (payload) => <MessageAudio {...payload} />,
};

const generatorMessageContent = (type: TIMMessageTypeValue, payload: MessagePayloadType) => {
  try {
    return generatorMessageContentMap[type]!(payload);
  } catch (e) {
    // console.error(e.message);
    return <MessageText>不支持的消息类型</MessageText>;
  }
};

export default generatorMessageContent;
