/* eslint-disable react-native/no-inline-styles */
import {Keyboard, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppTheme} from 'themes/theme.config';
import {useNavigation} from '@react-navigation/native';

interface CustomHeaderProps {
  children: ReactNode;
}
const CustomHeader: React.FC<CustomHeaderProps> = ({children}) => {
  const navigation = useNavigation();
  const {colors} = useAppTheme();
  const onBackPress = () => navigation.goBack();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <TouchableWithoutFeedback
        style={{height: '100%', width: '100%'}}
        onPress={Keyboard.dismiss}
        accessible={false}>
        {/* header */}
        <View
          style={{
            height: 56,
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={onBackPress}
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 16,
              height: '100%',
              justifyContent: 'center',
            }}>
            <AntDesign name="arrowleft" color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
        {/* end header */}

        {children}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CustomHeader;
