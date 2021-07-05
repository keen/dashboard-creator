import { RootState } from '../../rootReducer';

export const getInterimQuery = ({ queries }: RootState, widgetId: string) =>
  queries.interimQueries[widgetId];

export const getInterimQueriesLength = ({ queries }: RootState) =>
  Object.keys(queries.interimQueries).length;
