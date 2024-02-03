var N={isObservable(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function B(t,e=!0){return e?Object.assign(N,t):(Object.setPrototypeOf(t,N),t)}function W(t){return N.isPrototypeOf(t)&&t!==N?t:N}var T=(...t)=>Object.prototype.hasOwnProperty.call(...t);function A(t){return typeof t>"u"}function Q(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function q(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}function F(t,e){let{observedAttributes:n=[]}=t.constructor;return n.reduce(function(r,o){return r[pt(o)]=e(t,o),r},{})}function pt(t){return t.replace(/-./g,e=>e[1].toUpperCase())}var d={setDeleteAttr:lt,ssr:"",D:globalThis.document,F:globalThis.DocumentFragment,H:globalThis.HTMLElement,S:globalThis.SVGElement,M:globalThis.MutationObserver};function lt(t,e,n){if(Reflect.set(t,e,n),!!A(n)){if(Reflect.deleteProperty(t,e),t instanceof d.H&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var C="__dde_lifecycleToEvents",O="dde:connected",S="dde:disconnected",P="dde:attributeChanged";var w=[{get scope(){return d.D.body},host:t=>t?t(d.D.body):d.D.body,prevent:!0}],m={get current(){return w[w.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...w]},push(t={}){return w.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return w.push(w[0])},pop(){if(w.length!==1)return w.pop()}};function X(...t){return this.appendOriginal(...t),this}function ht(t){return t.append===X||(t.appendOriginal=t.append,t.append=X),t}var $;function M(t,e,...n){let r=W(this),o=0,c,s;switch((Object(e)!==e||r.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,m.push({scope:t,host:(...g)=>g.length?(o===1?n.unshift(...g):g.forEach(p=>p(s)),void 0):s}),c=t(e||void 0);let a=c instanceof d.F;if(c.nodeName==="#comment")break;let h=M.mark({type:"component",name:t.name,host:a?"this":"parentElement"});c.prepend(h),a&&(s=h);break}case t==="#text":c=j.call(this,d.D.createTextNode(""),e);break;case(t==="<>"||!t):c=j.call(this,d.D.createDocumentFragment(),e);break;case!!$:c=j.call(this,d.D.createElementNS($,t),e);break;case!c:c=j.call(this,d.D.createElement(t),e)}return ht(c),s||(s=c),n.forEach(a=>a(s)),o&&m.pop(),o=2,c}function Wt(t,e=t,n=void 0){let r=Symbol.for("default"),o=Array.from(e.querySelectorAll("slot")).reduce((s,a)=>Reflect.set(s,a.name||r,a)&&s,{}),c=T(o,r);if(t.append=new Proxy(t.append,{apply(s,a,h){if(!h.length)return t;let g=d.D.createDocumentFragment();for(let p of h){if(!p||!p.slot){c&&g.appendChild(p);continue}let y=p.slot,_=o[y];gt(p,"remove","slot"),_&&(bt(_,p,n),Reflect.deleteProperty(o,y))}return c&&(o[r].replaceWith(g),Reflect.deleteProperty(o,r)),t.append=s,t}}),t!==e){let s=Array.from(t.childNodes);s.forEach(a=>a.remove()),t.append(...s)}return e}function bt(t,e,n){n&&n(t,e);try{t.replaceWith(j(e,{className:[e.className,t.className],dataset:{...t.dataset}}))}catch{t.replaceWith(e)}}M.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=d.D.createComment(`<dde:mark ${t}${d.ssr}${n}>`);return e&&(r.end=d.D.createComment("</dde:mark>")),r};function qt(t){let e=this;return function(...r){$=t;let o=M.call(e,...r);return $=void 0,o}}var U=new WeakMap,{setDeleteAttr:Y}=d;function j(t,...e){if(!e.length)return t;U.set(t,nt(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))et.call(this,t,n,r);return U.delete(t),t}function et(t,e,n){let{setRemoveAttr:r,s:o}=nt(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(a,h)=>et.call(c,t,a,h));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return tt(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return Y(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return I(o,n,tt.bind(null,t[e]));case"ariaset":return I(o,n,(a,h)=>r("aria-"+a,h));case"classList":return vt.call(c,t,n)}return Et(t,e)?Y(t,e,n):r(e,n)}function nt(t,e){if(U.has(t))return U.get(t);let r=(t instanceof d.S?xt:mt).bind(null,t,"Attribute"),o=W(e);return{setRemoveAttr:r,s:o}}function vt(t,e){let n=W(this);return I(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function Ft(t){return Array.from(t.children).forEach(e=>e.remove()),t}function gt(t,e,n,r){return t instanceof d.H?t[e+"Attribute"](n,r):t[e+"AttributeNS"](null,n,r)}function Et(t,e){if(!(e in t))return!1;let n=rt(t,e);return!A(n.set)}function rt(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||rt(t,e)}function I(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function ot(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function mt(t,e,n,r){return t[(A(r)?"remove":"set")+e](n,ot(r))}function xt(t,e,n,r,o=null){return t[(A(r)?"remove":"set")+e+"NS"](o,n,ot(r))}function tt(t,e,n){if(Reflect.set(t,e,n),!!A(n))return Reflect.deleteProperty(t,e)}var D=d.M?Ot():new Proxy({},{get(){return()=>{}}});function Ot(){let t=new Map,e=!1,n=i=>function(u){for(let f of u)if(f.type==="childList"){if(p(f.addedNodes,!0)){i();continue}y(f.removedNodes,!0)&&i()}},r=new d.M(n(a));return{observe(i){let u=new d.M(n(()=>{}));return u.observe(i,{childList:!0,subtree:!0}),()=>u.disconnect()},onConnected(i,u){s();let f=c(i);f.connected.has(u)||(f.connected.add(u),f.length_c+=1)},offConnected(i,u){if(!t.has(i))return;let f=t.get(i);f.connected.has(u)&&(f.connected.delete(u),f.length_c-=1,o(i,f))},onDisconnected(i,u){s();let f=c(i);f.disconnected.has(u)||(f.disconnected.add(u),f.length_d+=1)},offDisconnected(i,u){if(!t.has(i))return;let f=t.get(i);f.disconnected.has(u)&&(f.disconnected.delete(u),f.length_d-=1,o(i,f))}};function o(i,u){u.length_c||u.length_d||(t.delete(i),a())}function c(i){if(t.has(i))return t.get(i);let u={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,u),u}function s(){e||(e=!0,r.observe(d.D.body,{childList:!0,subtree:!0}))}function a(){!e||t.size||(e=!1,r.disconnect())}function h(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function g(i){t.size>30&&await h();let u=[];if(!(i instanceof Node))return u;for(let f of t.keys())f===i||!(f instanceof Node)||i.contains(f)&&u.push(f);return u}function p(i,u){let f=!1;for(let b of i){if(u&&g(b).then(p),!t.has(b))continue;let L=t.get(b);L.length_c&&(b.dispatchEvent(new Event(O)),L.connected=new WeakSet,L.length_c=0,L.length_d||t.delete(b),f=!0)}return f}function y(i,u){let f=!1;for(let b of i)u&&g(b).then(y),!(!t.has(b)||!t.get(b).length_d)&&((globalThis.queueMicrotask||setTimeout)(_(b)),f=!0);return f}function _(i){return()=>{i.isConnected||(i.dispatchEvent(new Event(S)),t.delete(i))}}}function Zt(t,e,n,r=yt){m.push({scope:t,host:(...s)=>s.length?s.forEach(a=>a(t)):t}),typeof r=="function"&&(r=r.call(t,t));let o=t[C];o||wt(t);let c=n.call(t,r);return o||t.dispatchEvent(new Event(O)),e.nodeType===11&&typeof e.mode=="string"&&t.addEventListener(S,D.observe(e),{once:!0}),m.pop(),e.append(c)}function wt(t){return J(t.prototype,"connectedCallback",function(e,n,r){e.apply(n,r),n.dispatchEvent(new Event(O))}),J(t.prototype,"disconnectedCallback",function(e,n,r){e.apply(n,r),(globalThis.queueMicrotask||setTimeout)(()=>!n.isConnected&&n.dispatchEvent(new Event(S)))}),J(t.prototype,"attributeChangedCallback",function(e,n,r){let[o,,c]=r;n.dispatchEvent(new CustomEvent(P,{detail:[o,c]})),e.apply(n,r)}),t.prototype[C]=!0,t}function J(t,e,n){t[e]=new Proxy(t[e]||(()=>{}),{apply:n})}function yt(t){return F(t,(e,n)=>e.getAttribute(n))}function Qt(t,e,n){return e||(e={}),function(o,...c){n&&(c.unshift(o),o=typeof n=="function"?n():n);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function x(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var ct=t=>Object.assign({},typeof t=="object"?t:null,{once:!0});x.connected=function(t,e){return e=ct(e),function(r){return r.addEventListener(O,t,e),r[C]?r:r.isConnected?(r.dispatchEvent(new Event(O)),r):(q(e.signal,()=>D.offConnected(r,t))&&D.onConnected(r,t),r)}};x.disconnected=function(t,e){return e=ct(e),function(r){return r.addEventListener(S,t,e),r[C]||q(e.signal,()=>D.offDisconnected(r,t))&&D.onDisconnected(r,t),r}};var Z=new WeakMap;x.disconnectedAsAbort=function(t){if(Z.has(t))return Z.get(t);let e=new AbortController;return Z.set(t,e),t(x.disconnected(()=>e.abort())),e};var _t=new WeakSet;x.attributeChanged=function(t,e){return typeof e!="object"&&(e={}),function(r){if(r.addEventListener(P,t,e),r[C]||_t.has(r)||!d.M)return r;let o=new d.M(function(s){for(let{attributeName:a,target:h}of s)h.dispatchEvent(new CustomEvent(P,{detail:[a,h.getAttribute(a)]}))});return q(e.signal,()=>o.disconnect())&&o.observe(r,{attributes:!0}),r}};var l="__dde_observable";function z(t){try{return T(t,l)}catch{return!1}}var H=[],v=new WeakMap;function E(t,e){if(typeof t!="function")return st(!1,t,e);if(z(t))return t;let n=st(!0),r=function(){let[o,...c]=v.get(r);if(v.set(r,new Set([o])),H.push(r),dt(n,t()),H.pop(),!c.length)return;let s=v.get(r);for(let a of c)s.has(a)||k(a,r)};return v.set(n[l],r),v.set(r,new Set([n])),r(),n}E.action=function(t,e,...n){let r=t[l],{actions:o}=r;if(!o||!(e in o))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return delete r.skip;r.listeners.forEach(c=>c(r.value))};E.on=function t(e,n,r={}){let{signal:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));K(e,n),o&&o.addEventListener("abort",()=>k(e,n))}};E.symbols={onclear:Symbol.for("Observable.onclear")};E.clear=function(...t){for(let n of t){let r=n[l];r&&(delete n.toJSON,r.onclear.forEach(o=>o.call(r)),e(n,r),delete n[l])}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!v.has(o))return;let c=v.get(o);c.delete(n),!(c.size>1)&&(n.clear(...c),v.delete(o))})}};var R="__dde_reactive";E.el=function(t,e){let n=M.mark({type:"reactive"},!0),r=n.end,o=d.D.createDocumentFragment();o.append(n,r);let{current:c}=m,s={},a=h=>{if(!n.parentNode||!r.parentNode)return k(t,a);let g=s;s={},m.push(c);let p=e(h,function(u,f){let b;return T(g,u)?(b=g[u],delete g[u]):b=f(),s[u]=b,b});m.pop(),Array.isArray(p)||(p=[p]),n.after(...p);let y=p[p.length-1],_;for(;(_=y.nextSibling)!==r;)_.remove();n.isConnected&&At(c.host())};return K(t,a),ft(t,a,n,e),a(t()),o};function At(t){!t||!t[R]||(requestIdleCallback||setTimeout)(function(){t[R]=t[R].filter(([e,n])=>n.isConnected?!0:(k(...e),!1))})}var Ct={_set(t){this.value=t}};function St(t){return function(e,n){let r=(...c)=>c.length?e.setAttribute(n,...c):e.getAttribute(n),o=at(r,r(),Ct);return t[n]=o,o}}var G="__dde_attributes";E.observedAttributes=function(t){let e=t[G]={},n=F(t,St(e));return x.attributeChanged(function({detail:o}){/*! This maps attributes to observables (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/let[c,s]=o,a=this[G][c];if(a)return E.action(a,"_set",s)})(t),x.disconnected(function(){/*! This removes all observables mapped to attributes (`O.observedAttributes`).
	* Investigate `__dde_attributes` key of the element.*/E.clear(...Object.values(this[G]))})(t),n};var ut={isObservable:z,processReactiveAttribute(t,e,n,r){if(!z(n))return n;let o=c=>{if(!t.isConnected)return k(n,o);r(e,c)};return K(n,o),ft(n,o,t,e),n()}};function ft(t,e,...n){let{current:r}=m;r.prevent||r.host(function(o){o[R]||(o[R]=[],x.disconnected(()=>o[R].forEach(([[c,s]])=>k(c,s,c[l]&&c[l].host&&c[l].host()===o)))(o)),o[R].push([[t,e],...n])})}function st(t,e,n){let r=t?()=>it(r):(...o)=>o.length?dt(r,...o):it(r);return at(r,e,n,t)}var Dt=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),V=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function at(t,e,n,r=!1){let o=[];Q(n)!=="[object Object]"&&(n={});let{onclear:c}=E.symbols;n[c]&&(o.push(n[c]),delete n[c]);let{host:s}=m;return Reflect.defineProperty(t,l,{value:{value:e,actions:n,onclear:o,host:s,listeners:new Set,defined:new V().stack,readonly:r},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[l],Dt),t}function Rt(){return H[H.length-1]}function it(t){if(!t[l])return;let{value:e,listeners:n}=t[l],r=Rt();return r&&n.add(r),v.has(r)&&v.get(r).add(t),e}function dt(t,e,n){if(!t[l])return;let r=t[l];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function K(t,e){if(t[l])return t[l].listeners.add(e)}function k(t,e,n){let r=t[l];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(E.clear(t),!v.has(r))return o;let c=v.get(r);if(!v.has(c))return o;v.get(c).forEach(s=>k(s,c,!0))}return o}B(ut);export{E as O,j as assign,et as assignAttribute,ht as chainableAppend,vt as classListDeclarative,M as createElement,qt as createElementNS,Zt as customElementRender,wt as customElementWithDDE,Qt as dispatchEvent,M as el,qt as elNS,gt as elementAttribute,Ft as empty,z as isObservable,wt as lifecycleToEvents,E as observable,yt as observedAttributes,x as on,B as registerReactivity,m as scope,Wt as simulateSlots};
