import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppThemeColors, useAppTheme} from '../../../themes/theme.config';
import {Popins} from '../../../components/popins';
import {ButtonText} from '../../../components';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  Step2ScreenTranslationKey,
} from '../../../translations/constants';
import {Divider} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import {StepProps} from './Step1';

const AGES = [
  '14 - 17',
  '18 -24',
  '25 - 29',
  '30 - 34',
  '35 - 39',
  '40 - 44',
  '45 - 49',
  '≥50',
];

const {width: screen_width} = Dimensions.get('screen');
const Step2: React.FC<StepProps> = ({onNextPress, setUser, user}) => {
  const {t} = useTranslation(RoutesTranslationKey.step2Route);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const [age, setAge] = useState('25 - 29');
  const onAgePress = (value: string) => {
    setAge(value);
  };

  const onContinuePress = () => {
    const ageObject = convertAgeToObject();
    setUser({...user, ageGroup: ageObject});
    onNextPress();
  };

  const convertAgeToObject = () => {
    let ageObj: {from?: number; to?: number};
    if (age === '≥50') {
      ageObj = {from: 50};
    } else {
      const parts = age.split('-').map(part => part.trim());

      const fromNumber = parseInt(parts[0], 10);
      const toNumber = parseInt(parts[1], 10);

      ageObj = {from: fromNumber, to: toNumber};
    }
    return ageObj;
  };

  const renderSeparator = () => <View style={{height: 12}} />;
  return (
    <View style={{flex: 1, padding: 16, backgroundColor: colors.background}}>
      <Text style={styles.headline}>
        {t(Step2ScreenTranslationKey.chooseAge)}
      </Text>
      <Text style={styles.subtitle}>
        {t(Step2ScreenTranslationKey.selectAge)}
      </Text>

      <View style={styles.ageWrapper}>
        <FlatList
          data={AGES}
          numColumns={2}
          ItemSeparatorComponent={renderSeparator}
          columnWrapperStyle={{gap: 12}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <ButtonText
                onPress={() => onAgePress(item)}
                label={item}
                containerStyle={[
                  styles.btnAge,
                  item === age && {backgroundColor: colors.primary},
                ]}
                labelStyle={{color: item === age ? 'white' : colors.primary}}
              />
            );
          }}
        />
        {/*{AGES.map(item => {*/}
        {/*  const backgroundColor = item === age ? colors.primary : undefined;*/}
        {/*  const textColor = item === age ? 'white' : colors.primary;*/}
        {/*  return (*/}
        {/*    <ButtonText*/}
        {/*      key={item}*/}
        {/*      onPress={() => onAgePress(item)}*/}
        {/*      label={item}*/}
        {/*      buttonStyle={[styles.btnAge, {backgroundColor}]}*/}
        {/*      labelStyle={{color: textColor}}*/}
        {/*    />*/}
        {/*  );*/}
        {/*})}*/}
      </View>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Divider />
        <ButtonText
          onPress={() => onContinuePress()}
          labelStyle={{color: 'white'}}
          label={t(Step2ScreenTranslationKey.continue)}
          containerStyle={styles.btnNext}
        />
      </View>
    </View>
  );
};

export default Step2;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnNext: {
      backgroundColor: colors.primary,
      margin: 16,
    },
    btnAge: {
      borderWidth: 1,
      borderColor: colors.primary,
      // margin: 6,
      width: (screen_width - 32 - 12) / 2,
    },
    ageWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginTop: 16,
    },
    headline: {color: colors.text, fontFamily: Popins['600'], fontSize: 22},
    subtitle: {color: colors.text, fontSize: 16, fontFamily: Popins['400']},
  });
