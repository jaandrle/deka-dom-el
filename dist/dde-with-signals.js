//deka-dom-el library is available via global namespace `dde`
(()=> {
var w={isSignal(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function T(t,e=!0){return e?Object.assign(w,t):(Object.setPrototypeOf(t,w),t)}function R(t){return w.isPrototypeOf(t)&&t!==w?t:w}function x(t){return typeof t>"u"}function q(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function C(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var W={setDeleteAttr:Y,ssr:""};function Y(t,e,n){if(Reflect.set(t,e,n),!!x(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var E=[{scope:document.body,host:t=>t?t(document.body):document.body,custom_element:!1,prevent:!0}],g={get current(){return E[E.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...E]},push(t={}){return E.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return E.push(E[0])},pop(){if(E.length!==1)return E.pop()}};function B(...t){return this.appendOrig(...t),this}function tt(t){return t.append===B||(t.appendOrig=t.append,t.append=B),t}var L;function y(t,e,...n){let r=R(this),o=0,c,s;switch((Object(e)!==e||r.isSignal(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,g.push({scope:t,host:(...p)=>p.length?(o===1?n.unshift(...p):p.forEach(v=>v(s)),void 0):s}),c=t(e||void 0);let a=c instanceof DocumentFragment;if(c.nodeName==="#comment")break;let d=y.mark({type:"component",name:t.name,host:a?"this":"parentElement"});c.prepend(d),a&&(s=d);break}case t==="#text":c=N.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=N.call(this,document.createDocumentFragment(),e);break;case!!L:c=N.call(this,document.createElementNS(L,t),e);break;case!c:c=N.call(this,document.createElement(t),e)}return tt(c),s||(s=c),n.forEach(a=>a(s)),o&&g.pop(),o=2,c}y.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=document.createComment(`<dde:mark ${t}${W.ssr}${n}>`);return e||(r.end=document.createComment("</dde:mark>")),r};function _t(t){let e=this;return function(...r){L=t;let o=y.call(e,...r);return L=void 0,o}}var{setDeleteAttr:H}=W,j=new WeakMap;function N(t,...e){if(!e.length)return t;j.set(t,Z(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))J.call(this,t,n,r);return j.delete(t),t}function J(t,e,n){let{setRemoveAttr:r,s:o}=Z(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(a,d)=>J.call(c,t,a,d));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return I(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return H(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return $(o,n,I.bind(null,t[e]));case"ariaset":return $(o,n,(a,d)=>r("aria-"+a,d));case"classList":return et.call(c,t,n)}return nt(t,e)?H(t,e,n):r(e,n)}function Z(t,e){if(j.has(t))return j.get(t);let r=(t instanceof SVGElement?ot:rt).bind(null,t,"Attribute"),o=R(e);return{setRemoveAttr:r,s:o}}function et(t,e){let n=R(this);return $(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function Et(t){return Array.from(t.children).forEach(e=>e.remove()),t}function nt(t,e){if(!Reflect.has(t,e))return!1;let n=G(t,e);return!x(n.set)}function G(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||G(t,e)}function $(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function V(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function rt(t,e,n,r){return t[(x(r)?"remove":"set")+e](n,V(r))}function ot(t,e,n,r,o=null){return t[(x(r)?"remove":"set")+e+"NS"](o,n,V(r))}function I(t,e,n){if(Reflect.set(t,e,n),!!x(n))return Reflect.deleteProperty(t,e)}function St(t,e,...n){let r=n.length?new CustomEvent(e,{detail:n[0]}):new Event(e);return t.dispatchEvent(r)}function _(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var P=st(),ct=new WeakSet;_.connected=function(t,e){let{custom_element:n}=g.current,r="connected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents?c:c.isConnected?(c.dispatchEvent(new Event(s)),c):(C(e.signal,()=>P.offConnected(c,t))&&P.onConnected(c,t),c)}};_.disconnected=function(t,e){let{custom_element:n}=g.current,r="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents||C(e.signal,()=>P.offDisconnected(c,t))&&P.onDisconnected(c,t),c}};var z=new WeakMap;_.disconnectedAsAbort=function(t){if(z.has(t))return z.get(t);let e=new AbortController;return z.set(t,e),t(_.disconnected(()=>e.abort())),e};_.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||ct.has(o))return o;let s=new MutationObserver(function(d){for(let{attributeName:p,target:v}of d)v.dispatchEvent(new CustomEvent(c,{detail:[p,v.getAttribute(p)]}))});return C(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function st(){let t=new Map,e=!1,n=new MutationObserver(function(i){for(let u of i)if(u.type==="childList"){if(p(u.addedNodes,!0)){s();continue}v(u.removedNodes,!0)&&s()}});return{onConnected(i,u){c();let f=o(i);f.connected.has(u)||(f.connected.add(u),f.length_c+=1)},offConnected(i,u){if(!t.has(i))return;let f=t.get(i);f.connected.has(u)&&(f.connected.delete(u),f.length_c-=1,r(i,f))},onDisconnected(i,u){c();let f=o(i);f.disconnected.has(u)||(f.disconnected.add(u),f.length_d+=1)},offDisconnected(i,u){if(!t.has(i))return;let f=t.get(i);f.disconnected.has(u)&&(f.disconnected.delete(u),f.length_d-=1,r(i,f))}};function r(i,u){u.length_c||u.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let u={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,u),u}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function a(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function d(i){t.size>30&&await a();let u=[];if(!(i instanceof Node))return u;for(let f of t.keys())f===i||!(f instanceof Node)||i.contains(f)&&u.push(f);return u}function p(i,u){let f=!1;for(let m of i){if(u&&d(m).then(p),!t.has(m))continue;let S=t.get(m);S.length_c&&(m.dispatchEvent(new Event("dde:connected")),S.connected=new WeakSet,S.length_c=0,S.length_d||t.delete(m),f=!0)}return f}function v(i,u){let f=!1;for(let m of i)u&&d(m).then(v),!(!t.has(m)||!t.get(m).length_d)&&(m.dispatchEvent(new Event("dde:disconnected")),t.delete(m),f=!0);return f}}var l=Symbol.for("Signal");function D(t){try{return Reflect.has(t,l)}catch{return!1}}var M=[],h=new WeakMap;function b(t,e){if(typeof t!="function")return K(t,e);if(D(t))return t;let n=K(),r=function(){let[o,...c]=h.get(r);if(h.set(r,new Set([o])),M.push(r),n(t()),M.pop(),!c.length)return;let s=h.get(r);for(let a of c)s.has(a)||O(a,r)};return h.set(n[l],r),h.set(r,new Set([n])),r(),n}b.action=function(t,e,...n){let r=t[l],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};b.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));U(e,n),o&&o.addEventListener("abort",()=>O(e,n))}};b.symbols={signal:l,onclear:Symbol.for("Signal.onclear")};var A="__dde_attributes";b.attribute=function(t,e=void 0){let n=b(e),r;return g.host(o=>{if(r=o,o instanceof HTMLElement?o.hasAttribute(t)&&n(o.getAttribute(t)):o.hasAttributeNS(null,t)&&n(o.getAttributeNS(null,t)),o[A]){o[A][t]=n;return}return o[A]={[t]:n},_.attributeChanged(function({detail:s}){/*! This maps attributes to signals (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/let[a,d]=s,p=o[A][a];if(p)return p(d)})(o),_.disconnected(function(){/*! This removes all signals mapped to attributes (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/b.clear(...Object.values(o[A])),r=null})(o),o}),new Proxy(n,{apply(o,c,s){if(!s.length)return o();if(!r)return;let a=s[0];return r instanceof HTMLElement?r.setAttribute(t,a):r.setAttributeNS(null,t,a)}})};b.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[l];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,l)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!h.has(o))return;let c=h.get(o);c.delete(n),!(c.size>1)&&(b.clear(...c),h.delete(o))})}};var k="__dde_reactive";b.el=function(t,e){let n=y.mark({type:"reactive"},!1),r=n.end,o=document.createDocumentFragment();o.append(n,r);let{current:c}=g,s=a=>{if(!n.parentNode||!r.parentNode)return O(t,s);g.push(c);let d=e(a);g.pop(),Array.isArray(d)||(d=[d]);let p=n;for(;(p=n.nextSibling)!==r;)p.remove();n.after(...d)};return U(t,s),X(t,s,n,e),s(t()),o};var Q={isSignal:D,processReactiveAttribute(t,e,n,r){if(!D(n))return n;let o=c=>r(e,c);return U(n,o),X(n,o,t,e),n()}};function X(t,e,...n){let{current:r}=g;r.prevent||r.host(function(o){o[k]||(o[k]=[],_.disconnected(()=>o[k].forEach(([[c,s]])=>O(c,s,c[l]?.host()===o)))(o)),o[k].push([[t,e],...n])})}function K(t,e){let n=(...r)=>r.length?dt(n,...r):at(n);return ut(n,t,e)}var it=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),F=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function ut(t,e,n){let r=[];q(n)!=="[object Object]"&&(n={});let{onclear:o}=b.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=g;return Reflect.defineProperty(t,l,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new F},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[l],it),t}function ft(){return M[M.length-1]}function at(t){if(!t[l])return;let{value:e,listeners:n}=t[l],r=ft();return r&&n.add(r),h.has(r)&&h.get(r).add(t),e}function dt(t,e,n){if(!t[l])return;let r=t[l];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function U(t,e){if(t[l])return t[l].listeners.add(e)}function O(t,e,n){let r=t[l];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(b.clear(t),!h.has(r))return o;let c=h.get(r);if(!h.has(c))return o;h.get(c).forEach(s=>O(s,c,!0))}return o}T(Q);
globalThis.dde= {S: b,
assign: N,
assignAttribute: J,
chainableAppend: tt,
classListDeclarative: et,
createElement: y,
createElementNS: _t,
dispatchEvent: St,
el: y,
elNS: _t,
empty: Et,
isSignal: D,
on: _,
registerReactivity: T,
scope: g
};

})();