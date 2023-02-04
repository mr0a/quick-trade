import { readable, writable, get, derived } from "svelte/store";
import { getDataFromBroker } from '../helper/flattrade'
import { IndexProperties } from "../constants"
import { subscribeWS, unsubscribeWS, handleWSData } from '../helper/webSocket';
import { optionStore, subscribeList, unsubscribeList, brokerStore, exchangeProperties } from "./writableStores";


export const strikeStore = (initialValue) => {
    const strikePrice = writable(initialValue);
    return strikePrice
}

export const indexStore = () => {
    const store = writable({ name: "", token: "", exchange: "NSE" });

    optionStore.subscribe(async (selectedIndex) => {

        let OptionProps = IndexProperties[selectedIndex];
        if (OptionProps == undefined) return;
        let { response, jsonData } = await getDataFromBroker('/GetQuotes', {
            exch: OptionProps.exchange,
            token: OptionProps.token
        })
        if (response.status != 200) {
            console.debug("Failed to get data from broker")
            return;
        }
        console.debug(jsonData)
        exchangeProperties.update(value => {
            value[selectedIndex] = jsonData;
            return value;
        })

        store.update(data => {
            unsubscribeList.update(list => {
                list.push(data.name);
                return list
            })
            data.name = selectedIndex,
                data.token = OptionProps.token
            subscribeList.update(list => {
                list.push(selectedIndex);
                return list;
            })
            return data
        })
    })
    return store;
}

export const wsocketStore = () => {
    if(typeof window !== "undefined"){
        const ws = new WebSocket('wss://piconnect.flattrade.in/PiConnectWSTp/');
        let brokerData = get(brokerStore)
        let data = {
            uid: brokerData.client_id,
            actid: brokerData.client_id,
            susertoken: brokerData.token,
            source: 'API',
            t: 'c'
        };
    
        ws.addEventListener('open', (event) => {
            ws.send(JSON.stringify(data));
        })
    
        ws.addEventListener('message', (event) => {
            let jsonData = JSON.parse(event.data);
            if (jsonData.t == 'ck') {
                console.debug('Connect acknowledge received');
                ws.addEventListener('message', handleWSData);
                subscribeList.subscribe((value) => {
                    if (value.length != 0) {
                        subscribeWS(ws, value)
                        subscribeList.set([])
                    }
                })
                unsubscribeList.subscribe(value => {
                    if (value.length != 0) {
                        unsubscribeWS(ws, value)
                        unsubscribeList.set([])
                    }
                })
            }
        })
    
        const store = readable(ws);
        return store
    }
}


export const unsubAndSubDerivedReadableStore = (stores, callback) => {

    let oldOption = "";

    const derivedStore = derived(stores, callback, "");

    const readableStore = readable("", (set) => {
        derivedStore.subscribe(async (newOption) => {

            let { response, jsonData } = await getDataFromBroker('/SearchScrip', {
                exch: "NFO",
                stext: newOption
            })
            if (response.status != 200) {
                console.debug("Failed to get data from broker")
                return;
            }
            exchangeProperties.update(value => {
                let respValues = jsonData["values"][0]
                value[newOption] = respValues
                return value;
            })
            unsubscribeList.update(dataList => {
                dataList.push(oldOption)
                return dataList
            })
            subscribeList.update(dataList => {
                dataList.push(newOption)
                return dataList
            })
            oldOption = newOption;
            set(newOption)
        })
    })

    return readableStore
}