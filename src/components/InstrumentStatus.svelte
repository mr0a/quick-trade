<script>
	let name = 'Nifty Bank';
	let ltp = 42900;
	let pdh = 42759;
	let diff = ltp - pdh;
	let percent = parseFloat(diff / ltp * 100).toFixed(2);
</script>

<div>
	<div>
		<p class="font-bold text-xl font-serif text-center mb-2">{name}</p>
		<p class="text-center">
            LTP: <span class="font-medium">{ltp} </span><span class="text-green-700">({diff} / {percent}%)</span>
        </p>
	</div>
</div>
