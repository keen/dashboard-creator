import React, { FC } from 'react';

import Thumbnail from '../Thumbnail';

type Props = {
  /** Dashboard identifer */
  id: string;
  /** Default thumbnail indicator */
  useDefaultThumbnail: boolean;
  /** Edit event handler */
  onEdit: () => void;
};

const DashboardTile: FC<Props> = ({ id, useDefaultThumbnail, onEdit }) => {
  return (
    <div>
      <Thumbnail dashboardId={id} useDefaultThumbnail={useDefaultThumbnail} />
      <span onClick={() => onEdit()}>edit</span>
    </div>
  );
};

export default DashboardTile;
