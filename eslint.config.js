import { config } from '@joshunrau/eslint-config';

export default config({
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  typescript: {
    enabled: true
  }
});
