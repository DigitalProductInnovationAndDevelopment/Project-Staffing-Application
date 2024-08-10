export default {
  testEnvironment: 'node',
  transform: {},
  transformIgnorePatterns: ['node_modules/(?!(@babel)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
