import { persisted } from 'svelte-local-storage-store'
import { get, writable } from 'svelte/store';

const createStore = () => {

    let token = persisted('user_token', '')
    let user_data = writable({});
    console.log("Called", get(token).length)
    while (typeof prompt != undefined && get(token) == ""){
        let jData = {}
        if(typeof prompt == undefined){
            
            let new_token = prompt("Enter token") || "";
            if (new_token == "") continue;
            let uid = prompt("Enter User ID");
            jData = {uid}
        }
        fetch("https://piconnect.flattrade.in/PiConnectTP/UserDetails", 
            {
                method: "post",
                body: "jData=" + JSON.stringify(jData) + "&jKey=" + token,
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                }
            }
        ).then(res => {
            if (res.status == 200){
                res.json().then(data => {
                    console.log(data);
                    
                    user_data.set(data.data)
                })
            }
        })
        
    }

    return user_data
}

export const user_data = createStore();