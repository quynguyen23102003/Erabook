import {LayoutRectangle, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {ProgressBar} from 'react-native-paper';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {Popins} from '@components/popins';
// import {RouteProp, useRoute} from '@react-navigation/native';
// import {RootStackName, RootStackParamList} from '@navigator/types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faStarHalf} from '@fortawesome/free-solid-svg-icons';

const Reviews = (rating: TBookRating) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  // type HomeProps = RouteProp<
  //   RootStackParamList,
  //   RootStackName.EbookScreenDetail
  // >;
  // const route = useRoute<HomeProps>();
  // console.log('route ==> ', route.params);
  const [layout, setLayout] = React.useState<LayoutRectangle>({
    width: 0,
    height: 0,
    y: 0,
    x: 0,
  });
  const [textLayout, setTextLayout] = React.useState<LayoutRectangle>({
    width: 0,
    height: 0,
    y: 0,
    x: 0,
  });
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.footerContent,
          {borderColor: colors.backgroundCategory},
        ]}>
        <TextInput
          value={rating?.average?.toString().substring(0, 3) || '0'}
          editable={false}
          style={[
            styles.text700,
            {
              fontSize: 38,
              paddingVertical: 4,
              lineHeight: 22,
              textAlignVertical: 'bottom',
            },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 3,
          }}>
          <FontAwesomeIcon
            icon={
              rating?.average > 0 && rating?.average < 1 ? faStarHalf : faStar
            }
            size={16}
            color={
              rating?.average > 0 ? colors.primary : colors.backgroundCategory
            }
          />
          <FontAwesomeIcon
            icon={
              rating?.average > 1 && rating?.average < 2 ? faStarHalf : faStar
            }
            size={16}
            color={
              rating?.average > 1 ? colors.primary : colors.backgroundCategory
            }
          />
          <FontAwesomeIcon
            icon={
              rating?.average > 2 && rating?.average < 3 ? faStarHalf : faStar
            }
            size={16}
            color={
              rating?.average > 2 ? colors.primary : colors.backgroundCategory
            }
          />
          <FontAwesomeIcon
            icon={
              rating?.average > 3 && rating?.average < 4 ? faStarHalf : faStar
            }
            size={16}
            color={
              rating?.average > 3 ? colors.primary : colors.backgroundCategory
            }
          />
          <FontAwesomeIcon
            icon={
              rating?.average > 4 && rating?.average < 5 ? faStarHalf : faStar
            }
            size={16}
            color={
              rating?.average > 4 ? colors.primary : colors.backgroundCategory
            }
          />
        </View>
        <Text style={styles.text500}>
          ({rating?.count ? rating?.count?.toString() : '0'}{' '}
          {translate(OtherTranslationKey.reviews)})
        </Text>
      </View>
      <View
        style={{
          width: 1,
          backgroundColor: colors.backgroundCategory,
          marginHorizontal: 12,
        }}
      />
      <View style={[styles.footerContent1]}>
        <View
          onLayout={event => {
            setLayout(event.nativeEvent.layout);
          }}
          style={styles.viewPaper}>
          <Text
            onLayout={event => {
              setTextLayout(event.nativeEvent.layout);
            }}
            style={styles.text}>
            5
          </Text>
          <ProgressBar
            progress={rating?.percentage[5] / 100 || 0}
            color={colors.primary}
            style={[styles.paper, {width: layout.width - textLayout.width - 6}]}
          />
        </View>
        <View style={styles.viewPaper}>
          <Text style={styles.text}>4</Text>
          <ProgressBar
            progress={rating?.percentage[4] / 100 || 0}
            color={colors.primary}
            style={[styles.paper, {width: layout.width - textLayout.width - 6}]}
          />
        </View>
        <View style={styles.viewPaper}>
          <Text style={styles.text}>3</Text>
          <ProgressBar
            progress={rating?.percentage[3] / 100 || 0}
            color={colors.primary}
            style={[styles.paper, {width: layout.width - textLayout.width - 6}]}
          />
        </View>
        <View style={styles.viewPaper}>
          <Text style={styles.text}>2</Text>
          <ProgressBar
            progress={rating?.percentage[2] / 100 || 0}
            color={colors.primary}
            style={[styles.paper, {width: layout.width - textLayout.width - 6}]}
          />
        </View>
        <View style={styles.viewPaper}>
          <Text style={styles.text}>1</Text>
          <ProgressBar
            progress={rating?.percentage[1] / 100 || 0}
            color={colors.primary}
            style={[styles.paper, {width: layout.width - textLayout.width - 6}]}
          />
        </View>
      </View>
    </View>
  );
};

export default Reviews;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingBottom: 12,
    },
    footerContent: {
      alignItems: 'center',
      flex: 0,
    },
    footerContent1: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    text700: {
      color: colors.text,
      fontFamily: Popins[700],
      top: 2.1,
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      top: 2,
    },
    viewPaper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    paper: {
      backgroundColor: colors.backgroundCategory,
      height: 4,
    },
    text: {
      color: colors.text,
    },
  });
