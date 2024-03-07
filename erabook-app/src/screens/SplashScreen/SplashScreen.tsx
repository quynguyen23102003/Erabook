import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Animated, LayoutRectangle, StyleSheet, Text, View} from 'react-native';
import {RootStackName, RootStackProps} from '../../navigator/types';
import {AppThemeColors, useAppTheme} from '../../themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  SplashTranslationKey,
} from '../../translations/constants';
import {
  useAppDispatch,
  useAppSelector,
} from '../../redux/storeAndStorage/persist';
import {setIsLoading} from '../../redux/slice/app.slice';
import {appStorage} from '@redux/storeAndStorage/mmkv';
import {storageKey} from '@redux/types';
import {fetchBooks} from '@redux/actions/book.actions';
import {fetchGenres} from '@redux/actions/genre.actions';
import {MotiView} from 'moti';
import {FooterListLoading} from '@components/loading/footerListLoading';
import {cleanBookList} from '@redux/slice/book.slice';

export const SplashScreen = () => {
  const fadeAnim = new Animated.Value(1);
  const navigation = useNavigation<RootStackProps>();
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.splashRoute);
  const {login, isLoading, rfTokenLoading} = useAppSelector(
    state => state.root.app,
  );
  const dispatch = useAppDispatch();
  const accessToken = appStorage.getString(storageKey.accessToken);
  const refreshToken = appStorage.getString(storageKey.refreshToken);
  const [layout, setLayout] = React.useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleNavigation = (isNavigateToLogin: boolean) => {
    if (isNavigateToLogin) {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: RootStackName.LoginNavigator,
          },
        ],
      });
    } else {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: RootStackName.RootBottomTabs,
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(false));
    }
    if (
      login &&
      accessToken &&
      refreshToken &&
      accessToken.length > 0 &&
      refreshToken.length > 0
    ) {
      dispatch(cleanBookList());
      dispatch(fetchBooks({page: 1})).then(() => {
        dispatch(fetchGenres()).then(() => {
          handleNavigation(false);
        });
      });
    } else {
      handleNavigation(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{
          opacity: 1,
          transform: [
            {
              translateY: 0,
            },
          ],
        }}
        animate={{
          opacity: 1,
          transform: [
            {
              translateY: -layout.height / 2,
            },
          ],
        }}
        transition={{
          type: 'timing',
          duration: 1500,
          delay: 1000,
        }}
        style={styles.content}>
        <Text style={styles.text}>
          {translate(SplashTranslationKey.eraBook)}
        </Text>
      </MotiView>
      <MotiView
        onLayout={e => {
          setLayout(e.nativeEvent.layout);
        }}
        from={{
          opacity: 0,
          transform: [
            {
              translateY: 10,
            },
          ],
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          type: 'timing',
          duration: 1000,
          delay: 2200,
        }}
        style={styles.content}>
        <FooterListLoading />
      </MotiView>
    </View>
  );
};

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.black,
    },
  });
