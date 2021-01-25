import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '@keen.io/ui-core';

import { Image, ImageWrapper, PlaceholderWrapper } from './ImageWidget.styles';
import WidgetPlaceholder from '../WidgetPlaceholder';

import {
  getWidget,
  ImageWidget as ImageWidgetType,
} from '../../modules/widgets';

import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
};

const ImageWidget: FC<Props> = ({ id }) => {
  const widgetRef = useRef(null);
  const { isConfigured, widget } = useSelector((state: RootState) =>
    getWidget(state, id)
  );
  const [placeholder, setPlaceholder] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (widgetRef.current) {
      const { offsetWidth: width, offsetHeight: height } = widgetRef.current;
      setPlaceholder({ width, height });
    }
  }, [widgetRef.current]);

  return (
    <>
      {isConfigured ? (
        <Card>
          <ImageWrapper>
            <Image
              src={(widget as ImageWidgetType).settings.link}
              data-testid="image-widget"
            />
          </ImageWrapper>
        </Card>
      ) : (
        <PlaceholderWrapper ref={widgetRef}>
          <WidgetPlaceholder
            width={placeholder.width}
            height={placeholder.height}
            iconType="image"
          />
        </PlaceholderWrapper>
      )}
    </>
  );
};

export default ImageWidget;
