import { scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

function customSignalLogic() {
  // Create an isolated scope for a specific operation
  scope.push(); // Start new scope

  // These signals are in the new scope
  const isolatedCount = S(0);
  const isolatedDerived = S(() => isolatedCount.get() * 2);

  // Clean up by returning to previous scope
  scope.pop();
}
