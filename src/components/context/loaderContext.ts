import { createContext, useContext } from 'react';
import * as THREE from 'three';

export const LoaderContext = createContext<THREE.LoadingManager>(
  THREE.DefaultLoadingManager,
);

export function useLoaderManager() {
  return useContext(LoaderContext);
}
