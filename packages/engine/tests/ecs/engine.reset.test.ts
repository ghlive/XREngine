import { initializeEngine } from "../../src/initialize";
import { Engine } from "../../src/ecs/classes/Engine";
import { addComponent, createEntity } from "../../src/ecs/functions/EntityFunctions";
import { Component } from "../../src/ecs/classes/Component";
import { Entity } from "../../src/ecs/classes/Entity";
import { execute, resetEngine } from "../../src/ecs/functions/EngineFunctions";
import { CharacterInputSchema } from "../../src/templates/character/CharacterInputSchema";
import { DefaultNetworkSchema } from "../../src/templates/network/DefaultNetworkSchema";
import { CharacterStateSchema } from "../../src/templates/character/CharacterStateSchema";
import { CharacterSubscriptionSchema } from "../../src/templates/character/CharacterSubscriptionSchema";

const options = {
  debug: true,
  withTransform: true,
  withWebXRInput: false,
  audio: {
    enabled: false,
    src: '',
    volume: 0.5,
    autoplay: true,
    loop: true,
    positional: true,
    refDistance: 20,
  },
  input: {
    enabled: true,
    schema: CharacterInputSchema
  },
  assets: {
    enabled: true
  },
  networking: {
    enabled: false,
    supportsMediaStreams: false,
    schema: DefaultNetworkSchema
  },
  state: {
    enabled: true,
    schema: CharacterStateSchema
  },
  subscriptions: {
    enabled: true,
    schema: CharacterSubscriptionSchema
  },
  physics: {
    enabled: false
  },
  particles: {
    enabled: false
  },
  camera: {
    enabled: true
  },
  transform: {
    enabled: true
  },
  renderer: {
    enabled: false
  }
}



describe("entityPoolIsClean check", () => {
  it("pass if pool is clean", () => {
    const entity = createEntity()
    // check that pool is empty
    expect(Engine.entityPool.freeList.length).toBe(0)

    // add clean entity into clean pool
    Engine.entityPool.freeList.push(entity)
    // check that function works
    expect(entityPoolIsClean()).toBe(true)

    // return pool back to normal
    Engine.entityPool.freeList.length = 0
  })

  it("fails if pool is dirty", () => {
    const entity = createEntity()
    class UniqueTestComponent extends Component<UniqueTestComponent> { }
    addComponent(entity, UniqueTestComponent)

    // make mess in the pool
    Engine.entityPool.freeList.push(entity)
    // check that function works
    expect(entityPoolIsClean()).toBe(false)

    // remove our entity
    Engine.entityPool.freeList.pop()
  })
})

test("Engine reset should work", () => {
  const EngineInitialState = {
    enabled: Engine.enabled,
    deferredRemovalEnabled: Engine.deferredRemovalEnabled
  }

  initializeEngine(options)

  // run once to make sure all "added" queries is processed
  execute()

  jest.spyOn(Engine.eventDispatcher, 'reset')

  resetEngine()

  expect(Engine.renderer).toBeNull()
  expect(Engine.scene).toBeNull()
  expect(Engine.camera).toBeNull()
  expect(Engine.eventDispatcher.reset).toBeCalled()
  expect(Engine.enabled).toBe(EngineInitialState.enabled)
  expect(Engine.deferredRemovalEnabled).toBe(EngineInitialState.deferredRemovalEnabled)
  expect(Engine.systems.length).toBe(0)
  expect(Engine.entities.length).toBe(0)
  expect(Engine.queries.length).toBe(0)
  expect(Engine.components.length).toBe(0)
  expect(Engine.nextEntityId).toBe(0)
  expect(Engine.nextComponentId).toBe(0)
  expect(Engine.componentsMap).toMatchObject({})
  expect(Engine.componentPool).toMatchObject({})
  expect(Engine.numComponents).toMatchObject({})
  expect(Engine.entitiesWithComponentsToRemove.length).toBe(0)
  expect(Engine.entitiesToRemove.length).toBe(0)
  expect(Engine.systemsToExecute.length).toBe(0)

  // Engine.entityPool
  // Engine.entityPool.freeList should be propagated with reset Entities
  expect(entityPoolIsClean()).toBe(true)
})

function entityPoolIsClean():boolean {
  // Engine.entityPool.freeList should be propagated with empty Entities
  return !Engine.entityPool.freeList.find( (entity:Entity):boolean => {
    // search for first not clean entity
    return !!(entity.componentTypes.length
      || entity.componentTypesToRemove.length
      || entity.queries.length
      || Object.keys(entity.components).length
      || Object.keys(entity.componentsToRemove).length)
  })
}