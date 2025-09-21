declare module "event-source-polyfill" {
  import { EventSource as NativeEventSource } from "eventsource";

  export const EventSourcePolyfill: typeof NativeEventSource;
  export default EventSourcePolyfill;
}
