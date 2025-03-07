export { signal, S, isSignal } from "./src/signals-lib/signals-lib.js";
import { signals_config } from "./src/signals-lib/signals-lib.js";
import { registerReactivity } from "./src/signals-lib/common.js";
registerReactivity(signals_config);
