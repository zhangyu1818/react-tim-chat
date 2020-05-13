import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import pick from 'lodash/pick';
import Message from '@/Components/Message';
import { useRematchDispatch, useRematchSelector } from '@/store';
import usePrevious from '@/hooks/usePrevious';
import { MessageFlow } from '@/store/models/types';

import './index.less';

const FETCH_OFFSET = 40;

const ConversationMessageContent = () => {
  // state

  const { activeConversationID, currentMessageList, activeProfile, myProfile } = useRematchSelector(
    ({ tim: { activeConversationID, message, activeProfile, myProfile } }) => ({
      activeConversationID,
      currentMessageList: message[activeConversationID],
      activeProfile,
      myProfile,
    })
  );
  // 加载状态
  const loading = useRematchSelector(
    ({
      loading: {
        effects: {
          tim: { getMessageList },
        },
      },
    }) => getMessageList
  );

  // dispatch

  const dispatch = useRematchDispatch();

  const isScrollEnd = useCallback(() => {
    if (scrollElement.current) {
      return scrollElement.current.scrollTop === prevRenderScrollHeight.current;
    }
    return true;
  }, []);

  /* ---------------------- 新消息浮动提示逻辑 ---------------------- */
  // 上一次最新消息id
  const prevNewMessageID = usePrevious(currentMessageList?.list[currentMessageList?.list.length - 1].ID);
  // 需要滚动到的消息id
  const currentNewMessageID = useRef<string | null>(null);
  // 新消息提示是否可见
  const [tipsVisible, setTipsVisible] = useState(false);

  useEffect(() => {
    // 已经滚动到底部则不提示
    if (isScrollEnd()) return;
    if (currentMessageList !== undefined && prevNewMessageID !== undefined) {
      const last = currentMessageList.list[currentMessageList.list.length - 1];
      // 已设置新消息则不提示
      if (last.ID === prevNewMessageID || currentNewMessageID.current) return;
      currentNewMessageID.current = last.ID;
      // 自己发到立马滚动过去
      if (last.flow === MessageFlow.out) scrollToNewMessage();
      else setTipsVisible(true);
    }
  }, [currentMessageList]);

  // 滚动到新消息
  const scrollToNewMessage = useCallback(() => {
    if (!currentNewMessageID.current) return;
    const element = document.querySelector<HTMLDivElement>(
      `[data-message-id="${currentNewMessageID.current}"]`
    );
    if (element) element.scrollIntoView({ block: 'start' });
    setTipsVisible(false);
    currentNewMessageID.current = null;
  }, []);

  /* --------------------------- 滚动逻辑 --------------------------- */

  // 做一个标识，第一次渲染时需要将滚动置底
  const isFirstRender = useRef(true);
  // 滚动的元素
  const scrollElement = useRef<HTMLDivElement>(null);
  // 上一次渲染时滚动条高度，用来判断新消息是否需要滚动条置底
  const prevRenderScrollHeight = useRef<number>();
  // 下拉加载后需要将滚动条恢复之前位置
  const prevScrollHeight = useRef(0);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (scrollElement.current) scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
  }, []);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    // 滚动到底部后关闭新消息提示
    if (isScrollEnd()) {
      setTipsVisible(false);
      currentNewMessageID.current = null;
    }
    // 消息已经获取完后不再发送请求
    if (currentMessageList?.isCompleted) return;
    const target = event.target as HTMLDivElement;
    // 获取更多数据
    if (target.scrollTop < FETCH_OFFSET && !loading) {
      prevScrollHeight.current = target.scrollHeight;
      getMessageList(activeConversationID).then(() => {
        target.scrollTop = target.scrollHeight - prevScrollHeight.current;
      });
    }
  };

  // 获取消息列表
  const getMessageList = useCallback(
    (conversationID: string) => dispatch.tim.getMessageList({ conversationID }),
    []
  );

  // 初始化消息列表
  useEffect(() => {
    // 如果当前的列表已经有信息了，则不重新请求
    if (currentMessageList === undefined) getMessageList(activeConversationID);
  }, [activeConversationID, currentMessageList]);

  useLayoutEffect(() => {
    if (scrollElement.current && prevRenderScrollHeight !== undefined && currentMessageList !== undefined) {
      const { height: scrollElementHeight } = scrollElement.current.getBoundingClientRect();
      const { scrollTop, scrollHeight } = scrollElement.current;
      const prevScrollHeight = prevRenderScrollHeight.current ?? scrollHeight - scrollElementHeight;

      if (prevScrollHeight === scrollTop || isFirstRender.current) {
        scrollToBottom();
      }
      prevRenderScrollHeight.current = scrollHeight - scrollElementHeight;
      isFirstRender.current = false;
    }
  }, [currentMessageList]);

  return (
    <>
      {loading && (
        <div className='tim-conversation-content-loading'>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </div>
      )}
      <div onScroll={onScroll} ref={scrollElement} className='tim-conversation-content-scroll'>
        {currentMessageList?.list.map((message) => {
          const avatar =
            message.flow === MessageFlow.in ? activeProfile?.avatar || message.avatar : myProfile.avatar;
          const name = message.flow === MessageFlow.in ? activeProfile?.nick || message.nick : myProfile.nick;
          return <Message key={message.ID} avatarSrc={avatar} name={name} message={message} />;
        })}
      </div>
      {tipsVisible && (
        <div
          onClick={scrollToNewMessage}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          新消息
        </div>
      )}
    </>
  );
};

export default ConversationMessageContent;
