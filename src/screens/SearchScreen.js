import React, { useState } from 'react';
import {
    TextInput,
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import firebase from 'firebase/app';

export default function SearchScreen({ navigation }) {
    const [users, setUsers] = useState([]);

    const findUsers = (search) => {
        firebase
            .firestore()
            .collection('users')
            .where('name', '>=', search)
            .where('name', '<', search + 'z')
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map((doc) => {
                    const user = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...user,
                    };
                });
                setUsers(users);
            });
    };
    return (
        <View>
            <TextInput
                placeholder="Search"
                onChangeText={(text) => findUsers(text)}
            />
            <FlatList
                data={users}
                keyExtractor={(item) => item.id + item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Profile', { uid: item.id })
                        }
                    >
                        <Text style={styles.listItem}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        margin: 10,
    },
});
