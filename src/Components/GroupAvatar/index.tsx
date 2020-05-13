import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import getTIM from '../../TIMSDK';

import './index.less';

interface GroupAvatarProps {
  groupID: string;
}

interface MemberItem {
  avatar: string;
  nick: string;
  userID: string;
}

const GroupAvatar = ({ groupID }: GroupAvatarProps) => {
  const [memberList, setMemberList] = useState<MemberItem[]>([]);
  useEffect(() => {
    getTIM()
      .then((tim) => tim.getGroupMemberList({ groupID, count: 9, offset: 0 }))
      .then(({ data }) => {
        const { memberList } = data;
        setMemberList(memberList);
      });
  }, [groupID]);
  return (
    <div className="tim-message-list-content-item-avatar tim-message-group-avatar">
      {memberList.map(({ avatar, nick, userID }) => (
        <Avatar key={userID} src={avatar} shape="square" size={16}>
          {avatar || nick || '未知'}
        </Avatar>
      ))}
    </div>
  );
};

export default GroupAvatar;
