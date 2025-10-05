export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss', '@stylistic/stylelint-plugin'],
  rules: {
    'at-rule-no-unknown': null, // Disable the base rule
    'scss/at-rule-no-unknown': true, // Enable SCSS-aware version
    'declaration-property-value-no-unknown': null,
    'media-query-no-invalid': null,
    // stylistic rules must be prefixed!
    '@stylistic/indentation': 2,
    '@stylistic/string-quotes': 'double',
    '@stylistic/color-hex-case': 'lower',
  },
};
