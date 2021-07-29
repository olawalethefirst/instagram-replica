import { combineReducers } from 'redux';
import userReducer from './userReducer';
import usersReducer from './usersReducers';

const Reducers = combineReducers({
    user: userReducer,
    users: usersReducer,
});

export default Reducers;
