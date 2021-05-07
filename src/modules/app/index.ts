import { appSaga } from './saga';

import { appSelectors } from './selectors';
import appSlice from './reducer';

const appActions = appSlice.actions;
const appReducer = appSlice.reducer;

export { appActions, appReducer, appSelectors, appSaga };
