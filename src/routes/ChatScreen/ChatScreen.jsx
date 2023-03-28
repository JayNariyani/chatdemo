import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';


const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    console.log(route.params, 'heii')

    useEffect(() => {
        getMessages()
    }, [])

    const getMessages = () => {
        firestore()
            .collection('Conversations')
            .doc(route.params.conversationId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    let temp = []
                    doc.data().messages?.forEach(obj => {
                        obj.createdAt = obj.createdAt.toDate()
                        temp.push(obj)
                    })
                    setMessages(temp.reverse())
                }
            })
    }

    const onSend = useCallback((messages = []) => {
        messages[0].user.name = route.params.oppName
        console.log(messages[0].user)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        firestore()
            .collection('Conversations')
            .doc(route.params.conversationId)
            .update({
                messages: firestore.FieldValue.arrayUnion(messages[0])
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableOpacity onPress={() => console.log({ messages })} style={styles.header}>
                <Text style={styles.heading}>{route.params.oppName}</Text>
            </TouchableOpacity>
            <GiftedChat
                alwaysShowSend
                renderActions={() => {
                    return (
                        <TouchableOpacity
                            style={{
                                alignSelf: 'center',
                                marginLeft: 8
                            }}
                        >
                            <Image
                                source={require('../../assets/attachment.png')}
                            />
                        </TouchableOpacity>
                    )
                }}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth().currentUser.email,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
})

export default ChatScreen