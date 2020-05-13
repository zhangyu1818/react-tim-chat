import tim, { TIMState } from './tim';

export interface RootModel {
  tim: typeof tim;
}

export interface RootState {
  tim: TIMState;
  loading: any;
}

const models: RootModel = { tim };

export default models;
