import React, {useCallback, useEffect} from 'react';
import {
  FilamentScene,
  FilamentView,
  Model,
  Camera,
  useWorld,
  RenderCallback,
  useFilamentContext,
} from 'react-native-filament';
import {Text, View} from 'react-native';
import {GameBoard} from '../assets/models';
import {SceneLight} from './core/SceneLight';
import {useDice} from '../hooks/useDice';
import {useGameFloor} from '../hooks/useGameFloor';
import {GameProvider, Player, useGameContext} from '../hooks/useGameContext';

const GameBoardSceneRenderer = () => {
  const world = useWorld(0, -9.8, 0);

  const {transformManager} = useFilamentContext();

  useGameFloor(world);

  const {diceRoll, rollDice, gameStarted, startGame, addEventListener} =
    useGameContext();

  useEffect(() => {
    if (!gameStarted) {
      startGame();
    }
  }, [gameStarted, startGame]);

  useEffect(() => {
    const playerKillListener = addEventListener(
      'player_killed',
      ({player, by}: {player: Player; by: Player}) => {
        console.log(
          `🚀 ~ player_killed ~ ${player.name} by ${by.name} at ${by.position}`,
        );
      },
    );
    const gameFinishListener = addEventListener(
      'game_finish',
      ({player}: {player: Player}) => {
        console.log(`🚀 ~ game_finish ~ Winner: ${player.name}`);
      },
    );

    return () => {
      playerKillListener();
      gameFinishListener();
    };
  }, [addEventListener]);

  const {diceMeshEntity, diceRigidBody} = useDice({
    world,
    diceFaceNumber: diceRoll ?? 6,
  });

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

      <Text
        style={{fontSize: 32, position: 'absolute', bottom: 20, right: 20}}
        onPress={rollDice}>
        Roll Dice
      </Text>
    </FilamentView>
  );
};

export const GameBoardScene = () => {
  return (
    <View style={{flex: 1}}>
      <GameProvider>
        <FilamentScene>
          {/* Separate parent wrapper so that we have the context in child components */}
          <GameBoardSceneRenderer />
        </FilamentScene>
      </GameProvider>
    </View>
  );
};
