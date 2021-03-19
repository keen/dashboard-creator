import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@keen.io/ui-core';

import { Container } from './Navigation.styles';

import { EditorSection } from '../../../../modules/chartEditor';

type Props = {
  /** Current active section */
  activeSection?: EditorSection;
  /** Change editor section event handler */
  onChangeSection: (sectionId: EditorSection) => void;
};

const Navigation: FC<Props> = ({ activeSection, onChangeSection }) => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('chart_widget_editor.navigation_query'),
      id: EditorSection.QUERY,
    },
    {
      label: t('chart_widget_editor.navigation_settings'),
      id: EditorSection.SETTINGS,
    },
  ];

  return (
    <Container>
      <Tabs
        tabs={tabs}
        activeTab={activeSection}
        onClick={(sectionId: EditorSection) => onChangeSection(sectionId)}
      />
    </Container>
  );
};

export default Navigation;
