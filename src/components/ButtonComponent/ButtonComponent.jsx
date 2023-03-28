import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ButtonComponent = ({ title, bg, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[{ backgroundColor: bg }, styles.container]}>
            <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderRadius: 24,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    }
})

export default ButtonComponent