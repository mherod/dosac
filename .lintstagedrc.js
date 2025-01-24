const config = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
  "*.{css,scss}": ["prettier --write"],
};

export default config;
