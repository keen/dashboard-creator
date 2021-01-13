import React, { FC } from 'react';
import { CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Aside, Container } from './EditorNavigation.styles';

import DashboardDetails from '../DashboardDetails';

type Props = {
  /** Back to management view */
  onBack: () => void;
  /** Show dashboard settings */
  onShowSettings: () => void;
  /** Dashboard tags */
  tags: string[];
  /** Dashboard title */
  title?: string;
};

const EditorNavigation: FC<Props> = ({
  title,
  tags,
  onBack,
  onShowSettings,
}) => (
  <Container>
    <DashboardDetails title={title} tags={tags} onBack={onBack} />
    <Aside>
      <CircleButton
        variant="secondary"
        icon={<Icon type="settings" />}
        onClick={onShowSettings}
      />
    </Aside>
  </Container>
);

export default EditorNavigation;
