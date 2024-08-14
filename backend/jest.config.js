export default {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
}
