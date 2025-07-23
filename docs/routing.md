The concept of routing is crucial for web application navigation. Traditionally, visiting a website involved making a server request for each click or interaction, leading to the loading of a new HTML page. However, Single-Page Applications (SPAs) have transformed this approach.

SPAs provide a dynamic and interactive user experience by loading a single HTML page initially and updating its content dynamically as users interact. Routing in SPAs refers to how the application manages different views or "pages" based on the URL or user interactions, all without full page reloads. This client-side navigation leads to faster load times, smoother transitions, and a more engaging user experience.

## URL hash fragment
In a traditional web application, each page typically corresponds to a distinct URL, and navigating between pages triggers a request to the server, resulting in the loading of a new page. However, in the context of SPAs, only a single HTML page is initially loaded and subsequent interactions dynamically update content. To make this work, there are two questions that we need to address:

1. How can we make sure the server always returns the same page (the index.html) for any URL?
2. How can the framework be aware of the URL changes and update the view accordingly?

https://example.com/page#section2, #section2 is the hash fragment that points to a specific section of the page on the example.com website. The hash fragment of a URL, also known as the fragment identifier, appears after the '#' symbol in a URL:

https: // example.com : 8080 /something/ ?query=abc123 #/fooBarBaz

⎣____⎦    ⎣__________⎦  ⎣__⎦ ⎣________⎦ ⎣____________⎦ ⎣________⎦
protocol     domain     port    path      parameters      hash


> The key characteristic of the hash fragment is that it is not sent to the server as part of the HTTP request. Instead, it is handled entirely client-side by the web browser.

How can your framework be aware of the URL changes and update the view accordingly? The answer lies in the popstate event.

The "**popstate**" event is part of the History API, which allows web applications to manage the browser’s history stack. This event is triggered when the active history entry changes, which generally occurs when the user navigates the session history by clicking the back or forward buttons, or when history.back(), history.forward(), or history.go() methods are called programmatically. However, the event is not triggered by:

- Direct URL changes (e.g. typing a new URL in the address bar or using window.location to navigate).
- Navigating to a different domain or reloading the page.

```js
window.addEventListener('popstate', (event) => {
  console.log(`The URL has changed to: ${window.location.href}`)
  console.log('Current state:', event.state)
})
```

Now, you can push a new state to the history stack using the pushState() method, which adds a new entry to the history stack and changes the URL of the current page without triggering a full page reload

`history.pushState({ page: 1 }, '', '?page=1')`


SPAs manage view with `History API`

```js
history.pushState(state, unused, url) — Adds a new entry to the history stack.
- state: A JavaScript object associated with the new history entry.
- unused: This parameter exists for historical reasons, and cannot be omitted; the MDN docs recommend to pass an empty string.
- url: A string representing the new URL (must be same-origin).

history.back() — Navigates to the previous entry in the history stack.
history.forward() — Navigates to the next entry in the history stack.
```

To navigate between the pages of your SPA, you can use the pushState() method to change the hash fragment of the URL and update the view accordingly. 

## Example
```js
const routes = [
  {
    path: '/user/:id',
    component: User
  },
  {
    path: '/user/:id/config',
    component: UserConfig
  },
  // REDIRECT
  {
    path: '/profile',
    redirect: '/user'
  },
  {
    path: '/user',
    component: User
  },
  // CATCH ROUTES
  {
    path: '*',
    component: NotFound>
  }
]

history.pushState({}, '', '#/home')     // navigate to home
history.pushState({}, '', '#/about')    // same...
history.pushState({}, '', '#/contact')
```

Clicking on a link with a hash fragment will trigger a full page reload by default. We don’t want this to happen in an SPA, so you need to prevent the default behavior

```js
<a href="#/about" onclick="navigateToAbout">About</a>

function navigateTo(event) {
    event.preventDefault();
    history.pushState({}, '', event.target.href)
}
```

But, at this point, we’ve only updated the URL—​you still need to update the view based on the new URL. This is where the **popstate** event comes into play.

