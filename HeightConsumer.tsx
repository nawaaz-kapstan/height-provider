import React, { FC, Fragment, useContext } from 'react';
import { Box } from '@mui/material';
import { PropsWithChildren } from 'types/common';
import useFeatureFlag from 'hooks/useFeatureFlags';
import { HeightProviderContext } from './HeightProvider.context';
import { IHeightProvider } from './HeightProvider.types';
import HeightProvider, { HeightProviderProps } from './HeightProvider';

export type HeightConsumerProps = IHeightProvider['CommonProps'] & {
  isProvider?: boolean;
} & HeightProviderProps;

function HeightConsumerOn({
  children,
  isProvider = true,
  component = Box,
  initialHeight,
  ...props
}: HeightConsumerProps) {
  const { availableHeight } = useContext(HeightProviderContext);
  const Component = component as FC<IHeightProvider['ComponentProps']>;
  const height = isProvider ? initialHeight || availableHeight : availableHeight;

  return isProvider ? (
    <HeightProvider initialHeight={height}>
      <Content {...props} component={Component} initialHeight={height}>
        {children}
      </Content>
    </HeightProvider>
  ) : (
    <Content {...props} component={Component} initialHeight={height}>
      {children}
    </Content>
  );
}

function Content({ children, component, initialHeight, ...props }: HeightConsumerProps) {
  const Component = component as FC<IHeightProvider['ComponentProps']>;

  return (
    <Component {...props} sx={{ height: `${initialHeight}px`, ...props.sx }}>
      {children}
    </Component>
  );
}

function HeightConsumerOff({ children }: PropsWithChildren) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default function HeightConsumer({ children, ...props }: HeightConsumerProps) {
  const isHeightProviderEnabled = useFeatureFlag().isFeatureEnabled('FF_HEIGHT_PROVIDER');

  return isHeightProviderEnabled ? (
    <HeightConsumerOn {...props}>{children}</HeightConsumerOn>
  ) : (
    <HeightConsumerOff>{children}</HeightConsumerOff>
  );
}
