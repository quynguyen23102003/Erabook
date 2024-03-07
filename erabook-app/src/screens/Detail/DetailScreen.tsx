import {
  Dimensions,
  Image,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popins } from '../../components/popins';
import Icon from 'react-native-vector-icons/Feather';
import DetailHeader from './DetailHeader';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import {
  RootStackName,
  RootStackParamList,
  RootStackProps,
} from '@navigator/types';
import { useTranslation } from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import Reviews from './Reviews';
import { ScrollView } from 'react-native-gesture-handler';
import { GenresItem } from '@screens/Detail/components/GenresItem';
import { getImageRatio } from '../../helper/string.helper';
import { StatisticsItem } from '@screens/Detail/components/StatisticsItem';
import { HeaderBox } from '@screens/Detail/components/HeaderBox';
import ReviewBox from '@screens/Detail/components/ReviewBox';
import { FooterListLoading } from '@components/loading/footerListLoading';
import { MotiView } from 'moti';
import { useAppDispatch, useAppSelector } from '@redux/storeAndStorage/persist';
import { fetchBook } from '@redux/actions/book.actions';
import moment from 'moment';
import { Track, useTrackPlayer } from '@hooks/useTrackPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { setCurrentBook, setTrack, toggleBottomSheet } from '@redux/slice/track.slice';
import { getAudioFiles } from '@services/track.player.service';
import { createReview, getMyReview, updateReview } from '@services/api.service';

type HomeProps = RouteProp<RootStackParamList, RootStackName.EbookScreenDetail>;
const { width } = Dimensions.get('window');

const DetailScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const ebook = useAppSelector(state => state.root.book.currentBook);
  const [ratings, setRatings] = useState(0);
  const [isRendering, setIsRendering] = useState(true);
  const isFocus = useIsFocused();
  const {
    params: { ebookId },
  } = useRoute<HomeProps>();
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const [layout, setLayout] = React.useState<LayoutRectangle>({
    width: 0,
    height: 0,
    y: 0,
    x: 0,
  });
  const {
    track,
    duration,
    error,
    isBuffering,
    isPlaying,
    isReady,
    isSetup,
    loading,
    position
  } = useAppSelector(state => state.root.track)

  const savedRating = useRef(0);
  const comment = useRef('');

  const {
    addTrack,
    play,
    pause,
    onClear,
    setupPlayer,
  } = useTrackPlayer();

  const WIDTH_IMAGE = width / 2.5;

  const onReadBookPress = () => {
    if (ebook?.price === 0 || ebook?.price === null) {
      navigation.navigate(RootStackName.ReadbookScreen, { ebookId: ebook._id });
    } else {
      if (ebook?._user?.isPurchased) {
        navigation.navigate(RootStackName.ReadbookScreen, { ebookId: ebook._id });
      } else {
        navigation.navigate(RootStackName.SelectPaymentMethodScreen);
      }
    }
  };

  useEffect(() => {
    setupPlayer();
  }, [])

  useEffect(() => {
    if (!isFocus) {
      onClear();
    }
  }, [isFocus])

  useEffect(() => {
    dispatch(fetchBook(ebookId)).then(() => {
      setIsRendering(false);
    });
  }, [dispatch, ebook?._user?.existingRating?.rating, ebookId]);



  useEffect(() => {
    const fetchReview = async () => {
      const data = await getMyReview(ebookId);
      if (data) {
        setRatings(data.rating);
        savedRating.current = data.rating;
        comment.current = data.comment ?? '';
      }
    };

    navigation.addListener('focus', () => {
      if (ebook?._user?.isPurchased) {
        fetchReview();
      }
    });

    const unsubscribe = navigation.addListener('blur', () => {
      if (ratings === 0) {
        return;
      }
      if (!ebook?._user?.existingRating?.rating) {
        console.log('createReview');
        createReview(ebookId, ratings);
      } else if (ebook?._user?.existingRating?.rating !== ratings) {
        console.log('updateReview');
        updateReview(ebookId, ratings);
      }
    });

    return unsubscribe;
  }, [ebook?._user?.existingRating?.rating, ebookId, navigation, ratings]);


  const handlePlay = useCallback(() => {
    if (!ebook) return;
    const fetch = getAudioFiles(ebook._id, ebook.title, true)[0];
    const data: Track = {
      artist: ebook?.author?.name ?? '',
      title: fetch.title,
      url: fetch.url,
      duration: 100,
      id: fetch.id,
    }
    if (track) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      addTrack(data)
      dispatch(setTrack(data))
      play();
    }
  }, [ebook, track, isPlaying])


  const onVoiceBookPress = () => {
    if (ebook) {
      let index = 0;
      let book = getAudioFiles(ebook._id, "Phần", true)[index]
      navigation.navigate(RootStackName.PlayAudioScreen, { item: book, index: index })
      dispatch(setCurrentBook(ebook))
    }
  }


  const onWriteReviewPress = () => {
    navigation.navigate(RootStackName.WriteAReview, {
      rating: ratings,
      comment: comment.current,
    });
  };

  const onChangeRating = (newRating: number) => {
    setRatings(newRating);
  };


  return (
    <View style={styles.container}>
      {
        (isRendering || ebook === null) ? (
          <View style={styles.emptyWrapper}>
            <FooterListLoading />
          </View>
        ) : (
          <MotiView
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: 'timing',
              duration: 600,
            }}>
            <DetailHeader onLayout={e => setLayout(e.nativeEvent.layout)} />
            <ScrollView
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: layout.height + 40,
                paddingTop: 6,
                gap: 20,
              }}>
              <View style={styles.main}>
                <TouchableOpacity
                  disabled={!(ebook._id === "657c569bf40fcbb2923eeb63")}
                  onPress={handlePlay}
                  activeOpacity={0.6}
                  style={{
                    width: WIDTH_IMAGE,
                    height: getImageRatio(WIDTH_IMAGE),
                    borderRadius: 10,
                    marginEnd: 15,
                    overflow: 'hidden',
                  }}>
                  {
                    ebook._id === "657c569bf40fcbb2923eeb63" && isSetup && (
                      <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}>
                        <View style={{
                          elevation: 10,
                          borderRadius: 50,
                          padding: 10,
                          borderColor: "white",
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowOpacity: 0.5,
                          shadowRadius: 10,
                          shadowColor: "rgba(0,0,0,0.5)",
                        }}>
                          <FontAwesomeIcon
                            size={24}
                            color={"white"}
                            icon={!isPlaying ? faCirclePlay : faCirclePause} />
                        </View>
                      </View>
                    )
                  }
                  <Image
                    resizeMode={'contain'}
                    source={{ uri: ebook?.coverImage }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text
                    ellipsizeMode={'tail'}
                    style={[styles.text700, { fontSize: 20 }]}>
                    {ebook?.title}
                  </Text>
                  <Text
                    style={[
                      styles.text500,
                      { color: '#F89300', marginTop: 7, fontSize: 16 },
                    ]}>
                    {ebook?.author?.name}
                  </Text>
                  <Text
                    style={[
                      styles.text400,
                      {
                        color: colors.gray,
                        fontSize: 14,
                        marginTop: 7,
                        marginBottom: 5,
                      },
                    ]}>
                    {translate(OtherTranslationKey.ReleasedOn)}{' '}
                    {moment(ebook?.releaseDate * 1000 ?? moment.now()).format(
                      'YYYY',
                    )}
                  </Text>
                  <View style={styles.mainButton}>
                    {ebook?.genres?.map((item, index) => (
                      <GenresItem key={index} index={index} title={item.name} />
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.main}>
                <StatisticsItem
                  icon
                  title={ebook?.rating.average || 0}
                  subtitle={
                    ebook?.rating.count +
                    ' ' +
                    translate(OtherTranslationKey.reviews)
                  }
                />

                <View style={{ width: 1, backgroundColor: colors.border }} />
                <StatisticsItem
                  title={ebook?.pageCount || 0}
                  subtitle={translate(OtherTranslationKey.Pages)}
                />
                <View style={{ width: 1, backgroundColor: colors.border }} />
                <StatisticsItem
                  title={ebook?.purchaseCount}
                  subtitle={translate(OtherTranslationKey.Purchases)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  ebookId === "657c569bf40fcbb2923eeb63" ? onVoiceBookPress() : onReadBookPress()
                }}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Text style={[styles.text500, { fontSize: 18, color: 'white' }]}>
                  {
                    ebook?.price === 0 || ebook?.price === null
                      ? translate(
                        ebook._id === "657c569bf40fcbb2923eeb63"
                          ? OtherTranslationKey.AudioVoice
                          : OtherTranslationKey.Read
                      )
                      : ebook?._user?.isPurchased
                        ? translate(ebook._id === "657c569bf40fcbb2923eeb63"
                          ? OtherTranslationKey.AudioVoice
                          : OtherTranslationKey.Read
                        )
                        : translate(OtherTranslationKey.Buy) +
                        `  USD $${ebook?.price ?? ''}`
                  }
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate(RootStackName.AboutEbookScreen, ebook)
                  }>
                  <Text style={[styles.text700, { fontSize: 20 }]}>
                    {translate(OtherTranslationKey.About)}
                  </Text>
                  <Icon
                    name="arrow-right"
                    style={{ color: colors.primary }}
                    size={26}
                  />
                </TouchableOpacity>
                <Text
                  ellipsizeMode='tail'
                  numberOfLines={20}
                  style={[
                    styles.text400,
                    { color: colors.textDescription, fontSize: 15, marginTop: 15 },
                  ]}>
                  {ebook?.description || ''}
                </Text>
              </View>
              <HeaderBox
                onPress={() =>
                  navigation.navigate(RootStackName.RatingsAndReviewEbookScreen, {
                    bookId: ebook._id,
                    rating: ebook?.rating,
                  })
                }
                title={translate(OtherTranslationKey.RantingsReviews)}
              />
              <Reviews {...ebook.rating} />
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.backgroundCategory,
                }}
              />
              {ebook?._user?.isPurchased && (
                <ReviewBox
                  onWriteReviewPress={onWriteReviewPress}
                  defaultRating={ratings}
                  onChangeRating={onChangeRating}
                />
              )}

            </ScrollView>
          </MotiView>
        )}
    </View>
  );
};

