import {ListRenderItem, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {AppThemeColors, useAppTheme} from '../../../themes/theme.config';
import {Popins} from '../../../components/popins';
import {ButtonText} from '../../../components';
import {Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  Step3ScreenTranslationKey,
} from '../../../translations/constants';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {StepProps} from './Step1';
import {GenreSignUp} from '../SignUpScreen';

interface Step3Props extends StepProps {
  genres: GenreSignUp[];
}
const Step3: React.FC<Step3Props> = ({onNextPress, genres, setUser, user}) => {
  const [selectedGenre, setSelectedGenre] = useState(new Set<string>());
  const {t} = useTranslation(RoutesTranslationKey.step3Route);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);

  const onGenrePress = useCallback(
    (item: string) => {
      const newSelectedGenre = new Set(selectedGenre);
      if (selectedGenre.has(item)) {
        newSelectedGenre.delete(item);
      } else {
        newSelectedGenre.add(item);
      }
      setSelectedGenre(newSelectedGenre);
    },
    [selectedGenre],
  );

  const onContinuePress = () => {
    setUser({...user, preferredGenres: [...selectedGenre]});
    onNextPress();
  };

  const handleContinueBottomColor = useCallback(() => {
    if (selectedGenre.size >= 3) {
      return colors.primary;
    } else {
      return colors.border;
    }
  }, [colors.border, colors.primary, selectedGenre.size]);

  const renderItem: ListRenderItem<GenreSignUp> = useCallback(
    ({item}) => {
      return (
        <ButtonText
          activeOpacity={0.6}
          onPress={() => onGenrePress(item._id)}
          label={item.name}
          containerStyle={[
            styles.btnAge,
            selectedGenre.has(item._id) && {backgroundColor: colors.primary},
          ]}
          labelStyle={
            selectedGenre.has(item._id)
              ? {color: '#fff'}
              : {color: colors.primary}
          }
        />
      );
    },
    [colors.primary, onGenrePress, selectedGenre, styles.btnAge],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.headline}>
            {t(Step3ScreenTranslationKey.chooseTheBook)}
          </Text>
          <Text style={styles.subtitle}>
            {t(Step3ScreenTranslationKey.selectThePreferred)}
          </Text>
        </View>
        <FlatList
          data={genres}
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={styles.ageWrapper}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 32}}
        />
      </ScrollView>
      <View>
        <Divider />
        <View style={{flexDirection: 'row', padding: 16, gap: 16}}>
          <ButtonText
            onPress={() => onNextPress()}
            labelStyle={{color: colors.textSecondary}}
            label={t(Step3ScreenTranslationKey.skip)}
            containerStyle={styles.btnSkip}
            style={{flex: 0.5}}
          />
          <ButtonText
            disabled={selectedGenre.size < 3}
            onPress={() => onContinuePress()}
            labelStyle={{color: 'white'}}
            label={t(Step3ScreenTranslationKey.continue)}
            style={styles.btnContinue}
            containerStyle={[{backgroundColor: handleContinueBottomColor()}]}
          />
        </View>
      </View>
      {/*<Portal>*/}
      {/*  <Dialog*/}
      {/*    theme={{ colors: { primary: colors.background } }}*/}
      {/*    visible={visible}*/}
      {/*    onDismiss={hideDialog}>*/}
      {/*    <Dialog.Title style={{ fontFamily: Popins["600"], color: colors.text }}>*/}
      {/*      {t(Step3ScreenTranslationKey.alert)}*/}
      {/*    </Dialog.Title>*/}
      {/*    <Dialog.Content>*/}
      {/*      <Text style={{ fontSize: 16, fontFamily: Popins["400"] }}>*/}
      {/*        {t(Step3ScreenTranslationKey.pleaseSelect)}*/}
      {/*      </Text>*/}
      {/*    </Dialog.Content>*/}
      {/*    <Dialog.Actions>*/}
      {/*      <TouchableOpacity onPress={hideDialog}>*/}
      {/*        <Text style={styles.ok}>OK</Text>*/}
      {/*      </TouchableOpacity>*/}
      {/*    </Dialog.Actions>*/}
      {/*  </Dialog>*/}
      {/*</Portal>*/}
    </View>
  );
};

export default Step3;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnContinue: {
      flex: 0.5,
    },
    btnSkip: {
      backgroundColor: colors.secondary,
    },
    ok: {
      fontSize: 16,
      fontFamily: Popins['600'],
      color: colors.primary,
    },
    headline: {
      color: colors.text,
      fontFamily: Popins['600'],
      fontSize: 22,
      paddingHorizontal: 16,
    },
    subtitle: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['400'],
      paddingHorizontal: 16,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    btnAge: {
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    ageWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginTop: 16,
    },
  });
