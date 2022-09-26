import Router, { Context } from "@qpoint/router";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default new Router<Env>()
  .use((ctx: Context, next: Function) => {
    ctx.response = new Response("Hello Qpoint!");

    ctx.waitUntil(new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('done')
        resolve()
      }, 3000)
    }))
  })

// export default {
//   async fetch(
//     request: Request,
//     env: Env,
//     ctx: ExecutionContext
//   ): Promise<Response> {
//     return new Response("Hello World!");
//   },
// };
