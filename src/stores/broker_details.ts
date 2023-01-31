import { persisted } from 'svelte-local-storage-store'
// import { get, writable } from 'svelte/store';

export const brokerStore = persisted('broker_token', {
    "token": "",
    "client_id": "FT013065",
    "broker": 'FlatTrade'
});
export const marginStore = persisted("margin", {});