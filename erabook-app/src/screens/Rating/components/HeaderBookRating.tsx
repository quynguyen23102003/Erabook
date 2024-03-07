import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Popins} from '../../../components/popins';

interface HeaderProps {
  title: string;
}

const HeaderBookRating: React.FC<HeaderProps> = ({title}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  headerText: {
    color: '#192e51',
    fontFamily: Popins[700],
    fontSize: 24,
    textAlign: 'center',
  },
});

export default HeaderBookRating;
