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

// export default {
//   testEnvironment: 'node',
//   transform: {},
//   transformIgnorePatterns: ['node_modules/(?!(@babel)/)'],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
// }
