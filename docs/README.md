# RapidOM Schema

`TypeScript` ready schema validator

[![Build Status][BUILD_BADGE]][BUILD_URI]
[![Coverage Status][COVERAGE_BADGE]][COVERAGE_URI]
[![NPM Version][VERSION_BADGE]][NPM_URI]
[![npm bundle size (minified)][MINIFIED_BADGE]][NPM_URI]
[![npm bundle size (minified + gzip)][GZIP_BADGE]][NPM_URI]
[![NPM Monthly Downloads][MONTHLY_DOWNLOADS_BADGE]][NPM_URI]
[![NPM Total Downloads][TOTAL_DOWNLOADS_BADGE]][NPM_URI]
[![Dependencies Status][DEPENDENCY_STATUS_BADGE]][DEPENDENCY_STATUS_URI]
[![Open Issues][OPEN_ISSUES_BADGE]][OPEN_ISSUES_URI]
[![Pull Requests][PR_BADGE]][PR_URI]
[![License][LICENSE_BADGE]][LICENSE_URI]

## Table of Content

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Getting Started

### Installation

NPM / GitHub Packages:

```shell
npm i @rapidom/schema
```

Yarn:

```shell
yarn add @rapidom/schema
```

### Usage

```typescript
import Schema from "@rapidom/schema";

const schema = {
  username: Schema.string()
    .alphanum()
    .required(),
  name: Schema.object().keys({
    first: Schema.string()
      .min(3)
      .required(),
    last: Schema.string().min(3),
  }).required(),
  datetime: Schema.date().default(Date.now),
};

try {
  const result = Schema.object().keys(schema).validate(value);
} catch (error) {
  // your error handler
}
```

## Authors

- **Ardalan Amini** - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/rapidom/schema/contributors) who participated in this project.

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see
the [releases](https://github.com/rapidom/schema/releases).

## License

This project is licensed under the MIT License - see the [LICENSE][LICENSE_URI] file for details


[BUILD_BADGE]: https://github.com/rapidom/schema/workflows/Test/badge.svg

[BUILD_URI]: https://github.com/rapidom/schema/actions

[COVERAGE_BADGE]: https://codecov.io/gh/rapidom/schema/branch/main/graph/badge.svg

[COVERAGE_URI]: https://codecov.io/gh/rapidom/schema

[VERSION_BADGE]: https://img.shields.io/npm/v/@rapidom/schema.svg

[MINIFIED_BADGE]: https://img.shields.io/bundlephobia/min/@rapidom/schema.svg

[GZIP_BADGE]: https://img.shields.io/bundlephobia/minzip/@rapidom/schema.svg

[MONTHLY_DOWNLOADS_BADGE]: https://img.shields.io/npm/dm/@rapidom/schema.svg

[TOTAL_DOWNLOADS_BADGE]: https://img.shields.io/npm/dt/@rapidom/schema.svg

[DEPENDENCY_STATUS_BADGE]: https://david-dm.org/rapidom/schema.svg

[DEPENDENCY_STATUS_URI]: https://david-dm.org/rapidom/schema

[OPEN_ISSUES_BADGE]: https://img.shields.io/github/issues-raw/rapidom/schema.svg

[OPEN_ISSUES_URI]: https://github.com/rapidom/schema/issues?q=is%3Aopen+is%3Aissue

[PR_BADGE]: https://img.shields.io/badge/PRs-Welcome-brightgreen.svg

[PR_URI]: https://github.com/rapidom/schema/pulls

[LICENSE_BADGE]: https://img.shields.io/github/license/rapidom/schema.svg

[LICENSE_URI]: https://github.com/rapidom/schema/blob/main/LICENSE

[NPM_URI]: https://www.npmjs.com/package/@rapidom/schema
