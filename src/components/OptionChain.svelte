<script>
	import { onMount } from "svelte";
	import { brokerStore } from "../stores/writableStores";

    
    const getOptionChain = () => {
        let data = {
			uid: $brokerStore.client_id,
            // stext: "Nifty 23Feb PE",
			// tsym: "FINNIFTY31JAN23P18100",
            exch: "NSE",
            // strprc: "17800",
            // cnt: "4"
            token: "26000"
		};
        // let link = "https://piconnect.flattrade.in/PiConnectTP/SearchScrip"
        // let link = "https://piconnect.flattrade.in/PiConnectTP/GetOptionChain"
        let link = "https://piconnect.flattrade.in/PiConnectTP/GetQuotes"
        fetch(link,{
            mode: "cors",
            method: "POST",
            body: 'jData=' + JSON.stringify(data) + '&jKey=' + $brokerStore.token
        }).then(resp => {
            console.log(resp);
            resp.json().then(data => {
                console.log(data);
            })
        })
    }

    onMount(() => {
        getOptionChain()
    })
</script>

<div>
    <h1>Option Chain</h1>
</div>