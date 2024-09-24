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
import {Alert, StyleSheet, Text, View} from 'react-native';
import {GameBoard} from '../assets/models';
import {SceneLight} from './core/SceneLight';
import {useDice} from '../hooks/useDice';
import {useGameFloor} from '../hooks/useGameFloor';
import {GameProvider, Player, useGameContext} from '../hooks/useGameContext';
import {usePawn} from '../hooks/usePawn';

const GameBoardSceneRenderer = () => {
  const world = useWorld(0, -9.8, 0);

  const {transformManager} = useFilamentContext();

  useGameFloor(world);

  const {
    diceRoll,
    rollDice,
    gameStarted,
    startGame,
    addEventListener,
    players,
    currentPlayer,
    restartGame,
  } = useGameContext();

  const messageRef = React.useRef<string>('');

  const handleDiceRoll = useCallback(() => {
    messageRef.current = '';
    rollDice();
  }, [rollDice]);

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

        messageRef.current = `${player.name} killed by ${by.name} ☠️`;
      },
    );

    const gameFinishListener = addEventListener(
      'game_finish',
      ({player}: {player: Player}) => {
        console.log(`🚀 ~ game_finish ~ Winner: ${player.name}`);

        Alert.alert(
          'Game Over',
          `${player.name} has won the game!`,
          [{text: 'New game', onPress: restartGame}],
          {cancelable: false},
        );
      },
    );
    const snakeOrLadderListener = addEventListener(
      'snake_or_ladder',
      ({isSnake, isLadder}: {isSnake?: boolean; isLadder?: boolean}) => {
        if (isSnake) {
          messageRef.current = 'Eaten by a snake 😢';
        }
        if (isLadder) {
          messageRef.current = 'Climbed up a ladder 🚀';
        }
      },
    );

    return () => {
      playerKillListener();
      gameFinishListener();
      snakeOrLadderListener();
    };
  }, [addEventListener, restartGame]);

  const {diceMeshEntity, diceRigidBody} = useDice({
    world,
    diceFaceNumber: diceRoll ?? 6,
  });

  const player1Pawn = usePawn({
    world,
    color: players[0].color,
    position: players[0].position,
  });

  const player2Pawn = usePawn({
    world,
    color: players[1].color,
    position: players[1].position,
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

      if (player1Pawn.pawnMeshEntity && player1Pawn.pawnRigidBody) {
        transformManager.updateTransformByRigidBody(
          player1Pawn.pawnMeshEntity,
          player1Pawn.pawnRigidBody,
        );
      }

      if (player2Pawn.pawnMeshEntity && player2Pawn.pawnRigidBody) {
        transformManager.updateTransformByRigidBody(
          player2Pawn.pawnMeshEntity,
          player2Pawn.pawnRigidBody,
        );
      }
    },
    [
      player1Pawn,
      player2Pawn,
      diceMeshEntity,
      diceRigidBody,
      transformManager,
      world,
    ],
  );

  const staticContent = (
    <>
      {/* scoreboard view */}
      <View style={styles.scoreBoardView}>
        {players.map((player, index) => {
          const isTurn = currentPlayer === index;
          const playerText = `${player.name}: ${player.position} ${
            isTurn ? '#' : ''
          }`;
          return (
            <Text
              key={index}
              style={{...styles.scoreBoardText, color: player.color}}>
              {playerText}
            </Text>
          );
        })}
      </View>

      <View style={styles.scoreBoardView}>
        <Text style={styles.scoreBoardText}>{messageRef.current}</Text>
      </View>

      {/* roll a dice view */}
      <View style={styles.rollDiceContainer}>
        <Text style={styles.diceText} onPress={handleDiceRoll}>
          {diceRoll && Math.floor(diceRoll)}
        </Text>

        <Text style={styles.diceText} onPress={handleDiceRoll}>
          Roll Dice
        </Text>
      </View>
    </>
  );

  return (
    <FilamentView style={styles.filamentView} renderCallback={renderCallback}>
      {/* 🏞️ A view to draw the 3D content to */}

      {/* 💡 A light source, otherwise the scene will be black */}
      <SceneLight />

      <Model
        source={GameBoard}
        rotate={[0, 0, 0]}
        scale={[1, 1, 1]}
        translate={[0, -0.5, 0]}
        receiveShadow={true}
      />

      {/* 📹 A camera through which the scene is observed and projected onto the view */}
      {/* <Camera /> */}
      {/* <Camera cameraTarget={[0.5, 0.5, 0]} cameraPosition={[7.5, 0, 0]} /> */}
      {<Camera cameraTarget={[0.5, 0.5, 0]} cameraPosition={[1.5, 5, 0]} />}
      {/* {<Camera cameraTarget={[0.5, 0.5, 0]} cameraPosition={[2.5, 4, 0]} />} */}

      {staticContent}
    </FilamentView>
  );
};

export const GameBoardScene = () => {
  return (
    <View style={styles.container}>
      <GameProvider>
        <FilamentScene>
          {/* Separate parent wrapper so that we have the context in child components */}
          <GameBoardSceneRenderer />
        </FilamentScene>
      </GameProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filamentView: {
    flex: 1,
    backgroundColor: '#EEEEFF',
  },
  rollDiceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
  },
  diceText: {
    fontSize: 32,
  },
  scoreBoardView: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  scoreBoardText: {
    fontSize: 26,
  },
});
