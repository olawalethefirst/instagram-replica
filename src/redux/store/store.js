import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
