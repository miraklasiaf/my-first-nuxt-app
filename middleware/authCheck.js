export default function(context) {
	console.log('authCheck');
	context.store.dispatch('initAuth', context.req);
}
