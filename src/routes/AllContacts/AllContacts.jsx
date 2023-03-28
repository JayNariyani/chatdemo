import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AllContacts = ({ navigation }) => {
    const [list, setList] = useState()

    checkExistingChat = (item) => {
        let userEmail = auth().currentUser.email
        let oppEmail = item.email
        let userName = auth().currentUser.displayName
        let oppName = item.name
        let conversationId = userEmail > oppEmail ? `${userEmail}${oppEmail}` : `${oppEmail}${userEmail}`

        firestore()
            .collection('Conversations')
            .doc(conversationId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    navigation.navigate('ChatScreen', { ...doc.data(), conversationId, oppName })
                    // console.log(doc.data())
                } else {
                    startNewChat(item)
                }
            })
    }

    setListData = (data) => {
        setList(data)
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('Users')
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.docs.length > 0) {
                    setListData(documentSnapshot.docs)
                }
            });

        return () => subscriber();
    }, [])

    startNewChat = (item) => {
        console.log(item)
        let userEmail = auth().currentUser.email
        let oppEmail = item.email
        let userName = auth().currentUser.displayName
        let oppName = item.name

        console.log(userName, oppName)

        let conversationId = userEmail > oppEmail ? `${userEmail}${oppEmail}` : `${oppEmail}${userEmail}`
        const conversation = {
            messages: [],
            participants: [userName, oppName]
        }
        firestore()
            .collection('Conversations')
            .doc(conversationId)
            .set(conversation)
            .then(() => {
                console.log('User added!');
                firestore()
                    .collection('Users')
                    .doc(userEmail)
                    .update({
                        conversations: firestore.FieldValue.arrayUnion({
                            conversationId: conversationId,
                            oppUser: oppName
                        })
                    })
                    .then(() => {
                        console.log('conversation added in 1 user')
                        firestore()
                            .collection('Users')
                            .doc(oppEmail)
                            .update({
                                conversations: firestore.FieldValue.arrayUnion({
                                    conversationId: conversationId,
                                    oppUser: userName
                                })
                            })
                            .then(() => {
                                console.log('added conversation in both users')
                                navigation.navigate('ChatScreen', { conversationId, oppName, oppEmail })
                            })
                    })
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View></View>
                <Text style={styles.heading}>All Contacts</Text>
                <View></View>
            </View>
            <FlatList
                data={list}
                renderItem={({ item }) => {
                    if (item._data.email != auth().currentUser.email) {
                        return (
                            <TouchableOpacity onPress={() => checkExistingChat(item._data)} style={styles.listItem}>
                                <View style={styles.listLeft}>
                                    <Text>{item._data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }}
                ItemSeparatorComponent={() => {
                    return (
                        <View
                            style={{
                                borderColor: 'gray',
                                borderWidth: 0.75,
                                marginHorizontal: 10
                            }}>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        height: 60,
        backgroundColor: '#1E88E5',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listItem: {
        flexDirection: 'row',
        padding: 14,
    },
    listLeft: {
        flex: 1,
    },
    listRight: {
        // alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }

})

export default AllContacts