import { all, fork } from 'redux-saga/effects';
import { abilitiesSaga } from './abilitiesSaga';

export default function* rootSaga() {
  yield all([
    fork(abilitiesSaga),
  ]);
}