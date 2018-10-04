[![Build Status](https://travis-ci.org/ViditIsOnline/redux-sentry-middleware.svg?branch=master)](https://travis-ci.org/ViditIsOnline/redux-sentry-middleware)

# Sentry Middleware for Redux

Logs the type of each dispatched action to Raven as "breadcrumbs" and attaches
your last action and current Redux state as additional context.

Inspired by [raven-for-redux](https://github.com/captbaritone/raven-for-redux).

## Installation

    npm install --save redux-sentry-middleware

## Usage

### Browser
