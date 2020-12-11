import { Theme } from '@keen.io/charts';

export type ReducerState = {
  base: Partial<Theme>;
  dashboards: Record<string, Partial<Theme>>;
};
