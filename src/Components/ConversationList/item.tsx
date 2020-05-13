import React from 'react';
import classNames from 'classnames';
import Unread from '@/Components/UnRead';

interface MessageListProps {
  active?: boolean;
  name: string;
  date: string;
  description: string;
  unreadCount: number;
  onClick?: () => void;
  avatar: React.ReactElement | null;
}

const componentClassName = 'tim-message-list-content-item';

const MessageListItem = ({
  active,
  name,
  date,
  description,
  avatar,
  onClick,
  unreadCount,
}: MessageListProps) => (
  <div className={classNames(componentClassName, { active })} onClick={onClick}>
    <Unread>{unreadCount}</Unread>
    {avatar}
    <h5 className={`${componentClassName}-name`}>{name}</h5>
    <span className={`${componentClassName}-date`}>{date}</span>
    <p className={`${componentClassName}-desc`}>{description} </p>
  </div>
);

export default MessageListItem;
