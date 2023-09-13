export { S, isSignal } from "src/signals-lib.js";
import { signals_config } from "src/signals-lib.js";
import { registerReactivity } from "src/signals-common.js";
registerReactivity(signals_config);
