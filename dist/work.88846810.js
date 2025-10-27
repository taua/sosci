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
})({"2tWFu":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 58698;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "bced37ce88846810";
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

},{}],"ksOB8":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initWorkPage", ()=>initWorkPage);
parcelHelpers.export(exports, "cleanupWorkPage", ()=>cleanupWorkPage);
var _gsap = require("gsap");
var _workLinksModule = require("./utils/workLinksModule");
// Create work-links module instance
let workLinksModule = null;
function initWorkPage() {
    // Initialize the shared work-links module
    workLinksModule = (0, _workLinksModule.createWorkLinksModule)();
    workLinksModule.init();
}
function cleanupWorkPage() {
    if (workLinksModule) {
        workLinksModule.cleanup();
        workLinksModule = null;
    }
}
window.initPageTransitions = function() {
    // Your page-specific GSAP intro animation here
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

},{"gsap":"fPSuC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./utils/workLinksModule":"dJji4"}],"dJji4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Shared work-links functionality that can be used by multiple pages
parcelHelpers.export(exports, "createWorkLinksModule", ()=>createWorkLinksModule);
var _gsap = require("gsap");
function createWorkLinksModule() {
    // Module-scoped state
    const state = {
        workImgShell: null,
        workLinksShell: null,
        workLinks: null,
        workImgMasks: null,
        currentIndex: 1000,
        currentVideo: null,
        currentMask: null,
        xTo: null,
        yTo: null,
        onMouseMovePos: null,
        onMouseMoveLastY: null,
        onWorkShellEnter: null,
        onWorkShellLeave: null,
        onInitialMouseMove: null
    };
    function init() {
        // Pause all videos
        document.querySelectorAll('video').forEach((video)=>{
            video.pause();
        });
        const workImgShell = document.querySelector('.work-img-shell');
        const workLinksShell = document.querySelector('.work-links-shell');
        const workLinks = document.querySelectorAll('.work-links-item');
        const workImgMasks = document.querySelectorAll('.work-img-mask');
        state.workImgShell = workImgShell;
        state.workLinksShell = workLinksShell;
        state.workLinks = workLinks;
        state.workImgMasks = workImgMasks;
        // Number work link blocks (format: "01 /", "02 /")
        try {
            const elems = Array.from(document.querySelectorAll('.work-link-num-txt'));
            if (elems && elems.length) {
                const total = elems.length;
                const padLen = Math.max(2, String(total).length);
                elems.forEach((el, i)=>{
                    try {
                        const n = String(i + 1).padStart(padLen, '0');
                        el.innerHTML = `${n} /`;
                    } catch (e) {}
                });
            }
        } catch (e) {}
        if (!workImgShell || !workLinksShell) return;
        // Set initial state for first mask immediately
        if (workImgMasks.length > 0) {
            const firstMask = workImgMasks[0];
            (0, _gsap.gsap).set(firstMask, {
                zIndex: state.currentIndex
            });
            const firstAnimeElement = firstMask.querySelector('.work-img-mask-anime');
            if (firstAnimeElement) {
                (0, _gsap.gsap).set(firstAnimeElement, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    overflow: 'hidden'
                });
                state.currentMask = firstMask;
                // Play first video if exists
                const firstVideo = firstMask.querySelector('video');
                if (firstVideo) {
                    firstVideo.play();
                    state.currentVideo = firstVideo;
                }
            }
        }
        // Reset and set initial state
        workImgShell.style.cssText = '';
        (0, _gsap.gsap).set(workImgShell, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: 9999,
            pointerEvents: 'none'
        });
        // Create quickTo animations
        const xTo = (0, _gsap.gsap).quickTo(workImgShell, "x", {
            duration: 1.2,
            ease: "expo.out"
        });
        const yTo = (0, _gsap.gsap).quickTo(workImgShell, "y", {
            duration: 1.2,
            ease: "expo.out"
        });
        state.xTo = xTo;
        state.yTo = yTo;
        // Mouse move handler using content-shell position
        const onMouseMovePos = (e)=>{
            const shellYoffset = document.querySelector('.content-shell').getBoundingClientRect().top;
            xTo(e.clientX);
            yTo(e.clientY - shellYoffset);
        };
        state.onMouseMovePos = onMouseMovePos;
        window.addEventListener("mousemove", onMouseMovePos);
        // Container hover handling for both shells
        const handleContainerHover = (enter)=>{
            (0, _gsap.gsap).killTweensOf(workImgShell, "opacity");
            (0, _gsap.gsap).to(workImgShell, {
                opacity: enter ? 1 : 0,
                scale: enter ? 1 : 0.8,
                duration: enter ? 0.6 : 0.3,
                ease: "expo.out"
            });
            if (enter && state.currentMask) {
                const video = state.currentMask.querySelector('video');
                if (video) {
                    video.play();
                    state.currentVideo = video;
                }
            } else if (!enter && state.currentVideo) {
                state.currentVideo.pause();
                state.currentVideo = null;
            }
        };
        state.onWorkShellEnter = ()=>handleContainerHover(true);
        state.onWorkShellLeave = ()=>handleContainerHover(false);
        workLinksShell.addEventListener('mouseenter', state.onWorkShellEnter);
        workLinksShell.addEventListener('mouseleave', state.onWorkShellLeave);
        workImgShell.addEventListener('mouseenter', state.onWorkShellEnter);
        workImgShell.addEventListener('mouseleave', state.onWorkShellLeave);
        // Add mouse position tracking
        let lastMouseY = 0;
        const onMouseMoveLastY = (e)=>{
            lastMouseY = e.clientY;
        };
        state.onMouseMoveLastY = onMouseMoveLastY;
        window.addEventListener('mousemove', onMouseMoveLastY);
        // Check current project URL and disable matching links
        const currentPath = window.location.pathname;
        const projectMatch = currentPath.match(/projects\/([^\/]+)/);
        const currentProjectSlug = projectMatch ? projectMatch[1] : null;
        // Handle matching z-index updates and video control
        workLinks.forEach((link, index)=>{
            // Check if this link matches the current project
            let isCurrentProject = false;
            if (currentProjectSlug) {
                // Check href for match
                const href = link.getAttribute('href');
                if (href && href.includes(`projects/${currentProjectSlug}`)) isCurrentProject = true;
                // Also check headline text for match (normalize both strings)
                if (!isCurrentProject) {
                    const headlineEl = link.querySelector('.work-link-headline-txt');
                    if (headlineEl) {
                        const headlineText = headlineEl.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                        if (headlineText === currentProjectSlug.toLowerCase()) isCurrentProject = true;
                    }
                }
            }
            // If this is the current project, prevent clicks but keep hover
            if (isCurrentProject) {
                link.style.opacity = '0.5';
                link.setAttribute('data-current-project', 'true');
                // Prevent click navigation
                link.addEventListener('click', (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
            link.addEventListener('mouseenter', (e)=>{
                state.currentIndex++;
                // Animate text color to black
                const textElements = link.querySelectorAll('*');
                if (textElements.length) (0, _gsap.gsap).to(textElements, {
                    color: '#000000',
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate work-link-num to the right
                const workLinkNum = link.querySelector('.work-link-num');
                if (workLinkNum) (0, _gsap.gsap).to(workLinkNum, {
                    x: 30,
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate work-link-client to the left
                const workLinkClient = link.querySelector('.work-link-client');
                if (workLinkClient) (0, _gsap.gsap).to(workLinkClient, {
                    x: -30,
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate links-bg with directional scale
                const linksBg = link.querySelector('.links-bg');
                if (linksBg) {
                    const rect = link.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const fromTop = lastMouseY < elementCenter;
                    (0, _gsap.gsap).killTweensOf(linksBg);
                    (0, _gsap.gsap).set(linksBg, {
                        transformOrigin: fromTop ? 'top center' : 'bottom center',
                        scaleY: 0
                    });
                    (0, _gsap.gsap).to(linksBg, {
                        scaleY: 1,
                        duration: 0.6,
                        ease: "expo.out"
                    });
                }
                // Skip animation if it's the first item and we're just starting
                if (index === 0 && state.currentMask === workImgMasks[0]) return;
                // Pause current video if exists
                if (state.currentVideo) state.currentVideo.pause();
                const correspondingMask = workImgMasks[index];
                if (correspondingMask && correspondingMask !== state.currentMask) {
                    state.currentMask = correspondingMask;
                    (0, _gsap.gsap).set(correspondingMask, {
                        zIndex: state.currentIndex
                    });
                    const animeElement = correspondingMask.querySelector('.work-img-mask-anime');
                    if (animeElement) {
                        const children = animeElement.children;
                        (0, _gsap.gsap).killTweensOf([
                            animeElement,
                            children
                        ]);
                        const rect = correspondingMask.getBoundingClientRect();
                        const elementCenter = rect.top + rect.height / 2;
                        const fromTop = lastMouseY < elementCenter;
                        (0, _gsap.gsap).set(animeElement, {
                            position: 'absolute',
                            top: fromTop ? 'auto' : 0,
                            bottom: fromTop ? 0 : 'auto',
                            left: 0,
                            right: 0,
                            height: '0%',
                            overflow: 'hidden'
                        });
                        (0, _gsap.gsap).timeline().to(animeElement, {
                            height: '100%',
                            duration: 1.1,
                            ease: "expo.out"
                        });
                    }
                    const video = correspondingMask.querySelector('video');
                    if (video) {
                        video.play();
                        state.currentVideo = video;
                    }
                }
            });
            link.addEventListener('mouseleave', (e)=>{
                // Animate text color back to white
                const textElements = link.querySelectorAll('*');
                if (textElements.length) (0, _gsap.gsap).to(textElements, {
                    color: '#FFFFFF',
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate work-link-num back to original position
                const workLinkNum = link.querySelector('.work-link-num');
                if (workLinkNum) (0, _gsap.gsap).to(workLinkNum, {
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                // Animate work-link-client back to original position
                const workLinkClient = link.querySelector('.work-link-client');
                if (workLinkClient) (0, _gsap.gsap).to(workLinkClient, {
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
                const linksBg = link.querySelector('.links-bg');
                if (linksBg) {
                    const rect = link.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const fromTop = e.clientY < elementCenter;
                    (0, _gsap.gsap).killTweensOf(linksBg);
                    (0, _gsap.gsap).set(linksBg, {
                        transformOrigin: fromTop ? 'top center' : 'bottom center'
                    });
                    (0, _gsap.gsap).to(linksBg, {
                        scaleY: 0,
                        duration: 0.6,
                        ease: "expo.out"
                    });
                }
            });
        });
        // Check if cursor is over element
        const isCursorOverElement = (element, x, y)=>{
            const rect = element.getBoundingClientRect();
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        };
        // Check initial cursor position
        const checkInitialCursor = (e)=>{
            if (isCursorOverElement(workLinksShell, e.clientX, e.clientY)) handleContainerHover(true);
            document.removeEventListener('mousemove', checkInitialCursor);
        };
        const onInitialMouseMove = checkInitialCursor;
        state.onInitialMouseMove = onInitialMouseMove;
        document.addEventListener('mousemove', onInitialMouseMove);
    }
    function cleanup() {
        try {
            // Pause all videos
            document.querySelectorAll('video').forEach((video)=>{
                try {
                    video.pause();
                } catch (e) {}
            });
            // Remove window listeners
            if (state.onMouseMovePos) window.removeEventListener('mousemove', state.onMouseMovePos);
            if (state.onMouseMoveLastY) window.removeEventListener('mousemove', state.onMouseMoveLastY);
            if (state.onInitialMouseMove) document.removeEventListener('mousemove', state.onInitialMouseMove);
            // Remove shell listeners
            if (state.workLinksShell) {
                state.workLinksShell.removeEventListener('mouseenter', state.onWorkShellEnter);
                state.workLinksShell.removeEventListener('mouseleave', state.onWorkShellLeave);
            }
            if (state.workImgShell) {
                state.workImgShell.removeEventListener('mouseenter', state.onWorkShellEnter);
                state.workImgShell.removeEventListener('mouseleave', state.onWorkShellLeave);
            }
            // Remove per-link listeners
            if (state.workLinks && state.workLinks.length) state.workLinks.forEach((link)=>{
                try {
                    const clone = link.cloneNode(true);
                    link.parentNode.replaceChild(clone, link);
                } catch (e) {}
            });
            // Kill tweens
            try {
                (0, _gsap.gsap).killTweensOf(state.workImgShell);
            } catch (e) {}
            try {
                (0, _gsap.gsap).killTweensOf(state.workImgShell && state.workImgShell.children);
            } catch (e) {}
            // Clear state
            Object.keys(state).forEach((key)=>{
                state[key] = null;
            });
            state.currentIndex = 1000;
        } catch (e) {
            console.warn('workLinksModule cleanup error', e);
        }
    }
    return {
        init,
        cleanup
    };
}

},{"gsap":"fPSuC","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["2tWFu"], null, "parcelRequire60dc", {})

//# sourceMappingURL=work.88846810.js.map
