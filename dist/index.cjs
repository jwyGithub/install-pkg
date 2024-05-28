var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  detectPackageManager: () => detectPackageManager,
  installPackage: () => installPackage
});
module.exports = __toCommonJS(src_exports);

// src/detect.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_process2 = __toESM(require("process"), 1);

// node_modules/.pnpm/find-up@7.0.0/node_modules/find-up/index.js
var import_node_path2 = __toESM(require("path"), 1);

// node_modules/.pnpm/locate-path@7.2.0/node_modules/locate-path/index.js
var import_node_process = __toESM(require("process"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_fs = __toESM(require("fs"), 1);
var import_node_url = require("url");

// node_modules/.pnpm/yocto-queue@1.0.0/node_modules/yocto-queue/index.js
var Node = class Node2 {
  static {
    __name(this, "Node");
  }
  value;
  next;
  constructor(value) {
    this.value = value;
  }
};
var Queue = class {
  static {
    __name(this, "Queue");
  }
  #head;
  #tail;
  #size;
  constructor() {
    this.clear();
  }
  enqueue(value) {
    const node = new Node(value);
    if (this.#head) {
      this.#tail.next = node;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }
    this.#size++;
  }
  dequeue() {
    const current = this.#head;
    if (!current) {
      return;
    }
    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }
  clear() {
    this.#head = void 0;
    this.#tail = void 0;
    this.#size = 0;
  }
  get size() {
    return this.#size;
  }
  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
};

// node_modules/.pnpm/p-limit@4.0.0/node_modules/p-limit/index.js
function pLimit(concurrency) {
  if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }
  const queue = new Queue();
  let activeCount = 0;
  const next = /* @__PURE__ */ __name(() => {
    activeCount--;
    if (queue.size > 0) {
      queue.dequeue()();
    }
  }, "next");
  const run = /* @__PURE__ */ __name(async (fn, resolve2, args) => {
    activeCount++;
    const result = (async () => fn(...args))();
    resolve2(result);
    try {
      await result;
    } catch {
    }
    next();
  }, "run");
  const enqueue = /* @__PURE__ */ __name((fn, resolve2, args) => {
    queue.enqueue(run.bind(void 0, fn, resolve2, args));
    (async () => {
      await Promise.resolve();
      if (activeCount < concurrency && queue.size > 0) {
        queue.dequeue()();
      }
    })();
  }, "enqueue");
  const generator = /* @__PURE__ */ __name((fn, ...args) => new Promise((resolve2) => {
    enqueue(fn, resolve2, args);
  }), "generator");
  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount
    },
    pendingCount: {
      get: () => queue.size
    },
    clearQueue: {
      value: () => {
        queue.clear();
      }
    }
  });
  return generator;
}
__name(pLimit, "pLimit");

// node_modules/.pnpm/p-locate@6.0.0/node_modules/p-locate/index.js
var EndError = class EndError2 extends Error {
  static {
    __name(this, "EndError");
  }
  constructor(value) {
    super();
    this.value = value;
  }
};
var testElement = /* @__PURE__ */ __name(async (element, tester) => tester(await element), "testElement");
var finder = /* @__PURE__ */ __name(async (element) => {
  const values = await Promise.all(element);
  if (values[1] === true) {
    throw new EndError(values[0]);
  }
  return false;
}, "finder");
async function pLocate(iterable, tester, { concurrency = Number.POSITIVE_INFINITY, preserveOrder = true } = {}) {
  const limit = pLimit(concurrency);
  const items = [
    ...iterable
  ].map((element) => [
    element,
    limit(testElement, element, tester)
  ]);
  const checkLimit = pLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);
  try {
    await Promise.all(items.map((element) => checkLimit(finder, element)));
  } catch (error) {
    if (error instanceof EndError) {
      return error.value;
    }
    throw error;
  }
}
__name(pLocate, "pLocate");

// node_modules/.pnpm/locate-path@7.2.0/node_modules/locate-path/index.js
var typeMappings = {
  directory: "isDirectory",
  file: "isFile"
};
function checkType(type) {
  if (Object.hasOwnProperty.call(typeMappings, type)) {
    return;
  }
  throw new Error(`Invalid type specified: ${type}`);
}
__name(checkType, "checkType");
var matchType = /* @__PURE__ */ __name((type, stat) => stat[typeMappings[type]](), "matchType");
var toPath = /* @__PURE__ */ __name((urlOrPath) => urlOrPath instanceof URL ? (0, import_node_url.fileURLToPath)(urlOrPath) : urlOrPath, "toPath");
async function locatePath(paths, { cwd = import_node_process.default.cwd(), type = "file", allowSymlinks = true, concurrency, preserveOrder } = {}) {
  checkType(type);
  cwd = toPath(cwd);
  const statFunction = allowSymlinks ? import_node_fs.promises.stat : import_node_fs.promises.lstat;
  return pLocate(paths, async (path_) => {
    try {
      const stat = await statFunction(import_node_path.default.resolve(cwd, path_));
      return matchType(type, stat);
    } catch {
      return false;
    }
  }, {
    concurrency,
    preserveOrder
  });
}
__name(locatePath, "locatePath");

