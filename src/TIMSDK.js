import TIM from 'tim-js-sdk';
import COS from 'cos-js-sdk-v5';

export const TIMMessageType = TIM.TYPES;
export const TIMEventType = TIM.EVENT;

const TIMInit = ({ SDKAppID, userID, userSig }) => {
  const tim = TIM.create({
    SDKAppID,
  });
  tim.setLogLevel(4);

  tim.registerPlugin({ 'cos-js-sdk': COS });

  // 监听事件，例如：
  return new Promise((resolve, reject) => {
    const onReady = (event) => {
      if (event.name !== TIM.EVENT.SDK_READY) {
        console.error('TIM初始化错误');
        reject('TIM初始化错误');
        return;
      }
      resolve(tim);
    };
    tim.on(TIM.EVENT.SDK_READY, onReady);
    tim.login({
      userID,
      userSig,
    });
  });
};

const getTIM = (() => {
  let instance;
  return (options) => {
    if (instance) return instance;
    instance = TIMInit(options);
    return instance;
  };
})();

export default getTIM;
