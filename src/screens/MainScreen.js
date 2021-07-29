import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts } from '../redux/actions/index';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './FeedScreen';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/app';

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => null;

const MainScreen = function ({ fetchUser, fetchUserPosts, currentUser }) {
    useEffect(() => {
        fetchUser();
        fetchUserPosts();
    }, []);

    if (currentUser === undefined) {
        return <View />;
    }

    return (
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <MaterialCommunityIcons
                                color={color}
                                name="home"
                                size={26}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            color={color}
                            name="magnify"
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="EmptyAdd"
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault();
                        navigation.navigate('Add');
                    },
                })}
                component={EmptyScreen}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <MaterialCommunityIcons
                                color={color}
                                name="plus"
                                size={26}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault();
                        navigation.navigate('Profile', {
                            uid: firebase.auth().currentUser.uid,
                        });
                    },
                })}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <MaterialCommunityIcons
                                color={color}
                                name="account-circle"
                                size={26}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
