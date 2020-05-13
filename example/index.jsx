import React from 'react';
import ReactDOM from 'react-dom';
import TIMUI from '@';
import genTestUserSig from './utils/generateTestUserSig';

const SDKAppID = 0;
const userID = '';

const options = { SDKAppID, userID, userSig: genTestUserSig(SDKAppID, userID).userSig };

ReactDOM.render(<TIMUI initOptions={options} />, document.getElementById('root'));
