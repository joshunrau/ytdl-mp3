import { config } from '@joshunrau/eslint-config';

export default config({
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  exclude: ['dist/*'],
  typescript: {
    enabled: true
  }
});
