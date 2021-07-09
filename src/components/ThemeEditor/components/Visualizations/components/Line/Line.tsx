import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../../../SettingsHeadline';
import ThemeSlider, { generateRulerSettings } from '../../../ThemeSlider';
import Section, { SectionRow, TextWrapper } from '../../../Section';

import { STROKE_INTERVALS, MARKERS_INTERVALS } from './constants';

type Props = {
  /** Funnel chart theme settings */
  settings: Theme['line'];
  /** Change event handler */
  onChange: (settings: Theme['line']) => void;
};

const Line: FC<Props> = ({ settings, onChange }) => {
  const { t } = useTranslation();
  const { markRadius, strokeWidth } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.line_title')} />
      <div>
        <SectionRow data-testid="line-thickness">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.line_thickness')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={strokeWidth}
            intervals={STROKE_INTERVALS}
            ticks={generateRulerSettings({
              minimum: STROKE_INTERVALS[0].minimum,
              maximum: STROKE_INTERVALS[0].maximum,
              step: 1,
            })}
            onChange={(strokeWidth) =>
              onChange({
                ...settings,
                strokeWidth,
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="line-markers">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.line_markers')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={markRadius}
            intervals={MARKERS_INTERVALS}
            ticks={generateRulerSettings({
              minimum: MARKERS_INTERVALS[0].minimum,
              maximum: MARKERS_INTERVALS[0].maximum,
              step: 2,
            })}
            onChange={(markRadius) =>
              onChange({
                ...settings,
                markRadius,
              })
            }
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Line;
