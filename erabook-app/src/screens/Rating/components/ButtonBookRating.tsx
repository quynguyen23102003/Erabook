import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { Popins } from '../../../components/popins';

interface ButtonsProps {
  onCancelPress: () => void;
  onSubmitPress: () => void;
}

const ButtonRating: React.FC<ButtonsProps> = ({onCancelPress, onSubmitPress}) => {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancelPress}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.submitButton]}
        onPress={onSubmitPress}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 50,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffdbac',
  },
  submitButton: {
    backgroundColor: '#ff781f',
  },
  buttonText: {
    color: 'white',
    fontFamily: Popins[700],
    fontSize: 14,
  },
});

export default ButtonRating;
;
