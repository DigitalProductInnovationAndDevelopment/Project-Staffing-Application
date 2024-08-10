// jest.config.mjs
export default {
  // transform: {
  //   '^.+\\.jsx?$': 'babel-jest',
  // },
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
}
