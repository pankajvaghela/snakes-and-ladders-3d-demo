import {
  DiscreteDynamicWorld,
  useBoxShape,
  useFilamentContext,
  useModel,
  useRigidBody,
} from 'react-native-filament';
import {PawnAssets} from '../assets/models';
import {Player} from './useGameContext';
import {useGetModelData} from './useGetModelData';
import React from 'react';
import {getCoordinateForPosition} from '../utils/pawnUtils';

export const usePawn = (params: {
  world: DiscreteDynamicWorld;
  color: Player['color'];
  position: number;
}) => {
  const {world, color, position} = params;

  const pawnModel = useModel(PawnAssets[color]);

  const {transformManager} = useFilamentContext();

  const [pawnBoundingBox, pawnModelEntity] = useGetModelData(pawnModel);

  const [pawnMeshEntity, pawnMeshTransform] = React.useMemo(() => {
    const entity = pawnModelEntity;
    if (entity == null || pawnBoundingBox == null) {
      return [];
    }

    transformManager.transformToUnitCube(entity, pawnBoundingBox);
    transformManager.setEntityPosition(
      entity,
      getCoordinateForPosition(position),
      true,
    );
    // transformManager.setEntityPosition(entity, [-9, -2.5, -9], true);
    transformManager.setEntityScale(entity, [0.1, 0.1, 0.1], true);

    const transform = transformManager.getTransform(entity);

    return [entity, transform] as const;
  }, [pawnBoundingBox, pawnModelEntity, position, transformManager]);

  const pawnShape = useBoxShape(
    pawnBoundingBox == null ? 0 : pawnBoundingBox.halfExtent[0],
    pawnBoundingBox == null ? 0 : pawnBoundingBox.halfExtent[1],
    pawnBoundingBox == null ? 0 : pawnBoundingBox.halfExtent[2],
  );

  const pawnRigidBody = useRigidBody(
    pawnShape == null || pawnMeshTransform == null
      ? undefined
      : {
          mass: 0,
          transform: pawnMeshTransform,
          shape: pawnShape,
          friction: 1,
          damping: [0.0, 0.0],
          activationState: 'disable_deactivation',
          world: world,
          id: 'pawn',
          // collisionCallback: collisionCallback,
        },
  );

  return {pawnMeshEntity, pawnRigidBody};
};
