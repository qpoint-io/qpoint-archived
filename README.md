# Qpoint

Intelligence at the edge - an edge router framework

Compose powerful edge capabilities to analyze, transform, reject, or proxy traffic as it passes through the edge to your apps. 

Designed to run within [worker runtimes](https://workers.js.org/), a qpoint router can be deployed trivially to edge networks like [Cloudflare Workers](https://workers.cloudflare.com/) and [Deno Deploy](https://deno.com/deploy), or with the help of [Qpoint](https://qpoint.io), deploy to any platform including your own servers.

## Example

```ts
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
```ts
router.use((ctx: Context, next: Function) => {
  
  // check for the Authorization header
  if (!ctx.request.headers.has("Authorization")) {
    // set the response to unauthorized
    ctx.response = new Response(null, { status: 401 });

    // return without calling next() to terminate the chain
    return
  }

  // continue the chain to the next
  return next();
})

```

## Context, Request and Response

Each adapter receives a Qpoint [Context](https://github.com/qpoint-io/qpoint/blob/main/src/context.ts) object that wraps an incoming request and the corresponding response. `ctx` is often used as the parameter name for the context object.

```ts
router.use(async (ctx: Context, next: Function) => { await next(); });
```

After each of the adapters have run, the response as set on the context will be returned. 


### Proxies and Load Balancers

A very common case for Qpoint is building intelligent proxies and load balancers, and since the original Request object cannot be modified, the `proxy` is a copy of the original request that can be `fetch`ed by a proxy or load-balancer adapter. 

In such a scenario, adapters that need to modify the request before a proxy fetch occurs will sequencially modify or replace the `proxy` instance as the chain progresses.

