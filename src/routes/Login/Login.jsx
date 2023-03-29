import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const Login = () => {

    loginMethod = () => {
        if (email && password) {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(res => { console.log(res) })
                .catch(err => console.log(err))
        } else {
            Alert.alert('Please enter valid email and password')
        }
        Keyboard.dismiss()
    }

    signUpMethod = () => {
        if (name && email && password && passwordAgain && password == passwordAgain) {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async res => {
                    console.log('user created', res)
                    if (res.user) {
                        res.user.updateProfile({
                            displayName: name
                        })
                    }
                    let userPayload = {
                        email: res.user.email,
                        name: name,
                        conversations: []
                    }
                    firestore()
                        .collection('Users')
                        .doc(res.user.email)
                        .set(userPayload)
                        .then(() => {
                            console.log('User added!');
                        });
                })
                .catch(err => console.log(err))
        } else {
            Alert.alert('Please fill all the details')
        }
        Keyboard.dismiss()
    }

    const [signIn, setSignIn] = useState(true)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordAgain, setPasswordAgain] = useState()
    const [name, setName] = useState()
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{signIn ? 'Sign In' : 'Sign up'}</Text>
            <View style={styles.loginContainer}>
                {!signIn && <TextInput
                    onChangeText={val => setName(val)}
                    placeholder={'Name'}
                    style={styles.textInput}
                />}
                <TextInput
                    onChangeText={val => setEmail(val)}
                    placeholder={'Email'}
                    style={styles.textInput}
                />
                <TextInput
                    secureTextEntry
                    onChangeText={val => setPassword(val)}
                    placeholder={'Password'}
                    style={styles.textInput}
                />
                {!signIn && <TextInput
                    secureTextEntry
                    onChangeText={val => setPasswordAgain(val)}
                    placeholder={'Confirm Password'}
                    style={styles.textInput}
                />}
                <ButtonComponent
                    onPress={() => signIn ? loginMethod() : signUpMethod()}
                    title={signIn ? 'Login' : 'Sign up'}
                    bg={'#1E88E5'}
                />
                <TouchableOpacity
                    onPress={() => setSignIn(!signIn)}
                    style={styles.signUpText}
                >
                    <Text>
                        {signIn ? `Don't have an account? Sign up here` : 'Sign in instead?'}
                    </Text>
                </TouchableOpacity>
                {/* <View style={{ marginVertical: 14 }}>
                    <ButtonComponent title={'Sign in with Google'} bg={'red'} />
                </View>
                <View>
                    <ButtonComponent title={'Sign in with Facebook'} bg={'blue'} />
                </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 12,
        paddingTop: 32
    },
    heading: {
        fontSize: 46,
        fontWeight: 'bold',
        color: 'black',
    },
    loginContainer: {
        marginTop: 32
    },
    signUpText: {
        marginTop: 12
    },
    textInput: {
        // backgroundColor: 'red',
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 24,
        paddingHorizontal: 14,
        marginBottom: 24,
        padding: Platform.OS == 'ios' ? 16 : 8
    }
})

export default Login