import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ViewTw } from '../../../types/type'
import { useAppSelector } from '@redux/storeAndStorage/persist'

interface Props {
  link: string
}
export const HeaderInfor: React.FC<Props> = ({link}) => {
  const user = useAppSelector(state => state.root.user.userInfo);
  return (
    <View>
      <ViewTw className='w-screen my-4 justify-center items-center'>
        <Image style={[{ width: 96, height: 96, padding: 0, borderRadius: 50 }]} source={{uri: user?.avatarUrl || `https://ui-avatars.com/api/?font-size=0.35&name=${user?.username}&background=0D8ABC&color=fff&rounded=true&bold=true&size=128`}}></Image>
      </ViewTw>
    </View>
  )
}


const styles = StyleSheet.create({})
