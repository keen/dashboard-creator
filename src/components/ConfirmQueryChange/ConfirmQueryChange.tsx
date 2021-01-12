import React, { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Radio,
  Modal,
  Button,
  ModalHeader,
  ModalFooter,
} from '@keen.io/ui-core';

import {
  Container,
  Content,
  Back,
  RadioItem,
  RadioLabel,
  Message,
  Footer,
  Hint,
} from './ConfirmQueryChange.styles';

import {
  queryUpdateConfirmationMounted,
  hideQueryUpdateConfirmation,
} from '../../modules/chartEditor';

import { CONFIRM_OPTIONS, RADIO_GROUP } from './constants';
import { EditAction } from './types';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ConfirmQueryChange: FC<Props> = ({ isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [editOption, setEditOption] = useState<EditAction>(
    EditAction.UPDATE_SAVED_QUERY
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(queryUpdateConfirmationMounted());
    }
  }, [isOpen]);

  const { editAction, hintMessage } = CONFIRM_OPTIONS[editOption];

  return (
    <Modal
      isOpen={isOpen}
      adjustPositionToScroll={false}
      onClose={() => dispatch(hideQueryUpdateConfirmation())}
    >
      {(_, closeHandler) => (
        <Container id="confirm-query-update">
          <ModalHeader onClose={closeHandler}>
            {t('confirm_query_change.title')}
          </ModalHeader>
          <Content>
            <Message>{t('confirm_query_change.message')}</Message>
            <div>
              {RADIO_GROUP.map(({ label, value, isActive }) => (
                <RadioItem key={value} onClick={() => setEditOption(value)}>
                  <Radio isActive={isActive(editOption)} />
                  <RadioLabel>{t(label)}</RadioLabel>
                </RadioItem>
              ))}
            </div>
          </Content>
          <Hint>{t(hintMessage)}</Hint>
          <ModalFooter>
            <Footer>
              <Button
                variant="secondary"
                onClick={() => dispatch(editAction())}
              >
                {t('confirm_query_change.save')}
              </Button>
              <Back>
                <Anchor onClick={closeHandler}>
                  {t('confirm_query_change.cancel')}
                </Anchor>
              </Back>
            </Footer>
          </ModalFooter>
        </Container>
      )}
    </Modal>
  );
};

export default ConfirmQueryChange;
