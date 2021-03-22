import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Label } from '@keen.io/ui-core';
import { TextSettings } from '@keen.io/widgets';

import { Container, FieldGroup } from './HeadingSettings.styles';

type Props = {
  /** Widget title settings */
  title: TextSettings;
  /** Widget subtitle settings */
  subtitle: TextSettings;
  /** Title settings update event handler */
  onUpdateTitleSettings: (settings: TextSettings) => void;
  /** Subtitle settings update event handler */
  onUpdateSubtitleSettings: (settings: TextSettings) => void;
};

const HeadingSettings: FC<Props> = ({
  title,
  subtitle,
  onUpdateTitleSettings,
  onUpdateSubtitleSettings,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <FieldGroup>
        <Label variant="secondary">
          {t('widget_heading_settings.title_label')}
        </Label>
        <Input
          defaultValue={title.content}
          placeholder={t('widget_heading_settings.title_placeholder')}
          variant="solid"
          onChange={(e) =>
            onUpdateTitleSettings({
              ...title,
              content: e.currentTarget.value,
            })
          }
        />
      </FieldGroup>
      <FieldGroup>
        <Label variant="secondary">
          {t('widget_heading_settings.subtitle_label')}
        </Label>
        <Input
          defaultValue={subtitle.content}
          placeholder={t('widget_heading_settings.subtitle_placeholder')}
          variant="solid"
          onChange={(e) =>
            onUpdateSubtitleSettings({
              ...subtitle,
              content: e.currentTarget.value,
            })
          }
        />
      </FieldGroup>
    </Container>
  );
};

export default HeadingSettings;
