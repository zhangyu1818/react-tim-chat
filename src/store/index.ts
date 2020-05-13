import { init, RematchDispatch } from '@rematch/core';
import { useDispatch, useSelector } from 'react-redux';
import createLoadingPlugin from '@rematch/loading';
import models, { RootModel, RootState } from './models';

export type Dispatch = RematchDispatch<RootModel>;

const store = init({ models, plugins: [createLoadingPlugin()] });

export const useRematchDispatch = () => useDispatch<Dispatch>();
export const useRematchSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useSelector<RootState, TSelected>(selector, equalityFn);

export default store;

export { RootState };
