import {
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
} from '../constants/index';

const initialSTate = {
    usersData: [],
    usersLoaded: 0,
};

export default function usersReducer(state = initialSTate, action) {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                usersData: [...state.usersData, action.payload],
            };
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersData: state.usersData.map((userData) => {
                    userData.uid === action.payload.uid
                        ? { ...userData, posts: action.payload.posts }
                        : userData;
                }),
            };
        case INCREASE_COUNT:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
            };
        default:
            return state;
    }
}
