import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@keen.io/ui-core';

import { Container, Message, ButtonsContainer } from './RemoveWidget.styles';

type Props = {
  children: React.ReactNode;
  /** Confirm action event handler */
  onConfirm: () => void;
  /** Dismiss action event handler */
  onDismiss: () => void;
};

const RemoveWidget: FC<Props> = ({ children, onConfirm, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Message>{children}</Message>
      <ButtonsContainer>
        <Button variant="blank" onClick={onDismiss}>
          {t('widget.remove_dismiss_button')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {t('widget.remove_confirm_button')}
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default RemoveWidget;
