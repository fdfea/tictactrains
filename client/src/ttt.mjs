/* eslint-disable */

var Module = (function() {
  var _scriptDir = "/ttt.wasm";
  
  return (
function(Module) {
  Module = Module || {};

var Module = typeof Module !== "undefined" ? Module : {};

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise(function(resolve, reject) {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

var moduleOverrides = {};

var key;

for (key in Module) {
 if (Module.hasOwnProperty(key)) {
  moduleOverrides[key] = Module[key];
 }
}

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = function(status, toThrow) {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = false;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

ENVIRONMENT_IS_WEB = typeof window === "object";

ENVIRONMENT_IS_WORKER = typeof importScripts === "function";

ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";

ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary, setWindowTitle;

var nodeFS;

var nodePath;

if (ENVIRONMENT_IS_NODE) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = require("path").dirname(scriptDirectory) + "/";
 } else {
  scriptDirectory = __dirname + "/";
 }
 read_ = function shell_read(filename, binary) {
  if (!nodeFS) nodeFS = require("fs");
  if (!nodePath) nodePath = require("path");
  filename = nodePath["normalize"](filename);
  return nodeFS["readFileSync"](filename, binary ? null : "utf8");
 };
 readBinary = function readBinary(filename) {
  var ret = read_(filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 if (process["argv"].length > 1) {
  thisProgram = process["argv"][1].replace(/\\/g, "/");
 }
 arguments_ = process["argv"].slice(2);
 process["on"]("uncaughtException", function(ex) {
  if (!(ex instanceof ExitStatus)) {
   throw ex;
  }
 });
 process["on"]("unhandledRejection", abort);
 quit_ = function(status) {
  process["exit"](status);
 };
 Module["inspect"] = function() {
  return "[Emscripten Module object]";
 };
} else if (ENVIRONMENT_IS_SHELL) {
 if (typeof read != "undefined") {
  read_ = function shell_read(f) {
   return read(f);
  };
 }
 readBinary = function readBinary(f) {
  var data;
  if (typeof readbuffer === "function") {
   return new Uint8Array(readbuffer(f));
  }
  data = read(f, "binary");
  assert(typeof data === "object");
  return data;
 };
 if (typeof scriptArgs != "undefined") {
  arguments_ = scriptArgs;
 } else if (typeof arguments != "undefined") {
  arguments_ = arguments;
 }
 if (typeof quit === "function") {
  quit_ = function(status) {
   quit(status);
  };
 }
 if (typeof print !== "undefined") {
  if (typeof console === "undefined") console = {};
  console.log = print;
  console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
 }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = window.self.location.href;
 } else if (typeof document !== "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.indexOf("blob:") !== 0) {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
 } else {
  scriptDirectory = "";
 }
 {
  read_ = function shell_read(url) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = function readBinary(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(xhr.response);
   };
  }
  readAsync = function readAsync(url, onload, onerror) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = function xhr_onload() {
    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
 setWindowTitle = function(title) {
  document.title = title;
 };
} else {}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.warn.bind(console);

for (key in moduleOverrides) {
 if (moduleOverrides.hasOwnProperty(key)) {
  Module[key] = moduleOverrides[key];
 }
}

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (Module["quit"]) quit_ = Module["quit"];

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

var noExitRuntime;

if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

if (typeof WebAssembly !== "object") {
 abort("no native wasm support detected");
}

function setValue(ptr, value, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  HEAP8[ptr >> 0] = value;
  break;

 case "i8":
  HEAP8[ptr >> 0] = value;
  break;

 case "i16":
  HEAP16[ptr >> 1] = value;
  break;

 case "i32":
  HEAP32[ptr >> 2] = value;
  break;

 case "i64":
  tempI64 = [ value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
  break;

 case "float":
  HEAPF32[ptr >> 2] = value;
  break;

 case "double":
  HEAPF64[ptr >> 3] = value;
  break;

 default:
  abort("invalid type for setValue: " + type);
 }
}

function getValue(ptr, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  return HEAP8[ptr >> 0];

 case "i8":
  return HEAP8[ptr >> 0];

 case "i16":
  return HEAP16[ptr >> 1];

 case "i32":
  return HEAP32[ptr >> 2];

 case "i64":
  return HEAP32[ptr >> 2];

 case "float":
  return HEAPF32[ptr >> 2];

 case "double":
  return HEAPF64[ptr >> 3];

 default:
  abort("invalid type for getValue: " + type);
 }
 return null;
}

var wasmMemory;

var ABORT = false;

var EXITSTATUS;

function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed: " + text);
 }
}

function alignUp(x, multiple) {
 if (x % multiple > 0) {
  x += multiple - x % multiple;
 }
 return x;
}

var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
 buffer = buf;
 Module["HEAP8"] = HEAP8 = new Int8Array(buf);
 Module["HEAP16"] = HEAP16 = new Int16Array(buf);
 Module["HEAP32"] = HEAP32 = new Int32Array(buf);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}

var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

var wasmTable;

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATMAIN__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 runtimeInitialized = true;
 callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
 callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
}

function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

Module["preloadedImages"] = {};

Module["preloadedAudios"] = {};

function abort(what) {
 if (Module["onAbort"]) {
  Module["onAbort"](what);
 }
 what += "";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
 var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

function hasPrefix(str, prefix) {
 return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
}

var fileURIPrefix = "file://";

function isFileURI(filename) {
 return hasPrefix(filename, fileURIPrefix);
}

const wasmBinaryFile = "/ttt.wasm";

const getBinaryPromise = () => new Promise((resolve, reject) => {
  fetch(wasmBinaryFile, { credentials: 'same-origin' })
    .then(
      response => {
       if (!response['ok']) {
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
       }
       return response['arrayBuffer']();
      }
    )
    .then(resolve)
    .catch(reject);
 });

function createWasm() {
 var info = {
  "a": asmLibraryArg
 };
 function receiveInstance(instance, module) {
  var exports = instance.exports;
  Module["asm"] = exports;
  wasmMemory = Module["asm"]["d"];
  updateGlobalBufferAndViews(wasmMemory.buffer);
  wasmTable = Module["asm"]["e"];
  removeRunDependency("wasm-instantiate");
 }
 addRunDependency("wasm-instantiate");
 function receiveInstantiatedSource(output) {
  receiveInstance(output["instance"]);
 }
 function instantiateArrayBuffer(receiver) {
  return getBinaryPromise().then(function(binary) {
   return WebAssembly.instantiate(binary, info);
  }).then(receiver, function(reason) {
   err("failed to asynchronously prepare wasm: " + reason);
   abort(reason);
  });
 }
 function instantiateAsync() {
  if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
   return fetch(wasmBinaryFile, {
    credentials: "same-origin"
   }).then(function(response) {
    var result = WebAssembly.instantiateStreaming(response, info);
    return result.then(receiveInstantiatedSource, function(reason) {
     err("wasm streaming compile failed: " + reason);
     err("falling back to ArrayBuffer instantiation");
     return instantiateArrayBuffer(receiveInstantiatedSource);
    });
   });
  } else {
   return instantiateArrayBuffer(receiveInstantiatedSource);
  }
 }
 if (Module["instantiateWasm"]) {
  try {
   var exports = Module["instantiateWasm"](info, receiveInstance);
   return exports;
  } catch (e) {
   err("Module.instantiateWasm callback failed with error: " + e);
   return false;
  }
 }
 instantiateAsync().catch(readyPromiseReject);
 return {};
}

var tempDouble;

var tempI64;

function callRuntimeCallbacks(callbacks) {
 while (callbacks.length > 0) {
  var callback = callbacks.shift();
  if (typeof callback == "function") {
   callback(Module);
   continue;
  }
  var func = callback.func;
  if (typeof func === "number") {
   if (callback.arg === undefined) {
    wasmTable.get(func)();
   } else {
    wasmTable.get(func)(callback.arg);
   }
  } else {
   func(callback.arg === undefined ? null : callback.arg);
  }
 }
}

function _emscripten_memcpy_big(dest, src, num) {
 HEAPU8.copyWithin(dest, src, src + num);
}

function _emscripten_get_heap_size() {
 return HEAPU8.length;
}

function emscripten_realloc_buffer(size) {
 try {
  wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
  updateGlobalBufferAndViews(wasmMemory.buffer);
  return 1;
 } catch (e) {}
}

function _emscripten_resize_heap(requestedSize) {
 requestedSize = requestedSize >>> 0;
 var oldSize = _emscripten_get_heap_size();
 var maxHeapSize = 2147483648;
 if (requestedSize > maxHeapSize) {
  return false;
 }
 var minHeapSize = 16777216;
 for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
  var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
  var replacement = emscripten_realloc_buffer(newSize);
  if (replacement) {
   return true;
  }
 }
 return false;
}

function _time(ptr) {
 var ret = Date.now() / 1e3 | 0;
 if (ptr) {
  HEAP32[ptr >> 2] = ret;
 }
 return ret;
}

__ATINIT__.push({
 func: function() {
  ___wasm_call_ctors();
 }
});

var asmLibraryArg = {
 "a": _emscripten_memcpy_big,
 "b": _emscripten_resize_heap,
 "c": _time
};

var asm = createWasm();

var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
 return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["f"]).apply(null, arguments);
};

