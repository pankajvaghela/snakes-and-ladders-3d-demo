/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {GameBoardScene} from '../components/GameBoardScene';

export function HomeScreen() {
  return (
    <View style={{flex: 1}}>
      <GameBoardScene />
    </View>
  );
}
