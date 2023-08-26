export function typeOf(v){
	const t= typeof v;
	if(t!=="object") return t;
	if(v===null) return "null";
	return Object.prototype.toString.call(v);
}
