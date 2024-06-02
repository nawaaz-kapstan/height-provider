import React, { useCallback, useMemo, useState, useContext, useEffect } from 'react';
import { PropsWithChildren } from 'types/common';
import useFeatureFlag from 'hooks/useFeatureFlags';
import Spinner from 'components/Common/Spinner';
import { HeightProviderContext, HeightProviderContextType } from './HeightProvider.context';

export type HeightProviderProps = PropsWithChildren & {
  initialHeight?: number | ((parentContext: HeightProviderContextType) => number);
  id?: string;
};
type Height = HeightProviderContextType['heights'];

export const HeightProviderContextProvider = HeightProviderContext.Provider;

export const useHeightProviderContext = () => {
  const context = useContext(HeightProviderContext);
  if (!context) {
    throw new Error('useHeightProviderContext must be used within a HeightProviderContextProvider');
  }
  return context;
};

function HeightProviderOn({ children, initialHeight, id }: HeightProviderProps) {
  const parentContext = useContext(HeightProviderContext);
  const [heights, setHeights] = useState<Height>({});
  const [consumedHeight, setConsumedHeight] = useState<number>(0);
  const initialHeightValue = useMemo(() => {
    if (typeof initialHeight === 'function') {
      return initialHeight(parentContext);
    }
    return initialHeight;
  }, [initialHeight, parentContext.availableHeight]);
  const totalHeight = initialHeightValue || parentContext.availableHeight;
  const availableHeight = totalHeight - consumedHeight;
  const [isMounted, setIsMounted] = useState(false);

  const registerHeight = useCallback((elementId: string, height: number) => {
    setHeights((prev) => ({ ...prev, [elementId]: height }));
  }, []);

  const unregisterHeight = useCallback((elementId: string) => {
    setHeights((prev) => {
      const { [elementId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Only load the children when the component is mounted
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const consumed = Object.values(heights).reduce((acc, curr) => acc + curr, 0);
    setConsumedHeight(consumed);
  }, [heights]);

  const value = useMemo(
    () => ({
      id,
      totalHeight,
      consumedHeight,
      availableHeight,
      heights,
      registerHeight,
      unregisterHeight,
    }),
    [initialHeightValue, totalHeight, consumedHeight, heights, registerHeight, unregisterHeight]
  );

  return (
    <HeightProviderContext.Provider value={value}>
      {isMounted ? children : null}
    </HeightProviderContext.Provider>
  );
}

function HeightProviderOff({ children }: PropsWithChildren) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default function HeightProvider({ ...props }: HeightProviderProps) {
  const { isFeatureEnabled, isLoading } = useFeatureFlag();
  const isHeightProviderEnabled = isFeatureEnabled('FF_HEIGHT_PROVIDER');

  if (isLoading) {
    return <Spinner />;
  }

  return isHeightProviderEnabled ? (
    <HeightProviderOn {...props} />
  ) : (
    <HeightProviderOff {...props} />
  );
}
