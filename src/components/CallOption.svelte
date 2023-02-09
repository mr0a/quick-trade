<script>
    import {ArrowNarrowLeft, ArrowNarrowUp, Icon} from 'svelte-hero-icons'
	import { realtimeData, exchangeProperties } from '../stores/writableStores';
    import { callOption } from '../stores/readableStores'
    import { placeOrder } from '../helper/flattrade'
    

    let instrument, token, ltp, props, percent = 0
    $: instrument = $callOption
    $: props = $exchangeProperties[instrument]
    $: token = props != undefined? props?.token : 0
    $: ltp = token != 0 ?$realtimeData[token]?.lp || 0 : 0
    $: percent = $realtimeData[token]?.pc

    const handleTrade = async (trantype) => {
        let {response, jsonData} = await placeOrder(instrument, trantype);
    }

</script>

<div class="inline-flex flex-col gap-1">
    <p>Strike: <span class="font-medium">{instrument}</span></p>
    <p>LTP: <span class="font-medium">
        Rs. {ltp}
        <span class={percent > 0 ? "text-green-700":"text-red-500"}>({percent || 0}%)</span>
    </span></p>
    <div>
        <button class="text-white rounded px-4 py-2 mx-2 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-gray-400"
        on:click={() => handleTrade("S")}
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowLeft} size=16 />
                Sell Call
            </div>
        </button>
        <button class="text-white rounded px-4 py-2 mx-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-gray-400"
        on:click={() => handleTrade("B")}
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowUp} size=18 />
                Buy Call
            </div>
        </button>
    </div>
</div>