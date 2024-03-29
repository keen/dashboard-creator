import { View } from './types';

export const DASHBOARD_API = 'DASHBOARD_API';
export const TRANSLATIONS = 'I18N';
export const KEEN_ANALYSIS = 'KEEN_ANALYSIS';
export const PUBSUB = 'PUBSUB';
export const NOTIFICATION_MANAGER = 'NOTIFICATION_MANAGER';
export const ANALYTICS_API_HOST = 'ANALYTICS_API_HOST';
export const TIMEZONES_API_HOST = 'TIMEZONES_API_HOST';
export const FEATURES = 'FEATURES';
export const DEFAULT_TIMEZONE = 'Etc/UTC';

export const SHOW_TOAST_NOTIFICATION_EVENT =
  '@dashboard-creator/show-toast-notification';
export const RESIZE_WIDGET_EVENT = '@dashboard-creator/resize-widget';
export const DROPDOWN_CONTAINER_ID = 'dropdown-container';

export const ROUTES: Record<string, `/${View}`> = {
  MANAGEMENT: '/management',
  EDITOR: '/editor',
  VIEWER: '/viewer',
};

export const INITIAL_VIEWS: Record<View, typeof ROUTES[keyof typeof ROUTES]> = {
  management: '/management',
  editor: '/viewer',
  viewer: '/viewer',
};

export const TOOLTIP_MOTION = {
  transition: { duration: 0.3 },
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const TIMEFRAME_FORMAT = 'YYYY-MM-DD HH:mm';

export const DEFAULT_BACKGROUND_COLOR = '#f1f5f8';
