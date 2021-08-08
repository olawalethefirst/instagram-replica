import {
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_UPDATE,
    USERS_POSTS_STATE_CREATE,
    CLEAR_DATA,
    USER_LIKES_STATE_CHANGE,
    LIKES_COUNT_STATE_CHANGE,
} from '../constants/index';

const initialState = {
    usersData: [],
    usersLoaded: 0,
    feed: [],
};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                usersData: [...state.usersData, action.payload],
            };
        case USERS_POSTS_STATE_CREATE:
            return {
                ...state,
                feed: [...state.feed, ...action.payload],
                usersLoaded: state.usersLoaded + 1,
            };
        case USERS_POSTS_STATE_UPDATE:
            return {
                ...state,
                feed: [...state.feed, ...action.payload],
            };
        case USER_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) =>
                    post.id === action.payload.postID
                        ? {
                              ...post,
                              currentUserLike: action.payload.currentUserLike,
                          }
                        : post
                ),
            };
        case LIKES_COUNT_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) =>
                    post.id === action.payload.postID
                        ? { ...post, likesCount: action.payload.count }
                        : post
                ),
            };
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
}
