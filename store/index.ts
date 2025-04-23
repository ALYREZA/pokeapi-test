import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { abilitiesReducer } from './reducers/abilitiesReducer';
import rootSaga from './sagas';

const rootReducer = combineReducers({
  abilities: abilitiesReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;