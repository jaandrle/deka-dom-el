var A={isObservable(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function M(t,e=!0){return e?Object.assign(A,t):(Object.setPrototypeOf(t,A),t)}function C(t){return A.isPrototypeOf(t)&&t!==A?t:A}function y(t){return typeof t>"u"}function H(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function S(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}function N(t,e){let{observedAttributes:n=[]}=t.constructor;return n.reduce(function(r,o){return Reflect.set(r,ct(o),e(t,o)),r},{})}function ct(t){return t.replace(/-./g,e=>e[1].toUpperCase())}var $={setDeleteAttr:st,ssr:""};function st(t,e,n){if(Reflect.set(t,e,n),!!y(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var x=[{scope:document.body,host:t=>t?t(document.body):document.body,custom_element:!1,prevent:!0}],g={get current(){return x[x.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...x]},push(t={}){return x.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return x.push(x[0])},pop(){if(x.length!==1)return x.pop()}};function I(...t){return this.appendOriginal(...t),this}function it(t){return t.append===I||(t.appendOriginal=t.append,t.append=I),t}var P;function w(t,e,...n){let r=C(this),o=0,c,s;switch((Object(e)!==e||r.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,g.push({scope:t,host:(...p)=>p.length?(o===1?n.unshift(...p):p.forEach(b=>b(s)),void 0):s}),c=t(e||void 0);let a=c instanceof DocumentFragment;if(c.nodeName==="#comment")break;let d=w.mark({type:"component",name:t.name,host:a?"this":"parentElement"});c.prepend(d),a&&(s=d);break}case t==="#text":c=O.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=O.call(this,document.createDocumentFragment(),e);break;case!!P:c=O.call(this,document.createElementNS(P,t),e);break;case!c:c=O.call(this,document.createElement(t),e)}return it(c),s||(s=c),n.forEach(a=>a(s)),o&&g.pop(),o=2,c}function Rt(t,e=t,n=void 0){let r=Symbol.for("default"),o=Array.from(e.querySelectorAll("slot")).reduce((s,a)=>Reflect.set(s,a.name||r,a)&&s,{}),c=Reflect.has(o,r);if(t.append=new Proxy(t.append,{apply(s,a,d){if(!d.length)return t;let p=document.createDocumentFragment();for(let b of d){if(!b||!b.slot){c&&p.appendChild(b);continue}let i=b.slot,u=o[i];at(b,"remove","slot"),u&&(ut(u,b,n),Reflect.deleteProperty(o,i))}return c&&(o[r].replaceWith(p),Reflect.deleteProperty(o,r)),t.append=s,t}}),t!==e){let s=Array.from(t.childNodes);s.forEach(a=>a.remove()),t.append(...s)}return e}function ut(t,e,n){n&&n(t,e);try{t.replaceWith(O(e,{className:[e.className,t.className],dataset:{...t.dataset}}))}catch{t.replaceWith(e)}}w.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=document.createComment(`<dde:mark ${t}${$.ssr}${n}>`);return e||(r.end=document.createComment("</dde:mark>")),r};function Ct(t){let e=this;return function(...r){P=t;let o=w.call(e,...r);return P=void 0,o}}var{setDeleteAttr:J}=$,j=new WeakMap;function O(t,...e){if(!e.length)return t;j.set(t,V(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))G.call(this,t,n,r);return j.delete(t),t}function G(t,e,n){let{setRemoveAttr:r,s:o}=V(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(a,d)=>G.call(c,t,a,d));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return Z(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return J(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return F(o,n,Z.bind(null,t[e]));case"ariaset":return F(o,n,(a,d)=>r("aria-"+a,d));case"classList":return ft.call(c,t,n)}return dt(t,e)?J(t,e,n):r(e,n)}function V(t,e){if(j.has(t))return j.get(t);let r=(t instanceof SVGElement?pt:lt).bind(null,t,"Attribute"),o=C(e);return{setRemoveAttr:r,s:o}}function ft(t,e){let n=C(this);return F(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function St(t){return Array.from(t.children).forEach(e=>e.remove()),t}function at(t,e,n,r){return t instanceof HTMLElement?t[e+"Attribute"](n,r):t[e+"AttributeNS"](null,n,r)}function dt(t,e){if(!Reflect.has(t,e))return!1;let n=K(t,e);return!y(n.set)}function K(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||K(t,e)}function F(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function Q(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function lt(t,e,n,r){return t[(y(r)?"remove":"set")+e](n,Q(r))}function pt(t,e,n,r,o=null){return t[(y(r)?"remove":"set")+e+"NS"](o,n,Q(r))}function Z(t,e,n){if(Reflect.set(t,e,n),!!y(n))return Reflect.deleteProperty(t,e)}function kt(t,e,n=ht){g.push({scope:t,host:(...o)=>o.length?o.forEach(c=>c(t)):t,custom_element:t}),typeof n=="function"&&(n=n.call(t,t));let r=e.call(t,n);return g.pop(),r}function Lt(t){for(let n of["connected","disconnected"])X(t.prototype,n+"Callback",function(r,o,c){r.apply(o,c),o.dispatchEvent(new Event("dde:"+n))});let e="attributeChanged";return X(t.prototype,e+"Callback",function(n,r,o){let[c,,s]=o;r.dispatchEvent(new CustomEvent("dde:"+e,{detail:[c,s]})),n.apply(r,o)}),t.prototype.__dde_lifecycleToEvents=!0,t}function X(t,e,n){t[e]=new Proxy(t[e]||(()=>{}),{apply:n})}function ht(t){return N(t,(e,n)=>e.getAttribute(n))}function Tt(t,e,n){return e||(e={}),function(o,...c){n&&(c.unshift(o),o=typeof n=="function"?n():n);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function E(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var k=gt(),bt=new WeakSet;E.connected=function(t,e){let{custom_element:n}=g.current,r="connected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents?c:c.isConnected?(c.dispatchEvent(new Event(s)),c):(S(e.signal,()=>k.offConnected(c,t))&&k.onConnected(c,t),c)}};E.disconnected=function(t,e){let{custom_element:n}=g.current,r="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents||S(e.signal,()=>k.offDisconnected(c,t))&&k.onDisconnected(c,t),c}};var z=new WeakMap;E.disconnectedAsAbort=function(t){if(z.has(t))return z.get(t);let e=new AbortController;return z.set(t,e),t(E.disconnected(()=>e.abort())),e};E.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||bt.has(o))return o;let s=new MutationObserver(function(d){for(let{attributeName:p,target:b}of d)b.dispatchEvent(new CustomEvent(c,{detail:[p,b.getAttribute(p)]}))});return S(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function gt(){let t=new Map,e=!1,n=new MutationObserver(function(i){for(let u of i)if(u.type==="childList"){if(p(u.addedNodes,!0)){s();continue}b(u.removedNodes,!0)&&s()}});return{onConnected(i,u){c();let f=o(i);f.connected.has(u)||(f.connected.add(u),f.length_c+=1)},offConnected(i,u){if(!t.has(i))return;let f=t.get(i);f.connected.has(u)&&(f.connected.delete(u),f.length_c-=1,r(i,f))},onDisconnected(i,u){c();let f=o(i);f.disconnected.has(u)||(f.disconnected.add(u),f.length_d+=1)},offDisconnected(i,u){if(!t.has(i))return;let f=t.get(i);f.disconnected.has(u)&&(f.disconnected.delete(u),f.length_d-=1,r(i,f))}};function r(i,u){u.length_c||u.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let u={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,u),u}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function a(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function d(i,u){t.size>30&&await a();let f=[];if(!(i instanceof Node))return f;for(let l of t.keys())l===i||!(l instanceof Node)||u(l)||i.contains(l)&&f.push(l);return f}function p(i,u){let f=!1;for(let l of i){if(u&&d(l,T=>!T.isConnectedd).then(p),!t.has(l))continue;let _=t.get(l);_.length_c&&(l.dispatchEvent(new Event("dde:connected")),_.connected=new WeakSet,_.length_c=0,_.length_d||t.delete(l),f=!0)}return f}function b(i,u){let f=!1;for(let l of i)u&&d(l,T=>T.isConnectedd).then(b),!(!t.has(l)||!t.get(l).length_d)&&(l.dispatchEvent(new Event("dde:disconnected")),t.delete(l),f=!0);return f}}var h=Symbol.for("observable");function D(t){try{return Reflect.has(t,h)}catch{return!1}}var W=[],v=new WeakMap;function m(t,e){if(typeof t!="function")return Y(!1,t,e);if(D(t))return t;let n=Y(!0),r=function(){let[o,...c]=v.get(r);if(v.set(r,new Set([o])),W.push(r),ot(n,t()),W.pop(),!c.length)return;let s=v.get(r);for(let a of c)s.has(a)||R(a,r)};return v.set(n[h],r),v.set(r,new Set([n])),r(),n}m.action=function(t,e,...n){let r=t[h],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};m.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));B(e,n),o&&o.addEventListener("abort",()=>R(e,n))}};m.symbols={onclear:Symbol.for("Observable.onclear")};m.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[h];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,h)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!v.has(o))return;let c=v.get(o);c.delete(n),!(c.size>1)&&(n.clear(...c),v.delete(o))})}};var L="__dde_reactive";m.el=function(t,e){let n=w.mark({type:"reactive"},!1),r=n.end,o=document.createDocumentFragment();o.append(n,r);let{current:c}=g,s=a=>{if(!n.parentNode||!r.parentNode)return R(t,s);g.push(c);let d=e(a);g.pop(),Array.isArray(d)||(d=[d]);let p=n;for(;(p=n.nextSibling)!==r;)p.remove();n.after(...d)};return B(t,s),nt(t,s,n,e),s(t()),o};function vt(t,e){let n=(...r)=>r.length?t.setAttribute(e,...r):t.getAttribute(e);return n.attribute=e,n}var U="__dde_attributes";m.observedAttributes=function(t){let e=N(t,vt),n=t[U]={},r={_set(o){this.value=o}};return Object.keys(e).forEach(o=>{let c=e[o]=rt(e[o],e[o](),r);n[c.attribute]=c}),E.attributeChanged(function({detail:c}){/*! This maps attributes to observables (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/let[s,a]=c,d=t[U][s];if(d)return m.action(d,"_set",a)})(t),E.disconnected(function(){/*! This removes all observables mapped to attributes (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/m.clear(...Object.values(t[U]))})(t),e};var et={isObservable:D,processReactiveAttribute(t,e,n,r){if(!D(n))return n;let o=c=>r(e,c);return B(n,o),nt(n,o,t,e),n()}};function nt(t,e,...n){let{current:r}=g;r.prevent||r.host(function(o){o[L]||(o[L]=[],E.disconnected(()=>o[L].forEach(([[c,s]])=>R(c,s,c[h]?.host()===o)))(o)),o[L].push([[t,e],...n])})}function Y(t,e,n){let r=t?()=>tt(r):(...o)=>o.length?ot(r,...o):tt(r);return rt(r,e,n)}var mt=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),q=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function rt(t,e,n){let r=[];H(n)!=="[object Object]"&&(n={});let{onclear:o}=m.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=g;return Reflect.defineProperty(t,h,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new q},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[h],mt),t}function Et(){return W[W.length-1]}function tt(t){if(!t[h])return;let{value:e,listeners:n}=t[h],r=Et();return r&&n.add(r),v.has(r)&&v.get(r).add(t),e}function ot(t,e,n){if(!t[h])return;let r=t[h];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function B(t,e){if(t[h])return t[h].listeners.add(e)}function R(t,e,n){let r=t[h];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(m.clear(t),!v.has(r))return o;let c=v.get(r);if(!v.has(c))return o;v.get(c).forEach(s=>R(s,c,!0))}return o}M(et);export{m as O,O as assign,G as assignAttribute,it as chainableAppend,ft as classListDeclarative,w as createElement,Ct as createElementNS,kt as customElementRender,Lt as customElementWithDDE,Tt as dispatchEvent,w as el,Ct as elNS,at as elementAttribute,St as empty,D as isObservable,Lt as lifecycleToEvents,m as observable,ht as observedAttributes,E as on,M as registerReactivity,g as scope,Rt as simulateSlots};
