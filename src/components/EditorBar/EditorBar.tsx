import React, { FC, ReactNode } from 'react';
import { Container, ConfirmButton, ChildrenWrapper } from './EditorBar.styles';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import SquareButton from '../shared/buttons/SubmitButton';

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
  const timeAgo =
    lastSaveTime &&
    `${t('editor_bar.saved')} ${moment(lastSaveTime).fromNow()}`;

  return (
    <Container>
      <ChildrenWrapper>{children}</ChildrenWrapper>

      <div className="right">
        <div className="timeAgo">{isSaving ? 'Is saving...' : timeAgo}</div>

        <ConfirmButton>
          <SquareButton
            text={t('editor_bar.finish_edition')}
            onClick={onFinishEdit}
            styles={{
              height: '47px',
            }}
          />
        </ConfirmButton>
      </div>
    </Container>
  );
};

export default EditorBar;
