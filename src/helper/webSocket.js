import { realtimeData, exchangeProperties, positionStore, marginStore } from "../stores/writableStores";
import { get } from "svelte/store";

export const handleWSData = (event) => {
    let jsonData = JSON.parse(event.data);

    switch (jsonData.t) {
        case "tk":
            console.debug("Acknowledgement received for subscription ", jsonData.e, jsonData.tk)
            realtimeData.update(value => {
                value[jsonData.tk] = { ...value[jsonData.tk], ...jsonData }
                return value
            })
            break;

        case "tf":
            realtimeData.update(value => {
                value[jsonData.tk] = { ...value[jsonData.tk], ...jsonData }
                return value
            })
            break;

        case "u":
            break;

        // case "om":
        //     break;

        default:
            positionStore.refresh();
            marginStore.refresh();
            break;
    }
}

export const subscribeWS = (websocket, value) => {
    if (value == []) return;
    let tokensStr = ""
    let exchProps = get(exchangeProperties)
    value.forEach(element => {
        let elementProp = exchProps[element]
        if (elementProp != undefined) {
            if (tokensStr == "") {
                tokensStr = elementProp.exch + "|" + elementProp.token
            }
            else {
                tokensStr += "#" + elementProp.exch + "|" + elementProp.token
            }
        }
    });
    if (tokensStr == "") return;
    let payload = {
        t: 't', k: tokensStr
    }
    websocket.send(JSON.stringify(payload))
}

export const unsubscribeWS = (websocket, value) => {
    if (value == []) return;
    let tokensStr = ""
    value.forEach(element => {
        let exchProp = get(exchangeProperties)[element]
        if (exchProp != undefined) {
            if (tokensStr == "") {
                tokensStr = exchProp.exch + "|" + exchProp.token
            }
            else {
                tokensStr += "#" + exchProp.exch + "|" + exchProp.token
            }
        }
    });
    if (tokensStr == "") return;
    let payload = {
        t: 'u', k: tokensStr
    }
    websocket.send(JSON.stringify(payload))
}
