import {
  confirmSaveQueryUpdate,
  useQueryForWidget,
} from '../../modules/chartEditor';

import { EditAction } from './types';

export const RADIO_GROUP = [
  {
    label: 'confirm_query_change.connect_saved_query',
    isActive: (active: EditAction) => active === EditAction.UPDATE_SAVED_QUERY,
    value: EditAction.UPDATE_SAVED_QUERY,
  },
  {
    label: 'confirm_query_change.create_ad_hoc_query',
    isActive: (active: EditAction) => active === EditAction.CREATE_AD_HOC_QUERY,
    value: EditAction.CREATE_AD_HOC_QUERY,
  },
];

export const CONFIRM_OPTIONS: Record<EditAction, any> = {
  [EditAction.UPDATE_SAVED_QUERY]: {
    editAction: confirmSaveQueryUpdate,
    hintMessage: 'confirm_query_change.connect_saved_query_message',
  },
  [EditAction.CREATE_AD_HOC_QUERY]: {
    editAction: useQueryForWidget,
    hintMessage: 'confirm_query_change.create_ad_hoc_query_message',
  },
};
