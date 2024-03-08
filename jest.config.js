module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!**/*.d.ts'],
  moduleNameMapper: { '^axios$': 'axios/dist/node/axios.cjs' },
}
