export { observable, O, isObservable } from "./src/observables-lib.js";
import { observables_config } from "./src/observables-lib.js";
import { registerReactivity } from "./src/observables-common.js";
registerReactivity(observables_config);
