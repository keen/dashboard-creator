import { RootState } from '../../rootReducer';

const getTextEditor = ({ textEditor }: RootState) => textEditor;

export const textEditorSelectors = {
  getTextEditor,
};
