import React, { FC, ReactNode, useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Loader } from '@keen.io/ui-core';

import {
  Aside,
  Container,
  ChildrenWrapper,
  Message,
  SavingIndicator,
} from './EditorBar.styles';

import SubmitButton from '../SubmitButton';

type Props = {
  /** Finish edit event handler */
  onFinishEdit: () => void;
  /** Last save time */
  lastSaveTime: number | null;
  /** Saving indicator */
  isSaving: boolean;
  /** Sticky bar indicator */
  isSticky: boolean;
  /** React children nodes */
  children?: ReactNode;
};

const EditorBar: FC<Props> = ({
  onFinishEdit,
  lastSaveTime,
  isSaving,
  isSticky,
  children,
}) => {
  const { t } = useTranslation();
  const timeAgo = useMemo(
    () =>
      lastSaveTime &&
      `${t('editor_bar.saved')} ${moment(lastSaveTime).fromNow()}`,
    [lastSaveTime]
  );

  return (
    <Container isSticky={isSticky}>
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Aside>
        <SavingIndicator>
          {isSaving ? (
            <>
              <Loader width={20} height={20} />
              <Message>{t('editor_bar.is_saving')}</Message>
            </>
          ) : (
            <Message>{timeAgo}</Message>
          )}
        </SavingIndicator>
        <SubmitButton onClick={onFinishEdit}>
          {t('editor_bar.finish_edition')}
        </SubmitButton>
      </Aside>
    </Container>
  );
};

export default EditorBar;
