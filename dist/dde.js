//deka-dom-el library is available via global namespace `dde`
(()=> {
var v={isObservable(t){return!1},processReactiveAttribute(t,e,n,c){return n}};function q(t,e=!0){return e?Object.assign(v,t):(Object.setPrototypeOf(t,v),t)}function x(t){return v.isPrototypeOf(t)&&t!==v?t:v}function g(t){return typeof t>"u"}function A(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var S={setDeleteAttr:F,ssr:""};function F(t,e,n){if(Reflect.set(t,e,n),!!g(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var b=[{scope:document.body,host:t=>t?t(document.body):document.body,custom_element:!1,prevent:!0}],E={get current(){return b[b.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...b]},push(t={}){return b.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return b.push(b[0])},pop(){if(b.length!==1)return b.pop()}};function L(...t){return this.appendOriginal(...t),this}function U(t){return t.append===L||(t.appendOriginal=t.append,t.append=L),t}var O;function C(t,e,...n){let c=x(this),o=0,r,f;switch((Object(e)!==e||c.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,E.push({scope:t,host:(...l)=>l.length?(o===1?n.unshift(...l):l.forEach(h=>h(f)),void 0):f}),r=t(e||void 0);let d=r instanceof DocumentFragment;if(r.nodeName==="#comment")break;let a=C.mark({type:"component",name:t.name,host:d?"this":"parentElement"});r.prepend(a),d&&(f=a);break}case t==="#text":r=w.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):r=w.call(this,document.createDocumentFragment(),e);break;case!!O:r=w.call(this,document.createElementNS(O,t),e);break;case!r:r=w.call(this,document.createElement(t),e)}return U(r),f||(f=r),n.forEach(d=>d(f)),o&&E.pop(),o=2,r}function tt(t){let e=Symbol.for("default"),n=Array.from(t.querySelectorAll("slot")).reduce((o,r)=>Reflect.set(o,r.name||e,r)&&o,{}),c=Reflect.has(n,e);return t.append=new Proxy(t.append,{apply(o,r,f){if(!f.length)return t;let d=document.createDocumentFragment();for(let a of f){if(!a||!a.slot){c&&d.appendChild(a);continue}let l=a.slot,h=n[l];B(a,"remove","slot"),h&&(h.replaceWith(a),Reflect.deleteProperty(n,l))}return c&&(n[e].replaceWith(d),Reflect.deleteProperty(n,e)),Object.values(n).forEach(a=>a.replaceWith(C().append(...Array.from(a.childNodes)))),t}}),t}C.mark=function(t,e=!1){t=Object.entries(t).map(([o,r])=>o+`="${r}"`).join(" ");let n=e?"":"/",c=document.createComment(`<dde:mark ${t}${S.ssr}${n}>`);return e||(c.end=document.createComment("</dde:mark>")),c};function et(t){let e=this;return function(...c){O=t;let o=C.call(e,...c);return O=void 0,o}}var{setDeleteAttr:j}=S,y=new WeakMap;function w(t,...e){if(!e.length)return t;y.set(t,M(t,this));for(let[n,c]of Object.entries(Object.assign({},...e)))W.call(this,t,n,c);return y.delete(t),t}function W(t,e,n){let{setRemoveAttr:c,s:o}=M(t,this),r=this;n=o.processReactiveAttribute(t,e,n,(d,a)=>W.call(r,t,d,a));let[f]=e;if(f==="=")return c(e.slice(1),n);if(f===".")return P(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),c(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return c(e,n,"http://www.w3.org/1999/xlink");case"textContent":return j(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return N(o,n,P.bind(null,t[e]));case"ariaset":return N(o,n,(d,a)=>c("aria-"+d,a));case"classList":return z.call(r,t,n)}return k(t,e)?j(t,e,n):c(e,n)}function M(t,e){if(y.has(t))return y.get(t);let c=(t instanceof SVGElement?I:H).bind(null,t,"Attribute"),o=x(e);return{setRemoveAttr:c,s:o}}function z(t,e){let n=x(this);return N(n,e,(c,o)=>t.classList.toggle(c,o===-1?void 0:!!o)),t}function nt(t){return Array.from(t.children).forEach(e=>e.remove()),t}function B(t,e,n,c){return t instanceof HTMLElement?t[e+"Attribute"](n,c):t[e+"AttributeNS"](null,n,c)}function k(t,e){if(!Reflect.has(t,e))return!1;let n=T(t,e);return!g(n.set)}function T(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||T(t,e)}function N(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,r]){o&&(r=t.processReactiveAttribute(e,o,r,n),n(o,r))})}function $(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function H(t,e,n,c){return t[(g(c)?"remove":"set")+e](n,$(c))}function I(t,e,n,c,o=null){return t[(g(c)?"remove":"set")+e+"NS"](o,n,$(c))}function P(t,e,n){if(Reflect.set(t,e,n),!!g(n))return Reflect.deleteProperty(t,e)}function ct(t,e,n){return e||(e={}),function(o,...r){n&&(r.unshift(o),o=typeof n=="function"?n():n);let f=r.length?new CustomEvent(t,Object.assign({detail:r[0]},e)):new Event(t,e);return o.dispatchEvent(f)}}function _(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var R=G(),Z=new WeakSet;_.connected=function(t,e){let{custom_element:n}=E.current,c="connected";return typeof e!="object"&&(e={}),e.once=!0,function(r){n&&(r=n);let f="dde:"+c;return r.addEventListener(f,t,e),r.__dde_lifecycleToEvents?r:r.isConnected?(r.dispatchEvent(new Event(f)),r):(A(e.signal,()=>R.offConnected(r,t))&&R.onConnected(r,t),r)}};_.disconnected=function(t,e){let{custom_element:n}=E.current,c="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(r){n&&(r=n);let f="dde:"+c;return r.addEventListener(f,t,e),r.__dde_lifecycleToEvents||A(e.signal,()=>R.offDisconnected(r,t))&&R.onDisconnected(r,t),r}};var D=new WeakMap;_.disconnectedAsAbort=function(t){if(D.has(t))return D.get(t);let e=new AbortController;return D.set(t,e),t(_.disconnected(()=>e.abort())),e};_.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let r="dde:"+n;if(o.addEventListener(r,t,e),o.__dde_lifecycleToEvents||Z.has(o))return o;let f=new MutationObserver(function(a){for(let{attributeName:l,target:h}of a)h.dispatchEvent(new CustomEvent(r,{detail:[l,h.getAttribute(l)]}))});return A(e.signal,()=>f.disconnect())&&f.observe(o,{attributes:!0}),o}};function G(){let t=new Map,e=!1,n=new MutationObserver(function(s){for(let i of s)if(i.type==="childList"){if(l(i.addedNodes,!0)){f();continue}h(i.removedNodes,!0)&&f()}});return{onConnected(s,i){r();let u=o(s);u.connected.has(i)||(u.connected.add(i),u.length_c+=1)},offConnected(s,i){if(!t.has(s))return;let u=t.get(s);u.connected.has(i)&&(u.connected.delete(i),u.length_c-=1,c(s,u))},onDisconnected(s,i){r();let u=o(s);u.disconnected.has(i)||(u.disconnected.add(i),u.length_d+=1)},offDisconnected(s,i){if(!t.has(s))return;let u=t.get(s);u.disconnected.has(i)&&(u.disconnected.delete(i),u.length_d-=1,c(s,u))}};function c(s,i){i.length_c||i.length_d||(t.delete(s),f())}function o(s){if(t.has(s))return t.get(s);let i={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(s,i),i}function r(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function f(){!e||t.size||(e=!1,n.disconnect())}function d(){return new Promise(function(s){(requestIdleCallback||requestAnimationFrame)(s)})}async function a(s){t.size>30&&await d();let i=[];if(!(s instanceof Node))return i;for(let u of t.keys())u===s||!(u instanceof Node)||s.contains(u)&&i.push(u);return i}function l(s,i){let u=!1;for(let p of s){if(i&&a(p).then(l),!t.has(p))continue;let m=t.get(p);m.length_c&&(p.dispatchEvent(new Event("dde:connected")),m.connected=new WeakSet,m.length_c=0,m.length_d||t.delete(p),u=!0)}return u}function h(s,i){let u=!1;for(let p of s)i&&a(p).then(h),!(!t.has(p)||!t.get(p).length_d)&&(p.dispatchEvent(new Event("dde:disconnected")),t.delete(p),u=!0);return u}}
globalThis.dde= {assign: w,
assignAttribute: W,
chainableAppend: U,
classListDeclarative: z,
createElement: C,
createElementNS: et,
dispatchEvent: ct,
el: C,
elNS: et,
elementAttribute: B,
empty: nt,
on: _,
registerReactivity: q,
scope: E,
simulateSlots: tt
};

})();