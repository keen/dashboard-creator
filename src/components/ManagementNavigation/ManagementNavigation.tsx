import React, { FC } from 'react';

type Props = {
  onCreateDashboard: () => void;
};

const ManagementNavigation: FC<Props> = ({ onCreateDashboard }) => (
  <div>
    <button onClick={onCreateDashboard}>Create Dashboard</button>
  </div>
);

export default ManagementNavigation;
