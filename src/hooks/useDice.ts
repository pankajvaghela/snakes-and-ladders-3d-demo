import {
  DiscreteDynamicWorld,
  useBoxShape,
  useFilamentContext,
  useModel,
  useRigidBody,
} from 'react-native-filament';
import {Dice2} from '../assets/models';
import {useGetModelData} from './useGetModelData';
import React from 'react';
import {diceRotations} from '../utils/diceUtils';

export const useDice = (params: {
  world: DiscreteDynamicWorld;
  diceFaceNumber?: number;
}) => {
  const {world, diceFaceNumber = 2} = params;

  const diceModel = useModel(Dice2);

  const {transformManager} = useFilamentContext();

  const [diceBoundingBox, diceModelEntity] = useGetModelData(diceModel);

  const [diceMeshEntity, diceMeshTransform] = React.useMemo(() => {
    const entity = diceModelEntity;
    if (entity == null || diceBoundingBox == null) {
      return [];
    }

    const rotation = diceRotations[Math.floor(diceFaceNumber)];

    transformManager.setEntityRotation(
      entity,
      rotation.angleRad,
      rotation.axis,
      false,
    );

    transformManager.setEntityPosition(entity, [3, 12, 0.0], true);

    transformManager.setEntityScale(entity, [0.5, 0.5, 0.5], true);

    const transform = transformManager.getTransform(entity);

    return [entity, transform] as const;
  }, [diceBoundingBox, diceFaceNumber, diceModelEntity, transformManager]);

  const diceShape = useBoxShape(
    diceBoundingBox == null ? 0 : diceBoundingBox.halfExtent[0],
    diceBoundingBox == null ? 0 : diceBoundingBox.halfExtent[1],
    diceBoundingBox == null ? 0 : diceBoundingBox.halfExtent[2],
  );

  const diceRigidBody = useRigidBody(
    diceShape == null || diceMeshTransform == null
      ? undefined
      : {
          mass: 1,
          transform: diceMeshTransform,
          shape: diceShape,
          friction: 1,
          damping: [0.0, 0.0],
          activationState: 'disable_deactivation',
          world: world,
          id: 'dice',
          // collisionCallback: collisionCallback,
        },
  );

  return {diceMeshEntity, diceRigidBody};
};
