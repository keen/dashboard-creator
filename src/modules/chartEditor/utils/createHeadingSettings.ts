import { widgetSettings } from '@keen.io/widgets';

/**
 * Creates basic settings for heading widget section.
 *
 * @return default heading settings
 *
 */
const createHeadingSettings = () => {
  const {
    title: defaultTitleSettings,
    subtitle: defaultSubtitleSettings,
  } = widgetSettings;

  return {
    title: {
      content: '',
      ...defaultTitleSettings,
    },
    subtitle: {
      content: '',
      ...defaultSubtitleSettings,
    },
  };
};

export default createHeadingSettings;
