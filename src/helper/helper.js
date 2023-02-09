import { getDataFromBroker } from "./flattrade"
import { IndexProperties } from "../constants"
import { callStrikeStore, putStrikeStore, exchangeProperties } from "../stores/writableStores"
import { get } from "svelte/store"


export const getOptionStrikes = async (index_name) => {
    let exchangeProps = get(exchangeProperties);
    let jsonData = exchangeProps[index_name]
    let ltp = parseInt(jsonData.lp);
    let strike_multiple = IndexProperties[index_name].strike_multiple
    
    let call_atm = ltp - ltp % strike_multiple
    let put_atm = ltp + (strike_multiple - ltp % strike_multiple)

    callStrikeStore.set(call_atm)
    putStrikeStore.set(put_atm)

    let strike_options = [];
    for (let strike = call_atm - strike_multiple * 15; strike < call_atm + strike_multiple * 15; strike = strike + strike_multiple) {
        strike_options.push(strike)
    }
    return strike_options;
}


export async function addToWatchlist(optionName) {
    let { response, jsonData } = await getDataFromBroker('/SearchScrip', {
        exch: "NFO",
        stext: optionName
    })
    if (response.status != 200) {
        console.debug("Failed to get data from broker")
        return;
    }
    exchangeProperties.update(value => {
        let respValues = jsonData["values"][0]
        value[optionName] = respValues
        return value;
    })
}

