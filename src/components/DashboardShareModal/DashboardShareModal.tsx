/* eslint-disable @typescript-eslint/camelcase */
import React, {
  FC,
  useEffect,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
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
  getDashboardMeta,
  setDashboardPublicAccess,
} from '../../modules/dashboards';

import { APIContext, AppContext } from '../../contexts';

import { EmbedCode, ModalContent, PublicLink } from './components';
import {
  Label,
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  ToggleWrapper,
  Text,
  ModalWrapper,
  TabsContainer,
  Divider,
} from './DashboardShareModal.styles';

import { TOOLTIP_MOTION } from '../../constants';
import {
  MODAL_VIEWS,
  PUBLIC_LINK_VIEW_ID,
  EMBED_HTML_VIEW_ID,
  ACCESS_KEY_ERROR,
} from './constants';

import { RootState } from '../../rootReducer';
import { createPublicDashboardKeyName } from '../../modules/dashboards/utils';

const DashboardShareModal: FC = () => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);
  const { keenAnalysis } = useContext(APIContext);
  const { t } = useTranslation();

  const { isVisible, dashboardId } = useSelector(getDashboardShareModal);
  const { isPublic, publicAccessKey } = useSelector((state: RootState) => {
    if (dashboardId) return getDashboardMeta(state, dashboardId);
    return {
      isPublic: false,
      publicAccessKey: null,
    };
  });

  const [labelTooltip, setLabelTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState(MODAL_VIEWS[0].id);
  const [accessKeyError, setAccessKeyError] = useState(null);

  const tabs = useMemo(
    () => MODAL_VIEWS.map((view) => ({ ...view, label: t(view.label) })),
    [isVisible]
  );

  useEffect(() => {
    if (!dashboardId) return;
    const keyName = createPublicDashboardKeyName(dashboardId);
    const accessKey = keenAnalysis
      .get(keenAnalysis.url('projectId', `keys?name=${keyName}`))
      .auth(keenAnalysis.masterKey())
      .send();

    accessKey
      .then((res) => {
        if (!res.length && isPublic) {
          setAccessKeyError(t(ACCESS_KEY_ERROR.NOT_EXIST));
          dispatch(setDashboardPublicAccess(dashboardId, false));
        }
        if (res.length) {
          const { is_active } = res[0];
          if (!isPublic || (isPublic && is_active)) setAccessKeyError(null);
          if (isPublic && !is_active)
            setAccessKeyError(ACCESS_KEY_ERROR.REVOKE_ERROR);
        }
      })
      .catch((e) => {
        setAccessKeyError(t(ACCESS_KEY_ERROR.API_ERROR));
        console.error(e);
      });
  }, [dashboardId]);

  useEffect(() => {
    if (isPublic && publicAccessKey) setAccessKeyError(null);
  }, [publicAccessKey]);

  const closeHandler = useCallback(() => {
    dispatch(hideDashboardShareModal());
  }, []);

  const handleToggleChange = useCallback(() => {
    dispatch(setDashboardPublicAccess(dashboardId, !isPublic));
  }, [dashboardId, isPublic]);

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
                  tabs={tabs}
                />
              </TabsContainer>
            </ModalContent>
            <ModalContent>
              {accessKeyError && <Alert type="error">{accessKeyError}</Alert>}
              <ToggleWrapper>
                <Toggle isOn={isPublic} onChange={handleToggleChange} />
                <Label>
                  <Text onClick={handleToggleChange}>
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
                        <TooltipContainer {...TOOLTIP_MOTION}>
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
