import React, { FC } from 'react';

type Props = {
  onBack: () => void;
};

const EditorNavigation: FC<Props> = ({ onBack }) => (
  <div>
    <button onClick={onBack}>Back</button>
  </div>
);

export default EditorNavigation;
