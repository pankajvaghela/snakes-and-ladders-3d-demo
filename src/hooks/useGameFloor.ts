import {
  DiscreteDynamicWorld,
  useRigidBody,
  useStaticPlaneShape,
} from 'react-native-filament';

export const useGameFloor = (world: DiscreteDynamicWorld) => {
  // Create an invisible floor:
  const floorShape = useStaticPlaneShape(0, 1, 0, 0);
  useRigidBody({
    mass: 0,
    origin: [0, 0, 0],
    friction: 100,
    shape: floorShape,
    world,
    id: 'floor',
  });
};
