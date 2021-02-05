import { RootState } from '../../rootReducer';

export const getInterimQuery = ({ queries }: RootState, widgetId: string) =>
  queries.interimQueries[widgetId];
