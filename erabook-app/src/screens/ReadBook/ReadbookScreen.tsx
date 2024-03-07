/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  LogBox,
  BackHandler,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { AppThemeColors, darkTheme, useAppTheme } from '@themes/theme.config';
import { Popins } from '@components/popins';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ButtonGroup, Chip, Icon } from '@rneui/themed';
import {
  ArtDesignIcons,
  EntypoIcons,
  FeatherIcons,
  MaterialCommunityIcons,
} from '@utils/utils';
import { useAppDispatch, useAppSelector } from '@redux/storeAndStorage/persist';
import { changeThemeColor, ThemeKey } from '@redux/slice/setting.slice';
import CustomBottomSheet from '@components/bottomsheet';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  RootStackName,
  RootStackParamList,
  RootStackProps,
} from '@navigator/types';

import { FooterListLoading } from '@components/loading/footerListLoading';
import { getContentBook } from '@services/api.service';
import { AppHeader } from '@components/AppHeader';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import { useTranslation } from 'react-i18next';
import { BookContentWithLastRead } from '@services/types';
import SystemSetting from 'react-native-system-setting';
import { saveReadBookState, setIsLoading } from '@redux/slice/app.slice';
import { addBookContent, setLastRead } from '@redux/slice/purchased.slice';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from '@react-native-community/blur';
import { ActivityIndicator } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { LoadingLotteAnimation } from '@assets/Icon';
interface SectionProps {
  title: string;
  children: ReactNode;
}

export type TextAlignType =
  | 'center'
  | 'auto'
  | 'left'
  | 'right'
  | 'justify'
  | undefined;

export type FontFamilyType =
  | 'Poppins-Regular'
  | 'Inter-Regular'
  | 'Montserrat-Regular'
  | 'Nunito-Regular'
  | 'OpenSans-Regular'
  | 'Roboto-Regular'
  | 'Urbanist-Regular';

interface FontSizeSliderProps {
  onFontSizeValuesChange: (values: number[]) => void;
  fontSize: number;
}

interface BrightnessSliderProps {
  currentBrightness: number;
  onBrightnessChange: (values: number[]) => void;
  brightnessType: 'custom' | 'auto';
}

interface ReadBookProps {
  bookContent: BookContentWithLastRead;
}

LogBox.ignoreAllLogs();
const { height: screen_height, width: screen_width } = Dimensions.get('window');

const ReadBookScreen = () => {
  const {
    params: { ebookId },
  } = useRoute<RouteProp<RootStackParamList, RootStackName.ReadbookScreen>>();
  const book = useAppSelector(
    state => state.root.purchased.bookContent[ebookId],
  );
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const [rendering, setRendering] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setRendering(false);
    }, 0);

    return () => clearTimeout(timeOut);
  }, [book, dispatch, ebookId]);

  const fetchData = async () => {
    const data = await getContentBook(ebookId);
    if (data) {
      dispatch(
        addBookContent({
          bookName: data.bookName,
          allChapters: data.allChapters,
          lastReadOffset: 0,
          _id: ebookId,
        }),
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  if (rendering === true || book === undefined) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
        }}>
        <FooterListLoading />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      {
        book ? (
          <ReadBook bookContent={book} />
        ) : (
          <Text style={{ color: "red" }}>Loading</Text>
        )
      }
    </View >
  )
};

