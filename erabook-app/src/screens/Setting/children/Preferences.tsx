import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Popins} from '../../../components/popins';
import {SwitchNotification} from '../components/SwitchNotification';
import {RightNotification} from '../components/RightNotification';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  AccountScreenTranslationKey,
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import HeaderComponents from '../components/HeaderComponents';
import Share from 'react-native-share';

const Preferences: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  const {t: translate1} = useTranslation(RoutesTranslationKey.accountRoute);

    const shareContent = async () => {
  try {
    const shareOptions = {
      message: 'Check out this amazing app!',
      // Add any other share options if needed
    };
    const result = await Share.open(shareOptions);
    console.log(result);
  } catch (error: any) {
    console.error('Error sharing:', error.message);
  }
};
const handleSocialShare = () => {
    shareContent();
  };

  return (
    <View style={[styles.container]}>
      <HeaderComponents
        title={translate1(AccountScreenTranslationKey.Preferences)}
      />
      <View style={{paddingHorizontal: 16}}>
        <View>
          <Text style={styles.txtContent}>
            {translate(OtherTranslationKey.General)}
          </Text>
          <SwitchNotification
            title={translate(OtherTranslationKey.DownloadOverWiFiOnly)}
          />
          <RightNotification
            title={translate(OtherTranslationKey.ClearCache)}
            content=""
          />
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.backgroundCategory,
          }}>
          <Text style={styles.txtContent}>
            {translate(OtherTranslationKey.Reading)}
          </Text>
          <SwitchNotification
            title={translate(OtherTranslationKey.AutoRotateScreen)}
          />
          <SwitchNotification
            title={translate(OtherTranslationKey.Use3DEffectforPageTurning)}
          />
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.backgroundCategory,
          }}>
          <Text style={styles.txtContent}>
            {translate(OtherTranslationKey.Audiobook)}
          </Text>
          <RightNotification
            title={translate(OtherTranslationKey.AudioQuality)}
            content={translate(OtherTranslationKey.Standard)}
          />
          <SwitchNotification
            title={translate(OtherTranslationKey.AutomaticallyDownloadAudio)}
          />
          <TouchableOpacity onPress={handleSocialShare}>
            <RightNotification
              title={translate(OtherTranslationKey.ShareApp)}
              content=""
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


export default Preferences;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    txtContent: {
      fontFamily: Popins[600],
      color: colors.text,
      fontSize: 16,
      paddingVertical: 25,
    },
  });