import { get } from "svelte/store"
import { wsocketStore, indexStore, unsubAndSubDerivedReadableStore } from "./customStores"
import { expiryStore, putStrikeStore, callStrikeStore, optionStore } from "./writableStores"

export const ws = wsocketStore()


// Store to manage index data after updating the requirements
export const indexDataStore = indexStore()

export const callOption = unsubAndSubDerivedReadableStore([expiryStore, callStrikeStore], (values) => {
    let index = get(optionStore)
    values[0] = values[0].replaceAll('-', '').replace('2023', '23')
    let finalValue = [index, values[0], 'C', values[1]]
    return finalValue.join('')
})

export const putOption = unsubAndSubDerivedReadableStore([expiryStore, putStrikeStore], (values) => {
    let index = get(optionStore)
    values[0] = values[0].replaceAll('-', '').replace('2023', '23')
    let finalValue = [index, values[0], 'P', values[1]]
    return finalValue.join('')
})

