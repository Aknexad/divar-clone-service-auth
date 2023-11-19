/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  verbose: true,
  // automock: true,

  moduleFileExtensions: ['js', 'ts'],
  transformIgnorePatterns: [`/node_modules/`],
  modulePathIgnorePatterns: ['./dist', './.vscode'],
};
