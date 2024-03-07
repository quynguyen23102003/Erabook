import {Text, TouchableOpacity, View} from 'react-native';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import React, {memo} from 'react';
import {useAppTheme} from '@themes/theme.config';
import {useStyles} from '@screens/Detail/DetailScreen';
import {useTranslation} from 'react-i18next';
import {OcticonsIcons} from '@utils/utils';

interface ReviewBoxProps {
  defaultRating: number | undefined;
  onChangeRating: (newRating: number) => void;
  onWriteReviewPress: () => void;
}
const ReviewBox: React.FC<ReviewBoxProps> = ({
  defaultRating = 0,
  onChangeRating,
  onWriteReviewPress,
}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);

  return (
    <View style={{}}>
      <Text style={styles.txtRate}>
        {translate(OtherTranslationKey.RatethisEbook)}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          paddingTop: 15,
        }}>
        {Array.from({length: 5}).map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => onChangeRating(index + 1)}
              activeOpacity={0.5}
              key={'star' + index}>
              {defaultRating !== 0 && index + 1 <= defaultRating ? (
                <OcticonsIcons name="star-fill" color={'#F89300'} size={35} />
              ) : (
                <OcticonsIcons name="star" color={colors.text} size={35} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
        }}>
        <TouchableOpacity onPress={onWriteReviewPress} style={styles.btnReview}>
          <Text style={styles.txtReview}>
            {translate(OtherTranslationKey.WriteaReview)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ReviewBox);
