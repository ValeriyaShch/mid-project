export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss', '@stylistic/stylelint-plugin'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'declaration-property-value-no-unknown': null,
    'media-query-no-invalid': null,
    'import-notation': null,
    'color-function-notation': null,
    '@stylistic/indentation': 2,
    '@stylistic/string-quotes': 'double',
    '@stylistic/color-hex-case': 'lower',
  },
};
