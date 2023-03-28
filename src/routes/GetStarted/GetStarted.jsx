import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const GetStarted = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image style={styles.envelope} source={require('../../assets/email.png')} />
                <Text style={styles.mainText}>The only messaging app you need</Text>
            </View>
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    bottom: 5
                }}
            >
                <ButtonComponent
                    onPress={() => navigation.navigate('Login')}
                    title={'Get Started'}
                    bg={'#1E88E5'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 12,
        marginRight: 12,
        flex: 1
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40
    },
    envelope: {
        height: 125,
        width: 125,
        alignSelf: 'center',
        marginBottom: 30
    },
    mainText: {
        fontSize: 46,
        fontWeight: 'bold',
        color: 'black',
    }
})

export default GetStarted