import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { hasPermission } from './utils';

import { appSelectors, Scopes } from '../../modules/app';

type Props = {
  /** Scope required for feature */
  scopes: Scopes[];
  /** Reach children nodes */
  children: React.ReactNode;
};

const PermissionGate: FC<Props> = ({ scopes, children }) => {
  const { permissions: userPermissions } = useSelector(appSelectors.getUser);
  const permissionGranted = hasPermission(scopes, userPermissions);

  if (!permissionGranted) return null;

  return <>{children}</>;
};

export default PermissionGate;