const ReadBook: React.FC<ReadBookProps> = ({
  bookContent: { allChapters, bookName, _id, lastReadOffset },
}) => {
  const header_height = 54;
  const bottomTab_height = screen_height * 0.1;
  const navigation = useNavigation<RootStackProps>();
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const dispatch = useAppDispatch();
  const marginHeader = useSharedValue(-header_height);
  const opacityValue = useSharedValue(0);
  const marginFooter = useSharedValue(-bottomTab_height);
  const contentListRef = useRef<FlashList<any>>(null);
  const contentListOffset = useRef(lastReadOffset);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems || viewableItems.length === 0) {
        return;
      }

      const lastItem = viewableItems.pop();
      if (lastItem === undefined) {
        return;
      }

      const index = lastItem.index;
      if (index === null) {
        return;
      }

      for (let i = 0; i < buttonChapterRefs.length; i++) {
        buttonChapterRefs[i].current?.setNativeProps({
          style: { backgroundColor: colors.background },
        });
      }

      buttonChapterRefs[index].current?.setNativeProps({
        style: { backgroundColor: colors.secondary },
      });

      currentChaptersIndex.current = index;
    },
  );
  const changeTextAlignToIndex = (value: TextAlignType) => {
    switch (value) {
      case 'justify':
        return 0;
      case 'left':
        return 1;
      case 'center':
        return 2;
      case 'right':
        return 3;
      default:
        return 1;
    }
  };
  // drawer
  const opacityDrawerBackdrop = useSharedValue(0);
  const drawerOffsetX = useSharedValue(-screen_width);
  const chaptersListRef = useRef<FlatList>(null);
  const buttonChapterRefs = Array.from({ length: allChapters.length }, () =>
    useRef<TouchableOpacity>(null),
  );
  const currentChaptersIndex = useRef(0);
  // bottom sheet
  const isBackPress = useRef(false);

  const [isShowBottomSheet, setIsShowBottomSheet] = useState(false);

  const { readBookTextAlign, readBookFontFamily, readBookFontSize } =
    useAppSelector(state => state.root.app);
  const savedBrightness = useAppSelector(
    state => state.root.app.readBookSreenBrightness,
  );
  const savedBrightnessType = useAppSelector(
    state => state.root.app.readBookBrightnessType,
  );
  const [fontFamily, setFontFamily] =
    useState<FontFamilyType>(readBookFontFamily);
  const [textAlign, setTextAlign] = useState<TextAlignType>(readBookTextAlign);
  const selectedTextAlignIndex = useRef(
    changeTextAlignToIndex(readBookTextAlign),
  );
  const fontSizeValue = useSharedValue(readBookFontSize);
  const currentBrightness = useRef(0);
  const [brightnessType, setBrightnessType] = useState<'custom' | 'auto'>(
    savedBrightnessType,
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    marginTop: marginHeader.value,
    opacity: opacityValue.value,
  }));

  const bottomTabAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: marginFooter.value,
    opacity: opacityValue.value,
  }));

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      if (marginHeader.value === 0) {
        opacityValue.value = withTiming(0);
        marginHeader.value = withTiming(-header_height);
        marginFooter.value = withTiming(-bottomTab_height);
      } else {
        opacityValue.value = withTiming(1);
        marginHeader.value = withTiming(0);
        marginFooter.value = withTiming(0);
      }
    });

  const onContentListScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentListOffset.current = nativeEvent.contentOffset.y;
  };
  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  // drawer event
  const onDismissDrawerPress = () => {
    opacityDrawerBackdrop.value = withTiming(0, {}, () => {
      drawerOffsetX.value = withTiming(-screen_width);
    });
  };

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drawerOffsetX.value }],
    };
  });

  const drawerBackdropAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacityDrawerBackdrop.value,
      [0, 0.3],
      ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
    );

    return {
      backgroundColor,
    };
  });

  const scrollChaptersAfterOpen = () => {
    if (chaptersListRef.current === null) {
      return;
    }
    if (
      currentChaptersIndex.current === 0 ||
      currentChaptersIndex.current === allChapters.length
    ) {
      chaptersListRef.current.scrollToIndex({
        index: currentChaptersIndex.current,
        animated: false,
      });
      return;
    }

    chaptersListRef.current.scrollToIndex({
      index: currentChaptersIndex.current - 1,
      animated: false,
    });
  };

  const onChapterPress = (index: number) => {
    if (contentListRef.current === null) {
      return;
    }
    if (chaptersListRef.current === null) {
      return;
    }
    if (index !== 0) {
      chaptersListRef.current.scrollToIndex({
        index: index - 1,
        animated: true,
      });
    }
    contentListRef.current.scrollToIndex({
      index,
      animated: false,
    });

    setTimeout(() => {
      for (let i = 0; i < buttonChapterRefs.length; i++) {
        buttonChapterRefs[i].current?.setNativeProps({
          style: { backgroundColor: colors.background },
        });
      }

      buttonChapterRefs[index].current?.setNativeProps({
        style: { backgroundColor: colors.secondary },
      });
    }, 300);
  };

  // bottom sheet event
  const onBottomSheetClose = () => {
    setIsShowBottomSheet(false);
    // save bottom sheet state
    dispatch(
      saveReadBookState({
        fontFamily: fontFamily,
        fontSize: fontSizeValue.value,
        textAlign: textAlign,
        brightneses: currentBrightness.current,
        brightnesesType: brightnessType,
      }),
    );
  };
  const getBrightness = async () => {
    const brightness = await SystemSetting.getAppBrightness();
    return brightness;
  };
  const saveBrightness = async () => {
    await SystemSetting.saveBrightness();
  };

  const restoreBrightness = async () => {
    const systemBrightness = SystemSetting.restoreBrightness();
    await SystemSetting.setAppBrightness(systemBrightness);
  };

  const changeBrightness = async (brightness: number) => {
    await SystemSetting.setAppBrightness(brightness);
    currentBrightness.current = brightness;
  };

  const onChangeBrightnessTypePress = () => {
    isBackPress.current === true;
    if (brightnessType === 'auto') {
      // change to custom
      changeBrightness(currentBrightness.current);
      setBrightnessType('custom');
    } else {
      // change to auto
      restoreBrightness();
      setBrightnessType('auto');
    }
  };

  const onSliderBrightnessDrag = useCallback((values: number[]) => {
    changeBrightness(values[0]);
    setBrightnessType('custom');
  }, []);

  const handleTextAlignPress = useCallback((value: number) => {
    selectedTextAlignIndex.current = value;
    switch (value) {
      case 0:
        setTextAlign('justify');
        break;
      case 1:
        setTextAlign('left');
        break;
      case 2:
        setTextAlign('center');
        break;
      case 3:
        setTextAlign('right');
        break;
      default:
        setTextAlign('justify');
        break;
    }
  }, []);

  const fontSizez = useAnimatedStyle(() => {
    const fontSize = interpolate(
      fontSizeValue.value,
      [0, 40],
      [0, 40],
      Extrapolate.CLAMP,
    );
    return {
      fontSize,
      lineHeight: 1.75 * fontSize,
    };
  });

  const onFontFamilyChipPress = useCallback((value: FontFamilyType) => {
    setFontFamily(value);
  }, []);

  const onFontSizeValuesChange = useCallback(
    (values: number[]) => {
      fontSizeValue.value = values[0];
    },
    [fontSizeValue],
  );

  // footer menu event
  const onToggleThemePress = () => {
    if (colors.background === darkTheme.colors.background) {
      dispatch(changeThemeColor(ThemeKey.Light));
    } else {
      dispatch(changeThemeColor(ThemeKey.Dark));
    }
  };

  const onSettingPress = useCallback(() => {
    setIsShowBottomSheet(true);
  }, []);

  const onChapterTogglePress = () => {
    drawerOffsetX.value = withTiming(0, {}, e => {
      if (e) {
        opacityDrawerBackdrop.value = withTiming(1);
        runOnJS(scrollChaptersAfterOpen)();
      }
    });
  };

  const [isScrollToLastRead, setIsScrollToLastRead] = useState(false);
  useEffect(() => {
    if (lastReadOffset !== 0) {
      // dispatch(setIsLoading(true));
      setIsScrollToLastRead(true);
    }
    const prepareBrightness = async () => {
      currentBrightness.current =
        savedBrightness === -1 ? await getBrightness() : savedBrightness;
      if (savedBrightnessType === 'custom') {
        if (savedBrightness !== -1) {
          changeBrightness(savedBrightness);
        }
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (drawerOffsetX.value === 0) {
          onDismissDrawerPress();
          return true;
        }
        onBackPress();
        return true;
      },
    );
    const unsubscribe = navigation.addListener('blur', async () => {
      dispatch(
        setLastRead({
          bookId: _id,
          lastRead: contentListOffset.current,
        }),
      );
      restoreBrightness();
    });
    if (isBackPress.current === false) {
      saveBrightness();
      prepareBrightness();
    }

    return () => {
      unsubscribe();
      backHandler.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {/* drawer */}
      <Animated.View style={[styles.drawerChapter, drawerAnimatedStyle]}>
        <View
          style={{
            width: screen_width * 0.76,
            backgroundColor: colors.background,
          }}>
          <View style={{ backgroundColor: colors.background }}>
            <Text
              style={{
                marginHorizontal: 16,
                marginBottom: 10,
                marginTop: 40,
                color: colors.text,
                fontSize: 16,
                fontFamily: Popins['600'],
              }}>
              {translate(OtherTranslationKey.Chapter)}
            </Text>
          </View>
          <FlatList
            ref={chaptersListRef}
            onScrollToIndexFailed={() => {
              console.log('chaptersList scroll failed');
              chaptersListRef.current?.scrollToEnd({ animated: false });
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: colors.background,
            }}
            overScrollMode="never"
            data={allChapters}
            keyExtractor={item => item.chapterTitle}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  ref={buttonChapterRefs[index]}
                  onPress={() => onChapterPress(index)}
                  style={{
                    padding: 16,
                    gap: 6,
                    borderColor: colors.border,
                    borderBottomWidth: 1,
                    // backgroundColor,
                  }}>
                  <Text style={{ color: colors.gray, fontSize: 14 }}>
                    {translate(OtherTranslationKey.Chapter)} {index + 1}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      lineHeight: 1.5 * 16,
                    }}>
                    {item.chapterTitle}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Pressable style={{ flex: 1 }} onPress={onDismissDrawerPress}>
          <Animated.View style={[{ flex: 1 }, drawerBackdropAnimatedStyle]} />
        </Pressable>
      </Animated.View>
      {/* header */}
      <Animated.View style={[headerAnimatedStyle]}>
        <AppHeader
          line
          title={bookName}
          LeftComponent={() => (
            <TouchableOpacity onPress={onBackPress}>
              <ArtDesignIcons name="arrowleft" color={colors.text} size={24} />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
      {/* book content */}
      <GestureDetector gesture={tapGesture}>
        <FlashList
          // onScroll={e => {
          //   console.log(e.nativeEvent.contentOffset.y);
          //   if (e.nativeEvent.contentOffset.y === 3000) {
          //   }
          // }}
          onScroll={onContentListScroll}
          onLoad={({ elapsedTimeInMs }) => {
            // console.log('elapsedTimeInMs', elapsedTimeInMs);
            setTimeout(() => {
              contentListRef.current?.scrollToOffset({
                offset: lastReadOffset,
                animated: false,
              });
              // dispatch(setIsLoading(false));
              setIsScrollToLastRead(false);
            }, elapsedTimeInMs);
          }}
          keyExtractor={item => item.chapterTitle + 'contentListRef'}
          ref={contentListRef}
          showsVerticalScrollIndicator
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
            minimumViewTime: 500,
          }}
          data={allChapters}
          extraData={{ fontFamily, textAlign }}
          renderItem={({ item }) => {
            return (
              <Animated.Text
                style={[
                  styles.textContent,
                  {
                    textAlign: textAlign,
                    color: colors.text,
                    fontFamily: fontFamily,
                  },
                  fontSizez,
                ]}>
                {item.chapterContent}
              </Animated.Text>
            );
          }}
        />
      </GestureDetector>
      {/* footer bottom tabs */}
      <Animated.View style={[styles.bottomWrapper, bottomTabAnimatedStyle]}>
        <TouchableOpacity
          onPress={onChapterTogglePress}
          style={styles.iconWrapper}>
          <FeatherIcons name="file-text" size={24} color={colors.gray} />
          <Text style={styles.textNormal}>
            {translate(OtherTranslationKey.Chapter)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onToggleThemePress()}
          style={styles.iconWrapper}>
          <EntypoIcons
            name={
              colors.background === darkTheme.colors.background
                ? 'light-up'
                : 'moon'
            }
            size={24}
            color={colors.gray}
          />
          <Text style={styles.textNormal}>
            {colors.background === darkTheme.colors.background
              ? translate(OtherTranslationKey.LightMode)
              : translate(OtherTranslationKey.NightMode)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSettingPress} style={styles.iconWrapper}>
          <FeatherIcons name="settings" size={24} color={colors.gray} />
          <Text style={styles.textNormal}>
            {translate(OtherTranslationKey.Setting)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {/* bottom sheet */}
      <CustomBottomSheet
        visible={isShowBottomSheet}
        onClose={onBottomSheetClose}>
        <ScrollView
          overScrollMode={'never'}
          style={{ maxHeight: screen_height * 0.8 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/*Brightness  */}
            <Section title={translate(OtherTranslationKey.Brightness)}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Pressable
                  onPress={onChangeBrightnessTypePress}
                  style={{ width: 24, height: 24 }}>
                  <MaterialCommunityIcons
                    name={
                      brightnessType === 'auto'
                        ? 'brightness-auto'
                        : 'brightness-6'
                    }
                    color={colors.text}
                    size={24}
                  />
                </Pressable>
                <View style={styles.sliderBrightnessWrapper}>
                  <View style={styles.sliderBrightnessLeft} />
                  <BrightnessSlider
                    onBrightnessChange={onSliderBrightnessDrag}
                    currentBrightness={currentBrightness.current}
                    brightnessType={brightnessType}
                  />
                </View>
              </View>
            </Section>

            {/* text align */}
            <Section title={translate(OtherTranslationKey.AlignText)}>
              <ButtonGroup
                containerStyle={{
                  borderRadius: 10,
                  borderWidth: 0,
                  backgroundColor: colors.border,
                }}
                Component={TouchableOpacity}
                selectedIndex={selectedTextAlignIndex.current}
                onPress={handleTextAlignPress}
                selectedButtonStyle={{ backgroundColor: colors.primary }}
                innerBorderStyle={{ width: 0 }}
                buttons={[
                  <Icon
                    color={
                      selectedTextAlignIndex.current === 0
                        ? 'white'
                        : colors.text
                    }
                    name="format-align-justify"
                  />,
                  <Icon
                    color={
                      selectedTextAlignIndex.current === 1
                        ? 'white'
                        : colors.text
                    }
                    name="format-align-left"
                  />,
                  <Icon
                    color={
                      selectedTextAlignIndex.current === 2
                        ? 'white'
                        : colors.text
                    }
                    name="format-align-center"
                  />,
                  <Icon
                    color={
                      selectedTextAlignIndex.current === 3
                        ? 'white'
                        : colors.text
                    }
                    name="format-align-right"
                  />,
                ]}
              />
            </Section>
            {/* Font Size */}
            <Section title={translate(OtherTranslationKey.FontSize)}>
              <View style={styles.sliderBrightnessWrapper}>
                <View style={styles.sliderBrightnessLeft} />
                <FontSizeSlider
                  fontSize={fontSizeValue.value}
                  onFontSizeValuesChange={onFontSizeValuesChange}
                />
              </View>
            </Section>

            <Section title={translate(OtherTranslationKey.Font)}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {FONTS.map(item => {
                  const textColor =
                    item.value === fontFamily ? 'white' : colors.primary;
                  const backgroundColor =
                    item.value === fontFamily ? colors.primary : undefined;
                  return (
                    <Chip
                      key={item.name}
                      title={item.name}
                      type="outline"
                      containerStyle={{
                        backgroundColor: backgroundColor,
                      }}
                      onPress={() =>
                        onFontFamilyChipPress(item.value as FontFamilyType)
                      }
                      titleStyle={{
                        fontSize: 14,
                        color: textColor,
                      }}
                      buttonStyle={{
                        borderColor: colors.primary,
                        borderWidth: 2,
                      }}
                    />
                  );
                })}
              </View>
            </Section>
          </View>
        </ScrollView>
      </CustomBottomSheet>
      {isScrollToLastRead && (
        <>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.absolute}>
            <LottieView
              style={{ width: 64, height: 64 }}
              loop
              autoPlay
              source={LoadingLotteAnimation.loadingLoadMore}
              colorFilters={[
                {
                  keypath: 'Shape Layer 2',
                  color: colors.primary,
                },
              ]}
            />

            <Text
              style={{
                color: colors.text,
                fontFamily: Popins['500'],
                fontSize: 16,
                width: '80%',
                textAlign: 'center',
              }}>
              {translate(OtherTranslationKey.WeAreTaking)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};
const FontSizeSlider: React.FC<FontSizeSliderProps> = memo(
  ({ onFontSizeValuesChange, fontSize }) => {
    const { colors } = useAppTheme();
    const styles = useStyle(colors);
    return (
      <MultiSlider
        allowOverlap
        sliderLength={(screen_width - 40) * 0.9}
        min={10}
        max={30}
        values={[fontSize]}
        selectedStyle={{
          backgroundColor: colors.primary,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}
        containerStyle={styles.slider}
        unselectedStyle={{
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}
        onValuesChangeFinish={(values: number[]) =>
          onFontSizeValuesChange(values)
        }
        markerOffsetX={-16}
        markerOffsetY={10}
        trackStyle={{ height: 20 }}
        customMarker={e => (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {e.currentValue.toFixed(0)}
          </Text>
        )}
      />
    );
  },
);

const BrightnessSlider: React.FC<BrightnessSliderProps> = memo(
  ({ currentBrightness, onBrightnessChange }) => {
    const { colors } = useAppTheme();
    const styles = useStyle(colors);
    return (
      <MultiSlider
        allowOverlap
        sliderLength={(screen_width - 70) * 0.9}
        min={0}
        max={1}
        step={1 / 1000000}
        values={[currentBrightness]}
        selectedStyle={{
          backgroundColor: colors.primary,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}
        containerStyle={styles.slider}
        unselectedStyle={{
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}
        onValuesChange={(values: number[]) => onBrightnessChange(values)}
        markerOffsetX={-14}
        markerOffsetY={10}
        trackStyle={{ height: 20, overflow: 'hidden' }}
        customMarker={() => {
          return <EntypoIcons name="light-down" size={20} color="white" />;
        }}
      />
    );
  },
);

const Section: React.FC<SectionProps> = memo(({ title, children }) => {
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
});

export default ReadBookScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    drawerChapter: {
      flexDirection: 'row',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
    },

    segmentedButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'lightblue',
      backgroundColor: 'white',
    },
    selectedButton: {
      backgroundColor: 'lightblue',
    },
    buttonText: {
      textAlign: 'center',
    },
    textContent: {
      color: '#192e51',
      fontFamily: Popins[400], // You can adjust the font family as needed
      fontSize: 16,
      lineHeight: 1.75 * 16,
      borderBottomWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    sliderBrightnessWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      marginVertical: 6,
      borderRadius: 20,
      flex: 1,
    },

    sliderBrightnessLeft: {
      flex: 1,
      height: 20,
      backgroundColor: colors.primary,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },

    slider: {
      backgroundColor: '#cecece',
      height: 'auto',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      // overflow: 'hidden',
    },

    trackStyle: { height: 24, borderRadius: 24 },

    sectionTitle: {
      color: colors.text,
      fontFamily: Popins['600'],
      fontSize: 18,
    },
    contentContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    header: {
      height: 50,
      borderBottomWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    iconWrapper: { justifyContent: 'center', alignItems: 'center', gap: 2 },
    bottomWrapper: {
      height: screen_height * 0.1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: 20,
      paddingVertical: 4,
      paddingTop: 8,
      borderColor: colors.border,
      borderTopWidth: 1,
      backgroundColor: colors.background,
    },
    textNormal: {
      color: colors.gray,
      fontSize: 14,
      fontFamily: Popins['400'],
    },
  });

const FONTS = [
  {
    name: 'Poppins',
    value: 'Poppins-Regular',
  },
  {
    name: 'Inter',
    value: 'Inter-Regular',
  },
  {
    name: 'Montserrat',
    value: 'Montserrat-Regular',
  },
  {
    name: 'Nunito',
    value: 'Nunito-Regular',
  },
  {
    name: 'OpenSans',
    value: 'OpenSans-Regular',
  },
  {
    name: 'Roboto',
    value: 'Roboto-Regular',
  },
  {
    name: 'Urbanist',
    value: 'Urbanist-Regular',
  },
];

// const fake_data = {
//   title: 'Cho tôi xin một vé đi tuổi thơ',
//   chapters: [
//     {
//       id: 'fsdafsfafsdfsd',
//       chapterTitle: 'Tóm lại là đã hết một ngày',
//       chapterContent: `Năm đó tôi tám tuổi.
//         Sau này, tôi cũng nhiều lần thấy cuộc sống đáng chán khi thi trượt ở tuổi mười lăm, thất tình ở tuổi hăm bốn, thất nghiệp ở tuổi ba mươi ba và gặt hái mọi thành công ở tuổi bốn mươi.
//         Nhưng tám tuổi có cái buồn chán của tuổi lên tám.
//         Ðó là cái ngày không hiểu sao tôi lại có ý nghĩ rằng cuộc sống không có gì để mà chờ đợi nữa.
//         Rất nhiều năm về sau, tôi được biết các triết gia và các nhà thần học vẫn đang loay hoay đi tìm ý nghĩa của cuộc sống và tới Tết Ma Rốc họ cũng chưa chắc đã tìm ra.
//         Nhưng năm tôi tám tuổi, tôi đã thấy cuộc sống chả có gì mới mẻ để khám phá.
//         Vẫn ánh mặt trời đó chiếu rọi mỗi ngày. Vẫn bức màn đen đó buông xuống mỗi đêm. Trên mái nhà và trên các cành lá sau vườn, gió vẫn than thở giọng của gió. Chim vẫn hót giọng của chim. Dế ri ri giọng dế, gà quang quác giọng gà. Nói tóm lại, cuộc sống thật là cũ kỹ.
//         Cuộc sống của tôi còn cũ kỹ hơn nữa. Mỗi đêm, trước khi đi ngủ, tôi đã biết tỏng ngày mai những sự kiện gì sẽ diễn ra trong cuộc đời tôi.
//         Tôi kể ra nhé: Sáng, tôi phải cố hết sức để thức dậy trong khi tôi vẫn còn muốn ngủ tiếp. Tất nhiên là trước đó tôi vẫn giả vờ ngủ mê mặc cho mẹ tôi kêu khản cả giọng rồi lay lay người tôi, nhưng dĩ nhiên tôi vẫn trơ ra như khúc gỗ cho đến khi mẹ tôi cù vào lòng bàn chân tôi.
//         Khi đặt chân xuống đất rồi, tôi phải đi đánh răng rửa mặt, tóm lại là làm vệ sinh buổi sáng trước khi bị ấn vào bàn ăn để uể oải nhai chóp chép một thứ gì đó thường là không hợp khẩu vị. Mẹ tôi luôn luôn quan tâm đến sức khỏe và cụ thể hóa mối quan tâm của mình bằng cách bắt tôi (và cả nhà) ăn những món ăn có nhiều chất dinh dưỡng trong khi tôi chỉ khoái xực những món mà bà cho rằng chẳng bổ béo gì, như mì gói chẳng hạn.
//         Quan tâm đến sức khỏe là điều tốt, và càng lớn tuổi mối quan tâm đó càng tỏ ra đúng đắn. Chẳng ai dám nói quan tâm như vậy là điều không tốt. Tôi cũng thế thôi. Khi tôi trưởng thành, có nhà báo phỏng vấn tôi, rằng giữa sức khỏe, tình yêu và tiền bạc, ông quan tâm điều gì nhất? Lúc đầu tôi nói nhiều về tình yêu, về sau tôi nói nhiều hơn về sức khỏe. Tôi phớt lờ tiền bạc, mặc dù tôi nhận thấy đó là một bất công: tiền bạc chưa bao giờ được con người ta thừa nhận là mối quan tâm hàng đầu dù tiền bạc ngày nào cũng chạy đi mua quà tặng cho tình yêu và thuốc men cho sức khỏe.
//         Nhưng thôi, đó là chuyện của người lớn – chuyện sau này. Còn tôi, lúc tám tuổi, tôi chỉ nhớ là tôi không thích ăn những món bổ dưỡng. Nhưng tất nhiên là tôi vẫn buộc phải ăn, dù là ăn trong miễn cưỡng và lười nhác, và đó là lý do mẹ tôi luôn than thở về tôi.
//         Ăn xong phần ăn buổi sáng (chả sung sướng gì), tôi vội vàng truy lùng sách vở để nhét vào cặp, nhặt trên đầu tivi một quyển, trên đầu tủ lạnh một quyển khác và moi từ dưới đống chăn gối một quyển khác nữa, dĩ nhiên bao giờ cũng thiếu một món gì đó, rồi ba chân bốn cẳng chạy vù ra khỏi nhà.
//         Trường gần nhà nên tôi đi bộ, nhưng thực tế thì tôi chưa bao giờ được thưởng thức thú đi bộ tới trường. Tôi toàn phải chạy. Vì tôi luôn luôn dậy trễ, luôn luôn làm vệ sinh trễ, luôn luôn ăn sáng trễ và mất rất nhiều thì giờ để thu gom tập vở cho một buổi học. Về chuyện này, ba tôi bảo: “Con à, hồi bằng tuổi con, bao giờ ba cũng xếp gọn gàng tập vở vào cặp trước khi đi ngủ, như vậy sáng hôm sau chỉ việc ôm cặp ra khỏi nhà!”.
//         Nhưng hồi ba tôi bằng tuổi tôi thì tôi đâu có mặt trên cõi đời để kiểm tra những gì ông nói, bởi khi tôi bằng tuổi ba tôi bây giờ chắc chắn tôi cũng sẽ lặp lại với con tôi những điều ông nói với tôi – chuyện xếp tập vở trước khi đi ngủ và hàng đống những chuyện khác nữa, những chuyện mà tôi không hề làm.
//         Chà, với những chuyện như thế này, bạn đừng bao giờ đòi hỏi phải chứng minh. Ðôi khi vì một lý do nào đó mà chúng ta buộc phải bịa chuyện.
//         Chúng ta cứ lặp lại mãi câu chuyện bịa đó cho đến một ngày chúng ta không nhớ có thật là chúng ta đã bịa nó ra hay không, rồi sau đó một thời gian nữa nếu cứ tiếp tục lặp lại câu chuyện đó nhiều lần thì chúng ta sẽ tin là nó có thật. Thậm chí còn hơn cả niềm tin thông thường, đó là niềm tin vô điều kiện, gần như là sự xác tín. Như các nhà toán học tin vào định đề Euclide hay các tín đồ Thiên Chúa tin vào sự sống lại của Jesus.
//         Ôi, nhưng đó cũng lại là những vấn đề của người lớn.
//         Tôi kể tiếp câu chuyện của tôi hồi tám tuổi.
//         Như vậy, ra khỏi nhà một lát thì tôi tới trường.
//         Trong lớp, tôi luôn luôn ngồi ở bàn chót. Ngồi bàn chót thì tha hồ tán gẫu, cãi cọ, cấu véo hay giở đủ trò nghịch ngợm mà không sợ bị cô giáo phát hiện, nhưng điều hấp dẫn nhất ở vị trí tối tăm đó là ít khi bị kêu lên bảng trả bài.
//         Ðiều đó có quy luật của nó. Bạn nhớ lại đi, có phải bạn có rất nhiều bạn bè, yêu quí rất nhiều người nhưng không phải lúc nào bạn cũng nhớ tới họ.
//         Bộ nhớ chúng ta quá nhỏ để chứa cùng lúc nhiều khuôn mặt hay nhiều cái tên, chỉ khi nào nhìn thấy người đó ngoài phố hay bắt gặp cái tên đó trong một mẩu tin trên báo chẳng hạn thì chúng ta mới chợt nhớ ra và cảm động thốt lên “Ôi, đã lâu lắm mình không gặp nó. Năm ngoái mình kẹt tiền, nó có cho mình vay năm trăm ngàn!”.
//         Cô giáo của tôi cũng vậy thôi. Làm sao cô có thể nhớ tới tôi và kêu tôi lên bảng trả bài khi mà cô không thể nào nhìn thấy tôi giữa một đống đầu cổ lúc nhúc che chắn trước mặt.
//         Ngày nào cũng như ngày nào, tôi ngồi đó, vừa xì xầm trò chuyện vừa cựa quậy lung tung, và mong ngóng tiếng chuông ra chơi đến chết được.
//         Trong những năm tháng mà người ta gọi một cách văn hoa là mài đũng quần trên ghế nhà trường (tôi thì nói thẳng là bị giam cầm trong lớp học), tôi chẳng thích được giờ nào cả, từ giờ toán, giờ tập viết đến giờ tập đọc, giờ chính tả. Tôi chỉ thích mỗi giờ ra chơi.
//         Ra chơi có lẽ là điều tuyệt vời nhất mà người lớn có thể nghĩ ra cho trẻ con. Ra chơi có nghĩa là những lời vàng ngọc của thầy cô tuột khỏi trí nhớ nhanh như gió, hết sức trơn tru. Ra chơi có nghĩa là được tháo cũi sổ lồng (tất nhiên sau đó phải bấm bụng chui vào lại), là được tha hồ hít thở không khí tự do.
//         Suốt những năm đi học, tôi và lũ bạn đã sử dụng những khoảnh khắc tự do hiếm hoi đó vào việc đá bóng, bắn bi, nhưng thường xuyên nhất và hăng hái nhất là những trò rượt đuổi, đánh nhau hay vật nhau xuống đất cho đến khi không đứa nào còn ra hình thù một học sinh ngoan ngoãn nữa mới thôi, tức là lúc khuỷu tay đã trầy xước, mắt đã bầm tím, chân đi cà nhắc và áo quần thì trông còn tệ hơn mớ giẻ lau nhà.
//         Tại sao tôi không kể giờ ra về vào đây. Vì ra về có nghĩa là rời khỏi một nhà giam này để đến một nhà giam khác, y như người ta chuyển trại cho các tù nhân, có gì hay ho đâu.
//         Tôi không nói quá lên đâu, vì ngày nào chào đón tôi ở đầu ngõ cũng là khuôn mặt lo lắng của mẹ tôi và khuôn mặt hầm hầm của ba tôi.
//         – Trời ơi, sao ngày nào cũng ra nông nỗi thế này hả con?
//         Ðại khái mẹ tôi nói thế, giọng thảng thốt, vừa nói vừa nắn nót cánh tay rướm máu của tôi như để xem nó sắp rụng khỏi người tôi chưa.
//         Ba tôi thì có cách nói khác, rất gần với cách rồng phun lửa:
//         – Mày lại đánh nhau rồi phải không?
//         – Con không đánh nhau. Tụi bạn đánh con và con đánh lại.
//         Tôi nói dối (mặc dù nói dối như thế còn thật hơn là nói thật) và khi ba tôi tiến về phía tôi với dáng điệu của một cơn bão cấp mười tiến vào đất liền thì mẹ tôi đã kịp kéo tôi ra xa:
//         – Ông ơi, con nó đã nát nhừ ra rồi!
//         Mẹ tôi có cách nói cường điệu rất giống tôi, tôi vừa chạy theo bà vừa cười thầm về điều đó.
//         Sau đó, không nói thì ai cũng biết là tôi bị mẹ tôi tống vào nhà tắm. Khi tôi đã tinh tươm và thơm phức như một ổ bánh mì mới ra lò thì mẹ tôi bắt đầu bôi lên người tôi đủ thứ thuốc xanh xanh đỏ đỏ khiến tôi chẳng mấy chốc đã rất giống một con tắc kè bông.
//         Dĩ nhiên là từ đó cho tới bữa cơm, tôi không được phép bước ra khỏi nhà để tránh phải sa vào những trò đánh nhau khác hấp dẫn không kém với bọn nhóc trong xóm, những đối thủ thay thế hết sức xứng đáng cho tụi bạn ở trường.
//         Ăn trưa xong thì tôi làm gì vào thời tôi tám tuổi?
//         Ði ngủ trưa!
//         Trên thế giới rộng lớn này, có lẽ có rất nhiều đứa nhóc trạc tuổi tôi đều bị các bậc phụ huynh cột chặt vào giấc ngủ trưa theo cái cách người ta cột bò vào cọc để chúng khỏi chạy lung tung mà hậu quả là thế nào hàng xóm cũng kéo đến nhà chửi bới om sòm.
//         Chứ thực ra với một đứa bé tám tuổi thì giấc ngủ trưa chẳng có giá trị gì về mặt sức khỏe. Khi tôi lớn lên thì tôi phải công nhận giấc ngủ trưa đối với một người lớn tuổi đúng là quý hơn vàng. Lớn tuổi thì sức khỏe suy giảm. Làm việc nhiều thì đầu nhức, mắt mờ, lưng mỏi, tay run, giấc ngủ ban đêm vẫn chưa đủ liều để sửa chữa thành công những chỗ hỏng hóc của cơ thể. Buổi trưa phải chợp mắt thêm một lát thì buổi chiều mới đủ tỉnh táo mà không nện búa vào tay hay hụt chân khi bước xuống cầu thang.
//         Nhưng nếu bạn sống trên đời mới có tám năm thì bạn không có lý do chính đáng để coi trọng giấc ngủ trưa. Với những dân tộc không có thói quen ngủ trưa, như dân Mỹ chẳng hạn, trẻ con càng không tìm thấy chút xíu ý nghĩa nào trong việc phải leo lên giường sau giờ cơm trưa.
//         Hồi tôi tám tuổi dĩ nhiên tôi không có được cái nhìn thông thái như thế. Nhưng tôi cũng lờ mờ nhận ra khi ba tôi đi ngủ thì tôi buộc phải đi ngủ, giống như một con cừu còn thức thì người chăn cừu không yên tâm chợp mắt vậy.
//         Tôi nằm cựa quậy bên cạnh ông trên chiếc đi-văng, thở dài thườn thượt khi nghĩ đến những quả đấm mà lũ bạn nghịch ngợm đang vung lên ngoài kia.
//         – Ðừng cựa quậy! Cựa quậy hoài thì sẽ không ngủ được!
//         Ba tôi nói, và tôi vờ nghe lời ông. Tôi không cựa quậy nhưng mắt vẫn mở thao láo.
//         – Ðừng mở mắt! Mở mắt hoài thì sẽ không ngủ được!
//         Ba tôi lại nói, ông vẫn nằm ngay ngắn nên tôi nghĩ là ông không nhìn thấy tôi mở mắt, ông chỉ đoán thế thôi. Chẳng may cho tôi là lần nào ông cũng đoán đúng.
//         Tôi nhắm mắt lại, lim dim thôi, mi mắt vẫn còn hấp háy, nhưng tôi không thể nào bắt mi mắt tôi đừng hấp háy được.
//         Một lát, ba tôi hỏi:
//         – Con ngủ rồi phải không?
//         – Dạ rồi.
//         Tôi đáp, ngây ngô và ngoan ngoãn, rơi vào bẫy của ba tôi một cách dễ dàng.
//         Tôi nằm như vậy, thao thức một lát, tủi thân và sầu muộn, rồi thiếp đi lúc nào không hay.
//         Khi tôi thức dậy thì đường đời của tôi đã được vạch sẵn rồi. Tôi đi từ giường ngủ đến phòng tắm để rửa mặt rồi từ phòng tắm đi thẳng tới bàn học để làm một công việc chán ngắt là học bài hoặc làm bài tập.
//         Thỉnh thoảng tôi cũng được phép chạy ra đằng trước nhà chơi với lũ trẻ hàng xóm nhưng trước ánh mắt giám sát của mẹ tôi (từ một vị trí bí hiểm nào đó đằng sau các ô cửa mà mãi mãi tôi không khám phá được), tôi chỉ dám chơi những trò ẻo lả như nhảy lò cò hay bịt mắt bắt dê, đại khái là những trò dành cho bọn con gái hay khóc nhè. (Về sau, tinh khôn hơn, tôi đã biết cách ỉ ôi để mẹ tôi thả tôi qua nhà hàng xóm, nhờ đó một thời gian dài tôi đã có cơ hội làm những gì tôi thích).
//         Chơi một lát, tôi lại phải vào ngồi ê a tụng bài tiếp, càng tụng càng quên, nhưng vẫn cứ tụng cho mẹ tôi yên lòng đi nấu cơm.
//         Từ giây phút này trở đi thì đời sống của tôi tẻ nhạt vô bờ bến.
//         Tôi uể oải học bài trong khi chờ cơm chín. Cơm chín rồi thì tôi uể oải ăn cơm trong khi chờ tiếp tục học bài.
//         Tivi tiveo hiếm khi tôi mó tay vào được, trông nó cứ như một thứ để trang trí. Bao giờ cũng vậy, tôi chỉ được rời khỏi bàn học khi nào tôi đã thuộc tất cả bài vở của ngày hôm sau.
//         Ba tôi là người trực tiếp kiểm tra điều đó. Khác với mẹ tôi, ba tôi là người kiên quyết đến mức tôi có cảm tưởng ông sẽ thăng tiến vùn vụt nếu vô ngành cảnh sát, tòa án hay thuế vụ. Ông không bao giờ lùi bước trước những giọt nước mắt của tôi, dù lúc đó trông tôi rất giống một kẻ sầu đời đến mức chỉ cách cái chết có một bước chân.
//         – Con học bài xong rồi ba. – Thường thì tôi mở miệng trước.
//         Ba tôi tiến lại và nhìn tôi bằng ánh mắt nghi ngờ:
//         – Chắc không con?
//         – Dạ, chắc!
//         Tôi mau mắn đáp và khi ba tôi bắt đầu dò bài thì tôi lập tức phủ nhận sạch trơn sự quả quyết của mình bằng cách ngắc ngứ ngay ở chỗ mà tôi nghĩ dù có va đầu phải gốc cây tôi cũng không thể nào quên được.
//         – Học lại lần nữa đi con!
//         Ba tôi nhún vai nói và quay đi với tờ báo vẫn cầm chặt trên tay, rõ ràng ông muốn gửi đến tôi thông điệp rằng ông sẵn sàng chờ đợi tôi cho dù ông buộc phải đọc tới mẩu rao vặt cuối cùng khi không còn gì để mà đọc nữa.
//         Qua cái cách ông vung vẩy tờ báo trên tay, tôi e rằng ẩn ý của ông còn đi xa hơn: có vẻ như nếu cần, ông sẽ bắt đầu đọc lại tờ báo đến lần thứ hai và hơn thế nữa. Nghĩ vậy, tôi đành vùi đầu vào những con chữ mà lúc này đối với tôi đã như những kẻ tử thù, tâm trạng đó càng khiến tôi khó mà ghi nhớ chúng vô đầu óc.
//         Cho nên các bạn cũng có thể đoán ra khi tôi đã thuộc tàm tạm, nghĩa là không trôi chảy lắm thì cơ thể tôi đã bị giấc ngủ đánh gục một cách không thương tiếc và thường thì tôi lết vào giường bằng những bước chân xiêu vẹo, nửa tỉnh nửa mê trước ánh mắt xót xa của mẹ tôi.
//         Như vậy, tóm lại là đã hết một ngày.`,
//     },
//     {
//       id: 'fsdafsdfsd',
//       chapterTitle: 'Bố mẹ tuyệt vời',
//       chapterContent: `CHAPTER2: Tôi chỉ cần kể một ngày là đã đủ, không cần phải kể thêm những ngày khác.
//         Ðơn giản là ngày nào cũng giống như ngày nào. Một ngày như mọi ngày, như người ta vẫn nói.
//         Và vì thế cuộc sống đối với tôi thật là đơn điệu, nếu sự lặp đi lặp lại là biểu hiện chính xác nhất và rõ rệt nhất của sự đơn điệu.
//         Mãi về sau này, tôi mới khám phá ra còn có cách nhìn khác về sự lặp đi lặp lại. Người ta gọi nó là sự ổn định.
//         Một công việc có thể sắp đặt trước, một sự nghiệp có thể tính toán trước, là niềm ao ước của rất nhiều người, nhiều quốc gia.
//         Tất nhiên sẽ thật là hay nếu tiên liệu được chỉ số tăng trưởng kinh tế của một đất nước nhưng nếu bạn cũng tiên liệu chính xác như thế về chỉ số tăng trưởng tình cảm của bản thân thì điều đó có khi lại chán ngắt. Sẽ thật kỳ cục nếu như bạn tin chắc rằng một tháng nữa bạn sẽ bắt đầu yêu, ba tháng sau bạn sẽ đang yêu – ít thôi, sáu tháng sau bạn sẽ yêu nhiều hơn…
//         Tôi từng thấy có nhiều người trẻ tuổi lên kế hoạch cho cuộc đời mình: 22 tuổi tốt nghiệp đại học, 25 tuổi lập gia đình, 27 tuổi mở công ty, 30 tuổi sinh con đầu lòng, vân vân và vân vân… Thật sít sao! Nhưng một khi cuộc đời một con người được lập trình chặt chẽ và khoa học đến thế thì nếu tất cả đều vào khuôn như dự tính liệu bạn có bão hòa về cảm xúc hay không?
//         Khi nói về cảm xúc có lẽ không thể không gắn nó với tính cách của từng người. Người lạc quan bảo rằng ổn định cái điều mà người bi quan cho là đơn điệu. Cuộc sống vợ chồng cũng thế thôi, kẻ thì bảo êm đềm, người thì cho vô vị, biết làm thế nào! Quả thật, hai vợ chồng mà sống với nhau êm đềm quá không khéo lại giống sự êm đềm giữa hai người hàng xóm lành tính, và người quá khích lại có dịp bô bô lên rằng êm đềm không hề bà con gì với hạnh phúc, biết nói làm sao!
//         Nhưng ôi thôi, tôi lại nói chuyện lúc tôi đã là người lớn mất rồi. Lại nói chuyện vợ chồng cấm kỵ vô đây nữa!
//         Tôi sẽ quay lại chủ đề của cuốn sách này, quay lại ngay đây, tức là nói cái chuyện tôi hồi tám tuổi.
//         Chuyện tôi sắp kể ra đây, khổ thay, cũng lại liên quan đến chuyện vợ chồng. Nhưng bên cạnh cái khổ cũng có cái may, đây chỉ là trò chơi vợ chồng thôi – cái trò mà đứa trẻ nào bằng tuổi tôi cũng rất thích chơi mặc dù khi lớn lên thì chúng rất dè chừng.
//         Tôi và con Tí sún cạnh nhà tôi là một cặp.
//         Tôi là chồng, con Tí sún là vợ.
//         Con Tí sún không đẹp đẽ gì, người đen nhẻm, tóc xoăn tít vì suốt ngày chạy nhảy ngoài nắng, đã thế lại sún răng.
//         Nhưng tôi sẵn sàng chấp nhận nó làm vợ tôi, chỉ vì nó thích tôi, tôi bảo gì nó cũng nghe răm rắp. Thật lòng, tôi thích con Tủn hơn, vì con Tủn xinh gái nhất xóm, lại có lúm đồng tiền. Nhưng tôi không cưới con Tủn bởi tôi thấy nó cứ hay cặp kè với thằng Hải cò. Sau này tôi biết đó là cảm giác ghen tuông, tất nhiên là ghen tuông theo kiểu trẻ con, còn lúc đó tôi chỉ cảm thấy khó chịu thôi.
//         Và tôi đùng đùng cưới con Tí sún, theo kiểu người lớn hay nói: cưới người yêu mình chứ không cưới người mình yêu, nhất là khi người mình yêu lại không có vẻ gì yêu mình!
//         Tôi cưới con Tí sún chừng năm phút thì lập tức đẻ liền một lúc hai đứa con: thằng Hải cò và con Tủn. Ghét hai đứa nó thì bắt chúng làm con vậy thôi, chứ thằng Hải cò lớn hơn tôi một tuổi
//         – Hải cò đâu? – Tôi kêu lớn.
//         – Dạ, ba gọi con. – Hải cò lon ton chạy tới.
//         Tôi ra oai:
//         – Rót cho ba miếng nước!
//         Thấy con Tủn che miệng cười khúc khích, Hải cò đâm bướng:
//         – Con đang học bài.
//         – Giờ này mà học bài hả? – Tôi quát ầm – Ðồ lêu lổng!
//         Hải cò đưa tay ngoáy lỗ tai để nghe cho rõ:
//         – Học bài là lêu lổng?
//         – Chứ gì nữa! Không học bài làm bài gì hết! Con ngoan là phải chạy nhảy, trèo cây, tắm sông, đánh lộn!
//         Hải cò không ngờ vớ được một ông bố điên điên như thế, cười toét miệng:
//         – Vậy con đi đánh lộn đây!
//         Nói xong, nó co giò chạy mất.
//         Nhưng tôi không giận nó. Tôi đang khoái chí. Tôi tình cờ phát hiện ra cách làm cho cuộc sống bớt tẻ nhạt.
//         – Tủn! – Tôi hét.
//         – Dạ. Rót nước hả ba?
//         Tôi cười khảy:
//         – Mày đừng làm ra vẻ ta đây thông minh. Tao hết khát rồi.
//         Tôi nói như trút giận:
//         – Tao là tao chúa ghét mấy đứa con nít thông minh, tức là mấy đứa học bài nhoáng một cái đã thuộc vanh vách! Hừm, làm như hay lắm!
//         Con Tủn không biết tôi muốn gì. Thấy tôi quát sùi bọt mép, nó sợ run:
//         – Dạ, con không thông minh. Con là đứa ngu đần.
//         Tôi hả hê:
//         – Vậy con mới đúng là con ngoan của ba.
//         Tôi móc túi lấy ra một cây kẹo bé tẹo còn sót lại từ hôm qua:
//         – Ðây, ba thưởng cho con.
//         Con Tủn ngơ ngác cầm lấy cây kẹo, không hiểu tại sao ngu mà được thưởng nên không dám ăn.
//         Tôi đang tính bảo con Tủn “Ăn đi con” thì thằng Hải cò từ bên ngoài xồng xộc chạy vô, miệng thở hổn hển, làm như vừa đánh nhau thật.
//         – Con đi đánh lộn về đó hả con? – Tôi âu yếm hỏi.
//         – Dạ. – Hải cò phấn khởi – Con uýnh một lúc mười đứa luôn đó ba!
//         – Con thiệt là ngoan. – Tôi khen, và đưa mắt nhìn Hải cò từ đầu tới chân – Thế quần áo của con…
//         – Vẫn không sao ba à. – Hải cò hớn hở khoe – Con đập nhau với tụi nó mà quần áo vẫn lành lặn, thẳng thớm…
//         – Ðồ khốn! – Tôi quát lớn, không cho Hải cò nói hết câu – Ðánh nhau mà không rách áo, trầy chân, bầm mặt mà cũng gọi là đánh nhau hả?
//         Sự giận dữ bất ngờ của tôi làm Hải cò nghệt mặt một lúc. Nó chẳng biết phản ứng thế nào ngoài việc ấp a ấp úng:
//         – Dạ… dạ… ủa… ủa…
//         – Dạ dạ ủa ủa cái gì! Con thiệt là đứa hư hỏng! Con làm ba xấu hổ đến chết mất thôi!
//         Con Tí sún, vợ tôi, bắt đầu cảm thấy hoang mang trước lối dạy con của tôi:
//         – Ông à, con nó biết giữ gìn như thế là tốt rồi.
//         – Bà thì biết cái gì! – Tôi nạt con Tí sún, nước miếng bay vèo vèo may mà không trúng mặt nó – Ðánh nhau chứ có phải đi dự tiệc đâu! Ðánh nhau mà quần áo sạch sẽ thế kia thì có nhục cho tổ tiên không kia chứ!
//         Tôi đấm ngực binh binh:
//         – Ôi, chẳng thà nó chém tôi một dao cho rồi! Con ơi là con! Mày ra đây mà giết ba mày đi con!
//         Thấy tôi tru tréo ghê quá, con Tí sún nín khe.
//         Trong khi thằng Hải cò cười hí hí thì con Tủn mặt đực ra như bị thằn lằn ị trúng mặt. Nó không biết làm gì với cây kẹo trên tay, rằng nên nhét vào túi áo hay bỏ vào miệng. Trông mặt nó hết sức lo lắng, có lẽ vì nó hoàn toàn không biết được hành động nào mới không bị ông bố gàn dở kia liệt vào loại “hư hỏng” hay tệ hơn, là “làm nhục tổ tiên”.
//         oOo
//         Tụi bạn tôi chỉ ngạc nhiên hôm đầu tiên.
//         Rồi như bất cứ một đứa trẻ chân chính nào, tụi nó nhanh chóng cảm nhận được sự thú vị của trò chơi tuyệt vời đó.
//         Hôm sau đến lượt thằng Hải cò và con Tủn đóng vai ba mẹ. Tôi và con Tí sún làm con.
//         Tối hôm trước Hải cò chắc thao thức suốt đêm, chờ trời sáng. Sáng ra tôi thấy mắt nó đỏ kè. Nếu hôm đó không phải là ngày chủ nhật, có lẽ Hải cò sẽ bị sự nôn nóng đốt thành than trước khi cả bọn đi học về.
//         – Thằng cu Mùi đâu? – Hải cò oang oang, giọng rất chi là hào hứng.
//         Cu Mùi là tên ở nhà của tôi. Ba mẹ tôi gọi tôi như thế có lẽ do tôi sinh năm Mùi.
//         – Dạ. – Tôi ứng tiếng thưa.
//         – Con đem tập vở ra đây cho ba xem nào.
//         Tôi lôi cuốn tập nhét trong lưng quần, hồi hộp đưa cho Hải cò, bụng cố đoán xem nó định “dạy dỗ” tôi như thế nào.
//         Lật lật vài trang, Hải cò hét ầm:
//         – Cu Mùi!
//         Tôi lấm lét nhìn nó:
//         – Dạ.
//         Hải cò đập tay xuống bàn một cái rầm:
//         – Con học hành cách sao mà tập vở trắng tinh như thế hả?
//         Tôi chưa kịp đáp, nó thẳng tay ném cuốn tập qua cửa sổ, gầm gừ:
//         – Học với chẳng hành! Mày giữ gìn tập vở sạch sẽ như thế này mày không sợ thầy cô bảo ba mẹ mày không biết dạy con hả, thằng kia?
//         Tôi bị mắng như tát nước vào mặt mà ruột nở từng khúc. Tôi không ngờ Hải cò là một ông bố tuyệt vời đến thế.
//         Tôi hân hoan nhận lỗi:
//         – Thưa ba, lần này con trót dại. Lần sau con không dám giữ gìn tập vở kỹ lưỡng như vậy nữa.
//         Tôi nói, và đảo mắt nhìn quanh, thấy đằng góc nhà con Tủn và con Tí sún đưa tay bụm miệng cố nén cười.
//         – Cái con nhóc sún răng kia! Cười cái gì! – Hải cò lừ mắt nhìn con Tí sún – Mày nấu cơm xong chưa mà đứng đó nhe răng sún ra cười hả?
//         Con Tí sún lễ phép:
//         – Dạ, con đã dọn cơm rồi. Mời ba mẹ và anh Hai ăn cơm.
//         – Mày có điên không vậy con! – Hải cò giơ hai tay lên trời – Ðến giờ cơm là ngồi vô ăn, chỉ có kẻ không được giáo dục đến nơi đến chốn mới làm như vậy, hiểu chưa?
//         – Dạ, chưa hiểu. – Con Tí sún thật thà – Chứ kẻ có giáo dục thì đến giờ cơm họ làm gì hả ba?
//         – Họ đi chơi chứ làm gì. – Hải cò khoa tay như một diễn giả – Họ đi bơi, họ chơi bi-da, họ câu cá, họ chơi rượt bắt hoặc đánh nhau, nói chung họ có thể làm bất cứ chuyện gì để người khác phải đợi cơm, trừ cái chuyện hết sức vô văn hóa là ngồi vô bàn ăn.
//         Con Tủn tỉnh bơ đế vô:
//         – Ba con nói đúng đó con. Chỉ có bọn hư hỏng mới ăn cơm đúng giờ thôi!
//         oOo
//         Lúc đầu, tôi tưởng chỉ có mình tôi khoái cái trò điên điên này. Hóa ra đứa nào cũng khoái. Trong bọn, con Tí sún là đứa hiền lành và chậm chạp nhất nhưng qua đến ngày thứ ba, nó cũng kịp thích ứng với hoàn cảnh bằng cách chỉnh thằng Hải cò ra trò khi tới lượt nó làm mẹ.
//         – 2 lần 4 là mấy?
//         – Dạ, là 8.
//         Con Tí sún không quát tháo om sòm như tôi và Hải cò, nhưng mặt nó trông thật thiểu não:
//         – Sao lại là 8 hả con? Thật uổng công mẹ cho con ăn học!
//         Hải cò chớp mắt:
//         – Chứ là mấy?
//         – Là mấy cũng được nhưng không phải là 8.
//         – Mẹ ơi, theo bản cửu chương thì 2 lần 4 là 8.
//         – Mày là con vẹt hả con? Bản cửu chương bảo gì mày nghe nấy là sao? Thế mày không có cái đầu à?
//         Hải cò sờ tay lên đầu, hối hận:
//         – Con đúng là một đứa không có đầu óc. Lần sau con sẽ không nghe theo bất cứ ai nữa, dù đó là bản cửu chương hay thầy cô giáo. Con hứa với mẹ con sẽ tự suy nghĩ bằng cái đầu của con.
//         Câu nói của Hải cò được coi như tuyên bố chung của cả bọn, kết thúc một thời kỳ tăm tối chỉ biết sống dựa vào sự bảo ban của người khác. Ôi, cuộc sống kể từ lúc đó mới thật đáng sống làm sao!
//         Nhưng như người ta thường nói “niềm vui ngắn chẳng tày gang”: vào cái ngày Hải cò mang bộ mặt ủ ê đến gặp tôi, chúng tôi chợt nhận ra cuộc sống vẫn xám xịt như thể xưa nay một năm vẫn có tới bốn mùa đông.
//         – Mày sao thế? Mới bị ăn đòn à? – Tôi tò mò hỏi.
//         – Ừ. Vì cái tội dám bảo chỉ có đứa đần độn mới giữ gìn tập vở sạch sẽ.
//         Con Tí sún xuất hiện với bộ mặt thảm sầu:
//         – Còn mình bị ba mình phạt vì khăng khăng 3 lần 5 không phải là 15.
//         Con Tủn góp vào hai hàng nước mắt và tiếng thút thít:
//         – Còn mình thì mặc cho ba mẹ kêu khản cả cổ, mình nhất định không chạy về ăn trưa.
//         Tôi lướt mắt nhìn ba đứa bạn, lặng lẽ thở dài.
//         Tôi tập tành làm nhà cách mạng bé con, chán nản khi không thay đổi được thế giới, đã thế còn làm vạ lây cho người khác.
//         Cho nên tôi không ủ ê, không thảm sầu, không thút thít và rưng rưng hai hàng nước mắt.
//         Nỗi đau của tôi lặn vào bên trong. Nó sâu sắc hơn, ít nhất là bằng nỗi đau của ba đứa bạn cộng lại.
//         Vì ngày hôm qua tôi bị ăn đòn vì phạm cùng lúc cả ba cái tội trên kia`,
//     },
//     {
//       id: 'fsdafs3dâfsd',
//       chapterTitle: 'Ðặt tên cho thế giới',
//       chapterContent: `CHAPTER3: Rốt cuộc, sau những thương tích tâm hồn lẫn thể xác, chúng tôi buộc phải chấp nhận không nên nghĩ khác bản cửu chương in ở đằng sau mỗi cuốn tập. Nếu muốn thay đổi chúng tôi đành phải chờ đến lúc thành tài, tức là lúc đã trở thành những nhà toán học nổi tiếng thế giới, lúc đó chúng tôi sẽ soạn một bản cửu chương theo ý mình.
//         Trong khi chờ đợi (ôi, lâu quá!), tôi, Hải cò, con Tủn và con Tí sún buộc phải đồng ý trong đớn đau rằng 2 lần 4 là 8, cũng như 3 lần 5 là 15.
//         Với thái độ đầu hàng nhục nhã đó, chúng tôi nhanh chóng trở lại là những đứa con ngoan trong mắt ba mẹ, nghĩa là coi chuyện giữ gìn tập vở là thiêng liêng như giữ gìn con ngươi của mắt mình, cũng như buộc phải thừa nhận rằng một đứa trẻ siêng học dứt khoát không phải là một đứa trẻ hư hỏng.
//         Cuộc sống lại quay lại đường ray cũ kỹ của nó và đời tôi lại có nguy cơ mòn mỏi theo nhịp sống đơn điệu kể từ khi tôi được sinh ra.
//         Làm thế nào bây giờ nhỉ? Tôi nghĩ, nghĩ mãi, và nhờ thượng đế phù hộ cuối cùng tôi cũng nghĩ ra lối thoát.
//         – Này, tụi mày! – Nhà cách mạng tập hợp đám tàn binh của mình lại – Kể từ hôm nay, tụi mình không gọi con gà là con gà, con chim là con chim, cuốn tập là cuốn tập, cây viết là cây viết nữa…
//         Con Tí sún ngẩn ngơ:
//         – Thế gọi bằng gì?
//         – Gọi bằng gì cũng được, miễn là không gọi như cũ!
//         Hải cò nheo mắt:
//         – Thế gọi cái nón là cuốn tập, cái đầu là cái chân được không?
//         – Ðược. – Tôi hừ mũi – Mày muốn gọi cái đầu là cái mông cũng được.
//         Con Tủn thắc mắc:
//         – Nhưng tại sao lại làm thế?
//         Năm đó, tức vào năm tám tuổi, tôi chưa biết rằng trong công thức 5W mà người phương Tây dùng như một công cụ để khám phá sự thật, gồm “What – Who – Where – When – Why” mà người Việt chúng ta vẫn dịch là “Cái gì – Ai – Ở đâu – Khi nào – Tại sao” thì câu hỏi “Tại sao” bao giờ cũng là câu hỏi sâu sắc nhất, có tính bản chất nhất, và dĩ nhiên là khó trả lời nhất. So với bốn câu hỏi còn lại, câu hỏi bắt đầu bằng hai chữ “Tại sao” quan trọng hơn hẳn.
//         Hồi bé, hẳn là bạn cũng có hằng hà những câu hỏi “tại sao” khiến ba mẹ bạn vô cùng bối rối.
//         Tại sao khi mưa trời lại có sấm sét?
//         Tại sao tóc chỉ mọc ở trên đầu?
//         Tại sao chúng ta lại ăn Tết?
//         Tại sao đường lại ngọt còn muối thì mặn?
//         Tại sao máu có màu đỏ?
//         Tại sao con cò khi ngủ lại co một chân?
//         Tại sao đàn ông có vú?
//         Tại sao trái đất quay quanh mặt trời?
//         Chúng ta, nói một cách chính xác là bọn nhóc tì chúng ta, đã đi từ thắc mắc đơn giản nhất đến thắc mắc phức tạp nhất, trong đó có những câu hỏi mà nếu không phải là một nhà khoa học giỏi giang thì không thể giải thích thấu đáo được. Ba mẹ chúng ta hồi đó (chúng ta bây giờ đôi khi cũng vậy) thường tìm cách lảng sang chuyện khác hoặc không nhịn được mà nổi khùng lên với đám con cái chẳng qua vì họ tự giận mình không phải là nhà khoa học giỏi giang đó thôi.
//         Nhưng đến những câu hỏi kiểu như “Tại sao chúng ta được sinh ra?”, “Tại sao chúng ta phải sống?”, “Tại sao chúng ta phải chết?”, thì các nhà khoa học cũng bó tay. Những thắc mắc lúc này đã trở nên siêu hình và bắt đầu đặt chân vào lãnh vực của triết học. Thái tử Tất Ðạt Ða từng đi tìm lời giải đáp cho vấn nạn cơ bản này – nhằm giải mã ý nghĩa của sự tồn tại, để cuối cùng trở thành một nhà khai sáng thuộc loại vĩ đại bậc nhất thế giới dưới cái tên Thích Ca Mâu Ni.
//         Ôi, tôi lại huyên thuyên nữa rồi. Nhưng tất cả cũng là do con Tí sún. Nó hỏi tôi “tại sao” – một câu hỏi mang mầm mống triết học. Ðể nỗ lực trả lời một câu hỏi mang mầm mống triết học, bất cứ ai cũng có thể trở thành triết gia, cho dù người đó không cố ý và chỉ mới có tám tuổi.
//         Tôi thao thao, mặt đỏ gay:
//         – Tại sao lại làm thế à? Tại vì tụi mình cần phải chứng tỏ tụi mình có giá trị riêng. Tụi mình không thích tuân thủ theo sự sắp đặt của người khác. Tại sao phải gọi con chó là con chó? Hừ, con chó là con chó, điều đó chẳng có ý nghĩa gì hết. Nếu người đầu tiên gọi con chó là cái bàn ủi thì bây giờ chúng ta cũng gọi nó là cái bàn ủi. Chỉ toàn là a dua thôi! Thật là ngu ngốc!
//         – Hay quá, cu Mùi! – Hải cò reo lên – Trong bọn, cái bàn ủi nhà con Tủn là hung dữ nhất. Nếu con Tủn không xích cái bàn ủi của nhà nó lại, thì dù tao có là chồng nó tao thề sẽ không bao giờ bước chân qua nhà nó!
//         – Hải cò! – Con Tủn gầm gừ – Tôi nghĩ bạn nên khép cái cánh tay của bạn lại đi.
//         Hải cò dang tay ra và nhíu mày:
//         – Cánh tay này á?
//         Tôi cười:
//         – Tao nghĩ con Tủn đang muốn nói đến cái miệng của mày thì đúng hơn.
//         – À, – Hải cò gục gặc đầu – Có nghĩa là từ nay chúng ta sẽ gọi cái miệng là cánh tay. Hay đấy!
//         oOo
//         Những ngày đó, tốt nhất là bạn không nên bước vào thế giới của bọn tôi. Nếu không, bạn sẽ có cảm giác bạn đang lạc vào một hành tinh khác.
//         Tôi nói thật đó. Vì chắc chắn bạn sẽ không thể hiểu những lời đối đáp như thế này:
//         – Tối rồi, tao về nhà đi chợ đây.
//         – Mẹ tao hứa sẽ mua cho tao một cái giếng mới vào ngày sinh nhật.
//         Dù giàu tưởng tượng đến mấy, bạn cũng không tài nào hình dung được chúng tôi có thể nói đi chợ thay cho đi ngủ, cũng như chiếc cặp bỗng nhiên biến thành cái giếng một cách hồn nhiên.
//         Những bậc phụ huynh đáng kính tất nhiên không thích thú gì với cái trò ăn nói lung tung này, nhất là bọn tôi có vẻ như dần dần nhiễm những từ ngữ mới đến mức khi ba con Tủn bảo nó tắt quạt máy thì nó lại tắt tivi, cũng như con Tí sún hàng chục lần chạy ra đường chỉ để kiếm con Vện trong khi mẹ nó mỏi mòn chờ nó mang cái bàn ủi vô.
//         Lúc đó, tôi cứ nghĩ đó là trò chơi trẻ con và chỉ trẻ con mới nghĩ ra những trò kỳ thú như vậy. Chúng tôi muốn thay đổi một cách gọi, thậm chí nếu được thì đặt tên lại cho cả thế giới, chỉ với một mục đích hết sức tốt đẹp là làm cho thế giới mới mẻ, tinh khôi như được sinh ra lần nữa. Chúng tôi đâu có cách nào khác khi chúng tôi còn quá trẻ trong khi thế giới thì lại quá già. Vì vậy mà bọn nhóc chúng tôi rất cần một thế giới non trẻ và giàu có của riêng mình.
//         Nhưng khi tôi đã trở thành người lớn thì tôi phát hiện ra người lớn cũng rất thích chơi trò này, tất nhiên với một mục đích hoàn toàn khác. Người ta gọi hối lộ là tặng quà trên mức tình cảm, gọi những hành vi sai trái là thiếu tinh thần trách nhiệm, gọi tham ô là thất thoát gây hậu quả nghiêm trọng, vân vân và vân vân. Mục đích của sự đánh tráo khái niệm này là đẩy vô chỗ mù mờ những gì đang vô cùng sáng rõ, với cách thức điển hình là dùng một cụm từ phức tạp và có thể hiểu sao cũng được để gọi một sự việc mà người ta hoàn toàn có thể gọi đích danh bằng một từ ngắn gọn, đơn giản và minh bạch đến mức dù muốn cũng không ai có thể hiểu khác đi. Cứ theo cung cách đáng ngại này một ngày nào đó rất có thể người ta sẽ phát giải Nobel vật lý cho người nào có khả năng gây ra một lực tác động có chủ ý khiến vật chất chuyển động từ vị trí này sang vị trí khác mà khách thể không hề hay biết trong khi cái cụm từ mỹ miều, sang trọng đó thực ra là để chỉ tên móc túi.
//         Bọn trẻ chúng tôi ngây thơ và trong sáng hơn nhiều.
//         Nhưng cũng vì vậy mà chúng tôi phải trả giá.
//         Ðây là tai nạn của Hải cò.
//         Cô giáo kêu nó đọc một đoạn văn trong sách tập đọc.
//         – Em lấy sách ra! – Cô giáo bảo và nó thản nhiên cầm lên cuốn sách toán.
//         – Ðâu phải cuốn này! – Cô giáo sửng sốt – Em không đem theo sách tập đọc à? Thế cuốn tập của em đâu. Em có chép bài không đấy?
//         Hải cò lúng túng lôi cái nón vải nhét trong túi quần ra, đặt lên bàn.
//         – Em đùa đấy à! – Cô giáo đứng phắt dậy, mặt đỏ gay – Em theo cô lên văn phòng gặp thầy hiệu trưởng ngay!
//         – Thưa cô, thầy hiệu trưởng hôm nay không đi học. Hôm qua thầy hiệu trưởng đánh nhau với em, sáng nay còn nằm rên hừ hừ ở nhà ạ.
//         Thầy hiệu trưởng trong tâm trí Hải cò tất nhiên là tôi – thằng cu Mùi. Chiều hôm qua tôi nện nhau với nó thật (chỉ vì giành nhau xem đứa nào được làm cha đứa nào trước) và đến tối thì tôi lên cơn sốt, vì nguyên nhân gì chỉ có trời mới biết nhưng Hải cò huênh hoang là nó đánh tôi nằm bẹp.
//         Trong thế giới vừa được đặt tên lại của bọn tôi, Hải cò là cảnh sát trưởng, con Tủn là tiếp viên hàng không, con Tí sún là nàng Bạch Tuyết, còn tôi là thầy hiệu trưởng. Những cái tên này do chúng tôi tự chọn, theo nguyện vọng thầm kín của mỗi đứa.
//         Những ngày tuơi đẹp trước khi Hải cò bị nạn, thế giới của bọn tôi đầy ắp những âm thanh hoan hỉ như thế này:
//         – Thầy hiệu trưởng, hôm nay tôi làm mẹ, thầy hiệu trưởng làm con nhé?
//         – Mày nhai chóp chép cái gì trong cánh tay vậy, cảnh sát trưởng làm con nhé?
//         – Bạch Tuyết, đứng xê ra xa chút đi! Tối hôm qua trong lúc đi chợ con có đái dầm không mà ba nghe khai rình thế?
//         – Tiếp viên hàng không, bạn mới mua cuốn tập mới hả? Ðưa đây đội thử chút coi!
//         Các bạn cũng biết rồi đó, bọn tôi đặt cho cái nón cái tên mới là cuốn tập, tivi là quạt máy, đi ngủ là đi chợ. Và cũng thật là tuyệt khi bọn tôi gọi môn toán là môn tập đọc, lịch sử là tập viết, môn đạo đức là tập vẽ, và hằng hà những cuộc cách tân táo bạo khác.
//         Nhưng tất cả đều không nguy hiểm bằng gọi cu Mùi bằng thầy hiệu trưởng.
//         Rất may là thầy hiệu trưởng thật sau hàng giờ thẩm vấn cảnh sát trưởng đã hiểu ra thầy hiệu trưởng bị Hải cò đánh cho nằm bẹp không phải là thầy, và tuy thầy không coi đó là sự xúc phạm nhưng sau giờ phút đen tối đó của lịch sử, con chó đã trở lại là con chó, thằng cu Mùi trở lại là thằng cu Mùi, có nghĩa chúng tôi không được phép định nghĩa lại thế giới một lần nữa theo cách mà người lớn còn lâu mới nghĩ ra.
//         Họ cấm chúng tôi có thể vì họ ghen tị chăng?`,
//     },
//     {
//       id: 'fsdafsdâ4fsd',
//       chapterTitle: 'Buồn ơi là sầu',
//       chapterContent: `CHAPTER 4: Tôi hỏi chú Nhiên “Tại sao chú yêu cô Linh?” thì chú không trả lời được, và sự bối rối của chú làm tôi rất ngạc nhiên.
//         Sau này, khi đã biết đến mối tình đầu thứ tám thì tôi mới hiểu rằng cắt nghĩa tại sao ta không yêu một người nào đó dễ dàng hơn rất nhiều so với việc giải thích tại sao ta yêu họ.
//         Người ta nói đàn ông sẵn sàng cưới một cô gái chỉ vì một chiếc cằm xinh nhưng phụ nữ không bao giờ lấy đàn ông chỉ vì một cặp đùi đẹp. Ðiều đó không đúng. Cả đàn ông lẫn phụ nữ không ai lấy người kia chỉ vì một bộ phận nếu anh ta (hay cô ta) thực sự tin rằng lấy một người có nghĩa là cuộc đời mình bị cột chặt vào người đó bằng sợi xích vững chắc của số phận.
//         Chiếc cằm xinh hay đôi mắt đẹp khiến người đối diện chú ý nhưng nó chỉ đóng vai trò soi đường như ánh đèn pin trong tay người dẫn chỗ trong rạp hát. Khi tấm màn nhung đã kéo lên, đèn folo rọi xuống và những nhân vật đã xuất hiện trên sân khấu, lúc đó cuộc phiêu lưu tâm hồn mới thực sự bắt đầu và tùy theo vở diễn hấp dẫn hay nhạt nhẽo mà chúng ta sẽ quyết định ngồi lại đến phút chót hay bỏ về nửa chừng.
//         Tình yêu cũng vậy, ấn tượng bề ngoài rất đáng kể nhưng đáng kể hơn nữa là vẻ bề ngoài đó có đang cất giấu điều gì đáng kể ở đằng sau nó hay không.
//         Ôi, tôi đang vung vít gì thế này?
//         Tôi đang nói chuyện chú Nhiên.
//         Chú Nhiên yêu cô Linh.
//         Họ là một cặp.
//         Một cặp hoàn toàn khác với tôi và con Tí sún hay thằng Hải cò và con Tủn.
//         Cái khác dễ thấy nhất là họ sắp cưới nhau.
//         Họ sắp là vợ chồng. Vợ chồng thật.
//         Bọn tôi thì còn khuya.
//         Tôi không biết cảnh sát trưởng khi lớn lên có cưới tiếp viên hàng không làm vợ hay không, nhưng thầy hiệu trưởng chắc chắn không dại gì rinh nàng Bạch Tuyết về nhà.
//         Sở dĩ con Tí sún nằm ngoài kế hoạch hôn nhân của tôi (nếu tôi thực sự có kế hoạch lấy vợ vào lúc tám tuổi) chỉ bởi một lý do đơn giản: con Tí sún là đứa con gái nấu ăn kém nhất trong những đứa con gái mà tôi từng biết và sẽ biết.
//         Như đã nói, tôi ăn uống chẳng cầu kỳ gì. Tôi chẳng buồn quan tâm đến thành phần dinh dưỡng của món ăn. Rất lâu về sau này, khi tuổi tác ngày càng chất chồng và cơ thể tôi bắt đầu chống lại tôi, tôi mới bắt đầu để ý có bao nhiêu phần trăm proteine, cholesterol, glucide, lipide trong cái thứ mà mình sắp tống vào dạ dày chứ hồi tôi tám tuổi chất béo đối với tôi cũng có giá trị ngang chất xơ, còn đạm và đường hiển nhiên là một.
//         Hồi đó, tôi chỉ thích có ba món: mì gói, mì gói và dĩ nhiên mì gói. Là cái thứ mà nếu bắt gặp tôi ôm trong người thế nào mẹ tôi cũng giằng khỏi tay tôi, kể cả bằng biện pháp bạo lực hoàn toàn trái với bản tính hiền lành của bà.
//         Tóm lại, muốn ăn mì gói tôi phải trốn qua nhà con Tí sún, nhờ nó nấu giùm. Gọi nấu mì là gọi cho oai, chứ thực ra chỉ là nấu một ấm nước sôi. Con Tí sún chỉ bỏ mì vô tô, sau đó bỏ thêm các bịch gia vị có sẵn rồi chế nước sôi vào.
//         Có lẽ trên đời không có món ăn nào dễ nấu như mì gói. Dễ đến mức so với nó, tráng một quả trứng bỗng hóa thành phức tạp ngang với việc phóng phi thuyền lên mặt trăng. Vậy mà con Tí sún chưa bao giờ nấu được một tô mì ra hồn trong suốt cuộc đời mình, nếu như cuộc đời nó chỉ tính đến tuổi lên tám.
//         Tô mì hôm thì khô không khốc, hôm thì nước nhiều đến mức tôi có cảm giác nếu con Tí sún không muốn dìm chết một kẻ thù vô hình nào đó vừa sẩy chân rớt vào trong tô thì hẳn là nó muốn trả thù tôi về những lời quát tháo lúc tôi làm chồng nó cách đó mấy ngày. Cũng có lúc con Tí sún gặp hên chế nước sôi vừa phải, nhưng những lúc hiếm hoi như vậy bao giờ nó cũng quên bỏ gia vị vô tô mì.
//         Vì tất cả những lẽ đó, tôi chỉ cho phép con Tí sún nấu mì giùm tôi tổng cộng ba lần. Tới lần thứ tư thì tôi gắt (dù lúc này chúng tôi không chơi trò vợ chồng nhưng con Tí sún vẫn ngoan ngoãn nghe lời tôi):
//         – Mày xê ra! Ðưa ấm nước sôi đây, tự tao làm!
//         oOo
//         Khi tôi được chín tuổi thì mẹ tôi sinh em bé.
//         Khi tôi mười bảy tuổi thì em gái tôi lên tám, bằng tuổi con Tí sún lúc tôi gắt nó “xê ra”.
//         Tám tuổi, em gái tôi đã biết nấu cơm, kho cá, quét nhà, rửa chén và biết làm thuần thục hàng đống thứ tội nợ khác.
//         Mẹ tôi bảo:
//         – Con gái là phải biết làm mọi thứ. Mai mốt con lớn lên, con đi lấy chồng, nhìn con khéo léo hay vụng về, người ta sẽ biết mẹ dạy con như thế nào.
//         Mẹ tôi nói giống như người phương Tây sáng tác ngạn ngữ. Người Pháp nói “Bạn hãy cho tôi biết bạn đọc sách gì, tôi sẽ nói bạn là người như thế nào!”. Câu nói của mẹ tôi cũng đại ý như thế “Bạn hãy cho tôi biết con gái bạn làm việc nhà như thế nào, tôi sẽ nói bạn là ai!”.
//         Ðó là cách suy nghĩ của mẹ tôi, cũng là cách suy nghĩ của mọi bà mẹ Việt Nam truyền thống. Căn cứ theo cách đánh giá này thì rõ ràng mẹ con Tí sún không hề dạy nó bữa nào.
//         Mà sự thật là như vậy. Mẹ con Tí sún không hề dạy con.
//         Mẹ nó mất ngay khi nó vừa chào đời. Người ta bảo mẹ nó bị băng huyết.
//         Con Tí sún là đứa mồ côi mẹ và nó chỉ có một con đường duy nhất là học cách nấu ăn dở tệ từ ba nó.
//         Tất nhiên vào lúc tám tuổi, tôi chưa có em gái và mẹ tôi chưa có dịp thốt ra những lời vàng ngọc như vậy. Nhưng ngay lúc đó, tôi đã cương quyết sẽ không lấy con Tí sún làm vợ, cho dù hai đứa chắc chắn sẽ cùng lớn lên cạnh nhau từ tuổi ấu thơ đến lúc mỗi đứa phải lập gia đình. Chơi trò vợ chồng và sinh ra thằng Hải cò và con Tủn để mắng cho sướng miệng thì được. Còn trở thành vợ chồng thật thì không bao giờ.
//         Tiêu chuẩn người bạn đời của tôi lúc đó chẳng lấy gì làm cao. Chỉ có một tiêu chuẩn be bé thôi: Phải biết nấu mì gói cho tôi ăn. Thế mà tiêu chuẩn bé như con kiến đó, con Tí sún cũng chẳng đáp ứng được.
//         Khi đọc tới chỗ này, chắc bạn sẽ mỉm cười: Ối giời, chuyện trẻ con!
//         Nhưng không phải đâu. Khi lớn lên, tôi vẫn thấy chuyện nấu nướng khá là quan trọng trong đời sống vợ chồng. Tất nhiên chuyện nội trợ chẳng đóng vai trò gì đáng kể trong quá trình yêu nhau giữa một chàng trai và một cô gái. Từ trước đến nay, có hàng ngàn cuốn tiểu thuyết Ðông Tây kim cổ viết về đề tài tình yêu, nhưng chẳng có cuốn nào đề cập đến một mối tình trong đó chàng yêu nàng vì tài làm bếp hoặc chàng bỏ rơi nàng vì món súp nàng nấu quá mặn cả. Romeo bất chấp sự hiềm khích giữa hai dòng họ để đeo đuổi Juliet chắc chắn không phải vì món chả cá của cô ta. Ðiều đó chẳng có gì sai, vì các nhà văn viết chuyện ái tình chứ đâu có viết chuyện hôn nhân. Do đó tôi vẫn tin rằng mối tình Romeo và Juliet sở dĩ trở nên tuyệt đẹp bởi cả hai đã chết trước khi họ kịp lấy nhau và nàng Juliet chưa có dịp nấu mì gói cho Romeo.
//         Bạn ngẫm mà xem: Có phải trên thực tế, cho đến khi rước được người đẹp về nhà các chàng trai gần như không có lấy mảy may cơ hội để đánh giá tài bếp núc của người bạn đời tương lai?
//         Chỗ này cần nói rõ để tránh gây hiểu lầm: Ðó là do các chàng trai không quan tâm chứ không phải các cô gái cố tình giấu giếm. Ðang tắm mình trong bầu không khí lãng mạn của những ngày tháng yêu đương thì cái ăn rõ ràng chỉ là chuyện thứ yếu, thậm chí còn bị xếp vào phạm trù phàm tục. Yêu dứt khoát phải thơ mộng hơn ăn, như trái tim nhất định phải cao quý hơn dạ dày. Trương Chi thời xưa chắc từng nghĩ thế và Trương Chi thời nay cũng không nghĩ khác.
//         Rồi bạn hãy ngẫm tiếp: Có phải khi yêu nhau chàng vẫn thích dẫn nàng đi ăn ở ngoài? Nhiều tiền thì vào nhà hàng sang trọng hoặc khu ăn uống ở các plaza, ít tiền thì vào các quán ăn bình dân, ít tiền hơn cả ít tiền thì ra ngoài lề đường ngồi lai rai nghêu sò ốc hến. Còn hôm nào rỗng túi thì chàng quyết nằm bẹp ở nhà, với lý do hết sức cao cả “Hôm nay anh bận việc cơ quan”. Chẳng chàng trai nào nghĩ đến chuyện rủ người đẹp về nhà bắt nàng nấu cho mình ăn. Các chàng đều nghĩ, rất tự trọng: Ăn là cái quái gì mà quan trọng thế! Người đàng hoàng yêu nhau bằng thị giác, thính giác, khứu giác và xúc giác, chỉ có bọn phàm phu lỗ mãng mới yêu nhau bằng vị giác!
//         Các chàng nghĩ đúng quá, và chẳng chàng trai nào buồn khảo sát tài nấu nướng của kẻ sắp phụ trách khâu ẩm thực cho suốt quãng đời còn lại của mình.
//         Mãi đến khi tấm lưới hôn nhân đã giăng ra, người đàn ông khốn khổ đó mới phát hiện lãnh vực mà chàng chẳng mấy chú ý khi yêu nhau lại là lãnh vực mà chàng phải chạm trán hàng ngày khi lấy nhau.
//         Khoa nấu nướng vốn xa lạ với đời sống tình yêu lại trở nên mật thiết với đời sống vợ chồng. Tài nội trợ của nàng chưa bao giờ được đếm xỉa đến trong những tiêu chuẩn kết bạn của chàng bỗng nhiên nổi lên như một yếu tố hàng đầu trong việc góp phần vào việc củng cố hay làm tan nát gia đình.
//         Vào một ngày có lẽ là không xa lắm, chàng đau khổ nhận ra chàng phải đối diện với cái bàn ăn trong nhà mỗi ngày tới những ba lần. Nàng có biết nấu mì gói hay không, cái chuyện vặt đó bây giờ bỗng trở thành thiết thân, thường trực và đáng đem ra chì chiết nhau hơn bao giờ hết.
//         Con Tí sún nấu mì gói cho tôi ba lần tôi đã không chịu nổi (nó nấu một món để người ta ghê tởm mì gói thì đúng hơn), thế còn bạn, bạn có cam tâm chịu đựng hoàn cảnh tương tự – không chỉ ba lần hay ba chục lần mà cho đến mãn đời?
//         Nếu bạn thành thực trả lời rằng “không” thì ắt bạn sẽ đồng ý với tôi rằng hạnh phúc đôi khi tan vỡ không hẳn do sự thiếu chung thủy hay do xung đột về tính cách, nó hoàn toàn có thể bắt nguồn từ bàn ăn, thậm chí từ một chén nước mắm!
//         Ðó là những gì tôi nghiền ngẫm và đúc kết vào lúc tôi bốn mươi tuổi hay hơn một chút, tức là lúc tôi đã đủ trưởng thành để dành cho những nhu cầu tầm thường của thể xác một mối quan tâm ngang với những nhu cầu cao quý của tâm hồn và sẵn sàng coi trọng cả hai.
//         Một thời gian sau nữa, tức là vào lúc tôi viết cuốn sách này, tôi trưởng thành thêm một bậc khi phát hiện ra những gì tôi nói huyên thuyên nãy giờ về mối quan hệ keo sơn giữa nấu nướng và hạnh phúc, giữa phòng ăn và phòng ngủ thực ra chẳng có gì nghiêm trọng hết.
//         Bởi một lý do hết sức đơn giản: nấu nướng là lãnh vực hoàn toàn có thể học hỏi và tự hoàn thiện mỗi ngày – dĩ nhiên với điều kiện người vợ quyết tâm hoàn thiện để giữ không cho chồng mình sa vào cái bếp của một người đàn bà khác.
//         Thú thực là tôi hết sức xúc động về phát hiện muộn màng đó, có lẽ không kém gì nỗi xúc động của Newton lúc ông phát hiện khi quả táo rơi thì nó rơi trúng đầu mình chứ không rơi trúng đầu của người ngồi cách đó một cây số hay rơi ngược trở lên ngọn cây.
//         Những khám phá vĩ đại trong cuộc sống xưa nay đều giản dị như vậy. Nhưng khám phá của tôi vĩ đại nhất ở chỗ nó giúp cho các bà các cô lâu nay vẫn mặc cảm và lo lắng về tài làm bếp của mình từ giờ trở đi đã có thể ăn ngon ngủ yên.
//         oOo
//         Tóm lại, nếu dùng ánh sáng thông thái của hiện tại để soi rọi lại quá khứ thì việc tôi quyết định không lấy con Tí sún làm vợ có thể gọi là một quyết định sai lầm. Bởi vì cho đến bây giờ, sau rất nhiều năm vợ chồng con Tí sún sống với nhau mà vẫn chưa tan vỡ, thậm chí còn đẻ sòn sòn mỗi năm một đứa, tôi buộc phải kết luận rằng nó đã cải thiện được khả năng làm bếp của mình và rất có thể nó đã trở thành người nấu mì gói ngon nhất thế giới cũng nên.
//         Sai lầm của tôi còn ở chỗ này: nếu đã khắc phục được sự vụng về xảy ra trong khu vực bếp núc, con Tí sún xứng đáng được coi là mẫu người vợ lý tưởng cho bất cứ chàng trai khó tính nào.
//         Con Tí sún tất nhiên rất siêng năng, rất chịu khó, rất yêu chồng. Nhưng siêng năng, chịu khó và yêu chồng thì trên đời này có hàng mớ. Phẩm chất cao quý nhất, cao quý tột bậc của nó – cũng là phẩm chất khiến nó có giá trị hơn một người vợ là nó biết nói khi cần nói, biết im khi cần im, một đức tính hiếm hoi nơi phụ nữ thông thường.
//         Sở dĩ tôi nói như vậy vì khi sống đến từng này tuổi rồi tôi đã chứng kiến không ít những người vợ luôn luôn nói khi cần im và luôn luôn im khi cần nói, đại khái giống như một chiếc tivi bị hỏng volume.
//         Ðôi khi bạn bảo “im” thì vợ bạn không những không im mà còn quát to hơn, đến mức có cảm giác mọi chiếc tàu ngoài Thái Bình Dương đều nghe thấy. Lúc đó, người phải im chính là bạn.
//         Không biết các bạn thế nào chứ tôi thì tôi từng có trong nhà một chiếc tivi cũ kỹ (do bố vợ hụt tặng tôi lúc tôi đồng ý không tiếp tục theo đuổi con gái ông), đó là chiếc tivi cà tàng đến mức tôi phải vung nắm đấm nện thình thình thì nó mới chịu nói, và khi muốn tắt thì tôi phải nện cật lực thêm một hồi nữa, cho đến lúc hai bàn tay đỏ nhừ như vừa bước ra khỏi sàn đấu quyền Anh.
//         Con Tí sún không có chút gì giống như vậy. Nếu không coi lối ví von sau đây là bất nhã thì con Tí sún là một chiếc tivi mà khách tiêu dùng nào cũng ao ước. Nó chỉ thua chiếc tivi thật ở chỗ nó không biết ca hát, không biết dự báo thời tiết lẫn bình luận thể thao, cũng không biết tổ chức các trò chơi có thưởng, nhưng nó hơn xa chiếc tivi ở khía cạnh trung thực: màu sắc trung thực, tâm hồn trung thực, lời ăn tiếng nói cũng trung thực, nhất là volume không bao giờ bị hỏng, hoặc nếu không thể không hỏng theo thời gian thì đó là bộ phận chỉ hỏng cuối cùng sau những bộ phận khác.
//         Ngay hồi tám tuổi, chỉ giả vờ chơi trò vợ chồng thôi, phẩm chất đó nơi con Tí sún đã sớm bộc lộ rồi.
//         Tiếc là tôi không để ý. Lúc đó tôi chỉ quan tâm đến những gì thuộc về vật chất tầm thường.
//         Mì gói đã hại tôi.
//         oOo
//         Tôi lại nói chuyện chú Nhiên và cô Linh.
//         Chú Nhiên không giải thích được tại sao chú yêu cô Linh và sắp sửa lấy cô Linh làm vợ. Nhưng điều đó không ngăn cản chú gửi tin nhắn cho cô Linh mỗi ngày.
//         Chú gửi tin nhắn bằng chiếc điện thoại di động be bé, và một trong những lý do khiến tôi ngày nào cũng mong chú đến chơi là để được nghịch chiếc điện thoại của chú.
//         Nói cho công bằng, không chỉ tôi mong gặp chú mà chú cũng mong gặp tôi. Chỉ vì tôi hay hỏi chú về cô Linh.
//         Tôi hỏi mười câu, chú chỉ trả lời suôn sẻ được năm câu. Năm câu còn lại, chú không trả lời được, chú chỉ cười khà khà. Nhưng trông chú có vẻ thích thú.
//         Một lần, tôi đọc thấy chú nhắn cho cô Linh:
//         “Chiều nay chúng ta đi dạo một chút chăng? Buồn ơi là sầu!”
//         Tôi thấy tin nhắn đó hay hay (tại sao hay hay thì tôi cũng không rõ), liền vội vàng chạy qua nhà con Tí sún:
//         – Mày có điện thoại di động không?
//         Con Tí sún bảo “không”. Tôi chạy qua nhà con Tủn:
//         – Mày có điện thoại di động không?
//         – Mình không có nhưng mẹ mình có.
//         Tôi mừng rơn:
//         – Lát nữa mày mượn mẹ mày chiếc điện thoại đi. Ăn trưa xong, tao sẽ nhắn tin cho mày.
//         Con Tủn khoái lắm. Xưa nay chưa có ai nhắn tin cho nó bao giờ.
//         Hôm đó, trước khi làm cái chuyện chán ngắt là ngủ trưa, tôi kịp mượn điện thoại của chú Nhiên gửi mẩu tin đó vào điện thoại của con Tủn (đúng ra là của mẹ con Tủn).
//         Chiều, tôi học bài qua quít rồi lén ba mẹ vù ra cổng, đứng ngó qua nhà nó.
//         Tôi đứng vẩn vơ một hồi, thấy con Tủn trong nhà đi ra. Nó cũng ngó qua nhà tôi.
//         Hì hì, sau đó không nói thì ai cũng biết là tôi và con Tủn đã hớn hở đi dạo một chút với nhau. Chẳng đi đâu xa. Chỉ là loanh quanh sau hè nhà hàng xóm rồi ra đứng cạnh ao rau muống bên hông nhà thằng Hải cò nhìn châu chấu nhảy tới nhảy lui, chốc chốc lại lấy tay vỗ vào đùi bem bép vì bị muỗi chích. Nhưng như vậy cũng đã thích thú lắm. Y như người lớn. Một chuyện hẹn hò.
//         Mấy hôm sau, tôi lại nhắn cho con Tủn một tin nhắn mới. Cũng cóp từ mẩu tin chú Nhiên gửi cô Linh:
//         “Chiều nay chúng ta lai rai một chút chăng? Buồn ơi là sầu!”
//         Và chiều đó hai đứa tôi đã lai rai một chút ở quán bà Hai Ðọt. Tôi ăn cắp tiền của mẹ tôi để đãi con Tủn ăn chè đậu đỏ bánh lọt. Tôi mất tiền vì con Tủn nhưng tôi không tiếc. Ðời thế mới vui.
//         Nhưng đời chỉ vui được có hai lần. Tới lần thứ ba thì tôi gặp nạn.
//         Mẩu tin mới nhất của chú Nhiên đã hại tôi. Tôi háo hức nhắn cho con Tủn:
//         “Chiều nay chúng ta lên giường một chút chăng? Buồn ơi là sầu!”
//         Dĩ nhiên một chú bé tám tuổi thì không thể hiểu nội dung thực sự của mẩu tin quái ác đó.
//         Chiều, tôi lại ra đứng trước cổng ngó mông qua nhà con Tủn thấp thỏm chờ đợi theo thói quen.
//         Một lát, trong nhà nó có người đi ra. Lần này không phải con Tủn, mà là mẹ nó. Bà đi xăm xăm sang nhà tôi.
//         Kết quả: chiều đó chỉ có mình tôi lên giường.
//         Tôi leo lên giường nằm sấp xuống cho ba tôi đét roi vào mông.
//         Chỉ vì cái tội mà thực ra tôi không hề mắc phải: Mới nứt mắt đã bày đặt lăng nhăng.
//         Buồn ơi là sầu!`,
//     },
//     {
//       id: 'fsdafsdâfsd',
//       chapterTitle: 'Khi người ta lớn',
//       chapterContent: `CHAPTER 5: Bạn đọc thân mến của tôi, khi các bạn đọc tới dòng chữ này thì thú thật tôi vẫn còn nuôi trong lòng một bí mật. Chắc các bạn cũng thấy cuốn sách mà tôi đang viết và các bạn đang đọc không hề giống bất cứ cuốn sách nào tôi đã từng viết và các bạn đã từng đọc trước đây.
//         Tôi đã định giữ kín bí mật này, kể cả khi cuốn sách đã kết thúc và nhà xuất bản đã in ra. Nhưng vì các bạn đã kiên nhẫn đọc tới đây, đã nộp cho cuốn sách một khoảng thời gian như người ta nộp tiền cho Cục thuế thì tôi thấy các bạn không có lý do gì không được hưởng quyền được thông tin về tác phẩm mà các bạn đã bỏ tiền ra mua và bỏ thì giờ ra đọc.
//         Sẵn đây, tôi tiết lộ luôn: thực ra cái tôi đang viết không phải là một cuốn tiểu thuyết.
//         Thực tế đây là một bản tham luận mà tôi định sẽ trình bày trong cuộc hội thảo Trẻ em như một thế giới do Ủy ban UNESCO tại Việt Nam phối hợp với Bộ giáo dục tổ chức, với sự góp mặt của các nhà nghiên cứu giáo dục, các chuyên gia tư vấn tâm lý, các nhà báo phụ trách mảng học đường và giáo dục gia đình, cuối cùng là các nhà văn viết cho trẻ em.
//         Tất nhiên đây là bản tham luận sẽ không bao giờ được đọc trên diễn đàn, thậm chí không được gửi tới cuộc hội thảo theo đúng kế hoạch trước đó. Lý do tại sao thì tôi sẽ nói sau.
//         Mà thôi, tôi nói ngay đây.
//         Có nhiều lý do.
//         Mỗi lý do mang một hình hài cụ thể.
//         Lý do đầu tiên mang hình hài của thằng Hải cò.
//         Gọi thằng Hải cò là gọi theo thói quen, gọi theo cách tôi vẫn gọi nó vào cái thời chúng tôi tám tuổi.
//         Bây giờ, đúng ra tôi phải gọi Hải cò là ông Hải cò. Như vậy cho nó lịch sự. Vì Hải cò bây giờ đã nhiều tuổi lắm rồi, đại khái bằng cái mức 8 tuổi nhân cho 6, tức là khoảng trên dưới 50, nếu chúng ta vẫn quyết tin theo bản cửu chương.
//         Hải cò đột ngột đến thăm tôi vào một chiều mưa gió, nhưng cuộc gặp gỡ không được lãng mạn như trong nhạc Tô Vũ.
//         Hải cò kéo ghế thả người rơi đánh phịch, hỏi độp ngay:
//         – Nghe nói cậu đang viết một bài gì đó về tụi mình hồi còn bé phải không?
//         – Ủa, sao cậu biết? – Tôi dựng mắt lên.
//         – Cậu không cần biết tại sao tôi biết. Cậu chỉ cần trả lời là có chuyện đó không.
//         Giọng Hải cò rất giống giọng của một quan tòa, mặc dù tôi biết nó đang là giám đốc một công ty không liên quan gì đến pháp luật.
//         – Ờ, ờ… có. – Tôi dè dặt đáp.
//         – Có thật à?
//         Hải cò chồm người tới trước và reo lên, cứ như thể nó vừa bắt quả tang tôi đang làm chuyện gì phạm pháp.
//         Tôi liếm môi:
//         – Ðó chỉ là một bản tham luận…
//         Hải cò cắt ngang:
//         – Nó là bản tham luận hay không phải bản tham luận, điều đó không quan trọng. Tôi chỉ quan tâm cậu viết cái quái gì trong đó…
//         Hải cò rặt một giọng gây hấn. Tôi nhìn chăm chăm vào mặt nó, cảm giác nó đã biết tôi viết những gì về nó.
//         – Thì những chuyện vụn vặt của tụi mình hồi nhỏ…
//         Tôi lấy giọng êm ái, cố nhấn mạnh từ “vụn vặt” để trấn an thằng bạn cũ.
//         Bằng ánh mắt cảnh giác, Hải cò nhìn tôi một lúc, rồi nó đột ngột chìa tay ra:
//         – Cậu đưa tôi xem thử nào.
//         Thoạt đầu tôi đã định từ chối nhưng rồi nhận thấy làm thế càng khiến Hải cò nghi ngờ và cuối cùng tôi cũng không thoát được nó, bèn rút ngăn kéo lấy xấp bản thảo thảy lên bàn:
//         – Cậu đọc đi! Chẳng có gì nghiêm trọng cả.
//         Tôi tặc lưỡi nói thêm, cố tình xoáy vào khía cạnh tình cảm:
//         – Chỉ là những kỷ niệm đẹp đẽ của tuổi thơ.
//         Hải cò không bị những mỹ từ của tôi đánh lừa. Nó thận trọng lật từng trang bản thảo và nhìn cái cách nó săm soi từng con chữ, tôi có cảm giác không phải nó đọc mà nó đang sục sạo dò tìm.
//         Thỉnh thoảng nó lại giật nảy trên chỗ ngồi:
//         – Chà chà, đánh lộn đánh lạo! Không ổn rồi!
//         – Úi chà! Không thể như thế được! Giám đốc một công ty lớn không thể dạy con theo kiểu bá láp như thế này được.
//         Tôi lo lắng:
//         – Kiểu gì?
//         Hải cò đập tay lên bàn đánh chát:
//         – “Mày giữ gìn tập vở sạch sẽ như thế này mày không sợ thầy cô bảo ba mẹ mày không biết dạy con hả thằng kia?”. Hừ, một giám đốc thì không đời nào quát con như thế! Ðây nữa! – Hải cò gí mạnh ngón tay vô trang giấy như đang cố đè bẹp một con ruồi – “Ðến giờ cơm là ngồi vô ăn, chỉ có kẻ không được giáo dục đến nơi đến chốn mới làm như vậy!”…
//         Nó giơ hai tay lên trời:
//         – Ối trời ơi! Cậu muốn giết tôi hả, Mùi?
//         Hải cò bỏ chữ “cu” trước tên tôi nhưng hắn vẫn quát tôi như quát một thằng cu.
//         – Ðây chỉ là chuyện hồi nhỏ. Hồi tụi mình mới tám tuổi. – Tôi phân trần bằng cả giọng nói lẫn vẻ mặt.
//         – Tám tuổi cũng thế. – Mặt Hải cò đỏ gay – Giám đốc một công ty lớn thì không thể ăn nói như thế hồi tám tuổi. Các đối tác sẽ nghĩ gì về tôi nếu biết hồi bé tôi là một đứa hư hỏng.
//         – Mình không nghĩ như vậy là hư hỏng.
//         – Ðó là ý nghĩ của cậu…
//         – Nhưng mình có bịa đâu. Mình ghi lại những gì cậu đã nói hồi tám tuổi. Hồi đó…
//         – Hồi đó là hồi đó. Bây giờ là bây giờ. Tám tuổi thì con người ta làm bao nhiêu là chuyện ngốc nghếch. Bây giờ cậu lôi ra bêu riếu để làm gì.
//         Tôi không thể nào tiêu hóa nổi lập luận của Hải cò. Nhưng tôi biết tôi không thuyết phục nó được. Thằng Hải cò hồn nhiên phóng khoáng bao nhiêu thì ông giám đốc Hải cò tính toán và cố chấp bấy nhiêu.
//         Thằng Hải cò sẵn sàng làm những gì nó muốn, trong khi ông Hải cò chỉ muốn làm những gì người khác muốn. Có lẽ đó lại là một điểm khác biệt nữa giữa trẻ con và người lớn. Ðiều đó cho thấy nếu cần tẻ nhạt thì đời sống người lớn còn tẻ nhạt gấp trăm lần so với trẻ con.
//         Cuối cùng, tôi thở dài:
//         – Thế cậu muốn sao?
//         – Cậu phải gạch bỏ hết những chi tiết dở hơi đó. – Hải cò đáp giọng dứt khoát.
//         – Không được! Thế thì còn gì bản tham luận của mình.
//         – Ðó là chuyện của cậu. – Hải cò lạnh lùng, có vẻ quyết dồn tôi vào chân tường.
//         Tôi uống một hớp nước để dằn cơn giận.
//         – Thế này vậy. – Tôi đặt vội chiếc ly xuống bàn để không phải xáng nó vào tường – Mình sẽ không gạch bỏ hay tẩy xóa gì hết. Nhưng mình sẽ đổi tên nhân vật.
//         oOo
//         Con Tủn đến, ngồi đúng vào chiếc ghế Hải cò ngồi hôm qua.
//         Tôi khỏi cần giải thích, các bạn cũng đã biết lý do thứ hai mang hình hài con Tủn.
//         Con Tủn ngồi đúng vào chiếc ghế Hải cò đã ngồi và hỏi đúng cái câu Hải cò đã hỏi:
//         – Nghe nói anh đang viết một bài gì đó về tụi mình hồi còn bé phải không?
//         Chỉ có phản ứng của tôi là khác. Tôi gật đầu như máy:
//         – Ðúng vậy. Và anh biết là không nên lôi chuyện ngốc nghếch hồi bé ra bêu riếu. Hiệu trưởng một ngôi trường lớn như em không thể nhận một tin nhắn kiểu như “Chiều nay chúng ta lên giường một chút chăng?” hồi tám tuổi. Học sinh và phụ huynh học sinh sẽ nghĩ sao về em, đúng không?
//         Con Tủn cũng gật đầu như máy, giống hệt tôi:
//         – Ðúng, đúng!
//         Tôi tiếp tục phục thiện:
//         – Vì vậy mà anh quyết định sẽ đổi tên nhân vật. Cái cô bé nhận mẩu tin quá sức hư hỏng đó không phải là cô Tủn mà sẽ là cô Hồng Hạnh hay cô Anh Ðào nào đó.
//         Cuộc gặp gỡ giữa tôi và con Tủn hôm đó ngọt ngào như ướp đường.
//         Nó không đòi đọc bản thảo. Cũng không giở giọng quan tòa. Mà có là quan tòa thật thì chắc nó cũng hết sức dịu dàng hoan hỉ khi chưa hỏi câu nào bị cáo đã khai nhận tuốt tuồn tuột và thành khẩn hứa hẹn sẽ sửa chữa mọi lỗi lầm.`,
//     },
//     {
//       id: 'fsdafsdâfsd8áda',
//       chapterTitle: 'Tôi là thằng cu Mùi',
//       chapterContent: `CHAPTER6: Con Tủn hồi bé khác xa con Tủn bây giờ. Nghĩa là đáng yêu hơn nhiều, cho dù nó không hề yêu tôi.
//         Sau vụ tin nhắn, tôi ngoắt nó ra ngoài hè, chửi té tát:
//         – Mày đưa cho mẹ mày đọc mẩu tin đó chi vậy?
//         – Tại mình không hiểu bạn muốn rủ mình làm gì.
//         – Bây giờ mày hiểu chưa?
//         – Chưa hiểu.
//         – Chưa hiểu thì đừng bao giờ hiểu.
//         Tôi nói vậy vì tôi đã hiểu rồi. Chính chú Nhiên đã giải thích cho tôi. Chú vừa giải thích vừa cười khà khà trong khi mặt tôi méo đi từng phút một.
//         Kể từ hôm tôi lỡ lầm một chút đó, đời tôi mất đi bao nhiêu thứ một chút khác. Ba tôi cấm tôi không được nghịch chiếc điện thoại của chú Nhiên nữa.
//         Không được gửi tin nhắn rủ con Tủn đi dạo một chút, lai rai một chút, đời tôi trở nên buồn quá nhiều chút.
//         Ngày tháng trở lại là những ngày tháng cũ. Lẽo đẽo trong hành lang hiu quạnh của cuộc sống, tôi lại đi từ trường về nhà, từ phòng ngủ đến phòng tắm, từ bàn ăn đến bàn học với một nhịp điệu không đổi, y như trái đất vẫn buồn tẻ quay quanh mặt trời.
//         Nếu tôi là trái đất, đôi khi tôi lẩn thẩn nghĩ, tôi sẽ không cam chịu sống một cuộc sống máy móc và đơn điệu như thế. Tôi sẽ không thèm quay nữa, hoặc là tôi sẽ tìm cách quay theo hướng khác. Mặc cho mọi thứ ra sao thì ra.
//         Nhưng tôi không phải là trái đất. Tôi là thằng cu Mùi.
//         Nếu có thời gian tìm hiểu hẳn tôi sẽ tìm thấy những chú bé thích rót nước vô chai và xới cơm vô thau. Chắc chắn thế.
//         Thật là sáng tạo, những đứa trẻ đó. Chúng làm vậy chẳng qua chỉ để cho đời bớt nhạt. Lý do mới lành mạnh làm sao!
//         Nhưng người lớn lại coi là ngổ ngáo, ngược đời và không giống ai những điều mà bọn trẻ chỉ đơn giản coi là thú vị.
//         Người lớn sẽ nói, hết sức nghiêm khắc:
//         – Này con, khi nào phải rượt đuổi ai hoặc bị ai rượt đuổi, con người mới phải chạy, khi nào cần vượt qua một chướng ngại vật như vũng nước hay mô đất, con người mới phải nhảy. Còn lúc khác, những người đứng đắn đều đi đứng khoan thai. Chẳng đứa trẻ ngoan nào lại nhảy như cóc hoặc đi trên gờ tường như khỉ thế kia!
//         Người lớn tiếp tục bảo ban:
//         – Người ta tạo ra cái lưỡi trai là để che nắng cho gương mặt, chỉ có những kẻ ngốc nghếch mới quay ngược cái nón lại như thế!
//         Tới lần thứ ba thì người lớn răn đe:
//         – Tao sắm tập bút cho mày đánh nhau và xé làm đồ chơi hả thằng kia?
//         Tất cả những gì người lớn dạy dỗ đều đúng về mặt lý thuyết, bọn trẻ đều thấy vậy. Nhưng bọn chúng vẫn có một sự thôi thúc vô hình làm cho khác đi trong thực tế.
//         Chẳng qua so với người lớn, trẻ con sống trong một bầu khí quyển khác và dưới một thứ ánh sáng khác. Ở đó, bọn trẻ tiếp cận thế giới theo cách của chúng, nghĩa là chúng không nhìn mọi thứ chung quanh dưới khía cạnh sử dụng. Ðó là điểm khác biệt căn bản giữa trẻ con và người lớn.
//         Với người lớn, ý nghĩa và giá trị của mọi thứ trên đời đều thu gọn vào hai chữ chức năng. Bạn lật bất cứ một cuốn từ điển nào của người lớn mà coi. Người ta định nghĩa thế giới này bằng chức năng, và chỉ bằng chức năng. Áo để mặc, ghế để ngồi, răng để nhai và lưỡi để nếm.
//         Cho nên không thể trách được nếu ba tôi quả quyết ly mới là thứ dùng để uống nước, còn chai chỉ dùng để đựng nước, nếu mọi ông bố bà mẹ khác đều nhanh chóng đồng ý với nhau rằng nón lưỡi trai dùng để che nắng, bút để viết và tập vở tất nhiên dùng để ghi chép.
//         Trẻ con không quan tâm đến chức năng. Ðơn giản vì trẻ con có kho báu vô giá: óc tưởng tượng.
//         Chiếc gối với người lớn là thứ để gối đầu nhưng với con Tí sún nghèo rớt mùng tơi thì đó là con búp bê hay khóc nhè mà nó phải ru mỗi ngày.
//         Với tôi và Hải cò, áo không chỉ dùng để mặc mà còn là thứ để nắm lấy khi tụi tôi cần trì níu để vật nhau xuống đất. Nếu áo mà chỉ dùng để mặc thì chán chết. Mà thực ra nếu trời không quá lạnh thì trẻ con cũng chẳng cần mặc áo.
//         Với mẹ thằng Hải cò, hiển nhiên cây chổi dùng để quét nhà. Nhưng nếu thấy Hải cò đứng tần ngần trước cây chổi, tôi đoán là nó đang nghĩ xem nên làm gì với cây chổi, nên ném vào cửa kiếng nhà hàng xóm để xem điều gì sẽ xảy ra sau đó hay nên cưỡi lên cây chổi rồi đọc thần chú để biết mình có bay được như các phù thủy trong truyện hay không. (Chuyện thần tiên là do người lớn viết ra, nhưng thường thì họ quên khuấy đi rằng họ viết ra chuyện thần tiên để trẻ con sống trong thế giới đó cho đến chừng nào trẻ con cũng trở thành người lớn như họ).
//         Những ngày ngồi cặm cụi gõ những con chữ này tôi còn nghiệm ra rằng những đứa trẻ thích trở chứng là những đứa trẻ muốn thể hiện cái tôi, tất nhiên thể hiện theo kiểu trẻ con. Quay ngược cái nón lưỡi trai ra phía sau, đứa trẻ muốn khẳng định rằng ta khác với phần còn lại của thế giới, thực ra cũng khó mà khác được vì trên thế giới bao la này có rất nhiều đứa trẻ đội nón kiểu oái oăm như vậy, nhưng ít ra cũng khác với thằng bạn đi bên cạnh.
//         Tất nhiên không phải đứa trẻ nào cũng thế. Cũng có những đứa trẻ thích giống nhau, bên cạnh những đứa trẻ thích khác nhau.
//         Người lớn dĩ nhiên vỗ tay hoan nghênh đám trẻ thứ nhất. Vì giống lẫn nhau, đó là thứ nguyên tắc mà người lớn sùng bái. Giống nhau tức là không cá biệt, không phá phách, không nổi loạn. Là nề nếp, quan trọng hơn nữa là an toàn. Nếu thật giống đám đông, giống đến mức lẫn lộn giữa người này với người khác, thậm chí tư tưởng ai nấy đều trùng khít với nhau thì càng tuyệt đối an toàn.
//         Nghĩ khác, nói khác và làm khác đám đông, dù là nghĩ đúng, nói đúng và làm đúng vẫn là sự lựa chọn tiềm ẩn nhiều nguy cơ, trong nhiều trường hợp đó là con đường dẫn đến giàn thiêu mà Bruno là một ví dụ bi thương trong lịch sử nhân loại. (Khi mọi người đều tin rằng mặt trời quay quanh trái đất thì kẻ khăng khăng cho rằng trái đất quay quanh mặt trời chỉ có cách duy nhất là dùng cái chết để bảo vệ cho chân lý – điều đó là không thể khác).
//         Rất may là chúng tôi – tôi, Hải cò, con Tủn và con Tí sún – không ai trở thành Bruno vào năm tám tuổi. Chúng tôi chỉ làm ba mẹ phiền lòng chứ không đụng chạm đến những trật tự và những quyền lực bất khả xâm phạm.
//         Tôi và Hải cò không lên giàn thiêu.
//         Nhưng hai đứa tôi buộc phải thừa nhận rằng cái ly và cái chai (cũng như cái chén và cái thau) hoàn toàn khác nhau về công dụng và để bảo đảm cuộc sống vẫn diễn ra đúng theo khuôn phép và nhất là đúng ý ba mẹ, chúng tôi đành phải đồng ý rằng chức năng của những đứa trẻ ngoan là phải sử dụng đồ vật theo đúng chức năng mà người lớn đã quy định.
//         Sầu ơi là buồn!`,
//     },
//     {
//       id: 'fsdafsdâfrs3dáda',
//       chapterTitle: 'Tôi ngoan trong bao lâu',
//       chapterContent: `CHAPTER 7: Tôi tự hỏi, sau những thất bại nặng nề trong nỗ lực chinh phục những đổi thay. Tôi nghĩ, để làm hài lòng người lớn đâu có gì khó. Ðiều quan trọng là tôi có muốn làm hay không.
//         Ba mẹ tôi muốn ngày nào tôi cũng thuộc bài trước tám giờ tối ư?
//         Ngay trưa hôm đó, tôi thức dậy lúc ba tôi còn đang ngáy khò khò và lập tức ngồi vào bàn học, không cần ba mẹ tôi thúc giục hay nhắc nhở như mọi lần.
//         “Ở làng quê, người dân thường sống bằng nghề trồng trọt, chăn nuôi, chài lưới và các nghề thủ công, xung quanh nhà thường có vườn cây, chuồng trại, đường làng nhỏ, ít có người qua lại. Ở đô thị, người dân thường đi làm trong các công sở, cửa hàng, nhà máy, nhà ở tập trung san sát, đường phố có nhiều người và xe cộ đi lại.
//         Những đoạn văn như thế, thực ra không có gì đặc biệt, thậm chí chỉ là lặp lại những điều tôi mắt thấy tai nghe.
//         Nhưng ngay cả những đoạn văn đơn giản nhất nếu vào tai này lại ra tai kia nhanh như chớp thì nó vẫn không đọng lại trong đầu bạn được.
//         Tôi vốn dĩ là một thằng bé không giỏi tập trung. Bao giờ ngồi học, tâm trí tôi cũng bị lãng đi bởi một chuyện gì đó, bất cứ là chuyện gì.
//         Tôi nhớ lúc tôi học bảng chữ cái. Thật là khốn khổ khốn nạn!
//         Cô giáo dạy tôi:
//         – O tròn như quả trứng gà
//         Ô thì đội mũ, ở thì thêm râu.
//         Lúc nghe những câu vần vèo đó, tôi không tìm cách phân biệt các mẫu tự mà cứ liên tưởng đến cái mũ của chú Nhiên, một cái mũ nhọn màu xanh sẫm bằng vải nỉ dày, có chóp nhọn. Loại mũ đó bây giờ không còn ai đội, cũng chẳng ai buồn sản xuất nữa nhưng hồi đó nó là một kì quan đối với bọn nhóc mũi thò lò như tôi.
//         Tôi rất thèm được đội lên đầu chiếc mũ của chú Nhiên, đội một tẹo thôi rồi trả lại cũng đã vô cùng sung sướng. Tất nhiên chú Nhiên thấy chuyện đó chẳng có gì nghiêm trọng: tôi đội chiếc nón bảo bối đó trước tia nhìn chằm chằm của chú, nếu muốn nghịch phá tôi cũng chẳng có cơ hội.
//         Rồi tôi nghĩ đến ông ngoại con Tí sún. Tôi nghĩ đến chòm râu của ông. Chòm râu của ông chẳng có chút gì giống dấu ơ. Nó dài và thẳng, rậm rạp, mỗi khi ăn phở ông phải dành riêng một tay để vén râu cho khỏi ướt.
//         Tôi nghĩ ngợi lung tung, liên tưởng đủ thứ và khi cô giáo chỉ tay vào chữ ơ hỏi tôi đây là chữ gì thì tôi cà lăm:
//         – Thưa cô đây là chữ… chữ…
//         Tôi biết cái chữ cô giáo hỏi là chữ ô hoặc chữ ơ, nhưng nó đích thực là ô hay ơ thì tôi không quả quyết được. Trong đầu tôi lởn vởn hình ảnh chú Nhiên và ông ngoại con Tí sún nhưng người nào là ô, người nào là ơ thì tôi lại quên béng!
//         Thấy tôi lúng búng hàng buổi, cô giáo thương tình:
//         – O tròn như quả trứng gà
//         Ô thì đội mũ, còn chữ gì là có râu?
//         Tôi mừng quýnh:
//         – Thưa cô là chữ ơ ạ!
//         Một nhà thông thái nào đó đã dùng chữ “mặt” để chỉu con chữ. Mặt chữ – một cách nói tuyệt vời!
//         Chuyện đầu tiên của học trò vỡ lòng là làm quen với mặt chữ, sau đó phải nhớ mặt chữ. Giống như làm quen với người nào đó và phải nhớ mặt họ.
//         Hai mươi bốn chữ cái là hai mươi bốn gương mặt mà bất cứ đứa trẻ nào cũng buộc phải làm quen trước khi ý thức rằng đây là những gương mặt sẽ đi theo mình suốt đời.
//         Ðó không phải là một đòi hỏi phức tạp nhưng với đầu óc vẩn vơ như tôi thì làm thế nào để phân biệt được và gọi đúng tên từng người trong hai mươi bốn mặt người mới quen đó lại là một điều quá sức.
//         Bao giờ cũng vậy, tôi nhìn các con chữ một hồi thì hay các con chữ không còn là con chữ mà thay vào đó vô số hình ảnh không biết từ đâu hiện ra lấp đầy tâm trí tôi.
//         Nhiều năm về sau, tôi tình cờ đọc được bài thơ “Những nguyên âm” của Rimbaud mới biết ông cũng từng bị óc tưởng tượng của mình cầm tù:
//         – A đen, E trắng, O xanh – Những nguyên âm.
//         …
//         Rimbaud không chỉ nhìn ra màu sắc của các nguyên âm. Ông còn nhìn thấy ở chữ A chiếc yếm đen của bầy ruồi, chữ E là những đỉnh núi nhọn phủ đầy tuyết, và những cánh đồng cỏ rải rác gia súc đứng gặm cỏ bình yên trong chữ U.
//         Nhưng tuyệt nhất là ông còn nghe được âm thanh của các con chữ: tiếng kèn đồng với những nốt cao vút trong chữ O hay tiếng cười bật ra từ cơn phẫn nộ hay cơn say nơi trong chữ I…
//         Ngay lúc tôi chưa đọc nhiều Rimbaud, chỉ làm quen với mỗi bài thơ “Những nguyên âm” của ông thôi, ông lập tức đã là thi sĩ lớn nhất, và gần gũi nhất trong mắt tôi.
//         Tôi tin rằng khi viết bài thơ này, tâm tính ông chắc vẫn còn bồng bột trẻ con, hay nghĩ ngợi lung tung và vì cái tật này tôi đoán hồi bé ông cũng nghịch phá và hay bị nhiều điểm kém trong tập không thua gì tôi.
//         Ôi, tôi lại lạc đề mất rồi.
//         Thực ra tất cả những lời con cà con kê nãy giờ chỉ đơn giản là muốn nói rằng hồi tám tuổi tôi đã là một đứa bé đầu óc luộm thuộm, luôn mất tập trung.
//         Và tôi đang muốn nói tiếp rằng đến một ngày, tôi quyết bắt cái đầu óc mất tập trung đó tập trung cao độ, chỉ để tự chứng minh một điều: muốn làm ba mẹ hài lòng là điều vô cùng đơn giản mà bất cứ đứa trẻ nào nếu muốn cũng đều làm được.
//         Tôi đã học bài như điên, tôi vùi đầu vào tập không cả ăn chơi, mặc kệ tiếng réo gọi tuyệt vọng của thằng Hải cò, con Tủn và con Tí sún không ngừng đập vào cửa sổ.
//         Tôi học như thể ngày mai tôi sẽ chết.
//         Tôi ngốn ngấu những con chữ như ngốn mì gói
//         Tôi tụng bài đến rã họng và thuộc nhoay nhoáy.
//         Trước giờ cơm chiều, tôi không còn gì để học nữa. Hầu như tôi đã nuốt cả đống sách vở vào bụng.
//         Nghe tôi trả bài vanh vách, ba tôi dụi mắt năm sáu cái liền, nức nở khen, nếu không giỏi kiềm chế có lẽ ông đã ôm chầm và nhấc bổng tôi lên:
//         – Thật không thể tưởng tượng được!
//         Ông nói giọng sụt sịt và hình như ông rơm rớm nước mắt.
//         Mẹ tôi sợ quá:
//         – Con có sao không hả con?
//         Bà sờ tay lên trán tôi, lo lắng:
//         – Chắc con phải đi bác sĩ thôi!
//         o0o
//         Trong những ngày đó, tôi đã làm cho ba tôi sung sướng ứa lệ đến suốt một tuần lễ liền, đến mức đến ngày thứ tư tôi đã thấy ông thường xuyên nhét một chiếc khăn tay trong túi áo.
//         Mẹ tôi cũng bình tĩnh dần. Bà đã biết tôi không bệnh tật gì, mặc dù bà vẫn tiếp tục sờ tay lên trán tôi mười hai lần mỗi ngày.
//         Ở lớp, tới lượt cô giáo bắt đầu xoa nắn vỏ não tôi. ( Sao phụ nữ giống nhau đến thế!)
//         Cô lặng lẽ rờ rẫm xương sọ tôi ( lúc đó tôi thấy cô giống thầy thuốc hơn là giống cô giáo) cau mày nói:
//         – Thời gian gần đây em có bị té ngã gì khổng
//         – Dạ có. – Tôi thật thà đáp, nhớ đến cuộc vật nhau với Hải cò cách đây mấy ngày.
//         – Có à. – Cô giáo giật nảy – Thế em có bị đập đầu xuống đất không?
//         – Dạ có.
//         Tôi lại đáp, thầm nhủ nếu không đạp đầu xuống đất thì còn lâu mới đáng gọi là té.
//         Sắc mặt cô cô giáo chuyển sang màu nõn chuối, cô ấn những ngón tay mạnh hơn như muốn đục vài cái lỗ trên đầu tôi theo kiểu người ta khoan thềm lục địa để thăm dò dầu khí.
//         – Chà thế thì đúng rồi.
//         – Ðúng gì hả cô?
//         – Nếu đập mạnh đầu xuống đất thế nào các dây thần kinh của em cũng bị va chạm.
//         – Cô dùng ánh mắt mân mê khắp đầu cổ tôi.
//         – Thế em đập phía trước hay phía sau?
//         – Là sao hả cô?
//         – Ý cô là cô muốn hỏi em đập mặt xuống đất hay đập ót xuống đất?
//         Trông cô rất hồi hộp, và căn cứ cái cách cô nhìn chăm chú đôi môi tôi như thể đang rình một con gì đó sắp nhảy ra, tôi đoán đây là câu hỏi quyết định.
//         Tôi cố nhớ lại và ngần ngừ đáp:
//         – Hình như là em té sấp xuống đất ạ.
//         Tôi nói đại thế thôi, chứ thực ra mỗi khi vật nhau với Hải cò, tôi té ngã cả chục lần: ba lần đập mặt, ba lần đập ót và những lần còn lại thì đập lung tung vào bất cứ chỗ nào có thể đập được.
//         Câu đáp bừa của tôi khiến mặt cô giáo dãn ra. Cô thở phào và rụt tay lại:
//         – May quá! Thế thì không sao. Trung khu thần kinh con người ta nằm phía sau ót.
//         Không chỉ cô giáo, tụi bạn trong lớp cũng nhìn tôi bằng ánh mắt như thể nếu tôi không có tám cái tai thì ít nhất cũng có hai cái mũi.
//         Tôi chí thú sưu tập hết điểm 10 này đến điểm 10 khác và ngày ngày sung sướng bởi trong những tiếng trầm trồ của tụi bạn. Lần đầu tiên trong đời tôi cảm thấy học giỏi không phải là chuyện gì đáng chán, nhất là trong thời gian đó tôi luôn khoan khoái bắt gặp tiếng cười của con Dung điệu xen lẫn trong những tiếng xuýt xoa của tụi bạn.
//         Con Dung điệu thật ra chẳng xinh đẹp gì, chỉ được mỗi cái làm điệu, nhưng tiếng cười của nó luôn khiến tôi tò mò. Tiếng cười của nó nghe như tiếng nhạc, hễ nó cất tiếng lên là tôi nhận ra ngay. Tôi thích tiếng cười đó từ lâu và lần nào cũng vậy hễ con Dung điệu cất tiếng cười là tôi không kềm được một cú liếc xéo về phía nó.
//         Thực lòng mà nói, tôi thích con Tủn hơn con Dung điệu. Giọng cười con Tủn không hay bằng Dung điệu nhưng nó hơn con Dung điệu ở chỗ nó có lúm đồng tiền. Con gái mà có lúm đồng tiền trông duyên tệ.
//         Con Tủn chỉ có mỗi cái tật xấu là khoái chơi với thằng Hải cò. Gần đây, nhờ chiếc điện thoại di động của chú Nhiên, tôi rủ con Tủn đi chơi được hai lần. Nhưng từ ngày ba tôi cấm tôi nghịch điện thoại thì con Tủn lại tiếp tục cặp kè với Hải cò như trái đất tiếp tục quay quanh mặt trời khiến tôi chán đời khủng khiếp.
//         Tôi quyết định không thèm quan tâm con Tủn nữa. Tôi sẽ rủ con Dung điệu đi dạo một chút, lai rai một chút và cố nghĩ cách làm sao cho chuyện hẹn hò đó diễn ra trước mặt con Tủn.
//         Khi nổi sùng lên thì tôi nghĩ vậy, nhưng khi gặp mặt con Dung điệu thì tôi không còn thấy háo hức với ý định đó nữa. Tôi vẫn chờ đợi để nghe tiếng cười của nó reo lên giòn giã bên tai, nhưng lại chẳng muốn rủ nó đi chơi, chả hiểu tại sao.
//         Tất nhiên, bây giờ thì tôi hiểu. Bây giờ, sau nhiều lần yêu, tôi nhận ra rằng không phải một cô Dung nào đó thay thế một cô Tủn nào đó trong trái tim một chàng cu Mùi nào đó sẽ làm hỏng định nghĩa về tình yêu mà vấn đề là khi cuộc tình vừa đổ vỡ thì ngay sau đó người ta không thể nào hào hứng bắt đầu một cuộc tình mới nếu vết thương lòng chưa kịp lành miệng. Cũng như người ta không thể tiến hành tốt một cuộc chiến tranh trên đống đổ nát của cuộc chiến tranh trước đó nếu không có thời gian để hồi phục. Hồi tám tuổi, tình yêu là một cái gì xa lạ với tôi. Nhưng dù không hẳn là yêu thì sự quyến luyến tự nhiện giữa một đứa con trai và một đứa con gái cũng tuân thủ theo những quy luật tình cảm y như quy luật mà đứa con trai đó và đứa con gái đó phải tuân thủ khi chúng lớn lên.
//         o0o
//         Chỉ vậy thôi mà tôi đâm chán.
//         Tôi không còn động lực.
//         Tôi tưởng sau khi gặt hái những tiếng cười của con Dung điệu, tôi sẽ sốt sắng rủ nó đi chơi để chọc tức con Tủn.
//         Nhưng trái tim tôi đã chống lại tôi.
//         Hơn nữa, những điểm 10 lúc bấy giờ đã không còn là một đỉnh cao để tôi chinh phục nữa.
//         Tôi đã không còn thử thách.
//         Tôi chán học giỏi.
//         Tôi chán thuộc bài.
//         Nếu ngày nào tôi cũng thuộc bài vanh vách, cũng kiếm những điểm 10 một cách dễ dàng thì cuộc đời tôi lại rơi vào một sự đơn điệu mới, cũng tẻ nhạt hệt như những ngày tôi tích cực sưu tầm những diểm 4, điểm 5.
//         Tôi bắt đầu lơ là bài vở một lần nữa lại làm ba tôi ứa lệ, lần này là vì thất vọng.
//         Mẹ tôi lại có dịp lo lắng:
//         – COn có bị sao không hả con?
//         Còn cô giáo thì xoay đầu tôi một cách điên cuồng theo mọi hướng, giọng nghi hoặc:
//         – Chẳng lẽ trung khu thần kinh của em lại nằm ở phía trước?
//         Chỉ có thằng Hải cò, con Tí sún và con Tủn là vui mừng với sự tuột dốc của tôi. Trong mắt tụi nó, cái cảnh tôi quyết rời bỏ đỉnh cao vinh quang để quay về với những ngày tăm tối chắc cũng khí khái không kém gì một bậc đại thần treo ấn từ quan, gạt bỏ vinh hoa phú quý để trở về với cuộc đời dân dã bụi bặm.
//         Trong trường hợp này, khái niệm người hùng của trẻ con không phải bao giời cũng ăn khớp với cách nghĩ của người lớn. Thế đấy!`,
//     },
//     {
//       id: 'fsdafsdâfrsdáda',
//       chapterTitle: 'Chúng tôi trở thành lũ giết người như thế nào?',
//       chapterContent: `Như tôi đã nói, bản tham luận mà các bạn đang đọc sẽ không bao giờ được trình bày trên diễn đàn, thậm chí không được gửi tới cuộc hội thảo theo đúng kế hoạch.
//         Lý do thứ nhất có tên Hải cò.
//         Lý do thứ hai có tên Tủn.
//         Lý do thứ ba hiển nhiên có tên là Tý sún.
//         Lý do thứ ba ghé thăm tôi vào một sáng chủ nhật đẹp trời. Ðây mới là lý do quan trọng khiến bản tham luận đáng lẽ đến nơi lý ra nó phải đến là cuộc hội thảo do UNESCO tổ chức thì cuối cùng nó lại rẽ ngoặt đến nhà xuất bản.
//         Con Tí sún, lạ lùng thay, đã bao nhiêu nước chảy dưới chân cầu, đã là mẹ của năm đứa con rồi mà khi gặp lại tôi, nó vẫn sún.
//         – Này em, sao không chịu đi trồng răng đi?
//         – Em thích thế.
//         – Anh nghĩ chồng em thích thế thì đúng hơn.
//         – Ðúng rồi. Em thích thế là vì chồng em thích thế.
//         Con Tí sún hồi tám tuổi là đứa hiền lành, chậm chạp, không giỏi khoa ăn nói. Bây giờ, nghe cách đối đáp thông minh và thật thà của nó, tôi nghĩ nếu đi làm MC, chắc chắn nó sẽ là MC số một.
//         Ở đời, lắm kẻ thông minh cũng lắm người thật thà. Và người nhiều thật thà lại ít thông minh. Thông minh bao giờ cũng khéo ăn khéo nói khéo ứng xử, mà điều gì khéo quá thì thường kém chân thật, khổ thế!
//         Con Tí sún là trường hợp đặc biệt. Nó vừa thông minh vừa thật thà.
//         Nói cách khác, nó thông minh một cách thật thà.
//         Nói cách khác nữa, nó thật thà một cách thông minh.
//         2 lần 2 là 4 là một kết luận quá sức thật thà. Nhưng khi sự thật thà tiếp cận chân lý thì nó đồng thời cũng là sự thông minh.
//         Con Tí sún nói thật lòng mình, không xấu hổ cũng không uốn éo: “Em thích thế vì chồng em thích thế.”. Vì vậy đó là một câu nói thông minh: nó chạm đúng vào bản chất tình cảm của con người.
//         Có vẻ như tôi khen con Tí sún hơi nhiều.
//         Chắc vì nó vẫn còn sún răng. Tức là trông nó không khác mấy với con Tí sún tôi nhắc tới trong bản tham luận.
//         Nhưng hơn cả chuyện răng cỏ, tính tình con Tí sún sau bao nhiêu năm gặp lại dường như vẫn không thay đổi.
//         Tôi hỏi nó:
//         – Có phải em đến đây vì bài viết của anh …
//         – Ðúng rồi.
//         – Vậy chắc là em đã biết anh từ bỏ ý định lôi chuyện ngốc nghếch hồi bé ra bêu riếu. – Tôi nói như hôm trước nói với con Tủn, lưu loát và cay đắng. – Anh đã quyết định thay đổi tên nhân vật…
//         – Chính vì vậy mà em đến đây. – Con Tí sún cắt ngang lời tôi.
//         Tôi khoát tay:
//         – Em yên tâm đi, không có con Tí sún nào trong bài viết của anh hết.
//         – Ý em không phải thế!
//         – Chứ ý em là thế nào? – Tôi mếu xệch miệng – Chẳng lẽ em muốn anh xé luôn bài viết này?
//         – À không! – Con Tí sún kêu lên bằng giọng của một con mèo bị khép tội oan (vì thực tế tụi vừa chén sạch đĩa cá chiên của tôi là hai con mèo khác có tên là H và T. – Chú thích H và T tức là Hải cò và Tủn).
//         Tôi để mặc cho cơn phẫn nộ dẫn dắt:
//         – Tức là xé vẫn không chắc ăn. Vẫn còn dấu tích. Em muốn anh đốt bản thảo này?
//         – Anh ơi! – Con Tí sún bắt đầu rơm rớm nước mắt – Hổng lẽ anh nghĩ em tệ đến thế sao? Em đến đây để khuyên anh không sửa không xé không đốt gì hết. Anh đừng có nghe lời hai người kia. Chuyện tụi mình hồi bé thế nào anh cứ viết như vậy.
//         Tôi nhìn sững con Tí sún, sực nhớ ra cách đây bốn mươi năm nó từng là vợ tôi, một cô vợ hiền lành, ngoan ngoãn. Chẳng lẽ vì những đứa con bây giờ của nó không phải là con tôi mà tôi nghĩ xấu về nó?
//         Nếu như còn tám tuổi, tôi đã đưa tay lên cốc đầu mình mấy cái rồi.
//         – Anh xin lỗi…
//         Tôi nói, sau một hồi, và nhận ra mình không thể tìm thấy câu nói nào vô duyên hơn. Con Tí sún quẹt nước mắt.
//         – Cách xin lỗi hay nhất là anh nghe lời em.
//         Ðôi mắt đẫm lệ bao giờ cũng là đôi mắt đẹp, dù nó có xấu xí đến cỡ nào.
//         Những giọt nước mắt của con Tí sún rơi xuống trái tim tôi.
//         Tôi xụi lơ như người chết rồi:
//         – Anh sẽ nghe lời em.
//         – Anh sẽ không đốt bản thảo?
//         – Anh sẽ không đốt.
//         – Anh sẽ không xé nó?
//         – Anh sẽ không xé.
//         – Anh vẫn giữ nguyên tên nhân vật.
//         – Anh vẫn giữ nguyên.
//         Tôi đáp và ngạc nhiên quá thể về cái sự dễ dãi của mình.
//         o0o
//         Hồi xưa đâu có vậy. Cách đây bốn mươi năm, con Tí sún có lẽ từng nuôi hy vọng tôi sẽ nghe lời nó, dù chỉ một lần. Nhưng hy vọng nhỏ nhoi đó, nó không bao giờ nuôi nổi.
//         Hy vọng trong lòng nó vừa lóe lên, đã bị tiếng quát của tôi làm cho tắt ngóm.
//         Ngày nào tôi cũng quát nó để sung sướng nhìn thấy nó rụt rè giương mắt ngó tôi và sau đó tuân lệnh tôi răm rắp.
//         Ðể cho đời bớt nhạt, một hôm tôi bảo nó:
//         – Tụi mình sẽ đi tìm kho báu.
//         – Kho báu ở đâu mà tìm?
//         – Tụi mình sẽ vượt biển khơi. Kho báu thường được chôn ngoài đảo hoang.
//         – Eo ôi, còn bé như tụi mình làm sao vượt biển khơi được?
//         – Mày nhát gan quá! – Tôi nheo mắt nhìn con Tí sún – Tao xem phim, thấy cả khối người đóng bè vượt biển.
//         – Nhưng họ là người lớn.
//         Tôi nhún vai:
//         – Người lớn hay con nít gì cũng thế thôi! Quan trọng là có gan hay không!
//         – Nhưng người lớn thì không cần xin phép ba mẹ.
//         Con Tí sún làm tôi chưng hửng. Lý lẽ của nó hết sức đơn giản nhưng hết sức quan trọng. Quan trọng hơn cả chuyện có gan hay không. (Chà, cái phẩm chất thật thà một cách thông minh, nó đã bộc lộ từ bé!)
//         – Ờ há. – Tôi hạ giọng. – Thế tụi mình sẽ không vượt biển nữa. Nhưng tụi mình có thể vào rừng sâu hay lên núi cao.
//         – Rừng sâu hay núi cao thì cũng thế. – Con Tí sún lại nói, tự nguyện tròng vào mặt vẻ biết lỗi vì lại tiếp tục ngăn cản tôi – Chắc chắn ba mẹ sẽ không cho tụi mình ra khỏi nhà lâu như vậy.
//         – Ờ. – Tôi thở dài, hờn dỗi – Ba mẹ không bao giờ tin tụi mình. Ba mẹ lúc nào cũng sợ tụi mình đi lạc.
//         Tôi tiếp tục ấm ức:
//         – Nếu sợ tụi mình không đi lạc thì ba mẹ lại sợ mình bị rắn rết hùm beo tha đi mất.
//         Thấy tôi buồn, con Tí sún buồn theo. Nó lắc lắc cánh tay tôi, nói như an ủi:
//         – Ðợi lớn lên đi anh. Khi trở thành người lớn, tụi mình có thể đi bất cứ nơi đâu mà không sợ bị cấm cản.
//         Nó lim dim mắt, xuýt xoa:
//         – Ôi chỉ nghĩ tới thôi đã thấy thú vị rồi.
//         Một lần nữa, con Tí sún lại là người phát ngôn của chân lý. Nhưng ngay cả chân lý cũng có mặt thứ hai của nó. Sau này tôi dần dần khám phá ra rằng nếy khi còn bé tôi thường xuyên đau khổ vì không được làm những gì mình thích thì khi lớn lên tôi lại rơi vào những nỗi đau khác vì có quá nhiều tự do để làm những điều mình thích, mà so với trẻ con thì những ý thích bốc đồng của người lớn thường là ngu ngốc hơn và nguy hiểm hơn.
//         Người lớn tất nhiên cũng có những “người lớn” của mình. Nếu những nguyên tắc đạo đức là bà mẹ thì những nguyên tắc luật pháp là ông bố của người lớn: một bên đưa ra những khuyên giải nhẹ nhàng, một bên suốt ngày hầm hè và thốt ra những răn đe. Nhưng cũng giống như trẻ con, người lớn không phải lúc nào cũng biết vâng lời bố mẹ. Vì vậy mà tôn giáo xuất hiện. Tôn giáo xét về phương diện nào đó, cũng là đạo đức và luật pháp. Nó khuyên làm điều này, cấm làm điều kia. Nhưng vì tôn giáo xây dựng trên đức tin, nên con người ta làm theo mà không thắc mắc (theo kiểu con cái hay thắc mắc trước các mệnh lệnh của bố mẹ), bởi một thực tế là nếu không còn tin ai nữa thì con người cũng khó mà yên tâm về sự tồn tại của mình trên cõi đời.
//         Ôi, tôi lại nói nhăng nói cuội gì thế này!
//         Tôi đang nói về tôi và con Tí sún, về kế hoạch truy tìm kho báu sắp sụp đổ thảm hại của chúng tôi.
//         Như vậy, rốt lại chúng tôi không ra đảo được, cũng không lên núi hay vô rừng được. Tám tuổi thì khốn khổ khốn nạn thế đấy: Cuộc đời nhìn đi đâu cũng thấy rào cản giăng giăng.
//         Tôi ngó con Tí sún, thấy nó giống hệt một sinh linh bé bỏng đang ngụp lặn giữa một trần gian bao la, và nghĩ lại phận mình, tôi buồn tủi thấy tôi cũng thế, nhỏ nhoi và bất lực.
//         Tôi nhìn mông lung, đầu óc trống rỗng như căn nhà kho sau cơn hoả hoạn, chưa biết phải nhét thứ gì vào đó để có cái mà xê dịch, ánh mắt tôi chợt bắt gặp những cây mận trong khu vườn nhỏ phía sau nhà thằng Hải cò.
//         – Tí sún nè. – Mắt tôi sáng lên – Tao nhớ ra rồi. Người ta cũng hay chôn kho báu trong vườn cây.
//         – Vườn cây á? – Con Tí sún ngơ ngác hỏi lại, không biết tôi định dẫn dắt cuộc phiêu lưu này đến đâu.
//         – Ờ, vườn cây. – Tôi gật đầu, và chỉ tay về phía nhà Hải cò – Mày nhìn đi! Có thấy vườn mận sau nhà thằng Hải cò không?
//         Con Tí sún nhìn khu vườn đằng xa rồi quay lại nhìn tôi chờ đợi:
//         – Thấy.
//         – Trong khu vườn đó người ta chắc chắn có chôn kho báu! – Tôi nói bằng giọng chắc nịch, thậm chí vẻ mặt tôi còn quả quyết hơn cả giọng nói của tôi.
//         Con Tí sún bán tín bán nghi:
//         – Ai chôn hở anh?
//         – Một người nào đó, có thể là ba mẹ Hải cò. Nhưng cũng có thể là của những người chủ cũ.
//         – Thế thì tụi mình đào lên đi!
//         Con Tí sún hào hứng giục, không hẳn nó tin có ai đó chôn kho báu dưới những gốc mận mà vì để khỏi phải nghĩ đến chuyện trốn ba mẹ mà ra đảo hoang hay vô rừng thẳm, điều mà nó tin chắc một đứa điên điên như tôi sớm muộn gì cũng xúi nó làm.
//         o0o
//         Tham gia cuộc khai quật kho báu trong vườn nhà thằng Hải cò có tất cả là bốn đứa.
//         Hải cò đương nhiên chiếm một suất, vì nó là chủ khu vườn. Con Tủn cũng đương nhiên chiếm một suất vì thỉnh thoảng nó đóng vai vợ của Hải cò, tức là bà chủ của khu vườn.
//         Nhưng dĩ nhiên lý do quan trọng là bốn đứa tôi đều là bạn của nhau. Chúng tôi chia sẻ với nhau từ niềm vui nho nhỏ cho đến nỗi buồn lớn lao trong cuộc sống, từ lằn roi ba mẹ thường quất vô mông cho đến kho báu vô giá sắp tìm được.
//         Nhưng một lý do quan trọng hơn hết thảy: Nếu không hì hục xới tung khu vườn lên để tìm kho báu thì cuộc sống của chúng tôi không biết sẽ buồn tẻ đến nhường nào. Ăn, ngủ và học, ba cái món chán ngắt đó hổng lẽ chúng tôi cứ phải chất lên cuộc đời mình để kéo lê chúng hết ngày này sang ngày khác như những con lừa thồ ngu ngốc.
//         Nếu không thể không thồ một thứ gì đó vào năm tám tuổi thì bọn quyết định sẽ thồ kho báu.
//         Bốn đứa tôi đều thống nhất như thế và chọn một ngày nắng ráo chúng tôi bắt đầu đào xới khu vườn.
//         Công cuộc khai quật này được ba mẹ Hải cò ủng hộ hết sức nồng nhiệt. Họ nghĩ chúng tôi là những thợ làm vườn tự nguyện, tức là những đứa trẻ ngoan.
//         Ba Hải cò xoa đầu tôi:
//         – Giỏi lắm, con trai.
//         Mẹ Hải cò rưng rưng khi nhìn con Tủn xách thùng chạy tới chạy lui:
//         – Cẩn thận kẻo vấp té đó con.
//         Sau một tuần thì khu vườn không còn chỗ nào nguyên vẹn. Như những nhà khảo cổ, chúng tôi xới từng gốc cây, bụi cỏ, hết sức kỹ lưỡng. Nhưng kho báu vẫn chưa chịu hiện ra. Chúng tôi mỏi mòn chờ tiếng va của lưỡi cuốc vào nắp hòm gỗ, hoặc một vật gì cưng cứng như vàng hay kim cương nhưng hoài công. Thỉnh thoảng cây cuốc trên tay tôi và Hải cò cũng kêu đánh “cạch” một tiếng nhưng cái làm vang lên âm thanh hi vọng đó chỉ là những mảnh bát vỡ hay một thanh sắt han gỉ.
//         Sau mười ngày, đã xuất hiện trong vườn những hục hang và vài cái hố sâu hoắm.
//         Tới ngày thứ mười một, toàn bộ cây cối bắt đầu nói lời từ giã cuộc sống. Cành khô đi, lá rủ xuống và những trái mận quắt lại.
//         Buổi sáng, ra thăm vườn, bàn tay ba thằng Hải cò không còn xoa đầu tôi nữa. Lông mày dựng ngược, tay chỉ ra cổng rào, ông quát lên bằng cái giọng người ta chỉ dùng để quát kẻ cắp:
//         – Cút!
//         Mẹ nó nhìn những cây mận tàn héo bằng vẻ mặt còn tàn héo hơn, trông bà vô cùng đau khổ và mất mát. Bà không quát tháo mà rên lên:
//         – Ôi, lũ giết người!
//         Bọn tôi không định trở thành những kẻ sát nhân. Bọn tôi chỉ đi tìm kho báu nhưng có thể vì hăm hở tàn phá khu vườn mà bọn tôi khiến mẹ thằng Hải cò lăn đùng ra chết cũng nên. Ý nghĩ u ám đó làm tôi run lên trong đầu.
//         Con Tủn và con Tí sún chắc cũng nghĩ như tôi nên trong nháy mắt ba đứa tôi đã biến như khói.
//         Chỉ có Hải cò không biết chạy đi đâu được. Vì nó không biết chạy đi đâu.
//         Ðối với một đứa bé, ngôi nhà rất quan trọng. Một đứa bé sống trong nhà mình cũng tự nhiên và máu thịt như sống trong bản thân mình. Nó không thể chạy ra khỏi nhà mình, vì điều đó sẽ làm nó đau đớn. Cũng như một con thỏ không thể chạy ra khỏi bộ da của mình.
//         Chỉ có người lớn mới làm được điều kỳ cục đó. Trong một số trường hợp, bản ngã có thể biến thành tha nhân. Lớn lên, tôi nghe các triết gia kháo với nhau như vậy.`,
//     },
//     {
//       id: 'fsdsdfrsdáda',
//       chapterTitle: 'Ai có biết bây giờ là mấy giờ rồi không?',
//       chapterContent: `Hôm sau thằng Hải cò vác bộ mặt tang thương đến tìm tôi. Trông bộ tịch hầm hầm của nó, tôi đoán chắc nó sắp trút lên đầu tôi một cơn bão rủa xả về cái chuyện tôi đã xúi cả bọn phá banh khu vườn nhà nó. Nhưng khi nhìn thấy vẻ mặt te tua không kém của tôi, cơn giận trong lòng nó đột nhiên nguội ngắt.
//         – Mày cũng bị ăn đòn à?
//         Hải cò hỏi bằng giọng sung sướng của người đang cơn hoạn nạn chợt thấy kẻ khác gặp hoạn nạn hơn mình.
//         – Ờ. – Tôi rầu rĩ, tay mân mê gò má sưng – Tối qua ba mày xồng xộc qua nhà tao.
//         Hải cò lo lắng nói, trông nó thấp thỏm như đang đứng trên ngọn núi lửa:
//         – Nếu vậy thì ba tao không chỉ qua mỗi nhà mày.
//         Như để chứng minh cho suy đoán của Hải cò, một chốc sau con Tủn và con Tí sún lếch thếch nối nhau tới, mặt mày nhàu nhò như quần áo vừa lấy vô từ dây phơi.
//         Tôi và Hải cò không hỏi, con Tủn và con Tí sún cũng không nói, nhưng nhìn bộ mặt héo úa của hai nhỏ bạn tôi biết tỏng chuyện gì vừa xảy ra.
//         – Tại sao người lớn lại phạt bọn mình nhỉ? – Tôi than thở bằng giọng của người suốt đời toàn gặp chuyện bất công – Bọn mình có làm gì sai đâu.
//         Hải cò làu bàu:
//         – Khu vườn nhà tao…
//         Thấy Hải cò chuẩn bị giở giọng bắt đền tôi nhìn con Tí sún:
//         – Bọn mình đâu có cố ý, Tí há?
//         Con Tí sún nhanh nhảu phụ hoạ:
//         – Ờ, bọn mình không cố ý.
//         Con Tủn lần này đứng về phía tôi, có lẽ vì nó trót là một trong những đồng-thủ-phạm trong vụ này:
//         – Chẳng ai muốn làm chết khu vườn cả.
//         Hải cò bất chợt nhận ra nó thuộc phe thiểu số, ngay cả con Tủn cũng ở bên kia chiến tuyến, liền thở đánh thượt, lặp lại như cái máy:
//         – Ờ chẳng ai muốn làm chết khu vườn cả.
//         Không hiểu sao tôi vẫn tin rằng nếu chúng tôi không bị đuổi khỏi khu vườn, nếu công việc đào bới vẫn tiếp tục thì sớm muộn gì chúng tôi cũng sẽ tìm thấy kho báu. Dường như mọi đứa trẻ đầu tin rằng có một kho báu nào đó được cất giấu ở một nơi nào đó trên thế gian này đang chờ đợi tụi nó.
//         Thông thường, người lớn không phủ nhận niềm tin đó của trẻ con. “Kho báu à? Có đấy!”, người lớn mỉm cười dễ dãi, nhưng ngay sau đó họ lại bảo kho báu của con người là tri thức. Ðại khái họ thích nói với con cái (như tôi vẫn thích nói với con tôi): “Con ơi, con phải chăm học. Tri thức là một kho báu vô giá. Tri thức là chìa khóa của cuộc sống. Có nó, con có thể mở được mọi cánh cửa”. Trong trường hợp này có lẽ người lớn nói đúng nhưng trong mắt đứa trẻ tám tuổi, đã là kho báu thì dứt khoát phải có hình thù của một hòm vàng hay bét nhất là một thỏi kim cương.
//         – Con người ai mà chẳng thích đi tìm kho báu. – Tôi sụt sịt nói – Ba mẹ mình cũng thế thôi. Thế mà mình lại bị phạt.
//         Như bị khoét vào nỗi đau tích tụ lâu ngày, con Tủn ấm ức tuôn trào:
//         – Bọn mình luôn luôn bị phạt. Trong khi ba mẹ mình thì chẳng bao giờ bị phạt.
//         Hải cò đột ngột bị sự xúc động nhấn chìm. Nó hài tội mẹ nó:
//         – Mẹ mình đã năm lần đánh mất chìa khoá tủ mà chẳng ai nói gì.
//         Con Tí sún không còn mẹ. Nó chỉ còn ba. Nó thút thít:
//         – Ba mình hứa với mình là sẽ bỏ rượu. NHưng ba mình có giữ lời hứa đâu.
//         Tôi đế ngay:
//         – Thế mà vẫn không bị đánh đòn roi nào.
//         Bị cuốn theo dòng thác cảm xúc mỗi lúc một mãnh liệt, bốn đứa tôi thi nhau kể tội ba mẹ. Trong vòng vài phút, bọn tôi kinh ngạc nhận ra ba mẹ của bọn tôi khuyết điểm đầy rẫy, có lẽ nhiều hơn bọn tôi cả chục lần. Sau này tôi vẫn nói với con tôi (như ba mẹ tôi vẫn nói với tôi): Con cái không được phán xét ba mẹ, con à. Và thú thật khi nói như vậy tôi cũng không rõ tôi đang dạy con tôi cách thức làm người hay vì tôi sợ nếu cho phép nó phán xét thì nó sẽ thấy người đáng bị quỳ gối nhiều nhất trong nhà là tôi chứ không phải là nó. Khỉ thật!
//         Thực tế thì sống trên đời ai mà chẳng có khuyết điểm: Trong khi trẻ con cố che giấu khuyết điểm của mình trong mắt người lớn thì người lớn cũng tìm mọi cách giấu giếm khuyết điểm của mình trước mắt trẻ con.
//         Nếu làm một cuộc so sánh thì rõ ràng trẻ con làm điều đó tốt hơn và khéo léo hơn, đơn giản là trẻ con sợ bị phạt. Người lớn che khuyết điểm kém hơn, không phải vì vụng về hơn, mà do họ bất chấp. Trẻ con không thể phạt họ và điều đó gieo vào đầu họ cái ý nghĩ tai hại rằng khuyết điểm là đặc quyền của người lớn. Một đứa trẻ vô tình đánh một phát trung tiện giữa bàn ăn sẽ bị người lớn bợt tai ngay tức khắc nhưng nếu người lớn cũng làm như vậy thì đứa trẻ (và những người chung quanh) chỉ biết cười xòa, trong khi thực ra cả hai đều đáng phê phán như nhau và nếu phải tha thứ thì đứa trẻ đáng được tha thứ hơn.
//         Trẻ con không những thường xuyên bị phạt (bởi những đứa trẻ có hàng trăm thứ lỗi lầm để mà mắc phải, từ chuyện không thuộc bài, làm bẩn tập vở đến chuyện mải chơi hay quên ngủ trưa), mà còn thường xuyên bị phạt oan.
//         Người lớn thường thích cường điệu nỗi cô đơn trong cuộc sống, thích ca cẩm rằng biết tìm đâu cho ra một tri kỷ trong khi chính trẻ con mới cảm nhận điều đó sâu sắc hơn ai hết. Ðứa trẻ lỡ tay đánh vỡ một cái tách hay một lọ hoa, trong đa số các trường hợp đều bị cả ba lẫn mẹ xúm vào tấn công, thêm sự phụ họa của anh chị nếu đứa trẻ xui xẻo đó không những có anh mà còn có cả chị. Ðứa trẻ sẽ thấy oan ức nếu thủ phạm làm vỡ lọ hoa là con mèo hậu đậu nhưng nó không đủ thì giờ để phân bua trước cơn giận dữ của người lớn, nhưng ngay cả khi nó có cơ hội nói lên sự thật giữa những tiếng thút thít thì cũng chẳng ai tin nó.
//         Có lẽ trên cõi đời này không có đứa trẻ nào chưa từng oán trách cha mẹ.
//         Sau khi đã là một ông bố, tôi luôn thận trọng khi quở trách con cái để tránh xảy ra những vụ án oan nhưng thú thật xóa nhòa được lằn ranh giữa trẻ con và người lớn cũng khó ngang với việc xóa bỏ ranh giới giàu nghèo trong xã hội. Về tâm lý, người lớn luôn cho mình đúng về phía chân lý, nếu xảy ra một sai lầm nào đó thì phần lỗi đương nhiên thuộc về trẻ con.
//         Tôi đã cảm nhận được dự bất công dó, ngay vào năm tám tuổi, lúc tôi tiếp tục mân mê gò má rát bỏng. Và tôi tin rằng cả khối trẻ con trên đời này đang nghĩ rằng không có ai hiểu mình, kể cả những người thân thiết nhất và tâm trạng đó thật là sầu khổ, người lớn chưa chắc đã sánh bằng.
//         Ngay sau khi kể tội các bậc làm cha làm mẹ, chúng tôi cảm thấy cần phải thành lập một phiên tòa.
//         Những ngày hôm trước, nếu bốn đứa tôi hăng hái giành nhau làm bố mẹ thì bây giờ lại tranh nhau đến khô cả cổ để được làm con cái.
//         Phải tranh giành thôi, vì đây là phiên tòa vô tiền khoáng hậu: trẻ con xử người lớn!
//         Rốt cuộc, sau một hồi giằng co, Hải cò và con Tủn giật được chiếc ghế quan tòa.
//         Tôi và con Tí sún đành phải đóng vai bị cáo.
//         Hải cò nện lọ mực xuống mặt bàn đánh “cốp”, mặt khó đăm đăm:
//         – Ba đi đâu mà giờ này mới về? Ba có biết bây giờ là mấy giờ rồi không?
//         Tôi lí nhí…
//         – Ờ, ba gặp mấy người bạn… vui miệng làm mấy ly…
//         – Tuần trước ba say rượu, ủi xa vô gốc cây, phải đưa đi cấp cứu, ba hổng nhớ hả?
//         Tuần trước ba thằng Hải cò có say rượu ủi vô gốc cây và tỉnh dậy ở bệnh viện với cái đầu băng trắng thiệt. Bữa đó ai cũng tưởng ba nó tiêu rồi.
//         Tôi tặc lưỡi:
//         – Nhớ chứ sao không?
//         – Nhớ sao ba còn tiếp tục say rượu? Rủi ba có mệnh hệ gì thì vợ con bỏ cho ai nuôi? – Hải cò quát lớn, nhưng nhửa chừng giọng nó chuyển qua nghèn nghẹt như bị ai bóp mũi, chắc nó chợt hình dung đến cảnh chẳng may nó mồ côi cha.
//         Tôi gục đầu xuống:
//         – Ba biết lỗi rồi.
//         Hai cò nhìn tôi (chắc nó nghĩ nó đang nhìn ba nó nên mắt nên mắt nó ngân ngấn nước), giọng dài ra:
//         – Câu này nghe quen quá, ba.
//         – Con yên tâm đi. Ðây là lầ cuối cùng ba hứa với con. – Tôi nói, giọng cảm động, vì tôi đang rùng mình tưởng tượng đến cảnh ba thằng Hải cò nằm bẹp trên chiếc băng-ca không bao giờ ngồi dậy nữa.
//         Hết ba tới mẹ. Con Tủn nhìn con Tí sún bằng ánh mắt ngán ngẩm:
//         – Thiệt tình con không biết nói sao nữa, mẹ à.
//         Con Tí sún đổi chân hia, ba lần, mặt lộ vẻ bồn chồn, như thể nó biết nó tội lỗi đầy mình.
//         Con Tủn đột nhiên nức nở:
//         – Mẹ không bao giờ tôn trọng con hết. Hu hu hu.
//         Con Tí sún mặt mày xanh lè.
//         – Nín đi con. Con nói ấy chứ. Mẹ luôn luôn thương con mà.
//         – Con nói mẹ không tôn trọng con chứ đâu có nói mẹ không thương con.
//         Trước ánh mắt ngơ ngác của con Tí sún, con Tủn ấm ức dằn từng tiếng:
//         – Thương là khác. Còn tôn trọng là khác.
//         Con Tủn bắt đầu kể tội mẹ nó:
//         – Hôm trước đi mua áo, mẹ hỏi con thích chiếc áo màu xanh hay áo màu vàng. Con nói con thích áo màu vàng. Tưởng sao, mẹ nói: Thôi mua áo màu xanh đi con. Mặc màu xanh cho mát.
//         Con Tí sún nhìn áo mày xanh con Tủn đang mặc, cố nín cười:
//         – Ờ… ờ…
//         – Xưa nay chuyện gì cũng vậy. – Con Tủn tiếp tục thút thít – Mẹ hỏi ý con, nhưng rốt cuộc mẹ đều làm theo ý mẹ.
//         – Ờ…ờ…
//         – “Ờ” gì mà “ờ”. – Con Tủn giận dỗi – Nếu mẹ không tôn trọng con thì mẹ còn hỏi ý kiến của con làm gì. Từ nay trở đi, mẹ thích gì mẹ cứ làm, đừng bao giờ hỏi con nữa.
//         – Mẹ xin lỗi…
//         Con Tủn vừa dứt lời, thằng Hải cò đã nôn nóng tiếp theo ngay, như thể đang chờ sẵn:
//         – Mẹ còn cái tật nói dai nữa.
//         Con Tí sún tròn xoe mắt:
//         – Mẹ mà nói dai á?
//         – Chứ gì nữa. – Hải cò nhăn nhó – Năm ngoái con lỡ làm mất chiếc xe đạp, thế mà mẹ cứ lôi chuyện đó ra nói hoài. Hôm qua mẹ vẫn còn nhắc trong bữa ăn, cứ như thể con làm mất cả trăm chiếc xe ấy…
//         – Ủa, mẹ có nhắc hả con? Làm gì có!
//         – Thế ai vẫn hay nói câu “Xe đạp mà nó còn làm mất được thì cái gì mà nó không làm mất”? Ðó không phải la câu nói ưa thích nhất trong năm của mẹ sao?
//         Tôi thở một hơi dài khi nghe Hải cò tố khổ mẹ nó. Ở trên bàn công tố viên, con Tủn cũng sụp mắt xuống. Rõ ràng cái tật cha mẹ Hải cò cũng là cái tật của mẹ tôi và mẹ con Tủn. Mẹ con Tí sún không mắc phải cái tật đó chẳng qua do bà mất sớm.
//         Phiên toà hôm đó kéo dài khá lâu và kết thúc trong niềm hân hoan của cả bốn đứa tôi. Chúng tôi cảm thấy đã lấy lại được sự công bằng, đã xả được bao nhiêu là ấm ức, chân thành xin lỗi trẻ con về bao nhiêu là khuyết điểm mà nếu trẻ con không vạch ra thì người lớn không bao giờ nhận thấy.
//         Hôm đó, chúng tôi như sống trong mơ – một giấc mơ có lẽ mọi trẻ con trên trái đất đều ao ước.
//         Chỉ tiếc là giấc mơ đó phù du quá. Từ phiên tòa trở về, tôi vừa đun đầu vô nhà, ba tôi đã đón tôi bằng tiếng quát:
//         – Con đi đâu mà giờ này mới về? Con có biết bây giờ là mấy giờ không?
//         Oái ăm thay, công tố viên Hải cò vừa quát tôi một câu y như thế, chỉ khác một chút ở cách dùng các đại từ nhân xưng:
//         – Ba đi đâu mà giờ này mới về? Ba có biết bây giờ là mấy giờ không?`,
//     },
//     {
//       id: 'fsdsadâfrsdáda',
//       chapterTitle: 'Và tôi đã chìm',
//       chapterContent: `Hải cò và con Tủn bây giờ phủ nhận tất tần tật những điều đó. Cái phiên tòa “phạm thượng” kia lẽ dĩ nhiên tụi nó càng cố quên đi. Nhưng dẫu sao hồi tám tuổi, tôi và con Tí sún chắc chắn không thể xoay chuyển thế giới theo ý mình nêu không có sự tham gia nhiệt tình của hai đứa nó.
//         Bây giờ ngồi lần giở lại ký ức như lật lại từng trang nhật ký, tôi vẫn bắt gặp một cảm giác bồi hồi khi nhớ đến những gì đã xảy ra trong những năm tháng đó.
//         Sau này, khi đã là một người lớn hẳn hoi, tôi luôn cảm thấy chột dạ khi có một đứa bé nhìn tôi chằm chằm, cái cảm giác của tôi lúc đó là cảm giác nhột nhạt của người bước ra phố mà quên cài nút áo hay nút quần.
//         Thực ra thì tự cách cũng cần cài nút, nhưng lúc quên cài thì chúng ta thường không thấy cảm giác nhột nhạt. Nhiếu người lớn có khuynh hướng coi trọng sự ngay ngắn của quần áo hơn là sự ngay ngắn của tư cách. Bởi quần áo luộm thuộm dễ dàng bị người khác phát hiên còn sự luộm thuộm của tư cách là cái gì đó khó phát hiện hơn và khi bị phát hiện thì lại có vô số lý do để bào chữa.
//         Những người lớn đánh lừa người lớn dễ hơn là đánh lừa trẻ con. Bởi người lớn tiếp nhận thế giới bằng óc phân tích, còn trẻ con cảm nhận thế giới bằng trực giác.
//         Xem cái cách thằng Hải cò và con Tủn đối xử với tuổi thơ của tụi nó thì biết. Những gì trực giác thời thơ ấu mách bảo là hay đẹp thì bây giờ tụi nó dùng lý trí để sổ toẹt hết. Cứ như thể trực giác là cây bút xanh của học trò, còn lý trí là cây bút đõ của thầy cô. Tụi nó phủi kỷ niệm như phủi bụi, nhằm phi tang quá khứ.
//         Nhưng đó là thứ bụi kim cương.
//         Tôi đã gom những hạt bụi óng ánh đó để đúc thành bản tham luận của tôi. À không, bây giờ thì những gì tôi viết ra không phải để trình bày trong cuộc hội thảo Trẻ em như một thế giới nữa. Con Tí sún đã bày cách cho tôi. Tham luận trong một hội thảo khoa học đương nhiên buộc phải đề cao tính xác thực, đó sẽ là lý do để Hải cò và con Tủn phản đối, thậm chí kiện cáo tôi về những gì tôi mô tả về tụi nó, nhưng nếu đây là một cuốn tiểu thuyết thì quyền hư cấu của tác giả bảo đảm cho tôi tránh xa những kiện tụng lằng nhằng. Thậm chí nếu tôi sẽ đề một dòng chữ ngay trang đầu cuốn sách “Tất cả những nhân vật và tình tiết trong cuốn sách này đều do tác giả tưởng tượng ra, nếu có sự trùng hợp do ngẫu nhiên thì đó chuyện ngoài ý muốn, tác giả không chịu trách nhiệm”. Tôi đã từng thấy những cuốn sách ghi như thế, và thật mừng là con Tí sún đã ân cần nhắc cho tôi nhớ điều đó.
//         Từ khi tìm ra lối thoát, tôi không còn ngần ngừ khi nhìn thấy số phone của ông giám đốc Hải cò và bà hiệu trưởng Tủn hiện ra trên màn hình điện thoại của tôi nữa.
//         Tôi hét vào ống nói:
//         – Yên tâm, tên tâm! Sẽ không có bất cứ một bản tham luận nào!
//         – Yên chí, yên chí! Ủy ban UNESCO của Liên hiệp quốc sẽ không biết ở Việt Nam từng có một bé trai rủ một bé gái lên giường một chút chăng từ hồi tám tuổi, họ cũng không biết từng có một phiên tòa kể tôi ba mẹ nào hết. Tôi tắt máy, tặc lưỡi: Ủy ban UNESCO không biết nhưng cuốn sách này in ra thì cả thế giới đều biết.
//         Ủa, nhưng tại sao lại phải giấu khi mà những gì đã xảy ra với bọn nhóc chúng tôi chắc chắn không phải là điều gì bí mật với trẻ con (và cả với những ai từng là trẻ con) trên toàn thế giới, vì tất cả đứa trẻ chân chính bao giờ cũng muốn làm những điều tương tự để cuộc sống trở nên lấp lánh hơn và giàu ý nghĩa hơn.
//         Chắc chắn các bậc làm cha làm mẹ không biết lũ con cái đã giở những trò gì sau lưng họ, mặc dù có thể đó chính là những trò mà các bậc làm cha mẹ khi còn bé cũng đã từng làm sau lưng các bậc làm ông làm bà đó thôi.
//         Thực lòng mà nói, khi tôi quyết định phanh phui những chuyện này ra, những người mà tôi sợ nhất không hẳn là Hải cò và con Tủn, mà chính là ba mẹ tôi, cũng như ba mẹ tụi bạn tôi.
//         Trong mắt các bậc làm cha làm mẹ khả kính đó, xưa nay chúng tôi vẫn là những đứa con ngoan, nhưng bây giờ khi đọc cuốn sách này họ chợt nhận ra chúng tôi không ngoan như họ tưởng, mặc dù rốt cuộc thì những đứa con không ngoan đó vẫn thành đạt trong xã hội, vẫn thành ông giám đốc này, bà hiệu trưởng kia, ông nhà văn nọ…
//         Và tôi không chỉ sợ ba mẹ tôi, ba mẹ thằng Hải cò, ba mẹ con Tủn và con Tí sún. Mà sợ tất cả các bậc làm cha làm mẹ khác trên đời. Ðọc xong cuốn sách này, họ sẽ giật nảy mình, từ đó bắt đầu nhìn con cái bằng ánh mắt khắc khe hơn và dĩ nhiên là nhiều ngờ vực hơn cứ như thể đã là con cái thì thế nào cũng sắp sửa làm điều gì đó hết sức bậy bạ.
//         Thực ra thì mọi đứa trẻ đều hồn nhiên. Chúng tôi lỡ tay phá hỏng khu vườn nhà thằng Hải cò chẳng qua là do ngây ngô. Lúc đó chúng tôi vẫn tin vào điều chúng tôi làm, thậm chí đêm đêm tôi vẫn nằm mơ thấy những hòm vàng chôn dưới những gốc mận sau nhà thằng Hải cò.
//         Sau này, khi đã là người lớn thì tôi thất vọng khi thấy người lớn không có được thái độ trong sáng như lúc họ còn trẻ con. Người lớn bảo bọn trẻ chúng tôi tri thức mới là kho báu thật sự, nhưng nhiều người trong số họ không hề muốn chinh phục tri thức mà chỉ thích săn tìm bằng cấp. Người lớn cũng nói như vậy về tình yêu và đối xử với tình yêu cũng với cách thức thô bạo như họ đã đối xử với tri thức.
//         Bây giờ con tôi cũng hay hỏi tôi về tình yêu. Tự nhiên tôi nhớ đến con Tủn và nói:
//         – Tình yêu là một cuộc rượt bắt nhưng trong nhiều trường hợp ta cố rượt theo người này nhưng rốt cuộc lại bắt được người khác, con à.
//         Con tôi may mắn hơn nhiều người. Nó đã bắt đúng người mà nó rượt (hay rượt nó?). Thế nhưng nó vẫn lo lắng:
//         – Người ta bảo hôn nhân là mồ chôn tình yêu có đúng không hở ba?
//         Tôi nghĩ đến cuộc hôn nhân êm đềm của con Tí sún, nhún vai đáp:
//         – Hôn nhân không chôn ai hết. Chỉ có người chồng và người vợ chôn lẫn nhau nếu họ muốn như vậy.
//         – Thế tại sao…
//         Tôi cắt ngang câu hỏi của con tôi:
//         – Con ơi, những cặp vợ chồng tan vỡ là những người nghĩ rằng hôn nhân là điểm kết thúc của tình yêu trong khi thực ra nó là điểm bắt đầu.
//         Tôi nhìn vẻ mặt ngơ ngác của con tôi, cố tìm một cách diễn đạt dễ hiểu:
//         – Trước khi cưới nhau, con người ta chỉ tập yêu nhưng chưa thực sự biết yêu. Yêu là thứ con người ta cần phải học và cần phải nổ lực suốc đời, con à. Hôn nhân sẽ dạy con người ta yêu. Tất nhiên là có những người học không nổi, hậu quả là họ bị đuổi khỏi hôn nhân như những học sinh lười bị đuổi ra khỏi trường.
//         Mắt con tôi sáng lên:
//         – Học yêu cũng giống như học bơi vậy hả ba? Không học, người ta vẫn bơi được, nhưng bơi theo kiểu cún. Chỉ có học đàng hoàng, người ta mới biết bơi sải, bơi ngửa, bởi ếch và bơi bướm.
//         Tôi cười, nhớ lại cảnh tôi từng nhào xuống sông hồi tám tuổi:
//         – Và những ai lười sẽ bị chìm.
//         o0o
//         Tôi không lười nhưng tôi vẫn cứ chìm.
//         Tôi nhớ đến ngày con Tủn chuyển nhà đi nơi khác. Ba nó tìm được một công việc ngon lành ở thành phố, thế là cả nhà theo chân ba nó.
//         Một ngày trước hôm con Tủn ra đi, tôi đánh liều mượn chiếc điện thoại của chú Nhiên nhắn tin vào máy của mẹ nó:
//         – Chiều này chúng ta chia tay một chút chăng? Buồn ơi là sầu!
//         Mẹ con Tủn đã hết giận tôi vụ nhắn tin linh tinh hôm trước. Có lẽ vậy, vì con Tủn kể với tôi là mẹ nó đã nói với nó bằng giọng hết sức dịu dàng:
//         – Thằng cu Mùi muốn gặp con.
//         Thằng cu Mùi và con Tủn lại ngồi trong quán chè của bà hai Ðọt. Gió ngoài sông thổi vào mát rượi, và lần đầu tiên tôi biết buồn.
//         Nhiều người sợ nỗi buồn. Nhưng tôi không sợ. Ngay từ bé tôi đã không sợ. Tôi chỉ sợ một cuộc sống không buồn không vui, nói chung là nhạt nhẽo. Ðôi khi chúng ta cũng cần có nỗi buồn làm bạn, nhất là lúc cuộc sống bỗng dưng trống trải và cảm giác cô độc đang xâm chiếm ta từng phút một.
//         Khi tôi biết yêu, những câu thơ đầu tiên của tôi là nhằm chia sẻ điều đó:
//         Từ khi quen em, anh đã biết nỗi buồn
//         Và nỗi buồn cũng biết mặt anh
//         Ngày mai nếu nỗi buồn tìm đến
//         Cũng như là gõ cửa người quen…
//         Bạn nhớ lại mà xem, có phải điều đáng sợ nhất trong cuộc sống là không có ai gõ cửa nhà mình?
//         Tâm hồn chúng ta cũng vậy, chúng ta treo ngoài cửa sổ tâm hồn một quả chuông nhỏ và thật khủng khiếp nếu tiếng chuông vui tai đó không một lần run lên.
//         Như vậy, nỗi buồn đã rung chuông tâm hồn một chú bé tám tuổi ngày tôi xa con Tủn.
//         Tôi ngồi nhìn nó múc từng muỗng chè đưa vô miệng mà muốn khóc. Con Tủn không khóc. Nó mê mải ăn. Nó ăn một lèo ba chén chè. Sau này tôi mới biết bọn con gái khi buồn khổ thường ăn nhiều. Có đứa nhờ thất tình mà mập lên. Có vẻ như khi không còn dịp nói những lời yêu thương, cái miệng đã hồn nhiên quay lại với chức năng nhai và nuốt.
//         Nhiều cô bạn vừa ly hôn nói với tôi: Ăn vậy thôi, chẳng thấy ngon lành gì, nhưng cơ thể cứ đòi hỏi phải ăn. Hay thức ăn là thứ có thể lấp đầy nỗi buồn chăng?
//         Con Tủn trong chiều chớm thu hôm đó cũng vậy. Chiếc muỗng đi qua đi lại giữa chén chè đôi môi nó như những chuyến bay khứ hồi gấp gáp, tôi nhìn đến hoa cả mắt.
//         Nhưng ăn xong, vừa đặt chiếc muỗng xuống thì con Tủn bắt đầu khóc. Khi ăn, con Tủn ăn nhiều hơn tôi gấp ba lần. Và khi khóc, nó khóc nhiều hơn tôi gấp sáu lần. Nước mắt đẫm mặt nó như thể nó đang ngồi dưới mưa. Khóc một hồi, nó liếc tôi, đưa tay quẹt vội lên má rồi vùng chạy ra ngoài.
//         Vậy thôi, buổi chia tay hơm đó chỉ gói gọn trong hai động tác ăn và khóc. Không ai nói với ai được câu nào. Tôi có biết bao điều muốn nói với con Tủn. Rằng tôi rất mến nó, mặc dù bao giờ chơi trò vợ chồng tôi cũng cưới con Tí sún làm vợ. Nhưng rốt cuộc tôi đã không nói gì. Ngay cả câu đơn giản nhất là chúc nó lên đường bình an, tôi cũng không kịp thốt ra.
//         Mười năm sau, tôi gặp lại con Tủn khi tôi lên thành phố học đại học. (Thằng Hải cò lên trước một năm. Năm sau tới lượt tôi và con Tí sún).
//         Trong nhiều năm liền, bốn đứa tôi đã cặp kè với nhau vui vẻ như những ngày thơ ấu. Tôi đã tíu tít với con Tủn bao nhiều là chuyện, trừ chuyện ngày xưa tôi thích nó.
//         Mười năm sau nữa, tức là vài lúc hai đứa tôi đã hai mươi tám tuổi và con Tủn chuẩn bị lên xe hoa, tôi mới thú thật với nó những gì tôi nghĩ về nó hai chục năm trước.
//         Con Tủn tỉnh bơ:
//         – Hồi đó em cũng thích anh.
//         – Ðừng giỡn chơi nha. – Tôi giật thót – Thích anh sao suốt ngày em cứ đi chơi với Hải cò?
//         – Chính vì thích anh, em mới không dám đi chơi với anh.
//         Tôi hỏi mà nghe mồ hôi đẫm gáy:
//         – Em nói thiệt không đó?
//         – Em sắp lấy chồng rồi, nói dối anh làm chi?
//         Câu nói của con Tủn ghím chặt tôi xuống ghế. Nó đặt tấm thiệp cưới xuống bàn và ra về một lúc lâu, tôi vẫn không sao nhấc người lên nổi.
//         Hai mươi tám tuổi thực ra không chàng trai nào có khả năng hiểu hết về con gái. Và có thể suốt cả đời vẫn vậy. Người ta nói đúng: hãy yêu phụ nữ nhưng đừng hoài công hiểu họ. Tại sao con Tủn thích tôi nhưng nó cứ bám lẵng nhẵng theo thằng Hải cò để tôi buồn bã thích con Tí sún?
//         Lúc hai mươi tám tuổi, tôi cứ nghĩ mãi về chuyện này và tìm ra cả chục lý do, lý do nào cũng chí lý. Bây giờ, lúc ngồi viết cuốn sách này tôi đủ từng trải để không thắc mắc nữa, đơn giản vì bản thân phụ nữ đôi khi họ còn không hiểu họ và phản ứng của họ nói chung rất khó lường. Có lẽ sự khó lường của phụ nữ chính là bản năng tự vệ mà tạo hóa đã ban cho họ. Sức vóc của phụ nữ thua thiệt so với đàn ông, và họ sẽ bị đàn ông xúm vào cai trị nêu một ngày nào đó họ trở nên dễ hiểu.
//         Tóm lại, phụ nữ giống như hoa hồng, không phải vì hoa hồng có gai như người ta thường nói, mà vì không có ai lẩn thẩn tìm cách cắt nghĩa vẻ đẹp của hoa hồng mặc dù tất cả chúng ta đều yêu nó.
//         “Tôi yêu hoa hồng”, thế là đủ!
//         “Và tôi đã chìm”, thế cũng là quá đủ!`,
//     },
//     {
//       id: 'fsdsdâfrsdádaaa',
//       chapterTitle: 'Trang trại chó hoang',
//       chapterContent: `Như vậy, cuối cùng cuốn sách này đã được viết ra. Nó đã được bắt đầu vào một ngày tám tuổi tôi thấy cuộc sống sao mà tẻ nhạt và kết thúc vào một ngày tám tuổi khác tôi khám phá ra cuộc sống không còn tẻ nhạt nữa, nhưng sao mà buồn quá.
//         Tâm hồn con người từ khi sinh ra giống như mặt hồ phẳng lặng cho đến khi nỗi buồn đầu tiên được cuộc đời ném xuống.
//         Từ ngày con Tủn ra đi, đối với tôi cuộc sống đã bắt đầu có mùi vị, dù đó là thứ mùi vị không dễ chịu nhưng nhờ nó mà tôi không cảm thấy nhạt miệng khi thử nếm cuộc sống.
//         Như bạn biết đấy, tôi đã làm đủ mọi cách để không phải nghe thứ âm thanh đều đều, đơn điệu và mòn mỏi của bánh xe thời gian lăn qua đời tôi.
//         Tôi cùng Hải cò, con Tủn và con Tí sún nghĩ ra hết trò này đến trò khác để thu xếp cuộc sống theo ý mình, trong đó lắm trò ngu ngốc nhưng cũng không ít trò thông thái.
//         Khi còn lại 3 đứa ở thị trấn buồn tẻ tuổi thơ tôi, chúng tôi tiếp tục bày ra hàng mớ những trò quái chiêu khác, như nhúng đầu vào lu nước xem đứa nào nín thở lâu hơn đứa nào và 1 lần tôi suýt chết khi con Tí sún đè cả 2 tay lên cổ tôi để mong tôi thắng bằng được thằng Hải cò.
//         Chúng tôi chạy như điên trong đêm để khi ngước mắt lên sung sướng thấy mặt trăng đang đuổi theo mình.
//         Chạy chán, chúng tôi đem chiếc thau đặt ngoài sân, đổ nước vào rồi đặt ngửa tấm kiếng soi mặt trong đáy thau để xem cầu vồng hiện lên khi mặt trăng chiếu vào.
//         Nhưng có lẽ trò thú vị nhất là nuôi chó hoang.
//         Chẳng hiểu sao thời gian đó rất nhiều chó hoang đi lạc vào thị trấn. Có khi hai, ba con lếch thếch cặp kè nhau như 1 lũ trẻ đi bụi.
//         Chúng lang thang khắp các ngả đường, lê la và sục sạo trong chợ, thỉnh thoảng tạt vào nhà chúng tôi.
//         Tôi giữ lại 1 con, lấy cơm nguội cho nó ăn và nói với Hải cò và con Tí sún:
//         – Tụi mình sẽ mở một trang trại nuôi chó.
//         – Ðể làm gì? – Con Tí sún ngơ ngác.
//         – Tụi mình sẽ huấn luyện chúng thành những con chó thông minh, biết nghe lời.
//         – Ðể làm gì? – Tới phiên thằng Hải cò thắc mắc, nó hỏi y hệt con Tí sún.
//         – Sao lại để làm gì. Sau đó tụi mình sẽ đem bán, được cả khối tiền!
//         Kiếm được tiền mà không phải ngửa tay xin ba mẹ là ước muốn của mọi đứa trẻ trên đời. (Người lớn không vậy. Có nhiều người lớn thích xin xỏ. Người lớn làm ra tiền và có thừa tiền để mua 1 chiếc vé xem kịch, xem ca nhạc, vé vào cổng một khu vui chơi nhưng người lớn lại thích kỳ kèo xin cho bằng được một tấm vé mời dù rất nhiều trường hợp họ nhận được tấm vé mời kèm theo cái nhăn nhó khó chịu của người cho. Ðiều đó thật khó hiểu, dù nó thật dễ hiểu!)
//         Kể từ hôm đó, chúng tôi thi nhau giữ lại bất cứ con chó hoang nào lạc vào nhà hoặc đi ngang qua trước cửa.
//         Trang trại nuôi chó đặt bản doanh tại nhà con Tí sún vì nhà nó rộng và ba nó hầu như đi vắng suốt ngày.
//         Tôi và thằng Hải cò có nhiêm vụ huấn luyện và cung cấp thực phẩm cho lũ chó.
//         Về công tác huấn luyện chó thì đứa nào cũng giành được là huấn luện viên. Chúng tôi suýt ẩu đả nhau vì chiếc ghế vinh quang này nếu con Tí sún ko can ngăn và đưa ra 1 đề nghị hết sức thông minh là tôi và thằng Hải cò thay nhau giữ chức huấn luyện viên 1 ngày.
//         Thằng Hải cò ngồi nhỏm trên gót chân, tay giữ chặt con chó có cái tên hết sức quý tộc là Hoàng tử bé. Nó liếc tôi và con Tí sún:
//         – Tụi mày xem này!
//         Nói xong, nó ném chiếc dép ra xa, rồi lập tức buông con Hoàng tử bé ra, miệng “xùy, xùy” thật lớn.
//         Hoàng tử bé hăng hái lao theo chiếc dép. Hải cò ra lệnh:
//         – Ngậm lấy!
//         Hoàng tử bé ngoan ngoãn ngoạm chiếc dép.
//         – Giỏi lắm! Ðem lại đây! – Hải cò hét lớn, trông nó khoái chí ra mặt.
//         Con Hoàng tử bé giả điếc, ngoạm chiếc dép chạy luôn ra đường.
//         Hải cò cụt hứng:
//         – Chắc tại tao la lớn quá. Nó tưởng tao mắng nó.
//         Hải cò vọt chạy ra đường, rượt theo con chó ngốc nghếch.
//         Năm phút sau, nó lại 1 tay ôm cổ con Hoàng tử bé, tay kia lăm lăm chiếc dép.
//         – Nào, làm lại nào!
//         Hải cò ném chiếc dép và con chó lại lao đi.
//         Lần này Hải cò không dám la lớn nữa. Vừa thấy con Hoàng tử bé ngoạm được chiếc dép, nó lêu khe khẽ “lại đây! lại đây!”, giọng năn nỉ thấy tội, tay búng tróc tróc.
//         Con chó quay cổ nhìn, lưỡng lự 1 giây, rồi nhả chiếc dép ra, phóng vụt về phía Hải cò.
//         Trong khi tôi và con Tí sún ôm bụng cười ngoặt ngoẽo thì Hải cò thò tay cốc đầu con Hoàng tử bé:
//         – Mày đúng là ngu như chó!
//         Bữa đó, huấn luyện viên Hải cò dạy chó đến mệt nhoài. Trong khi con Hoàng tử bé vẫn tung tăng vui vẻ thì Hải cò thở không ra hơi, trông nó vừa mệt vừa chán đời khủng khiếp.
//         Tôi cười khì khì:
//         – Xem tao đây nè. Muốn huấn luyện chó thành công phải thưởng cho nó. Mày xem các tiết mục xiếc thú trên tivi thì biết. Dù là dạy chó, cá heo, cọp hay sư tử, bao giờ người dạy thú cũng cho nó ăn 1 thứ gì đó.
//         Tôi kêu con Tí sún kiếm 1 cái bánh, bẻ ra từng mẩu nhỏ.
//         Tôi dứ dứ mẩu bánh trước mặt con Hoàng tử bé, giọng nghiêm trang:
//         – Nghe đây, nhóc! Nếu mày nhặt chiếc dép đem về cho tao, tao sẽ thưởng cho mày mẩu bánh này.
//         Con Hoàng tử bé vẫn lom lom nhìn mẩu bánh trên tay tôi, nước dãi chảy ướt 2 bên mép. Tôi trông thái độ của nó, ngờ rằng nó chưa nghe tôi nói gì, bèn cẩn thận và chậm rãi lặp lại 1 lần nữa, rồi cao giọng:
//         – Nhớ chưa?
//         Nghe tôi lớn tiếng, con Hoàng tử bé nhấc mắt lên khỏi mẩu bánh để nhìn tôi vẻ thăm dò, nhưng chỉ 1 giây sau, như ko chịu được cơn đòi hỏi của dạ dày, ánh mắt nó lại rớt xuống mẩu bánh trên tay tôi, chân cẳng cựa quậy 1 cách bồn chồn.
//         Tôi nóng ruột liệng chiếc dép ra xa, quát:
//         – Mày nhặt chiếc dép đem về đây rồi sẽ được ăn!
//         Con hoàng tử bé chẳng buồn nhúc nhích, ánh mắt vẫn xẹt qua xẹt lại giữa mẩu bánh và gương mặt tôi 1 cách khẩn trương.
//         Thấy hoàng tử bé giả điếc, Hải cò và con Tí sún cười hích hích khiến tôi nhột nhạt như có ai cù.
//         Hải cò còn chọc quê tôi:
//         – Tưởng sao! Dạy cho con Hoàng tử bé không thèm nghe lời mình, tao làm cũng được.
//         Tôi liếc con Tí sún, đỏ mặt chống chế:
//         – Tao quên. Trước tiên mình cần phải làm gương cho nó.
//         – Làm gương là sao hả anh?
//         – Là làm mẫu cho nó xem trước. – Tôi gãi cằm, giảng giải – Bọn chó là chúa ngốc nghếch. Nếu không biểu diễn cho nó xem qua 1 lần, con Hoàng tử bé sẽ chẳng hiểu mình muốn gì ở nó.
//         Tôi trút những mẩu bánh vụn lên chiếc ghế thấp, hai bàn tay phủi phủi đập đập 1 hồi, rồi bò xuống nền đất, dặn con Tí sún:
//         – Bây giờ tao đóng vai còn hoàng tử bé, mày liệng chiếc dép cho tao lượm về, sau đó mày đút bánh cho tao ăn.
//         – Em hiểu rồi. Thế là con hoàng tử bé sẽ bắt chước làm theo.
//         Con Tí sún cười khúc khích. Nó rút chiếc dép dưới chân liệng tuốt đằng góc nhà, ra lệnh:
//         – Nào, lượm chiếc dép đem lại đây cho chị!
//         Tôi bò lom khom trên 2 đầu gối, tay chống xuống đất, lết lại chỗ chiếc dép.
//         Chiếc dép dơ hầy, lúc đầu tôi định nhặt lấy bằng tay nhưng sợ làm vậy con Hoàng tử bé sẽ không lãnh hội được trọn vẹn bài học, tôi liều nín thở cúi xuống ngoạm chiếc dép vô miệng.
//         Khi quay lại, tôi sửng sốt thấy con hoàng tử bé không them quan tâm gì đến tôi. Nó đang chồm lên ghế, tỉnh bơ ngoạm hết mẩu bánh này đến mẩu bánh khác. Cứ như thể tôi là chó thật và nó là tôi thật.
//         Tôi nhả chiếc dép hôi rình trong miệng ra, giận dữ:
//         – Hoàng tử bé! Mày học hành kiểu gì thế hả?
//         Con chó nghe tôi hét, hoảng hồn thả 2 chân trước xuống khỏi ghế, ngoái cổ nhìn tôi.
//         Tôi chưa nguôi tức:
//         – Mày là chó chứ tao đâu phải là chó. Tại sao trong khi tao ngoạm dép thì mày ngoạm bánh hả?
//         Tôi hầm hầm chạy lại chỗ chiếc ghế, tính cốc cho nó 1 phát vào đầu, nhưng con hoàng tử bé đã nhanh chân lủi mất, kết thúc luôn buổi huấn luyện đầu tiên của tôi và Hải cò, tất nhiên là kết thúc theo cái cách chúng tôi không hề muốn.
//         Suốt 1 tuần lễ tiếp theo, công tác huấn luyện chó của chúng tôi không tiến triển thêm được bước nào. Trong khi đó, những lời ca thán của các bậc phụ huynh ngày một nhiều.
//         Ba mẹ tôi và ba mẹ Hải cò bắt đầu nhìn 2 đứa con bằng ánh mắt nghi ngờ khi thức ăn trong tủ chạn thường xuyên biến mất. Ðến khi phát hiện chúng tôi đang nuôi 1 bầy chó hoang tại nhà con Tí sún thì sự đe dọa.
//         Ba tôi hăm he:
//         – Mày mà còn đánh cắp thức ăn trong tủ lần nữa là tao chặt tay mày nghe, cu Mùi!
//         Ba thằng Hải cò chắc cũng hù dọa nó bằng những lời na ná như ba tôi nên những ngày sau mỗi khi qua thăm trang trại huấn luyện chó nó chỉ dám lận trong áo vài mẩu cơm cháy.
//         Lẽ ra người có đủ bực dọc nhất để phê phán bọn tôi là ba con Tí sún. Không thể bảo việc con gái ông biến ngôi nhà sạch sẽ và yên tĩnh thành 1 trại nuôi chó chôn rôn và thoang thoảng mùi cứt đái là 1 hành động đáng để người lớn hoan nghênh. Thế nhưng ông không la rầy hay trách móc bọn tôi 1 lời và đó là điều khiến tôi và Hải cò đồng ý 1 cách rưng rưng rằng nếu có 1 người cha tốt nhất trên đời thì đó chính là ba con Tí sún.
//         Quan niệm đó chỉ đổ vỡ khi chúng tôi phát giác bầy chó trong trang trại cứ lần lượt biến mất từng con một.
//         Thoạt đầu chúng tôi nghĩ những con chó đó đã trốn nhà ra đi để thỏa mãn nỗi đam mê về 1 cuộc sống dọc đường gió bụi. Nhưng đến ngày con Tí sún tình cờ bắt gặp ba nó đang chén anh chén chú với ba thằng Hải cò trong quán rượu lão Ba Ðực, trước mặt là 1 mâm thịt được tô điểm bởi lá mơ và củ riềng thì bọn tôi đã đau xót hiểu ra những chú chó khốn khổ đó đã thực sự đi đến cõi nào trong trần gian đầy bụi bặm này.
//         Trang trại chó giải tán kể từ ngày đó, không kèn không trống. Giấc mơ kiếm tiền của những chú nhóc cô nhóc tám tuổi cũng tan thành mây khói. Chỉ tiếc là con Tủn đã ra đi, nếu không bốn đứa tôi thế nào cũng lập lại 1 phiên tòa để kể tội ba con Tí sún. Ông thật là may.`,
//     },
//     {
//       id: 'fssdádaaa',
//       chapterTitle: 'Cuối cùng là chuyến tàu không có người soát vé',
//       chapterContent: `Nhiều người bảo thịt chó rất ngon. Thậm chí có người bảo bên Hàn Quốc, có cả một ngành công nghệ chế biến thịt chó. Vì thịt chó là món khoái khẩu của người Hàn.
//         Người phương Tây ghê sợ điều đó. Người phương Tây rất yêu quý vật nuôi, đến mức có người bảo rằng ở phương Tây các đối tượng xã hội quan tâm được xếp theo thứ tự: trẻ em, phụ nữ, chó mèo, cuối cùng mới đến đàn ông. Ðó là lý do vì sao rất nhiều nhân vật nổi tiếng ở phương Tây kịch liệt phản đối khi Hàn Quốc được Liên đoàn bóng đá thế giới chọn là một trong hai quốc gia tổ chức World cup 2002.
//         Lúc tôi đang ngồi viết lại câu chuyện này, trong vòng bán kính một cây số tính từ chỗ tôi ngồi đó ít nhất là năm nhà hàng đặc sản, ở đó người ta quảng cáo và bày bán không thiếu một món ăn lạ lẫm nào: nai, chồn, rắn, tê tê, nhím, thằn lằn núi, đà điểu…
//         Tôi đã thử ăn một vài món trong số đó và thú thật là chẳng ngon lành gì, hoặc nếu cảm thấy ngon vì lạ miệng thì cũng không ngon đến mức muốn ăn lại lần thứ hai.
//         Thực ra, các thức ăn ngon nhất luôn luôn vẫn là các thức ăn quen thuộc: các loại thịt gia súc, chắc chắn loài người đã có hàng ngàn năm dùng răng và lưỡi sàng lọc các loại thịt trên trái đất. Tổ tiên chúng ta dĩ nhiên đã thử nếm qua các thứ thịt nai, chồn, rắn, tê tê, nhí, thằng lằn núi, đà điểu và vô số các động vật khác (bây giờ gọi là đặc sản) lẫn chó, ngựa, mèo, heo, bò, gà, (lúc đó còn là chó rừng, ngựa rừng, mèo rừng, heo rừng, bò rừng, gà rừng) và cuối cùng đã đi đến kết luận: các loại thịt heo, bò, gà là tuyệt nhất. Từ phán quyết đó, heo rừng, bò rừng, gà rừng đã được nuôi dưỡng và thuần hóa để trở thành nguồn cung cấp thực phẩm vĩnh viễn cho con người. Ðó là một lựa chọn vô cùng sáng suốt và có giá trị ở mọi không gian và thời gian: cho đến nay ba loại thịt trên nghiễm nhiên chiếm một vị trí không thể thay thế trên bàn ăn của mọi gia đình từ Ðông sang Tây.
//         Chó đã không được chọn lựa làm thực phẩm, hiển nhiên có lý do của nó, không chỉ vì nó có khoái khẩu và bổ dưỡng hay không. Loài người thuần hoá ngựa để cưỡi, trâu để kéo cày, mèo để bắt chuột và chó để trông nhà, và quan trọng hơn để là bạn với con người, đặc biệt là làm bạn với trẻ con.
//         Tôi, thằng Hải cò và con Tí sún không thể nói với Hoàng tử bé “Thịt của bạn ngon lắm”. Mọi đứa trẻ khác cũng không thể nói với mọi con chó khác những lời như thế. Ðơn giản, trẻ con không bao giờ nhìn chó như nhìn một món ăn, dù gươm kề cổ.
//         Còn tại sao chó trở thành bạn của con người thì có lẽ tôi không cần phải giải thích. Tôi tin bất cứ ai đọc cuốn sách này cũng từng có một con chó là bạn. Với một đứa trẻ, thèm ăn thịt một con chó cũng chẳng khác nào thèm ăn thịt một đứa bạn thân của mình.Ðiều đó đáng kinh sợ, vì đứa trẻ khi đó sẽ giống như những con yêu tinh ăn thịt người trong các câu chuyện cổ.
//         Ðó là lý do tại sao bọn tôi quyết định giải tán trang trại chó hoang trong đau đớn, mặc dù để làm được điều đó thật vất vả.
//         Lũ chó không chịu ra khỏi nhà dù bọn tôi thi nhau hò hét, quát tháo, mắng mỏ, dậm chân thình thịch và dứ dứ nắm đấm trước mặt chúng.
//         Cuối cùng tôi, thằng Hải cò và con Tí sún mỗi đứa ẵm một con trên tay, chạy rã cả chân để đến một nơi xa nhất có thể, thận trọng đặt chúng xuống để rồi ngán ngẩm nhận ra khi tụi tôi quay về thì bọn chó vẫn lẽo đẽo sau lưng.
//         Chẳng đặng dừng, con Tí sún quyết định đóng cổng rào nhốt lũ chó bên ngoài và chúng tôi đã trải qua những ngày cắn rứt khi phải chứng kiến lũ chó con nằm con ngồi chầu chực suốt ngày đêm bên ngoài cổng nhà con Tí sún, thắc thỏm nhìn vào.
//         o0o
//         Cuộc đời như vậy là đã thôi tẻ nhạt, theo cái cách số phận dành cho mỗi người.
//         Nỗi buồn về sự ra đi của lũ chó hoang chồng lên nỗi buồn về sự ra đi của con Tủn đã khiến một chú bé tám tuổi kiễng chân lên để tậplàm người lớn.
//         Tôi nghĩ ngợi hơn, sầu tư hơn, và dường như không còn háo hức sắp xếp lại thế giới nữa. Tôi biết mình không thể khơi dòng đời theo bản vẽ trong đầu tôi, và nếu tôi có cố khơi theo hướng này thì dòng đời vẫn cứ chảy theo hướng khác. Thôi, chuyện đó hẵng để sau này, mặc dù khi trờ thành người lớn chúng ta thường có xu hướng bơi theo những dòng chảy đã được người khác khơi sẵn, như xe cộ luôn tuân thủ luật giao thông, chỉ để được an toàn.
//         Bên cạnh cái dở, người lớn tất nhiên cũng có cái hay của người lớn. Tôi là người lớn, nếu tôi không nghĩ vậy có khác gì tôi phủ định chính mình. Nhưng mà đó là sự thật. Trẻ con cũng yêu ba mẹ, cũng biết ba mẹ yêu mình nhưng đón nhận sự chăm sóc đó một cách hồn nhiên, chả nghĩ ngợi gì. Lòng hiếu thảo đối với ba mẹ, chỉ người lớn mới cảm nhận được đầy đủ. Ðặc biệt khi người lớn đó sinh con, nuôi con và vất vả vì con thì sự cảm nhận đó càng sâu sắc hơn nữa. Vì vậy mà các bậc làm cha làm mẹ không nên lo lắng thái quá (khi tôi khẳng định rằng mọi đứa trẻ trên thế giới này đều từng oán trách ba mẹ) vì những đứa con oán trách ba mẹ nhiều nhất sau này sẽ là những đứa con biết ơn ba mẹ nhiều nhất, trong đó có cả lý do là hồi nhỏ đã trót oán trách ba mẹ quá nhiều.
//         Người lớn còn có cái hay nữa là thỉnh thoảng vờ vịt một cách đáng yêu. Như ông giám đốc Hải cò và bà hiệu trưởng Tủn.
//         Khi cuốn sách này phát hành được hai ngày, tôi chết điếng người khi nhác thấy chiếc xe hơi quen thuộc của Hải cò đỗ xịch trước cửa.
//         Một mình Hải cò tìm tới gây sự tôi đã hãi, đằng này lục tục leo xuống xe ngoài Hải cò còn có thêm con Tủn.
//         Ôm kè kè một chồng sách bên hông như thể ôm bom, cả hai xồng xộc bước vào nhà.
//         Tôi vội vã lao ra chặn ngay cửa, như muốn dùng thân mình lấp nỗi nguy hiểm:
//         – Này, này…. cậu…
//         Trái với sự chờ đợi của tôi, Hải cò toét miệng cười:
//         – Tụi này đến chúc mừng cậu đây.
//         Trước bộ mặt chắc là rất đần đần của tôi, Hải cò, với con Tủn theo sau, đi thẳng vô trong, đặt chồng sách trên tay xuống bàn – cả hai đứa.
//         Tôi nhìn hai chồng sách, há hốc miệng khi nhận ra đó là cuốn sách tôi vừa in:
//         – Các cậu làm gì thế?
//         – Còn làm gì nữa! – Hải cò vẫn tròng lên mặt nụ cười rạng rỡ – Mua sách của cậu, đem tới nhà cậu thì là để xin chữ ký của cậu chứ để làm gì!
//         Tôi không biết tôi đã ngồi vào bàn bằng cách nào. Tôi ngước mắt nhìn hai đứa bạn trước mặt bằng ánh mắt của người vẫn chưa ra khỏi cơn mộng du:
//         – Thế các cậu không giận mình à?
//         Con Tủn trưng ra bộ mặt ngây thơ:
//         – Giận chuyện gì hả anh?
//         – Thì các cậu chả bảo mình đem chuyện hồi bé của các cậu ra bêu riếu là gì!
//         – Ối, sao mà cậu ngốc thế! – Hải cò kêu lên, giọng lớn đến mức cảm tưởng nó đáng cố đánh thức cả thị trấn – Tụi này nói như vậy là để cậu dẹp quách cái bản tham luận vớ vẩn của cậu đi. Một tuổi thơ tuyệt vời như thế mà đem ra viết tham luận trong hội nghị thì phí quá.
//         Tôi cười như mếu:
//         – Thế ra việc mình quyết định viết những hồi bé thành sách là nằm trong ý đồ của các cậu sao?
//         Con Tủn hít vô một hơi, mặt nó ửng lên như tráng men:
//         – Anh ơi, đó là một ý đồ tốt đẹp.
//         Tôi nhìn sững con Tủn:
//         – Em không ngại học sinh và phụ huynh học sinh biết chuyện hồi tám tuổi em đã nhận được tin nhắn nóng bỏng…
//         – Thú thật là em đã quên mất chuyện đó rồi. Bao nhiêu năm rồi còn gì! – Con Tủn chép miệng và khi nói tiếp thì mặt nó lộ vẻ xúc động – Bây giờ đọc lại, em mới chợt biết là suýt chút nữa em đánh rơi một kỷ niệm đẹp. Có gì đâu mà ngại hả anh. Ai mà chẳng biết anh đã nhắn tin cho em một cách trong sáng…
//         Tôi len lén nhìn Hải cò:
//         – Nhưng một ông giám đốc hồi bé từng lập một phiên tòa…
//         – Lập hay không lập cũng thế thôi! Mỗi đứa trẻ đều có một phiên tòa trong lòng mình – Hải cò nhịp những ngón tay lên mặt bàn làm phát ra những tiếng lách cách như để đệm cho câu nói – Người lớn cần phải biết rằng trẻ con cũng thường xuyên phán xét họ nghiêm khắc không kém gì họ phán xét chúng. Ðiều đó sẽ giúp cho người lớn chú ý hơi cách sống của mình.
//         Hải cò nhe răng cười:
//         – Tôi không tin người lớn sẽ cách chức tôi chỉ vì hồi bé tôi từng lập một phiên tòa kể tội người lớn.
//         Suốt cuộc gặp gỡ, tôi nói rất ít, không phải vì không có gì để nói mà vì thằng Hải cò và con Tủn đã chiếm diễn đàn một cách thô bạo trong buổi sáng hôm đó, chỉ để bốc cuốn sách của tôi lên mây. Suốt hai tiếng đồng hồ, tôi như bị nhấn chìm dưới một cơn bão những lời có cánh.
//         Ngày hôm sau con Tí sún tới và tôi hết sức ngạc nhiên thấy nó chẳng hề tỏ ra ngạc nhiên khi tôi kể cho nó nghe về cuộc viếng thăm của Hải cò và con Tủn.
//         – Em biết chuyện đó từ lâu rồi – Nó mỉm cười với vẻ biết lỗi.
//         – Thì ra em cố tình giấu anh – Tôi dựng mắt lên, giận dỗi nói – Cả ba người toa rập với nhau?
//         – Bởi vì trong bốn đứa, anh là người gìn giữ kỷ niệm tốt nhất, cũng là người duy nhất có khả năng kể lại câu chuyện tuổi thơ.
//         – Tiếc thật! – Tôi bất giác buông tiếng thở dài và nhìn ra sân nắng, đột nhiên bắt gặp mình bâng khuâng – Chúng mình đã ở quá xa sân ga tuổi nhỏ.
//         – Nhưng cuốn sách của anh là chiếc vé tuyệt vời – Ðôi mắt con Tí sún long lanh với chiếc vé đó, tụi em đã có dịp quay về.
//         – Bây giờ em nấu mì gói đã ngon chưa? – Tự nhiên tôi hỏi.
//         – Còn anh thì sao? Anh vẫn đang đi tìm kho báu đó chứ? – Con Tí sún không đáp lời tôi mà mỉm cười hỏi lại. Cứ như thể hai đứa tôi vẫn ở trên tàu.
//         Khi đọc đến những câu đối thoại ngớ ngẩn này, giả định là bạn đang cầm cuốn sách của tôi trên tay, tôi tin rằng bạn đang nhìn thấy tôi, Hải cò, con Tủn và con Tí sún – những nhân vật chính của câu chuyện lan man này. Tôi tin như vậy vì tôi tin bạn đang ngồi cùng bọn tôi trên một chuyến tàu từ khi trang sách đầu tiên mở ra trên tay bạn.
//         Chiếc vé tuổi thơ đó, bạn cứ giữ kỹ trong túi áo, vì không có người soát vé trên chuyến tàu đặt biệt này.
//         Bạn có thể trở về thăm lại thời thơ ấu của mình bất cứ lúc nào, hay nói khác đi lúc mà bạn nhận ra rằng thỉnh thoảng tắm mình trong dòng sông trong trẻo của tuổi thơ sẽ giúp bạn gột rửa những bụi bặm của thế giới người lớn một cách diệu kỳ.
//         Ờ tám tuổi, vẫn là trong trẻo lắm, vẫn khát khao cuộc sống cho dù lúc tám tuổi có thể bạn rầu rầu nói: “Một ngày, tôi chợt nhận thấy cuộc sống thật là buồn chán và tẻ nhạt”. Câu nói yếm thế đó của một đứa trẻ có thể bắt đầu cho một cuốn sách vui nhộn. Nhưng bây giờ, đã lớn, nếu một ngày bạn cảm thấy sự bế tắc của cuộc sống gieo vào đầu bạn ý nghĩ ảm đạm đó thì rất có thể đó là khởi đầu cho một câu chuyện tệ hại và chân trời có khả năng khép lại trước mắt bạn.
//         Vì vậy, để sống tốt hơn đôi khi chúng ta phải học làm trẻ con trước khi học làm người lớn, tôi đã nghĩ như vậy khi ngồi cặm cụi gõ cuốn sách này…
//         TPHCM, tháng 1-2008
//         Nguyễn Nhật Ánh
//         Ở một nơi nào đấy xa xôi
//         Có thành phố
//         như giấc mơ
//         im ắng
//         Ðầy bụi bám.
//         Một dòng sông lẳng lặng.
//         Một dòng sông
//         nước như gương
//         lờ trôi…
//         Ở một nơi nào đấy xa xôi
//         Có thành phố,
//         ngày xưa,
//         có thành phố
//         Nơi rất ấm, tuổi thơ ta ở đó
//         Từ rất lâu,
//         đã từ rất lâu,
//         trôi qua…
//         Ðêm nay tôi bước vội khỏi nhà
//         Ðến ga,
//         xếp hàng mua vé:
//         “Lần đầu tiên trong nghìn năm,
//         Có lẽ,
//         Cho tôi xin một vé
//         đi Tuổi Thơ.
//         Vé hạng trung –
//         Người bán vé hững hờ
//         Khe khẽ đáp:
//         Hôm nay vé hết!-
//         Biết làm sao
//         Vé hết, biết làm sao!
//         Ðường tới Tuổi Thơ
//         còn biết hỏi nơi nào?
//         Nếu không kể
//         đôi khi ta tới đó
//         Qua trí nhớ
//         Của chúng ta
//         Từ nhỏ…
//         Thành phố Tuổi Thơ –
//         thành phố chuyện thần kỳ.
//         Cơn gió đùa,
//         tinh nghịch dẫn ta đi.
//         Ở đấy,
//         làm ta say, chóng mặt,
//         Là những cây thông vươn tới mây,
//         Là những ngôi nhà,
//         cao,
//         caonhất.
//         Và mùa đông
//         rón rén
//         bước
//         trong đêm…
//         Qua những cánh đồng
//         Phủ tuyết trắng và êm…
//         Ôi thành phố Tuổi Thơ –
//         bài ca ngày nhỏ
//         Chúng tôi hát –
//         Xin cảm ơn điều đó!
//         Nhưng chúng tôi không trở lại,
//         Ðừng chờ!
//         Trái đất nhiều đường.
//         Từ thành phố Tuổi Thơ
//         Chúng tôi lớn,
//         đi xa…
//         Hãy tin!
//         Và thứ lỗi!
//         ROBERT ROJDESVENSKY
//         Thái Bá Tân chuyển ngữ`,
//     },
//   ],
// };
