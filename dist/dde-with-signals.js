//deka-dom-el library is available via global namespace `dde`
(()=> {
var y={isSignal(t){return!1},processReactiveAttribute(t,e,n,o){return n}};function M(t,e=!0){return e?Object.assign(y,t):(Object.setPrototypeOf(t,y),t)}function R(t){return y.isPrototypeOf(t)&&t!==y?t:y}function v(t){return typeof t>"u"}function F(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function C(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var U={setDeleteAttr:X};function X(t,e,n){if(Reflect.set(t,e,n),!!v(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var w=[{scope:document.body,host:t=>t?t(document.body):document.body,prevent:!0,inherit_host:!1}],_={get current(){return w[w.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...w]},push(t={}){return w.push(Object.assign({},this.current,{prevent:!1},t))},pop(){return w.pop()}},L;function m(t,e,...n){let o=R(this),r=0,c,s;switch((Object(e)!==e||o.isSignal(e))&&(e={textContent:e}),!0){case typeof t=="function":{r=1;let{inherit_host:a,host:d}=_.current,h=a?d:i=>i?(r===1?n.unshift(i):i(s),void 0):s;_.push({scope:t,host:h,inherit_host:a}),c=t(e||void 0);let E=c instanceof DocumentFragment,u=m.mark({type:"component",name:t.name,host:E?"this":c.nodeName==="#comment"?"previousLater":"parentElement"});c.prepend(u),E&&(s=u);break}case t==="#text":c=N.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=N.call(this,document.createDocumentFragment(),e);break;case L:c=N.call(this,document.createElementNS(L,t),e);break;case!c:c=N.call(this,document.createElement(t),e)}return rt(c),s||(s=c),n.forEach(a=>a(s)),r&&_.pop(),r=2,c}m.mark=function(t,e=!1){t=Object.entries(t).map(([r,c])=>r+`="${c}"`).join(" ");let n=e?"":"/",o=document.createComment(`<dde:mark ${t}${n}>`);return e||(o.end=document.createComment("</dde:mark>")),o};m.later=function(){let t=m.mark({type:"later"});return t.append=t.prepend=function(...e){return t.after(...e),t},t};function bt(t){let e=this;return function(...o){L=t;let r=m.call(e,...o);return L=void 0,r}}var{setDeleteAttr:q}=U,P=new WeakMap;function N(t,...e){if(!e.length)return t;P.set(t,J(t,this));for(let[n,o]of Object.entries(Object.assign({},...e)))I.call(this,t,n,o);return P.delete(t),t}function I(t,e,n){let{setRemoveAttr:o,s:r}=J(t,this),c=this;n=r.processReactiveAttribute(t,e,n,(a,d)=>I.call(c,t,a,d));let[s]=e;if(s==="=")return o(e.slice(1),n);if(s===".")return H(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),o(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return o(e,n,"http://www.w3.org/1999/xlink");case"textContent":return q(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return W(r,n,H.bind(null,t[e]));case"ariaset":return W(r,n,(a,d)=>o("aria-"+a,d));case"classList":return Y.call(c,t,n)}return tt(t,e)?q(t,e,n):o(e,n)}function J(t,e){if(P.has(t))return P.get(t);let o=(t instanceof SVGElement?nt:et).bind(null,t,"Attribute"),r=R(e);return{setRemoveAttr:o,s:r}}function Y(t,e){let n=R(this);return W(n,e,(o,r)=>t.classList.toggle(o,r===-1?void 0:!!r)),t}function Et(t){return Array.from(t.children).forEach(e=>e.remove()),t}function tt(t,e){if(!Reflect.has(t,e))return!1;let n=Z(t,e);return!v(n.set)}function Z(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||Z(t,e)}function W(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([r,c]){r&&(c=t.processReactiveAttribute(e,r,c,n),n(r,c))})}function G(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function et(t,e,n,o){return t[(v(o)?"remove":"set")+e](n,G(o))}function nt(t,e,n,o,r=null){return t[(v(o)?"remove":"set")+e+"NS"](r,n,G(o))}function H(t,e,n){if(Reflect.set(t,e,n),!!v(n))return Reflect.deleteProperty(t,e)}function B(...t){return this.appendOrig(...t),this}function rt(t){return t.append===B||(t.appendOrig=t.append,t.append=B),t}function xt(t,e,...n){let o=n.length?new CustomEvent(e,{detail:n[0]}):new Event(e);return t.dispatchEvent(o)}function x(t,e,n){return function(r){return r.addEventListener(t,e,n),r}}var j=ct(),ot=new WeakSet;x.connected=function(t,e){let n="connected";return typeof e!="object"&&(e={}),e.once=!0,function(r){let c="dde:"+n;return r.addEventListener(c,t,e),r.__dde_lifecycleToEvents?r:r.isConnected?(r.dispatchEvent(new Event(c)),r):(C(e.signal,()=>j.offConnected(r,t))&&j.onConnected(r,t),r)}};x.disconnected=function(t,e){let n="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(r){let c="dde:"+n;return r.addEventListener(c,t,e),r.__dde_lifecycleToEvents||C(e.signal,()=>j.offDisconnected(r,t))&&j.onDisconnected(r,t),r}};x.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(r){let c="dde:"+n;if(r.addEventListener(c,t,e),r.__dde_lifecycleToEvents||ot.has(r))return r;let s=new MutationObserver(function(d){for(let{attributeName:h,target:E}of d)E.dispatchEvent(new CustomEvent(c,{detail:[h,E.getAttribute(h)]}))});return C(e.signal,()=>s.disconnect())&&s.observe(r,{attributes:!0}),r}};function ct(){let t=new Map,e=!1,n=new MutationObserver(function(u){for(let i of u)if(i.type==="childList"){if(h(i.addedNodes,!0)){s();continue}E(i.removedNodes,!0)&&s()}});return{onConnected(u,i){c();let f=r(u);f.connected.has(i)||(f.connected.add(i),f.length_c+=1)},offConnected(u,i){if(!t.has(u))return;let f=t.get(u);f.connected.has(i)&&(f.connected.delete(i),f.length_c-=1,o(u,f))},onDisconnected(u,i){c();let f=r(u);f.disconnected.has(i)||(f.disconnected.add(i),f.length_d+=1)},offDisconnected(u,i){if(!t.has(u))return;let f=t.get(u);f.disconnected.has(i)&&(f.disconnected.delete(i),f.length_d-=1,o(u,f))}};function o(u,i){i.length_c||i.length_d||(t.delete(u),s())}function r(u){if(t.has(u))return t.get(u);let i={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(u,i),i}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function a(){return new Promise(function(u){(requestIdleCallback||requestAnimationFrame)(u)})}async function d(u){t.size>30&&await a();let i=[];if(!(u instanceof Node))return i;for(let f of t.keys())f===u||!(f instanceof Node)||u.contains(f)&&i.push(f);return i}function h(u,i){let f=!1;for(let b of u){if(i&&d(b).then(h),!t.has(b))continue;let S=t.get(b);S.length_c&&(b.dispatchEvent(new Event("dde:connected")),S.connected=new WeakSet,S.length_c=0,S.length_d||t.delete(b),f=!0)}return f}function E(u,i){let f=!1;for(let b of u)i&&d(b).then(E),!(!t.has(b)||!t.get(b).length_d)&&(b.dispatchEvent(new Event("dde:disconnected")),t.delete(b),f=!0);return f}}var p=Symbol.for("Signal");function D(t){try{return Reflect.has(t,p)}catch{return!1}}var T=[],l=new WeakMap;function g(t,e){if(typeof t!="function")return V(t,e);if(D(t))return t;let n=V(),o=function(){let[r,...c]=l.get(o);if(l.set(o,new Set([r])),T.push(o),n(t()),T.pop(),!c.length)return;let s=l.get(o);for(let a of c)s.has(a)||O(a,o)};return l.set(n[p],o),l.set(o,new Set([n])),o(),n}g.action=function(t,e,...n){let o=t[p],{actions:r}=o;if(!r||!Reflect.has(r,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(r[e].apply(o,n),o.skip)return Reflect.deleteProperty(o,"skip");o.listeners.forEach(c=>c(o.value))};g.on=function t(e,n,o={}){let{signal:r}=o;if(!(r&&r.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,o));z(e,n),r&&r.addEventListener("abort",()=>O(e,n))}};g.symbols={signal:p,onclear:Symbol.for("Signal.onclear")};var A="__dde_attributes";g.attribute=function(t,e=void 0){let n=g(e),o;return _.host(r=>{if(o=r,r instanceof HTMLElement?r.hasAttribute(t)&&n(r.getAttribute(t)):r.hasAttributeNS(null,t)&&n(r.getAttributeNS(null,t)),r[A]){r[A][t]=n;return}return r[A]={[t]:n},x.attributeChanged(function({detail:s}){/*! This maps attributes to signals (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/let[a,d]=s,h=r[A][a];if(h)return h(d)})(r),x.disconnected(function(){/*! This removes all signals mapped to attributes (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/g.clear(...Object.values(r[A])),o=null})(r),r}),new Proxy(n,{apply(r,c,s){if(!s.length)return r();if(!o)return;let a=s[0];return o instanceof HTMLElement?o.setAttribute(t,a):o.setAttributeNS(null,t,a)}})};g.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let o=n[p];o.onclear.forEach(r=>r.call(o)),e(n,o),Reflect.deleteProperty(n,p)}function e(n,o){o.listeners.forEach(r=>{if(o.listeners.delete(r),!l.has(r))return;let c=l.get(r);c.delete(n),!(c.size>1)&&(g.clear(...c),l.delete(r))})}};var k="__dde_reactive";g.el=function(t,e){let n=m.mark({type:"reactive"},!1),o=n.end,r=document.createDocumentFragment();r.append(n,o);let{current:c}=_,s=a=>{if(!n.parentNode||!o.parentNode)return O(t,s);_.push(c);let d=e(a);_.pop(),Array.isArray(d)||(d=[d]);let h=n;for(;(h=n.nextSibling)!==o;)h.remove();n.after(...d)};return z(t,s),Q(t,s,n,e),s(t()),r};var K={isSignal:D,processReactiveAttribute(t,e,n,o){if(!D(n))return n;let r=c=>o(e,c);return z(n,r),Q(n,r,t,e),n()}};function Q(t,e,...n){let{current:o}=_;o.prevent||o.host(function(r){r[k]||(r[k]=[],x.disconnected(()=>r[k].forEach(([[c,s]])=>O(c,s,c[p]?.host()===r)))(r)),r[k].push([[t,e],...n])})}function V(t,e){let n=(...o)=>o.length?at(n,...o):ft(n);return it(n,t,e)}var st=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),$=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),o=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(r=>!r.includes(o))}};function it(t,e,n){let o=[];F(n)!=="[object Object]"&&(n={});let{onclear:r}=g.symbols;n[r]&&(o.push(n[r]),Reflect.deleteProperty(n,r));let{host:c}=_;return Reflect.defineProperty(t,p,{value:{value:e,actions:n,onclear:o,host:c,listeners:new Set,defined:new $},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[p],st),t}function ut(){return T[T.length-1]}function ft(t){if(!t[p])return;let{value:e,listeners:n}=t[p],o=ut();return o&&n.add(o),l.has(o)&&l.get(o).add(t),e}function at(t,e,n){if(!t[p])return;let o=t[p];if(!(!n&&o.value===e))return o.value=e,o.listeners.forEach(r=>r(e)),e}function z(t,e){if(t[p])return t[p].listeners.add(e)}function O(t,e,n){let o=t[p];if(!o)return;let r=o.listeners.delete(e);if(n&&!o.listeners.size){if(g.clear(t),!l.has(o))return r;let c=l.get(o);if(!l.has(c))return r;l.get(c).forEach(s=>O(s,c,!0))}return r}M(K);
globalThis.dde= {S: g,
assign: N,
assignAttribute: I,
classListDeclarative: Y,
createElement: m,
createElementNS: bt,
dispatchEvent: xt,
el: m,
elNS: bt,
empty: Et,
isSignal: D,
on: x,
registerReactivity: M,
scope: _
};

})();