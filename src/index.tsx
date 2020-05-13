import React, { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import TIMAside from './Layout/Aside';
import MessageList from './Layout/MessageList';
import ConversationPanel from './Layout/ConversationPanel';
import ConversationList from './Components/ConversationList';
import {
  ConversationMessageHeader,
  ConversationMessageContent,
  ConversationMessageInputArea,
} from './Components/ConversationMessage';
import GroupAside from './Components/GroupAside';
import Logic from './Components/TIMLogic';

import store from './store';

import './index.less';
import getTIM from './TIMSDK';

interface TIMUIProps {
  initOptions: {
    SDKAppID: number;
    userID: string;
    userSig: string;
  };
}

const TIMUI = ({ initOptions }: TIMUIProps) => {
  useLayoutEffect(() => {
    getTIM(initOptions);
  }, []);
  return (
    <Provider store={store}>
      <Logic />
      <div className="tim-container">
        <TIMAside>
          <MessageList content={<ConversationList />} />
        </TIMAside>
        <ConversationPanel
          header={<ConversationMessageHeader />}
          content={<ConversationMessageContent />}
          input={<ConversationMessageInputArea />}
          aside={<GroupAside />}
        />
      </div>
    </Provider>
  );
};

export default TIMUI;
