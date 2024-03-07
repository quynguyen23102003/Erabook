import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Popins } from '../popins'
import React, { useState } from 'react'
import { CheckBox } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Entypo'
import Icon1 from 'react-native-vector-icons/FontAwesome'

const EbookItemHorizontal: React.FC = () => {
    const [checked, setChecked] = React.useState(true);
    const toggleCheckbox = () => setChecked(!checked);
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.style_group}>
                <Image source={require('../../assets/images/harry_potter.jpg')} style={styles.image} />
                <View style={styles.style_text}>
                    <Text style={styles.text700}>Harry Potter and the  Deathly  Hallows</Text>
                    <View style={styles.style_text_icon}>
                        <Icon1 name="star-half-empty" style={{ color: '#686868' }} size={22} />
                        <Text style={[styles.text500, { color: '#686868', marginStart: 6 }]}>4.9</Text>
                    </View>
                    <Text style={[styles.text500, { color: '#686868', marginTop: 6 }]}>Purchased</Text>
                </View>
                <View style={styles.style_icon}>
                    <CheckBox
                        checked={checked}
                        onPress={toggleCheckbox}
                        iconType="material-community"
                        checkedIcon="checkbox-marked"
                        uncheckedIcon="checkbox-blank-outline"
                        checkedColor="#F89300"
                    />
                    <TouchableOpacity>
                        <Icon name="dots-three-vertical" style={{ color: '#192e51' }} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default EbookItemHorizontal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: 'white'
        // backgroundColor: '#F89300',
    },
    text: {
        color: '#192e51',
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    text400: {
        color: '#192e51',
        fontFamily: Popins[400],
        top: 1.8,
    },
    text500: {
        color: '#192e51',
        fontFamily: Popins[500],
        top: 2,
    },
    text700: {
        color: '#192e51',
        fontFamily: Popins[700],
        top: 2.1,
    },
    image: {
        width: 90,
        height: 150,
        borderRadius: 10,
        marginEnd: 15,
        // flex: 1
    },
    style_group: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        // alignItems: 'center'     
    },
    style_text: {
        flexDirection: 'column',
        width: 200,
        marginStart: 15,
        marginTop: 5
    },
    style_icon: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        flex: 1
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorMain: {
        color: '#192e51'
    },
    style_text_icon: {
        flexDirection: 'row',
        marginTop: 10
    }
})