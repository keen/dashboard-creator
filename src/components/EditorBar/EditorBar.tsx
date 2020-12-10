import React, { FC, ReactNode, useMemo } from 'react';
import { Container, ChildrenWrapper, TimeAgo, Right } from './EditorBar.styles';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import SubmitButton from '../SubmitButton';

type Props = {
  onFinishEdit: () => void;
  lastSaveTime: number | null;
  isSaving: boolean;
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
