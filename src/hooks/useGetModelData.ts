import React from 'react';
import {FilamentModel} from 'react-native-filament';

export const useGetModelData = (model: FilamentModel) => {
  return React.useMemo(() => {
    if (model.state !== 'loaded') {
      return [];
    }

    return [model.boundingBox, model.rootEntity] as const;
  }, [model]);
};
