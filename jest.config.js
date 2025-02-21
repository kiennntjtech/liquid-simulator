module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/src/(.*)': '<rootDir>/$1',
    '@/(.*)': '<rootDir>/$1',
    '@shared/(.*)': '<rootDir>/shared/$1',
    'src/(.*)': '<rootDir>/$1',
  },
};
