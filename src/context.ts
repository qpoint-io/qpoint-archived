// The Context is a wrapper around the request/response
// 
// Each adapter (middleware function) will be passed an instance
// of the context, wrapped around the request and response as an argument.
// 
// After each of the adapters have run, the response as set on the
// context will be returned. 
// 
// A very common case for Qpoint is building intelligent proxies and load balancers,
// and since the original Request object cannot be modified, the `proxy` is a copy
// of the original request that can be `fetch`ed by a proxy or load-balancer adapter.
// In such a scenario, adapters that need to modify the request before a proxy fetch
// occurs will sequencially modify or replace the `proxy` instance as the chain progresses.
export class Context<Env = any> {
  request     : Request           // the initial request (read-only)
  env         : Env               // the custom worker env & bindings
  ctx         : ExecutionContext  // execution context of the event
  state       : Object            // generic object for sharing data between adapters
  requestId   : string            // a unique id for this request
  url         : string            // the URL object from the initial request
  proxy       : Request           // a copy of the original request, modified by the adapters
  response    : Response          // the final response to send back
  duration    : number            // the total duration of time for the request/response
  htmlRewriter: HTMLRewriter      // a rewriter instance for modifying html as a stream

  constructor(request: Request, env: Env, ctx: ExecutionContext, state: Object = {}) {
    // set the request from the event
    this.request = request;

    // set the env from the event
    this.env = env;

    // set the execution context of the runtime
    this.ctx = ctx;

    // allow the router init to set the initial state
    this.state = state;

    // create a random request ID
    this.requestId = generateId(24);

    // set the url initially to that of the request
    this.url = request.url;

    // create a copy of the initial request, which will presumably be modified heavily
    this.proxy = new Request(this.request);

    // the final response, set to a 404 initially
    this.response = new Response(null, { status: 404 });

    // set the duration to 0 to start
    this.duration = 0;

    // initialize an html rewriter instance
    this.htmlRewriter = new HTMLRewriter();
  }

  // Any async work that should not hold-up the response
  waitUntil(fn: Promise<any>) {
    this.ctx.waitUntil(fn);
  }
}

// Generate a random id
function generateId(length: number = 10) {
  // declare available seeds
  const seed = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += seed.charAt(Math.floor(Math.random() * seed.length));
  }

  return str;
}