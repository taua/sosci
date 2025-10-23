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
      return res === false ? {} : newRequire(res);
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
})({"9CTwD":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 58698;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "60812b4e599f4e0e";
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

},{}],"gEnYU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Entry point for home page JS
parcelHelpers.export(exports, "initHomePage", ()=>initHomePage);
parcelHelpers.export(exports, "cleanupHomePage", ()=>cleanupHomePage);
var _gsap = require("gsap");
var _imgTrailEffect = require("./imgTrailEffect");
var _imgTrailEffectDefault = parcelHelpers.interopDefault(_imgTrailEffect);
var _horizontalLoop = require("./horizontalLoop");
var _horizontalLoopDefault = parcelHelpers.interopDefault(_horizontalLoop);
var _observer = require("gsap/Observer");
var _scrollTrigger = require("gsap/ScrollTrigger");
var _splitText = require("gsap/SplitText");
var _scrollReset = require("./utils/scrollReset");
(0, _gsap.gsap).registerPlugin((0, _observer.Observer), (0, _scrollTrigger.ScrollTrigger), (0, _splitText.SplitText));
let homeScrollTriggers = [];
// Track the last real mouse position globally
window._lastRealMousePos = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};
window.addEventListener('mousemove', function(e) {
    window._lastRealMousePos = {
        x: e.pageX,
        y: e.pageY
    };
});
function initHomePage() {
    (0, _scrollReset.initScrollReset)();
    window.scrollTo(0, 0);
    (0, _scrollTrigger.ScrollTrigger).refresh();
    // Set initial state of hero image
    (0, _gsap.gsap).set('.hero-img', {
        opacity: 0,
        scale: 1.3,
        filter: 'blur(20px)',
        transformOrigin: 'center center'
    });
    // Slide-in top nav (.global-nav-links) when user starts scrolling on Home
    const globalNavLinks = document.querySelector('.global-nav-links');
    if (globalNavLinks) {
        // Calculate hide offset (element height + its computed top margin). This accounts for a 30px top margin.
        const cs = getComputedStyle(globalNavLinks);
        const marginTop = parseFloat(cs.marginTop) || 0;
        const hideY = -(globalNavLinks.offsetHeight + marginTop);
        // Start hidden above the viewport using translate3d with pixel offset
        (0, _gsap.gsap).set(globalNavLinks, {
            transform: `translate3d(0, ${hideY}px, 0)`
        });
        const navShowTrigger = (0, _scrollTrigger.ScrollTrigger).create({
            trigger: document.body,
            start: '120px top',
            onEnter: ()=>{
                (0, _gsap.gsap).to(globalNavLinks, {
                    transform: 'translate3d(0, 0, 0)',
                    duration: 1,
                    ease: 'power4.out'
                });
            },
            onLeaveBack: ()=>{
                (0, _gsap.gsap).to(globalNavLinks, {
                    transform: `translate3d(0, ${hideY}px, 0)`,
                    duration: 1,
                    ease: 'power4.out'
                });
            }
        });
        homeScrollTriggers.push(navShowTrigger);
    }
    // Slide-in bottom footer (.global-footer-shell) from below viewport using same timings/trigger
    const globalFooter = document.querySelector('.global-footer-shell');
    if (globalFooter) {
        // Calculate hide offset (element height + its computed bottom margin)
        const fcs = getComputedStyle(globalFooter);
        const marginBottom = parseFloat(fcs.marginBottom) || 0;
        const hideFooterY = globalFooter.offsetHeight + marginBottom; // positive Y to move below
        // Start hidden below the viewport using translate3d with pixel offset
        (0, _gsap.gsap).set(globalFooter, {
            transform: `translate3d(0, ${hideFooterY}px, 0)`
        });
        const footerShowTrigger = (0, _scrollTrigger.ScrollTrigger).create({
            trigger: document.body,
            start: '120px top',
            onEnter: ()=>{
                (0, _gsap.gsap).to(globalFooter, {
                    transform: 'translate3d(0, 0, 0)',
                    duration: 1,
                    ease: 'power4.out'
                });
            },
            onLeaveBack: ()=>{
                (0, _gsap.gsap).to(globalFooter, {
                    transform: `translate3d(0, ${hideFooterY}px, 0)`,
                    duration: 1,
                    ease: 'power4.out'
                });
            }
        });
        homeScrollTriggers.push(footerShowTrigger);
    }
    // Add scroll CTA line animation (only if element exists)
    const ctaLineEl = document.querySelector('.scroll-cta-line');
    const ctaShellEl = document.querySelector('.scroll-cta-shell');
    let scrollCtaTimeline = null;
    if (ctaLineEl) {
        (0, _gsap.gsap).set(ctaLineEl, {
            scaleY: 0,
            transformOrigin: 'top center'
        });
        scrollCtaTimeline = (0, _gsap.gsap).timeline({
            repeat: -1,
            defaults: {
                duration: 1,
                ease: "expo.inOut"
            }
        });
        scrollCtaTimeline.to(ctaLineEl, {
            scaleY: 1,
            transformOrigin: 'top center'
        }).set(ctaLineEl, {
            transformOrigin: 'bottom center'
        }).to(ctaLineEl, {
            scaleY: 0
        });
    }
    // Control scroll CTA visibility based on hero section (fade the whole .scroll-cta-shell when available)
    const heroTickerExists = !!document.querySelector('.hero-ticker-shell');
    const fadeTarget = ctaShellEl || ctaLineEl; // prefer shell, fallback to line
    if (fadeTarget && heroTickerExists) (0, _scrollTrigger.ScrollTrigger).create({
        trigger: '.hero-ticker-shell',
        start: 'top bottom',
        onEnter: ()=>{
            if (scrollCtaTimeline) scrollCtaTimeline.pause();
            (0, _gsap.gsap).to(fadeTarget, {
                opacity: 0,
                duration: 0.3
            });
        },
        onLeaveBack: ()=>{
            if (scrollCtaTimeline) scrollCtaTimeline.play();
            (0, _gsap.gsap).to(fadeTarget, {
                opacity: 1,
                duration: 0.3
            });
        }
    });
    // Create opacity and scale animations only if both elements exist
    const heroImg = document.querySelector('.hero-img');
    const heroTickerShell = document.querySelector('.hero-ticker-shell');
    if (heroImg && heroTickerShell) {
        const opacityTimeline = (0, _gsap.gsap).timeline({
            scrollTrigger: {
                trigger: '.img-trail-hero-shell',
                start: 'top top',
                endTrigger: '.manifesto-shell',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self)=>{
                    const progress = self.progress;
                    if (progress <= 0.25) (0, _gsap.gsap).to(heroImg, {
                        opacity: progress * 4,
                        filter: `blur(${20 - progress * 80}px)`,
                        duration: 0.1
                    });
                    else if (progress >= 0.35) (0, _gsap.gsap).to(heroImg, {
                        opacity: 1 - (progress - 0.35) * 4,
                        duration: 0.1
                    });
                }
            }
        });
        homeScrollTriggers.push(opacityTimeline.scrollTrigger);
        const scaleTween = (0, _gsap.gsap).to(heroImg, {
            scale: 1,
            scrollTrigger: {
                trigger: '.img-trail-hero-shell',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
        homeScrollTriggers.push(scaleTween.scrollTrigger);
    }
    // Only run imgTrailEffect when hero is in view
    let imgTrailCleanup = null;
    let activationTimeout = null;
    function enableEffect() {
        clearTimeout(activationTimeout);
        activationTimeout = setTimeout(()=>{
            if (typeof imgTrailCleanup === 'function') {
                imgTrailCleanup();
                imgTrailCleanup = null;
            }
            imgTrailCleanup = (0, _imgTrailEffectDefault.default)();
        }, 100);
    }
    function disableEffect() {
        clearTimeout(activationTimeout);
        if (typeof imgTrailCleanup === 'function') {
            imgTrailCleanup();
            imgTrailCleanup = null;
        }
    }
    (0, _scrollTrigger.ScrollTrigger).create({
        trigger: '.img-trail-hero-shell',
        start: 'top bottom',
        end: 'bottom 75%',
        //markers: true,
        onEnter: enableEffect,
        onLeave: disableEffect,
        onEnterBack: enableEffect,
        onLeaveBack: disableEffect
    });
    // Store effect cleanup on window so cleanupHomePage can access them if needed
    window._homeImgTrailCleanup = ()=>{
        try {
            disableEffect();
        } catch (e) {}
    };
    // Loop through each ticker group container on the page with alternating directions
    document.querySelectorAll('.home-project-scroll-txt-shell').forEach((shell, index)=>{
        const txts = shell.querySelectorAll('.home-project-txt');
        if (txts.length > 0) {
            // Alternate direction based on index (even = normal, odd = reversed)
            const initialDirection = index % 2 === 0 ? 1 : -1;
            introTicker(txts, shell, initialDirection);
        }
    });
    // Updated ticker function with proper direction handling
    function introTicker(txtNodes, shell, initialDirection = 1) {
        const baseSpeed = 1.2;
        const maxSpeed = 8;
        const velocityMult = 0.005;
        // Create horizontal loop with proper reversed setting
        const heroLoop = (0, _horizontalLoopDefault.default)(txtNodes, {
            repeat: -1,
            speed: baseSpeed,
            reversed: initialDirection < 0 // This is crucial - set reversed based on initial direction
        });
        // Always use positive timeScale regardless of direction
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
        (0, _scrollTrigger.ScrollTrigger).create({
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
                // Only consider significant movement
                if (Math.abs(scrollVelocity) > 0.5) {
                    const scrollDirection = Math.sign(scrollVelocity);
                    // Flip the scroll direction if this is a reversed ticker
                    const effectiveDirection = initialDirection < 0 ? -scrollDirection : scrollDirection;
                    currentDirection = effectiveDirection;
                    const boostAmount = Math.min(Math.abs(scrollVelocity * velocityMult), maxSpeed);
                    const effectiveSpeed = absBaseSpeed + Math.abs(effectiveDirection) * boostAmount;
                    heroLoop.timeScale(effectiveSpeed * Math.sign(effectiveDirection));
                }
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(()=>{
                    // When scrolling stops, normalize speed but keep direction
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
            (0, _gsap.gsap).killTweensOf(heroLoop);
            heroLoop.kill();
        };
    }
    // Animate manifesto text words on scroll using GSAP SplitText
    const manifesto = document.querySelector('.manifesto-txt');
    if (manifesto) // Only split once
    {
        if (!manifesto.classList.contains('split')) {
            const split = new (0, _splitText.SplitText)(manifesto, {
                type: 'words'
            });
            manifesto.classList.add('split');
            // Animate words
            (0, _gsap.gsap).set(split.words, {
                color: '#2f2f2fff',
                display: 'inline',
                whiteSpace: 'normal'
            });
            (0, _gsap.gsap).to(split.words, {
                color: '#fff',
                stagger: 0.05,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.manifesto-shell',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: true
                }
            });
        }
    }
    // Add hover animations for featured projects
    document.querySelectorAll('.home-featured-proj-img').forEach((container)=>{
        const shell = container.querySelector('.home-featured-pj-shell');
        const children = shell.children;
        let isAnimating = false;
        container.addEventListener('mouseenter', ()=>{
            (0, _gsap.gsap).killTweensOf([
                shell,
                children
            ]);
            (0, _gsap.gsap).to(shell, {
                width: '93%',
                height: '93%',
                duration: 0.6,
                ease: 'power4.out'
            });
            (0, _gsap.gsap).to(children, {
                scale: 1.2,
                duration: 0.6,
                ease: 'power4.out'
            });
        });
        container.addEventListener('mouseleave', ()=>{
            (0, _gsap.gsap).killTweensOf([
                shell,
                children
            ]);
            (0, _gsap.gsap).to(shell, {
                width: '100%',
                height: '100%',
                duration: 0.6,
                ease: 'power4.out'
            });
            (0, _gsap.gsap).to(children, {
                scale: 1,
                duration: 0.4,
                ease: 'power4.out'
            });
        });
    });
    // Add directional hover animations for service items
    let lastMouseY = 0;
    window.addEventListener('mousemove', (e)=>{
        lastMouseY = e.clientY;
    });
    // Track currently open accordion item
    let currentlyOpenItem = null;
    document.querySelectorAll('.service-item-shell').forEach((item)=>{
        // Track hover state
        let isHovered = false;
        // Click handler for accordion behavior
        item.addEventListener('click', (e)=>{
            const serviceSpacer = item.querySelector('.service-link-spacer');
            const serviceParagraph = item.querySelector('.service-paragraph-shell');
            if (!serviceSpacer || !serviceParagraph) return;
            const isOpen = item.classList.contains('open');
            // Close currently open item if it's different from this one
            if (currentlyOpenItem && currentlyOpenItem !== item) {
                const openSpacer = currentlyOpenItem.querySelector('.service-link-spacer');
                const openBg = currentlyOpenItem.querySelector('.service-link-bg');
                const openPlusSymbol = currentlyOpenItem.querySelector('.plus-symbol-svg');
                const openServiceName = currentlyOpenItem.querySelector('.service-name-txt');
                const openParagraph = currentlyOpenItem.querySelector('.service-paragraph-shell');
                if (openSpacer) (0, _gsap.gsap).to(openSpacer, {
                    height: 0,
                    duration: 0.6,
                    ease: "expo.inOut"
                });
                // Trigger hover out animations on previously open item
                if (openBg) (0, _gsap.gsap).to(openBg, {
                    scaleY: 0,
                    duration: 0.6,
                    ease: "expo.out"
                });
                if (openPlusSymbol) (0, _gsap.gsap).to(openPlusSymbol, {
                    color: '#FFFFFF',
                    x: 0,
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                if (openServiceName) (0, _gsap.gsap).to(openServiceName, {
                    color: '#FFFFFF',
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate paragraph opacity to 0
                if (openParagraph) (0, _gsap.gsap).to(openParagraph, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                currentlyOpenItem.classList.remove('open');
            }
            if (isOpen) {
                // Close this item
                (0, _gsap.gsap).to(serviceSpacer, {
                    height: 0,
                    duration: 0.6,
                    ease: "expo.inOut"
                });
                item.classList.remove('open');
                currentlyOpenItem = null;
                // Trigger hover out animations
                const serviceBg = item.querySelector('.service-link-bg');
                const plusSymbol = item.querySelector('.plus-symbol-svg');
                const serviceName = item.querySelector('.service-name-txt');
                if (serviceBg) (0, _gsap.gsap).to(serviceBg, {
                    scaleY: 0,
                    duration: 0.6,
                    ease: "expo.out",
                    onComplete: ()=>{
                        // If still hovered after closing, re-trigger hover animations
                        if (isHovered) {
                            const rect = item.getBoundingClientRect();
                            const elementCenter = rect.top + rect.height / 2;
                            const fromTop = lastMouseY < elementCenter;
                            (0, _gsap.gsap).killTweensOf(serviceBg);
                            (0, _gsap.gsap).set(serviceBg, {
                                transformOrigin: fromTop ? 'top center' : 'bottom center',
                                scaleY: 0
                            });
                            (0, _gsap.gsap).to(serviceBg, {
                                scaleY: 1,
                                duration: 0.6,
                                ease: "expo.out"
                            });
                        }
                    }
                });
                if (plusSymbol) (0, _gsap.gsap).to(plusSymbol, {
                    color: '#FFFFFF',
                    x: 0,
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: ()=>{
                        // If still hovered after closing, re-trigger hover animations
                        if (isHovered) (0, _gsap.gsap).to(plusSymbol, {
                            color: '#000000',
                            x: -25,
                            rotation: -360,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });
                if (serviceName) (0, _gsap.gsap).to(serviceName, {
                    color: '#FFFFFF',
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: ()=>{
                        // If still hovered after closing, re-trigger hover animations
                        if (isHovered) (0, _gsap.gsap).to(serviceName, {
                            color: '#000000',
                            x: 25,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });
                // Animate paragraph opacity to 0
                (0, _gsap.gsap).to(serviceParagraph, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            } else {
                // Open this item
                const targetHeight = serviceParagraph.offsetHeight;
                (0, _gsap.gsap).to(serviceSpacer, {
                    height: targetHeight,
                    duration: 0.6,
                    ease: "expo.inOut"
                });
                item.classList.add('open');
                currentlyOpenItem = item;
                // Trigger hover in animations only if not already hovered
                if (!isHovered) {
                    const serviceBg = item.querySelector('.service-link-bg');
                    const plusSymbol = item.querySelector('.plus-symbol-svg');
                    const serviceName = item.querySelector('.service-name-txt');
                    if (serviceBg) {
                        const rect = item.getBoundingClientRect();
                        const elementCenter = rect.top + rect.height / 2;
                        const fromTop = lastMouseY < elementCenter;
                        (0, _gsap.gsap).killTweensOf(serviceBg);
                        (0, _gsap.gsap).set(serviceBg, {
                            transformOrigin: fromTop ? 'top center' : 'bottom center',
                            scaleY: 0
                        });
                        (0, _gsap.gsap).to(serviceBg, {
                            scaleY: 1,
                            duration: 0.6,
                            ease: "expo.out"
                        });
                    }
                    if (plusSymbol) (0, _gsap.gsap).to(plusSymbol, {
                        color: '#000000',
                        x: -25,
                        rotation: -360,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    if (serviceName) (0, _gsap.gsap).to(serviceName, {
                        color: '#000000',
                        x: 25,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
                // Animate paragraph opacity to 1
                (0, _gsap.gsap).to(serviceParagraph, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    delay: 0.4
                });
            }
        });
        item.addEventListener('mouseenter', (e)=>{
            isHovered = true;
            // Don't trigger hover animations if item is open
            if (item.classList.contains('open')) return;
            const serviceBg = item.querySelector('.service-link-bg');
            const plusSymbol = item.querySelector('.plus-symbol-svg');
            const serviceName = item.querySelector('.service-name-txt');
            if (serviceBg) {
                const rect = item.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const fromTop = lastMouseY < elementCenter;
                (0, _gsap.gsap).killTweensOf(serviceBg);
                (0, _gsap.gsap).set(serviceBg, {
                    transformOrigin: fromTop ? 'top center' : 'bottom center',
                    scaleY: 0
                });
                (0, _gsap.gsap).to(serviceBg, {
                    scaleY: 1,
                    duration: 0.6,
                    ease: "expo.out"
                });
            }
            // Animate text and symbol to black
            if (plusSymbol) (0, _gsap.gsap).to(plusSymbol, {
                color: '#000000',
                x: -25,
                rotation: -360,
                duration: 0.4,
                ease: "power2.out"
            });
            if (serviceName) (0, _gsap.gsap).to(serviceName, {
                color: '#000000',
                x: 25,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        item.addEventListener('mouseleave', (e)=>{
            isHovered = false;
            // Don't trigger hover out if item is open
            if (item.classList.contains('open')) return;
            const serviceBg = item.querySelector('.service-link-bg');
            const plusSymbol = item.querySelector('.plus-symbol-svg');
            const serviceName = item.querySelector('.service-name-txt');
            if (serviceBg) {
                const rect = item.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const fromTop = e.clientY < elementCenter;
                (0, _gsap.gsap).killTweensOf(serviceBg);
                (0, _gsap.gsap).set(serviceBg, {
                    transformOrigin: fromTop ? 'top center' : 'bottom center'
                });
                (0, _gsap.gsap).to(serviceBg, {
                    scaleY: 0,
                    duration: 0.6,
                    ease: "expo.out"
                });
            }
            // Animate text and symbol back to white
            if (plusSymbol) (0, _gsap.gsap).to(plusSymbol, {
                color: '#FFFFFF',
                x: 0,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
            if (serviceName) (0, _gsap.gsap).to(serviceName, {
                color: '#FFFFFF',
                x: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
}
function cleanupHomePage() {
    // Kill home-specific ScrollTriggers
    if (Array.isArray(homeScrollTriggers)) {
        homeScrollTriggers.forEach((st)=>{
            try {
                if (st && typeof st.kill === 'function') st.kill();
            } catch (e) {}
        });
        homeScrollTriggers = [];
    }
    // Clear any img-trail effect
    try {
        if (typeof window._homeImgTrailCleanup === 'function') {
            window._homeImgTrailCleanup();
            window._homeImgTrailCleanup = null;
        }
    } catch (e) {}
    // Kill any ScrollTrigger animations attached to elements used here (best-effort)
    try {
        (0, _scrollTrigger.ScrollTrigger).refresh();
    } catch (e) {}
}
window.initPageTransitions = function() {
    // Your page-specific GSAP intro animation here
    // Home Page transition animation triggered
    // Animate main-shell translateY from 30% to 0% using translate3d
    const mainShell = document.querySelector('.main-shell');
    if (mainShell) (0, _gsap.gsap).fromTo(mainShell, {
        transform: "translate3d(0, 30%, 0)"
    }, {
        transform: "translate3d(0, 0, 0)",
        duration: 1,
        ease: "expo.inOut"
    });
};

},{"gsap":"fPSuC","./imgTrailEffect":"jMsgH","./horizontalLoop":"02lVZ","gsap/Observer":"aAWxM","gsap/ScrollTrigger":"7wnFk","gsap/SplitText":"63tvY","./utils/scrollReset":"eHkwM","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jMsgH":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>imgTrailEffect);
var _imagesloaded = require("imagesloaded");
var _imagesloadedDefault = parcelHelpers.interopDefault(_imagesloaded);
var _gsap = require("gsap");
var _gsapDefault = parcelHelpers.interopDefault(_gsap);
function imgTrailEffect() {
    // body element
    const body = document.body;
    //let handleMouseMove;
    // helper functions
    const MathUtils = {
        // linear interpolation
        lerp: (a, b, n)=>(1 - n) * a + n * b,
        // distance between two points
        distance: (x1, y1, x2, y2)=>Math.hypot(x2 - x1, y2 - y1)
    };
    // get the mouse position
    const getMousePos = (ev)=>{
        let posx = window.innerWidth / 2;
        let posy = window.innerHeight / 2;
        if (ev) {
            if (ev.pageX || ev.pageY) {
                posx = ev.pageX;
                posy = ev.pageY;
            } else if (ev.clientX || ev.clientY) {
                posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
                posy = ev.clientY + body.scrollTop + docEl.scrollTop;
            }
        }
        return {
            x: posx,
            y: posy
        };
    };
    // mousePos: current mouse position
    // cacheMousePos: previous mouse position
    // lastMousePos: last last recorded mouse position (at the time the last image was shown)
    const lastReal = window._lastRealMousePos || getMousePos();
    let mousePos = lastMousePos = cacheMousePos = {
        x: lastReal.x,
        y: lastReal.y
    };
    // Update mousePos on every mousemove
    function handleMouseMove(ev) {
        mousePos = getMousePos(ev);
    }
    window.addEventListener('mousemove', handleMouseMove);
    // gets the distance from the current mouse position to the last recorded mouse position
    const getMouseDistance = ()=>MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
    class Image {
        constructor(el){
            this.DOM = {
                el: el
            };
            // image deafult styles
            this.defaultStyle = {
                scale: 1,
                x: 0,
                y: 0,
                opacity: 0
            };
            // get sizes/position
            this.getRect();
            // init/bind events
            this.initEvents();
        }
        initEvents() {
            // on resize get updated sizes/position
            window.addEventListener('resize', ()=>this.resize());
        }
        resize() {
            // reset styles
            (0, _gsapDefault.default).set(this.DOM.el, this.defaultStyle);
            // get sizes/position
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
        }
        isActive() {
            // check if image is animating or if it's visible
            return (0, _gsapDefault.default).isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
        }
    }
    let imageTrailInstance = null;
    let animationFrameId = null;
    class ImageTrail {
        constructor(){
            this.DOM = {
                content: document.querySelector('.content')
            };
            this.images = [];
            [
                ...this.DOM.content.querySelectorAll('img')
            ].forEach((img)=>this.images.push(new Image(img)));
            this.imagesTotal = this.images.length;
            this.imgPosition = 0;
            this.zIndexVal = 1;
            this.threshold = 100;
            // Force recalc of all image rects on creation
            this.images.forEach((img)=>img.resize());
            animationFrameId = requestAnimationFrame(()=>this.render());
        }
        render() {
            let distance = getMouseDistance();
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);
            if (distance > this.threshold) {
                this.showNextImage();
                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
                lastMousePos = mousePos;
            }
            let isIdle = true;
            for (let img of this.images)if (img.isActive()) {
                isIdle = false;
                break;
            }
            if (isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
            animationFrameId = requestAnimationFrame(()=>this.render());
        }
        showNextImage() {
            // show image at position [this.imgPosition]
            const img = this.images[this.imgPosition];
            // kill any tween on the image
            (0, _gsapDefault.default).killTweensOf(img.DOM.el);
            let theIndex = $(img.DOM.el).index();
            //let theTextColor = colorCombos[theIndex].text_color;
            //let theBgColor = colorCombos[theIndex].background_color;
            //let theDelay = .15;
            //let theDuration = 4;
            //gsap.killTweensOf(['.bg-color' , '.menu-top-bar' , '.menu-bottom-bar' , '.home-body' ]);
            //gsap.to('.bg-color', {duration: theDuration, ease:Power4.easeOut, backgroundColor:theBgColor , delay: theDelay})
            //gsap.to(['.menu-top-bar' , '.menu-bottom-bar'], {duration: theDuration, ease:Power4.easeOut, color:theTextColor , delay: theDelay});
            //gsap.to('.home-body', {duration: theDuration, ease:Power4.easeOut, color:theTextColor, textStrokeColor:theTextColor , delay: theDelay});
            (0, _gsapDefault.default).timeline()// show the image
            .fromTo(img.DOM.el, {
                zIndex: this.zIndexVal,
                scale: 0,
                opacity: 0,
                x: cacheMousePos.x - img.rect.width / 2,
                y: cacheMousePos.y - img.rect.height / 2
            }, {
                //startAt: {opacity: 0, scale: 1},
                opacity: 1,
                scale: .6,
                duration: .15,
                //ease: "expo",
                zIndex: this.zIndexVal,
                x: cacheMousePos.x - img.rect.width / 2,
                y: cacheMousePos.y - img.rect.height / 2
            }, 0)// animate position
            .to(img.DOM.el, {
                duration: 1,
                ease: "expo",
                x: mousePos.x - img.rect.width / 2,
                y: mousePos.y - img.rect.height / 2
            }, "<")// then make it disappear
            .to(img.DOM.el, {
                duration: .3,
                ease: "power4",
                opacity: 0
            }, 1.1)// scale down the image
            .to(img.DOM.el, {
                duration: .3,
                ease: "quint",
                scale: 0.2
            }, 1.1);
        }
        destroy() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            // Animate all images out with the same scale down effect as in showNextImage
            const tl = (0, _gsapDefault.default).timeline();
            this.images.forEach((img)=>{
                tl.to(img.DOM.el, {
                    opacity: 0,
                    scale: 0.2,
                    duration: 0.3,
                    ease: "quint"
                }, 0); // All at once
            });
            // After animation, reset styles
            tl.add(()=>{
                this.images.forEach((img)=>{
                    (0, _gsapDefault.default).set(img.DOM.el, img.defaultStyle);
                });
            });
            // Remove resize listeners as before
            this.images.forEach((img)=>{
                window.removeEventListener('resize', ()=>img.resize());
            });
        }
    }
    // Preload images
    const preloadImages = ()=>{
        return new Promise((resolve, reject)=>{
            (0, _imagesloadedDefault.default)(document.querySelectorAll('.content__img'), resolve);
        });
    };
    // And then..
    preloadImages().then(()=>{
        // Remove the loader
        document.body.classList.remove('loading');
        // Immediately update all mouse position variables to the current mouse position on (re)activation
        const currentMouse = getMousePos();
        mousePos = lastMousePos = cacheMousePos = {
            x: currentMouse.x,
            y: currentMouse.y
        };
        imageTrailInstance = new ImageTrail();
    });
    // Return a cleanup function to remove the event listener
    return function cleanup() {
        window.removeEventListener('mousemove', handleMouseMove);
        if (imageTrailInstance && typeof imageTrailInstance.destroy === 'function') {
            imageTrailInstance.destroy();
            imageTrailInstance = null;
        }
    // Add any other cleanup logic here (timeouts, DOM changes, etc.)
    };
}

},{"imagesloaded":"aYzyZ","gsap":"fPSuC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aYzyZ":[function(require,module,exports,__globalThis) {
/*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */ (function(window1, factory) {
    // universal module definition
    if (module.exports) // CommonJS
    module.exports = factory(window1, require("493897767f7120e"));
    else // browser global
    window1.imagesLoaded = factory(window1, window1.EvEmitter);
})(typeof window !== 'undefined' ? window : this, function factory(window1, EvEmitter) {
    let $ = window1.jQuery;
    let console = window1.console;
    // -------------------------- helpers -------------------------- //
    // turn element or nodeList into an array
    function makeArray(obj) {
        // use object if already an array
        if (Array.isArray(obj)) return obj;
        let isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
        // convert nodeList to array
        if (isArrayLike) return [
            ...obj
        ];
        // array of single index
        return [
            obj
        ];
    }
    // -------------------------- imagesLoaded -------------------------- //
    /**
 * @param {[Array, Element, NodeList, String]} elem
 * @param {[Object, Function]} options - if function, use as callback
 * @param {Function} onAlways - callback function
 * @returns {ImagesLoaded}
 */ function ImagesLoaded(elem, options, onAlways) {
        // coerce ImagesLoaded() without new, to be new ImagesLoaded()
        if (!(this instanceof ImagesLoaded)) return new ImagesLoaded(elem, options, onAlways);
        // use elem as selector string
        let queryElem = elem;
        if (typeof elem == 'string') queryElem = document.querySelectorAll(elem);
        // bail if bad element
        if (!queryElem) {
            console.error(`Bad element for imagesLoaded ${queryElem || elem}`);
            return;
        }
        this.elements = makeArray(queryElem);
        this.options = {};
        // shift arguments if no options set
        if (typeof options == 'function') onAlways = options;
        else Object.assign(this.options, options);
        if (onAlways) this.on('always', onAlways);
        this.getImages();
        // add jQuery Deferred object
        if ($) this.jqDeferred = new $.Deferred();
        // HACK check async to allow time to bind listeners
        setTimeout(this.check.bind(this));
    }
    ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
    ImagesLoaded.prototype.getImages = function() {
        this.images = [];
        // filter & find items if we have an item selector
        this.elements.forEach(this.addElementImages, this);
    };
    const elementNodeTypes = [
        1,
        9,
        11
    ];
    /**
 * @param {Node} elem
 */ ImagesLoaded.prototype.addElementImages = function(elem) {
        // filter siblings
        if (elem.nodeName === 'IMG') this.addImage(elem);
        // get background image on element
        if (this.options.background === true) this.addElementBackgroundImages(elem);
        // find children
        // no non-element nodes, #143
        let { nodeType } = elem;
        if (!nodeType || !elementNodeTypes.includes(nodeType)) return;
        let childImgs = elem.querySelectorAll('img');
        // concat childElems to filterFound array
        for (let img of childImgs)this.addImage(img);
        // get child background images
        if (typeof this.options.background == 'string') {
            let children = elem.querySelectorAll(this.options.background);
            for (let child of children)this.addElementBackgroundImages(child);
        }
    };
    const reURL = /url\((['"])?(.*?)\1\)/gi;
    ImagesLoaded.prototype.addElementBackgroundImages = function(elem) {
        let style = getComputedStyle(elem);
        // Firefox returns null if in a hidden iframe https://bugzil.la/548397
        if (!style) return;
        // get url inside url("...")
        let matches = reURL.exec(style.backgroundImage);
        while(matches !== null){
            let url = matches && matches[2];
            if (url) this.addBackground(url, elem);
            matches = reURL.exec(style.backgroundImage);
        }
    };
    /**
 * @param {Image} img
 */ ImagesLoaded.prototype.addImage = function(img) {
        let loadingImage = new LoadingImage(img);
        this.images.push(loadingImage);
    };
    ImagesLoaded.prototype.addBackground = function(url, elem) {
        let background = new Background(url, elem);
        this.images.push(background);
    };
    ImagesLoaded.prototype.check = function() {
        this.progressedCount = 0;
        this.hasAnyBroken = false;
        // complete if no images
        if (!this.images.length) {
            this.complete();
            return;
        }
        /* eslint-disable-next-line func-style */ let onProgress = (image, elem, message)=>{
            // HACK - Chrome triggers event before object properties have changed. #83
            setTimeout(()=>{
                this.progress(image, elem, message);
            });
        };
        this.images.forEach(function(loadingImage) {
            loadingImage.once('progress', onProgress);
            loadingImage.check();
        });
    };
    ImagesLoaded.prototype.progress = function(image, elem, message) {
        this.progressedCount++;
        this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
        // progress event
        this.emitEvent('progress', [
            this,
            image,
            elem
        ]);
        if (this.jqDeferred && this.jqDeferred.notify) this.jqDeferred.notify(this, image);
        // check if completed
        if (this.progressedCount === this.images.length) this.complete();
        if (this.options.debug && console) console.log(`progress: ${message}`, image, elem);
    };
    ImagesLoaded.prototype.complete = function() {
        let eventName = this.hasAnyBroken ? 'fail' : 'done';
        this.isComplete = true;
        this.emitEvent(eventName, [
            this
        ]);
        this.emitEvent('always', [
            this
        ]);
        if (this.jqDeferred) {
            let jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
            this.jqDeferred[jqMethod](this);
        }
    };
    // --------------------------  -------------------------- //
    function LoadingImage(img) {
        this.img = img;
    }
    LoadingImage.prototype = Object.create(EvEmitter.prototype);
    LoadingImage.prototype.check = function() {
        // If complete is true and browser supports natural sizes,
        // try to check for image status manually.
        let isComplete = this.getIsImageComplete();
        if (isComplete) {
            // report based on naturalWidth
            this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
            return;
        }
        // If none of the checks above matched, simulate loading on detached element.
        this.proxyImage = new Image();
        // add crossOrigin attribute. #204
        if (this.img.crossOrigin) this.proxyImage.crossOrigin = this.img.crossOrigin;
        this.proxyImage.addEventListener('load', this);
        this.proxyImage.addEventListener('error', this);
        // bind to image as well for Firefox. #191
        this.img.addEventListener('load', this);
        this.img.addEventListener('error', this);
        this.proxyImage.src = this.img.currentSrc || this.img.src;
    };
    LoadingImage.prototype.getIsImageComplete = function() {
        // check for non-zero, non-undefined naturalWidth
        // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
        return this.img.complete && this.img.naturalWidth;
    };
    LoadingImage.prototype.confirm = function(isLoaded, message) {
        this.isLoaded = isLoaded;
        let { parentNode } = this.img;
        // emit progress with parent <picture> or self <img>
        let elem = parentNode.nodeName === 'PICTURE' ? parentNode : this.img;
        this.emitEvent('progress', [
            this,
            elem,
            message
        ]);
    };
    // ----- events ----- //
    // trigger specified handler for event type
    LoadingImage.prototype.handleEvent = function(event) {
        let method = 'on' + event.type;
        if (this[method]) this[method](event);
    };
    LoadingImage.prototype.onload = function() {
        this.confirm(true, 'onload');
        this.unbindEvents();
    };
    LoadingImage.prototype.onerror = function() {
        this.confirm(false, 'onerror');
        this.unbindEvents();
    };
    LoadingImage.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener('load', this);
        this.proxyImage.removeEventListener('error', this);
        this.img.removeEventListener('load', this);
        this.img.removeEventListener('error', this);
    };
    // -------------------------- Background -------------------------- //
    function Background(url, element) {
        this.url = url;
        this.element = element;
        this.img = new Image();
    }
    // inherit LoadingImage prototype
    Background.prototype = Object.create(LoadingImage.prototype);
    Background.prototype.check = function() {
        this.img.addEventListener('load', this);
        this.img.addEventListener('error', this);
        this.img.src = this.url;
        // check if image is already complete
        let isComplete = this.getIsImageComplete();
        if (isComplete) {
            this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
            this.unbindEvents();
        }
    };
    Background.prototype.unbindEvents = function() {
        this.img.removeEventListener('load', this);
        this.img.removeEventListener('error', this);
    };
    Background.prototype.confirm = function(isLoaded, message) {
        this.isLoaded = isLoaded;
        this.emitEvent('progress', [
            this,
            this.element,
            message
        ]);
    };
    // -------------------------- jQuery -------------------------- //
    ImagesLoaded.makeJQueryPlugin = function(jQuery) {
        jQuery = jQuery || window1.jQuery;
        if (!jQuery) return;
        // set local variable
        $ = jQuery;
        // $().imagesLoaded()
        $.fn.imagesLoaded = function(options, onAlways) {
            let instance = new ImagesLoaded(this, options, onAlways);
            return instance.jqDeferred.promise($(this));
        };
    };
    // try making plugin
    ImagesLoaded.makeJQueryPlugin();
    // --------------------------  -------------------------- //
    return ImagesLoaded;
});

},{"493897767f7120e":"7rCHo"}],"7rCHo":[function(require,module,exports,__globalThis) {
/**
 * EvEmitter v2.1.1
 * Lil' event emitter
 * MIT License
 */ (function(global, factory) {
    // universal module definition
    if (module.exports) // CommonJS - Browserify, Webpack
    module.exports = factory();
    else // Browser globals
    global.EvEmitter = factory();
})(typeof window != 'undefined' ? window : this, function() {
    function EvEmitter() {}
    let proto = EvEmitter.prototype;
    proto.on = function(eventName, listener) {
        if (!eventName || !listener) return this;
        // set events hash
        let events = this._events = this._events || {};
        // set listeners array
        let listeners = events[eventName] = events[eventName] || [];
        // only add once
        if (!listeners.includes(listener)) listeners.push(listener);
        return this;
    };
    proto.once = function(eventName, listener) {
        if (!eventName || !listener) return this;
        // add event
        this.on(eventName, listener);
        // set once flag
        // set onceEvents hash
        let onceEvents = this._onceEvents = this._onceEvents || {};
        // set onceListeners object
        let onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
        // set flag
        onceListeners[listener] = true;
        return this;
    };
    proto.off = function(eventName, listener) {
        let listeners = this._events && this._events[eventName];
        if (!listeners || !listeners.length) return this;
        let index = listeners.indexOf(listener);
        if (index != -1) listeners.splice(index, 1);
        return this;
    };
    proto.emitEvent = function(eventName, args) {
        let listeners = this._events && this._events[eventName];
        if (!listeners || !listeners.length) return this;
        // copy over to avoid interference if .off() in listener
        listeners = listeners.slice(0);
        args = args || [];
        // once stuff
        let onceListeners = this._onceEvents && this._onceEvents[eventName];
        for (let listener of listeners){
            let isOnce = onceListeners && onceListeners[listener];
            if (isOnce) {
                // remove listener
                // remove before trigger to prevent recursion
                this.off(eventName, listener);
                // unset once flag
                delete onceListeners[listener];
            }
            // trigger listener
            listener.apply(this, args);
        }
        return this;
    };
    proto.allOff = function() {
        delete this._events;
        delete this._onceEvents;
        return this;
    };
    return EvEmitter;
});

},{}],"02lVZ":[function(require,module,exports,__globalThis) {
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

},{"gsap":"fPSuC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eHkwM":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initScrollReset", ()=>initScrollReset);
function initScrollReset() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (window.scrollY !== 0) {
        window.location.reload();
        return;
    }
    document.body.style.overflow = 'hidden';
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    requestAnimationFrame(()=>{
        window.scrollTo(0, 0);
        document.body.style.overflow = '';
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["9CTwD"], null, "parcelRequire60dc", {})

//# sourceMappingURL=home.599f4e0e.js.map
