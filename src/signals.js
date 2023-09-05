export { S, isSignal, watch } from "./signals-lib.js";
import { signals_config } from "./signals-lib.js";
import { registerReactivity } from "./signals-common.js";
registerReactivity(signals_config);
