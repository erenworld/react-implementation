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

function makeMatcherWithoutParams(route) {
    const regex = makeRouteWithoutParamsRegex(route);
    const isRedirect = typeof route.redirect === 'string';

    return {
        route,
        isRedirect,
        checkMatch(path) {
            return regex.test(path);
        },
        extractParams() {
            return {};
        },
        extractQuery,
    }
}

function extractQuery(path) {
    const queryIndex = path.indexOf('?');

    if (queryIndex === -1) {
        return {};
    }

    const search = new URLSearchParams(path.slice(queryIndex + 1));

    return Object.entries(search.entries());
}

// const route = { path: '/home' }
// const matcher = makeMatcherWithoutParams(route)

// matcher.checkMatch('/users') // false
// matcher.checkMatch('/home') // true

// matcher.extractQuery('/home') // {}
// matcher.extractQuery('/home?tab=profile') // { tab: 'profile' }
