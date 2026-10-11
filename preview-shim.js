/* Rich Alucard PREVIEW build only. Every localStorage/sessionStorage key this page touches is stored under
   "ra_preview::" so the preview can never read or overwrite the live game's saves on the same host. */
(function(){
 'use strict';
 var P='ra_preview::';
 function wrap(name){
  var real;try{real=window[name];}catch(e){return;}
  if(!real||real.__raPreview)return;
  var own=function(){var out=[];for(var i=0;i<real.length;i++){var k=real.key(i);if(k!==null&&k.indexOf(P)===0)out.push(k.slice(P.length));}return out;};
  var api={
   getItem:function(k){return real.getItem(P+k);},
   setItem:function(k,v){real.setItem(P+k,String(v));},
   removeItem:function(k){real.removeItem(P+k);},
   clear:function(){own().forEach(function(k){real.removeItem(P+k);});},
   key:function(i){var keys=own();return i>=0&&i<keys.length?keys[i]:null;},
   __raPreview:true
  };
  var store=new Proxy(api,{
   get:function(t,k){if(k==='length')return own().length;if(k in t||typeof k!=='string')return t[k];var v=t.getItem(k);return v===null?undefined:v;},
   set:function(t,k,v){if(typeof k==='string'&&!(k in t))t.setItem(k,v);return true;},
   deleteProperty:function(t,k){if(typeof k==='string'&&!(k in t))t.removeItem(k);return true;},
   has:function(t,k){return k in t||(typeof k==='string'&&t.getItem(k)!==null);},
   ownKeys:function(){return own();},
   getOwnPropertyDescriptor:function(t,k){if(typeof k==='string'&&!(k in t)){var v=t.getItem(k);if(v!==null)return {value:v,writable:true,enumerable:true,configurable:true};}return undefined;}
  });
  try{Object.defineProperty(window,name,{configurable:true,enumerable:true,get:function(){return store;}});}catch(e){}
 }
 wrap('localStorage');wrap('sessionStorage');
 window.RAPreview={namespace:P};
})();
