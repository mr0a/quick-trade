<script>
    import {ArrowNarrowLeft, ArrowNarrowUp, Icon} from 'svelte-hero-icons'
	import { realtimeData, exchangeProperties } from '../stores/writableStores';
    import { callOption } from '../stores/readableStores'
    

    let instrument, token, ltp, props = 0
    $: instrument = $callOption
    $: props = $exchangeProperties[instrument]
    $: token = props != undefined? props?.token : 0
    $: ltp = token != 0 ?$realtimeData[token]?.lp || 0 : 0

</script>

<div class="inline-flex flex-col gap-1">
    <p>Strike: <span class="font-medium">{instrument}</span></p>
    <p>LTP: <span class="font-medium">Rs. {ltp}</span></p>
    <div>
        <button class="text-white rounded px-4 py-2 mx-2 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-gray-400"
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowLeft} size=16 />
                Sell Call
            </div>
        </button>
        <button class="text-white rounded px-4 py-2 mx-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-gray-400"
        >
            <div class="flex items-center gap-2">
                <Icon src={ArrowNarrowUp} size=18 />
                Buy Call
            </div>
        </button>
    </div>
</div>