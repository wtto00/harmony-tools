module.exports = {
  '*': ['prettier --write --ignore-unknown'],
  '*.{js,mjs,jsx,ts,mts,tsx,vue}': ['eslint --flag unstable_ts_config --cache --fix'],
  '*.{ts,mts,tsx,vue}': [() => 'vue-tsc --noEmit -p ./tsconfig.json'],
}
