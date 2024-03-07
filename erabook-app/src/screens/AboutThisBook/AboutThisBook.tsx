import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  RootStackName,
  RootStackParamList,
  RootStackProps,
} from '@navigator/types';
import {AppHeader} from '@components/AppHeader';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ScrollView} from 'react-native-gesture-handler';
import {Popins} from '@components/popins';

const AboutThisBook: React.FC = () => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  type HomeProps = RouteProp<
    RootStackParamList,
    RootStackName.AboutEbookScreen
  >;
  const route = useRoute<HomeProps>();
  const navigation = useNavigation<RootStackProps>();
  return (
    <View style={styles.container}>
      {/*<AboutBookHeader />*/}
      <AppHeader
        disablePaddingTop
        LeftComponent={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <FontAwesomeIcon
                icon={faChevronDown}
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          );
        }}
        style={{paddingHorizontal: 0}}
      />
      <ScrollView
        overScrollMode={'never'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
        }}>
        <Text style={[styles.text400, {paddingBottom: 16}]}>
          {route.params?.description || 'Updating'}
        </Text>
        <View style={styles.content}>
          <View style={{flex: 1}}>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Language)}
              </Text>
              <Text style={styles.text400}>
                {route.params?.language || 'Unknown'}
              </Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Author)}
              </Text>
              <Text
                style={[styles.text500, {color: '#FFA500', fontWeight: '600'}]}>
                {route.params?.author?.name || 'Unknown'}
              </Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Publishedon)}
              </Text>
              <Text style={styles.text400}>
                {route.params?.publicationYear || 'Unknown'}
              </Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Pages)}
              </Text>
              <Text style={styles.text400}>
                {route.params?.pageCount || 'Unknown'}
              </Text>
            </View>
            <View>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Purchases)}
              </Text>
              <Text style={styles.text400}>
                {route.params?.purchaseCount || 'Unknown'}
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Age)}
              </Text>
              <Text style={styles.text400}>20 & 18</Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Publisher)}
              </Text>
              <Text
                style={[styles.text500, {color: '#FFA500', fontWeight: '600'}]}>
                Pottermore Publishing
              </Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>ISBN</Text>
              <Text style={styles.text400}>0123456756</Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.text500}>
                {translate(OtherTranslationKey.Genre)}
              </Text>
              <Text
                style={[styles.text500, {color: '#FFA500', fontWeight: '600'}]}>
                {route.params?.genres?.map(item => item.name) || 'Unknown'}
              </Text>
            </View>
            {/* <View>
                <Text style={styles.text500}>{translate(OtherTranslationKey.Size)}</Text>
                <Text style={styles.text400}>6MB</Text>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
    },
    text: {
      color: '#192e51',
    },
    textCenter: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    text400: {
      color: colors.textDescription,
      fontFamily: Popins[400],
      top: 1.8,
      fontSize: 14,
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      top: 2,
      fontSize: 14,
    },
    center: {
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.backgroundCategory,
    },
  });

export default AboutThisBook;
