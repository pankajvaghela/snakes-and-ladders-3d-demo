import React, {useCallback} from 'react';
import {
  FilamentScene,
  FilamentView,
  Model,
  Camera,
  useWorld,
  RenderCallback,
  useFilamentContext,
} from 'react-native-filament';
import {View} from 'react-native';
import {GameBoard} from '../assets/models';
import {SceneLight} from './core/SceneLight';
import {useDice} from '../hooks/useDice';
import {useGameFloor} from '../hooks/useGameFloor';

const GameBoardSceneRenderer = () => {
  const world = useWorld(0, -9.8, 0);

  const {transformManager} = useFilamentContext();

  useGameFloor(world);

  const {diceMeshEntity, diceRigidBody} = useDice(world);

  const renderCallback: RenderCallback = useCallback(
    ({timeSinceLastFrame}) => {
      'worklet';

      // Update our entity:
      // This updates the world at 60Hz/60 FPS. If our actual frame rate
      // is different stepSimulation will interpolate the physics.
      world.stepSimulation(timeSinceLastFrame, 1, 1 / 60);

      if (diceMeshEntity && diceRigidBody) {
        transformManager.updateTransformByRigidBody(
          diceMeshEntity,
          diceRigidBody,
        );
      }
    },
    [diceMeshEntity, diceRigidBody, transformManager, world],
  );

  return (
    <FilamentView style={{flex: 1}} renderCallback={renderCallback}>
      {/* 🏞️ A view to draw the 3D content to */}

      {/* 💡 A light source, otherwise the scene will be black */}
      <SceneLight />

      <Model
        source={GameBoard}
        rotate={[0, 0, 0]}
        scale={[1, 1, 1]}
        translate={[0, -0.5, 0]}
      />

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
