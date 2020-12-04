import { useContext, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToasts } from '@keen.io/toast-notifications';

import { AppContext } from '../../contexts';

import { ToastSettings } from '../../modules/notifications';

import { SHOW_TOAST_NOTIFICATION_EVENT } from '../../constants';

const ToastNotifications = () => {
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const { notificationPubSub } = useContext(AppContext);

  const showToast = useCallback(
    (message: string, toastSettings: Partial<ToastSettings>) => {
      const { autoDismiss, showDismissButton, type } = toastSettings;
      addToast(message, {
        appearance: type,
        autoDismiss,
        showDismissButton,
      });
    },
    []
  );

  useEffect(() => {
    const dispose = notificationPubSub.subscribe(
      (eventName, meta: ToastSettings) => {
        switch (eventName) {
          case SHOW_TOAST_NOTIFICATION_EVENT:
            const {
              type,
              message,
              autoDismiss = true,
              showDismissButton,
              translateMessage = true,
            } = meta;

            const notificationMessage = translateMessage ? t(message) : message;

            showToast(notificationMessage, {
              type,
              autoDismiss,
              translateMessage,
              showDismissButton,
            });
            break;
        }
      }
    );

    return () => dispose();
  }, []);

  return null;
};

export default ToastNotifications;
