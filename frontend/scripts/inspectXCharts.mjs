import('@mui/x-charts')
	.then((m) => {
		console.log('exports:', Object.keys(m).join(', '));
	})
	.catch((err) => {
		console.error('failed to import @mui/x-charts', err && err.message ? err.message : err);
	});
