import React from 'react';
import {
  FilamentScene,
  FilamentView,
  Model,
  Camera,
} from 'react-native-filament';
import {View} from 'react-native';
import {GameBoard} from '../assets/models';
import {SceneLight} from './core/SceneLight';

const GameBoardSceneRenderer = () => {
  return (
    <FilamentView style={{flex: 1}}>
      {/* 🏞️ A view to draw the 3D content to */}

      {/* 💡 A light source, otherwise the scene will be black */}
      <SceneLight />

      <Model source={GameBoard} rotate={[0, 0, 0]} scale={[1, 1, 1]} />

      {/* 📹 A camera through which the scene is observed and projected onto the view */}
      {/* <Camera /> */}
      {/* <Camera cameraTarget={[0.5, 0.5, 0]} cameraPosition={[7.5, 0, 0]} /> */}
      {<Camera cameraTarget={[0.5, 0.5, 0]} cameraPosition={[1.5, 5, 0]} />}
    </FilamentView>
  );
};

export const GameBoardScene = () => {
  return (
    <View style={{flex: 1}}>
      <FilamentScene>
        {/* Separate parent wrapper so that we have the context in child components */}
        <GameBoardSceneRenderer />
      </FilamentScene>
    </View>
  );
};
