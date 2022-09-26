import compose from 'koa-compose'
import { Context } from './context'

// The Qpoint router: a middleware pattern for handling requests
export class Router<Env = any> {
  state: Object
  stack: Function[]

  constructor(state: Object = {}) {
    // initial state to seed the context
    this.state = state;

    // the middleware stack
    this.stack = [];
  }

  // The api for registering a plugin
  use(fn: Function) {
    // add to middleware
    this.stack.push(fn);

    // return self to allow chaining
    return this;
  }

  // Respond to the fetch event
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // initialize a context
    const context = new Context<Env>(request, env, ctx, this.state);

    // compose the request middlewares
    const run = compose(this.stack);

    // run the stack
    await run(context);

    // return the response
    return context.response;
  }
}