var _malloc = Module["_malloc"] = function() {
 return (_malloc = Module["_malloc"] = Module["asm"]["g"]).apply(null, arguments);
};

var _free = Module["_free"] = function() {
 return (_free = Module["_free"] = Module["asm"]["h"]).apply(null, arguments);
};

var _ttt_give_move = Module["_ttt_give_move"] = function() {
 return (_ttt_give_move = Module["_ttt_give_move"] = Module["asm"]["i"]).apply(null, arguments);
};

var _ttt_cfg_init = Module["_ttt_cfg_init"] = function() {
 return (_ttt_cfg_init = Module["_ttt_cfg_init"] = Module["asm"]["j"]).apply(null, arguments);
};

var _ttt_init = Module["_ttt_init"] = function() {
 return (_ttt_init = Module["_ttt_init"] = Module["asm"]["k"]).apply(null, arguments);
};

var _ttt_get_player = Module["_ttt_get_player"] = function() {
 return (_ttt_get_player = Module["_ttt_get_player"] = Module["asm"]["l"]).apply(null, arguments);
};

var _ttt_get_ai_move = Module["_ttt_get_ai_move"] = function() {
 return (_ttt_get_ai_move = Module["_ttt_get_ai_move"] = Module["asm"]["m"]).apply(null, arguments);
};

