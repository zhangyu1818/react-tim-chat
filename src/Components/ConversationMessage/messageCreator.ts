import curry from 'lodash/curry';
import getTIM from '@/TIMSDK';

// 创建文字消息
export const createTextMessage = curry((text: string, to: string, conversationType: string) =>
  getTIM().then((tim) =>
    tim.createTextMessage({
      to,
      conversationType,
      payload: { text },
    }),
  ),
);

export const createCustomMessage = curry((payload: any, to: string, conversationType: string) =>
  getTIM().then((tim) =>
    tim.createCustomMessage({
      to,
      conversationType,
      payload,
    }),
  ),
);

// 创建需要上传的消息，只是调用函数不一样
const createUploadMessage = (type: string) =>
  curry((elementId: string, to: string, conversationType: string) => {
    const element = document.querySelector<HTMLInputElement>(`#${elementId}`);
    if (!element) return Promise.reject('元素未找到');
    return getTIM().then((tim) =>
      tim[type]({
        to,
        conversationType,
        payload: { file: element },
        onProgress: (progress: number) => {
          if (progress === 1) element.value = '';
        },
      }),
    );
  });

// 图片消息
export const createImageMessage = createUploadMessage('createImageMessage');

// 视频消息
export const createVideoMessage = createUploadMessage('createVideoMessage');

// 文件消息
export const createFileMessage = createUploadMessage('createFileMessage');
