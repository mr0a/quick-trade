import { brokerStore, exchangeProperties, quantityStore } from '../stores/writableStores'
import { get } from 'svelte/store'


export const placeOrder = async (symbol, tran_type, qty = 0, stop_loss=0) => {
    let properties = get(exchangeProperties)
    let symbolProps = properties[symbol]
    let lotSize = symbolProps.ls
    if (qty == 0){
        qty = get(quantityStore)
    }
    console.debug("Lot size is ", lotSize)
    let data = {
        exch: "NFO",
        tsym: symbol,
        qty: String(qty * lotSize),
        prc: "0",
        trantype: tran_type,
        prd: stop_loss == 0 ? "M": "H",   // Cover Order
        trailprc: stop_loss == 0 ? "0": "1",
        prctyp: "MKT",
        ret: "DAY",
        blprc: String(stop_loss),
    }
    let { response, jsonData } = await getDataFromBroker('/PlaceOrder', data)
    return { response, jsonData }
}

export const getDataFromBroker = async (endpoint, data = {}) => {
    let url = "https://piconnect.flattrade.in/PiConnectTP"
    let brokerData = get(brokerStore)
    data.uid = brokerData.client_id
    data.actid = brokerData.client_id
    let response = await fetch(url + endpoint, {
        mode: 'cors',
        method: 'POST',
        body: 'jData=' + JSON.stringify(data) + '&jKey=' + brokerData.token
    }).catch(err => {
        console.log(err)
        return err
    })
    if (response.status != 200) {
        return { response }
    }
    let jsonData = await response.json();
    return { response, jsonData };
}