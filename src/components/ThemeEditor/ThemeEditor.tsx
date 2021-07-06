import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Theme } from '@keen.io/charts';
import { Accordion } from '@keen.io/ui-core';

import { MainSettings, ChartSettings, Visualizations } from './components';
import { Container, SectionContainer } from './ThemeEditor.styles';

import {
  themeActions,
  themeSelectors,
  themeSagaActions,
  extendTheme,
  ThemeEditorSection,
} from '../../modules/theme';
import {
  DashboardSettings,
  extendDashboardSettings,
} from '../../modules/dashboards';

const ThemeEditor: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { theme, settings } = useSelector(themeSelectors.getCurrentEditTheme);
  const editorSection = useSelector(themeSelectors.getEditorSection);

  const onSectionChange = useCallback(
    (editorSection: ThemeEditorSection, isOpen: boolean) => {
      if (isOpen) {
        dispatch(themeActions.setEditorSection(editorSection));
      } else {
        dispatch(themeActions.setEditorSection(null));
      }
    },
    []
  );

  const updateThemeSettings = useCallback(
    (
      themeSettings: Partial<Theme>,
      dashboardSettings: Partial<DashboardSettings>
    ) => {
      dispatch(
        themeActions.setCurrentEditTheme({
          settings: extendDashboardSettings(dashboardSettings, settings),
          theme: extendTheme(themeSettings, theme),
        })
      );
    },
    [theme, settings]
  );

  useEffect(() => {
    return () => {
      dispatch(themeSagaActions.editorUnmounted());
    };
  }, []);

  return (
    <Container>
      <SectionContainer>
        <Accordion
          title={t('theme_editor.main_section_title')}
          isOpen={editorSection === ThemeEditorSection.Main}
          onChange={(isOpen) =>
            onSectionChange(ThemeEditorSection.Main, isOpen)
          }
        >
          <MainSettings
            currentSettings={{ theme, settings }}
            onUpdateSettings={updateThemeSettings}
          />
        </Accordion>
        <Accordion
          title={t('theme_editor.charts_section_title')}
          isOpen={editorSection === ThemeEditorSection.Chart}
          onChange={(isOpen) =>
            onSectionChange(ThemeEditorSection.Chart, isOpen)
          }
        >
          <ChartSettings
            currentSettings={{ theme, settings }}
            onUpdateSettings={updateThemeSettings}
          />
        </Accordion>
        <Accordion
          title={t('theme_editor.visualizations_section_title')}
          isOpen={editorSection === ThemeEditorSection.Visualizations}
          onChange={(isOpen) =>
            onSectionChange(ThemeEditorSection.Visualizations, isOpen)
          }
        >
          <Visualizations
            currentSettings={{ theme, settings }}
            onUpdateSettings={updateThemeSettings}
          />
        </Accordion>
      </SectionContainer>
    </Container>
  );
};

export default ThemeEditor;
