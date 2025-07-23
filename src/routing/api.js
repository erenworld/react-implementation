const CATCH_ALL_ROUTES = '*';

// type RouteMatcher = {
//     route: Route;
//     isRedirect: boolean;
  
//     checkMatch: (path: string) => boolean;
//     extractParams: (path: string) => { [x: string]: string };
//     extractQuery: (path: string) => { [x: string]: string };
// };

export function makeRouteMatcher(route) {
    return routeHasParams(route)
        ? makeMatcherWithParams(route)
        : makeMatcherWithoutParams(route);
}

function routeHasParams({ path }) {
    return path.includes(':');
}

function makeRouteWithoutParamsRegex({ path }) {
    if (path === CATCH_ALL_ROUTES) {
        return new RegExp('^.*$');
    }

    return new RegExp(`${path}`);
}