export default DetailScreen;

export const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    emptyWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorMain: {
      color: colors.text,
    },
    main: {
      // marginStart: 0,
      flexDirection: 'row',
      // flex: 1
    },
    footer: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: colors.backgroundCategory,
      paddingBottom: 10,
      marginTop: 10,
      marginBottom: 15,
    },
    footerContent: {
      alignItems: 'center',
    },
    social: {
      flexDirection: 'row',
      height: 30,
    },
    footerContent1: {
      flex: 1,
      marginStart: 13,
      marginTop: 17,
    },
    mainButton: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 6,
      flexWrap: 'wrap',
    },
    button: {
      backgroundColor: '#EEEEEE',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      marginBottom: 8,
    },
    textButton: {
      fontSize: 9,
      color: '#686868',
    },
    viewContent: {
      // flex:1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    viewText: {
      color: colors.textDescription,
      fontSize: 11,
    },
    viewPaper: {
      flexDirection: 'row',
      flex: 1,
    },
    paper: {
      marginTop: 7,
      marginStart: 5,
      borderRadius: 5,
      backgroundColor: colors.backgroundCategory,
    },
    txtRate: {
      textAlign: 'center',
      fontFamily: Popins[600],
      fontSize: 18,
      color: colors.text,
    },
    btnReview: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#F89300',
      paddingHorizontal: 18,
      paddingVertical: 5,
      borderRadius: 30,
    },
    txtReview: {
      color: '#F89300',
      fontFamily: Popins[600],
      fontSize: 17,
      textAlign: 'center',
    },
  });