var _ttt_get_moves = Module["_ttt_get_moves"] = function() {
 return (_ttt_get_moves = Module["_ttt_get_moves"] = Module["asm"]["n"]).apply(null, arguments);
};

var _ttt_get_score = Module["_ttt_get_score"] = function() {
 return (_ttt_get_score = Module["_ttt_get_score"] = Module["asm"]["o"]).apply(null, arguments);
};

var _ttt_free = Module["_ttt_free"] = function() {
 return (_ttt_free = Module["_ttt_free"] = Module["asm"]["p"]).apply(null, arguments);
};

var _ttt_is_finished = Module["_ttt_is_finished"] = function() {
 return (_ttt_is_finished = Module["_ttt_is_finished"] = Module["asm"]["q"]).apply(null, arguments);
};

Module["setValue"] = setValue;

Module["getValue"] = getValue;

var calledRun;

function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = "Program terminated with exit(" + status + ")";
 this.status = status;
}

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function run(args) {
 args = args || arguments_;
 if (runDependencies > 0) {
  return;
 }
 preRun();
 if (runDependencies > 0) return;
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  preMain();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
}

Module["run"] = run;

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

noExitRuntime = true;

run();


  return Module.ready
}
);
})();
export default Module;

/*
var Module=function(t){var n,e;(t=void 0!==(t=t||{})?t:{}).ready=new Promise(function(t,r){n=t,e=r});var r,i={};for(r in t)t.hasOwnProperty(r)&&(i[r]=t[r]);var o,a,u,s,c=[];o="object"==typeof window,a="function"==typeof importScripts,u="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,s=!o&&!u&&!a;var f,l,p="";u?(p=a?require("path").dirname(p)+"/":__dirname+"/",function(t,n){return f||(f=require("fs")),l||(l=require("path")),t=l.normalize(t),f.readFileSync(t,n?null:"utf8")},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),c=process.argv.slice(2),process.on("uncaughtException",function(t){if(!(t instanceof function(t){this.name="ExitStatus",this.message="Program terminated with exit("+t+")",this.status=t}))throw t}),process.on("unhandledRejection",j),t.inspect=function(){return"[Emscripten Module object]"}):s?("undefined"!=typeof read&&function(t){return read(t)},"undefined"!=typeof scriptArgs?c=scriptArgs:void 0!==arguments&&(c=arguments),"undefined"!=typeof print&&("undefined"==typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!=typeof printErr?printErr:print)):(o||a)&&(a?p=window.self.location.href:"undefined"!=typeof document&&document.currentScript&&(p=document.currentScript.src),p=0!==(p="/ttt.wasm").indexOf("blob:")?p.substr(0,p.lastIndexOf("/")+1):"",function(t){var n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(null),n.responseText}),t.print||console.log.bind(console);var m,d,_=t.printErr||console.warn.bind(console);for(r in i)i.hasOwnProperty(r)&&(t[r]=i[r]);i=null,t.arguments&&(c=t.arguments),t.thisProgram&&t.thisProgram,t.quit&&t.quit,t.wasmBinary&&(m=t.wasmBinary),t.noExitRuntime&&t.noExitRuntime,"object"!=typeof WebAssembly&&j("no native wasm support detected");var y,h,g,v,b,w,A,R=!1;function E(n){y=n,t.HEAP8=h=new Int8Array(n),t.HEAP16=v=new Int16Array(n),t.HEAP32=b=new Int32Array(n),t.HEAPU8=g=new Uint8Array(n),t.HEAPU16=new Uint16Array(n),t.HEAPU32=new Uint32Array(n),t.HEAPF32=w=new Float32Array(n),t.HEAPF64=A=new Float64Array(n)}t.INITIAL_MEMORY;var I,P=[],M=[],S=[],x=[],W=0,k=null,H=null;function j(n){t.onAbort&&t.onAbort(n),_(n+=""),R=!0,n="abort("+n+"). Build with -s ASSERTIONS=1 for more info.";var r=new WebAssembly.RuntimeError(n);throw e(r),r}t.preloadedImages={},t.preloadedAudios={};var q="file://";function O(t){return n=t,e=q,String.prototype.startsWith?n.startsWith(e):0===n.indexOf(e);var n,e}const T="/ttt.wasm",U=()=>new Promise((t,n)=>{fetch(T,{credentials:"same-origin"}).then(t=>{if(!t.ok)throw"failed to load wasm binary file at '"+T+"'";return t.arrayBuffer()}).then(t).catch(n)});var B,D;function F(n){for(;n.length>0;){var e=n.shift();if("function"!=typeof e){var r=e.func;"number"==typeof r?void 0===e.arg?I.get(r)():I.get(r)(e.arg):r(void 0===e.arg?null:e.arg)}else e(t)}}function V(t){try{return d.grow(t-y.byteLength+65535>>>16),E(d.buffer),1}catch(t){}}M.push({func:function(){N()}});var z,L={a:function(t,n,e){g.copyWithin(t,n,n+e)},b:function(t){t>>>=0;var n=g.length;if(t>2147483648)return!1;for(var e,r,i=1;i<=4;i*=2){var o=n*(1+.2/i);if(o=Math.min(o,t+100663296),V(Math.min(2147483648,((e=Math.max(16777216,t,o))%(r=65536)>0&&(e+=r-e%r),e))))return!0}return!1},c:function(t){var n=Date.now()/1e3|0;return t&&(b[t>>2]=n),n}},N=(function(){var n={a:L};function r(n,e){var r=n.exports;t.asm=r,E((d=t.asm.d).buffer),I=t.asm.e,function(n){if(W--,t.monitorRunDependencies&&t.monitorRunDependencies(W),0==W&&(null!==k&&(clearInterval(k),k=null),H)){var e=H;H=null,e()}}()}function i(t){r(t.instance)}function o(t){return U().then(function(t){return WebAssembly.instantiate(t,n)}).then(t,function(t){_("failed to asynchronously prepare wasm: "+t),j(t)})}if(W++,t.monitorRunDependencies&&t.monitorRunDependencies(W),t.instantiateWasm)try{return t.instantiateWasm(n,r)}catch(t){return _("Module.instantiateWasm callback failed with error: "+t),!1}(m||"function"!=typeof WebAssembly.instantiateStreaming||O(T)||"function"!=typeof fetch?o(i):fetch(T,{credentials:"same-origin"}).then(function(t){return WebAssembly.instantiateStreaming(t,n).then(i,function(t){return _("wasm streaming compile failed: "+t),_("falling back to ArrayBuffer instantiation"),o(i)})})).catch(e)}(),t.___wasm_call_ctors=function(){return(N=t.___wasm_call_ctors=t.asm.f).apply(null,arguments)});function G(e){function r(){z||(z=!0,t.calledRun=!0,R||(F(M),F(S),n(t),t.onRuntimeInitialized&&t.onRuntimeInitialized(),function(){if(t.postRun)for("function"==typeof t.postRun&&(t.postRun=[t.postRun]);t.postRun.length;)n=t.postRun.shift(),x.unshift(n);var n;F(x)}()))}e=e||c,W>0||(function(){if(t.preRun)for("function"==typeof t.preRun&&(t.preRun=[t.preRun]);t.preRun.length;)n=t.preRun.shift(),P.unshift(n);var n;F(P)}(),W>0||(t.setStatus?(t.setStatus("Running..."),setTimeout(function(){setTimeout(function(){t.setStatus("")},1),r()},1)):r()))}if(t._malloc=function(){return(t._malloc=t.asm.g).apply(null,arguments)},t._free=function(){return(t._free=t.asm.h).apply(null,arguments)},t._ttt_give_move=function(){return(t._ttt_give_move=t.asm.i).apply(null,arguments)},t._ttt_cfg_init=function(){return(t._ttt_cfg_init=t.asm.j).apply(null,arguments)},t._ttt_init=function(){return(t._ttt_init=t.asm.k).apply(null,arguments)},t._ttt_get_player=function(){return(t._ttt_get_player=t.asm.l).apply(null,arguments)},t._ttt_get_ai_move=function(){return(t._ttt_get_ai_move=t.asm.m).apply(null,arguments)},t._ttt_get_moves=function(){return(t._ttt_get_moves=t.asm.n).apply(null,arguments)},t._ttt_get_score=function(){return(t._ttt_get_score=t.asm.o).apply(null,arguments)},t._ttt_free=function(){return(t._ttt_free=t.asm.p).apply(null,arguments)},t._ttt_is_finished=function(){return(t._ttt_is_finished=t.asm.q).apply(null,arguments)},t.setValue=function(t,n,e,r){switch("*"===(e=e||"i8").charAt(e.length-1)&&(e="i32"),e){case"i1":case"i8":h[t>>0]=n;break;case"i16":v[t>>1]=n;break;case"i32":b[t>>2]=n;break;case"i64":D=[n>>>0,(B=n,+Math.abs(B)>=1?B>0?(0|Math.min(+Math.floor(B/4294967296),4294967295))>>>0:~~+Math.ceil((B-+(~~B>>>0))/4294967296)>>>0:0)],b[t>>2]=D[0],b[t+4>>2]=D[1];break;case"float":w[t>>2]=n;break;case"double":A[t>>3]=n;break;default:j("invalid type for setValue: "+e)}},t.getValue=function(t,n,e){switch("*"===(n=n||"i8").charAt(n.length-1)&&(n="i32"),n){case"i1":case"i8":return h[t>>0];case"i16":return v[t>>1];case"i32":case"i64":return b[t>>2];case"float":return w[t>>2];case"double":return A[t>>3];default:j("invalid type for getValue: "+n)}return null},H=function t(){z||G(),z||(H=t)},t.run=G,t.preInit)for("function"==typeof t.preInit&&(t.preInit=[t.preInit]);t.preInit.length>0;)t.preInit.pop()();return G(),t.ready};export default Module;
*/