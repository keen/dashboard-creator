import React, { FC, useState, useEffect, useContext } from 'react';
import { OK } from 'http-status-codes';
import { Icon } from '@keen.io/icons';

import { Container, Gradient } from './Thumbnail.styles';

import { APIContext } from '../../contexts';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
  /** Default thumbnail indicator */
  useDefaultThumbnail?: boolean;
};

const Thumbnail: FC<Props> = ({ dashboardId, useDefaultThumbnail = false }) => {
  const [image, setImage] = useState(null);
  const [defaultThumbnail, setDefaultThumbnail] = useState(useDefaultThumbnail);
  const { blobApi } = useContext(APIContext);

  useEffect(() => {
    blobApi
      .getThumbnailByDashboardId(dashboardId)
      .then((res) => {
        if (res.status === OK) return res.text();
        throw new Error();
      })
      .then((t) => {
        setImage(t);
      })
      .catch(() => setDefaultThumbnail(true));
  }, [dashboardId]);

  return (
    <Container>
      {defaultThumbnail ? (
        <div>
          Default Thumbnail <Icon type="bar-widget-vertical" />
        </div>
      ) : (
        <img src={image} />
      )}
      <Gradient />
    </Container>
  );
};

export default Thumbnail;
