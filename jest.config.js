module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(test).ts?(x)'],
};
