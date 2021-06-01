import { Scopes } from '../../../modules/app';

export const hasPermission = (
  featureScopes: Scopes[],
  userPermissions: Scopes[]
) => featureScopes.every((scope) => userPermissions.includes(scope));
