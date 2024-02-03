//deka-dom-el library is available via global namespace `dde`
(()=> {
var k={isObservable(t){return!1},processReactiveAttribute(t,e,r,n){return r}};function B(t,e=!0){return e?Object.assign(k,t):(Object.setPrototypeOf(t,k),t)}function W(t){return k.isPrototypeOf(t)&&t!==k?t:k}var T=(...t)=>Object.prototype.hasOwnProperty.call(...t);function _(t){return typeof t>"u"}function Q(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function q(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}function F(t,e){let{observedAttributes:r=[]}=t.constructor;return r.reduce(function(n,o){return n[pt(o)]=e(t,o),n},{})}function pt(t){return t.replace(/-./g,e=>e[1].toUpperCase())}var d={setDeleteAttr:lt,ssr:"",D:globalThis.document,F:globalThis.DocumentFragment,H:globalThis.HTMLElement,S:globalThis.SVGElement,M:globalThis.MutationObserver};function lt(t,e,r){if(Reflect.set(t,e,r),!!_(r)){if(Reflect.deleteProperty(t,e),t instanceof d.H&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var C="__dde_lifecycleToEvents",y="dde:connected",S="dde:disconnected",P="dde:attributeChanged";var O=[{get scope(){return d.D.body},host:t=>t?t(d.D.body):d.D.body,prevent:!0}],m={get current(){return O[O.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...O]},push(t={}){return O.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return O.push(O[0])},pop(){if(O.length!==1)return O.pop()}};function X(...t){return this.appendOriginal(...t),this}function ht(t){return t.append===X||(t.appendOriginal=t.append,t.append=X),t}var $;function M(t,e,...r){let n=W(this),o=0,c,s;switch((Object(e)!==e||n.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,m.push({scope:t,host:(...g)=>g.length?(o===1?r.unshift(...g):g.forEach(p=>p(s)),void 0):s}),c=t(e||void 0);let a=c instanceof d.F;if(c.nodeName==="#comment")break;let l=M.mark({type:"component",name:t.name,host:a?"this":"parentElement"});c.prepend(l),a&&(s=l);break}case t==="#text":c=j.call(this,d.D.createTextNode(""),e);break;case(t==="<>"||!t):c=j.call(this,d.D.createDocumentFragment(),e);break;case!!$:c=j.call(this,d.D.createElementNS($,t),e);break;case!c:c=j.call(this,d.D.createElement(t),e)}return ht(c),s||(s=c),r.forEach(a=>a(s)),o&&m.pop(),o=2,c}function Wt(t,e=t,r=void 0){let n=Symbol.for("default"),o=Array.from(e.querySelectorAll("slot")).reduce((s,a)=>Reflect.set(s,a.name||n,a)&&s,{}),c=T(o,n);if(t.append=new Proxy(t.append,{apply(s,a,l){if(!l.length)return t;let g=d.D.createDocumentFragment();for(let p of l){if(!p||!p.slot){c&&g.appendChild(p);continue}let w=p.slot,A=o[w];gt(p,"remove","slot"),A&&(bt(A,p,r),Reflect.deleteProperty(o,w))}return c&&(o[n].replaceWith(g),Reflect.deleteProperty(o,n)),t.append=s,t}}),t!==e){let s=Array.from(t.childNodes);s.forEach(a=>a.remove()),t.append(...s)}return e}function bt(t,e,r){r&&r(t,e);try{t.replaceWith(j(e,{className:[e.className,t.className],dataset:{...t.dataset}}))}catch{t.replaceWith(e)}}M.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let r=e?"":"/",n=d.D.createComment(`<dde:mark ${t}${d.ssr}${r}>`);return e&&(n.end=d.D.createComment("</dde:mark>")),n};function qt(t){let e=this;return function(...n){$=t;let o=M.call(e,...n);return $=void 0,o}}var U=new WeakMap,{setDeleteAttr:Y}=d;function j(t,...e){if(!e.length)return t;U.set(t,nt(t,this));for(let[r,n]of Object.entries(Object.assign({},...e)))et.call(this,t,r,n);return U.delete(t),t}function et(t,e,r){let{setRemoveAttr:n,s:o}=nt(t,this),c=this;r=o.processReactiveAttribute(t,e,r,(a,l)=>et.call(c,t,a,l));let[s]=e;if(s==="=")return n(e.slice(1),r);if(s===".")return tt(t,e.slice(1),r);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),n(e,r);switch(e==="className"&&(e="class"),e){case"xlink:href":return n(e,r,"http://www.w3.org/1999/xlink");case"textContent":return Y(t,e,r);case"style":if(typeof r!="object")break;case"dataset":return I(o,r,tt.bind(null,t[e]));case"ariaset":return I(o,r,(a,l)=>n("aria-"+a,l));case"classList":return vt.call(c,t,r)}return Et(t,e)?Y(t,e,r):n(e,r)}function nt(t,e){if(U.has(t))return U.get(t);let n=(t instanceof d.S?xt:mt).bind(null,t,"Attribute"),o=W(e);return{setRemoveAttr:n,s:o}}function vt(t,e){let r=W(this);return I(r,e,(n,o)=>t.classList.toggle(n,o===-1?void 0:!!o)),t}function Ft(t){return Array.from(t.children).forEach(e=>e.remove()),t}function gt(t,e,r,n){return t instanceof d.H?t[e+"Attribute"](r,n):t[e+"AttributeNS"](null,r,n)}function Et(t,e){if(!(e in t))return!1;let r=rt(t,e);return!_(r.set)}function rt(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let r=Object.getOwnPropertyDescriptor(t,e);return r||rt(t,e)}function I(t,e,r){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,r),r(o,c))})}function ot(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function mt(t,e,r,n){return t[(_(n)?"remove":"set")+e](r,ot(n))}function xt(t,e,r,n,o=null){return t[(_(n)?"remove":"set")+e+"NS"](o,r,ot(n))}function tt(t,e,r){if(Reflect.set(t,e,r),!!_(r))return Reflect.deleteProperty(t,e)}var D=d.M?yt():new Proxy({},{get(){return()=>{}}});function yt(){let t=new Map,e=!1,r=i=>function(u){for(let f of u)if(f.type==="childList"){if(p(f.addedNodes,!0)){i();continue}w(f.removedNodes,!0)&&i()}},n=new d.M(r(a));return{observe(i){let u=new d.M(r(()=>{}));return u.observe(i,{childList:!0,subtree:!0}),()=>u.disconnect()},onConnected(i,u){s();let f=c(i);f.connected.has(u)||(f.connected.add(u),f.length_c+=1)},offConnected(i,u){if(!t.has(i))return;let f=t.get(i);f.connected.has(u)&&(f.connected.delete(u),f.length_c-=1,o(i,f))},onDisconnected(i,u){s();let f=c(i);f.disconnected.has(u)||(f.disconnected.add(u),f.length_d+=1)},offDisconnected(i,u){if(!t.has(i))return;let f=t.get(i);f.disconnected.has(u)&&(f.disconnected.delete(u),f.length_d-=1,o(i,f))}};function o(i,u){u.length_c||u.length_d||(t.delete(i),a())}function c(i){if(t.has(i))return t.get(i);let u={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,u),u}function s(){e||(e=!0,n.observe(d.D.body,{childList:!0,subtree:!0}))}function a(){!e||t.size||(e=!1,n.disconnect())}function l(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function g(i){t.size>30&&await l();let u=[];if(!(i instanceof Node))return u;for(let f of t.keys())f===i||!(f instanceof Node)||i.contains(f)&&u.push(f);return u}function p(i,u){let f=!1;for(let h of i){if(u&&g(h).then(p),!t.has(h))continue;let N=t.get(h);N.length_c&&(h.dispatchEvent(new Event(y)),N.connected=new WeakSet,N.length_c=0,N.length_d||t.delete(h),f=!0)}return f}function w(i,u){let f=!1;for(let h of i)u&&g(h).then(w),!(!t.has(h)||!t.get(h).length_d)&&((queueMicrotask||setTimeout)(A(h)),f=!0);return f}function A(i){return()=>{i.isConnected||(i.dispatchEvent(new Event(S)),t.delete(i))}}}function Zt(t,e,r,n=wt){m.push({scope:t,host:(...s)=>s.length?s.forEach(a=>a(t)):t}),typeof n=="function"&&(n=n.call(t,t));let o=t[C];o||Ot(t);let c=r.call(t,n);return o||t.dispatchEvent(new Event(y)),e.nodeType===11&&typeof e.mode=="string"&&t.addEventListener(S,D.observe(e),{once:!0}),m.pop(),e.append(c)}function Ot(t){return J(t.prototype,"connectedCallback",function(e,r,n){e.apply(r,n),r.dispatchEvent(new Event(y))}),J(t.prototype,"disconnectedCallback",function(e,r,n){e.apply(r,n),(queueMicrotask||setTimeout)(()=>!r.isConnected&&r.dispatchEvent(new Event(S)))}),J(t.prototype,"attributeChangedCallback",function(e,r,n){let[o,,c]=n;r.dispatchEvent(new CustomEvent(P,{detail:[o,c]})),e.apply(r,n)}),t.prototype[C]=!0,t}function J(t,e,r){t[e]=new Proxy(t[e]||(()=>{}),{apply:r})}function wt(t){return F(t,(e,r)=>e.getAttribute(r))}function Qt(t,e,r){return e||(e={}),function(o,...c){r&&(c.unshift(o),o=typeof r=="function"?r():r);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function x(t,e,r){return function(o){return o.addEventListener(t,e,r),o}}var ct=t=>Object.assign({},typeof t=="object"?t:null,{once:!0});x.connected=function(t,e){return e=ct(e),function(n){return n.addEventListener(y,t,e),n[C]?n:n.isConnected?(n.dispatchEvent(new Event(y)),n):(q(e.signal,()=>D.offConnected(n,t))&&D.onConnected(n,t),n)}};x.disconnected=function(t,e){return e=ct(e),function(n){return n.addEventListener(S,t,e),n[C]||q(e.signal,()=>D.offDisconnected(n,t))&&D.onDisconnected(n,t),n}};var Z=new WeakMap;x.disconnectedAsAbort=function(t){if(Z.has(t))return Z.get(t);let e=new AbortController;return Z.set(t,e),t(x.disconnected(()=>e.abort())),e};var At=new WeakSet;x.attributeChanged=function(t,e){return typeof e!="object"&&(e={}),function(n){if(n.addEventListener(P,t,e),n[C]||At.has(n)||!d.M)return n;let o=new d.M(function(s){for(let{attributeName:a,target:l}of s)l.dispatchEvent(new CustomEvent(P,{detail:[a,l.getAttribute(a)]}))});return q(e.signal,()=>o.disconnect())&&o.observe(n,{attributes:!0}),n}};var b=Symbol.for("observable");function z(t){try{return T(t,b)}catch{return!1}}var H=[],v=new WeakMap;function E(t,e){if(typeof t!="function")return st(!1,t,e);if(z(t))return t;let r=st(!0),n=function(){let[o,...c]=v.get(n);if(v.set(n,new Set([o])),H.push(n),dt(r,t()),H.pop(),!c.length)return;let s=v.get(n);for(let a of c)s.has(a)||L(a,n)};return v.set(r[b],n),v.set(n,new Set([r])),n(),r}E.action=function(t,e,...r){let n=t[b],{actions:o}=n;if(!o||!(e in o))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(n,r),n.skip)return delete n.skip;n.listeners.forEach(c=>c(n.value))};E.on=function t(e,r,n={}){let{signal:o}=n;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,r,n));K(e,r),o&&o.addEventListener("abort",()=>L(e,r))}};E.symbols={onclear:Symbol.for("Observable.onclear")};E.clear=function(...t){for(let r of t){let n=r[b];n&&(delete r.toJSON,n.onclear.forEach(o=>o.call(n)),e(r,n),delete r[b])}function e(r,n){n.listeners.forEach(o=>{if(n.listeners.delete(o),!v.has(o))return;let c=v.get(o);c.delete(r),!(c.size>1)&&(r.clear(...c),v.delete(o))})}};var R="__dde_reactive";E.el=function(t,e){let r=M.mark({type:"reactive"},!0),n=r.end,o=d.D.createDocumentFragment();o.append(r,n);let{current:c}=m,s={},a=l=>{if(!r.parentNode||!n.parentNode)return L(t,a);let g=s;s={},m.push(c);let p=e(l,function(u,f){let h;return T(g,u)?(h=g[u],delete g[u]):h=f(),s[u]=h,h});m.pop(),Array.isArray(p)||(p=[p]),r.after(...p);let w=p[p.length-1],A;for(;(A=w.nextSibling)!==n;)A.remove();r.isConnected&&_t(c.host())};return K(t,a),ft(t,a,r,e),a(t()),o};function _t(t){!t||!t[R]||(requestIdleCallback||setTimeout)(function(){t[R]=t[R].filter(([e,r])=>r.isConnected?!0:(L(...e),!1))})}var Ct={_set(t){this.value=t}};function St(t){return function(e,r){let n=(...c)=>c.length?e.setAttribute(r,...c):e.getAttribute(r),o=at(n,n(),Ct);return t[r]=o,o}}var G="__dde_attributes";E.observedAttributes=function(t){let e=t[G]={},r=F(t,St(e));return x.attributeChanged(function({detail:o}){/*! This maps attributes to observables (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/let[c,s]=o,a=this[G][c];if(a)return E.action(a,"_set",s)})(t),x.disconnected(function(){/*! This removes all observables mapped to attributes (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/E.clear(...Object.values(this[G]))})(t),r};var ut={isObservable:z,processReactiveAttribute(t,e,r,n){if(!z(r))return r;let o=c=>{if(!t.isConnected)return L(r,o);n(e,c)};return K(r,o),ft(r,o,t,e),r()}};function ft(t,e,...r){let{current:n}=m;n.prevent||n.host(function(o){o[R]||(o[R]=[],x.disconnected(()=>o[R].forEach(([[c,s]])=>L(c,s,c[b]?.host()===o)))(o)),o[R].push([[t,e],...r])})}function st(t,e,r){let n=t?()=>it(n):(...o)=>o.length?dt(n,...o):it(n);return at(n,e,r)}var Dt=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),V=class extends Error{constructor(){super();let[e,...r]=this.stack.split(`
`),n=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=r.find(o=>!o.includes(n))}};function at(t,e,r){let n=[];Q(r)!=="[object Object]"&&(r={});let{onclear:o}=E.symbols;r[o]&&(n.push(r[o]),delete r[o]);let{host:c}=m;return Reflect.defineProperty(t,b,{value:{value:e,actions:r,onclear:n,host:c,listeners:new Set,defined:new V},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[b],Dt),t}function Rt(){return H[H.length-1]}function it(t){if(!t[b])return;let{value:e,listeners:r}=t[b],n=Rt();return n&&r.add(n),v.has(n)&&v.get(n).add(t),e}function dt(t,e,r){if(!t[b])return;let n=t[b];if(!(!r&&n.value===e))return n.value=e,n.listeners.forEach(o=>o(e)),e}function K(t,e){if(t[b])return t[b].listeners.add(e)}function L(t,e,r){let n=t[b];if(!n)return;let o=n.listeners.delete(e);if(r&&!n.listeners.size){if(E.clear(t),!v.has(n))return o;let c=v.get(n);if(!v.has(c))return o;v.get(c).forEach(s=>L(s,c,!0))}return o}B(ut);
globalThis.dde= {O: E,
assign: j,
assignAttribute: et,
chainableAppend: ht,
classListDeclarative: vt,
createElement: M,
createElementNS: qt,
customElementRender: Zt,
customElementWithDDE: Ot,
dispatchEvent: Qt,
el: M,
elNS: qt,
elementAttribute: gt,
empty: Ft,
isObservable: z,
lifecycleToEvents: Ot,
observable: E,
observedAttributes: wt,
on: x,
registerReactivity: B,
scope: m,
simulateSlots: Wt
};

})();