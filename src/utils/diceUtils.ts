import {Float3} from 'react-native-filament';

export const getDiceNumber = () => Math.floor(Math.random() * 6) + 1;

interface Rotation {
  angleRad: number;
  axis: Float3;
}

// const diceRotations_v0: Record<number, Rotation> = {
//   1: {angleRad: 0, axis: [0, 1, 0]}, // Face 1 Up (No rotation)
//   3: {angleRad: Math.PI / 2, axis: [1, 0, 0]}, // Face 2 Up (Rotate 90° around X-axis)
//   2: {angleRad: -Math.PI / 2, axis: [0, 1, 0]}, // Face 3 Up (Rotate -90° around Y-axis)
//   5: {angleRad: Math.PI / 2, axis: [0, 1, 0]}, // Face 4 Up (Rotate 90° around Y-axis)
//   4: {angleRad: -Math.PI / 2, axis: [1, 0, 0]}, // Face 5 Up (Rotate -90° around X-axis)
//   6: {angleRad: Math.PI, axis: [1, 0, 0]}, // Face 6 Up (Rotate 180° around X-axis)
// };

// const diceRotations_v1: Record<number, Rotation> = {
//   1: {angleRad: Math.PI, axis: [0, 1, 0]}, // Face 1 Up (Rotate 180° around Y-axis)
//   2: {angleRad: -Math.PI / 2, axis: [1, 0, 0]}, // Face 2 Up (Rotate -90° around X-axis)
//   3: {angleRad: Math.PI / 2, axis: [1, 0, 0]}, // Face 3 Up (Rotate 90° around X-axis) -- Correct
//   4: {angleRad: -Math.PI / 2, axis: [1, 0, 0]}, // Face 4 Up (Rotate -90° around X-axis) -- Correct
//   5: {angleRad: Math.PI / 2, axis: [0, 1, 0]}, // Face 5 Up (Rotate 90° around Y-axis)
//   6: {angleRad: Math.PI, axis: [1, 0, 0]}, // Face 6 Up (Rotate 180° around X-axis) -- Correct
// };

export const diceRotations: Record<number, Rotation> = {
  1: {angleRad: Math.PI, axis: [0, 1, 0]}, // Face 1 Up (Rotate 180° around Y-axis)
  2: {angleRad: Math.PI / 2, axis: [0, 0, 1]}, // Face 2 Up (Rotate 90° around Z-axis)
  3: {angleRad: Math.PI / 2, axis: [1, 0, 0]}, // Face 3 Up (Rotate 90° around X-axis) -- Correct
  4: {angleRad: -Math.PI / 2, axis: [1, 0, 0]}, // Face 4 Up (Rotate -90° around X-axis) -- Correct
  5: {angleRad: -Math.PI / 2, axis: [0, 0, 1]}, // Face 5 Up (Rotate -90° around Z-axis)
  6: {angleRad: Math.PI, axis: [1, 0, 0]}, // Face 6 Up (Rotate 180° around X-axis) -- Correct
};
