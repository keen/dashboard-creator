import React, { FC } from 'react';

type Props = {
  children: React.ReactElement;
};

const PreventDragPropagation: FC<Props> = ({ children }) => (
  <>
    {React.cloneElement(children, {
      onMouseDown: (e) => e.stopPropagation(),
      onTouchStart: (e) => e.stopPropagation(),
    })}
  </>
);

export default PreventDragPropagation;
