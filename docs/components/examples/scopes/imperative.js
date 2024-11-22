/* PSEUDO-CODE!!! */
import { el, on, scope } from "deka-dom-el";
function component(){
	const { host }= scope;
	const ul= el("ul");
	const ac= new AbortController();
	fetchAPI({ signal: ac.signal }).then(data=> {
		data.forEach(d=> ul.append(el("li", d)));
	});
	host(
		/* element was remove before data fetched */
		on.disconnected(()=> ac.abort())
	);
	return ul;
	/**
	 * NEVER EVER!!
	 * let data;
	 * fetchAPI().then(d=> data= O(d));
	 *
	 * OR NEVER EVER!!
	 * const ul= el("ul");
	 * fetchAPI().then(d=> {
	 *	const data= O("data");
	 *	ul.append(el("li", data));
	 * });
	 *
	 * // THE HOST IS PROBABLY DIFFERENT THAN
	 * // YOU EXPECT AND OBSERVABLES MAY BE
	 * // UNEXPECTEDLY REMOVED!!!
	 * */
}
