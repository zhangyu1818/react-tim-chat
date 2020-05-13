import React, { ChangeEventHandler, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PictureOutlined, VideoCameraOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { createImageMessage, createVideoMessage, createFileMessage } from '../messageCreator';
import { CreateMessageFn } from '@/hooks/useSendMessage';

import './index.less';

export { default as EmojiInput } from './emoji';

interface InputTypeProps {
  sendMessage: (fn: CreateMessageFn) => void;
}

// 创建message的TIM函数
const createMessageKeyMap = {
  image: createImageMessage,
  video: createVideoMessage,
  file: createFileMessage,
};

interface UploadInputProps<InputKey> {
  inputKey: InputKey;
  uploadAccept?: string;
  icon: React.ReactElement;
}

// 都是上传，所以复用
function createUploadInput<T extends keyof typeof createMessageKeyMap>({
  inputKey,
  uploadAccept,
  icon,
}: UploadInputProps<T>) {
  return function UploadInput({ sendMessage }: InputTypeProps) {
    const uploadRef = useRef<HTMLInputElement>(null);

    const uploadInputId = `${inputKey}UploadInput`;

    const onClickUpload = () => {
      if (uploadRef.current) uploadRef.current.click();
    };

    const onFileInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
      if (!target.files?.length) return;
      sendMessage(createMessageKeyMap[inputKey](uploadInputId));
    };

    const iconNode = useMemo(() => React.cloneElement(icon, { onClick: onClickUpload }), [icon]);

    return (
      <>
        {iconNode}
        {createPortal(
          <input
            style={{ display: 'none' }}
            ref={uploadRef}
            type="file"
            accept={uploadAccept}
            id={uploadInputId}
            onChange={onFileInputChange}
          />,
          document.body,
        )}
      </>
    );
  };
}

export const ImageUploadInput = createUploadInput({
  icon: <PictureOutlined title="发送图片" />,
  inputKey: 'image',
  uploadAccept: 'image/*',
});

export const VideoUploadInput = createUploadInput({
  icon: <VideoCameraOutlined title="发送视频" />,
  inputKey: 'video',
  uploadAccept: 'video/mp4',
});

export const FileUploadInput = createUploadInput({
  icon: <FolderOpenOutlined title="发送文件" />,
  inputKey: 'file',
});
