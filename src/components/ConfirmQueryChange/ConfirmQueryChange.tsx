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
  confirmSaveQueryUpdate,
  useQueryForWidget,
} from '../../modules/chartEditor';

import { EditAction } from './types';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const CONFIRM_ACTIONS: Record<EditAction, any> = {
  [EditAction.UPDATE_SAVED_QUERY]: confirmSaveQueryUpdate,
  [EditAction.CREATE_AD_HOC_QUERY]: useQueryForWidget,
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
              <RadioItem
                onClick={() => setEditOption(EditAction.UPDATE_SAVED_QUERY)}
              >
                <Radio
                  isActive={editOption === EditAction.UPDATE_SAVED_QUERY}
                />
                <RadioLabel>
                  {t('confirm_query_change.connect_saved_query')}
                </RadioLabel>
              </RadioItem>

              <RadioItem
                onClick={() => setEditOption(EditAction.CREATE_AD_HOC_QUERY)}
              >
                <Radio
                  isActive={editOption === EditAction.CREATE_AD_HOC_QUERY}
                />

                <RadioLabel>
                  {t('confirm_query_change.create_ad_hoc_query')}
                </RadioLabel>
              </RadioItem>
            </div>
          </Content>
          <Hint>
            {editOption === EditAction.UPDATE_SAVED_QUERY &&
              t('confirm_query_change.connect_saved_query_message')}
            {editOption === EditAction.CREATE_AD_HOC_QUERY &&
              t('confirm_query_change.create_ad_hoc_query_message')}
          </Hint>
          <ModalFooter>
            <Footer>
              <Button
                variant="secondary"
                onClick={() => dispatch(CONFIRM_ACTIONS[editOption]())}
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
