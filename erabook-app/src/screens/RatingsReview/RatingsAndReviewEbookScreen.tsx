/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';

import Icon1 from 'react-native-vector-icons/FontAwesome';
import {buttonsData, postData} from './components/screenComponents/data';
import {AppThemeColors, useAppTheme} from '../../themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '../../translations/constants';
import Reviews from '@screens/Detail/Reviews';
import Post from './components/Post';
import {Popins} from '@components/popins';
import {AppHeader} from '@components/AppHeader';
import {FeatherIcons} from '@utils/utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  RootStackName,
  RootStackParamList,
  RootStackProps,
} from '@navigator/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getAllComment} from '@services/api.service';
import {CommmentResponse} from '@services/types';

type RatingsAndReviewEbookScreenProps = NativeStackScreenProps<
  RootStackParamList,
  RootStackName.RatingsAndReviewEbookScreen
>;
const RatingsAndReviewEbookScreen: React.FC = () => {
  const baseComments = useRef<CommmentResponse>();
  const [comments, setComments] = useState<CommmentResponse>();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const {
    params: {rating, bookId},
  } = useRoute<RatingsAndReviewEbookScreenProps['route']>();
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  const buttonWidth = 75;
  const [selectedButton, setSelectedButton] = useState<string>(
    buttonsData[0].text,
  );

  useEffect(() => {
    const fetchAllComment = async () => {
      const data = await getAllComment(bookId);
      if (data) {
        baseComments.current = data;
        setComments(data);
      }
    };
    fetchAllComment();
  }, [bookId]);

  const onRatingPress = (ratingValue: string) => {
    setSelectedButton(ratingValue);
    if (!comments) {
      return;
    }

    if (ratingValue === buttonsData[0].text) {
      setComments(baseComments.current);
      return;
    }

    const updatedComments = baseComments?.current?.data.filter(
      i => i.rating.toString() === ratingValue,
    );

    setComments({data: updatedComments || [], pagination: comments.pagination});
  };

  return (
    <View style={[styles.container]}>
      {/* header */}
      <AppHeader
        title={translate(OtherTranslationKey.RantingsReviews)}
        LeftComponent={() => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      />

      <View style={{paddingHorizontal: 16, paddingTop: 16}}>
        <Reviews {...rating} />
      </View>

      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.9}
          scrollEventThrottle={16}
          ref={scrollViewRef}
          contentContainerStyle={{paddingHorizontal: 16, gap: 12}}
          // onMomentumScrollEnd={event => {
          //   // Xác định touch đã chọn và cập nhật trạng thái của nút
          //   const contentOffset = event.nativeEvent.contentOffset;
          //   const buttonIndex = Math.floor(contentOffset.x / buttonWidth);
          //   if (buttonIndex >= 0 && buttonIndex < buttonsData.length) {
          //     handlePressButton(buttonsData[buttonIndex].text);
          //   }
          // }}
        >
          {buttonsData.map(item => (
            <View style={{width: buttonWidth, marginTop: 10}} key={item.id}>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedButton === item.text && {
                    backgroundColor: '#F89300',
                  },
                ]}
                onPress={() => onRatingPress(item.text)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon1
                    name="star"
                    style={{
                      color:
                        selectedButton === item.text
                          ? 'white'
                          : styles.txtReviewIcon.color,
                    }}
                    size={14}
                  />
                  <Text
                    style={[
                      styles.txtReviewText,
                      selectedButton === item.text && {
                        color: 'white',
                      },
                    ]}>
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: colors.backgroundCategory,
          paddingTop: 20,
          marginHorizontal: 0,
        }}
      />
      <FlatList
        data={comments?.data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <Post {...item} />}
        keyExtractor={item => item._id}
        contentContainerStyle={{flexGrow: 1}}
      />
    </View>
  );
};

export default RatingsAndReviewEbookScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    footer: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: colors.backgroundCategory,
      paddingBottom: 10,
      marginTop: 10,
      marginBottom: 15,
      marginHorizontal: 24,
    },
    footercontent: {
      alignItems: 'center',
    },
    footercontent1: {
      flex: 1,
      marginStart: 13,
      marginTop: 17,
    },
    viewpaper: {
      flexDirection: 'row',
      flex: 1,
    },
    paper: {
      marginTop: 7,
      marginStart: 5,
      width: 190,
      borderRadius: 5,
    },
    txtReviewText: {
      color: colors.primary,
      fontFamily: Popins[500],
      fontSize: 17,
      alignSelf: 'center',
      marginLeft: 10,
      top: 2,
    },
    horizontalLine: {
      height: 2,
      width: 320,
      backgroundColor: colors.white,
      alignSelf: 'center',
      marginTop: 20,
    },
    button: {
      borderWidth: 2,
      borderColor: colors.primary,
      paddingHorizontal: 14,
      borderRadius: 30,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    txtReviewIcon: {
      color: colors.primary,
      fontFamily: Popins[700],
      fontSize: 17,
      alignItems: 'center',
      marginRight: 5,
    },
  });
