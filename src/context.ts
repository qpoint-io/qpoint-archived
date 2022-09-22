// A context object that will be provided to each middleware
// 
// The general idea is that the "proxy" request is either manipulated
// or replaced with each middleware until finally one of the middleware
// fetches the request and sets the response, at which point
// the "response" is then manipulated and transformed by the middleware
// until all middleware has completed. Finally, the router will return
// what is left of the final response.
export class Context {
  state       : Object
  event       : FetchEvent
  request     : Request
  requestId   : string
  url         : string
  proxy       : Request
  response    : Response
  duration    : number
  htmlRewriter: HTMLRewriter

  constructor(event: FetchEvent, state: Object = {}) {
    // A generic state object for sharing data between adapters
    this.state = state;

    // the fetch event
    this.event = event;

    // the initial edge request
    this.request = event.request;

    // set the request ID
    this.requestId = generateId(24);

    // set the url initially to that of the request
    this.url = event.request.url;

    // the proxy request (a copy, initially, which will presumable be modified heavily)
    this.proxy = new Request(this.request);

    // the final response
    this.response = new Response(null, { status: 404 });

    // the duration of the proxy request/response
    this.duration = 0;

    // an html rewriter
    this.htmlRewriter = new HTMLRewriter();
  }

  waitUntil(fn: Promise<any>) {
    this.event.waitUntil(fn);
  }
}

const generateId = (length: number = 10) => {
  // declare available seeds
  const seed = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += seed.charAt(Math.floor(Math.random() * seed.length));
  }

  return str;
}