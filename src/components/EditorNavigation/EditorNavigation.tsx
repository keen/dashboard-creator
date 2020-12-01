import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onBack: () => void;
};

const EditorNavigation: FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <div>
      <button onClick={onBack}>{t('dashboard_editor.back')}</button>
    </div>
  );
};

export default EditorNavigation;
