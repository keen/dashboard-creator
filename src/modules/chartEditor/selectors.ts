import { RootState } from '../../rootReducer';

const getChartEditor = ({ chartEditor }: RootState) => chartEditor;

export const chartEditorSelectors = {
  getChartEditor,
};
