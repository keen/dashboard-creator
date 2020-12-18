import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Aside, Container } from './EditorNavigation.styles';

type Props = {
  /** Back to management view */
  onBack: () => void;
  /** Show dashboard settings */
  onShowSettings: () => void;
};

const EditorNavigation: FC<Props> = ({ onBack, onShowSettings }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <button onClick={onBack}>{t('dashboard_editor.back')}</button>
      <Aside>
        <CircleButton
          variant="secondary"
          icon={<Icon type="settings" />}
          onClick={onShowSettings}
        />
      </Aside>
    </Container>
  );
};

export default EditorNavigation;
