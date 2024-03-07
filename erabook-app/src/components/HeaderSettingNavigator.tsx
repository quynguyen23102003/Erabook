import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ImageTw, TextTw, TouchableOpacityTw, ViewTw } from '../types/type';
import Icon from 'react-native-vector-icons/AntDesign'
import { StackHeaderProps } from '@react-navigation/stack';


export const HeaderSettingNavigator: React.FC<StackHeaderProps> = ({ ...props }) => {
    const navigation = useNavigation();
    
    return (
        <ViewTw className='flex-row h-14 items-center bg-white' >
            <TouchableOpacityTw className='ml-4 mr-3 grow-0' onPress={() => { navigation.goBack() }} >
                <Icon name="arrowleft" size={24} color={'black'} />
            </TouchableOpacityTw>
            <TextTw className='grow text-lg font-bold text-black'>Personal Info</TextTw>
            <ImageTw className='w-8 h-8 mx-4' source={require('../assets/icon/Design/edit.png')} />
        </ViewTw>
    )
}


const styles = StyleSheet.create({})