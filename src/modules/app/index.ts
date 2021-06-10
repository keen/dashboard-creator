import { appSaga } from './saga';

import { appSelectors } from './selectors';
import appSlice from './reducer';
import { Scopes } from './types';

const appActions = appSlice.actions;
const appReducer = appSlice.reducer;

export { appActions, appReducer, appSelectors, appSaga, Scopes };
