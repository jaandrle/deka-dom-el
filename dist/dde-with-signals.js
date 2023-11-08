//deka-dom-el library is available via global namespace `dde`
(()=> {
var y={isSignal(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function W(t,e=!0){return e?Object.assign(y,t):(Object.setPrototypeOf(t,y),t)}function R(t){return y.isPrototypeOf(t)&&t!==y?t:y}function _(t){return typeof t>"u"}function F(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function C(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var U={setDeleteAttr:X};function X(t,e,n){if(Reflect.set(t,e,n),!!_(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var w=[{scope:document.body,host:t=>t?t(document.body):document.body,prevent:!0}],E={get current(){return w[w.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...w]},push(t={}){return w.push(Object.assign({},this.current,{prevent:!1},t))},pop(){return w.pop()}},L;function m(t,e,...n){let r=R(this),o=0,c,s;switch((Object(e)!==e||r.isSignal(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,E.push({scope:t,host:h=>h?(o===1?n.unshift(h):h(s),void 0):s}),c=t(e||void 0);let d=c instanceof DocumentFragment,a=m.mark({type:"component",name:t.name,host:d?"this":c.nodeName==="#comment"?"previousLater":"parentElement"});c.prepend(a),d&&(s=a);break}case t==="#text":c=N.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=N.call(this,document.createDocumentFragment(),e);break;case L:c=N.call(this,document.createElementNS(L,t),e);break;case!c:c=N.call(this,document.createElement(t),e)}return rt(c),s||(s=c),n.forEach(d=>d(s)),o&&E.pop(),o=2,c}m.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=document.createComment(`<dde:mark ${t}${n}>`);return e||(r.end=document.createComment("</dde:mark>")),r};m.later=function(){let t=m.mark({type:"later"});return t.append=t.prepend=function(...e){return t.after(...e),t},t};function bt(t){let e=this;return function(...r){L=t;let o=m.call(e,...r);return L=void 0,o}}var{setDeleteAttr:q}=U,j=new WeakMap;function N(t,...e){if(!e.length)return t;j.set(t,J(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))I.call(this,t,n,r);return j.delete(t),t}function I(t,e,n){let{setRemoveAttr:r,s:o}=J(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(d,a)=>I.call(c,t,d,a));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return B(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return q(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return M(o,n,B.bind(null,t[e]));case"ariaset":return M(o,n,(d,a)=>r("aria-"+d,a));case"classList":return Y.call(c,t,n)}return tt(t,e)?q(t,e,n):r(e,n)}function J(t,e){if(j.has(t))return j.get(t);let r=(t instanceof SVGElement?nt:et).bind(null,t,"Attribute"),o=R(e);return{setRemoveAttr:r,s:o}}function Y(t,e){let n=R(this);return M(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function _t(t){return Array.from(t.children).forEach(e=>e.remove()),t}function tt(t,e){if(!Reflect.has(t,e))return!1;let n=Z(t,e);return!_(n.set)}function Z(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||Z(t,e)}function M(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function G(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function et(t,e,n,r){return t[(_(r)?"remove":"set")+e](n,G(r))}function nt(t,e,n,r,o=null){return t[(_(r)?"remove":"set")+e+"NS"](o,n,G(r))}function B(t,e,n){if(Reflect.set(t,e,n),!!_(n))return Reflect.deleteProperty(t,e)}function H(...t){return this.appendOrig(...t),this}function rt(t){return t.append===H||(t.appendOrig=t.append,t.append=H),t}function xt(t,e,...n){let r=n.length?new CustomEvent(e,{detail:n[0]}):new Event(e);return t.dispatchEvent(r)}function v(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var P=ct(),ot=new WeakSet;v.connected=function(t,e){let n="connected";return typeof e!="object"&&(e={}),e.once=!0,function(o){let c="dde:"+n;return o.addEventListener(c,t,e),o.__dde_lifecycleToEvents?o:o.isConnected?(o.dispatchEvent(new Event(c)),o):(C(e.signal,()=>P.offConnected(o,t))&&P.onConnected(o,t),o)}};v.disconnected=function(t,e){let n="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(o){let c="dde:"+n;return o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||C(e.signal,()=>P.offDisconnected(o,t))&&P.onDisconnected(o,t),o}};v.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||ot.has(o))return o;let s=new MutationObserver(function(a){for(let{attributeName:h,target:x}of a)x.dispatchEvent(new CustomEvent(c,{detail:[h,x.getAttribute(h)]}))});return C(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function ct(){let t=new Map,e=!1,n=new MutationObserver(function(i){for(let u of i)if(u.type==="childList"){if(h(u.addedNodes,!0)){s();continue}x(u.removedNodes,!0)&&s()}});return{onConnected(i,u){c();let f=o(i);f.connected.has(u)||(f.connected.add(u),f.length_c+=1)},offConnected(i,u){if(!t.has(i))return;let f=t.get(i);f.connected.has(u)&&(f.connected.delete(u),f.length_c-=1,r(i,f))},onDisconnected(i,u){c();let f=o(i);f.disconnected.has(u)||(f.disconnected.add(u),f.length_d+=1)},offDisconnected(i,u){if(!t.has(i))return;let f=t.get(i);f.disconnected.has(u)&&(f.disconnected.delete(u),f.length_d-=1,r(i,f))}};function r(i,u){u.length_c||u.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let u={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,u),u}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function d(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function a(i){t.size>30&&await d();let u=[];if(!(i instanceof Node))return u;for(let f of t.keys())f===i||!(f instanceof Node)||i.contains(f)&&u.push(f);return u}function h(i,u){let f=!1;for(let b of i){if(u&&a(b).then(h),!t.has(b))continue;let S=t.get(b);S.length_c&&(b.dispatchEvent(new Event("dde:connected")),S.connected=new WeakSet,S.length_c=0,S.length_d||t.delete(b),f=!0)}return f}function x(i,u){let f=!1;for(let b of i)u&&a(b).then(x),!(!t.has(b)||!t.get(b).length_d)&&(b.dispatchEvent(new Event("dde:disconnected")),t.delete(b),f=!0);return f}}var p=Symbol.for("Signal");function D(t){try{return Reflect.has(t,p)}catch{return!1}}var T=[],l=new WeakMap;function g(t,e){if(typeof t!="function")return V(t,e);if(D(t))return t;let n=V(),r=function(){let[o,...c]=l.get(r);if(l.set(r,new Set([o])),T.push(r),n(t()),T.pop(),!c.length)return;let s=l.get(r);for(let d of c)s.has(d)||O(d,r)};return l.set(n[p],r),l.set(r,new Set([n])),r(),n}g.action=function(t,e,...n){let r=t[p],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};g.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));z(e,n),o&&o.addEventListener("abort",()=>O(e,n))}};g.symbols={signal:p,onclear:Symbol.for("Signal.onclear")};var A="__dde_attributes";g.attribute=function(t,e=void 0){let n=g(e);return E.host(r=>{if(r instanceof HTMLElement?r.hasAttribute(t)&&n(r.getAttribute(t)):r.hasAttributeNS(null,t)&&n(r.getAttributeNS(null,t)),r[A]){r[A][t]=n;return}return r[A]={[t]:n},v.attributeChanged(function({detail:c}){/*! This maps attributes to signals (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/let[s,d]=c,a=r[A][s];a&&a(d)})(r),v.disconnected(function(){/*! This removes all signals mapped to attributes (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/g.clear(...Object.values(r[A]))})(r),r}),n};g.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[p];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,p)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!l.has(o))return;let c=l.get(o);c.delete(n),!(c.size>1)&&(g.clear(...c),l.delete(o))})}};var k="__dde_reactive";g.el=function(t,e){let n=m.mark({type:"reactive"},!1),r=n.end,o=document.createDocumentFragment();o.append(n,r);let{current:c}=E,s=d=>{if(!n.parentNode||!r.parentNode)return O(t,s);E.push(c);let a=e(d);E.pop(),Array.isArray(a)||(a=[a]);let h=n;for(;(h=n.nextSibling)!==r;)h.remove();n.after(...a)};return z(t,s),Q(t,s,n,e),s(t()),o};var K={isSignal:D,processReactiveAttribute(t,e,n,r){if(!D(n))return n;let o=c=>r(e,c);return z(n,o),Q(n,o,t,e),n()}};function Q(t,e,...n){let{current:r}=E;r.prevent||r.host(function(o){o[k]||(o[k]=[],v.disconnected(()=>o[k].forEach(([[c,s]])=>O(c,s,c[p]?.host()===o)))(o)),o[k].push([[t,e],...n])})}function V(t,e){let n=(...r)=>r.length?at(n,...r):ft(n);return it(n,t,e)}var st=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),$=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function it(t,e,n){let r=[];F(n)!=="[object Object]"&&(n={});let{onclear:o}=g.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=E;return Reflect.defineProperty(t,p,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new $},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[p],st),t}function ut(){return T[T.length-1]}function ft(t){if(!t[p])return;let{value:e,listeners:n}=t[p],r=ut();return r&&n.add(r),l.has(r)&&l.get(r).add(t),e}function at(t,e,n){if(!t[p])return;let r=t[p];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function z(t,e){if(t[p])return t[p].listeners.add(e)}function O(t,e,n){let r=t[p];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(g.clear(t),!l.has(r))return o;let c=l.get(r);if(!l.has(c))return o;l.get(c).forEach(s=>O(s,c,!0))}return o}W(K);
globalThis.dde= {S: g,
assign: N,
assignAttribute: I,
classListDeclarative: Y,
createElement: m,
createElementNS: bt,
dispatchEvent: xt,
el: m,
elNS: bt,
empty: _t,
isSignal: D,
on: v,
registerReactivity: W,
scope: E
};

})();