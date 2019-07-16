[![Build Status](https://travis-ci.org/vidit-sh/redux-sentry-middleware.svg?branch=master)](https://travis-ci.org/vidit-sh/redux-sentry-middleware)
[![Latest Version](https://img.shields.io/npm/v/redux-sentry-middleware.svg)](https://www.npmjs.com/package/redux-sentry-middleware)
[![Downloads per month](https://img.shields.io/npm/dm/redux-sentry-middleware.svg)](https://www.npmjs.com/package/redux-sentry-middleware)

# Sentry Middleware for Redux

Logs the type of each dispatched action to Sentry as "breadcrumbs" and attaches
your last action and current Redux state as additional context.

It's a rewrite of [raven-for-redux](https://github.com/captbaritone/raven-for-redux) but with new Sentry unified APIs.

## Installation

    npm install --save redux-sentry-middleware

## Usage

```JavaScript
// store.js

import * as Sentry from "@sentry/browser"; 
// For usage with node 
// import * as Sentry from "@sentry/node";

import { createStore, applyMiddleware } from "redux";
import createSentryMiddleware from "redux-sentry-middleware";

import { reducer } from "./my_reducer";

Sentry.init({
  dsn: '<your dsn>'
});


export default createStore(
    reducer,
    applyMiddleware(
        // Middlewares, like `redux-thunk` that intercept or emit actions should
        // precede `redux-sentry-middleware`.
        createSentryMiddleware(Sentry, {
            // Optionally pass some options here.
        })
    )
);
```

## API: `createSentryMiddleware(Sentry, [options])`

### Arguments

* `Sentry` _(Sentry Object)_: A configured and "installed"
  [Sentry] object.
* [`options`] _(Object)_: See below for detailed documentation.

### Options

While the default configuration should work for most use cases, middleware can be configured by providing an options object with any of the following
optional keys.

#### `breadcrumbDataFromAction` _(Function)_

Default: `action => undefined`

Sentry allows you to attach additional context information to each breadcrumb
in the form of a `data` object. `breadcrumbDataFromAction` allows you to specify
a transform function which is passed the `action` object and returns a `data`
object. Which will be logged to Sentry along with the breadcrumb.

_Ideally_ we could log the entire content of each action. If we could, we
could perfectly replay the user's entire session to see what went wrong.

However, the default implementation of this function returns `undefined`, which means
no data is attached. This is because there are __a few gotchas__:

* The data object must be "flat". In other words, each value of the object must be a string. The values may not be arrays or other objects.
* Sentry limits the total size of your error report. If you send too much data,
  the error will not be recorded. If you are going to attach data to your
  breadcrumbs, be sure you understand the way it will affect the total size
  of your report.

Finally, be careful not to mutate your `action` within this function.

See the Sentry [Breadcrumb documentation].

#### `actionTransformer` _(Function)_

Default: `action => action`

In some cases your actions may be extremely large, or contain sensitive data.
In those cases, you may want to transform your action before sending it to
Sentry. This function allows you to do so. It is passed the last dispatched
`action` object, and should return a serializable value.

Be careful not to mutate your `action` within this function.

If you have specified a [`beforeSend`] when you configured Sentry, note that
`actionTransformer` will be applied _before_ your specified `beforeSend`.

#### `stateTransformer` _(Function)_

Default: `state => state`

In some cases your state may be extremely large, or contain sensitive data.
In those cases, you may want to transform your state before sending it to
Sentry. This function allows you to do so. It is passed the current state
object, and should return a serializable value.

Be careful not to mutate your `state` within this function.

If you have specified a [` beforeSend`] when you configured Raven, note that
`stateTransformer` will be applied _before_ your specified `beforeSend`.

#### `breadcrumbCategory` _(String)_

Default: `"redux-action"`

Each breadcrumb is assigned a category. By default all action breadcrumbs are
given the category `"redux-action"`. If you would prefer a different category
name, specify it here.

#### `filterBreadcrumbActions` _(Function)_

Default: `action => true`

If your app has certain actions that you do not want to send to Sentry, pass
a filter function in this option. If the filter returns a truthy value, the
action will be added as a breadcrumb, otherwise the action will be ignored.
Note: even when the action has been filtered out, it may still be sent to
Sentry as part of the extra data, if it was the last action before an error.

#### `getUserContext` _(Optional Function)_

Signature: `state => userContext`

Sentry allows you to associcate a [user context] with each error report.
`getUserContext` allows you to define a mapping from your Redux `state` to
the user context. When `getUserContext` is specified, the result of
`getUserContext` will be used to derive the user context before sending an
error report. Be careful not to mutate your `state` within this function.

If you have specified a [`beforeSend`] when you configured Raven, note that
`getUserContext` will be applied _before_ your specified `beforeSend`.
When a `getUserContext` function is given, it will override any previously
set user context.

#### `getTags` _(Optional Function)_

Signature: `state => tags`

Sentry allows you to associate [tags] with each report.
`getTags` allows you to define a mapping from your Redux `state` to
an object of tags (key → value). Be careful not to mutate your `state`
within this function.

#### `breadcrumbMessageFromAction` _(Function)_

Default: `action => action.type`

`breadcrumbMessageFromAction` allows you to specify a transform function which is passed the `action` object and returns a `string` that will be used as the message of the breadcrumb.

By default `breadcrumbMessageFromAction` returns `action.type`.

Finally, be careful not to mutate your `action` within this function.

See the Sentry [Breadcrumb documentation](https://docs.sentry.io/enriching-error-data/breadcrumbs/?platform=javascript).