import React, { FC, useState, useEffect, useContext } from 'react';
import { OK } from 'http-status-codes';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  Container,
  Gradient,
  Message,
  DefaultThumbnail,
} from './Thumbnail.styles';

import { APIContext } from '../../../../contexts';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
  /** Default thumbnail indicator */
  useDefaultThumbnail?: boolean;
  /** Message for default thumbnail */
  defaultThumbnailMessage?: string;
};

const Thumbnail: FC<Props> = ({
  dashboardId,
  defaultThumbnailMessage,
  useDefaultThumbnail = false,
}) => {
  const [image, setImage] = useState(null);
  const [defaultThumbnail, setDefaultThumbnail] = useState(useDefaultThumbnail);
  const { blobApi } = useContext(APIContext);

  useEffect(() => {
    if (!defaultThumbnail) {
      blobApi
        .getThumbnailByDashboardId(dashboardId)
        .then((res) => {
          if (res.status === OK) return res.text();
          throw new Error();
        })
        .then((blobImage) => {
          setImage(blobImage);
        })
        .catch(() => setDefaultThumbnail(true));
    }
  }, [dashboardId, defaultThumbnail]);

  return (
    <Container>
      {defaultThumbnail ? (
        <DefaultThumbnail data-testid="default-thumbnail">
          <Icon
            width={40}
            height={40}
            opacity={0.1}
            fill={colors.blue[400]}
            type="bar-widget-vertical"
          />
          <Message>{defaultThumbnailMessage}</Message>
        </DefaultThumbnail>
      ) : (
        <img data-testid="thumbnail-image" src={image} />
      )}
      <Gradient />
    </Container>
  );
};

export default Thumbnail;
