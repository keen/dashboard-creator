import { AccessKeyError } from './types';

export const PUBLIC_LINK_VIEW_ID = 'modal-view/public-link';
export const EMBED_HTML_VIEW_ID = 'modal-view/embed-html';

export const MODAL_VIEWS = [
  { label: 'dashboard_share.public_link', id: PUBLIC_LINK_VIEW_ID },
  { label: 'dashboard_share.embed_html', id: EMBED_HTML_VIEW_ID },
];

export const ACCESS_KEY_ERROR: Record<AccessKeyError, string> = {
  [AccessKeyError.NOT_EXIST]: 'dashboard_share.access_key_not_exist_error',
  [AccessKeyError.API_ERROR]: 'dashboard_share.access_key_api_error',
  [AccessKeyError.LIMIT_ERROR]: 'dashboard_share.access_key_limit_error', // TODO: handle errors for access keys limit
  [AccessKeyError.DUPLICATE_ERROR]:
    'dashboard_share.access_key_duplicate_error', // TODO: handle error for duplicated access key
  [AccessKeyError.REVOKE_ERROR]: 'dashboard_share.access_key_revoke_error',
};

export const TOOLTIP_HIDE = 1500;
