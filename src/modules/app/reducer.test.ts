import { appActions, appReducer } from './index';
import { initialState } from './reducer';

test('set user edit privileges', () => {
  const action = appActions.appStart({
    baseTheme: {},
    editPrivileges: true,
    cachedDashboardsNumber: 3,
  });
  const {
    user: { editPrivileges },
  } = appReducer(initialState, action);

  expect(editPrivileges).toEqual(true);
});

test('shows query picker', () => {
  const action = appActions.showQueryPicker();
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
  const action = appActions.hideQueryPicker();
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
  const action = appActions.setActiveDashboard(dashboardId);
  const { activeDashboardId } = appReducer(
    {
      ...initialState,
      activeDashboardId: null,
    },
    action
  );

  expect(activeDashboardId).toEqual(dashboardId);
});
