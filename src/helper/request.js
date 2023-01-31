import {brokerStore} from '../stores/broker_details'
import {get} from 'svelte/store'


export const getDataFromBroker = async (endpoint, data = {}) => {
    let url = "https://piconnect.flattrade.in/PiConnectTP"
    let brokerData = get(brokerStore)
    data.uid = brokerData.client_id
    let response = await fetch(url + endpoint, {
        mode: 'cors',
        method: 'POST',
        body: 'jData=' + JSON.stringify(data) + '&jKey=' + brokerData.token
    })
    let jsonData = await response.json();
    return {response, jsonData};
}