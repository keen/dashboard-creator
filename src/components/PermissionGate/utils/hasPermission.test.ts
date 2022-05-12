import { hasPermission } from './hasPermission';
import { Scopes } from '../../../modules/app';

test('returns false when permission denied', () => {
  const permission = hasPermission(
    [Scopes.EDIT_DASHBOARD_THEME, Scopes.EDIT_DASHBOARD_THEME],
    [Scopes.SHARE_DASHBOARD]
  );
  expect(permission).toBeFalsy();
});

test('returns true when permission allowed', () => {
  const permission = hasPermission(
    [Scopes.EDIT_DASHBOARD_THEME, Scopes.EDIT_DASHBOARD_THEME],
    [Scopes.EDIT_DASHBOARD_THEME]
  );
  expect(permission).toBeTruthy();
});
