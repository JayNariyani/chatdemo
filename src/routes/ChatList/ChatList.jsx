import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatList = ({ navigation }) => {

    const [list, setList] = useState()

    setListData = (data) => {
        setList(data)
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('Users')
            .doc(auth().currentUser.email)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot._data.conversations && documentSnapshot._data.conversations.length > 0) {
                    setListData(documentSnapshot._data.conversations)
                }
                // if (documentSnapshot.docs) {
                //     // setListData(documentSnapshot.docs)
                //     console.log(documentSnapshot.docs)
                // }
            });

        return () => subscriber();
    }, [])

    signOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View></View>
                <Text style={styles.heading}>Chats</Text>
                <TouchableOpacity
                    onPress={signOut}
                // onPress={() => navigation.navigate('ChatScreen')}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={list}
                renderItem={({ item }) => {
                    console.log(item, 'hie')
                    return (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                                navigation.navigate('ChatScreen', {
                                    oppName: item.oppUser,
                                    conversationId: item.conversationId
                                })
                            }}
                        >
                            <View style={styles.listLeft}>
                                <Text>{item.oppUser}</Text>
                                {/* <Text>Last message</Text> */}
                            </View>
                            <View style={styles.listRight}>
                                {/* <Text>Time</Text> */}
                            </View>
                        </TouchableOpacity>
                    )
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
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    backgroundColor: '#1E88E5',
                    borderRadius: 50,
                    height: 60,
                    width: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => {
                    console.log('hiiiiiie')
                    navigation.navigate('AllContacts')
                }}
            >
                <Text style={{
                    fontSize: 30,
                    color: '#fff',
                }}>
                    +
                </Text>
            </TouchableOpacity>
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
        marginLeft: 40
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

export default ChatList