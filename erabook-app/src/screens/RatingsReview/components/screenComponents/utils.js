import {ScrollView} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {AppThemeColors} from '../../../../themes/theme.config';
import moment from 'moment';

export const formatTimestamp = timestamp => {
  return moment(timestamp).fromNow();

  const regex = /(\d+)\s(\w+)\sago/;
  const match = timestamp.match(regex);

  if (match) {
    const time = parseInt(match[1]);
    const unit = match[2];

    if (unit === 'minutes') {
      return `${time}months ago`;
    } else if (unit === 'hours') {
      return `${time} hours ago`;
    } else if (unit === 'days') {
      return `${time}days ago`;
    }
  }
  return timestamp;
};

export const scrollToButton = (
  scrollViewRef,
  buttonsData,
  buttonWidth,
  setSelectedButton,
  buttonText,
) => {
  // if (scrollViewRef.current) {
  //     const buttonIndex = buttonsData.findIndex(item => item.text === buttonText);
  //     if (buttonIndex !== -1) {
  //         const x = buttonIndex * buttonWidth;
  //         scrollViewRef.current.scrollTo({ x, y: 0, animated: true });
  //         setSelectedButton(buttonText);
  //     }
  // }
};

export const handlePressButton = (buttonText: string) => {
  setSelectedButton(buttonText);
  // Chuyển đến mục đã chọn trong ScrollView
  scrollToButton(buttonText);
};
