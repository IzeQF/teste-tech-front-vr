module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  testMatch: ["**/__tests__/**/*.(ts|tsx)", "**/?(*.)+(spec|test).(ts|tsx)"],
};
