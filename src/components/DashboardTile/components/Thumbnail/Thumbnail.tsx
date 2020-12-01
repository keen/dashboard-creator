import React, { FC } from 'react';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  Container,
  Gradient,
  Message,
  DefaultThumbnail,
} from './Thumbnail.styles';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
  /** Default thumbnail indicator */
  useDefaultThumbnail?: boolean;
  /** Message for default thumbnail */
  defaultThumbnailMessage?: string;
};

const Thumbnail: FC<Props> = ({ defaultThumbnailMessage }) => {
  return (
    <Container>
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
      )
      <Gradient />
    </Container>
  );
};

export default Thumbnail;
