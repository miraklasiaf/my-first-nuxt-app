export default function(context) {
	console.log('authCheck');
	if (process.client) {
		context.store.dispatch('initAuth');
	}
}
