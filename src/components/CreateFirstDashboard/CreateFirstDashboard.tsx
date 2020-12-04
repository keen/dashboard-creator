import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

import { MotionContainer } from './CreateFirstDashboard.styles';
import { modalMotion } from './motion';

type Props = {
  /** Visibility indicator */
  isVisible: boolean;
  /** Click event handler */
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const CreateFirstDashboard: FC<Props> = ({ isVisible, onClick }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isVisible && (
        <MotionContainer
          {...modalMotion}
          onClick={onClick}
          data-testid="create-first-dashboard"
        >
          {t('dashboard_management.empty_project')}
        </MotionContainer>
      )}
    </AnimatePresence>
  );
};
export default CreateFirstDashboard;
