// Next.js requires the middleware entrypoint to be named `middleware.ts`.
// Per project convention, the actual logic lives in `proxy.ts`.
export { proxy as middleware, config } from "./proxy";
