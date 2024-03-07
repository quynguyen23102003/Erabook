import React from 'react';
import {View, StyleSheet} from 'react-native';

import HeaderBookRating from './components/HeaderBookRating';
import RatingStars from './components/RatingStars';
import DescriptionInput from './components/DescriptionInput';
import ButtonRating from './components/ButtonBookRating';

const BookRating = () => {
  const handleCancelPress = () => {
    // Xử lý nút hủy
  };

  const handleSubmitPress = () => {
    // Xử lý submit ở đây
  };
  const rating = 3;

  return (
    <View style={styles.container}>
      <HeaderBookRating title="Rate this Ebook" />
      <RatingStars rating={rating} />
      <DescriptionInput />
      <ButtonRating
        onCancelPress={handleCancelPress}
        onSubmitPress={handleSubmitPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
});

export default BookRating;