// node_modules/.pnpm/unicorn-magic@0.1.0/node_modules/unicorn-magic/node.js
var import_node_url2 = require("url");
function toPath2(urlOrPath) {
  return urlOrPath instanceof URL ? (0, import_node_url2.fileURLToPath)(urlOrPath) : urlOrPath;
}
__name(toPath2, "toPath");

// node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js
var import_node_fs2 = __toESM(require("fs"), 1);

// node_modules/.pnpm/find-up@7.0.0/node_modules/find-up/index.js
var findUpStop = Symbol("findUpStop");
async function findUpMultiple(name, options = {}) {
  let directory = import_node_path2.default.resolve(toPath2(options.cwd) ?? "");
  const { root } = import_node_path2.default.parse(directory);
  const stopAt = import_node_path2.default.resolve(directory, toPath2(options.stopAt ?? root));
  const limit = options.limit ?? Number.POSITIVE_INFINITY;
  const paths = [
    name
  ].flat();
  const runMatcher = /* @__PURE__ */ __name(async (locateOptions) => {
    if (typeof name !== "function") {
      return locatePath(paths, locateOptions);
    }
    const foundPath = await name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePath([
        foundPath
      ], locateOptions);
    }
    return foundPath;
  }, "runMatcher");
  const matches = [];
  while (true) {
    const foundPath = await runMatcher({
      ...options,
      cwd: directory
    });
    if (foundPath === findUpStop) {
      break;
    }
    if (foundPath) {
      matches.push(import_node_path2.default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = import_node_path2.default.dirname(directory);
  }
  return matches;
}
__name(findUpMultiple, "findUpMultiple");
async function findUp(name, options = {}) {
  const matches = await findUpMultiple(name, {
    ...options,
    limit: 1
  });
  return matches[0];
}
__name(findUp, "findUp");

// src/detect.ts
var AGENTS = [
  "pnpm",
  "yarn",
  "npm",
  "pnpm@6",
  "yarn@berry",
  "bun"
];
var LOCKS = {
  "bun.lockb": "bun",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm"
};
async function detectPackageManager(cwd = import_node_process2.default.cwd()) {
  let agent = null;
  const lockPath = await findUp(Object.keys(LOCKS), {
    cwd
  });
  let packageJsonPath;
  if (lockPath)
    packageJsonPath = import_node_path3.default.resolve(lockPath, "../package.json");
  else
    packageJsonPath = await findUp("package.json", {
      cwd
    });
  if (packageJsonPath && import_node_fs3.default.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(import_node_fs3.default.readFileSync(packageJsonPath, "utf8"));
      if (typeof pkg.packageManager === "string") {
        const [name, version] = pkg.packageManager.split("@");
        if (name === "yarn" && Number.parseInt(version) > 1)
          agent = "yarn@berry";
        else if (name === "pnpm" && Number.parseInt(version) < 7)
          agent = "pnpm@6";
        else if (AGENTS.includes(name))
          agent = name;
        else
          console.warn("[ni] Unknown packageManager:", pkg.packageManager);
      }
    } catch {
    }
  }
  if (!agent && lockPath)
    agent = LOCKS[import_node_path3.default.basename(lockPath)];
  return agent;
}
__name(detectPackageManager, "detectPackageManager");

// src/install.ts
var import_node_fs4 = require("fs");
var import_node_process3 = __toESM(require("process"), 1);
var import_node_path4 = require("path");
var import_ez_spawn = require("@jsdevtools/ez-spawn");
async function installPackage(names, options = {}) {
  const detectedAgent = options.packageManager || await detectPackageManager(options.cwd) || "npm";
  const [agent] = detectedAgent.split("@");
  if (!Array.isArray(names))
    names = [
      names
    ];
  const args = options.additionalArgs || [];
  if (options.preferOffline) {
    if (detectedAgent === "yarn@berry")
      args.unshift("--cached");
    else
      args.unshift("--prefer-offline");
  }
  if (agent === "pnpm" && (0, import_node_fs4.existsSync)((0, import_node_path4.resolve)(options.cwd ?? import_node_process3.default.cwd(), "pnpm-workspace.yaml")))
    args.unshift("-w");
  return (0, import_ez_spawn.async)(agent, [
    agent === "yarn" ? "add" : "install",
    options.dev ? "-D" : "",
    ...args,
    ...names
  ].filter(Boolean), {
    stdio: options.silent ? "ignore" : "inherit",
    cwd: options.cwd
  });
}
__name(installPackage, "installPackage");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  detectPackageManager,
  installPackage
});
