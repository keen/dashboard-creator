import React, { FC } from 'react';

import Thumbnail from '../Thumbnail';

type Props = {
  /** Dashboard identifer */
  id: string;
  /** Edit event handler */
  onEdit: () => void;
};

const DashboardTile: FC<Props> = ({ id, onEdit }) => {
  return (
    <div>
      {id}
      <Thumbnail dashboardId={id} />
      <span onClick={() => onEdit()}>edit</span>
    </div>
  );
};

export default DashboardTile;
