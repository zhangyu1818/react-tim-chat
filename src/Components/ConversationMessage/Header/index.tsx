import React from 'react';
import { useRematchSelector } from '../../../store';

import './index.less';

const ConversationMessageHeader = () => {
  const activeProfile = useRematchSelector(({ tim: { activeProfile } }) => activeProfile);
  const name = activeProfile?.nick || activeProfile?.name;
  return <h1 className="tim-conversation-header-name">{name}</h1>;
};

export default ConversationMessageHeader;
