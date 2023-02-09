<script>
    import {Icon, ArrowNarrowDown, ArrowNarrowRight, Rss} from 'svelte-hero-icons'
	import { realtimeData, exchangeProperties, quantityStore } from '../stores/writableStores';
    import { putOption } from '../stores/readableStores'
    import { placeOrder } from '../helper/flattrade'

    let instrument, token, ltp = 0
    $: instrument = $putOption
    $: token = $exchangeProperties[instrument]?.token
    $: ltp = $realtimeData[token]?.lp || 0
    $: percent = $realtimeData[token]?.pc

    const handleTrade = async (trantype) => {
        let {response, jsonData} = await placeOrder(instrument, trantype);
    }
</script>

<div class="inline-flex flex-col gap-1">
    <p>Strike: <span class="font-medium">{instrument}</span></p>
    <p>
        LTP: 
        <span class="font-medium">Rs. {ltp}</span>
        <span class={percent > 0 ? "text-green-700":"text-red-500"}>({percent || 0}%)</span>
    </p>
    <div>
        <button class="text-white rounded px-4 py-2 mx-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-gray-400"
        on:click={() => handleTrade("B")}
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowDown} size=18 />
                Buy Put
            </div>
        </button>
        <button class="text-white rounded px-4 py-2 mx-2 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-gray-400"
        on:click={() => handleTrade("S")}
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowRight} size=16 />
                Sell Put
            </div>
        </button>
    </div>
</div>