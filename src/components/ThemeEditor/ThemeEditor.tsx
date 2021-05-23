import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { themeActions, themeSelectors, extendTheme } from '../../modules/theme';

type Props = {};

const ThemeEditor: FC<Props> = () => {
  const dispatch = useDispatch();
  const { theme, settings } = useSelector(themeSelectors.getCurrentEditTheme);

  return (
    <div>
      <button
        onClick={() => {
          dispatch(
            themeActions.setCurrentEditTheme({
              settings,
              theme: extendTheme(
                {
                  colors: [
                    '#94003a',
                    '#a4535e',
                    '#af8181',
                    '#b8a79f',
                    '#c0c7b8',
                    '#cadfcb',
                    '#d8f1d8',
                    '#eafcdf',
                    '#ffffe0',
                  ],
                },
                theme
              ),
            })
          );
        }}
      >
        Update colors
      </button>
      {JSON.stringify(settings)}
      <hr />
      {JSON.stringify(theme)}
    </div>
  );
};

export default ThemeEditor;
