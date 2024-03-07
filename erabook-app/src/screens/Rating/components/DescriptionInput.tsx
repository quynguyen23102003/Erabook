import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import { Popins } from '../../../components/popins';

const DescriptionInput = () => {
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionText}>
        Describe Your Experience (Optional)
      </Text>
      <TextInput style={styles.ratingInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    marginTop: 30,
  },
  descriptionText: {
    color: '#192e51',
    fontFamily: Popins[500],
    fontSize: 14,
  },
  ratingInput: {
    borderBottomWidth: 5,
    borderBottomColor: '#e6cc00',
  },
});

export default DescriptionInput;
