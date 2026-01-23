// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"lulYw":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 58698;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "9aee060c5806d454";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"l8Qcj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initSciencePage", ()=>initSciencePage);
parcelHelpers.export(exports, "cleanupSciencePage", ()=>cleanupSciencePage);
var _gsap = require("gsap");
var _scrollTrigger = require("gsap/ScrollTrigger");
var _splitText = require("gsap/SplitText");
var _horizontalLoop = require("./horizontalLoop");
var _horizontalLoopDefault = parcelHelpers.interopDefault(_horizontalLoop);
(0, _gsap.gsap).registerPlugin((0, _scrollTrigger.ScrollTrigger), (0, _splitText.SplitText));
let _vennSVG = null;
let _vennTL = null;
let _vennClonedVideo = null;
let _vennCanvas = null;
let _vennCanvasRAF = null;
function initSciencePage() {
    try {
        createVennCircles();
    } catch (e) {
        console.error('Failed to init venn circles:', e);
    }
    // Initialize project tickers on the science page using the same behavior
    // as the homepage. Targets use the same class `.home-project-scroll-txt-shell`.
    try {
        const scienceTickerCleanups = [];
        document.querySelectorAll('.home-project-scroll-txt-shell, .science-scroll-txt-shell').forEach((shell, index)=>{
            // Try common selectors first (homepage naming and the science page naming)
            let txts = shell.querySelectorAll('.home-project-txt, .science-project-txt, [data-ticker-item]');
            // Fallback: if no explicit items found, use direct children that look like ticker items
            if (!txts || txts.length === 0) {
                const children = Array.from(shell.children || []);
                // Filter out elements that are clearly not visual/text items (e.g., script, svg, empty)
                const candidates = children.filter((el)=>{
                    try {
                        const tag = (el.tagName || '').toLowerCase();
                        if (tag === 'script' || tag === 'svg' || tag === 'canvas') return false;
                        const txt = (el.textContent || '').trim();
                        return txt.length > 0 || el.querySelector && el.querySelector('img,svg');
                    } catch (e) {
                        return false;
                    }
                });
                if (candidates.length) txts = candidates;
            }
            if (!txts || txts.length === 0) {
                // No ticker items found — log for debugging and skip
                try {
                    console.debug('[formula] no ticker items found in shell:', shell);
                } catch (e) {}
                return;
            }
            const initialDirection = index % 2 === 0 ? 1 : -1;
            const cleanup = introTicker(txts, shell, initialDirection);
            if (typeof cleanup === 'function') scienceTickerCleanups.push(cleanup);
        });
        // expose cleanup so cleanupSciencePage can remove effects when navigating away
        window._scienceTickerCleanup = ()=>{
            try {
                scienceTickerCleanups.forEach((fn)=>{
                    try {
                        fn();
                    } catch (e) {}
                });
            } catch (e) {}
        };
    } catch (e) {}
}
window.initPageTransitions = function() {
// Your page-specific GSAP intro animation here
};
function cleanupSciencePage() {
    // Remove SVG and kill timeline/scrolltrigger
    try {
        if (_vennTL) {
            try {
                _vennTL.scrollTrigger && _vennTL.scrollTrigger.kill();
            } catch (e) {}
            try {
                _vennTL.kill();
            } catch (e) {}
            _vennTL = null;
        }
        if (_vennSVG && _vennSVG.parentNode) {
            _vennSVG.parentNode.removeChild(_vennSVG);
            _vennSVG = null;
        }
        if (_vennClonedVideo && _vennClonedVideo.parentNode) {
            try {
                _vennClonedVideo.parentNode.removeChild(_vennClonedVideo);
            } catch (e) {}
            _vennClonedVideo = null;
        }
        if (_vennCanvas) {
            try {
                cancelAnimationFrame(_vennCanvasRAF);
            } catch (e) {}
            try {
                _vennCanvas.parentNode && _vennCanvas.parentNode.removeChild(_vennCanvas);
            } catch (e) {}
            _vennCanvas = null;
            _vennCanvasRAF = null;
        }
    } catch (e) {
        console.warn('cleanupSciencePage failed', e);
    }
    // Cleanup any project tickers initialized for the science page
    try {
        if (typeof window._scienceTickerCleanup === 'function') {
            try {
                window._scienceTickerCleanup();
            } catch (e) {}
            window._scienceTickerCleanup = null;
        }
    } catch (e) {}
}
// Ticker function copied/adapted from home.js so science page tickers behave the same
function introTicker(txtNodes, shell, initialDirection = 1) {
    const baseSpeed = 1.2;
    const maxSpeed = 8;
    const velocityMult = 0.005;
    const heroLoop = (0, _horizontalLoopDefault.default)(txtNodes, {
        repeat: -1,
        speed: baseSpeed,
        reversed: initialDirection < 0
    });
    const absBaseSpeed = Math.abs(baseSpeed);
    heroLoop.timeScale(absBaseSpeed);
    let scrollTimeout;
    let currentDirection = initialDirection;
    const pauseLoop = ()=>{
        (0, _gsap.gsap).killTweensOf(heroLoop);
        heroLoop.pause();
    };
    const resumeLoop = ()=>{
        heroLoop.resume();
        heroLoop.timeScale(absBaseSpeed);
    };
    const st = (0, _scrollTrigger.ScrollTrigger).create({
        trigger: shell,
        start: "top+=20% bottom",
        end: "bottom-=20% top",
        onUpdate: ({ isActive, getVelocity })=>{
            if (!isActive) {
                pauseLoop();
                return;
            }
            (0, _gsap.gsap).killTweensOf(heroLoop);
            const scrollVelocity = getVelocity();
            if (Math.abs(scrollVelocity) > 0.5) {
                const scrollDirection = Math.sign(scrollVelocity);
                const effectiveDirection = initialDirection < 0 ? -scrollDirection : scrollDirection;
                currentDirection = effectiveDirection;
                const boostAmount = Math.min(Math.abs(scrollVelocity * velocityMult), maxSpeed);
                const effectiveSpeed = absBaseSpeed + Math.abs(effectiveDirection) * boostAmount;
                heroLoop.timeScale(effectiveSpeed * Math.sign(effectiveDirection));
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(()=>{
                (0, _gsap.gsap).to(heroLoop, {
                    timeScale: absBaseSpeed * Math.sign(currentDirection),
                    duration: 0.5,
                    ease: "power1.out",
                    overwrite: true
                });
            }, 150);
        },
        onLeave: pauseLoop,
        onEnter: resumeLoop,
        onLeaveBack: pauseLoop,
        onEnterBack: resumeLoop
    });
    return ()=>{
        clearTimeout(scrollTimeout);
        try {
            st && st.kill && st.kill();
        } catch (e) {}
        (0, _gsap.gsap).killTweensOf(heroLoop);
        try {
            heroLoop.kill && heroLoop.kill();
        } catch (e) {}
    };
}
function createVennCircles() {
    const shell = document.querySelector('.venn-shell');
    if (!shell) {
        console.warn(".venn-shell not found \u2014 skipping venn init");
        return;
    }
    // Get shell bounds to size SVG
    const bounds = shell.getBoundingClientRect();
    const width = Math.max(300, Math.round(bounds.width));
    const height = Math.max(200, Math.round(bounds.height));
    // Create SVG overlay positioned absolutely inside the shell
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    // ensure svg overlays above any canvas/video we insert
    svg.style.zIndex = '2';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    // Two circles: left and right
    const left = document.createElementNS(svgNS, 'circle');
    const right = document.createElementNS(svgNS, 'circle');
    // Starting positions (percent-based inside viewBox) - push them further to the edges
    const cxLeft = Math.round(width * 0.12);
    const cxRight = Math.round(width * 0.88);
    const cy = Math.round(height * 0.5);
    // Compute base and target radius (make circles 15% smaller than base)
    const baseR = Math.round(Math.min(width, height) * 0.38);
    const targetR = Math.round(baseR * 0.85);
    // Initial radius (debug = set to target so circles are visible immediately)
    left.setAttribute('cx', cxLeft);
    left.setAttribute('cy', cy);
    left.setAttribute('r', targetR);
    // pick colors based on shell/background luminance so debug visuals are visible
    const bgColor = window.getComputedStyle(shell).backgroundColor || window.getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';
    const pickColors = (bg)=>{
        // parse `rgb(a)?(...)`
        try {
            const nums = bg.replace(/[^0-9.,]/g, '').split(',').map((n)=>parseFloat(n));
            const r = nums[0] || 255, g = nums[1] || 255, b = nums[2] || 255;
            // relative luminance approximation
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            const darkBg = lum < 0.5;
            // Use white outlines and a dotted stroke for both light and dark backgrounds.
            // Small dots are achieved with a short dash length and spacing, plus round line caps.
            if (darkBg) return {
                fill: 'rgba(255,255,255,0.06)',
                stroke: '#ffffff',
                lensFill: 'rgba(255,255,255,0.08)',
                strokeDash: '1 7',
                strokeW: 2
            };
            return {
                fill: 'rgba(0,100,255,0.12)',
                stroke: '#ffffff',
                lensFill: 'rgba(255,0,0,0.12)',
                strokeDash: '1 7',
                strokeW: 2
            };
        } catch (e) {
            return {
                fill: 'rgba(0,100,255,0.12)',
                stroke: '#0366d6',
                lensFill: 'rgba(255,0,0,0.12)',
                strokeDash: '6 6',
                strokeW: 2
            };
        }
    };
    const colors = pickColors(bgColor);
    // Do not fill the circles so they don't block the video — keep stroke for visual guide
    left.setAttribute('fill', 'none');
    left.setAttribute('stroke', colors.stroke);
    left.setAttribute('stroke-dasharray', colors.strokeDash);
    left.setAttribute('stroke-width', colors.strokeW);
    // round caps make short dash lengths look like dots
    left.setAttribute('stroke-linecap', 'round');
    // make the outline 50% opaque
    left.setAttribute('stroke-opacity', '0.8');
    right.setAttribute('cx', cxRight);
    right.setAttribute('cy', cy);
    right.setAttribute('r', targetR);
    right.setAttribute('fill', 'none');
    right.setAttribute('stroke', colors.stroke);
    right.setAttribute('stroke-dasharray', colors.strokeDash);
    right.setAttribute('stroke-width', colors.strokeW);
    // round caps make short dash lengths look like dots
    right.setAttribute('stroke-linecap', 'round');
    // make the outline 50% opaque
    right.setAttribute('stroke-opacity', '0.8');
    svg.appendChild(left);
    svg.appendChild(right);
    // Create defs & clipPath for the lens intersection and a path to hold it
    const defs = document.createElementNS(svgNS, 'defs');
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', 'venn-clip');
    clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const lensPath = document.createElementNS(svgNS, 'path');
    lensPath.setAttribute('d', '');
    // visible for debug; set to '#000' or 'none' for production
    lensPath.setAttribute('fill', colors.lensFill || 'rgba(255,0,0,0.12)');
    clipPath.appendChild(lensPath);
    defs.appendChild(clipPath);
    // Also create an SVG mask as a fallback — masks sometimes render where clipPath does not
    const maskEl = document.createElementNS(svgNS, 'mask');
    maskEl.setAttribute('id', 'venn-mask');
    maskEl.setAttribute('maskUnits', 'userSpaceOnUse');
    // a black rect background (masked-out area)
    const maskBg = document.createElementNS(svgNS, 'rect');
    maskBg.setAttribute('x', '0');
    maskBg.setAttribute('y', '0');
    maskBg.setAttribute('width', String(width));
    maskBg.setAttribute('height', String(height));
    maskBg.setAttribute('fill', '#000');
    const maskPath = document.createElementNS(svgNS, 'path');
    maskPath.setAttribute('d', '');
    // white path shows through the mask
    maskPath.setAttribute('fill', '#fff');
    maskEl.appendChild(maskBg);
    maskEl.appendChild(maskPath);
    defs.appendChild(maskEl);
    svg.appendChild(defs);
    // Ensure the shell is positioned so the absolute SVG overlays correctly
    const prevPosition = window.getComputedStyle(shell).position;
    if (prevPosition === 'static' || !prevPosition) try {
        shell.style.position = 'relative';
    } catch (e) {}
    // Append svg to shell
    shell.appendChild(svg);
    _vennSVG = svg;
    // Locate user-provided label shells (prefer existing DOM nodes created in Webflow)
    let leftLabel = null;
    let rightLabel = null;
    try {
        leftLabel = shell.querySelector('.venn-txt-shell-left');
        rightLabel = shell.querySelector('.venn-txt-shell-right');
        [
            leftLabel,
            rightLabel
        ].forEach((el)=>{
            if (!el) return;
            try {
                // ensure centering transform so (left,top) map the element's center to the coord
                el.style.position = el.style.position || 'absolute';
                el.style.transform = el.style.transform || 'translate(-50%,-50%)';
                el.style.pointerEvents = 'none';
                el.style.zIndex = el.style.zIndex || '3';
            } catch (e) {}
        });
    } catch (e) {}
    // Clone a page video into the shell (if present) to ensure we can apply clip/mask
    try {
        const pageVideo = document.querySelector('video');
        if (pageVideo && !pageVideo.closest('.venn-shell')) {
            const clone = pageVideo.cloneNode(true);
            // Ensure autoplay will be permitted (muted) and attributes are explicit
            try {
                clone.muted = true;
            } catch (e) {}
            try {
                clone.setAttribute('muted', '');
            } catch (e) {}
            try {
                clone.autoplay = true;
            } catch (e) {}
            try {
                clone.setAttribute('autoplay', '');
            } catch (e) {}
            try {
                clone.loop = true;
            } catch (e) {}
            try {
                clone.setAttribute('loop', '');
            } catch (e) {}
            try {
                clone.playsInline = true;
            } catch (e) {}
            try {
                clone.setAttribute('playsinline', '');
            } catch (e) {}
            try {
                clone.setAttribute('preload', 'auto');
            } catch (e) {}
            clone.style.position = 'absolute';
            clone.style.left = '0';
            clone.style.top = '0';
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.objectFit = 'cover';
            clone.style.zIndex = '1';
            clone.style.pointerEvents = 'none';
            clone.style.opacity = '1';
            try {
                shell.insertBefore(clone, svg);
            } catch (e) {
                shell.appendChild(clone);
            }
            // Try to start playback; some browsers require play() call even if autoplay attribute present
            try {
                const p = clone.play();
                if (p && p.catch) p.catch(()=>{});
            } catch (e) {}
            _vennClonedVideo = clone;
            // Try to start the original page video as well (may be the source)
            try {
                const p = pageVideo.play();
                if (p && p.catch) p.catch(()=>{
                    // try muting and playing again
                    try {
                        pageVideo.muted = true;
                        pageVideo.setAttribute('muted', '');
                    } catch (e) {}
                    try {
                        pageVideo.play().catch(()=>{});
                    } catch (e) {}
                });
            } catch (e) {}
            // ensure the clone plays
            try {
                const p2 = clone.play();
                if (p2 && p2.catch) p2.catch(()=>{});
            } catch (e) {}
            // if autoplay is blocked, resume on first user interaction
            const ensurePlay = (v)=>{
                try {
                    v.play().catch(()=>{});
                } catch (e) {}
            };
            const resumeOnGesture = ()=>{
                try {
                    ensurePlay(pageVideo);
                    ensurePlay(clone);
                } catch (e) {}
            };
            document.addEventListener('click', resumeOnGesture, {
                once: true
            });
        }
    } catch (e) {}
    // Canvas fallback: draw frames from an existing video (inside shell) into a canvas
    try {
        const pageVid = shell.querySelector('video');
        if (pageVid) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '1';
            canvas.style.pointerEvents = 'none';
            try {
                shell.insertBefore(canvas, svg);
            } catch (e) {
                shell.appendChild(canvas);
            }
            _vennCanvas = canvas;
            const ctx = canvas.getContext('2d');
            // Ensure the shell video is playing; try to play and fallback to muting if blocked
            try {
                const playPromise = pageVid.play();
                if (playPromise && playPromise.catch) playPromise.catch(()=>{
                    try {
                        pageVid.muted = true;
                        pageVid.setAttribute('muted', '');
                    } catch (e) {}
                    try {
                        pageVid.play().catch(()=>{});
                    } catch (e) {}
                });
            } catch (e) {}
            document.addEventListener('click', ()=>{
                try {
                    pageVid.play().catch(()=>{});
                } catch (e) {}
            }, {
                once: true
            });
            // draw loop: compute a minimal scale so the drawn video fully covers the lens
            const draw = ()=>{
                try {
                    if (pageVid && pageVid.readyState >= 2) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        const vw = pageVid.videoWidth || pageVid.clientWidth || canvas.width;
                        const vh = pageVid.videoHeight || pageVid.clientHeight || canvas.height;
                        // compute minimal scale from lens polygon bbox so we don't reveal edges
                        let autoScale = 0.75; // fallback default
                        try {
                            const poly = lensPolygonPoints(params.lx, params.cy, params.lr, params.rx, params.cy, params.rr, 28);
                            if (poly && poly.length) {
                                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                                for (let p of poly){
                                    if (p.x < minX) minX = p.x;
                                    if (p.y < minY) minY = p.y;
                                    if (p.x > maxX) maxX = p.x;
                                    if (p.y > maxY) maxY = p.y;
                                }
                                const bboxW = Math.max(1, maxX - minX);
                                const bboxH = Math.max(1, maxY - minY);
                                const minScaleW = bboxW / canvas.width;
                                const minScaleH = bboxH / canvas.height;
                                const minScale = Math.max(minScaleW, minScaleH);
                                // add a small safety margin to avoid crisp-edge reveals
                                autoScale = Math.min(1, minScale * 1.03);
                                // ensure not tiny
                                autoScale = Math.max(autoScale, 0.2);
                            }
                        } catch (e) {
                            autoScale = 0.75;
                        }
                        const destW = Math.round(canvas.width * autoScale);
                        const destH = Math.round(canvas.height * autoScale);
                        const dx = Math.round((canvas.width - destW) / 2);
                        const dy = Math.round((canvas.height - destH) / 2);
                        try {
                            ctx.drawImage(pageVid, 0, 0, vw, vh, dx, dy, destW, destH);
                        } catch (e) {
                            // fallback to simple draw if dimension mapping fails
                            try {
                                ctx.drawImage(pageVid, dx, dy, destW, destH);
                            } catch (e) {}
                        }
                    }
                } catch (e) {}
                _vennCanvasRAF = requestAnimationFrame(draw);
            };
            _vennCanvasRAF = requestAnimationFrame(draw);
        }
    } catch (e) {}
    // Visible debug overlay (helps when console is muted globally)
    const DEBUG_OVLY = false; // set true to enable
    let debugEl = null;
    if (DEBUG_OVLY) {
        debugEl = document.createElement('div');
        debugEl.style.position = 'absolute';
        debugEl.style.right = '12px';
        // move below the site's nav/header so text isn't obscured
        debugEl.style.top = '80px';
        debugEl.style.padding = '6px 8px';
        debugEl.style.background = 'rgba(0,0,0,0.65)';
        debugEl.style.color = '#fff';
        debugEl.style.fontFamily = 'monospace';
        debugEl.style.fontSize = '11px';
        debugEl.style.zIndex = 9999;
        debugEl.style.pointerEvents = 'none';
        debugEl.style.whiteSpace = 'pre-wrap';
        debugEl.style.maxWidth = 'calc(100% - 160px)';
        debugEl.style.overflow = 'hidden';
        debugEl.textContent = 'venn: initializing...';
        // append to shell (not svg) so HTML can render
        try {
            shell.appendChild(debugEl);
        } catch (e) {}
    }
    // Target radius is computed above (baseR/targetR) and used for params
    // Build a timeline controlled by scroll
    // Since the shell is full-viewport (100vh), when its top reaches the top of the
    // viewport it is fully visible. Pin it there and run the animation while pinned.
    const tl = (0, _gsap.gsap).timeline({
        scrollTrigger: {
            trigger: shell,
            start: 'top top',
            end: '+=100%',
            pin: true,
            // Scrub the timeline so the animation progress follows the user's scroll
            scrub: 0.6,
            markers: false
        }
    });
    // Param object we will animate (and use to update circles + lens)
    // We'll keep radii constant and animate only horizontal positions so circles slide toward each other
    const params = {
        lx: cxLeft,
        rx: cxRight,
        cy: cy,
        lr: targetR,
        rr: targetR
    };
    // distance in pixels between the visible stroke and the video mask
    const maskCushion = 2;
    const updateShapes = ()=>{
        try {
            left.setAttribute('cx', Math.round(params.lx));
            left.setAttribute('cy', Math.round(params.cy));
            left.setAttribute('r', Math.round(params.lr));
            right.setAttribute('cx', Math.round(params.rx));
            right.setAttribute('cy', Math.round(params.cy));
            right.setAttribute('r', Math.round(params.rr));
            // Position HTML labels (if present) to the circle centers. We map viewBox
            // coordinates -> percent so absolutely-positioned divs inside `shell` align.
            try {
                if (leftLabel) {
                    leftLabel.style.left = `${(params.lx / width * 100).toFixed(4)}%`;
                    leftLabel.style.top = `${(params.cy / height * 100).toFixed(4)}%`;
                }
                if (rightLabel) {
                    rightLabel.style.left = `${(params.rx / width * 100).toFixed(4)}%`;
                    rightLabel.style.top = `${(params.cy / height * 100).toFixed(4)}%`;
                }
            } catch (e) {}
            // compute lens path and set it on lensPath
            // shrink the radii by half the stroke width plus a small cushion so the dotted
            // stroke does not overlap the revealed video area.
            const insetLr = Math.max(0, params.lr - (colors && colors.strokeW ? colors.strokeW : 2) / 2 - maskCushion);
            const insetRr = Math.max(0, params.rr - (colors && colors.strokeW ? colors.strokeW : 2) / 2 - maskCushion);
            const d = lensPathForCircles(params.lx, params.cy, insetLr, params.rx, params.cy, insetRr);
            lensPath.setAttribute('d', d || '');
            // apply clipPath to the .venn-video-shell parent (more robust with background-cover videos)
            const videoShellEl = document.querySelector('.venn-video-shell');
            const videoEl = videoShellEl ? videoShellEl.querySelector('video') : null;
            // find the deepest visible element that likely contains the visual (video or background-image)
            const findVisualTarget = (root)=>{
                if (!root) return null;
                // prefer an actual video element
                const vid = root.querySelector('video');
                if (vid) return vid;
                // if the root itself has a background image, use it
                try {
                    const csRoot = getComputedStyle(root);
                    if (csRoot && csRoot.backgroundImage && csRoot.backgroundImage !== 'none') return root;
                } catch (e) {}
                // otherwise search children for a background image
                const walker = root.querySelectorAll('*');
                for(let i = 0; i < walker.length; i++)try {
                    const el = walker[i];
                    const cs = getComputedStyle(el);
                    if (cs && cs.backgroundImage && cs.backgroundImage !== 'none') return el;
                } catch (e) {}
                return root;
            };
            // Prefer the canvas as the visual target if it exists (we draw frames there)
            const visualTarget = _vennCanvas || findVisualTarget(videoShellEl) || videoShellEl;
            // prefer a full-URL reference which is more reliable across browsers
            const frag = '#venn-clip';
            const localRef = `url(${frag})`;
            const fullRef = (()=>{
                try {
                    return `url(${location.href.replace(/#.*$/, '')}${frag})`;
                } catch (e) {
                    return localRef;
                }
            })();
            const applyRef = (el)=>{
                try {
                    el.style.clipPath = fullRef;
                    el.style.webkitClipPath = fullRef;
                    // also try the local ref as a fallback
                    // some browsers accept one or the other
                    // (setting both is fine)
                    el.style.clipPath = el.style.clipPath || localRef;
                    el.style.webkitClipPath = el.style.webkitClipPath || localRef;
                    el.style.overflow = 'hidden';
                } catch (e) {}
            };
            // Apply clip/mask to the visual target (video element or background element)
            if (visualTarget) applyRef(visualTarget);
            // Update the mask path so we can apply an SVG mask as a fallback
            try {
                const dStr = lensPath.getAttribute('d') || '';
                // set mask path
                try {
                    maskPath.setAttribute('d', dStr || '');
                } catch (e) {}
                if (dStr) {
                    // also try CSS path() fallback for clipPath
                    const cssPath = `path('${dStr.replace(/'/g, "\\'")}')`;
                    if (videoShellEl) try {
                        videoShellEl.style.clipPath = cssPath;
                        videoShellEl.style.webkitClipPath = cssPath;
                    } catch (e) {}
                    if (videoEl) try {
                        videoEl.style.clipPath = cssPath;
                        videoEl.style.webkitClipPath = cssPath;
                    } catch (e) {}
                }
            } catch (e) {}
            // As an additional, highly-compatible fallback: approximate the lens with a polygon
            // and apply via CSS `clip-path: polygon(...)` which you noted worked from Webflow.
            try {
                // use the inset radii so the polygon mask sits inside the stroke by maskCushion
                const polyLr = Math.max(0, params.lr - (colors && colors.strokeW ? colors.strokeW : 2) / 2 - maskCushion);
                const polyRr = Math.max(0, params.rr - (colors && colors.strokeW ? colors.strokeW : 2) / 2 - maskCushion);
                const polygonPoints = lensPolygonPoints(params.lx, params.cy, polyLr, params.rx, params.cy, polyRr, 24);
                if (polygonPoints && polygonPoints.length) {
                    // convert to percent coordinates relative to the svg/viewBox width/height
                    const polyStr = polygonPoints.map((p)=>`${(p.x / width * 100).toFixed(3)}% ${(p.y / height * 100).toFixed(3)}%`).join(', ');
                    try {
                        visualTarget.style.clipPath = `polygon(${polyStr})`;
                        visualTarget.style.webkitClipPath = `polygon(${polyStr})`;
                    } catch (e) {}
                }
            } catch (e) {}
            // Apply the SVG mask (url) as a final fallback — some browsers support masks better
            try {
                const maskFrag = '#venn-mask';
                const fullMaskRef = `url(${location.href.replace(/#.*$/, '')}${maskFrag})`;
                if (videoShellEl) try {
                    videoShellEl.style.mask = fullMaskRef;
                    videoShellEl.style.webkitMask = fullMaskRef;
                } catch (e) {}
                if (videoEl) try {
                    videoEl.style.mask = fullMaskRef;
                    videoEl.style.webkitMask = fullMaskRef;
                } catch (e) {}
            } catch (e) {}
            // Update visible debug overlay (useful if console logs are muted)
            try {
                if (debugEl) {
                    const dStr = lensPath.getAttribute('d') || '';
                    const shellClip = videoShellEl ? getComputedStyle(videoShellEl).clipPath || getComputedStyle(videoShellEl).webkitClipPath || 'none' : 'n/a';
                    const vidClip = videoEl ? getComputedStyle(videoEl).clipPath || getComputedStyle(videoEl).webkitClipPath || 'none' : 'n/a';
                    const newText = `lens:${dStr ? 'yes' : 'no'} len:${dStr.length}\nclipShell:${shellClip}\nclipVideo:${vidClip}\nfullRef:${fullRef}\nvideoEl:${!!videoEl}\nclone:${!!_vennClonedVideo}`;
                    if (newText !== lastDebugText) {
                        debugEl.textContent = newText;
                        lastDebugText = newText;
                    }
                }
            } catch (e) {}
        } catch (e) {}
    };
    // Animate params so circles slide horizontally toward each other while the
    // container is pinned. We want a 22% overlap of the circles' diameter.
    // For equal radii r, overlap_distance = 0.22 * (2r) = 0.44r
    // center_distance = 2r - overlap_distance = 1.56r
    const finalCenterDistance = 1.56 * targetR;
    const centerX = width / 2;
    const finalLx = Math.round(centerX - finalCenterDistance / 2);
    const finalRx = Math.round(centerX + finalCenterDistance / 2);
    tl.to(params, {
        lx: finalLx,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: updateShapes
    }, 0);
    tl.to(params, {
        rx: finalRx,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: updateShapes
    }, 0);
    // If the page includes an element that should appear on top of the video
    // inside the lens (class `.venn-vid-txt`), animate its blur from 20px -> 0
    // starting when the circles first begin to overlap. We compute the relative
    // fraction of the params animation where overlap starts and insert a scrubbed
    // tween into the same timeline so it follows the scroll scrub.
    try {
        const vidTxt = shell.querySelector('.venn-vid-txt');
        if (vidTxt) {
            // use GSAP to set initial state (clean and performant)
            try {
                (0, _gsap.gsap).set(vidTxt, {
                    filter: 'blur(20px)',
                    opacity: 0,
                    willChange: 'filter,opacity'
                });
            } catch (e) {}
            // compute fraction where the circles begin to overlap (center distance < sum of radii)
            const initialDist = cxRight - cxLeft;
            const finalDist = finalRx - finalLx;
            const rSum = params.lr + params.rr;
            if (Math.abs(finalDist - initialDist) > 0.0001) {
                let frac = (rSum - initialDist) / (finalDist - initialDist);
                frac = Math.max(0, Math.min(1, frac));
                const tlDur = tl.duration() || 1.2;
                // start slightly earlier so the reveal begins before overlap; tweakable
                const earlyFraction = 0.45; // start 70% of timeline earlier
                let startTime = frac * tlDur - earlyFraction * tlDur;
                startTime = Math.max(0, startTime);
                const remaining = Math.max(0.001, tlDur - startTime);
                try {
                    // use fromTo so both filter and opacity are driven together and rendered by GSAP
                    tl.fromTo(vidTxt, {
                        filter: 'blur(20px)',
                        opacity: 0
                    }, {
                        filter: 'blur(0px)',
                        opacity: 1,
                        duration: remaining,
                        ease: 'none'
                    }, startTime);
                } catch (e) {}
            }
        }
    } catch (e) {}
    // Animate the venn-sub-txt elements (left and right side text)
    // using SplitText to fade/blur in from bottom after circles finish joining
    try {
        const subTextElements = shell.querySelectorAll('.venn-sub-txt');
        if (subTextElements.length > 0) {
            const tlDur = tl.duration() || 1.2;
            // Start the text animation after circles are fully overlapped (100% through)
            const textStartTime = tlDur * 1.0; // Start at 100% through the animation
            const textDuration = tlDur * 0.4; // Use 40% of timeline for text animation
            subTextElements.forEach((textEl)=>{
                // Split the text into words
                const split = new (0, _splitText.SplitText)(textEl, {
                    type: 'words'
                });
                // Set initial state: invisible, blurred, and shifted down
                (0, _gsap.gsap).set(split.words, {
                    opacity: 0,
                    filter: 'blur(10px)',
                    y: 15
                });
                // Animate words in from bottom with blur fade
                tl.to(split.words, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    duration: textDuration,
                    stagger: 0.09,
                    ease: 'power2.out'
                }, textStartTime);
            });
            // Extend the pin duration to give users time to read
            if (tl.scrollTrigger) {
                tl.scrollTrigger.vars.end = '+=200%'; // Increased from 100% to 200%
                tl.scrollTrigger.refresh();
            }
        }
    } catch (e) {
        console.error('Error setting up venn-sub-txt animation:', e);
    }
    // initialize
    updateShapes();
    _vennTL = tl;
}
// Compute SVG path string for the lens (intersection) of two circles
function lensPathForCircles(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy);
    if (d <= 0.0001) return '';
    // no intersection
    if (d >= r1 + r2) return '';
    // one circle inside another -> return the smaller circle path
    if (d <= Math.abs(r1 - r2)) {
        const r = Math.min(r1, r2);
        const cx = r1 < r2 ? x1 : x2;
        const cy = r1 < r2 ? y1 : y2;
        return circlePath(cx, cy, r);
    }
    // intersection points
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    const xm = x1 + a * dx / d;
    const ym = y1 + a * dy / d;
    const rx = -dy * (h / d);
    const ry = dx * (h / d);
    const xi1 = xm + rx;
    const yi1 = ym + ry;
    const xi2 = xm - rx;
    const yi2 = ym - ry;
    // Build path: arc on circle1 from P1 to P2, then arc on circle2 from P2 back to P1
    const largeArc1 = 0;
    const sweep1 = 1;
    const largeArc2 = 0;
    const sweep2 = 1;
    // Use absolute coords
    const path = `M ${xi1} ${yi1} ` + `A ${r1} ${r1} 0 ${largeArc1} ${sweep1} ${xi2} ${yi2} ` + `A ${r2} ${r2} 0 ${largeArc2} ${sweep2} ${xi1} ${yi1} Z`;
    return path;
}
function circlePath(cx, cy, r) {
    // draw a full circle as path
    return `M ${cx - r} ${cy} ` + `a ${r} ${r} 0 1 0 ${r * 2} 0 ` + `a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
}
// Approximate the lens intersection area by sampling points along both arcs
function lensPolygonPoints(x1, y1, r1, x2, y2, r2, segments = 24) {
    // if no intersection, return empty
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy);
    if (d <= 0.0001) return [];
    if (d >= r1 + r2) return [];
    if (d <= Math.abs(r1 - r2)) {
        // return circle approximated
        const r = Math.min(r1, r2);
        const cx = r1 < r2 ? x1 : x2;
        const cy = r1 < r2 ? y1 : y2;
        const pts = [];
        for(let i = 0; i < segments; i++){
            const a = i / segments * Math.PI * 2;
            pts.push({
                x: cx + Math.cos(a) * r,
                y: cy + Math.sin(a) * r
            });
        }
        return pts;
    }
    // compute intersection arc endpoints (reuse math from lensPathForCircles)
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    const xm = x1 + a * dx / d;
    const ym = y1 + a * dy / d;
    const rx = -dy * (h / d);
    const ry = dx * (h / d);
    const xi1 = xm + rx;
    const yi1 = ym + ry;
    const xi2 = xm - rx;
    const yi2 = ym - ry;
    // angles for arcs
    const ang1 = Math.atan2(yi1 - y1, xi1 - x1);
    const ang2 = Math.atan2(yi2 - y1, xi2 - x1);
    const ang3 = Math.atan2(yi2 - y2, xi2 - x2);
    const ang4 = Math.atan2(yi1 - y2, xi1 - x2);
    // normalize sweep from ang1 -> ang2 on circle1, and ang3 -> ang4 on circle2
    const pts = [];
    const segHalf = Math.ceil(segments / 2);
    // circle1 arc from ang1 to ang2
    for(let i = 0; i <= segHalf; i++){
        const t = i / segHalf;
        // interpolate angle on shorter arc
        let a1 = ang1 + shortestAngleDiff(ang1, ang2) * t;
        pts.push({
            x: x1 + Math.cos(a1) * r1,
            y: y1 + Math.sin(a1) * r1
        });
    }
    // circle2 arc from ang3 to ang4
    for(let i = 0; i <= segHalf; i++){
        const t = i / segHalf;
        let a2 = ang3 + shortestAngleDiff(ang3, ang4) * t;
        pts.push({
            x: x2 + Math.cos(a2) * r2,
            y: y2 + Math.sin(a2) * r2
        });
    }
    return pts;
}
function shortestAngleDiff(a, b) {
    let diff = b - a;
    while(diff < -Math.PI)diff += Math.PI * 2;
    while(diff > Math.PI)diff -= Math.PI * 2;
    return diff;
}

},{"gsap":"fPSuC","gsap/ScrollTrigger":"7wnFk","gsap/SplitText":"63tvY","./horizontalLoop":"02lVZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"02lVZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>horizontalLoop);
var _gsap = require("gsap");
var _gsapDefault = parcelHelpers.interopDefault(_gsap);
function horizontalLoop(items, config) {
    items = (0, _gsapDefault.default).utils.toArray(items);
    config = config || {};
    let tl = (0, _gsapDefault.default).timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: {
            ease: 'none'
        },
        onReverseComplete: ()=>tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }), length = items.length, startX = items[0].offsetLeft, times = [], widths = [], xPercents = [], curIndex = 0, pixelsPerSecond = (config.speed || 1) * 100, snap = config.snap === false ? (v)=>v : (0, _gsapDefault.default).utils.snap(config.snap || 1), totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    (0, _gsapDefault.default).set(items, {
        // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el)=>{
            let w = widths[i] = parseFloat((0, _gsapDefault.default).getProperty(el, 'width', 'px'));
            xPercents[i] = snap(parseFloat((0, _gsapDefault.default).getProperty(el, 'x', 'px')) / w * 100 + (0, _gsapDefault.default).getProperty(el, 'xPercent'));
            return xPercents[i];
        }
    });
    (0, _gsapDefault.default).set(items, {
        x: 0
    });
    totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * (0, _gsapDefault.default).getProperty(items[length - 1], 'scaleX') + (parseFloat(config.paddingRight) || 0);
    for(i = 0; i < length; i++){
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * (0, _gsapDefault.default).getProperty(item, 'scaleX');
        tl.to(item, {
            xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
            duration: distanceToLoop / pixelsPerSecond
        }, 0).fromTo(item, {
            xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
        }, {
            xPercent: xPercents[i],
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false
        }, distanceToLoop / pixelsPerSecond).add('label' + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = (0, _gsapDefault.default).utils.wrap(0, length, index), time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
            // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {
                time: (0, _gsapDefault.default).utils.wrap(0, tl.duration())
            };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = (vars)=>toIndex(curIndex + 1, vars);
    tl.previous = (vars)=>toIndex(curIndex - 1, vars);
    tl.current = ()=>curIndex;
    tl.toIndex = (index, vars)=>toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}

},{"gsap":"fPSuC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["lulYw"], null, "parcelRequire60dc", {})

//# sourceMappingURL=formula.5806d454.js.map
