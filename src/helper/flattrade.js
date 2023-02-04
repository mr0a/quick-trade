import { brokerStore, exchangeProperties } from '../stores/writableStores'
import { get } from 'svelte/store'


export const placeOrder = async (symbol, qty, tran_type, stop_loss) => {
    let properties = get(exchangeProperties)
    let symbolProps = properties[symbol]
    let lotSize = symbolProps.ls
    console.debug("Lot size is ", lotSize)
    let data = {
        exch: "NFO",
        tsym: symbol,
        qty: String(qty * lotSize),
        prc: "0",
        trantype: tran_type,
        prd: "H",   // Cover Order
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
    })
    if (response.status != 200) {
        return { response }
    }
    let jsonData = await response.json();
    return { response, jsonData };
}