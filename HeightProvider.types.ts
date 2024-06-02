import { Box, Stack, Grid } from '@mui/material';
import { PropsWithChildren } from 'types/common';

type BaseProps = PropsWithChildren & {
  component?: React.ElementType;
};

type PropsWithBoxComponent = BaseProps & {
  component?: typeof Box;
} & Parameters<typeof Box>[0];

type PropsWithGridComponent = BaseProps & {
  component?: typeof Grid;
} & Parameters<typeof Grid>[0];

type PropsWithStackComponent = BaseProps & {
  component?: typeof Stack;
} & Parameters<typeof Stack>[0];

type CommonProps = PropsWithBoxComponent | PropsWithGridComponent | PropsWithStackComponent;

export interface IHeightProvider {
  CommonProps: CommonProps;
  ComponentProps:
    | Parameters<typeof Box>[0]
    | Parameters<typeof Grid>[0]
    | Parameters<typeof Stack>[0];
}
