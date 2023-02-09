import { writable } from "svelte/store";
import { persisted } from 'svelte-local-storage-store'
import { strikeStore, positionStoreCustom, customMarginStore } from "./customStores";
import { EXPIRY_DATES, QUANTITY } from "../constants";

export const brokerStore = persisted('broker_token', {
    "token": "",
    "client_id": "FT013065",
    "broker": 'FlatTrade'
});

export const marginStore = await customMarginStore("margin", {});

// Stores to handle select data
export const optionStore = writable("NIFTY");
export const expiryStore = writable(EXPIRY_DATES[0]);
export const callStrikeStore = strikeStore("17500");
export const putStrikeStore = strikeStore("17500");
export const quantityStore = writable(QUANTITY[0]);

// Stores to handle data about the option and its 
export const exchangeProperties = writable({});

export const realtimeData = writable({})

// Store to subscribe and unsubscribe data
// Maybe make it a list and subscribe to that list and set list to empty when work is done
export const subscribeList = writable([])
export const unsubscribeList = writable([])


// Order Management
export const positionStore = await positionStoreCustom()

// P&L Management
export const plLimitStore = persisted('pllimit', {})

export const stopLossStore = persisted('stoploss', {})



