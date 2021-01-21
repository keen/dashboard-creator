import createStyles from 'draft-js-custom-styles';

const { styles, customStyleFn, exporter } = createStyles([
  'font-size',
  'color',
  'text-transform',
]);

export { styles, customStyleFn, exporter };
