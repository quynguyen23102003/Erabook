import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Popins} from '../popins';
import React, {useMemo} from 'react';
import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {useNavigation} from '@react-navigation/native';
import {RootStackName, RootStackProps} from '@navigator/types';
import LinearGradient from 'react-native-linear-gradient';

const uri =
  'https://tse4.mm.bing.net/th?id=OIP.pGOstqCja1JB-cfPasABOQHaEK&pid=Api&P=0&h=180';

interface Props extends IGenre {
  width: number;
}

const GenreItem: React.FC<Props> = ({...props}) => {
  const widthForImage = useMemo(() => {
    return props.width;
  }, []);
  const heightForImage = useMemo(() => {
    return (widthForImage * 9) / 19;
  }, []);
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  return (
    <TouchableOpacity
      style={[styles.container, {width: widthForImage, height: heightForImage}]}
      onPress={() =>
        navigation.navigate(RootStackName.GenreScreen, {
          id: props._id,
          title: props.name,
        })
      }>
      {props.coverImage && (
        <Image
          style={{
            width: widthForImage,
            height: heightForImage,
            borderRadius: 10,
            position: 'absolute',
            overflow: 'hidden',
          }}
          source={{uri: props.coverImage}}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.5)']}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          left: 0,
          right: 0,
        }}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.text700,
            {
              fontSize: 16,
              color: 'white',
              lineHeight: 20,
              textShadowColor: 'rgba(0, 0, 0, 0.50)',
              textShadowRadius: 10,
              textShadowOffset: {width: 0, height: 1},
              paddingLeft: 2,
              margin: 5,
            },
          ]}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GenreItem;
const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 0,
      marginBottom: 10,
      borderWidth: 0.3,
      borderColor: colors.text,
      borderRadius: 10,
      overflow: 'hidden',
    },
    text: {
      color: colors.text,
    },
    textCenter: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    text400: {
      color: colors.text,
      fontFamily: Popins[400],
      top: 1.8,
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      top: 2,
    },
    text700: {
      color: colors.text,
      fontFamily: Popins[700],
      top: 2.1,
    },
  });
