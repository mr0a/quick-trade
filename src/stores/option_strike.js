import { writable, get } from 'svelte/store'
import { getDataFromBroker } from '../helper/request'
import {INDEX_TOKENS} from "../constants"

export const option = writable("NIFTY");
export const call_strike = writable("");
export const put_strike = writable("");

export const getStrike = () => {
    const strikes = writable([])
    
    option.subscribe(cur_value => {
        getDataFromBroker('/GetQuotes', {
            exch: "NSE",
            token: INDEX_TOKENS[cur_value]
        }).then(({jsonData}) => {
            console.debug(jsonData)
            let ltp = parseInt(jsonData.lp);
            let call_atm = ltp - ltp % 50
            let put_atm = ltp + ( 50 - ltp % 50)

            call_strike.set(call_atm)
            put_strike.set(put_atm)
            let strike_options = []
            for(let strike = call_atm - 2000; strike < call_atm + 2000; strike = strike + 50){
                strike_options.push(strike)
            }
            strikes.set(strike_options)
        })
    })
    return strikes
}