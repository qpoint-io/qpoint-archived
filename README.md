# Qpoint

Intelligence at the edge - an edge router framework

Compose powerful edge capabilities to analyze, transform, reject, or proxy traffic as it passes through the edge to your apps. 

Designed to run within [worker runtimes](https://workers.js.org/), a qpoint router can be deployed trivially to edge networks like [Cloudflare Workers](https://workers.cloudflare.com/) and [Deno Deploy](https://deno.com/deploy), or with the help of [Qpoint](https://qpoint.io), deploy to any platform including your own servers.

## Example

```js
import Router from '@qpoint/router'
import proxy from '@qpoint/proxy'
import maskUrls from '@qpoint/mask-urls'
import replaceContent from '@qpoint/replace-content'
import rewriteHtml from '@qpoint/rewrite-html'

// initialize and export the router
export default new Router()

  // proxy request to app
  .use(proxy({ appUrl:"https://qdemo.io" }))

  // mask urls in html response
  .use(maskUrls())

  // replace occurrences of qdemo with qpoint
  .use(replaceContent({ rules: [{ from: 'qdemo', to: 'qpoint' }] }))

  // rewrite html (trigger htmlrewriter rules)
  .use(rewriteHtml())
```

## Composable adapters

Adapters are middleware functions to be executed in a chain, each potentially modifying the request/response until finally returning the response.

Example: Reject the request (at the edge) if no auth is provided
```js
router.use((context: Context, next: Function) => {
  
  // check for the Authorization header
  if (!context.request.headers.has("Authorization")) {
    // set the response to unauthorized
    context.response = new Response(null, { status: 401 });

    // return without calling next() to terminate the chain
    return
  }

  // continue the chain to the next
  return next();
})

```


