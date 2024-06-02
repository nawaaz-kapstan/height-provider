import { createContext, useContext } from 'react';

export type HeightProviderContextType = {
  id?: string;
  totalHeight: number;
  consumedHeight: number;
  availableHeight: number;
  heights: Record<string, number>;
  registerHeight: (id: string, height: number) => void;
  unregisterHeight: (id: string) => void;
};

export const HeightProviderContext = createContext<HeightProviderContextType>({
  totalHeight: window.innerHeight,
  consumedHeight: 0,
  availableHeight: 0,
  heights: {},
  registerHeight: () => {
    //
  },
  unregisterHeight: () => {
    //
  },
});

export const HeightProviderContextProvider = HeightProviderContext.Provider;

export const useHeightProvider = () => useContext(HeightProviderContext);
