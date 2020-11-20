import React, { FC, useState, useEffect, useContext } from 'react';
import { OK } from 'http-status-codes';

import { Container, Gradient } from './Thumbnail.styles';

import { APIContext } from '../../contexts';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Thumbnail: FC<Props> = ({ dashboardId }) => {
  const [image, setImage] = useState(null);
  const { blobApi } = useContext(APIContext);

  useEffect(() => {
    blobApi
      .getThumbnailByDashboardId(dashboardId)
      .then((res) => {
        if (res.status === OK) return res.text();
        throw new Error('sasas');
      })
      .then((t) => {
        setImage(t);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dashboardId]);

  return (
    <Container>
      <img src={image} />
      <Gradient />
    </Container>
  );
};

export default Thumbnail;
