import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '../../../themes/theme.config';
import {Popins} from '../../../components/popins';
import {Divider, RadioButton} from 'react-native-paper';
import {ButtonText} from '../../../components';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  Step1ScreenTranslationKey,
} from '../../../translations/constants';

export interface StepProps {
  onNextPress: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<{}>>;
}
enum UserGender {
  Men = 'Nam',
  Women = 'Nữ',
  Other = 'Khác',
}

const Step1: React.FC<StepProps> = ({onNextPress, setUser, user}) => {
  const {t} = useTranslation(RoutesTranslationKey.step1Route);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const [checked, setChecked] = React.useState('male');
  const onBtnNextPress = () => {
    const gender =
      checked === 'male'
        ? UserGender.Men
        : checked === 'female'
        ? UserGender.Women
        : UserGender.Other;
    setUser({...user, gender});
    onNextPress();
  };
  return (
    <View style={{flex: 1, padding: 16, backgroundColor: colors.background}}>
      <Text style={styles.headline}>
        {t(Step1ScreenTranslationKey.whatGender)}
      </Text>
      <Text style={styles.subtitle}>
        {t(Step1ScreenTranslationKey.selectContent)}
      </Text>
      {/* male */}
      <View>
        <TouchableOpacity
          onPress={() => setChecked('male')}
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
          <RadioButton
            value="male"
            uncheckedColor={colors.primary}
            status={checked === 'male' ? 'checked' : 'unchecked'}
          />
          <Text style={styles.subtitle}>
            {t(Step1ScreenTranslationKey.male)}
          </Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />
        {/* female */}
        <TouchableOpacity
          onPress={() => setChecked('female')}
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
          <RadioButton
            uncheckedColor={colors.primary}
            value="female"
            status={checked === 'female' ? 'checked' : 'unchecked'}
          />
          <Text style={styles.subtitle}>
            {t(Step1ScreenTranslationKey.female)}
          </Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        {/* undefined */}
        <TouchableOpacity
          onPress={() => setChecked('undefined')}
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
          <RadioButton
            uncheckedColor={colors.primary}
            value="undefined"
            status={checked === 'undefined' ? 'checked' : 'unchecked'}
          />
          <Text style={styles.subtitle}>
            {t(Step1ScreenTranslationKey.dontKnow)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Divider />
        <ButtonText
          onPress={onBtnNextPress}
          labelStyle={{color: 'white'}}
          label={t(Step1ScreenTranslationKey.continue)}
          containerStyle={styles.btnNext}
        />
      </View>
    </View>
  );
};

export default Step1;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnNext: {
      margin: 16,
      backgroundColor: colors.primary,
    },
    headline: {
      color: colors.text,
      fontFamily: Popins['600'],
      fontSize: 22,
    },
    subtitle: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['400'],
    },
    horizontalLine: {
      width: '100%',
      height: 1,
      backgroundColor: colors.border,
      marginTop: 16,
    },
  });
