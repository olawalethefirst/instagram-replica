import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function AddScreen({ navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [image, setImage] = useState(null);
    const camera = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
        (async () => {
            if (Platform.OS !== 'web') {
                const galleryStatus =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                setHasGalleryPermission(galleryStatus.status === 'granted');
            }
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.current.takePictureAsync();
            setImage(data.uri);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }

    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return (
            <Text style={{ alignSelf: 'center' }}>
                Please grant permissions
            </Text>
        );
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <Camera
                    type={type}
                    style={styles.camera}
                    ratio={'1:1'}
                    ref={camera}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}
                >
                    <Text style={styles.text}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        takePicture();
                    }}
                >
                    <Text style={styles.text}>Take Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        pickImage();
                    }}
                >
                    <Text style={styles.text}>Pick Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('Save', { image });
                    }}
                >
                    <Text style={styles.text}>Save</Text>
                </TouchableOpacity>
            </View>

            {image && (
                <Image style={styles.imageContainer} source={{ uri: image }} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    camera: {
        flex: 1,
        aspectRatio: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: 'blue',
        padding: 15,
    },
    imageContainer: {
        flex: 1,
        aspectRatio: 1,
    },
});
