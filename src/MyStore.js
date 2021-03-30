import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';

import reducer from './reducers';

const logger = createLogger({ predicate: (getState, action) => __DEV__ });

const promise = createPromise();

const middleware = applyMiddleware(promise, thunk, logger);

const Store = createStore(reducer, middleware);

export default Store;
