import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Popins} from '../../../components/popins';

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({rating}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starName = i <= rating ? 'star' : 'staro';
      stars.push(
        <Icon key={i} name={starName} style={[styles.coloredStar]} size={24} />,
      );
    }
    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>Rating:</Text>
      <View style={styles.ratingStars}>{renderStars()}</View> 
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    marginTop: 40,
  },
  ratingText: {
    color: '#192e51',
    fontFamily: Popins[500],
    fontSize: 14,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  coloredStar: {
    color: '#e6cc00',
  },
});

export default RatingStars;
