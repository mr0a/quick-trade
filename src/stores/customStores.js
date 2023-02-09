import { readable, writable, get, derived } from "svelte/store";
import { getDataFromBroker } from '../helper/flattrade'
import { addToWatchlist } from '../helper/helper'
import { IndexProperties } from "../constants"
import { subscribeWS, unsubscribeWS, handleWSData } from '../helper/webSocket';
import { optionStore, subscribeList, unsubscribeList, brokerStore, exchangeProperties } from "./writableStores";
import { persisted } from "svelte-local-storage-store";


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
    if (typeof window !== "undefined") {
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
            addToWatchlist(newOption).then(() => {
                unsubscribeList.update(dataList => {
                    dataList.push(oldOption)
                    return dataList
                })
                subscribeList.update(dataList => {
                    dataList.push(newOption)
                    return dataList
                })
            })
            oldOption = newOption;
            set(newOption)
        })
    })

    return readableStore
}


export const customMarginStore = async () => {

    let marginStore = persisted('margin', {});

    const refresh = async () => {

        getDataFromBroker('/Limits', {
            actid: get(brokerStore).client_id
        }).then(({ response, jsonData }) => {
            console.debug(response);
            if (response.status == 200) {
                marginStore.set(jsonData);
            }
        });
    }
    await refresh();
    return { ...marginStore, refresh }

}


export const positionStoreCustom = async () => {
    let positionStore = writable({});

    const refresh = async () => {
        let { response, jsonData } = await getDataFromBroker('/PositionBook', {
            actid: get(brokerStore).client_id
        });
        if (response.status == 200) {
            if (jsonData?.stat == "Not_Ok") {
                return;
            }
            let positions = jsonData.map((pos) => {
                let buy_or_sell = '-';
                if (parseInt(pos.daybuyqty) > parseInt(pos.daysellqty)) {
                    buy_or_sell = 'B';
                } else if (parseInt(pos.daybuyqty) < parseInt(pos.daysellqty)) {
                    buy_or_sell = 'S';
                }
                let position = {
                    name: pos.dname,
                    net_qty: parseInt(pos.netqty),
                    net_avgprc: parseFloat(pos.netavgprc),
                    ltp: parseFloat(pos.lp),
                    pnl: parseFloat(pos.rpnl),
                    isOpen: parseInt(pos.netqty) != 0,
                    type: buy_or_sell,
                    buy_qty: pos.daybuyqty,
                    sell_qty: pos.daysellqty,
                    buy_price: pos.daybuyavgprc,
                    sell_price: pos.daysellavgprc,
                    exchange: pos.exch,
                    token_symbol: pos.tsym,
                    token: pos.token,
                    prd_type: pos.prd,
                    stop_loss: parseInt(pos.netqty) != 0 ? parseInt(pos.daybuyavgprc) - 10 : 0,
                    bep: pos.bep,
                };
                addToWatchlist(pos.tsym).then(() => {
                    subscribeList.update((dataList) => {
                        dataList.push(pos.tsym);
                        return dataList;
                    });
                })
                return position;
            });
            positionStore.set(positions);
        }
    }
    await refresh();

    return { ...positionStore, refresh }

}