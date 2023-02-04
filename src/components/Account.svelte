<!-- Component to display the account information -->
<script>
	import { Icon, Refresh, User } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	import { brokerStore } from '../stores/writableStores';
	import { getDataFromBroker } from '../helper/flattrade';

	let broker = $brokerStore.broker;
	let client_id = $brokerStore.client_id;
	let active = true;
	let token = $brokerStore.token;

	const updateToken = () => {
		brokerStore.update((data) => {
			data.token = token;
			return data;
		})
		checkToken()
	}

	const checkToken = () => {
		getDataFromBroker('/UserDetails').then(({ response }) => {
			active = response.status == 200;
		});
	};

	onMount(() => {
		checkToken();
	});
</script>

<div>
	<div class="font-mono inline-flex items-center gap-1">
		<Icon src={User} size="16" />
		<span class="font-bold">{broker}({client_id})</span>
		<a
			href="#id"
			aria-label="Refresh Broker Token status"
			class="inline-block {active ? 'text-green-500' : 'text-red-500'}"
			on:click={checkToken}
		>
			<Icon src={Refresh} size="16" />
		</a>
		{#if active == false}
			<input class="border border-black mx-1 rounded" type="text" bind:value={token} />
			<button
				class="border rounded px-2 py-1 text-sm bg-sky-500 hover:bg-sky-600"
				on:click={updateToken}
			>
				Update
			</button>
		{/if}
	</div>
</div>
