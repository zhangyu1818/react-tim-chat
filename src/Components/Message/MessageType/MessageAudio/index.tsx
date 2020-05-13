import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import SoundContext from '@/utils/soundContext';
import { useRematchDispatch, useRematchSelector } from '@/store';

import './index.less';

interface MessageAudioProps {
  url: string;
  uuid: string;
  second: number;
}

const soundContext = new SoundContext();

const MessageAudio = ({ second, url, uuid }: MessageAudioProps) => {
  const runningAudioID = useRematchSelector(({ tim: { runningAudioID } }) => runningAudioID);
  const dispatch = useRematchDispatch();

  const cancelAnimation = useCallback(() => {
    dispatch.tim.setRunningAudioID(null);
  }, []);

  const onClickVoice = () => {
    soundContext.playFromBuffer(url).then(cancelAnimation);
    dispatch.tim.setRunningAudioID(uuid);
  };

  useEffect(() => {
    return () => {
      soundContext.stop();
      cancelAnimation();
    };
  }, []);

  return (
    <div
      className={classNames('tim-conversation-message-type-audio', { play: runningAudioID === uuid })}
      onClick={onClickVoice}
    >
      <div className="tim-conversation-message-type-audio-play-icon" />
      <span className="tim-conversation-message-type-audio-second">{second}"</span>
    </div>
  );
};

export default MessageAudio;
