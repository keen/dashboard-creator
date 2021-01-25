# Dashboard Creator

[![written in typescript](https://img.shields.io/badge/written%20in-typescript-blue.svg)](https://www.typescriptlang.org) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-yellow.svg)](https://github.com/prettier/prettier) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://facebook.github.io/jest/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![yarn](https://img.shields.io/badge/maintained%20with-yarn-cc00ff.svg)](https://yarnpkg.com/en/)

The Dashboard Creator is an open source point-and-click interface for creating dashboards. It's maintained by the team at [Keen IO](https://keen.io/).

### Install

```ssh
npm install @keen.io/dashboard-creator --save
```

or

```ssh
yarn add @keen.io/dashboard-creator
```

### project setup

##### prerequisites

1.  [yarn](https://classic.yarnpkg.com/) - package manager
2.  `node` - make sure it's minimum **10.x.x**

##### steps

1.  checkout repository
2.  run `yarn` - to install project dependencies
3.  run application in development mode `yarn start:dashboard-creator`

### npm scripts

List of useful commands that could be used by developers. Execution in the command-line interface should be prefixed with `yarn` package manager.

| Command    | Description                                          |
| ---------- | ---------------------------------------------------- |
| `lint`     | run linter against current application codebase.     |
| `test`     | run unit tests.                                      |
| `build`    | builds application distribution.                     |
| `prettier` | run code formatter process against current codebase. |

### commit

This project uses [Conventional Commits](https://www.conventionalcommits.org) to enforce common commit standards.

| Command      | Description                        |
| ------------ | ---------------------------------- |
| `npx git-cz` | run commit command line interface. |
