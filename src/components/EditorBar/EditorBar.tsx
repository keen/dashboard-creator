import React, { FC, ReactNode, useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { Container, ChildrenWrapper, TimeAgo, Right } from './EditorBar.styles';

import SubmitButton from '../SubmitButton';

type Props = {
  /** Finish edit event handler */
  onFinishEdit: () => void;
  /** Last save time */
  lastSaveTime: number | null;
  /** Saving indicator */
  isSaving: boolean;
  /** React children nodes */
  children?: ReactNode;
};

const EditorBar: FC<Props> = ({
  onFinishEdit,
  lastSaveTime,
  isSaving,
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
    <Container>
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Right>
        <TimeAgo>{isSaving ? t('editor_bar.is_saving') : timeAgo}</TimeAgo>
        <SubmitButton onClick={onFinishEdit}>
          {t('editor_bar.finish_edition')}
        </SubmitButton>
      </Right>
    </Container>
  );
};

export default EditorBar;
