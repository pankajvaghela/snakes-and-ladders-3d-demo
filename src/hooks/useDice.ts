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

export const useDice = (world: DiscreteDynamicWorld) => {
  const diceModel = useModel(Dice2);

  const {transformManager} = useFilamentContext();

  const [diceBoundingBox, diceModelEntity] = useGetModelData(diceModel);

  const [diceMeshEntity, diceMeshTransform] = React.useMemo(() => {
    const entity = diceModelEntity;
    if (entity == null || diceBoundingBox == null) {
      return [];
    }

    transformManager.setEntityPosition(entity, [3, 15, 0.0], false);
    transformManager.setEntityScale(entity, [0.5, 0.5, 0.5], true);

    const transform = transformManager.getTransform(entity);

    return [entity, transform] as const;
  }, [diceBoundingBox, diceModelEntity, transformManager]);

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
