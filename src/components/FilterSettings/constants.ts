import { FilterSettingsError } from './types';

export const ERRORS: Record<FilterSettingsError, string> = {
  [FilterSettingsError.IncompleteSettings]: 'filter_settings.settings_error',
  [FilterSettingsError.SchemaCompute]:
    'filter_settings.schema_processing_error',
  [FilterSettingsError.EmptySchema]: 'filter_settings.empty_schema_error',
};
