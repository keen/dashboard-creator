import appReducer, { initialState } from './reducer';

import {
  appStart,
  showQueryPicker,
  hideQueryPicker,
  setActiveDashboard,
} from './actions';

test('set user edit privileges', () => {
  const action = appStart({}, true);
  const {
    user: { editPrivileges },
  } = appReducer(initialState, action);

  expect(editPrivileges).toEqual(true);
});

test('shows query picker', () => {
  const action = showQueryPicker();
  const {
    queryPicker: { isVisible },
  } = appReducer(
    {
      ...initialState,
      queryPicker: {
        isVisible: false,
      },
    },
    action
  );

  expect(isVisible).toEqual(true);
});

test('hides query picker', () => {
  const action = hideQueryPicker();
  const {
    queryPicker: { isVisible },
  } = appReducer(
    {
      ...initialState,
      queryPicker: {
        isVisible: true,
      },
    },
    action
  );

  expect(isVisible).toEqual(false);
});

test('set active dashboard identifier', () => {
  const dashboardId = '@dashboard-id';
  const action = setActiveDashboard(dashboardId);
  const { activeDashboardId } = appReducer(
    {
      ...initialState,
      activeDashboardId: null,
    },
    action
  );

  expect(activeDashboardId).toEqual(dashboardId);
});
