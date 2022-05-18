import { createAction } from '@reduxjs/toolkit';

import { APPLY_EDITOR_SETTINGS } from './constants';

export const applySettings = createAction(APPLY_EDITOR_SETTINGS);
