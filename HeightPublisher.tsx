import React, { FC } from 'react';
import { Box } from '@mui/material';
import useFeatureFlag from 'hooks/useFeatureFlags';
import { PropsWithChildren } from 'types/common';
import useResizeObserver from './useResizeObserver';
import { IHeightProvider } from './HeightProvider.types';
import { HeightProviderProps } from './HeightProvider';

type Props = IHeightProvider['CommonProps'] & {
  hid?: string;
} & HeightProviderProps;

function HeightPublisherOn({ children, component = Box, hid, ...props }: Props) {
  const ref = useResizeObserver({ hid });
  const Component = component as FC<IHeightProvider['ComponentProps']>;

  return (
    <Component {...props} ref={ref}>
      {children}
    </Component>
  );
}

function HeightPublisherOff({ children }: PropsWithChildren) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default function HeightPublisher({ children, ...props }: Props) {
  const isHeightProviderEnabled = useFeatureFlag().isFeatureEnabled('FF_HEIGHT_PROVIDER');

  return isHeightProviderEnabled ? (
    <HeightPublisherOn {...props}>{children}</HeightPublisherOn>
  ) : (
    <HeightPublisherOff>{children}</HeightPublisherOff>
  );
}
