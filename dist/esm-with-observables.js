var R={isObservable(t){return!1},processReactiveAttribute(t,e,n,r){return n}};function $(t,e=!0){return e?Object.assign(R,t):(Object.setPrototypeOf(t,R),t)}function N(t){return R.isPrototypeOf(t)&&t!==R?t:R}function x(t){return typeof t>"u"}function H(t){let e=typeof t;return e!=="object"?e:t===null?"null":Object.prototype.toString.call(t)}function P(t,e){if(!t||!(t instanceof AbortSignal))return!0;if(!t.aborted)return t.addEventListener("abort",e),function(){t.removeEventListener("abort",e)}}var F={setDeleteAttr:et,ssr:""};function et(t,e,n){if(Reflect.set(t,e,n),!!x(n)){if(Reflect.deleteProperty(t,e),t instanceof HTMLElement&&t.getAttribute(e)==="undefined")return t.removeAttribute(e);if(Reflect.get(t,e)==="undefined")return Reflect.set(t,e,"")}}var v=[{scope:document.body,host:t=>t?t(document.body):document.body,custom_element:!1,prevent:!0}],b={get current(){return v[v.length-1]},get host(){return this.current.host},preventDefault(){let{current:t}=this;return t.prevent=!0,t},get state(){return[...v]},push(t={}){return v.push(Object.assign({},this.current,{prevent:!1},t))},pushRoot(){return v.push(v[0])},pop(){if(v.length!==1)return v.pop()}};function I(...t){return this.appendOriginal(...t),this}function nt(t){return t.append===I||(t.appendOriginal=t.append,t.append=I),t}var L;function y(t,e,...n){let r=N(this),o=0,c,s;switch((Object(e)!==e||r.isObservable(e))&&(e={textContent:e}),!0){case typeof t=="function":{o=1,b.push({scope:t,host:(...l)=>l.length?(o===1?n.unshift(...l):l.forEach(m=>m(s)),void 0):s}),c=t(e||void 0);let d=c instanceof DocumentFragment;if(c.nodeName==="#comment")break;let u=y.mark({type:"component",name:t.name,host:d?"this":"parentElement"});c.prepend(u),d&&(s=u);break}case t==="#text":c=j.call(this,document.createTextNode(""),e);break;case(t==="<>"||!t):c=j.call(this,document.createDocumentFragment(),e);break;case!!L:c=j.call(this,document.createElementNS(L,t),e);break;case!c:c=j.call(this,document.createElement(t),e)}return nt(c),s||(s=c),n.forEach(d=>d(s)),o&&b.pop(),o=2,c}function Et(t){let e=Symbol.for("default"),n=Array.from(t.querySelectorAll("slot")).reduce((o,c)=>Reflect.set(o,c.name||e,c)&&o,{}),r=Reflect.has(n,e);return t.append=new Proxy(t.append,{apply(o,c,s){if(!s.length)return t;let d=document.createDocumentFragment();for(let u of s){if(!u||!u.slot){r&&d.appendChild(u);continue}let l=u.slot,m=n[l];w(u,"remove","slot"),m&&(m.replaceWith(u),Reflect.deleteProperty(n,l))}return r&&(n[e].replaceWith(d),Reflect.deleteProperty(n,e)),Object.values(n).forEach(u=>u.replaceWith(y().append(...Array.from(u.childNodes)))),t}}),t}y.mark=function(t,e=!1){t=Object.entries(t).map(([o,c])=>o+`="${c}"`).join(" ");let n=e?"":"/",r=document.createComment(`<dde:mark ${t}${F.ssr}${n}>`);return e||(r.end=document.createComment("</dde:mark>")),r};function xt(t){let e=this;return function(...r){L=t;let o=y.call(e,...r);return L=void 0,o}}var{setDeleteAttr:J}=F,D=new WeakMap;function j(t,...e){if(!e.length)return t;D.set(t,V(t,this));for(let[n,r]of Object.entries(Object.assign({},...e)))G.call(this,t,n,r);return D.delete(t),t}function G(t,e,n){let{setRemoveAttr:r,s:o}=V(t,this),c=this;n=o.processReactiveAttribute(t,e,n,(d,u)=>G.call(c,t,d,u));let[s]=e;if(s==="=")return r(e.slice(1),n);if(s===".")return Z(t,e.slice(1),n);if(/(aria|data)([A-Z])/.test(e))return e=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r(e,n);switch(e==="className"&&(e="class"),e){case"xlink:href":return r(e,n,"http://www.w3.org/1999/xlink");case"textContent":return J(t,e,n);case"style":if(typeof n!="object")break;case"dataset":return z(o,n,Z.bind(null,t[e]));case"ariaset":return z(o,n,(d,u)=>r("aria-"+d,u));case"classList":return rt.call(c,t,n)}return ot(t,e)?J(t,e,n):r(e,n)}function V(t,e){if(D.has(t))return D.get(t);let r=(t instanceof SVGElement?st:ct).bind(null,t,"Attribute"),o=N(e);return{setRemoveAttr:r,s:o}}function rt(t,e){let n=N(this);return z(n,e,(r,o)=>t.classList.toggle(r,o===-1?void 0:!!o)),t}function Ot(t){return Array.from(t.children).forEach(e=>e.remove()),t}function w(t,e,n,r){return t instanceof HTMLElement?t[e+"Attribute"](n,r):t[e+"AttributeNS"](null,n,r)}function ot(t,e){if(!Reflect.has(t,e))return!1;let n=K(t,e);return!x(n.set)}function K(t,e){if(t=Object.getPrototypeOf(t),!t)return{};let n=Object.getOwnPropertyDescriptor(t,e);return n||K(t,e)}function z(t,e,n){if(!(typeof e!="object"||e===null))return Object.entries(e).forEach(function([o,c]){o&&(c=t.processReactiveAttribute(e,o,c,n),n(o,c))})}function Q(t){return Array.isArray(t)?t.filter(Boolean).join(" "):t}function ct(t,e,n,r){return t[(x(r)?"remove":"set")+e](n,Q(r))}function st(t,e,n,r,o=null){return t[(x(r)?"remove":"set")+e+"NS"](o,n,Q(r))}function Z(t,e,n){if(Reflect.set(t,e,n),!!x(n))return Reflect.deleteProperty(t,e)}function At(t,e,n){return e||(e={}),function(o,...c){n&&(c.unshift(o),o=typeof n=="function"?n():n);let s=c.length?new CustomEvent(t,Object.assign({detail:c[0]},e)):new Event(t,e);return o.dispatchEvent(s)}}function _(t,e,n){return function(o){return o.addEventListener(t,e,n),o}}var k=ft(),it=new WeakSet;_.connected=function(t,e){let{custom_element:n}=b.current,r="connected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents?c:c.isConnected?(c.dispatchEvent(new Event(s)),c):(P(e.signal,()=>k.offConnected(c,t))&&k.onConnected(c,t),c)}};_.disconnected=function(t,e){let{custom_element:n}=b.current,r="disconnected";return typeof e!="object"&&(e={}),e.once=!0,function(c){n&&(c=n);let s="dde:"+r;return c.addEventListener(s,t,e),c.__dde_lifecycleToEvents||P(e.signal,()=>k.offDisconnected(c,t))&&k.onDisconnected(c,t),c}};var q=new WeakMap;_.disconnectedAsAbort=function(t){if(q.has(t))return q.get(t);let e=new AbortController;return q.set(t,e),t(_.disconnected(()=>e.abort())),e};_.attributeChanged=function(t,e){let n="attributeChanged";return typeof e!="object"&&(e={}),function(o){let c="dde:"+n;if(o.addEventListener(c,t,e),o.__dde_lifecycleToEvents||it.has(o))return o;let s=new MutationObserver(function(u){for(let{attributeName:l,target:m}of u)m.dispatchEvent(new CustomEvent(c,{detail:[l,m.getAttribute(l)]}))});return P(e.signal,()=>s.disconnect())&&s.observe(o,{attributes:!0}),o}};function ft(){let t=new Map,e=!1,n=new MutationObserver(function(i){for(let f of i)if(f.type==="childList"){if(l(f.addedNodes,!0)){s();continue}m(f.removedNodes,!0)&&s()}});return{onConnected(i,f){c();let a=o(i);a.connected.has(f)||(a.connected.add(f),a.length_c+=1)},offConnected(i,f){if(!t.has(i))return;let a=t.get(i);a.connected.has(f)&&(a.connected.delete(f),a.length_c-=1,r(i,a))},onDisconnected(i,f){c();let a=o(i);a.disconnected.has(f)||(a.disconnected.add(f),a.length_d+=1)},offDisconnected(i,f){if(!t.has(i))return;let a=t.get(i);a.disconnected.has(f)&&(a.disconnected.delete(f),a.length_d-=1,r(i,a))}};function r(i,f){f.length_c||f.length_d||(t.delete(i),s())}function o(i){if(t.has(i))return t.get(i);let f={connected:new WeakSet,length_c:0,disconnected:new WeakSet,length_d:0};return t.set(i,f),f}function c(){e||(e=!0,n.observe(document.body,{childList:!0,subtree:!0}))}function s(){!e||t.size||(e=!1,n.disconnect())}function d(){return new Promise(function(i){(requestIdleCallback||requestAnimationFrame)(i)})}async function u(i){t.size>30&&await d();let f=[];if(!(i instanceof Node))return f;for(let a of t.keys())a===i||!(a instanceof Node)||i.contains(a)&&f.push(a);return f}function l(i,f){let a=!1;for(let g of i){if(f&&u(g).then(l),!t.has(g))continue;let A=t.get(g);A.length_c&&(g.dispatchEvent(new Event("dde:connected")),A.connected=new WeakSet,A.length_c=0,A.length_d||t.delete(g),a=!0)}return a}function m(i,f){let a=!1;for(let g of i)f&&u(g).then(m),!(!t.has(g)||!t.get(g).length_d)&&(g.dispatchEvent(new Event("dde:disconnected")),t.delete(g),a=!0);return a}}var p=Symbol.for("observable");function M(t){try{return Reflect.has(t,p)}catch{return!1}}var T=[],h=new WeakMap;function E(t,e){if(typeof t!="function")return X(t,e);if(M(t))return t;let n=X(),r=function(){let[o,...c]=h.get(r);if(h.set(r,new Set([o])),T.push(r),n(t()),T.pop(),!c.length)return;let s=h.get(r);for(let d of c)s.has(d)||C(d,r)};return h.set(n[p],r),h.set(r,new Set([n])),r(),n}E.action=function(t,e,...n){let r=t[p],{actions:o}=r;if(!o||!Reflect.has(o,e))throw new Error(`'${t}' has no action with name '${e}'!`);if(o[e].apply(r,n),r.skip)return Reflect.deleteProperty(r,"skip");r.listeners.forEach(c=>c(r.value))};E.on=function t(e,n,r={}){let{observable:o}=r;if(!(o&&o.aborted)){if(Array.isArray(e))return e.forEach(c=>t(c,n,r));B(e,n),o&&o.addEventListener("abort",()=>C(e,n))}};E.symbols={observable:p,onclear:Symbol.for("Observable.onclear")};E.clear=function(...t){for(let n of t){Reflect.deleteProperty(n,"toJSON");let r=n[p];r.onclear.forEach(o=>o.call(r)),e(n,r),Reflect.deleteProperty(n,p)}function e(n,r){r.listeners.forEach(o=>{if(r.listeners.delete(o),!h.has(o))return;let c=h.get(o);c.delete(n),!(c.size>1)&&(n.clear(...c),h.delete(o))})}};var W="__dde_reactive";E.el=function(t,e){let n=y.mark({type:"reactive"},!1),r=n.end,o=document.createDocumentFragment();o.append(n,r);let{current:c}=b,s=d=>{if(!n.parentNode||!r.parentNode)return C(t,s);b.push(c);let u=e(d);b.pop(),Array.isArray(u)||(u=[u]);let l=n;for(;(l=n.nextSibling)!==r;)l.remove();n.after(...u)};return B(t,s),tt(t,s,n,e),s(t()),o};var S="__dde_attributes";E.attribute=function(t,e=null){let n=O(e),r;return b.host(o=>{if(r=o,w(r,"has",t)?n(w(r,"get",t)):e!==null&&w(r,"set",t,e),o[S]){o[S][t]=n;return}r[S]={[t]:n},_.attributeChanged(function({detail:s}){/*! This maps attributes to observables (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/let[d,u]=s,l=r[S][d];if(l)return l(u)})(r),_.disconnected(function(){/*! This removes all observables mapped to attributes (`S.attribute`).
* Investigate `__dde_attributes` key of the element.*/O.clear(...Object.values(r[S]))})(r)}),new Proxy(n,{apply(o,c,s){if(!s.length)return o();let d=s[0];return w(r,"set",t,d)}})};var Y={isObservable:M,processReactiveAttribute(t,e,n,r){if(!M(n))return n;let o=c=>r(e,c);return B(n,o),tt(n,o,t,e),n()}};function tt(t,e,...n){let{current:r}=b;r.prevent||r.host(function(o){o[W]||(o[W]=[],_.disconnected(()=>o[W].forEach(([[c,s]])=>C(c,s,c[p]?.host()===o)))(o)),o[W].push([[t,e],...n])})}function X(t,e){let n=(...r)=>r.length?pt(n,...r):lt(n);return at(n,t,e)}var ut=Object.assign(Object.create(null),{stopPropagation(){this.skip=!0}}),U=class extends Error{constructor(){super();let[e,...n]=this.stack.split(`
`),r=e.slice(e.indexOf("@"),e.indexOf(".js:")+4);this.stack=n.find(o=>!o.includes(r))}};function at(t,e,n){let r=[];H(n)!=="[object Object]"&&(n={});let{onclear:o}=O.symbols;n[o]&&(r.push(n[o]),Reflect.deleteProperty(n,o));let{host:c}=b;return Reflect.defineProperty(t,p,{value:{value:e,actions:n,onclear:r,host:c,listeners:new Set,defined:new U},enumerable:!1,writable:!1,configurable:!0}),t.toJSON=()=>t(),Object.setPrototypeOf(t[p],ut),t}function dt(){return T[T.length-1]}function lt(t){if(!t[p])return;let{value:e,listeners:n}=t[p],r=dt();return r&&n.add(r),h.has(r)&&h.get(r).add(t),e}function pt(t,e,n){if(!t[p])return;let r=t[p];if(!(!n&&r.value===e))return r.value=e,r.listeners.forEach(o=>o(e)),e}function B(t,e){if(t[p])return t[p].listeners.add(e)}function C(t,e,n){let r=t[p];if(!r)return;let o=r.listeners.delete(e);if(n&&!r.listeners.size){if(t.clear(t),!h.has(r))return o;let c=h.get(r);if(!h.has(c))return o;h.get(c).forEach(s=>C(s,c,!0))}return o}$(Y);export{E as O,j as assign,G as assignAttribute,nt as chainableAppend,rt as classListDeclarative,y as createElement,xt as createElementNS,At as dispatchEvent,y as el,xt as elNS,w as elementAttribute,Ot as empty,M as isObservable,E as observable,_ as on,$ as registerReactivity,b as scope,Et as simulateSlots};
