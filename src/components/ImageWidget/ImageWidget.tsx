import React, { FC, useEffect, useRef, useState } from 'react';

import WidgetPlaceholder from '../WidgetPlaceholder';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { getWidget, ImageWidget } from '../../modules/widgets';
import { Image, PlaceholderWrapper } from './ImageWidget.styles';

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
  }, [widgetRef]);

  return (
    <>
      {isConfigured ? (
        <Image
          src={(widget as ImageWidget).settings.link}
          data-testid="image-widget"
        />
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
