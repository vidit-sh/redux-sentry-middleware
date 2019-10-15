# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3] - 2019-10-15

### Fixed

- `getTags` transformation fixed, was applying tags to global `scope` and not to locally created `event` scope

## [0.1.2] - 2019-10-15

### Added

- New `CHANGELOG.md`. Starting this version, all changes will be documented.

## [0.1.1] - 2019-08-21

### Security

- Updated `jest` to fix package vulnerabilities

## [0.1.0] - 2019-08-21

### Added

- New transformation function `breadcrumbMessageFromAction`. Read docs [here](https://github.com/vidit-sh/redux-sentry-middleware#breadcrumbmessagefromaction-function).
