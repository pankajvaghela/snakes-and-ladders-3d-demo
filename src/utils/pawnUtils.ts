import {Float3} from 'react-native-filament';

// Function to generate coordinates for a specific position on the Snakes and Ladders board
export const getCoordinateForPosition = (position: number): Float3 => {
  // Ensure the position is valid (1 to 100)
  if (position < 1 || position > 100) {
    return [12, -2.5, 10]; // Return null if the position is out of bounds
  }

  const y = -2.5; // Y-coordinate is constant
  const xStart = 9; // X-coordinate starts from 9
  const zStep = 2; // Z-coordinate changes by 2 units per position

  const row = Math.floor((position - 1) / 10); // Row index (0-based)
  const positionInRow = (position - 1) % 10; // Position within the row (0 to 9)

  const x = xStart - row * 2; // X-coordinate decreases by 2 for each row

  // Calculate Z-coordinate: alternate direction depending on row parity
  const z =
    row % 2 === 0
      ? 9 - positionInRow * zStep // Left to right for even rows
      : -9 + positionInRow * zStep; // Right to left for odd rows

  return [x, y, z];
};
