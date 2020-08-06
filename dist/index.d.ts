export * from "./common";
export * from "./input";
export * from "./state";
import { Entity, World } from "ecsy";
import InputMap from "./input/interfaces/InputMap";
import SubscriptionMap from "./subscription/interfaces/SubscriptionMap";
import StateMap from "./state/interfaces/StateMap";
export declare function initializeInputSystems(world: World, options?: {
    debug: boolean;
}): World | null;
export declare function initializeActor(entity: Entity, options: {
    inputMap?: InputMap;
    stateMap?: StateMap;
    subscriptionMap?: SubscriptionMap;
    debug?: boolean;
}): Entity;
