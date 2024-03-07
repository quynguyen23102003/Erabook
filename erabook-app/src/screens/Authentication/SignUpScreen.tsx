import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppTheme, AppThemeColors} from '../../themes/theme.config';
import {ProgressBar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Step1 from './Step/Step1';
import Step2 from './Step/Step2';
import Step3 from './Step/Step3';
import Step4 from './Step/Step4';
import Step5 from './Step/Step5';
import {useNavigation} from '@react-navigation/native';
import {RootStackProps} from 'navigator/types';
import {callApi} from '@services/axios.service';

export type GenreSignUp = {
  _id: string;
  description: string;
  name: string;
};

const {height: screen_height, width: screen_width} = Dimensions.get('screen');
const SignUpScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [progress, setProgress] = useState(0.2);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const [user, setUser] = useState({});
  const [genres, setGenres] = useState<GenreSignUp[]>([]);

  const onBackPress = useCallback(() => {
    if (progress > 0.3) {
      setProgress(pre => pre - 0.2);
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, progress]);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await callApi().get(
          'https://bookworm-server.fly.dev/genres/suggestion',
        );
        if (res.data) {
          setGenres(res.data);
        }
      } catch (error) {
        console.log('step 3 fetchGenre error: ' + error);
      }
    };
    fetchGenre();
  }, []);

  useEffect(() => {
    let targetIndex;

    if (progress < 0.3) {
      targetIndex = 0;
    } else if (progress < 0.5) {
      targetIndex = 1;
    } else if (progress < 0.7) {
      targetIndex = 2;
    } else if (progress < 0.9) {
      targetIndex = 3;
    } else {
      targetIndex = 4;
    }

    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: true,
    });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove();
  }, [onBackPress, progress]);

  const onNextPress = useCallback(() => {
    if (progress < 1) {
      setProgress(pre => pre + 0.2);
    }
  }, [progress]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={onBackPress} style={styles.btnBack}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <ProgressBar
          progress={progress}
          theme={{
            colors: {primary: colors.primary, surfaceVariant: colors.border},
          }}
          style={styles.progressBar}
        />
        <View style={{width: 40}} />
      </View>
      <FlatList
        data={Array.from({length: 5}).fill(0)}
        ref={flatListRef}
        keyExtractor={(item: any, index: number) => 'step-' + index}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderItem={({item, index}) => {
          return (
            <View style={styles.contentWrapper}>
              {index === 0 && (
                <Step1
                  onNextPress={onNextPress}
                  user={user}
                  setUser={setUser}
                />
              )}
              {index === 1 && (
                <Step2
                  setUser={setUser}
                  user={user}
                  onNextPress={onNextPress}
                />
              )}
              {index === 2 && (
                <Step3
                  user={user}
                  genres={genres}
                  setUser={setUser}
                  onNextPress={onNextPress}
                />
              )}
              {index === 3 && (
                <Step4
                  user={user}
                  setUser={setUser}
                  onNextPress={onNextPress}
                />
              )}
              {index === 4 && (
                <Step5
                  user={user}
                  setUser={setUser}
                  onNextPress={onNextPress}
                />
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SignUpScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnBack: {
      paddingHorizontal: 16,
      height: '100%',
      justifyContent: 'center',
    },
    contentWrapper: {
      flex: 1,
      width: screen_width,
      backgroundColor: colors.background,
    },
    progressBar: {
      width: screen_width * 0.5,
      height: 10,
      borderRadius: 10,
    },
    headerWrapper: {
      height: screen_height * 0.1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container: {
      width: screen_width,
      height: screen_height,
      flex: 1,
      backgroundColor: colors.background,
    },
  });
