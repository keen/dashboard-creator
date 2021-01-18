import React, { FC, useContext, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import {
  Portal,
  Modal,
  ModalHeader,
  Toggle,
  Tooltip,
  Tabs,
  Alert,
} from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  hideDashboardShareModal,
  getDashboardShareModal,
} from '../../modules/dashboards';

import { AppContext } from '../../contexts';

import { EmbedCode, ModalContent, Divider, PublicLink } from './components';
import {
  Label,
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  ToggleWrapper,
  Text,
  ModalWrapper,
  TabsContainer,
} from './DashboardShareModal.styles';

import {
  MODAL_VIEWS,
  PUBLIC_LINK_VIEW_ID,
  EMBED_HTML_VIEW_ID,
} from './constants';
import { tooltipMotion } from './motion';

type Props = {
  /** Share dashobard event handler */
  onShareDashboard?: (dashboardId: string) => void;
};

const DashboardShareModal: FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);
  const { t } = useTranslation();

  const { isVisible, dashboardId } = useSelector(getDashboardShareModal);

  const closeHandler = useCallback(() => {
    dispatch(hideDashboardShareModal());
  }, []);

  const [labelTooltip, setLabelTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState(MODAL_VIEWS[0].id);
  const [isPublic, setIsPublic] = useState(false);

  return (
    <Portal modalContainer={modalContainer}>
      <Modal isOpen={isVisible} onClose={closeHandler}>
        {() => (
          <ModalWrapper>
            <ModalHeader onClose={closeHandler}>
              {t('dashboard_share.modal_title')}
            </ModalHeader>
            <ModalContent paddingTop="10px" paddingBottom="0">
              <TabsContainer>
                <Tabs
                  activeTab={activeTab}
                  onClick={(id) => setActiveTab(id)}
                  tabs={MODAL_VIEWS}
                />
              </TabsContainer>
            </ModalContent>
            <ModalContent>
              <Alert type="error">
                {t('dashboard_share.access_key_error')}
              </Alert>
              <ToggleWrapper>
                <Toggle
                  isOn={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                <Label>
                  <Text onClick={() => setIsPublic(!isPublic)}>
                    {t('dashboard_share.make_public')}
                  </Text>
                  <TooltipWrapper
                    marginLeft="5px"
                    onMouseEnter={() => setLabelTooltip(true)}
                    onMouseLeave={() => setLabelTooltip(false)}
                  >
                    <Icon
                      type="info"
                      width={15}
                      height={15}
                      fill={colors.black[100]}
                    />
                    <AnimatePresence>
                      {labelTooltip && (
                        <TooltipContainer {...tooltipMotion}>
                          <Tooltip mode="light" hasArrow={false}>
                            <TooltipContent>
                              {t('dashboard_share.make_public_tooltip')}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipContainer>
                      )}
                    </AnimatePresence>
                  </TooltipWrapper>
                </Label>
              </ToggleWrapper>
            </ModalContent>
            <Divider />
            {activeTab === PUBLIC_LINK_VIEW_ID && (
              <PublicLink dashboardId={dashboardId} isPublic={isPublic} />
            )}
            {activeTab === EMBED_HTML_VIEW_ID && (
              <EmbedCode dashboardId={dashboardId} isPublic={isPublic} />
            )}
          </ModalWrapper>
        )}
      </Modal>
    </Portal>
  );
};

export default DashboardShareModal;
