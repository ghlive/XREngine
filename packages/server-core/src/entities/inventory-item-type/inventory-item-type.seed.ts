import { inventoryItemType } from './inventoryItemType'

export const inventoryItemTypeSeed = {
  path: 'inventory-item-type',
  randomize: false,
  templates: [
    { type: inventoryItemType.scene },
    { type: inventoryItemType.inventory },
    { type: inventoryItemType.project }
  ]
}
