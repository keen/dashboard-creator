# Dashboard Creator

[![written in typescript](https://img.shields.io/badge/written%20in-typescript-blue.svg)](https://www.typescriptlang.org) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-yellow.svg)](https://github.com/prettier/prettier) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://facebook.github.io/jest/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![yarn](https://img.shields.io/badge/maintained%20with-yarn-cc00ff.svg)](https://yarnpkg.com/en/) [![codecov](https://codecov.io/gh/keen/dashboard-creator/branch/develop/graph/badge.svg?token=W77XX9UV5Y)](https://codecov.io/gh/keen/dashboard-creator)

The Dashboard Creator is an open source point-and-click interface for creating dashboards. It's maintained by the team at [Keen IO](https://keen.io/).

### Install

```ssh
npm install @keen.io/dashboard-creator --save
```

or

```ssh
yarn add @keen.io/dashboard-creator
```

### Settings

The Dashboard Creator components configuration could be specified during creation of application instance.

##### Visualizations Theme

The Dashboard Creator `@keen.io/dataviz` theme could be overridden during initialization of application instance.

```typescript
const dashboardCreator = new KeenDashboardCreator({
  theme: {
    colors: ['green', 'navy', 'orange'],
    metric: {
      value: {
        typography: {
          fontColor: 'black',
          fontSize: 23
        },
      },
    }
  },
 });
```

##### Routing integration

Additional handler could be used to get information about the current view rendered in the application.

```typescript
export type View = 'management' | 'editor' | 'viewer';

const dashboardCreator = new KeenDashboardCreator({
  onViewChange: (view: View, dashboardId: string | null) => {}
});
```

##### Render initially dashboard viewer

The `render` method accepts `initialView` and `dashboardId` argument that could be used to present specific dashboard initially.

For `editor` provided as initial view the dashboard in `viewer` mode will be rendered.

```typescript
export type View = 'management' | 'editor' | 'viewer';

const dashboardCreator = new KeenDashboardCreator({});

dashboardCreator.render('viewer', '@dashboardId');
```

##### Define user privileges

By default all users are allowed to edit and share dashboards. To restrict privileges - specify scopes by using `userPermissions` argument. In example below user will be able to edit dashboards - however the share feature will be not available.

```typescript
type Scopes = 'share-dashboard' | 'edit-dashboard' | 'edit-dashboard-theme';

const dashboardCreator = new KeenDashboardCreator({
  userPermissions: ['edit-dashboard', 'edit-dashboard-theme'],
});
```

##### Set default timezone for queries

Specify default `timezone` used for new created queries. Provided argument must be compatible with **IANA** [Time Zone Database](https://www.iana.org/time-zones) standard.

```typescript
const dashboardCreator = new KeenDashboardCreator({
  defaultTimezoneForQuery: 'Europe/Warsaw',
});
```

##### Disable timezone selection

Disables possibility to change `timezone` for queries from user interface.

```typescript
const dashboardCreator = new KeenDashboardCreator({
  disableTimezoneSelection: true,
});
```

##### Date Picker

Setup default timezone in widget and disable timezone selection.

```typescript
const dashboardCreator = new KeenDashboardCreator({
  widgetsConfiguration: {
    datePicker: {
      defaultTimezone: 'Etc/UTC',
      disableTimezoneSelection: true
    }
  },
});
```

#### Examples

##### Unmount application

Unmounts Dashboard Creator application from root container.

```typescript
const dashboardCreator = new KeenDashboardCreator();
...
dashboardCreator.destroy();
```

### Project Setup

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
