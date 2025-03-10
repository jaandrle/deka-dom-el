import { style, el, S, isSignal } from '../exports.js';
const className= style.host(thirdParty).css`
	:host {
		color: green;
	}
`;

const store_adapter= {
	read(){ return (new URL(location)).searchParams; },
	write(data){ console.log(data); history.replaceState("", "", "?"+(new URLSearchParams(data)).toString()); }
};
export function thirdParty(){
	const store= S({
		value: S("initial")
	}, {
		set(key, value){
			const p=  this.value[key] || S();
			p.set(value);
			this.value[key]= p;
		}
	});
	// Array.from((new URL(location)).searchParams.entries())
	// 	.forEach(([ key, value ])=> S.action(store, "set", key, value));
	// S.on(store, data=> history.replaceState("", "",
	// "?"+(new URLSearchParams(JSON.parse(JSON.stringify(data)))).toString()));
	useStore(store_adapter, {
		onread(data){
			Array.from(data.entries())
				.forEach(([ key, value ])=> S.action(store, "set", key, value));
			return store;
		}
	})();
	return el("input", {
		className,
		value: store.get().value.get(),
		type: "text",
		onchange: ev=> S.action(store, "set", "value", ev.target.value)
	});
}

function useStore(adapter_in, { onread, onbeforewrite }= {}){
	const adapter= typeof adapter_in === "function" ? { read: adapter_in } : adapter_in;
	if(!onread) onread= S;
	if(!onbeforewrite) onbeforewrite= data=> JSON.parse(JSON.stringify(data));
	return function useStoreInner(data_read){
		const signal= onread(adapter.read(data_read)); //TODO OK as synchronous
		if(adapter.write && isSignal(signal))
			S.on(signal, data=> adapter.write(onbeforewrite(data)));
		return signal;
	};
}
