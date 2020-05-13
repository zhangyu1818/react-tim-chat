import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRematchSelector } from '@/store';
import getGroupMemberList from '@/service/getGroupMemberList';
import { UserProfile } from '@/store/models/types';

import './index.less';

const GroupAside = () => {
  const activeConversationID = useRematchSelector(
    ({ tim: { activeConversationID } }) => activeConversationID
  );
  const [groupList, setGroupList] = useState<UserProfile[]>([]);
  const groupIDCache = useRef('');

  // 不能一次性获取群组所有人，只能递归多次获取
  const recursionFetch = useCallback(
    (groupID: string, lastMemberList: UserProfile[] = []): Promise<UserProfile[] | null> =>
      getGroupMemberList({ groupID, count: 30, offset: lastMemberList.length }).then(({ data }) => {
        // 判断获取的id和当前的id是否相同，不相同就不设置
        if (groupIDCache.current !== groupID) return null;
        const { memberList } = data;
        const currentMemberList = [...lastMemberList, ...memberList];
        if (memberList.length > 0) {
          return recursionFetch(groupID, currentMemberList);
        }
        return currentMemberList;
      }),
    []
  );

  useEffect(() => {
    const isGroup = activeConversationID.match(/^GROUP(.+)/);
    if (isGroup) {
      const [, groupID] = isGroup;
      groupIDCache.current = groupID;
      recursionFetch(groupID).then((memberList) => {
        if (memberList) setGroupList(memberList);
      });
    } else setGroupList([]);
  }, [activeConversationID]);

  return (
    <div className='tim-conversation-group-aside'>
      <div className='tim-conversation-group-aside-member-list'>
        {groupList.map((item, index) => (
          <p key={index}>{item.nick || '未知'}</p>
        ))}
      </div>
    </div>
  );
};

export default GroupAside;
