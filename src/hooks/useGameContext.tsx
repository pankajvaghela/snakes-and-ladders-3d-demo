import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';

// Define player type
export interface Player {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  position: number;
}

// Define the context type
interface GameContextType {
  players: Player[];
  diceRoll: number | null;
  currentPlayer: number;
  gameStarted: boolean;
  rollDice: () => void;
  addPlayer: (name: string, color: Player['color']) => void;
  startGame: () => void;
  resetGame: () => void;
  restartGame: () => void;
  onGameFinish?: (winner: Player) => void; // Callback for when a player wins
  addEventListener: (event: string, listener: Function) => () => void;
  removeEventListener: (event: string, listener: Function) => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Define the provider's props type
interface GameProviderProps {
  children: ReactNode;
  onGameFinish?: (winner: Player) => void; // Add the callback prop here
}

// Constant to toggle killing functionality
const ENABLE_KILLING_RULE = true;
const WINNING_POSITION = 100;

// Ladders start and end arrays
const laddersStarts = [4, 8, 13, 33, 42, 50, 62, 67, 74];
const laddersEnds = [25, 29, 46, 49, 63, 69, 81, 86, 92];

// Snakes start and end arrays
const snakesStarts = [27, 40, 43, 54, 76, 89, 95];
const snakesEnds = [5, 3, 18, 31, 58, 53, 99];

// Provide the context
export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  onGameFinish,
}) => {
  const [players, setPlayers] = useState<Player[]>([
    {name: 'Red', color: 'red', position: 0},
    {name: 'Blue', color: 'blue', position: 0},
  ]);

  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const [listeners, setListeners] = useState<{[key: string]: Function[]}>({});

  const removeEventListener = useCallback(
    (event: string, listener: Function) => {
      setListeners(prevListeners => ({
        ...prevListeners,
        [event]: (prevListeners[event] || []).filter(l => l !== listener),
      }));
    },
    [],
  );

  const addEventListener = useCallback(
    (event: string, listener: Function) => {
      setListeners(prevListeners => ({
        ...prevListeners,
        [event]: [...(prevListeners[event] || []), listener],
      }));

      return () => {
        removeEventListener(event, listener);
      };
    },
    [removeEventListener],
  );

  // Trigger the event when the game finishes
  const triggerEvent = (event: string, data: any) => {
    (listeners[event] || []).forEach(listener => listener(data));
  };

  // Roll dice function
  const rollDice = () => {
    if (!gameStarted) return;

    // const roll = 2 + Math.random() * 0.1;
    const roll = Math.floor(Math.random() * 6) + 1 + Math.random() * 0.1;
    console.log('🚀 ~ rollDice ~ roll:', roll);
    setDiceRoll(roll);
    movePlayer(currentPlayer, Math.floor(roll));
  };

  // Check if the player lands on a snake or ladder, with delay
  const checkSnakeOrLadder = (position: number): Promise<number> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Check for ladders
        const ladderIndex = laddersStarts.indexOf(position);
        if (ladderIndex !== -1) {
          resolve(laddersEnds[ladderIndex]); // Move to the ladder's end
          return;
        }

        // Check for snakes
        const snakeIndex = snakesStarts.indexOf(position);
        if (snakeIndex !== -1) {
          resolve(snakesEnds[snakeIndex]); // Move to the snake's end
          return;
        }

        // No snake or ladder, return the original position
        resolve(position);
      }, 1000); // Wait for 1 second (1000ms)
    });
  };

  // Move player based on dice roll, with delay for snake or ladder
  const movePlayer = async (playerIndex: number, roll: number) => {
    let newPosition = players[playerIndex].position + roll;

    // Ensure new position doesn't exceed the winning position
    if (newPosition > WINNING_POSITION) {
      newPosition = players[playerIndex].position;
    }

    // Temporarily update to the new position (before checking snake or ladder)
    setPlayers(prevPlayers =>
      prevPlayers.map((player, index) =>
        index === playerIndex ? {...player, position: newPosition} : player,
      ),
    );

    // Wait for 1 second and then check for snake or ladder
    const finalPosition = await checkSnakeOrLadder(newPosition);

    // Handle killing other player's pawn if the feature is enabled
    if (ENABLE_KILLING_RULE) {
      handleKillPlayer(finalPosition, playerIndex);
    }

    // Update the player's position again after the delay
    setPlayers(prevPlayers =>
      prevPlayers.map((player, index) =>
        index === playerIndex ? {...player, position: finalPosition} : player,
      ),
    );

    // Check if the current player has won the game
    if (finalPosition === WINNING_POSITION) {
      onGameFinish?.(players[playerIndex]); // Trigger the game finish callback
      triggerEvent('game_finish', {player: players[playerIndex]});
      return;
    }

    // Set next player's turn after moving
    setCurrentPlayer((playerIndex + 1) % players.length);
  };

  // Function to handle killing other players if they are on the same position
  const handleKillPlayer = (
    newPosition: number,
    currentPlayerIndex: number,
  ) => {
    setPlayers(prevPlayers =>
      prevPlayers.map((player, index) => {
        // If another player is on the same spot and it's not the current player, reset their position
        if (index !== currentPlayerIndex && player.position === newPosition) {
          triggerEvent('player_killed', {
            player: player,
            by: players[currentPlayerIndex],
          });
          return {...player, position: 0};
        }
        return player;
      }),
    );
  };

  // Add more players (up to 4)
  const addPlayer = (name: string, color: Player['color']) => {
    if (players.length < 4) {
      setPlayers([...players, {name, color, position: 0}]);
    }
  };

  // Start game function
  const startGame = () => {
    setGameStarted(true);
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({...player, position: 0})),
    );
  };

  // Reset game (all players back to starting position, but game remains started)
  const resetGame = () => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({...player, position: 0})),
    );
  };

  // Restart game (reset everything and start the game fresh)
  const restartGame = () => {
    setGameStarted(false);
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({...player, position: 0})),
    );
    setCurrentPlayer(0);
    setDiceRoll(null);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        diceRoll,
        currentPlayer,
        gameStarted,
        rollDice,
        addPlayer,
        startGame,
        resetGame,
        restartGame,
        onGameFinish,
        addEventListener,
        removeEventListener,
      }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for easier context access
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
