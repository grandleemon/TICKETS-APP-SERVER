export default {
  '{src,test}/**/*.ts': ['eslint --fix', 'prettier --write'],
  '{AGENTS.md,docs/**/*.md,.agents/**/*.md}': 'prettier --write',
  '**/*.{json,yml,yaml}': 'prettier --write --ignore-unknown',
};
