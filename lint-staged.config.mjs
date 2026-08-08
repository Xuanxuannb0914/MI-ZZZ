export default {
  '*.{ts,tsx,js,jsx,json}': ['biome check --write', 'eslint --max-warnings=0'],
  '*.{md,yml,yaml,css}': ['prettier --write'],
};
