import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';

import SettingsHeadline from '../SettingsHeadline';
import FontSelector from '../FontSelector';
import Section, { SectionRow, TextWrapper } from '../Section';
import ThemeSlider, { generateRulerSettings } from '../ThemeSlider';

import { DashboardSettings } from '../../../../modules/dashboards';

import { SPACING_INTERVALS } from '../../constants';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'page'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (settings: Partial<DashboardSettings>) => void;
};

const DashboardPage: FC<Props> = ({ settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  const {
    page: { gridGap },
  } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.dashboard_page_title')} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.background_color')}
            </BodyText>
          </TextWrapper>
          <div>color picker</div>
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.chart_titles_font')}
            </BodyText>
          </TextWrapper>
          <FontSelector font="Lato" onChange={(font) => console.log(font)} />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.data_visualization_font')}
            </BodyText>
          </TextWrapper>
          <FontSelector font="Lato" onChange={(font) => console.log(font)} />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.space_between_widgets')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={20}
            intervals={SPACING_INTERVALS}
            ticks={generateRulerSettings({
              minimum: SPACING_INTERVALS[0].minimum,
              maximum: SPACING_INTERVALS[0].maximum,
              step: 5,
            })}
          />
        </SectionRow>
        <div>{gridGap}</div>
        <div
          onClick={() =>
            onUpdateSettings({ page: { ...settings.page, gridGap: 40 } })
          }
        >
          Set Grid Gap 40
        </div>
      </div>
    </Section>
  );
};

export default DashboardPage;
