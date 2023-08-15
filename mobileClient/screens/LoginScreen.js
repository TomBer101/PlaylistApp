import React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';

const LoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Welcome to CardTrack</Text>
            <Image ></Image>
            <Button title='Login' onPress={() => navigation.navigate('Login')} />
            <Button title='Register' onPress={() => navigation.navigate('Register')} />
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})