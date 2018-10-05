const identity = x => x;
const getUndefined = () => {};
const filter = () => true;

const createSentryMiddleware = (Sentry, options = {}) => {
  const {
    breadcrumbDataFromAction = getUndefined,
    actionTransformer = identity,
    stateTransformer = identity,
    breadcrumbCategory = "redux-action",
    filterBreadcrumbActions = filter,
    getUserContext,
    getTags
  } = options;

  return store => {
    let lastAction;

    Sentry.configureScope(scope => {
      scope.addEventProcessor(async (event, hint) => {
        const state = store.getState();
        scope.setExtra("lastAction", actionTransformer(lastAction));
        scope.setExtra("state", stateTransformer(state));

        if (getUserContext) {
          scope.setUser(getUserContext(state));
        }
        if (getTags) {
          const tags = getTags(state);
          Object.keys(tags).forEach(key => {
            scope.setTag(key, tags[key]);
          });
        }
        return event;
      });
    });

    return next => action => {
      if (filterBreadcrumbActions(action)) {
        Sentry.addBreadcrumb({
          category: breadcrumbCategory,
          message: action.type,
          level: "info",
          data: breadcrumbDataFromAction(action)
        });
      }

      lastAction = action;
      return next(action);
    };
  };
};

module.exports = createSentryMiddleware;
