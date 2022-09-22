import compose from 'koa-compose'
import { Context } from './context'

// The Qpoint router: a middleware pattern for handling requests
export class Router {
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
  async fetch(event: FetchEvent) {
    // initialize a context
    const context = new Context(event, this.state);

    // compose the request middlewares
    const run = compose(this.stack);

    // run the stack
    await run(context);

    // return the response
    return context.response;
  }

  // Legacy, this pattern has been deprecated. Expose fetch directly instead
  listen() {
    addEventListener("fetch", event => {
      event.respondWith(this.fetch(event));
    })
  }
}