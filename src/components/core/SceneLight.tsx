import React from 'react';
import {EnvironmentalLight} from './EnvironmentalLight';
import {Light} from 'react-native-filament';

export const SceneLight = () => {
  return (
    <>
      <EnvironmentalLight source={{uri: 'RNF_default_env_ibl.ktx'}} />
      <Light
        type="directional"
        intensity={10_000}
        colorKelvin={6_500}
        castShadows={true}
      />
    </>
  );
};
