
/* 
 * Copyright (C) 2025 Alaa-eddine KADDOURI
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import * as acorn from 'acorn';
import * as astring from 'astring';
import * as walk from 'acorn-walk';

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
const JS_GLOBAL_LITERALS = /* @__PURE__ */ new Set([
  "Infinity",
  "NaN",
  "undefined",
  "null",
  "true",
  "false"
]);
const JS_GLOBAL_OBJECTS = /* @__PURE__ */ new Set([
  "Math",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Date",
  "RegExp",
  "Error",
  "JSON",
  "Promise",
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  "Symbol",
  "BigInt",
  "Proxy",
  "Reflect",
  "console",
  "isNaN",
  "isFinite",
  "parseInt",
  "parseFloat",
  "encodeURI",
  "decodeURI",
  "encodeURIComponent",
  "decodeURIComponent"
]);
class ScopeManager {
  constructor() {
    __publicField$9(this, "scopes", []);
    __publicField$9(this, "scopeTypes", []);
    __publicField$9(this, "scopeCounts", /* @__PURE__ */ new Map());
    __publicField$9(this, "contextBoundVars", /* @__PURE__ */ new Set());
    __publicField$9(this, "arrayPatternElements", /* @__PURE__ */ new Set());
    __publicField$9(this, "rootParams", /* @__PURE__ */ new Set());
    __publicField$9(this, "localSeriesVars", /* @__PURE__ */ new Set());
    __publicField$9(this, "varKinds", /* @__PURE__ */ new Map());
    __publicField$9(this, "loopVars", /* @__PURE__ */ new Set());
    __publicField$9(this, "loopVarNames", /* @__PURE__ */ new Map());
    // Map original names to transformed names
    __publicField$9(this, "paramIdCounter", 0);
    __publicField$9(this, "cacheIdCounter", 0);
    __publicField$9(this, "tempVarCounter", 0);
    __publicField$9(this, "taCallIdCounter", 0);
    __publicField$9(this, "hoistingStack", []);
    __publicField$9(this, "suppressHoisting", false);
    this.pushScope("glb");
  }
  get nextParamIdArg() {
    return {
      type: "Identifier",
      name: `'p${this.paramIdCounter++}'`
    };
  }
  get nextCacheIdArg() {
    return {
      type: "Identifier",
      name: `'cache_${this.cacheIdCounter++}'`
    };
  }
  getNextTACallId() {
    return {
      type: "Literal",
      value: `_ta${this.taCallIdCounter++}`
    };
  }
  pushScope(type) {
    this.scopes.push(/* @__PURE__ */ new Map());
    this.scopeTypes.push(type);
    this.scopeCounts.set(type, (this.scopeCounts.get(type) || 0) + 1);
  }
  popScope() {
    this.scopes.pop();
    this.scopeTypes.pop();
  }
  getCurrentScopeType() {
    return this.scopeTypes[this.scopeTypes.length - 1];
  }
  getCurrentScopeCount() {
    return this.scopeCounts.get(this.getCurrentScopeType()) || 1;
  }
  addLocalSeriesVar(name) {
    this.localSeriesVars.add(name);
  }
  isLocalSeriesVar(name) {
    return this.localSeriesVars.has(name);
  }
  addContextBoundVar(name, isRootParam = false) {
    this.contextBoundVars.add(name);
    if (isRootParam) {
      this.rootParams.add(name);
    }
  }
  removeContextBoundVar(name) {
    if (this.contextBoundVars.has(name)) {
      this.contextBoundVars.delete(name);
      if (this.rootParams.has(name)) {
        this.rootParams.delete(name);
      }
    }
  }
  addArrayPatternElement(name) {
    this.arrayPatternElements.add(name);
  }
  isContextBound(name) {
    if (JS_GLOBAL_LITERALS.has(name) || JS_GLOBAL_OBJECTS.has(name)) {
      return false;
    }
    return this.contextBoundVars.has(name);
  }
  isArrayPatternElement(name) {
    return this.arrayPatternElements.has(name);
  }
  isRootParam(name) {
    return this.rootParams.has(name);
  }
  addLoopVariable(originalName, transformedName) {
    this.loopVars.add(originalName);
    this.loopVarNames.set(originalName, transformedName);
  }
  getLoopVariableName(name) {
    return this.loopVarNames.get(name);
  }
  isLoopVariable(name) {
    return this.loopVars.has(name);
  }
  addVariable(name, kind) {
    if (this.isContextBound(name)) {
      return name;
    }
    const currentScope = this.scopes[this.scopes.length - 1];
    const scopeType = this.scopeTypes[this.scopeTypes.length - 1];
    const scopeCount = this.scopeCounts.get(scopeType) || 1;
    const newName = `${scopeType}${scopeCount}_${name}`;
    currentScope.set(name, newName);
    this.varKinds.set(newName, kind);
    return newName;
  }
  getVariable(name) {
    if (this.loopVars.has(name)) {
      const transformedName = this.loopVarNames.get(name);
      if (transformedName) {
        return [transformedName, "let"];
      }
    }
    if (this.isContextBound(name)) {
      return [name, "let"];
    }
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const scope = this.scopes[i];
      if (scope.has(name)) {
        const scopedName = scope.get(name);
        const kind = this.varKinds.get(scopedName) || "let";
        return [scopedName, kind];
      }
    }
    return [name, "let"];
  }
  generateTempVar() {
    return `temp_${++this.tempVarCounter}`;
  }
  // Hoisting Logic
  enterHoistingScope() {
    this.hoistingStack.push([]);
  }
  exitHoistingScope() {
    return this.hoistingStack.pop() || [];
  }
  addHoistedStatement(stmt) {
    if (this.hoistingStack.length > 0 && !this.suppressHoisting) {
      this.hoistingStack[this.hoistingStack.length - 1].push(stmt);
    }
  }
  setSuppressHoisting(suppress) {
    this.suppressHoisting = suppress;
  }
  shouldSuppressHoisting() {
    return this.suppressHoisting;
  }
  // Param ID Generator Helper (for hoisting)
  generateParamId() {
    return `p${this.paramIdCounter++}`;
  }
}

const CONTEXT_NAME = "$";
const ASTFactory = {
  createIdentifier(name) {
    return {
      type: "Identifier",
      name
    };
  },
  createLiteral(value) {
    return {
      type: "Literal",
      value
    };
  },
  createMemberExpression(object, property, computed = false) {
    return {
      type: "MemberExpression",
      object,
      property,
      computed
    };
  },
  createContextIdentifier() {
    return this.createIdentifier(CONTEXT_NAME);
  },
  // Create $.kind.name
  createContextVariableReference(kind, name) {
    const context = this.createContextIdentifier();
    const kindId = this.createIdentifier(kind);
    const nameId = this.createIdentifier(name);
    return this.createMemberExpression(this.createMemberExpression(context, kindId, false), nameId, false);
  },
  // Create $.get($.kind.name, 0)
  createContextVariableAccess0(kind, name) {
    const varRef = this.createContextVariableReference(kind, name);
    return this.createGetCall(varRef, 0);
  },
  createArrayAccess(object, index) {
    const indexNode = typeof index === "number" ? this.createLiteral(index) : index;
    return this.createMemberExpression(object, indexNode, true);
  },
  createCallExpression(callee, args) {
    return {
      type: "CallExpression",
      callee,
      arguments: args
    };
  },
  createAssignmentExpression(left, right, operator = "=") {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right
    };
  },
  createExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression
    };
  },
  createInitCall(targetVarRef, value, lookbehind) {
    const initMethod = this.createMemberExpression(this.createContextIdentifier(), this.createIdentifier("init"), false);
    const args = [targetVarRef, value];
    if (lookbehind) {
      args.push(lookbehind);
    }
    return this.createCallExpression(initMethod, args);
  },
  createInitVarCall(targetVarRef, value) {
    const initMethod = this.createMemberExpression(this.createContextIdentifier(), this.createIdentifier("initVar"), false);
    const args = [targetVarRef, value];
    return this.createCallExpression(initMethod, args);
  },
  // Create $.get(source, index)
  createGetCall(source, index) {
    const getMethod = this.createMemberExpression(this.createContextIdentifier(), this.createIdentifier("get"), false);
    const indexNode = typeof index === "number" ? this.createLiteral(index) : index;
    return this.createCallExpression(getMethod, [source, indexNode]);
  },
  // Create $.set(target, value)
  createSetCall(target, value) {
    const setMethod = this.createMemberExpression(this.createContextIdentifier(), this.createIdentifier("set"), false);
    return this.createCallExpression(setMethod, [target, value]);
  },
  // Create $.math.__eq(left, right)
  createMathEqCall(left, right) {
    const mathObj = this.createMemberExpression(this.createContextIdentifier(), this.createIdentifier("math"), false);
    const eqMethod = this.createMemberExpression(mathObj, this.createIdentifier("__eq"), false);
    return this.createCallExpression(eqMethod, [left, right]);
  },
  createWrapperFunction(body) {
    return {
      type: "FunctionDeclaration",
      id: null,
      params: [this.createIdentifier("context")],
      body: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: body
          }
        ]
      }
    };
  },
  createVariableDeclaration(name, init) {
    return {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: this.createIdentifier(name),
          init
        }
      ]
    };
  }
};

function injectImplicitImports(ast) {
  let mainBody = null;
  let contextParamName = CONTEXT_NAME;
  if (ast.type === "Program" && ast.body.length > 0) {
    const firstStmt = ast.body[0];
    if (firstStmt.type === "ExpressionStatement" && (firstStmt.expression.type === "ArrowFunctionExpression" || firstStmt.expression.type === "FunctionExpression")) {
      const fn = firstStmt.expression;
      if (fn.body.type === "BlockStatement") {
        mainBody = fn.body.body;
        if (fn.params.length > 0 && fn.params[0].type === "Identifier") {
          contextParamName = fn.params[0].name;
        }
      }
    }
  }
  if (!mainBody) return;
  const declaredVars = /* @__PURE__ */ new Set();
  const usedIdentifiers = /* @__PURE__ */ new Set();
  const addDeclared = (pattern) => {
    if (pattern.type === "Identifier") {
      declaredVars.add(pattern.name);
    } else if (pattern.type === "ObjectPattern") {
      pattern.properties.forEach((p) => addDeclared(p.value));
    } else if (pattern.type === "ArrayPattern") {
      pattern.elements.forEach((e) => {
        if (e) addDeclared(e);
      });
    }
  };
  walk.recursive(
    ast,
    {},
    {
      VariableDeclarator(node, state, c) {
        addDeclared(node.id);
        if (node.init) c(node.init, state);
      },
      FunctionDeclaration(node, state, c) {
        addDeclared(node.id);
        c(node.body, state);
      },
      Identifier(node, state, c) {
        usedIdentifiers.add(node.name);
      },
      MemberExpression(node, state, c) {
        c(node.object, state);
        if (node.computed) {
          c(node.property, state);
        }
      },
      Property(node, state, c) {
        if (node.computed) {
          c(node.key, state);
        }
        c(node.value, state);
      }
    }
  );
  mainBody.forEach((stmt) => {
    if (stmt.type === "VariableDeclaration") {
      stmt.declarations.forEach((d) => addDeclared(d.id));
    } else if (stmt.type === "FunctionDeclaration") {
      addDeclared(stmt.id);
    }
  });
  const contextDataVars = ["open", "high", "low", "close", "volume", "hl2", "hlc3", "ohlc4", "openTime", "closeTime"];
  const contextPineVars = [
    "input",
    "ta",
    "math",
    "request",
    "array",
    "na",
    "plotchar",
    "color",
    "plot",
    "nz",
    "strategy",
    "library",
    "str",
    "box",
    "line",
    "label",
    "table",
    "map",
    "matrix"
  ];
  const missingDataVars = contextDataVars.filter((v) => !declaredVars.has(v));
  const missingPineVars = contextPineVars.filter((v) => !declaredVars.has(v));
  const neededDataVars = missingDataVars.filter((v) => usedIdentifiers.has(v));
  const neededPineVars = missingPineVars.filter((v) => usedIdentifiers.has(v));
  const injections = [];
  if (neededDataVars.length > 0) {
    injections.push({
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "ObjectPattern",
            properties: neededDataVars.map((name) => ({
              type: "Property",
              key: { type: "Identifier", name },
              value: { type: "Identifier", name },
              kind: "init",
              shorthand: true
            }))
          },
          init: {
            type: "MemberExpression",
            object: { type: "Identifier", name: contextParamName },
            property: { type: "Identifier", name: "data" },
            computed: false
          }
        }
      ]
    });
  }
  if (neededPineVars.length > 0) {
    injections.push({
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "ObjectPattern",
            properties: neededPineVars.map((name) => ({
              type: "Property",
              key: { type: "Identifier", name },
              value: { type: "Identifier", name },
              kind: "init",
              shorthand: true
            }))
          },
          init: {
            type: "MemberExpression",
            object: { type: "Identifier", name: contextParamName },
            property: { type: "Identifier", name: "pine" },
            computed: false
          }
        }
      ]
    });
  }
  if (injections.length > 0) {
    mainBody.unshift(...injections);
  }
}

function normalizeNativeImports(ast) {
  let mainBody = null;
  let contextParamName = CONTEXT_NAME;
  if (ast.type === "Program" && ast.body.length > 0) {
    const firstStmt = ast.body[0];
    if (firstStmt.type === "ExpressionStatement" && (firstStmt.expression.type === "ArrowFunctionExpression" || firstStmt.expression.type === "FunctionExpression")) {
      const fn = firstStmt.expression;
      if (fn.body.type === "BlockStatement") {
        mainBody = fn.body.body;
        if (fn.params.length > 0 && fn.params[0].type === "Identifier") {
          contextParamName = fn.params[0].name;
        }
      }
    }
  }
  if (!mainBody) return;
  const contextDataVars = /* @__PURE__ */ new Set(["open", "high", "low", "close", "volume", "hl2", "hlc3", "ohlc4", "openTime", "closeTime"]);
  const contextPineVars = /* @__PURE__ */ new Set([
    "input",
    "ta",
    "math",
    "request",
    "array",
    "na",
    "plotchar",
    "color",
    "plot",
    "nz",
    "strategy",
    "library",
    "str",
    "box",
    "line",
    "label",
    "table",
    "map",
    "matrix"
  ]);
  const contextCoreVars = /* @__PURE__ */ new Set(["na", "nz", "plot", "plotchar", "color"]);
  const renames = /* @__PURE__ */ new Map();
  mainBody.forEach((stmt) => {
    if (stmt.type === "VariableDeclaration") {
      stmt.declarations.forEach((decl) => {
        if (decl.init && decl.init.type === "MemberExpression" && decl.init.object.type === "Identifier" && decl.init.object.name === contextParamName && decl.init.property.type === "Identifier") {
          const sourceName = decl.init.property.name;
          let validNames = null;
          if (sourceName === "data") {
            validNames = contextDataVars;
          } else if (sourceName === "pine") {
            validNames = contextPineVars;
          } else if (sourceName === "core") {
            validNames = contextCoreVars;
          }
          if (validNames && decl.id.type === "ObjectPattern") {
            decl.id.properties.forEach((prop) => {
              if (prop.type === "Property" && prop.key.type === "Identifier" && prop.value.type === "Identifier") {
                const originalName = prop.key.name;
                const aliasName = prop.value.name;
                if (validNames.has(originalName) && originalName !== aliasName) {
                  renames.set(aliasName, originalName);
                  prop.value.name = originalName;
                  prop.shorthand = true;
                }
              }
            });
          } else if (decl.id.type === "Identifier") {
            const validSingletonNames = ["ta", "math", "input", "request", "array"];
            if (validSingletonNames.includes(sourceName)) {
              const originalName = sourceName;
              const aliasName = decl.id.name;
              if (originalName !== aliasName) {
                renames.set(aliasName, originalName);
                decl.id.name = originalName;
              }
            }
          }
        }
      });
    }
  });
  if (renames.size > 0) {
    walk.recursive(
      ast,
      {},
      {
        Identifier(node) {
          if (renames.has(node.name)) {
            node.name = renames.get(node.name);
          }
        },
        // Prevent renaming of non-computed property keys
        MemberExpression(node, state, c) {
          c(node.object, state);
          if (node.computed) {
            c(node.property, state);
          }
        },
        Property(node, state, c) {
          if (node.computed) {
            c(node.key, state);
          }
          c(node.value, state);
        }
      }
    );
  }
}

function isWrappedInFunction(code) {
  try {
    const ast = acorn.parse(code, {
      ecmaVersion: "latest",
      sourceType: "module"
    });
    if (ast.type === "Program" && ast.body.length === 1) {
      const firstStatement = ast.body[0];
      if (firstStatement.type === "ExpressionStatement") {
        const expr = firstStatement.expression;
        if (expr.type === "ArrowFunctionExpression" || expr.type === "FunctionExpression") {
          return true;
        }
      }
      if (firstStatement.type === "FunctionDeclaration") {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}
function wrapInContextFunction(code) {
  code = code.trim();
  if (isWrappedInFunction(code)) {
    return code;
  }
  return `(context) => {
${code}
}`;
}

function transformNestedArrowFunctions(ast) {
  walk.recursive(ast, null, {
    VariableDeclaration(node, state, c) {
      if (node.declarations && node.declarations.length > 0) {
        const declarations = node.declarations;
        declarations.forEach((decl) => {
          if (decl.init && decl.init.type === "ArrowFunctionExpression") {
            const isRootFunction = decl.init.start === 0;
            if (!isRootFunction) {
              const functionDeclaration = {
                type: "FunctionDeclaration",
                id: decl.id,
                // Use the variable name as function name
                params: decl.init.params,
                body: decl.init.body.type === "BlockStatement" ? decl.init.body : {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: decl.init.body
                    }
                  ]
                },
                async: decl.init.async,
                generator: false
              };
              Object.assign(node, functionDeclaration);
            }
          }
        });
      }
      if (node.body && node.body.body) {
        node.body.body.forEach((stmt) => c(stmt, state));
      }
    }
  });
}
function preProcessContextBoundVars(ast, scopeManager) {
  walk.simple(ast, {
    VariableDeclaration(node) {
      node.declarations.forEach((decl) => {
        const isContextProperty = decl.init && decl.init.type === "MemberExpression" && decl.init.object && (decl.init.object.name === "context" || decl.init.object.name === CONTEXT_NAME || decl.init.object.name === "context2");
        const isSubContextProperty = decl.init && decl.init.type === "MemberExpression" && decl.init.object?.object && (decl.init.object.object.name === "context" || decl.init.object.object.name === CONTEXT_NAME || decl.init.object.object.name === "context2");
        if (isContextProperty || isSubContextProperty) {
          if (decl.id.name) {
            scopeManager.addContextBoundVar(decl.id.name);
          }
          if (decl.id.properties) {
            decl.id.properties.forEach((property) => {
              if (property.key.name) {
                scopeManager.addContextBoundVar(property.key.name);
              }
            });
          }
        }
      });
    }
  });
}
function transformArrowFunctionParams(node, scopeManager, isRootFunction = false) {
  node.params.forEach((param) => {
    if (param.type === "Identifier") {
      scopeManager.addContextBoundVar(param.name, isRootFunction);
    }
  });
}
function registerFunctionParameters(node, scopeManager) {
  node.params.forEach((param) => {
    if (param.type === "Identifier") {
      scopeManager.addContextBoundVar(param.name, false);
    }
  });
}
function runAnalysisPass(ast, scopeManager) {
  let originalParamName;
  walk.simple(ast, {
    FunctionDeclaration(node) {
      registerFunctionParameters(node, scopeManager);
    },
    ArrowFunctionExpression(node) {
      const isRootFunction = node.start === 0;
      if (isRootFunction && node.params && node.params.length > 0) {
        originalParamName = node.params[0].name;
        node.params[0].name = CONTEXT_NAME;
      }
      transformArrowFunctionParams(node, scopeManager, isRootFunction);
    },
    VariableDeclaration(node) {
      node.declarations.forEach((decl) => {
        if (decl.id.type === "ArrayPattern") {
          const tempVarName = scopeManager.generateTempVar();
          const tempVarDecl = {
            type: "VariableDeclaration",
            kind: node.kind,
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name: tempVarName
                },
                init: decl.init
              }
            ]
          };
          decl.id.elements?.forEach((element) => {
            if (element.type === "Identifier") {
              scopeManager.addArrayPatternElement(element.name);
            }
          });
          const individualDecls = decl.id.elements.map((element, index) => ({
            type: "VariableDeclaration",
            kind: node.kind,
            declarations: [
              {
                type: "VariableDeclarator",
                id: element,
                init: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: tempVarName
                  },
                  property: {
                    type: "Literal",
                    value: index
                  },
                  computed: true
                }
              }
            ]
          }));
          Object.assign(node, {
            type: "BlockStatement",
            body: [tempVarDecl, ...individualDecls]
          });
        }
      });
    },
    ForStatement(node) {
    }
  });
  return originalParamName;
}

const UNDEFINED_ARG = {
  type: "Identifier",
  name: "undefined"
};
function transformArrayIndex(node, scopeManager) {
  if (node.computed && node.property.type === "Identifier") {
    if (scopeManager.isLoopVariable(node.property.name)) {
      if (node.object.type === "Identifier" && !scopeManager.isLoopVariable(node.object.name)) {
        if (!scopeManager.isContextBound(node.object.name)) {
          const [scopedName, kind] = scopeManager.getVariable(node.object.name);
          const contextVarRef = ASTFactory.createContextVariableReference(kind, scopedName);
          const getCall = ASTFactory.createGetCall(contextVarRef, node.property);
          Object.assign(node, getCall);
          node._indexTransformed = true;
        }
      }
      return;
    }
    if (!scopeManager.isContextBound(node.property.name)) {
      const [scopedName, kind] = scopeManager.getVariable(node.property.name);
      node.property = ASTFactory.createContextVariableReference(kind, scopedName);
      node.property = ASTFactory.createGetCall(node.property, 0);
    }
  }
  if (node.computed && node.object.type === "Identifier") {
    if (scopeManager.isLoopVariable(node.object.name)) {
      return;
    }
    if (!scopeManager.isContextBound(node.object.name)) {
      const [scopedName, kind] = scopeManager.getVariable(node.object.name);
      node.object = ASTFactory.createContextVariableReference(kind, scopedName);
    }
    if (node.property.type === "MemberExpression") {
      const memberNode = node.property;
      if (!memberNode._indexTransformed) {
        transformArrayIndex(memberNode, scopeManager);
        memberNode._indexTransformed = true;
      }
    }
  }
}
function addArrayAccess(node, scopeManager) {
  const memberExpr = ASTFactory.createGetCall(ASTFactory.createIdentifier(node.name), 0);
  if (node.start !== void 0) memberExpr.start = node.start;
  if (node.end !== void 0) memberExpr.end = node.end;
  memberExpr._indexTransformed = true;
  Object.assign(node, memberExpr);
}
function transformIdentifier(node, scopeManager) {
  if (node.name !== CONTEXT_NAME) {
    if (node.name === "na") {
      const isFunctionCall2 = node.parent && node.parent.type === "CallExpression" && node.parent.callee === node;
      if (!isFunctionCall2) {
        node.name = "NaN";
        return;
      }
    }
    if (node.name === "Math" || node.name === "NaN" || node.name === "undefined" || node.name === "Infinity" || node.name === "null" || node.name.startsWith("'") && node.name.endsWith("'") || node.name.startsWith('"') && node.name.endsWith('"') || node.name.startsWith("`") && node.name.endsWith("`")) {
      return;
    }
    if (scopeManager.isLoopVariable(node.name)) {
      return;
    }
    if (scopeManager.isContextBound(node.name) && !scopeManager.isRootParam(node.name)) {
      return;
    }
    const isNamespaceMember = node.parent && node.parent.type === "MemberExpression" && node.parent.object === node && scopeManager.isContextBound(node.name);
    const isParamCall = node.parent && node.parent.type === "CallExpression" && node.parent.callee && node.parent.callee.type === "MemberExpression" && node.parent.callee.property.name === "param";
    node.parent && node.parent.type === "AssignmentExpression" && node.parent.left === node;
    let isSeriesFunctionArg = false;
    if (node.parent && node.parent.type === "CallExpression" && node.parent.arguments.includes(node)) {
      const callee = node.parent.callee;
      const isContextMethod = callee.type === "MemberExpression" && callee.object && callee.object.name === CONTEXT_NAME && ["get", "set", "init", "param"].includes(callee.property.name);
      if (isContextMethod) {
        const argIndex = node.parent.arguments.indexOf(node);
        if (argIndex === 0) {
          isSeriesFunctionArg = true;
        }
      } else {
        isSeriesFunctionArg = true;
      }
    }
    const isArrayAccess = node.parent && node.parent.type === "MemberExpression" && node.parent.computed;
    const isArrayIndexInNamespaceCall = node.parent && node.parent.type === "MemberExpression" && node.parent.computed && node.parent.property === node && node.parent.parent && node.parent.parent.type === "CallExpression" && node.parent.parent.callee && node.parent.parent.callee.type === "MemberExpression" && scopeManager.isContextBound(node.parent.parent.callee.object.name);
    const isFunctionCall = node.parent && node.parent.type === "CallExpression" && node.parent.callee === node;
    const hasArrayAccess = node.parent && node.parent.type === "MemberExpression" && node.parent.computed && node.parent.object === node;
    if (isNamespaceMember || isParamCall || isSeriesFunctionArg || isArrayIndexInNamespaceCall || isFunctionCall) {
      if (isFunctionCall) {
        return;
      }
      if (scopeManager.isLocalSeriesVar(node.name)) {
        return;
      }
      const [scopedName2, kind2] = scopeManager.getVariable(node.name);
      const memberExpr2 = ASTFactory.createContextVariableReference(kind2, scopedName2);
      Object.assign(node, memberExpr2);
      return;
    }
    if (scopeManager.isLocalSeriesVar(node.name)) {
      if (!hasArrayAccess && !isArrayAccess) {
        const memberExpr2 = ASTFactory.createIdentifier(node.name);
        const accessExpr = ASTFactory.createGetCall(memberExpr2, 0);
        Object.assign(node, accessExpr);
      }
      return;
    }
    const [scopedName, kind] = scopeManager.getVariable(node.name);
    const memberExpr = ASTFactory.createContextVariableReference(kind, scopedName);
    if (!hasArrayAccess && !isArrayAccess) {
      const accessExpr = ASTFactory.createGetCall(memberExpr, 0);
      Object.assign(node, accessExpr);
    } else {
      Object.assign(node, memberExpr);
    }
  }
}
function transformMemberExpression(memberNode, originalParamName, scopeManager) {
  if (memberNode.object && memberNode.object.type === "Identifier" && memberNode.object.name === "Math") {
    return;
  }
  const KNOWN_NAMESPACES = ["ta", "math", "request", "array", "input"];
  const isDirectNamespaceMemberAccess = memberNode.object && memberNode.object.type === "Identifier" && KNOWN_NAMESPACES.includes(memberNode.object.name) && scopeManager.isContextBound(memberNode.object.name) && !memberNode.computed;
  if (isDirectNamespaceMemberAccess) {
    const isAlreadyBeingCalled = memberNode.parent && memberNode.parent.type === "CallExpression" && memberNode.parent.callee === memberNode;
    const isInDestructuring = memberNode.parent && (memberNode.parent.type === "VariableDeclarator" || memberNode.parent.type === "Property" || memberNode.parent.type === "AssignmentExpression");
    if (!isAlreadyBeingCalled && !isInDestructuring) {
      const callExpr = {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: memberNode.object,
          property: memberNode.property,
          computed: false
        },
        arguments: [],
        _transformed: false
        // Allow further transformation of this call
      };
      if (memberNode.start !== void 0) callExpr.start = memberNode.start;
      if (memberNode.end !== void 0) callExpr.end = memberNode.end;
      Object.assign(memberNode, callExpr);
      return;
    }
  }
  const isIfStatement = scopeManager.getCurrentScopeType() == "if";
  const isElseStatement = scopeManager.getCurrentScopeType() == "els";
  const isForStatement = scopeManager.getCurrentScopeType() == "for";
  if (!isIfStatement && !isElseStatement && !isForStatement && memberNode.object && memberNode.object.type === "Identifier" && scopeManager.isContextBound(memberNode.object.name) && !scopeManager.isRootParam(memberNode.object.name) && !memberNode.computed) {
    return;
  }
  if (!memberNode._indexTransformed) {
    transformArrayIndex(memberNode, scopeManager);
    memberNode._indexTransformed = true;
  }
  const isContextMemberAccess = memberNode.object && memberNode.object.type === "MemberExpression" && memberNode.object.object && memberNode.object.object.type === "MemberExpression" && memberNode.object.object.object && memberNode.object.object.object.name === CONTEXT_NAME;
  const isContextBoundIdentifier = memberNode.object && memberNode.object.type === "Identifier" && scopeManager.isContextBound(memberNode.object.name);
  if (memberNode.computed && (isContextMemberAccess || isContextBoundIdentifier)) {
    if (memberNode.parent && memberNode.parent.type === "AssignmentExpression" && memberNode.parent.left === memberNode) {
      return;
    }
    const getCall = ASTFactory.createGetCall(memberNode.object, memberNode.property);
    if (memberNode.start) getCall.start = memberNode.start;
    if (memberNode.end) getCall.end = memberNode.end;
    Object.assign(memberNode, getCall);
  }
}
function transformIdentifierForParam(node, scopeManager) {
  if (node.type === "Identifier") {
    if (node.name === "na") {
      node.name = "NaN";
      return node;
    }
    if (scopeManager.isLoopVariable(node.name)) {
      return node;
    }
    if (scopeManager.isRootParam(node.name)) {
      const [scopedName2, kind2] = scopeManager.getVariable(node.name);
      return ASTFactory.createContextVariableReference(kind2, scopedName2);
    }
    if (scopeManager.isContextBound(node.name)) {
      return node;
    }
    if (scopeManager.isLocalSeriesVar(node.name)) {
      return node;
    }
    const [scopedName, kind] = scopeManager.getVariable(node.name);
    if (scopedName === node.name && !scopeManager.isContextBound(node.name)) {
      return node;
    }
    return ASTFactory.createContextVariableReference(kind, scopedName);
  }
  return node;
}
function transformOperand(node, scopeManager, namespace = "") {
  switch (node.type) {
    case "BinaryExpression": {
      return getParamFromBinaryExpression(node, scopeManager, namespace);
    }
    case "MemberExpression": {
      const transformedObject = node.object.type === "Identifier" ? transformIdentifierForParam(node.object, scopeManager) : node.object;
      return {
        type: "MemberExpression",
        object: transformedObject,
        property: node.property,
        computed: node.computed
      };
    }
    case "Identifier": {
      if (scopeManager.isLoopVariable(node.name)) {
        return node;
      }
      const isMemberExprProperty = node.parent && node.parent.type === "MemberExpression" && node.parent.property === node;
      if (isMemberExprProperty) {
        return node;
      }
      const transformedObject = transformIdentifierForParam(node, scopeManager);
      if (transformedObject.type === "Identifier" && (transformedObject.name === "NaN" || transformedObject.name === "undefined" || transformedObject.name === "Infinity" || transformedObject.name === "null" || transformedObject.name === "Math")) {
        return transformedObject;
      }
      return ASTFactory.createGetCall(transformedObject, 0);
    }
    case "UnaryExpression": {
      return getParamFromUnaryExpression(node, scopeManager, namespace);
    }
    case "ConditionalExpression": {
      const transformedTest = transformOperand(node.test, scopeManager, namespace);
      const transformedConsequent = transformOperand(node.consequent, scopeManager, namespace);
      const transformedAlternate = transformOperand(node.alternate, scopeManager, namespace);
      return {
        type: "ConditionalExpression",
        test: transformedTest,
        consequent: transformedConsequent,
        alternate: transformedAlternate,
        start: node.start,
        end: node.end
      };
    }
  }
  return node;
}
function getParamFromBinaryExpression(node, scopeManager, namespace) {
  const transformedLeft = transformOperand(node.left, scopeManager, namespace);
  const transformedRight = transformOperand(node.right, scopeManager, namespace);
  const binaryExpr = {
    type: "BinaryExpression",
    operator: node.operator,
    left: transformedLeft,
    right: transformedRight,
    start: node.start,
    end: node.end
  };
  walk.recursive(binaryExpr, scopeManager, {
    CallExpression(node2, scopeManager2) {
      if (!node2._transformed) {
        transformCallExpression(node2, scopeManager2);
      }
    },
    MemberExpression(node2) {
      transformMemberExpression(node2, "", scopeManager);
    }
  });
  return binaryExpr;
}
function getParamFromLogicalExpression(node, scopeManager, namespace) {
  const transformedLeft = transformOperand(node.left, scopeManager, namespace);
  const transformedRight = transformOperand(node.right, scopeManager, namespace);
  const logicalExpr = {
    type: "LogicalExpression",
    operator: node.operator,
    left: transformedLeft,
    right: transformedRight,
    start: node.start,
    end: node.end
  };
  walk.recursive(logicalExpr, scopeManager, {
    CallExpression(node2, scopeManager2) {
      if (!node2._transformed) {
        transformCallExpression(node2, scopeManager2);
      }
    }
  });
  return logicalExpr;
}
function getParamFromConditionalExpression(node, scopeManager, namespace) {
  walk.recursive(
    node,
    { parent: node, inNamespaceCall: false },
    {
      Identifier(node2, state, c) {
        if (node2.name == "NaN") return;
        if (node2.name == "na") {
          node2.name = "NaN";
          return;
        }
        node2.parent = state.parent;
        transformIdentifier(node2, scopeManager);
        const isBinaryOperation = node2.parent && node2.parent.type === "BinaryExpression";
        const isConditional = node2.parent && node2.parent.type === "ConditionalExpression";
        if (isConditional || isBinaryOperation) {
          if (node2.type === "MemberExpression") {
            transformArrayIndex(node2, scopeManager);
          } else if (node2.type === "Identifier") {
            const isGetCall = node2.parent && node2.parent.type === "CallExpression" && node2.parent.callee && node2.parent.callee.object && node2.parent.callee.object.name === CONTEXT_NAME && node2.parent.callee.property.name === "get";
            if (!isGetCall) {
              addArrayAccess(node2);
            }
          }
        }
      },
      MemberExpression(node2, state, c) {
        transformArrayIndex(node2, scopeManager);
        if (node2.object) {
          c(node2.object, { parent: node2, inNamespaceCall: state.inNamespaceCall });
        }
      },
      ConditionalExpression(node2, state, c) {
        if (node2.test) {
          c(node2.test, { parent: node2, inNamespaceCall: state.inNamespaceCall });
        }
        if (node2.consequent) {
          c(node2.consequent, { parent: node2, inNamespaceCall: state.inNamespaceCall });
        }
        if (node2.alternate) {
          c(node2.alternate, { parent: node2, inNamespaceCall: state.inNamespaceCall });
        }
      },
      CallExpression(node2, state, c) {
        const isNamespaceCall = node2.callee && node2.callee.type === "MemberExpression" && node2.callee.object && node2.callee.object.type === "Identifier" && scopeManager.isContextBound(node2.callee.object.name);
        transformCallExpression(node2, scopeManager);
        node2.arguments.forEach((arg) => c(arg, { parent: node2, inNamespaceCall: isNamespaceCall || state.inNamespaceCall }));
      }
    }
  );
  const memberExpr = ASTFactory.createMemberExpression(ASTFactory.createIdentifier(namespace), ASTFactory.createIdentifier("param"));
  const nextParamId = scopeManager.generateParamId();
  const paramCall = {
    type: "CallExpression",
    callee: memberExpr,
    arguments: [node, UNDEFINED_ARG, { type: "Identifier", name: `'${nextParamId}'` }],
    _transformed: true,
    _isParamCall: true
  };
  if (!scopeManager.shouldSuppressHoisting()) {
    const tempVarName = nextParamId;
    scopeManager.addLocalSeriesVar(tempVarName);
    const variableDecl = ASTFactory.createVariableDeclaration(tempVarName, paramCall);
    scopeManager.addHoistedStatement(variableDecl);
    return ASTFactory.createIdentifier(tempVarName);
  }
  return paramCall;
}
function getParamFromUnaryExpression(node, scopeManager, namespace) {
  const transformedArgument = transformOperand(node.argument, scopeManager, namespace);
  const unaryExpr = {
    type: "UnaryExpression",
    operator: node.operator,
    prefix: node.prefix,
    argument: transformedArgument,
    start: node.start,
    end: node.end
  };
  return unaryExpr;
}
function transformFunctionArgument(arg, namespace, scopeManager) {
  switch (arg?.type) {
    case "BinaryExpression":
      arg = getParamFromBinaryExpression(arg, scopeManager, namespace);
      break;
    case "LogicalExpression":
      arg = getParamFromLogicalExpression(arg, scopeManager, namespace);
      break;
    case "ConditionalExpression":
      return getParamFromConditionalExpression(arg, scopeManager, namespace);
    case "UnaryExpression":
      arg = getParamFromUnaryExpression(arg, scopeManager, namespace);
      break;
    case "ArrayExpression":
      arg.elements = arg.elements.map((element) => {
        if (element.type === "Identifier") {
          if (scopeManager.isContextBound(element.name) && !scopeManager.isRootParam(element.name)) {
            return element;
          }
          const [scopedName, kind] = scopeManager.getVariable(element.name);
          return ASTFactory.createContextVariableAccess0(kind, scopedName);
        }
        return element;
      });
      break;
  }
  const isArrayAccess = arg.type === "MemberExpression" && arg.computed && arg.property;
  if (isArrayAccess) {
    const transformedObject = arg.object.type === "Identifier" && scopeManager.isContextBound(arg.object.name) && !scopeManager.isRootParam(arg.object.name) ? arg.object : transformIdentifierForParam(arg.object, scopeManager);
    const transformedProperty = arg.property.type === "Identifier" && !scopeManager.isContextBound(arg.property.name) && !scopeManager.isLoopVariable(arg.property.name) ? transformIdentifierForParam(arg.property, scopeManager) : arg.property;
    const memberExpr2 = ASTFactory.createMemberExpression(ASTFactory.createIdentifier(namespace), ASTFactory.createIdentifier("param"));
    const nextParamId2 = scopeManager.generateParamId();
    const paramCall2 = {
      type: "CallExpression",
      callee: memberExpr2,
      arguments: [transformedObject, transformedProperty, { type: "Identifier", name: `'${nextParamId2}'` }],
      _transformed: true,
      _isParamCall: true
    };
    if (!scopeManager.shouldSuppressHoisting()) {
      const tempVarName = nextParamId2;
      scopeManager.addLocalSeriesVar(tempVarName);
      const variableDecl = ASTFactory.createVariableDeclaration(tempVarName, paramCall2);
      scopeManager.addHoistedStatement(variableDecl);
      return ASTFactory.createIdentifier(tempVarName);
    }
    return paramCall2;
  }
  if (arg.type === "ObjectExpression") {
    arg.properties = arg.properties.map((prop) => {
      if (prop.value.name) {
        const [scopedName, kind] = scopeManager.getVariable(prop.value.name);
        return {
          type: "Property",
          key: {
            type: "Identifier",
            name: prop.key.name
          },
          value: ASTFactory.createContextVariableReference(kind, scopedName),
          kind: "init",
          method: false,
          shorthand: false,
          computed: false
        };
      }
      return prop;
    });
  }
  if (arg.type === "Identifier") {
    if (arg.name === "na") {
      arg.name = "NaN";
      return arg;
    }
    if (scopeManager.isContextBound(arg.name) && !scopeManager.isRootParam(arg.name)) {
      const memberExpr2 = ASTFactory.createMemberExpression(ASTFactory.createIdentifier(namespace), ASTFactory.createIdentifier("param"));
      const nextParamId2 = scopeManager.generateParamId();
      const paramCall2 = {
        type: "CallExpression",
        callee: memberExpr2,
        arguments: [arg, UNDEFINED_ARG, { type: "Identifier", name: `'${nextParamId2}'` }],
        _transformed: true,
        _isParamCall: true
      };
      if (!scopeManager.shouldSuppressHoisting()) {
        const tempVarName = nextParamId2;
        scopeManager.addLocalSeriesVar(tempVarName);
        const variableDecl = ASTFactory.createVariableDeclaration(tempVarName, paramCall2);
        scopeManager.addHoistedStatement(variableDecl);
        return ASTFactory.createIdentifier(tempVarName);
      }
      return paramCall2;
    }
  }
  if (arg?.type === "CallExpression") {
    transformCallExpression(arg, scopeManager);
  }
  const memberExpr = ASTFactory.createMemberExpression(ASTFactory.createIdentifier(namespace), ASTFactory.createIdentifier("param"));
  const transformedArg = arg.type === "Identifier" ? transformIdentifierForParam(arg, scopeManager) : arg;
  const nextParamId = scopeManager.generateParamId();
  const paramCall = {
    type: "CallExpression",
    callee: memberExpr,
    arguments: [transformedArg, UNDEFINED_ARG, { type: "Identifier", name: `'${nextParamId}'` }],
    _transformed: true,
    _isParamCall: true
  };
  if (!scopeManager.shouldSuppressHoisting()) {
    const tempVarName = nextParamId;
    scopeManager.addLocalSeriesVar(tempVarName);
    const variableDecl = ASTFactory.createVariableDeclaration(tempVarName, paramCall);
    scopeManager.addHoistedStatement(variableDecl);
    return ASTFactory.createIdentifier(tempVarName);
  }
  return paramCall;
}
function transformCallExpression(node, scopeManager, namespace) {
  if (node._transformed) {
    return;
  }
  const isNamespaceCall = node.callee && node.callee.type === "MemberExpression" && node.callee.object && node.callee.object.type === "Identifier" && (scopeManager.isContextBound(node.callee.object.name) || node.callee.object.name === "math" || node.callee.object.name === "ta");
  if (isNamespaceCall) {
    if (node.callee.object.name === CONTEXT_NAME && ["get", "init", "param"].includes(node.callee.property.name)) {
      return;
    }
    const namespace2 = node.callee.object.name;
    const newArgs = [];
    node.arguments.forEach((arg) => {
      if (arg._isParamCall) {
        newArgs.push(arg);
        return;
      }
      newArgs.push(transformFunctionArgument(arg, namespace2, scopeManager));
    });
    node.arguments = newArgs;
    if (namespace2 === "ta") {
      node.arguments.push(scopeManager.getNextTACallId());
    }
    if (!scopeManager.shouldSuppressHoisting()) {
      const tempVarName = scopeManager.generateTempVar();
      scopeManager.addLocalSeriesVar(tempVarName);
      const variableDecl = ASTFactory.createVariableDeclaration(tempVarName, Object.assign({}, node));
      scopeManager.addHoistedStatement(variableDecl);
      Object.assign(node, ASTFactory.createIdentifier(tempVarName));
      return;
    }
    node._transformed = true;
  } else if (node.callee && node.callee.type === "Identifier") {
    node.arguments = node.arguments.map((arg) => {
      if (arg._isParamCall) {
        return arg;
      }
      return transformFunctionArgument(arg, CONTEXT_NAME, scopeManager);
    });
    node._transformed = true;
  }
  node.arguments.forEach((arg) => {
    walk.recursive(
      arg,
      { parent: node },
      {
        Identifier(node2, state, c) {
          node2.parent = state.parent;
          transformIdentifier(node2, scopeManager);
          const isBinaryOperation = node2.parent && node2.parent.type === "BinaryExpression";
          const isConditional = node2.parent && node2.parent.type === "ConditionalExpression";
          if (isConditional || isBinaryOperation) {
            if (node2.type === "MemberExpression") {
              transformArrayIndex(node2, scopeManager);
            } else if (node2.type === "Identifier") {
              const isGetCall = node2.parent && node2.parent.type === "CallExpression" && node2.parent.callee && node2.parent.callee.object && node2.parent.callee.object.name === CONTEXT_NAME && node2.parent.callee.property.name === "get";
              if (!isGetCall) {
                addArrayAccess(node2);
              }
            }
          }
        },
        CallExpression(node2, state, c) {
          if (!node2._transformed) {
            transformCallExpression(node2, scopeManager);
          }
        },
        MemberExpression(node2, state, c) {
          transformMemberExpression(node2, "", scopeManager);
          if (node2.object) {
            c(node2.object, { parent: node2 });
          }
        }
      }
    );
  });
}

function transformAssignmentExpression(node, scopeManager) {
  let targetVarRef = null;
  if (node.left.type === "Identifier") {
    const [varName, kind] = scopeManager.getVariable(node.left.name);
    targetVarRef = ASTFactory.createContextVariableReference(kind, varName);
  } else if (node.left.type === "MemberExpression" && node.left.computed) {
    if (node.left.object.type === "Identifier") {
      const name = node.left.object.name;
      const [varName, kind] = scopeManager.getVariable(name);
      const isRenamed = varName !== name;
      const isContextBound = scopeManager.isContextBound(name);
      if ((isRenamed || isContextBound) && !scopeManager.isLoopVariable(name)) {
        if (node.left.property.type === "Literal" && node.left.property.value === 0) {
          targetVarRef = ASTFactory.createContextVariableReference(kind, varName);
        }
      }
    }
  }
  walk.recursive(
    node.right,
    { parent: node.right, inNamespaceCall: false },
    {
      Identifier(node2, state, c) {
        if (node2.name == "na") {
          node2.name = "NaN";
        }
        node2.parent = state.parent;
        transformIdentifier(node2, scopeManager);
        const isBinaryOperation = node2.parent && node2.parent.type === "BinaryExpression";
        const isConditional = node2.parent && node2.parent.type === "ConditionalExpression";
        const isContextBound = scopeManager.isContextBound(node2.name) && !scopeManager.isRootParam(node2.name);
        const hasArrayAccess = node2.parent && node2.parent.type === "MemberExpression" && node2.parent.computed && node2.parent.object === node2;
        const isParamCall = node2.parent && node2.parent._isParamCall;
        const isMemberExpression = node2.parent && node2.parent.type === "MemberExpression";
        const isReserved = node2.name === "NaN";
        const isGetCall = node2.parent && node2.parent.type === "CallExpression" && node2.parent.callee && node2.parent.callee.object && node2.parent.callee.object.name === CONTEXT_NAME && node2.parent.callee.property.name === "get";
        if (isContextBound || isConditional || isBinaryOperation) {
          if (node2.type === "MemberExpression") {
            transformArrayIndex(node2, scopeManager);
          } else if (node2.type === "Identifier" && !isMemberExpression && !hasArrayAccess && !isParamCall && !isReserved && !isGetCall) {
            addArrayAccess(node2);
          }
        }
      },
      MemberExpression(node2, state, c) {
        transformMemberExpression(node2, "", scopeManager);
        if (node2.type === "CallExpression") {
          node2.arguments.forEach((arg) => c(arg, { parent: node2, inNamespaceCall: state.inNamespaceCall }));
        } else if (node2.object) {
          c(node2.object, { parent: node2, inNamespaceCall: state.inNamespaceCall });
        }
      },
      CallExpression(node2, state, c) {
        const isNamespaceCall = node2.callee && node2.callee.type === "MemberExpression" && node2.callee.object && node2.callee.object.type === "Identifier" && scopeManager.isContextBound(node2.callee.object.name);
        transformCallExpression(node2, scopeManager);
        if (node2.type !== "CallExpression") return;
        node2.arguments.forEach((arg) => c(arg, { parent: node2, inNamespaceCall: isNamespaceCall || state.inNamespaceCall }));
      }
    }
  );
  if (targetVarRef) {
    let rightSide = node.right;
    if (node.operator !== "=") {
      const operator = node.operator.replace("=", "");
      const readAccess = ASTFactory.createGetCall(targetVarRef, 0);
      rightSide = {
        type: "BinaryExpression",
        operator,
        left: readAccess,
        right: node.right,
        start: node.start,
        end: node.end
      };
    }
    const setCall = ASTFactory.createSetCall(targetVarRef, rightSide);
    if (node.start) setCall.start = node.start;
    if (node.end) setCall.end = node.end;
    Object.assign(node, setCall);
  }
}
function transformVariableDeclaration(varNode, scopeManager) {
  varNode.declarations.forEach((decl) => {
    if (decl.init.name == "na") {
      decl.init.name = "NaN";
    }
    const isContextProperty = decl.init && decl.init.type === "MemberExpression" && decl.init.object && (decl.init.object.name === "context" || decl.init.object.name === CONTEXT_NAME || decl.init.object.name === "context2");
    const isSubContextProperty = decl.init && decl.init.type === "MemberExpression" && decl.init.object?.object && (decl.init.object.object.name === "context" || decl.init.object.object.name === CONTEXT_NAME || decl.init.object.object.name === "context2");
    const isArrowFunction = decl.init && decl.init.type === "ArrowFunctionExpression";
    if (isContextProperty) {
      if (decl.id.name) {
        scopeManager.addContextBoundVar(decl.id.name);
      }
      if (decl.id.properties) {
        decl.id.properties.forEach((property) => {
          if (property.key.name) {
            scopeManager.addContextBoundVar(property.key.name);
          }
        });
      }
      decl.init.object.name = CONTEXT_NAME;
      return;
    }
    if (isSubContextProperty) {
      if (decl.id.name) {
        scopeManager.addContextBoundVar(decl.id.name);
      }
      if (decl.id.properties) {
        decl.id.properties.forEach((property) => {
          if (property.key.name) {
            scopeManager.addContextBoundVar(property.key.name);
          }
        });
      }
      decl.init.object.object.name = CONTEXT_NAME;
      return;
    }
    if (isArrowFunction) {
      decl.init.params.forEach((param) => {
        if (param.type === "Identifier") {
          scopeManager.addContextBoundVar(param.name);
        }
      });
    }
    const newName = scopeManager.addVariable(decl.id.name, varNode.kind);
    const kind = varNode.kind;
    if (decl.init && !isArrowFunction) {
      if (decl.init.type === "CallExpression" && decl.init.callee.type === "MemberExpression" && decl.init.callee.object && decl.init.callee.object.type === "Identifier" && scopeManager.isContextBound(decl.init.callee.object.name)) {
        transformCallExpression(decl.init, scopeManager);
      } else {
        walk.recursive(
          decl.init,
          { parent: decl.init },
          {
            Identifier(node, state) {
              node.parent = state.parent;
              transformIdentifier(node, scopeManager);
              const isBinaryOperation = node.parent && node.parent.type === "BinaryExpression";
              const isUnaryOperation = node.parent && node.parent.type === "UnaryExpression";
              const isConditional = node.parent && node.parent.type === "ConditionalExpression";
              const isGetCall = node.parent && node.parent.type === "CallExpression" && node.parent.callee && node.parent.callee.object && node.parent.callee.object.name === CONTEXT_NAME && node.parent.callee.property.name === "get";
              if (node.type === "Identifier" && (isBinaryOperation || isUnaryOperation || isConditional) && !isGetCall) {
                addArrayAccess(node);
              }
            },
            CallExpression(node, state, c) {
              if (node.callee.type === "Identifier") {
                node.callee.parent = node;
              }
              node.arguments.forEach((arg) => {
                if (arg.type === "Identifier") {
                  arg.parent = node;
                }
              });
              transformCallExpression(node, scopeManager);
              if (node.type !== "CallExpression") return;
              node.arguments.forEach((arg) => c(arg, { parent: node }));
            },
            BinaryExpression(node, state, c) {
              if (node.left.type === "Identifier") {
                node.left.parent = node;
              }
              if (node.right.type === "Identifier") {
                node.right.parent = node;
              }
              c(node.left, { parent: node });
              c(node.right, { parent: node });
            },
            MemberExpression(node, state, c) {
              if (node.object && node.object.type === "Identifier") {
                node.object.parent = node;
              }
              if (node.property && node.property.type === "Identifier") {
                node.property.parent = node;
              }
              transformMemberExpression(node, "", scopeManager);
              if (node.type === "CallExpression") {
                node.arguments.forEach((arg) => c(arg, { parent: node }));
              } else if (node.object) {
                c(node.object, { parent: node });
              }
            }
          }
        );
      }
    }
    const targetVarRef = ASTFactory.createContextVariableReference(kind, newName);
    const isArrayPatternVar = scopeManager.isArrayPatternElement(decl.id.name);
    const isArrayInit = !isArrayPatternVar && decl.init && decl.init.type === "MemberExpression" && decl.init.computed && decl.init.property && (decl.init.property.type === "Literal" || decl.init.property.type === "MemberExpression");
    if (decl.init?.property?.type === "MemberExpression") {
      if (!decl.init.property._indexTransformed) {
        transformArrayIndex(decl.init.property, scopeManager);
        decl.init.property._indexTransformed = true;
      }
    }
    let rightSide;
    if (decl.init) {
      if (isArrowFunction || isArrayPatternVar) {
        rightSide = decl.init;
      } else if (kind === "var") {
        rightSide = ASTFactory.createInitVarCall(
          targetVarRef,
          decl.init
        );
      } else {
        rightSide = ASTFactory.createInitCall(
          targetVarRef,
          isArrayInit ? decl.init.object : decl.init,
          isArrayInit ? decl.init.property : void 0
        );
      }
    } else {
      rightSide = ASTFactory.createIdentifier("undefined");
    }
    const assignmentExpr = ASTFactory.createExpressionStatement(ASTFactory.createAssignmentExpression(targetVarRef, rightSide));
    if (isArrayPatternVar) {
      const tempVarRef = assignmentExpr.expression.right.object;
      const arrayIndex = decl.init.property.value;
      const getCall = ASTFactory.createGetCall(tempVarRef, 0);
      const arrayAccess = {
        type: "MemberExpression",
        object: getCall,
        property: {
          type: "Literal",
          value: arrayIndex
        },
        computed: true
      };
      assignmentExpr.expression.right = ASTFactory.createCallExpression(
        ASTFactory.createMemberExpression(ASTFactory.createContextIdentifier(), ASTFactory.createIdentifier("init")),
        [targetVarRef, arrayAccess]
      );
    }
    if (isArrowFunction) {
      scopeManager.pushScope("fn");
      walk.recursive(decl.init.body, scopeManager, {
        BlockStatement(node, state, c) {
          node.body.forEach((stmt) => c(stmt, state));
        },
        IfStatement(node, state, c) {
          state.pushScope("if");
          c(node.consequent, state);
          if (node.alternate) {
            state.pushScope("els");
            c(node.alternate, state);
            state.popScope();
          }
          state.popScope();
        },
        VariableDeclaration(node, state) {
          transformVariableDeclaration(node, state);
        },
        Identifier(node, state) {
          transformIdentifier(node, state);
        },
        AssignmentExpression(node, state) {
          transformAssignmentExpression(node, state);
        }
      });
      scopeManager.popScope();
    }
    Object.assign(varNode, assignmentExpr);
  });
}
function transformForStatement(node, scopeManager, c) {
  scopeManager.setSuppressHoisting(true);
  if (node.init && node.init.type === "VariableDeclaration") {
    const decl = node.init.declarations[0];
    const originalName = decl.id.name;
    scopeManager.addLoopVariable(originalName, originalName);
    node.init = {
      type: "VariableDeclaration",
      kind: node.init.kind,
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: originalName
          },
          init: decl.init
        }
      ]
    };
    if (decl.init) {
      walk.recursive(decl.init, scopeManager, {
        Identifier(node2, state) {
          if (!scopeManager.isLoopVariable(node2.name)) {
            scopeManager.pushScope("for");
            transformIdentifier(node2, state);
            scopeManager.popScope();
          }
        },
        MemberExpression(node2) {
          scopeManager.pushScope("for");
          transformMemberExpression(node2, "", scopeManager);
          scopeManager.popScope();
        }
      });
    }
  }
  if (node.test) {
    walk.recursive(node.test, scopeManager, {
      Identifier(node2, state) {
        if (!scopeManager.isLoopVariable(node2.name) && !node2.computed) {
          scopeManager.pushScope("for");
          transformIdentifier(node2, state);
          if (node2.type === "Identifier") {
            node2.computed = true;
            addArrayAccess(node2);
          }
          scopeManager.popScope();
        }
      },
      MemberExpression(node2) {
        scopeManager.pushScope("for");
        transformMemberExpression(node2, "", scopeManager);
        scopeManager.popScope();
      }
    });
  }
  if (node.update) {
    walk.recursive(node.update, scopeManager, {
      Identifier(node2, state) {
        if (!scopeManager.isLoopVariable(node2.name)) {
          scopeManager.pushScope("for");
          transformIdentifier(node2, state);
          scopeManager.popScope();
        }
      }
    });
  }
  scopeManager.setSuppressHoisting(false);
  scopeManager.pushScope("for");
  c(node.body, scopeManager);
  scopeManager.popScope();
}
function transformExpression(node, scopeManager) {
  walk.recursive(node, scopeManager, {
    MemberExpression(node2) {
      transformMemberExpression(node2, "", scopeManager);
    },
    CallExpression(node2, state) {
      transformCallExpression(node2, state);
    },
    Identifier(node2, state) {
      transformIdentifier(node2, state);
      const isIfStatement = scopeManager.getCurrentScopeType() === "if";
      const isContextBound = scopeManager.isContextBound(node2.name) && !scopeManager.isRootParam(node2.name);
      if (isContextBound && isIfStatement) {
        addArrayAccess(node2);
      }
    }
  });
}
function transformIfStatement(node, scopeManager, c) {
  if (node.test) {
    scopeManager.pushScope("if");
    transformExpression(node.test, scopeManager);
    scopeManager.popScope();
  }
  scopeManager.pushScope("if");
  c(node.consequent, scopeManager);
  scopeManager.popScope();
  if (node.alternate) {
    scopeManager.pushScope("els");
    c(node.alternate, scopeManager);
    scopeManager.popScope();
  }
}
function transformReturnStatement(node, scopeManager) {
  const curScope = scopeManager.getCurrentScopeType();
  if (node.argument) {
    if (node.argument.type === "ArrayExpression") {
      node.argument.elements = node.argument.elements.map((element) => {
        if (element.type === "Identifier") {
          if (scopeManager.isContextBound(element.name) && !scopeManager.isRootParam(element.name)) {
            return ASTFactory.createGetCall(element, 0);
          }
          const [scopedName, kind] = scopeManager.getVariable(element.name);
          return ASTFactory.createContextVariableAccess0(kind, scopedName);
        } else if (element.type === "MemberExpression") {
          const isContextVarRef = element.object && element.object.type === "MemberExpression" && element.object.object && element.object.object.type === "Identifier" && element.object.object.name === "$" && element.object.property && ["const", "let", "var", "params"].includes(element.object.property.name);
          if (isContextVarRef) {
            return ASTFactory.createGetCall(element, 0);
          }
          if (element.computed && element.object.type === "Identifier" && scopeManager.isContextBound(element.object.name) && !scopeManager.isRootParam(element.object.name)) {
            return element;
          }
          transformMemberExpression(element, "", scopeManager);
          return element;
        }
        return element;
      });
      node.argument = {
        type: "ArrayExpression",
        elements: [node.argument]
      };
    } else if (node.argument.type === "BinaryExpression") {
      walk.recursive(node.argument, scopeManager, {
        Identifier(node2, state) {
          transformIdentifier(node2, state);
          if (node2.type === "Identifier") {
            addArrayAccess(node2);
          }
        },
        MemberExpression(node2) {
          transformMemberExpression(node2, "", scopeManager);
        }
      });
    } else if (node.argument.type === "ObjectExpression") {
      node.argument.properties = node.argument.properties.map((prop) => {
        if (prop.shorthand) {
          const [scopedName, kind] = scopeManager.getVariable(prop.value.name);
          return {
            type: "Property",
            key: ASTFactory.createIdentifier(prop.key.name),
            value: ASTFactory.createContextVariableReference(kind, scopedName),
            kind: "init",
            method: false,
            shorthand: false,
            computed: false
          };
        }
        if (prop.value && prop.value.type === "Identifier") {
          if (scopeManager.isContextBound(prop.value.name) && !scopeManager.isRootParam(prop.value.name)) {
            prop.value = ASTFactory.createGetCall(prop.value, 0);
          } else if (!scopeManager.isContextBound(prop.value.name)) {
            const [scopedName, kind] = scopeManager.getVariable(prop.value.name);
            prop.value = ASTFactory.createContextVariableReference(kind, scopedName);
          }
        }
        return prop;
      });
    } else if (node.argument.type === "Identifier") {
      transformIdentifier(node.argument, scopeManager);
      if (node.argument.type === "Identifier") {
        addArrayAccess(node.argument);
      }
    }
    if (curScope === "fn") {
      if (node.argument.type === "Identifier" && scopeManager.isContextBound(node.argument.name) && !scopeManager.isRootParam(node.argument.name)) {
        node.argument = ASTFactory.createArrayAccess(node.argument, 0);
      } else if (node.argument.type === "MemberExpression") {
        if (node.argument.object.type === "Identifier" && scopeManager.isContextBound(node.argument.object.name) && !scopeManager.isRootParam(node.argument.object.name)) {
          if (!node.argument._indexTransformed) {
            transformArrayIndex(node.argument, scopeManager);
            node.argument._indexTransformed = true;
          }
        }
      } else if (node.argument.type === "BinaryExpression" || node.argument.type === "LogicalExpression" || node.argument.type === "ConditionalExpression" || node.argument.type === "CallExpression") {
        walk.recursive(node.argument, scopeManager, {
          Identifier(node2, state) {
            transformIdentifier(node2, state);
            if (node2.type === "Identifier" && !node2._arrayAccessed) {
              addArrayAccess(node2);
              node2._arrayAccessed = true;
            }
          },
          MemberExpression(node2) {
            transformMemberExpression(node2, "", scopeManager);
          },
          CallExpression(node2, state) {
            transformCallExpression(node2, state);
          }
        });
      }
      const precisionCall = ASTFactory.createCallExpression(
        ASTFactory.createMemberExpression(ASTFactory.createContextIdentifier(), ASTFactory.createIdentifier("precision")),
        [node.argument]
      );
      node.argument = precisionCall;
    }
  }
}
function transformFunctionDeclaration(node, scopeManager, c) {
  if (node.body && node.body.type === "BlockStatement") {
    scopeManager.pushScope("fn");
    c(node.body, scopeManager);
    scopeManager.popScope();
  }
}

function transformEqualityChecks(ast) {
  const baseVisitor = { ...walk.base, LineComment: () => {
  } };
  walk.simple(
    ast,
    {
      BinaryExpression(node) {
        if (node.operator === "==" || node.operator === "===") {
          const leftOperand = node.left;
          const rightOperand = node.right;
          const callExpr = ASTFactory.createMathEqCall(leftOperand, rightOperand);
          callExpr._transformed = true;
          Object.assign(node, callExpr);
        }
      }
    },
    baseVisitor
  );
}
function runTransformationPass(ast, scopeManager, originalParamName, options = { debug: false, ln: false }, sourceLines = []) {
  const createDebugComment = (originalNode) => {
    if (!options.debug || !originalNode.loc || !sourceLines.length) return null;
    const lineIndex = originalNode.loc.start.line - 1;
    if (lineIndex >= 0 && lineIndex < sourceLines.length) {
      const lineText = sourceLines[lineIndex].trim();
      if (lineText) {
        const prefix = options.ln ? ` [Line ${originalNode.loc.start.line}]` : "";
        return {
          type: "LineComment",
          value: `${prefix} ${lineText}`
        };
      }
    }
    return null;
  };
  walk.recursive(ast, scopeManager, {
    Program(node, state, c) {
      const newBody = [];
      node.body.forEach((stmt) => {
        state.enterHoistingScope();
        c(stmt, state);
        const hoistedStmts = state.exitHoistingScope();
        const commentNode = createDebugComment(stmt);
        if (commentNode) newBody.push(commentNode);
        newBody.push(...hoistedStmts);
        newBody.push(stmt);
      });
      node.body = newBody;
    },
    BlockStatement(node, state, c) {
      const newBody = [];
      node.body.forEach((stmt) => {
        state.enterHoistingScope();
        c(stmt, state);
        const hoistedStmts = state.exitHoistingScope();
        const commentNode = createDebugComment(stmt);
        if (commentNode) newBody.push(commentNode);
        newBody.push(...hoistedStmts);
        newBody.push(stmt);
      });
      node.body = newBody;
    },
    ReturnStatement(node, state) {
      transformReturnStatement(node, state);
    },
    VariableDeclaration(node, state) {
      transformVariableDeclaration(node, state);
    },
    Identifier(node, state) {
      transformIdentifier(node, state);
    },
    CallExpression(node, state) {
      transformCallExpression(node, state);
    },
    MemberExpression(node, state) {
      transformMemberExpression(node, originalParamName, state);
    },
    AssignmentExpression(node, state) {
      transformAssignmentExpression(node, state);
    },
    FunctionDeclaration(node, state, c) {
      transformFunctionDeclaration(node, state, c);
    },
    ForStatement(node, state, c) {
      transformForStatement(node, state, c);
    },
    IfStatement(node, state, c) {
      transformIfStatement(node, state, c);
    }
  });
}

function transpile(fn, options = { debug: false, ln: false }) {
  if (typeof options === "boolean") {
    options = { debug: options, ln: true };
  }
  const { debug } = options;
  let code = typeof fn === "function" ? fn.toString() : fn;
  code = code.trim();
  code = wrapInContextFunction(code);
  const sourceLines = debug ? code.split("\n") : [];
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: debug
  });
  transformNestedArrowFunctions(ast);
  normalizeNativeImports(ast);
  injectImplicitImports(ast);
  const scopeManager = new ScopeManager();
  preProcessContextBoundVars(ast, scopeManager);
  const originalParamName = runAnalysisPass(ast, scopeManager) || "";
  runTransformationPass(ast, scopeManager, originalParamName, options, sourceLines);
  transformEqualityChecks(ast);
  const baseGenerator = astring.baseGenerator || astring.GENERATOR || astring.default && astring.default.BASE_GENERATOR;
  const customGenerator = Object.assign({}, baseGenerator, {
    LineComment(node, state) {
      state.write("//" + node.value);
    }
  });
  const transformedCode = astring.generate(ast, {
    generator: customGenerator,
    comments: debug
  });
  const _wraperFunction = new Function("", `var _r = ${transformedCode}
; return _r;`);
  return _wraperFunction(this);
}

class PineArrayObject {
  constructor(array) {
    this.array = array;
  }
  toString() {
    return "PineArrayObject:" + this.array.toString();
  }
}

function abs$1(context) {
  return (id) => {
    return new PineArrayObject(id.array.map((val) => Math.abs(val)));
  };
}

function avg$1(context) {
  return (id) => {
    return context.array.sum(id) / id.array.length;
  };
}

function clear(context) {
  return (id) => {
    id.array.length = 0;
  };
}

function concat(context) {
  return (id, other) => {
    id.array.push(...other.array);
    return id;
  };
}

function copy(context) {
  return (id) => {
    return new PineArrayObject([...id.array]);
  };
}

function covariance(context) {
  return (arr1, arr2, biased = true) => {
    if (arr1.array.length !== arr2.array.length || arr1.array.length < 2) return NaN;
    const divisor = biased ? arr1.array.length : arr1.array.length - 1;
    const mean1 = context.array.avg(arr1);
    const mean2 = context.array.avg(arr2);
    let sum = 0;
    for (let i = 0; i < arr1.array.length; i++) {
      sum += (arr1.array[i] - mean1) * (arr2.array[i] - mean2);
    }
    return sum / divisor;
  };
}

function every(context) {
  return (id, callback) => {
    return id.array.every(callback);
  };
}

function fill(context) {
  return (id, value, start = 0, end) => {
    const length = id.array.length;
    const adjustedEnd = end !== void 0 ? Math.min(end, length) : length;
    for (let i = start; i < adjustedEnd; i++) {
      id.array[i] = value;
    }
  };
}

function first(context) {
  return (id) => {
    return id.array.length > 0 ? id.array[0] : context.NA;
  };
}

function from(context) {
  return (...values) => {
    return new PineArrayObject([...values]);
  };
}

function get(context) {
  return (id, index) => {
    return id.array[index];
  };
}

function includes(context) {
  return (id, value) => {
    return id.array.includes(value);
  };
}

function indexof(context) {
  return (id, value) => {
    return id.array.indexOf(value);
  };
}

function insert(context) {
  return (id, index, value) => {
    id.array.splice(index, 0, value);
  };
}

function join(context) {
  return (id, separator = ",") => {
    return id.array.join(separator);
  };
}

function last(context) {
  return (id) => {
    return id.array.length > 0 ? id.array[id.array.length - 1] : context.NA;
  };
}

function lastindexof(context) {
  return (id, value) => {
    return id.array.lastIndexOf(value);
  };
}

function max$1(context) {
  return (id, nth = 0) => {
    const sorted = [...id.array].sort((a, b) => b - a);
    return sorted[nth] ?? context.NA;
  };
}

function min$1(context) {
  return (id, nth = 0) => {
    const sorted = [...id.array].sort((a, b) => a - b);
    return sorted[nth] ?? context.NA;
  };
}

function new_fn(context) {
  return (size, initial_value) => {
    return new PineArrayObject(Array(size).fill(initial_value));
  };
}

function new_bool(context) {
  return (size, initial_value = false) => {
    return new PineArrayObject(Array(size).fill(initial_value));
  };
}

function new_float(context) {
  return (size, initial_value = NaN) => {
    return new PineArrayObject(Array(size).fill(initial_value));
  };
}

function new_int(context) {
  return (size, initial_value = 0) => {
    return new PineArrayObject(Array(size).fill(Math.round(initial_value)));
  };
}

function new_string(context) {
  return (size, initial_value = "") => {
    return new PineArrayObject(Array(size).fill(initial_value));
  };
}

class Series {
  constructor(data, offset = 0) {
    this.data = data;
    this.offset = offset;
  }
  get(index) {
    const realIndex = this.data.length - 1 - (this.offset + index);
    if (realIndex < 0 || realIndex >= this.data.length) {
      return NaN;
    }
    return this.data[realIndex];
  }
  set(index, value) {
    const realIndex = this.data.length - 1 - (this.offset + index);
    if (realIndex >= 0 && realIndex < this.data.length) {
      this.data[realIndex] = value;
    }
  }
  get length() {
    return this.data.length;
  }
  toArray() {
    return this.data;
  }
  static from(source) {
    if (source instanceof Series) return source;
    if (Array.isArray(source)) return new Series(source);
    return new Series([source]);
  }
}

function param$4(context) {
  return (source, index = 0) => {
    return Series.from(source).get(index);
  };
}

function pop(context) {
  return (id) => {
    return id.array.pop();
  };
}

function push(context) {
  return (id, value) => {
    id.array.push(value);
  };
}

function range$1(context) {
  return (id) => {
    return context.array.max(id) - context.array.min(id);
  };
}

function remove(context) {
  return (id, index) => {
    if (index >= 0 && index < id.array.length) {
      return id.array.splice(index, 1)[0];
    }
    return context.NA;
  };
}

function reverse(context) {
  return (id) => {
    id.array.reverse();
  };
}

function set(context) {
  return (id, index, value) => {
    id.array[index] = value;
  };
}

function shift(context) {
  return (id) => {
    return id.array.shift();
  };
}

function size(context) {
  return (id) => {
    return id.array.length;
  };
}

function slice(context) {
  return (id, start, end) => {
    const adjustedEnd = end !== void 0 ? end + 1 : void 0;
    return new PineArrayObject(id.array.slice(start, adjustedEnd));
  };
}

function some(context) {
  return (id, callback) => {
    return id.array.some(callback);
  };
}

function sort(context) {
  return (id, order = "asc") => {
    id.array.sort((a, b) => order === "asc" ? a - b : b - a);
  };
}

function sort_indices(context) {
  return (id, comparator) => {
    const indices = id.array.map((_, index) => index);
    indices.sort((a, b) => {
      const valA = id.array[a];
      const valB = id.array[b];
      return comparator ? comparator(valA, valB) : valA - valB;
    });
    return new PineArrayObject(indices);
  };
}

function standardize(context) {
  return (id) => {
    const mean = context.array.avg(id);
    const stdev = context.array.stdev(id);
    if (stdev === 0) {
      return new PineArrayObject(id.array.map(() => 0));
    }
    return new PineArrayObject(id.array.map((x) => (x - mean) / stdev));
  };
}

function stdev$1(context) {
  return (id, biased = true) => {
    const mean = context.array.avg(id);
    const deviations = id.array.map((x) => Math.pow(x - mean, 2));
    const divisor = biased ? id.array.length : id.array.length - 1;
    return Math.sqrt(context.array.sum(new PineArrayObject(deviations)) / divisor);
  };
}

function sum$1(context) {
  return (id) => {
    return id.array.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
  };
}

function unshift(context) {
  return (id, value) => {
    id.array.unshift(value);
  };
}

function variance$1(context) {
  return (id, biased = true) => {
    const mean = context.array.avg(id);
    const deviations = id.array.map((x) => Math.pow(x - mean, 2));
    const divisor = biased ? id.array.length : id.array.length - 1;
    return context.array.sum(new PineArrayObject(deviations)) / divisor;
  };
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
const methods$4 = {
  abs: abs$1,
  avg: avg$1,
  clear,
  concat,
  copy,
  covariance,
  every,
  fill,
  first,
  from,
  get,
  includes,
  indexof,
  insert,
  join,
  last,
  lastindexof,
  max: max$1,
  min: min$1,
  new: new_fn,
  new_bool,
  new_float,
  new_int,
  new_string,
  param: param$4,
  pop,
  push,
  range: range$1,
  remove,
  reverse,
  set,
  shift,
  size,
  slice,
  some,
  sort,
  sort_indices,
  standardize,
  stdev: stdev$1,
  sum: sum$1,
  unshift,
  variance: variance$1
};
class PineArray {
  constructor(context) {
    this.context = context;
    __publicField$8(this, "_cache", {});
    __publicField$8(this, "abs");
    __publicField$8(this, "avg");
    __publicField$8(this, "clear");
    __publicField$8(this, "concat");
    __publicField$8(this, "copy");
    __publicField$8(this, "covariance");
    __publicField$8(this, "every");
    __publicField$8(this, "fill");
    __publicField$8(this, "first");
    __publicField$8(this, "from");
    __publicField$8(this, "get");
    __publicField$8(this, "includes");
    __publicField$8(this, "indexof");
    __publicField$8(this, "insert");
    __publicField$8(this, "join");
    __publicField$8(this, "last");
    __publicField$8(this, "lastindexof");
    __publicField$8(this, "max");
    __publicField$8(this, "min");
    __publicField$8(this, "new");
    __publicField$8(this, "new_bool");
    __publicField$8(this, "new_float");
    __publicField$8(this, "new_int");
    __publicField$8(this, "new_string");
    __publicField$8(this, "param");
    __publicField$8(this, "pop");
    __publicField$8(this, "push");
    __publicField$8(this, "range");
    __publicField$8(this, "remove");
    __publicField$8(this, "reverse");
    __publicField$8(this, "set");
    __publicField$8(this, "shift");
    __publicField$8(this, "size");
    __publicField$8(this, "slice");
    __publicField$8(this, "some");
    __publicField$8(this, "sort");
    __publicField$8(this, "sort_indices");
    __publicField$8(this, "standardize");
    __publicField$8(this, "stdev");
    __publicField$8(this, "sum");
    __publicField$8(this, "unshift");
    __publicField$8(this, "variance");
    Object.entries(methods$4).forEach(([name, factory]) => {
      this[name] = factory(context);
    });
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
class Core {
  constructor(context) {
    this.context = context;
    __publicField$7(this, "color", {
      param: (source, index = 0) => {
        return Series.from(source).get(index);
      },
      rgb: (r, g, b, a) => a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`,
      new: (color, a) => {
        if (color && color.startsWith("#")) {
          const hex = color.slice(1);
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          return a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
        }
        return a ? `rgba(${color}, ${a})` : color;
      },
      white: "white",
      lime: "lime",
      green: "green",
      red: "red",
      maroon: "maroon",
      black: "black",
      gray: "gray",
      blue: "blue"
    });
  }
  extractPlotOptions(options) {
    const _options = {};
    for (let key in options) {
      _options[key] = Series.from(options[key]).get(0);
    }
    return _options;
  }
  indicator(title, shorttitle, options) {
  }
  //in the current implementation, plot functions are only used to collect data for the plots array and map it to the market data
  plotchar(series, title, options) {
    if (!this.context.plots[title]) {
      this.context.plots[title] = { data: [], options: this.extractPlotOptions(options), title };
    }
    const value = Series.from(series).get(0);
    this.context.plots[title].data.push({
      time: this.context.marketData[this.context.idx].openTime,
      value,
      options: { ...this.extractPlotOptions(options), style: "char" }
    });
  }
  plot(series, title, options) {
    if (!this.context.plots[title]) {
      this.context.plots[title] = { data: [], options: this.extractPlotOptions(options), title };
    }
    const value = Series.from(series).get(0);
    this.context.plots[title].data.push({
      time: this.context.marketData[this.context.idx].openTime,
      value,
      options: this.extractPlotOptions(options)
    });
  }
  get bar_index() {
    return this.context.idx;
  }
  na(series) {
    return isNaN(Series.from(series).get(0));
  }
  nz(series, replacement = 0) {
    const val = Series.from(series).get(0);
    const rep = Series.from(replacement).get(0);
    return isNaN(val) ? rep : val;
  }
}

function any(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function bool(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function color(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function enum_fn(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function float(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function int(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function param$3(context) {
  return (source, index = 0) => {
    const val = Series.from(source).get(index);
    return [val];
  };
}

function price(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function session(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function source(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function string(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function symbol(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function text_area(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function time(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

function timeframe(context) {
  return (value, { title, group } = {}) => {
    return Array.isArray(value) ? value[0] : value;
  };
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
const methods$3 = {
  any,
  bool,
  color,
  enum: enum_fn,
  float,
  int,
  param: param$3,
  price,
  session,
  source,
  string,
  symbol,
  text_area,
  time,
  timeframe
};
class Input {
  constructor(context) {
    this.context = context;
    __publicField$6(this, "any");
    __publicField$6(this, "bool");
    __publicField$6(this, "color");
    __publicField$6(this, "enum");
    __publicField$6(this, "float");
    __publicField$6(this, "int");
    __publicField$6(this, "param");
    __publicField$6(this, "price");
    __publicField$6(this, "session");
    __publicField$6(this, "source");
    __publicField$6(this, "string");
    __publicField$6(this, "symbol");
    __publicField$6(this, "text_area");
    __publicField$6(this, "time");
    __publicField$6(this, "timeframe");
    Object.entries(methods$3).forEach(([name, factory]) => {
      this[name] = factory(context);
    });
  }
}

function __eq(context) {
  return (a, b) => {
    const valA = Series.from(a).get(0);
    const valB = Series.from(b).get(0);
    if (isNaN(valA) && isNaN(valB)) return true;
    if (isNaN(valA) || isNaN(valB)) return false;
    return Math.abs(valA - valB) < 1e-8;
  };
}

function abs(context) {
  return (source) => {
    return Math.abs(Series.from(source).get(0));
  };
}

function acos(context) {
  return (source) => {
    return Math.acos(Series.from(source).get(0));
  };
}

function asin(context) {
  return (source) => {
    return Math.asin(Series.from(source).get(0));
  };
}

function atan(context) {
  return (source) => {
    return Math.atan(Series.from(source).get(0));
  };
}

function avg(context) {
  return (...sources) => {
    const values = sources.map((source) => {
      return Series.from(source).get(0);
    });
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };
}

function ceil(context) {
  return (source) => {
    return Math.ceil(Series.from(source).get(0));
  };
}

function cos(context) {
  return (source) => {
    return Math.cos(Series.from(source).get(0));
  };
}

function exp(context) {
  return (source) => {
    return Math.exp(Series.from(source).get(0));
  };
}

function floor(context) {
  return (source) => {
    return Math.floor(Series.from(source).get(0));
  };
}

function ln(context) {
  return (source) => {
    return Math.log(Series.from(source).get(0));
  };
}

function log(context) {
  return (source) => {
    return Math.log(Series.from(source).get(0));
  };
}

function log10(context) {
  return (source) => {
    return Math.log10(Series.from(source).get(0));
  };
}

function max(context) {
  return (...source) => {
    const args = source.map((e) => Series.from(e).get(0));
    return Math.max(...args);
  };
}

function min(context) {
  return (...source) => {
    const args = source.map((e) => Series.from(e).get(0));
    return Math.min(...args);
  };
}

function param$2(context) {
  return (source, index, name) => {
    if (typeof source === "string") return source;
    if (source instanceof Series) {
      if (index) {
        return new Series(source.data, source.offset + index);
      }
      return source;
    }
    if (!Array.isArray(source) && typeof source === "object") return source;
    if (!context.params[name]) context.params[name] = [];
    if (Array.isArray(source)) {
      return new Series(source, index || 0);
    } else {
      if (context.params[name].length === 0) {
        context.params[name].push(source);
      } else {
        context.params[name][context.params[name].length - 1] = source;
      }
      return new Series(context.params[name], 0);
    }
  };
}

function pow(context) {
  return (source, power) => {
    return Math.pow(Series.from(source).get(0), Series.from(power).get(0));
  };
}

function random(context) {
  return () => {
    return Math.random();
  };
}

function round(context) {
  return (source) => {
    return Math.round(Series.from(source).get(0));
  };
}

function sin(context) {
  return (source) => {
    return Math.sin(Series.from(source).get(0));
  };
}

function sqrt(context) {
  return (source) => {
    return Math.sqrt(Series.from(source).get(0));
  };
}

function sum(context) {
  return (source, length) => {
    const len = Series.from(length).get(0);
    const series = Series.from(source);
    let total = 0;
    for (let i = 0; i < len; i++) {
      const val = series.get(i);
      total += val;
    }
    return total;
  };
}

function tan(context) {
  return (source) => {
    return Math.tan(Series.from(source).get(0));
  };
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
const methods$2 = {
  __eq,
  abs,
  acos,
  asin,
  atan,
  avg,
  ceil,
  cos,
  exp,
  floor,
  ln,
  log,
  log10,
  max,
  min,
  param: param$2,
  pow,
  random,
  round,
  sin,
  sqrt,
  sum,
  tan
};
class PineMath {
  constructor(context) {
    this.context = context;
    __publicField$5(this, "_cache", {});
    __publicField$5(this, "__eq");
    __publicField$5(this, "abs");
    __publicField$5(this, "acos");
    __publicField$5(this, "asin");
    __publicField$5(this, "atan");
    __publicField$5(this, "avg");
    __publicField$5(this, "ceil");
    __publicField$5(this, "cos");
    __publicField$5(this, "exp");
    __publicField$5(this, "floor");
    __publicField$5(this, "ln");
    __publicField$5(this, "log");
    __publicField$5(this, "log10");
    __publicField$5(this, "max");
    __publicField$5(this, "min");
    __publicField$5(this, "param");
    __publicField$5(this, "pow");
    __publicField$5(this, "random");
    __publicField$5(this, "round");
    __publicField$5(this, "sin");
    __publicField$5(this, "sqrt");
    __publicField$5(this, "sum");
    __publicField$5(this, "tan");
    Object.entries(methods$2).forEach(([name, factory]) => {
      this[name] = factory(context);
    });
  }
}

function param$1(context) {
  return (source, index, name) => {
    if (!context.params[name]) context.params[name] = [];
    let val;
    if (source instanceof Series) {
      val = source.get(index || 0);
    } else if (Array.isArray(source)) {
      const hasOnlySeries = source.every((elem) => elem instanceof Series);
      const hasOnlyScalars = source.every((elem) => !(elem instanceof Series) && !Array.isArray(elem));
      const isTuple = (hasOnlySeries || hasOnlyScalars) && source.length >= 1;
      if (isTuple) {
        if (hasOnlySeries) {
          val = source.map((s) => s.get(0));
        } else {
          val = source;
        }
      } else {
        val = Series.from(source).get(index || 0);
      }
    } else {
      val = source;
    }
    if (context.params[name].length === 0) {
      context.params[name].push(val);
    } else {
      context.params[name][context.params[name].length - 1] = val;
    }
    return [val, name];
  };
}

const TIMEFRAMES = ["1", "3", "5", "15", "30", "45", "60", "120", "180", "240", "D", "W", "M"];

function findSecContextIdx(myOpenTime, myCloseTime, openTime, closeTime, lookahead = false) {
  for (let i = 0; i < openTime.length; i++) {
    if (openTime[i] <= myOpenTime && myCloseTime <= closeTime[i]) {
      if (lookahead) {
        return i;
      }
      return myCloseTime >= closeTime[i] ? i : i - 1;
    }
  }
  return -1;
}

function findLTFContextIdx(myOpenTime, myCloseTime, openTime, closeTime, lookahead = false, mainContextEDate, gaps = false) {
  for (let i = openTime.length - 1; i >= 0; i--) {
    if (closeTime[i] <= myCloseTime && openTime[i] >= myOpenTime) {
      const isCurrentBar = mainContextEDate && myCloseTime > mainContextEDate;
      if (gaps && lookahead) {
        for (let j = 0; j < openTime.length; j++) {
          if (openTime[j] >= myOpenTime && openTime[j] < myCloseTime) {
            return j;
          }
          if (openTime[j] >= myCloseTime) {
            break;
          }
        }
      }
      if (isCurrentBar && lookahead && !gaps) {
        for (let j = 0; j < openTime.length; j++) {
          if (openTime[j] >= myOpenTime && openTime[j] < myCloseTime) {
            return j;
          }
          if (openTime[j] >= myCloseTime) {
            break;
          }
        }
      }
      return i;
    }
    if (closeTime[i] < myOpenTime) {
      break;
    }
  }
  return -1;
}

function security(context) {
  return async (symbol, timeframe, expression, gaps = false, lookahead = false, ignore_invalid_symbol = false, currency = null, calc_bars_count = null) => {
    const _symbol = symbol[0];
    const _timeframe = timeframe[0];
    const _expression = expression[0];
    const _expression_name = expression[1];
    const _gaps = Array.isArray(gaps) ? gaps[0] : gaps;
    const _lookahead = Array.isArray(lookahead) ? lookahead[0] : lookahead;
    if (context.isSecondaryContext) {
      return _expression;
    }
    const ctxTimeframeIdx = TIMEFRAMES.indexOf(context.timeframe);
    const reqTimeframeIdx = TIMEFRAMES.indexOf(_timeframe);
    if (ctxTimeframeIdx == -1 || reqTimeframeIdx == -1) {
      throw new Error("Invalid timeframe");
    }
    if (ctxTimeframeIdx === reqTimeframeIdx) {
      return _expression;
    }
    const isLTF = ctxTimeframeIdx > reqTimeframeIdx;
    const myOpenTime = Series.from(context.data.openTime).get(0);
    const myCloseTime = Series.from(context.data.closeTime).get(0);
    const cacheKey = `${_symbol}_${_timeframe}_${_expression_name}`;
    const gapCacheKey = `${cacheKey}_prevIdx`;
    if (context.cache[cacheKey]) {
      const secContext2 = context.cache[cacheKey];
      const secContextIdx2 = isLTF ? findLTFContextIdx(
        myOpenTime,
        myCloseTime,
        secContext2.data.openTime.data,
        secContext2.data.closeTime.data,
        _lookahead,
        context.eDate,
        _gaps
      ) : findSecContextIdx(myOpenTime, myCloseTime, secContext2.data.openTime.data, secContext2.data.closeTime.data, _lookahead);
      if (secContextIdx2 == -1) {
        return NaN;
      }
      const value2 = secContext2.params[_expression_name][secContextIdx2];
      if (!isLTF && _gaps) {
        const prevIdx = context.cache[gapCacheKey];
        if (prevIdx !== void 0 && prevIdx === secContextIdx2) {
          return NaN;
        }
        context.cache[gapCacheKey] = secContextIdx2;
        return Array.isArray(value2) ? [value2] : value2;
      }
      return Array.isArray(value2) ? [value2] : value2;
    }
    const buffer = 1e3 * 60 * 60 * 24 * 30;
    const adjustedSDate = context.sDate ? context.sDate - buffer : void 0;
    const limit = context.sDate && context.eDate ? void 0 : context.limit || 1e3;
    const pineTS = new PineTS(context.source, _symbol, _timeframe, limit, adjustedSDate, void 0);
    pineTS.markAsSecondary();
    const secContext = await pineTS.run(context.pineTSCode);
    context.cache[cacheKey] = secContext;
    const secContextIdx = isLTF ? findLTFContextIdx(
      myOpenTime,
      myCloseTime,
      secContext.data.openTime.data,
      secContext.data.closeTime.data,
      _lookahead,
      context.eDate,
      _gaps
    ) : findSecContextIdx(myOpenTime, myCloseTime, secContext.data.openTime.data, secContext.data.closeTime.data, _lookahead);
    if (secContextIdx == -1) {
      return NaN;
    }
    const value = secContext.params[_expression_name][secContextIdx];
    if (!isLTF && _gaps) {
      context.cache[gapCacheKey] = secContextIdx;
      return NaN;
    }
    return Array.isArray(value) ? [value] : value;
  };
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
const methods$1 = {
  param: param$1,
  security
};
class PineRequest {
  constructor(context) {
    this.context = context;
    __publicField$4(this, "_cache", {});
    __publicField$4(this, "param");
    __publicField$4(this, "security");
    Object.entries(methods$1).forEach(([name, factory]) => {
      this[name] = factory(context);
    });
  }
}

function accdist(context) {
  return (_callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "accdist";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        cumulativeSum: 0
      };
    }
    const state = context.taState[stateKey];
    const close = context.get(context.data.close, 0);
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const volume = context.get(context.data.volume, 0);
    if (isNaN(close) || isNaN(high) || isNaN(low) || isNaN(volume)) {
      return context.precision(state.cumulativeSum);
    }
    const range = high - low;
    let term = 0;
    if (range !== 0) {
      term = (close - low - (high - close)) / range * volume;
    }
    state.cumulativeSum += term;
    return context.precision(state.cumulativeSum);
  };
}

function alma(context) {
  return (source, _period, _offset, _sigma, _callId) => {
    const period = Series.from(_period).get(0);
    const offset = Series.from(_offset).get(0);
    const sigma = Series.from(_sigma).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `alma_${period}_${offset}_${sigma}`;
    if (!context.taState[stateKey]) {
      const m = offset * (period - 1);
      const s = period / sigma;
      const weights = [];
      let weightSum = 0;
      for (let i = 0; i < period; i++) {
        const weight = Math.exp(-Math.pow(i - m, 2) / (2 * s * s));
        weights.push(weight);
        weightSum += weight;
      }
      for (let i = 0; i < weights.length; i++) {
        weights[i] /= weightSum;
      }
      context.taState[stateKey] = {
        window: [],
        weights
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < period) {
      return NaN;
    }
    if (state.window.length > period) {
      state.window.pop();
    }
    let alma2 = 0;
    for (let i = 0; i < period; i++) {
      alma2 += state.weights[i] * state.window[period - 1 - i];
    }
    return context.precision(alma2);
  };
}

function atr(context) {
  return (_period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `atr_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        prevAtr: null,
        initSum: 0,
        initCount: 0,
        prevClose: null
      };
    }
    const state = context.taState[stateKey];
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const close = context.get(context.data.close, 0);
    let tr;
    if (state.prevClose !== null) {
      const hl = high - low;
      const hc = Math.abs(high - state.prevClose);
      const lc = Math.abs(low - state.prevClose);
      tr = Math.max(hl, hc, lc);
    } else {
      tr = high - low;
    }
    state.prevClose = close;
    if (state.initCount < period) {
      state.initSum += tr;
      state.initCount++;
      if (state.initCount === period) {
        state.prevAtr = state.initSum / period;
        return context.precision(state.prevAtr);
      }
      return NaN;
    }
    const atr2 = (state.prevAtr * (period - 1) + tr) / period;
    state.prevAtr = atr2;
    return context.precision(atr2);
  };
}

function barssince(context) {
  return (condition, _callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "barssince";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        lastTrueIndex: null
      };
    }
    const state = context.taState[stateKey];
    const cond = Series.from(condition).get(0);
    if (cond) {
      state.lastTrueIndex = context.idx;
      return 0;
    }
    if (state.lastTrueIndex === null) {
      return NaN;
    }
    return context.idx - state.lastTrueIndex;
  };
}

function bb(context) {
  return (source, _length, _mult, _callId) => {
    const length = Series.from(_length).get(0);
    const mult = Series.from(_mult).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `bb_${length}_${mult}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        window: [],
        sum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (isNaN(currentValue)) {
      return [[NaN, NaN, NaN]];
    }
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < length) {
      return [[NaN, NaN, NaN]];
    }
    if (state.window.length > length) {
      const oldValue = state.window.pop();
      state.sum -= oldValue;
    }
    const middle = state.sum / length;
    let sumSquaredDiff = 0;
    for (let i = 0; i < length; i++) {
      sumSquaredDiff += Math.pow(state.window[i] - middle, 2);
    }
    const stdev = Math.sqrt(sumSquaredDiff / length);
    const upper = middle + mult * stdev;
    const lower = middle - mult * stdev;
    return [[context.precision(upper), context.precision(middle), context.precision(lower)]];
  };
}

function bbw(context) {
  return (source, _length, _mult, _callId) => {
    const length = Series.from(_length).get(0);
    const mult = Series.from(_mult).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `bbw_${length}_${mult}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        window: [],
        sum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (isNaN(currentValue)) {
      return NaN;
    }
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      const removed = state.window.pop();
      state.sum -= removed;
    }
    const basis = state.sum / length;
    let sumSqDiff = 0;
    for (let i = 0; i < length; i++) {
      const diff = state.window[i] - basis;
      sumSqDiff += diff * diff;
    }
    const variance = sumSqDiff / length;
    const stdev = Math.sqrt(variance);
    const dev = mult * stdev;
    if (basis === 0) {
      return context.precision(0);
    }
    const bbw2 = 2 * dev / basis * 100;
    return context.precision(bbw2);
  };
}

function cci(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `cci_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        window: [],
        sum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (isNaN(currentValue)) {
      return NaN;
    }
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      const oldValue = state.window.pop();
      state.sum -= oldValue;
    }
    const sma = state.sum / length;
    let sumAbsoluteDeviations = 0;
    for (let i = 0; i < length; i++) {
      sumAbsoluteDeviations += Math.abs(state.window[i] - sma);
    }
    const meanDeviation = sumAbsoluteDeviations / length;
    if (meanDeviation === 0) {
      return 0;
    }
    const cci2 = (currentValue - sma) / (0.015 * meanDeviation);
    return context.precision(cci2);
  };
}

function change(context) {
  return (source, _length = 1, _callId) => {
    if (typeof _length === "string") {
      _callId = _length;
      _length = 1;
    }
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `change_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length <= length) {
      return NaN;
    }
    if (state.window.length > length + 1) {
      state.window.pop();
    }
    const change2 = currentValue - state.window[length];
    return context.precision(change2);
  };
}

function cmo(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `cmo_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        gainsWindow: [],
        lossesWindow: [],
        gainsSum: 0,
        lossesSum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    const previousValue = Series.from(source).get(1);
    if (isNaN(currentValue) || isNaN(previousValue)) {
      return NaN;
    }
    const mom = currentValue - previousValue;
    const gain = mom >= 0 ? mom : 0;
    const loss = mom >= 0 ? 0 : -mom;
    state.gainsWindow.unshift(gain);
    state.lossesWindow.unshift(loss);
    state.gainsSum += gain;
    state.lossesSum += loss;
    if (state.gainsWindow.length < length) {
      return NaN;
    }
    if (state.gainsWindow.length > length) {
      const oldGain = state.gainsWindow.pop();
      const oldLoss = state.lossesWindow.pop();
      state.gainsSum -= oldGain;
      state.lossesSum -= oldLoss;
    }
    const denominator = state.gainsSum + state.lossesSum;
    if (denominator === 0) {
      return context.precision(0);
    }
    const cmo2 = 100 * (state.gainsSum - state.lossesSum) / denominator;
    return context.precision(cmo2);
  };
}

function cog(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const sourceSeries = Series.from(source);
    let sum = 0;
    let hasNaN = false;
    for (let i = 0; i < length; i++) {
      const value = sourceSeries.get(i);
      if (isNaN(value)) {
        hasNaN = true;
        break;
      }
      sum += value;
    }
    if (hasNaN) {
      return NaN;
    }
    let num = 0;
    for (let i = 0; i < length; i++) {
      const price = sourceSeries.get(i);
      num += price * (i + 1);
    }
    if (sum === 0) {
      return NaN;
    }
    const cog2 = -num / sum;
    return context.precision(cog2);
  };
}

function correlation(context) {
  return (source1, source2, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const s1 = Series.from(source1);
    const s2 = Series.from(source2);
    if (context.idx < length - 1) {
      return NaN;
    }
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;
    let count = 0;
    for (let i = 0; i < length; i++) {
      const x = s1.get(i);
      const y = s2.get(i);
      if (isNaN(x) || isNaN(y)) continue;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
      count++;
    }
    if (count < 2) return NaN;
    const numerator = count * sumXY - sumX * sumY;
    const denominatorX = count * sumX2 - sumX * sumX;
    const denominatorY = count * sumY2 - sumY * sumY;
    if (denominatorX <= 0 || denominatorY <= 0) return context.precision(0);
    const r = numerator / Math.sqrt(denominatorX * denominatorY);
    return context.precision(r);
  };
}

function cross(context) {
  return (source1, source2, _callId) => {
    const series1 = Series.from(source1);
    const series2 = Series.from(source2);
    const current1 = series1.get(0);
    const current2 = series2.get(0);
    const prev1 = series1.get(1);
    const prev2 = series2.get(1);
    if (isNaN(current1) || isNaN(current2) || isNaN(prev1) || isNaN(prev2)) {
      return false;
    }
    const crossedOver = current1 > current2 && prev1 <= prev2;
    const crossedUnder = current1 < current2 && prev1 >= prev2;
    return crossedOver || crossedUnder;
  };
}

function crossover(context) {
  return (source1, source2) => {
    const s1 = Series.from(source1);
    const s2 = Series.from(source2);
    const current1 = s1.get(0);
    const current2 = s2.get(0);
    const prev1 = s1.get(1);
    const prev2 = s2.get(1);
    return prev1 < prev2 && current1 > current2;
  };
}

function crossunder(context) {
  return (source1, source2) => {
    const s1 = Series.from(source1);
    const s2 = Series.from(source2);
    const current1 = s1.get(0);
    const current2 = s2.get(0);
    const prev1 = s1.get(1);
    const prev2 = s2.get(1);
    return prev1 > prev2 && current1 < current2;
  };
}

function cum(context) {
  return (source, _callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "cum";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        cumulativeSum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (isNaN(currentValue)) {
      return context.precision(state.cumulativeSum);
    }
    state.cumulativeSum += currentValue;
    return context.precision(state.cumulativeSum);
  };
}

function dev(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `dev_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [], sum: 0 };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0) || 0;
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      const oldValue = state.window.pop();
      state.sum -= oldValue;
    }
    const mean = state.sum / length;
    let sumDeviation = 0;
    for (let i = 0; i < length; i++) {
      sumDeviation += Math.abs(state.window[i] - mean);
    }
    const dev2 = sumDeviation / length;
    return context.precision(dev2);
  };
}

function dmi(context) {
  return (_diLength, _adxSmoothing, _callId) => {
    const diLength = Series.from(_diLength).get(0);
    const adxSmoothing = Series.from(_adxSmoothing).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `dmi_${diLength}_${adxSmoothing}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        // Previous bar values
        prevHigh: NaN,
        prevLow: NaN,
        prevClose: NaN,
        // RMA states for TR, +DM, -DM (using diLength)
        // We track initSum and initCount for the SMA initialization phase
        trInitSum: 0,
        plusInitSum: 0,
        minusInitSum: 0,
        initCount: 0,
        // Counts valid bars for DI initialization
        prevSmoothedTR: NaN,
        prevSmoothedPlus: NaN,
        prevSmoothedMinus: NaN,
        // RMA state for ADX (using adxSmoothing)
        dxInitSum: 0,
        adxInitCount: 0,
        prevADX: NaN
      };
    }
    const state = context.taState[stateKey];
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const close = context.get(context.data.close, 0);
    if (isNaN(high) || isNaN(low) || isNaN(close)) {
      return [[NaN, NaN, NaN]];
    }
    if (isNaN(state.prevHigh)) {
      state.prevHigh = high;
      state.prevLow = low;
      state.prevClose = close;
      return [[NaN, NaN, NaN]];
    }
    const tr = Math.max(high - low, Math.abs(high - state.prevClose), Math.abs(low - state.prevClose));
    const up = high - state.prevHigh;
    const down = state.prevLow - low;
    const plusDM = up > down && up > 0 ? up : 0;
    const minusDM = down > up && down > 0 ? down : 0;
    state.prevHigh = high;
    state.prevLow = low;
    state.prevClose = close;
    let smoothedTR, smoothedPlus, smoothedMinus;
    state.initCount++;
    if (state.initCount <= diLength) {
      state.trInitSum += tr;
      state.plusInitSum += plusDM;
      state.minusInitSum += minusDM;
      if (state.initCount === diLength) {
        state.prevSmoothedTR = state.trInitSum / diLength;
        state.prevSmoothedPlus = state.plusInitSum / diLength;
        state.prevSmoothedMinus = state.minusInitSum / diLength;
      }
    } else {
      const alpha = 1 / diLength;
      state.prevSmoothedTR = alpha * tr + (1 - alpha) * state.prevSmoothedTR;
      state.prevSmoothedPlus = alpha * plusDM + (1 - alpha) * state.prevSmoothedPlus;
      state.prevSmoothedMinus = alpha * minusDM + (1 - alpha) * state.prevSmoothedMinus;
    }
    smoothedTR = state.prevSmoothedTR;
    smoothedPlus = state.prevSmoothedPlus;
    smoothedMinus = state.prevSmoothedMinus;
    if (state.initCount < diLength) {
      return [[NaN, NaN, NaN]];
    }
    const plusDI = smoothedTR === 0 ? 0 : 100 * smoothedPlus / smoothedTR;
    const minusDI = smoothedTR === 0 ? 0 : 100 * smoothedMinus / smoothedTR;
    const sumDI = plusDI + minusDI;
    const dx = sumDI === 0 ? 0 : 100 * Math.abs(plusDI - minusDI) / sumDI;
    let adx = NaN;
    state.adxInitCount++;
    if (state.adxInitCount <= adxSmoothing) {
      state.dxInitSum += dx;
      if (state.adxInitCount === adxSmoothing) {
        state.prevADX = state.dxInitSum / adxSmoothing;
        adx = state.prevADX;
      }
    } else {
      const alphaAdx = 1 / adxSmoothing;
      state.prevADX = alphaAdx * dx + (1 - alphaAdx) * state.prevADX;
      adx = state.prevADX;
    }
    return [[context.precision(plusDI), context.precision(minusDI), context.precision(adx)]];
  };
}

function ema(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `ema_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { prevEma: null, initSum: 0, initCount: 0 };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (state.initCount < period) {
      state.initSum += currentValue;
      state.initCount++;
      if (state.initCount === period) {
        state.prevEma = state.initSum / period;
        return context.precision(state.prevEma);
      }
      return NaN;
    }
    const alpha = 2 / (period + 1);
    const ema2 = currentValue * alpha + state.prevEma * (1 - alpha);
    state.prevEma = ema2;
    return context.precision(ema2);
  };
}

function falling(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    for (let i = 0; i < length; i++) {
      const current = series.get(i);
      const next = series.get(i + 1);
      if (isNaN(current) || isNaN(next)) {
        return false;
      }
      if (current >= next) {
        return false;
      }
    }
    return true;
  };
}

function highest(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `highest_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      state.window.pop();
    }
    const max = Math.max(...state.window.filter((v) => !isNaN(v)));
    return context.precision(max);
  };
}

function highestbars(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    if (context.idx < length - 1) {
      return NaN;
    }
    let maxVal = -Infinity;
    let maxOffset = NaN;
    for (let i = 0; i < length; i++) {
      const val = series.get(i);
      if (isNaN(val)) continue;
      if (isNaN(maxOffset) || val > maxVal) {
        maxVal = val;
        maxOffset = -i;
      }
    }
    return maxOffset;
  };
}

function hma(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    const halfPeriod = Math.floor(period / 2);
    const sqrtPeriod = Math.floor(Math.sqrt(period));
    const wmaFn = context.ta.wma;
    const wma1 = wmaFn(source, halfPeriod, _callId ? `${_callId}_wma1` : void 0);
    const wma2 = wmaFn(source, period, _callId ? `${_callId}_wma2` : void 0);
    if (isNaN(wma1) || isNaN(wma2)) {
      return NaN;
    }
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `hma_raw_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = [];
    }
    const rawHma = 2 * wma1 - wma2;
    context.taState[stateKey].unshift(rawHma);
    const hmaStateKey = _callId ? `${_callId}_hma_final` : `hma_final_${period}`;
    if (!context.taState[hmaStateKey]) {
      context.taState[hmaStateKey] = { window: [] };
    }
    const state = context.taState[hmaStateKey];
    state.window.unshift(rawHma);
    if (state.window.length < sqrtPeriod) {
      return NaN;
    }
    if (state.window.length > sqrtPeriod) {
      state.window.pop();
    }
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < sqrtPeriod; i++) {
      const weight = sqrtPeriod - i;
      numerator += state.window[i] * weight;
      denominator += weight;
    }
    const hma2 = numerator / denominator;
    return context.precision(hma2);
  };
}

function iii(context) {
  return (_callId) => {
    const close = context.get(context.data.close, 0);
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const volume = context.get(context.data.volume, 0);
    if (isNaN(close) || isNaN(high) || isNaN(low) || isNaN(volume)) {
      return NaN;
    }
    const range = high - low;
    const denominator = range * volume;
    if (denominator === 0) {
      return context.precision(0);
    }
    const iii2 = (2 * close - high - low) / denominator;
    return context.precision(iii2);
  };
}

function kc(context) {
  return (source, _length, _mult, _useTrueRange, _callId) => {
    const length = Series.from(_length).get(0);
    const mult = Series.from(_mult).get(0);
    let useTrueRange = true;
    if (typeof _useTrueRange === "string") {
      _callId = _useTrueRange;
    } else if (_useTrueRange !== void 0) {
      useTrueRange = Series.from(_useTrueRange).get(0);
    }
    let span;
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    if (useTrueRange) {
      const close1 = context.get(context.data.close, 1);
      if (isNaN(close1)) {
        span = NaN;
      } else {
        span = Math.max(high - low, Math.abs(high - close1), Math.abs(low - close1));
      }
    } else {
      span = high - low;
    }
    const currentValue = Series.from(source).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `kc_${length}_${mult}_${useTrueRange}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        basisState: { prevEma: null, initSum: 0, initCount: 0 },
        rangeState: { prevEma: null, initSum: 0, initCount: 0 }
      };
    }
    const state = context.taState[stateKey];
    const updateEma = (emaState, value, period) => {
      if (isNaN(value)) return NaN;
      if (emaState.initCount < period) {
        emaState.initSum += value;
        emaState.initCount++;
        if (emaState.initCount === period) {
          emaState.prevEma = emaState.initSum / period;
          return emaState.prevEma;
        }
        return NaN;
      }
      const alpha = 2 / (period + 1);
      emaState.prevEma = value * alpha + emaState.prevEma * (1 - alpha);
      return emaState.prevEma;
    };
    const basis = updateEma(state.basisState, currentValue, length);
    const rangeEma = updateEma(state.rangeState, span, length);
    if (isNaN(basis) || isNaN(rangeEma)) {
      return [[NaN, NaN, NaN]];
    }
    const upper = basis + rangeEma * mult;
    const lower = basis - rangeEma * mult;
    return [[context.precision(basis), context.precision(upper), context.precision(lower)]];
  };
}

function kcw(context) {
  return (source, _length, _mult, _useTrueRange, _callId) => {
    const length = Series.from(_length).get(0);
    const mult = Series.from(_mult).get(0);
    let useTrueRange = true;
    if (typeof _useTrueRange === "string") {
      _callId = _useTrueRange;
    } else if (_useTrueRange !== void 0) {
      useTrueRange = Series.from(_useTrueRange).get(0);
    }
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `kcw_${length}_${mult}_${useTrueRange}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        basisState: { prevEma: null, initSum: 0, initCount: 0 },
        rangeState: { prevEma: null, initSum: 0, initCount: 0 }
      };
    }
    const state = context.taState[stateKey];
    const updateEma = (emaState, value, period) => {
      if (isNaN(value)) return NaN;
      if (emaState.initCount < period) {
        emaState.initSum += value;
        emaState.initCount++;
        if (emaState.initCount === period) {
          emaState.prevEma = emaState.initSum / period;
          return emaState.prevEma;
        }
        return NaN;
      }
      const alpha = 2 / (period + 1);
      emaState.prevEma = value * alpha + emaState.prevEma * (1 - alpha);
      return emaState.prevEma;
    };
    let span;
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    if (useTrueRange) {
      const close1 = context.get(context.data.close, 1);
      if (isNaN(close1)) {
        span = NaN;
      } else {
        span = Math.max(high - low, Math.abs(high - close1), Math.abs(low - close1));
      }
    } else {
      span = high - low;
    }
    const currentValue = Series.from(source).get(0);
    const basis = updateEma(state.basisState, currentValue, length);
    const rangeEma = updateEma(state.rangeState, span, length);
    if (isNaN(basis) || isNaN(rangeEma)) {
      return NaN;
    }
    if (basis === 0) {
      return context.precision(0);
    }
    const kcw2 = 2 * rangeEma * mult / basis;
    return context.precision(kcw2);
  };
}

function linreg(context) {
  return (source, _length, _offset, _callId) => {
    const length = Series.from(_length).get(0);
    const offset = Series.from(_offset).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `linreg_${length}_${offset}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      state.window.pop();
    }
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    const n = length;
    for (let j = 0; j < length; j++) {
      const x = length - 1 - j;
      const y = state.window[j];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) {
      return NaN;
    }
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    const linRegValue = intercept + slope * (length - 1 - offset);
    return context.precision(linRegValue);
  };
}

function lowest(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `lowest_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      state.window.pop();
    }
    const validValues = state.window.filter((v) => !isNaN(v) && v !== void 0);
    const min = validValues.length > 0 ? Math.min(...validValues) : NaN;
    return context.precision(min);
  };
}

function lowestbars(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    if (context.idx < length - 1) {
      return NaN;
    }
    let minVal = Infinity;
    let minOffset = NaN;
    for (let i = 0; i < length; i++) {
      const val = series.get(i);
      if (isNaN(val)) continue;
      if (isNaN(minOffset) || val < minVal) {
        minVal = val;
        minOffset = -i;
      }
    }
    return minOffset;
  };
}

function macd(context) {
  return (source, _fastLength, _slowLength, _signalLength, _callId) => {
    const fastLength = Series.from(_fastLength).get(0);
    const slowLength = Series.from(_slowLength).get(0);
    const signalLength = Series.from(_signalLength).get(0);
    const baseId = _callId || `macd_${fastLength}_${slowLength}_${signalLength}`;
    const fastEmaId = `${baseId}_fast`;
    const slowEmaId = `${baseId}_slow`;
    const signalEmaId = `${baseId}_signal`;
    const fastMA = context.ta.ema(source, fastLength, fastEmaId);
    const slowMA = context.ta.ema(source, slowLength, slowEmaId);
    let macdLine = NaN;
    if (!isNaN(fastMA) && !isNaN(slowMA)) {
      macdLine = fastMA - slowMA;
    }
    let signalLine = NaN;
    if (!isNaN(macdLine)) {
      signalLine = context.ta.ema(macdLine, signalLength, signalEmaId);
    }
    let histLine = NaN;
    if (!isNaN(macdLine) && !isNaN(signalLine)) {
      histLine = macdLine - signalLine;
    }
    return [[context.precision(macdLine), context.precision(signalLine), context.precision(histLine)]];
  };
}

function median(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `median_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      state.window.pop();
    }
    const sorted = state.window.slice().sort((a, b) => a - b);
    const mid = Math.floor(length / 2);
    const median2 = length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    return context.precision(median2);
  };
}

function mfi(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `mfi_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        upperWindow: [],
        lowerWindow: [],
        upperSum: 0,
        lowerSum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentSrc = Series.from(source).get(0);
    const previousSrc = Series.from(source).get(1);
    const volume = context.get(context.data.volume, 0);
    if (isNaN(currentSrc) || isNaN(volume)) {
      return NaN;
    }
    const change = isNaN(previousSrc) ? NaN : currentSrc - previousSrc;
    let upperComponent = 0;
    let lowerComponent = 0;
    upperComponent = volume * (change <= 0 ? 0 : currentSrc);
    lowerComponent = volume * (change >= 0 ? 0 : currentSrc);
    state.upperWindow.unshift(upperComponent);
    state.lowerWindow.unshift(lowerComponent);
    state.upperSum += upperComponent;
    state.lowerSum += lowerComponent;
    if (state.upperWindow.length < length) {
      return NaN;
    }
    if (state.upperWindow.length > length) {
      const oldUpper = state.upperWindow.pop();
      const oldLower = state.lowerWindow.pop();
      state.upperSum -= oldUpper;
      state.lowerSum -= oldLower;
    }
    if (state.lowerSum === 0) {
      if (state.upperSum === 0) {
        return context.precision(100);
      }
      return context.precision(100);
    }
    if (state.upperSum === 0) {
      return context.precision(0);
    }
    const mfi2 = 100 - 100 / (1 + state.upperSum / state.lowerSum);
    return context.precision(mfi2);
  };
}

function mode(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    if (context.idx < length - 1) {
      return NaN;
    }
    const counts = /* @__PURE__ */ new Map();
    for (let i = 0; i < length; i++) {
      const val = series.get(i);
      if (isNaN(val)) continue;
      counts.set(val, (counts.get(val) || 0) + 1);
    }
    if (counts.size === 0) return NaN;
    let modeVal = NaN;
    let maxFreq = -1;
    for (const [val, freq] of counts.entries()) {
      if (freq > maxFreq) {
        maxFreq = freq;
        modeVal = val;
      } else if (freq === maxFreq) {
        if (val < modeVal) {
          modeVal = val;
        }
      }
    }
    return modeVal;
  };
}

function mom(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    return context.ta.change(source, length);
  };
}

function nvi(context) {
  return (_callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "nvi";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        nvi: 1
      };
    }
    const state = context.taState[stateKey];
    const close = context.get(context.data.close, 0);
    const prevClose = context.get(context.data.close, 1);
    const volume = context.get(context.data.volume, 0);
    const prevVolume = context.get(context.data.volume, 1);
    const c0 = isNaN(close) ? 0 : close;
    const c1 = isNaN(prevClose) ? 0 : prevClose;
    const v0 = isNaN(volume) ? 0 : volume;
    const v1 = isNaN(prevVolume) ? 0 : prevVolume;
    if (c0 === 0 || c1 === 0) ; else {
      if (v0 < v1) {
        const change = (c0 - c1) / c1;
        state.nvi = state.nvi + change * state.nvi;
      }
    }
    return context.precision(state.nvi);
  };
}

function obv(context) {
  return () => {
    if (!context.taState) context.taState = {};
    const stateKey = "obv";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        prevOBV: 0
      };
    }
    const state = context.taState[stateKey];
    const close0 = context.get(context.data.close, 0);
    const volume0 = context.get(context.data.volume, 0);
    const close1 = context.get(context.data.close, 1);
    if (isNaN(close1)) {
      state.prevOBV = 0;
      return context.precision(0);
    }
    let currentOBV;
    if (close0 > close1) {
      currentOBV = state.prevOBV + volume0;
    } else if (close0 < close1) {
      currentOBV = state.prevOBV - volume0;
    } else {
      currentOBV = state.prevOBV;
    }
    state.prevOBV = currentOBV;
    return context.precision(currentOBV);
  };
}

function param(context) {
  return (source, index, name) => {
    if (source instanceof Series) {
      if (index) {
        return new Series(source.data, source.offset + index);
      }
      return source;
    }
    if (!context.params[name]) context.params[name] = [];
    if (Array.isArray(source)) {
      return new Series(source, index || 0);
    } else {
      if (context.params[name].length === 0) {
        context.params[name].push(source);
      } else {
        context.params[name][context.params[name].length - 1] = source;
      }
      return new Series(context.params[name], 0);
    }
  };
}

function percentile_linear_interpolation(context) {
  return (source, _length, _percentage, _callId) => {
    const length = Series.from(_length).get(0);
    const percentage = Series.from(_percentage).get(0);
    const series = Series.from(source);
    if (context.idx < length - 1) {
      return NaN;
    }
    const values = [];
    for (let i = 0; i < length; i++) {
      const val = series.get(i);
      if (isNaN(val)) return NaN;
      values.push(val);
    }
    values.sort((a, b) => a - b);
    let index = percentage / 100 * length - 0.5;
    if (index < 0) index = 0;
    if (index > length - 1) index = length - 1;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    if (lowerIndex === upperIndex) {
      return context.precision(values[lowerIndex]);
    }
    const fraction = index - lowerIndex;
    const result = values[lowerIndex] + fraction * (values[upperIndex] - values[lowerIndex]);
    return context.precision(result);
  };
}

function percentile_nearest_rank(context) {
  return (source, _length, _percentage, _callId) => {
    const length = Series.from(_length).get(0);
    const percentage = Series.from(_percentage).get(0);
    const series = Series.from(source);
    if (context.idx < length - 1) {
      return NaN;
    }
    const values = [];
    for (let i = 0; i < length; i++) {
      const val = series.get(i);
      if (!isNaN(val)) {
        values.push(val);
      }
    }
    if (values.length === 0) return NaN;
    values.sort((a, b) => a - b);
    let index = Math.ceil(percentage / 100 * values.length) - 1;
    if (index < 0) index = 0;
    if (index >= values.length) index = values.length - 1;
    return context.precision(values[index]);
  };
}

function percentrank(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    if (context.idx < length) {
      return NaN;
    }
    const currentValue = series.get(0);
    if (isNaN(currentValue)) return NaN;
    let count = 0;
    let validValues = 0;
    for (let i = 1; i <= length; i++) {
      const val = series.get(i);
      if (isNaN(val)) continue;
      validValues++;
      if (val <= currentValue) {
        count++;
      }
    }
    if (validValues === 0) return NaN;
    return context.precision(count / validValues * 100);
  };
}

function pivothigh$1(source, leftbars, rightbars) {
  const result = new Array(source.length).fill(NaN);
  for (let i = leftbars + rightbars; i < source.length; i++) {
    const pivot = source[i - rightbars];
    let isPivot = true;
    for (let j = 1; j <= leftbars; j++) {
      if (source[i - rightbars - j] >= pivot) {
        isPivot = false;
        break;
      }
    }
    if (isPivot) {
      for (let j = 1; j <= rightbars; j++) {
        if (source[i - rightbars + j] >= pivot) {
          isPivot = false;
          break;
        }
      }
    }
    if (isPivot) {
      result[i] = pivot;
    }
  }
  return result;
}

function pivothigh(context) {
  return (source, _leftbars, _rightbars) => {
    if (_rightbars == void 0) {
      _rightbars = _leftbars;
      _leftbars = source;
      source = context.data.high;
    }
    const leftbars = Series.from(_leftbars).get(0);
    const rightbars = Series.from(_rightbars).get(0);
    const sourceArray = Series.from(source).toArray();
    const result = pivothigh$1(sourceArray, leftbars, rightbars);
    const idx = context.idx;
    return context.precision(result[idx]);
  };
}

function pivotlow$1(source, leftbars, rightbars) {
  const result = new Array(source.length).fill(NaN);
  for (let i = leftbars + rightbars; i < source.length; i++) {
    const pivot = source[i - rightbars];
    let isPivot = true;
    for (let j = 1; j <= leftbars; j++) {
      if (source[i - rightbars - j] <= pivot) {
        isPivot = false;
        break;
      }
    }
    if (isPivot) {
      for (let j = 1; j <= rightbars; j++) {
        if (source[i - rightbars + j] <= pivot) {
          isPivot = false;
          break;
        }
      }
    }
    if (isPivot) {
      result[i] = pivot;
    }
  }
  return result;
}

function pivotlow(context) {
  return (source, _leftbars, _rightbars) => {
    if (_rightbars == void 0) {
      _rightbars = _leftbars;
      _leftbars = source;
      source = context.data.low;
    }
    const leftbars = Series.from(_leftbars).get(0);
    const rightbars = Series.from(_rightbars).get(0);
    const sourceArray = Series.from(source).toArray();
    const result = pivotlow$1(sourceArray, leftbars, rightbars);
    const idx = context.idx;
    return context.precision(result[idx]);
  };
}

function pvi(context) {
  return (_callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "pvi";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        pvi: 1
      };
    }
    const state = context.taState[stateKey];
    const close = context.get(context.data.close, 0);
    const prevClose = context.get(context.data.close, 1);
    const volume = context.get(context.data.volume, 0);
    const prevVolume = context.get(context.data.volume, 1);
    const c0 = isNaN(close) ? 0 : close;
    const c1 = isNaN(prevClose) ? 0 : prevClose;
    const v0 = isNaN(volume) ? 0 : volume;
    const v1 = isNaN(prevVolume) ? 0 : prevVolume;
    if (c0 === 0 || c1 === 0) ; else {
      if (v0 > v1) {
        const change = (c0 - c1) / c1;
        state.pvi = state.pvi + change * state.pvi;
      }
    }
    return context.precision(state.pvi);
  };
}

function pvt(context) {
  return (_callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "pvt";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        cumulativeSum: 0
      };
    }
    const state = context.taState[stateKey];
    const close = context.get(context.data.close, 0);
    const prevClose = context.get(context.data.close, 1);
    const volume = context.get(context.data.volume, 0);
    if (!isNaN(close) && !isNaN(prevClose) && !isNaN(volume) && prevClose !== 0) {
      const term = (close - prevClose) / prevClose * volume;
      state.cumulativeSum += term;
    }
    return context.precision(state.cumulativeSum);
  };
}

function range(context) {
  return (source, _length, _callId) => {
    const h = context.pine.ta.highest(source, _length, (_callId || "range") + "_h");
    const l = context.pine.ta.lowest(source, _length, (_callId || "range") + "_l");
    if (isNaN(h) || isNaN(l)) {
      return NaN;
    }
    return context.precision(h - l);
  };
}

function rising(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    const series = Series.from(source);
    for (let i = 0; i < length; i++) {
      const current = series.get(i);
      const next = series.get(i + 1);
      if (isNaN(current) || isNaN(next)) {
        return false;
      }
      if (current <= next) {
        return false;
      }
    }
    return true;
  };
}

function rma(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `rma_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { prevRma: null, initSum: 0, initCount: 0 };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0) || 0;
    if (state.initCount < period) {
      state.initSum += currentValue;
      state.initCount++;
      if (state.initCount === period) {
        state.prevRma = state.initSum / period;
        return context.precision(state.prevRma);
      }
      return NaN;
    }
    const alpha = 1 / period;
    const rma2 = currentValue * alpha + state.prevRma * (1 - alpha);
    state.prevRma = rma2;
    return context.precision(rma2);
  };
}

function roc(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `roc_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length <= length) {
      return NaN;
    }
    if (state.window.length > length + 1) {
      state.window.pop();
    }
    const prevValue = state.window[length];
    const roc2 = (currentValue - prevValue) / prevValue * 100;
    return context.precision(roc2);
  };
}

function rsi(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `rsi_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        prevValue: null,
        avgGain: 0,
        avgLoss: 0,
        initGains: [],
        initLosses: []
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    if (state.prevValue !== null) {
      const diff = currentValue - state.prevValue;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      if (state.initGains.length < period) {
        state.initGains.push(gain);
        state.initLosses.push(loss);
        if (state.initGains.length === period) {
          state.avgGain = state.initGains.reduce((a, b) => a + b, 0) / period;
          state.avgLoss = state.initLosses.reduce((a, b) => a + b, 0) / period;
          state.prevValue = currentValue;
          const rsi3 = state.avgLoss === 0 ? 100 : 100 - 100 / (1 + state.avgGain / state.avgLoss);
          return context.precision(rsi3);
        }
        state.prevValue = currentValue;
        return NaN;
      }
      state.avgGain = (state.avgGain * (period - 1) + gain) / period;
      state.avgLoss = (state.avgLoss * (period - 1) + loss) / period;
      const rsi2 = state.avgLoss === 0 ? 100 : 100 - 100 / (1 + state.avgGain / state.avgLoss);
      state.prevValue = currentValue;
      return context.precision(rsi2);
    }
    state.prevValue = currentValue;
    return NaN;
  };
}

function sar(context) {
  return (_start, _inc, _max, _callId) => {
    const start = Series.from(_start).get(0);
    const inc = Series.from(_inc).get(0);
    const max = Series.from(_max).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `sar_${start}_${inc}_${max}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        result: NaN,
        maxMin: NaN,
        acceleration: NaN,
        isBelow: false,
        barIndex: 0
        // Internal bar counter to match Pine's bar_index
      };
    }
    const state = context.taState[stateKey];
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const close = context.get(context.data.close, 0);
    const prevClose = context.get(context.data.close, 1);
    const prevHigh = context.get(context.data.high, 1);
    const prevLow = context.get(context.data.low, 1);
    const prevHigh2 = context.get(context.data.high, 2);
    const prevLow2 = context.get(context.data.low, 2);
    if (isNaN(high) || isNaN(low) || isNaN(close)) {
      return NaN;
    }
    let isFirstTrendBar = false;
    if (state.barIndex === 1) {
      if (close > prevClose) {
        state.isBelow = true;
        state.maxMin = high;
        state.result = prevLow;
      } else {
        state.isBelow = false;
        state.maxMin = low;
        state.result = prevHigh;
      }
      isFirstTrendBar = true;
      state.acceleration = start;
    }
    if (state.barIndex >= 1) {
      state.result = state.result + state.acceleration * (state.maxMin - state.result);
      if (state.isBelow) {
        if (state.result > low) {
          isFirstTrendBar = true;
          state.isBelow = false;
          state.result = Math.max(high, state.maxMin);
          state.maxMin = low;
          state.acceleration = start;
        }
      } else {
        if (state.result < high) {
          isFirstTrendBar = true;
          state.isBelow = true;
          state.result = Math.min(low, state.maxMin);
          state.maxMin = high;
          state.acceleration = start;
        }
      }
      if (!isFirstTrendBar) {
        if (state.isBelow) {
          if (high > state.maxMin) {
            state.maxMin = high;
            state.acceleration = Math.min(state.acceleration + inc, max);
          }
        } else {
          if (low < state.maxMin) {
            state.maxMin = low;
            state.acceleration = Math.min(state.acceleration + inc, max);
          }
        }
      }
      if (state.isBelow) {
        state.result = Math.min(state.result, prevLow);
        if (state.barIndex > 1) {
          state.result = Math.min(state.result, prevLow2);
        }
      } else {
        state.result = Math.max(state.result, prevHigh);
        if (state.barIndex > 1) {
          state.result = Math.max(state.result, prevHigh2);
        }
      }
    }
    state.barIndex++;
    if (state.barIndex <= 1) {
      return NaN;
    }
    return context.precision(state.result);
  };
}

function sma(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `sma_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [], sum: 0 };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0) || 0;
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < period) {
      return NaN;
    }
    if (state.window.length > period) {
      const oldValue = state.window.pop();
      state.sum -= oldValue;
    }
    const sma2 = state.sum / period;
    return context.precision(sma2);
  };
}

function stdev(context) {
  return (source, _length, _bias = true, _callId) => {
    const length = Series.from(_length).get(0);
    const bias = Series.from(_bias).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `stdev_${length}_${bias}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [], sum: 0 };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    state.sum += currentValue;
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      const oldValue = state.window.pop();
      state.sum -= oldValue;
    }
    const mean = state.sum / length;
    let sumSquaredDiff = 0;
    for (let i = 0; i < length; i++) {
      sumSquaredDiff += Math.pow(state.window[i] - mean, 2);
    }
    const divisor = bias ? length : length - 1;
    const stdev2 = Math.sqrt(sumSquaredDiff / divisor);
    return context.precision(stdev2);
  };
}

function stoch(context) {
  return (source, high, low, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `stoch_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        highWindow: [],
        lowWindow: []
      };
    }
    const state = context.taState[stateKey];
    const currentSource = Series.from(source).get(0);
    const currentHigh = Series.from(high).get(0);
    const currentLow = Series.from(low).get(0);
    if (isNaN(currentSource) || isNaN(currentHigh) || isNaN(currentLow)) {
      return NaN;
    }
    state.highWindow.unshift(currentHigh);
    state.lowWindow.unshift(currentLow);
    if (state.highWindow.length < length) {
      return NaN;
    }
    if (state.highWindow.length > length) {
      state.highWindow.pop();
      state.lowWindow.pop();
    }
    let highest = state.highWindow[0];
    let lowest = state.lowWindow[0];
    for (let i = 1; i < length; i++) {
      if (state.highWindow[i] > highest) {
        highest = state.highWindow[i];
      }
      if (state.lowWindow[i] < lowest) {
        lowest = state.lowWindow[i];
      }
    }
    const range = highest - lowest;
    if (range === 0) {
      return NaN;
    }
    const stochastic = 100 * (currentSource - lowest) / range;
    return context.precision(stochastic);
  };
}

function supertrend(context) {
  return (_factor, _atrPeriod, _callId) => {
    const factor = Series.from(_factor).get(0);
    const atrPeriod = Series.from(_atrPeriod).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `supertrend_${factor}_${atrPeriod}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        // For ATR calculation (using RMA)
        trWindow: [],
        trSum: 0,
        atrValue: NaN,
        atrCount: 0,
        // For SuperTrend
        prevLowerBand: NaN,
        prevUpperBand: NaN,
        prevSuperTrend: NaN,
        prevDirection: NaN,
        prevClose: NaN
      };
    }
    const state = context.taState[stateKey];
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const close = context.get(context.data.close, 0);
    if (isNaN(high) || isNaN(low) || isNaN(close)) {
      return [[NaN, NaN]];
    }
    const hl2 = (high + low) / 2;
    let tr;
    if (isNaN(state.prevClose)) {
      tr = high - low;
    } else {
      tr = Math.max(high - low, Math.abs(high - state.prevClose), Math.abs(low - state.prevClose));
    }
    state.atrCount++;
    if (state.atrCount <= atrPeriod) {
      state.trWindow.push(tr);
      state.trSum += tr;
      if (state.atrCount === atrPeriod) {
        state.atrValue = state.trSum / atrPeriod;
      }
    } else {
      state.atrValue = (state.atrValue * (atrPeriod - 1) + tr) / atrPeriod;
    }
    const atr = state.atrValue;
    const prevClose = state.prevClose;
    state.prevClose = close;
    if (isNaN(atr)) {
      return [[NaN, NaN]];
    }
    let upperBand = hl2 + factor * atr;
    let lowerBand = hl2 - factor * atr;
    const prevLowerBand = isNaN(state.prevLowerBand) ? 0 : state.prevLowerBand;
    const prevUpperBand = isNaN(state.prevUpperBand) ? 0 : state.prevUpperBand;
    if (!isNaN(state.prevLowerBand)) {
      if (lowerBand > prevLowerBand || prevClose < prevLowerBand) ; else {
        lowerBand = prevLowerBand;
      }
    }
    if (!isNaN(state.prevUpperBand)) {
      if (upperBand < prevUpperBand || prevClose > prevUpperBand) ; else {
        upperBand = prevUpperBand;
      }
    }
    let direction;
    let superTrend;
    const prevSuperTrend = state.prevSuperTrend;
    if (state.atrCount === atrPeriod) {
      direction = 1;
    } else if (prevSuperTrend === state.prevUpperBand) {
      direction = close > upperBand ? -1 : 1;
    } else {
      direction = close < lowerBand ? 1 : -1;
    }
    superTrend = direction === -1 ? lowerBand : upperBand;
    state.prevLowerBand = lowerBand;
    state.prevUpperBand = upperBand;
    state.prevSuperTrend = superTrend;
    state.prevDirection = direction;
    return [[context.precision(superTrend), direction]];
  };
}

function swma(context) {
  return (source, _callId) => {
    const period = 4;
    const weights = [1, 2, 2, 1];
    const weightSum = 6;
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `swma`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        window: []
      };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < period) {
      return NaN;
    }
    if (state.window.length > period) {
      state.window.pop();
    }
    let swma2 = 0;
    for (let i = 0; i < period; i++) {
      swma2 += weights[i] * state.window[period - 1 - i];
    }
    swma2 /= weightSum;
    return context.precision(swma2);
  };
}

function tr(context) {
  return (handle_na, _callId) => {
    let handleNa = true;
    if (typeof handle_na === "string") ; else if (handle_na !== void 0) {
      handleNa = Series.from(handle_na).get(0);
    }
    const high0 = context.get(context.data.high, 0);
    const low0 = context.get(context.data.low, 0);
    const close1 = context.get(context.data.close, 1);
    if (isNaN(close1)) {
      return handleNa ? high0 - low0 : NaN;
    }
    const val = Math.max(high0 - low0, Math.abs(high0 - close1), Math.abs(low0 - close1));
    return val;
  };
}

function tsi(context) {
  return (source, _shortLength, _longLength, _callId) => {
    const shortLength = Series.from(_shortLength).get(0);
    const longLength = Series.from(_longLength).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `tsi_${shortLength}_${longLength}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        // For price change (pc)
        prevSource: NaN,
        // For first EMA of pc (long)
        ema1_pc_multiplier: 2 / (longLength + 1),
        ema1_pc_value: NaN,
        ema1_pc_count: 0,
        ema1_pc_sum: 0,
        // For second EMA of pc (short) - double smoothed
        ema2_pc_multiplier: 2 / (shortLength + 1),
        ema2_pc_value: NaN,
        ema2_pc_count: 0,
        ema2_pc_sum: 0,
        // For first EMA of abs(pc) (long)
        ema1_abs_multiplier: 2 / (longLength + 1),
        ema1_abs_value: NaN,
        ema1_abs_count: 0,
        ema1_abs_sum: 0,
        // For second EMA of abs(pc) (short) - double smoothed
        ema2_abs_multiplier: 2 / (shortLength + 1),
        ema2_abs_value: NaN,
        ema2_abs_count: 0,
        ema2_abs_sum: 0
      };
    }
    const state = context.taState[stateKey];
    const currentSource = Series.from(source).get(0);
    if (isNaN(currentSource)) {
      return NaN;
    }
    const pc = isNaN(state.prevSource) ? NaN : currentSource - state.prevSource;
    state.prevSource = currentSource;
    if (isNaN(pc)) {
      return NaN;
    }
    const absPC = Math.abs(pc);
    state.ema1_pc_count++;
    if (state.ema1_pc_count <= longLength) {
      state.ema1_pc_sum += pc;
      if (state.ema1_pc_count === longLength) {
        state.ema1_pc_value = state.ema1_pc_sum / longLength;
      }
    } else {
      state.ema1_pc_value = pc * state.ema1_pc_multiplier + state.ema1_pc_value * (1 - state.ema1_pc_multiplier);
    }
    state.ema1_abs_count++;
    if (state.ema1_abs_count <= longLength) {
      state.ema1_abs_sum += absPC;
      if (state.ema1_abs_count === longLength) {
        state.ema1_abs_value = state.ema1_abs_sum / longLength;
      }
    } else {
      state.ema1_abs_value = absPC * state.ema1_abs_multiplier + state.ema1_abs_value * (1 - state.ema1_abs_multiplier);
    }
    if (isNaN(state.ema1_pc_value) || isNaN(state.ema1_abs_value)) {
      return NaN;
    }
    state.ema2_pc_count++;
    if (state.ema2_pc_count <= shortLength) {
      state.ema2_pc_sum += state.ema1_pc_value;
      if (state.ema2_pc_count === shortLength) {
        state.ema2_pc_value = state.ema2_pc_sum / shortLength;
      }
    } else {
      state.ema2_pc_value = state.ema1_pc_value * state.ema2_pc_multiplier + state.ema2_pc_value * (1 - state.ema2_pc_multiplier);
    }
    state.ema2_abs_count++;
    if (state.ema2_abs_count <= shortLength) {
      state.ema2_abs_sum += state.ema1_abs_value;
      if (state.ema2_abs_count === shortLength) {
        state.ema2_abs_value = state.ema2_abs_sum / shortLength;
      }
    } else {
      state.ema2_abs_value = state.ema1_abs_value * state.ema2_abs_multiplier + state.ema2_abs_value * (1 - state.ema2_abs_multiplier);
    }
    if (isNaN(state.ema2_pc_value) || isNaN(state.ema2_abs_value)) {
      return NaN;
    }
    if (state.ema2_abs_value === 0) {
      return context.precision(0);
    }
    const tsi2 = state.ema2_pc_value / state.ema2_abs_value;
    return context.precision(tsi2);
  };
}

function valuewhen(context) {
  return (condition, source, _occurrence, _callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "valuewhen";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        values: []
      };
    }
    const state = context.taState[stateKey];
    const cond = Series.from(condition).get(0);
    const val = Series.from(source).get(0);
    const occurrence = Series.from(_occurrence).get(0);
    if (cond) {
      state.values.push(val);
    }
    if (isNaN(occurrence) || occurrence < 0) {
      return NaN;
    }
    const index = state.values.length - 1 - occurrence;
    if (index < 0) {
      return NaN;
    }
    const result = state.values[index];
    if (typeof result === "number") {
      return context.precision(result);
    }
    return result;
  };
}

function variance(context) {
  return (source, _length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `variance_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < length) {
      return NaN;
    }
    if (state.window.length > length) {
      state.window.pop();
    }
    let sum = 0;
    let sumSquares = 0;
    for (let i = 0; i < length; i++) {
      sum += state.window[i];
      sumSquares += state.window[i] * state.window[i];
    }
    const mean = sum / length;
    const variance2 = sumSquares / length - mean * mean;
    return context.precision(variance2);
  };
}

function vwap(context) {
  return (source, _callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `vwap`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        cumulativePV: 0,
        // Cumulative price * volume
        cumulativeVolume: 0,
        // Cumulative volume
        lastSessionDate: null
        // Track last session date
      };
    }
    const state = context.taState[stateKey];
    const currentPrice = Series.from(source).get(0);
    const currentVolume = Series.from(context.data.volume).get(0);
    const currentOpenTime = Series.from(context.data.openTime).get(0);
    const currentDate = new Date(currentOpenTime);
    const currentSessionDate = currentDate.toISOString().slice(0, 10);
    if (state.lastSessionDate !== currentSessionDate) {
      state.cumulativePV = 0;
      state.cumulativeVolume = 0;
      state.lastSessionDate = currentSessionDate;
    }
    state.cumulativePV += currentPrice * currentVolume;
    state.cumulativeVolume += currentVolume;
    if (state.cumulativeVolume === 0) {
      return NaN;
    }
    const vwap2 = state.cumulativePV / state.cumulativeVolume;
    return context.precision(vwap2);
  };
}

function vwma(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `vwma_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [], volumeWindow: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    const currentVolume = context.get(context.data.volume, 0);
    state.window.unshift(currentValue);
    state.volumeWindow.unshift(currentVolume);
    if (state.window.length < period) {
      return NaN;
    }
    if (state.window.length > period) {
      state.window.pop();
      state.volumeWindow.pop();
    }
    let sumVolPrice = 0;
    let sumVol = 0;
    for (let i = 0; i < period; i++) {
      sumVolPrice += state.window[i] * state.volumeWindow[i];
      sumVol += state.volumeWindow[i];
    }
    const vwma2 = sumVolPrice / sumVol;
    return context.precision(vwma2);
  };
}

function wad(context) {
  return (_callId) => {
    if (!context.taState) context.taState = {};
    const stateKey = _callId || "wad";
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        cumulativeSum: 0
      };
    }
    const state = context.taState[stateKey];
    const close = context.get(context.data.close, 0);
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const prevClose = context.get(context.data.close, 1);
    if (isNaN(close) || isNaN(high) || isNaN(low)) {
      return context.precision(state.cumulativeSum);
    }
    let gain = 0;
    if (!isNaN(prevClose)) {
      const trueHigh = Math.max(high, prevClose);
      const trueLow = Math.min(low, prevClose);
      const mom = close - prevClose;
      if (mom > 0) {
        gain = close - trueLow;
      } else if (mom < 0) {
        gain = close - trueHigh;
      }
    }
    state.cumulativeSum += gain;
    return context.precision(state.cumulativeSum);
  };
}

function wma(context) {
  return (source, _period, _callId) => {
    const period = Series.from(_period).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `wma_${period}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = { window: [] };
    }
    const state = context.taState[stateKey];
    const currentValue = Series.from(source).get(0);
    state.window.unshift(currentValue);
    if (state.window.length < period) {
      return NaN;
    }
    if (state.window.length > period) {
      state.window.pop();
    }
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < period; i++) {
      const weight = period - i;
      numerator += state.window[i] * weight;
      denominator += weight;
    }
    const wma2 = numerator / denominator;
    return context.precision(wma2);
  };
}

function wpr(context) {
  return (_length, _callId) => {
    const length = Series.from(_length).get(0);
    if (!context.taState) context.taState = {};
    const stateKey = _callId || `wpr_${length}`;
    if (!context.taState[stateKey]) {
      context.taState[stateKey] = {
        highWindow: [],
        lowWindow: []
      };
    }
    const state = context.taState[stateKey];
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const close = context.get(context.data.close, 0);
    if (isNaN(high) || isNaN(low) || isNaN(close)) {
      return NaN;
    }
    state.highWindow.unshift(high);
    state.lowWindow.unshift(low);
    if (state.highWindow.length < length) {
      return NaN;
    }
    if (state.highWindow.length > length) {
      state.highWindow.pop();
      state.lowWindow.pop();
    }
    let highestHigh = state.highWindow[0];
    let lowestLow = state.lowWindow[0];
    for (let i = 1; i < length; i++) {
      if (state.highWindow[i] > highestHigh) {
        highestHigh = state.highWindow[i];
      }
      if (state.lowWindow[i] < lowestLow) {
        lowestLow = state.lowWindow[i];
      }
    }
    const range = highestHigh - lowestLow;
    if (range === 0) {
      return context.precision(0);
    }
    const wpr2 = (highestHigh - close) / range * -100;
    return context.precision(wpr2);
  };
}

function wvad(context) {
  return (_callId) => {
    const close = context.get(context.data.close, 0);
    const open = context.get(context.data.open, 0);
    const high = context.get(context.data.high, 0);
    const low = context.get(context.data.low, 0);
    const volume = context.get(context.data.volume, 0);
    if (isNaN(close) || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(volume)) {
      return NaN;
    }
    const range = high - low;
    if (range === 0) {
      return context.precision(0);
    }
    const wvad2 = (close - open) / range * volume;
    return context.precision(wvad2);
  };
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
const methods = {
  accdist,
  alma,
  atr,
  barssince,
  bb,
  bbw,
  cci,
  change,
  cmo,
  cog,
  correlation,
  cross,
  crossover,
  crossunder,
  cum,
  dev,
  dmi,
  ema,
  falling,
  highest,
  highestbars,
  hma,
  iii,
  kc,
  kcw,
  linreg,
  lowest,
  lowestbars,
  macd,
  median,
  mfi,
  mode,
  mom,
  nvi,
  obv,
  param,
  percentile_linear_interpolation,
  percentile_nearest_rank,
  percentrank,
  pivothigh,
  pivotlow,
  pvi,
  pvt,
  range,
  rising,
  rma,
  roc,
  rsi,
  sar,
  sma,
  stdev,
  stoch,
  supertrend,
  swma,
  tr,
  tsi,
  valuewhen,
  variance,
  vwap,
  vwma,
  wad,
  wma,
  wpr,
  wvad
};
class TechnicalAnalysis {
  constructor(context) {
    this.context = context;
    __publicField$3(this, "accdist");
    __publicField$3(this, "alma");
    __publicField$3(this, "atr");
    __publicField$3(this, "barssince");
    __publicField$3(this, "bb");
    __publicField$3(this, "bbw");
    __publicField$3(this, "cci");
    __publicField$3(this, "change");
    __publicField$3(this, "cmo");
    __publicField$3(this, "cog");
    __publicField$3(this, "correlation");
    __publicField$3(this, "cross");
    __publicField$3(this, "crossover");
    __publicField$3(this, "crossunder");
    __publicField$3(this, "cum");
    __publicField$3(this, "dev");
    __publicField$3(this, "dmi");
    __publicField$3(this, "ema");
    __publicField$3(this, "falling");
    __publicField$3(this, "highest");
    __publicField$3(this, "highestbars");
    __publicField$3(this, "hma");
    __publicField$3(this, "iii");
    __publicField$3(this, "kc");
    __publicField$3(this, "kcw");
    __publicField$3(this, "linreg");
    __publicField$3(this, "lowest");
    __publicField$3(this, "lowestbars");
    __publicField$3(this, "macd");
    __publicField$3(this, "median");
    __publicField$3(this, "mfi");
    __publicField$3(this, "mode");
    __publicField$3(this, "mom");
    __publicField$3(this, "nvi");
    __publicField$3(this, "obv");
    __publicField$3(this, "param");
    __publicField$3(this, "percentile_linear_interpolation");
    __publicField$3(this, "percentile_nearest_rank");
    __publicField$3(this, "percentrank");
    __publicField$3(this, "pivothigh");
    __publicField$3(this, "pivotlow");
    __publicField$3(this, "pvi");
    __publicField$3(this, "pvt");
    __publicField$3(this, "range");
    __publicField$3(this, "rising");
    __publicField$3(this, "rma");
    __publicField$3(this, "roc");
    __publicField$3(this, "rsi");
    __publicField$3(this, "sar");
    __publicField$3(this, "sma");
    __publicField$3(this, "stdev");
    __publicField$3(this, "stoch");
    __publicField$3(this, "supertrend");
    __publicField$3(this, "swma");
    __publicField$3(this, "tr");
    __publicField$3(this, "tsi");
    __publicField$3(this, "valuewhen");
    __publicField$3(this, "variance");
    __publicField$3(this, "vwap");
    __publicField$3(this, "vwma");
    __publicField$3(this, "wad");
    __publicField$3(this, "wma");
    __publicField$3(this, "wpr");
    __publicField$3(this, "wvad");
    Object.entries(methods).forEach(([name, factory]) => {
      this[name] = factory(context);
    });
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Context = class _Context {
  constructor({
    marketData,
    source,
    tickerId,
    timeframe,
    limit,
    sDate,
    eDate
  }) {
    __publicField$2(this, "data", {
      open: new Series([]),
      high: new Series([]),
      low: new Series([]),
      close: new Series([]),
      volume: new Series([]),
      hl2: new Series([]),
      hlc3: new Series([]),
      ohlc4: new Series([])
    });
    __publicField$2(this, "cache", {});
    __publicField$2(this, "taState", {});
    // State for incremental TA calculations
    __publicField$2(this, "isSecondaryContext", false);
    // Flag to prevent infinite recursion in request.security
    __publicField$2(this, "NA", NaN);
    __publicField$2(this, "lang");
    // Combined namespace and core functions - the default way to access everything
    __publicField$2(this, "pine");
    __publicField$2(this, "idx", 0);
    __publicField$2(this, "params", {});
    __publicField$2(this, "const", {});
    __publicField$2(this, "var", {});
    __publicField$2(this, "let", {});
    __publicField$2(this, "result");
    __publicField$2(this, "plots", {});
    __publicField$2(this, "marketData");
    __publicField$2(this, "source");
    __publicField$2(this, "tickerId");
    __publicField$2(this, "timeframe", "");
    __publicField$2(this, "limit");
    __publicField$2(this, "sDate");
    __publicField$2(this, "eDate");
    __publicField$2(this, "pineTSCode");
    this.marketData = marketData;
    this.source = source;
    this.tickerId = tickerId;
    this.timeframe = timeframe;
    this.limit = limit;
    this.sDate = sDate;
    this.eDate = eDate;
    const core = new Core(this);
    const coreFunctions = {
      plotchar: core.plotchar.bind(core),
      na: core.na.bind(core),
      color: core.color,
      plot: core.plot.bind(core),
      nz: core.nz.bind(core)
    };
    const _this = this;
    this.pine = {
      input: new Input(this),
      ta: new TechnicalAnalysis(this),
      math: new PineMath(this),
      request: new PineRequest(this),
      array: new PineArray(this),
      na: coreFunctions.na,
      plotchar: coreFunctions.plotchar,
      color: coreFunctions.color,
      plot: coreFunctions.plot,
      nz: coreFunctions.nz,
      get bar_index() {
        return _this.idx;
      }
    };
  }
  //#region [Runtime functions] ===========================
  /**
   * this function is used to initialize the target variable with the source array
   * this array will represent a time series and its values will be shifted at runtime in order to mimic Pine script behavior
   * @param trg - the target variable name : used internally to maintain the series in the execution context
   * @param src - the source data, can be Series, array, or a single value
   * @param idx - the index of the source array, used to get a sub-series of the source data
   * @returns Series object
   */
  init(trg, src, idx = 0) {
    let value;
    if (src instanceof Series) {
      value = src.get(0);
    } else if (Array.isArray(src)) {
      if (Array.isArray(src[0])) {
        value = src[0];
      } else {
        value = this.precision(src[src.length - 1 + idx]);
      }
    } else {
      value = this.precision(src);
    }
    if (!trg) {
      return new Series([value]);
    }
    if (trg instanceof Series) {
      trg.data[trg.data.length - 1] = value;
      return trg;
    }
    if (Array.isArray(trg)) {
      trg[trg.length - 1] = value;
      return new Series(trg);
    }
    return new Series([value]);
  }
  /**
   * Initializes a 'var' variable.
   * - First bar: uses the initial value.
   * - Subsequent bars: maintains the previous value (state).
   * @param trg - The target variable
   * @param src - The source initializer value
   * @returns Series object
   */
  initVar(trg, src) {
    if (trg) {
      return trg;
    }
    let value;
    if (src instanceof Series) {
      value = src.get(0);
    } else if (Array.isArray(src)) {
      if (Array.isArray(src[0])) {
        value = src[0];
      } else {
        value = this.precision(src[src.length - 1]);
      }
    } else {
      value = this.precision(src);
    }
    return new Series([value]);
  }
  /**
   * this function is used to set the floating point precision of a number
   * by default it is set to 10 decimals which is the same as pine script
   * @param n - the number to be precision
   * @param decimals - the number of decimals to precision to
   * @returns the precision number
   */
  precision(n, decimals = 10) {
    if (typeof n !== "number" || isNaN(n)) return n;
    return Number(n.toFixed(decimals));
  }
  /**
   * This function is used to apply special transformation to internal PineTS parameters and handle them as time-series
   * @param source - the source data, can be an array or a single value
   * @param index - the index of the source array, used to get a sub-series of the source data
   * @param name - the name of the parameter, used as a unique identifier in the current execution context, this allows us to properly handle the param as a series
   * @returns the current value of the param
   */
  param(source, index, name) {
    if (typeof source === "string") return source;
    if (source instanceof Series) {
      if (index) {
        return new Series(source.data, source.offset + index);
      }
      return source;
    }
    if (!Array.isArray(source) && typeof source === "object") return source;
    if (!this.params[name]) this.params[name] = [];
    if (Array.isArray(source)) {
      return new Series(source, index || 0);
    } else {
      if (this.params[name].length === 0) {
        this.params[name].push(source);
      } else {
        this.params[name][this.params[name].length - 1] = source;
      }
      return new Series(this.params[name], 0);
    }
  }
  /**
   * Access a series value with Pine Script semantics (reverse order)
   * @param source - The source series or array
   * @param index - The lookback index (0 = current value)
   */
  get(source, index) {
    if (source instanceof Series) {
      return source.get(index);
    }
    if (Array.isArray(source)) {
      const realIndex = source.length - 1 - index;
      if (realIndex < 0 || realIndex >= source.length) {
        return NaN;
      }
      return source[realIndex];
    }
    return source;
  }
  /**
   * Set the current value of a series (index 0)
   * @param target - The target series or array
   * @param value - The value to set
   */
  set(target, value) {
    if (target instanceof Series) {
      target.set(0, value);
      return;
    }
    if (Array.isArray(target)) {
      if (target.length > 0) {
        target[target.length - 1] = value;
      } else {
        target.push(value);
      }
      return;
    }
  }
  //#region [Deprecated getters] ===========================
  /**
   * @deprecated Use context.pine.math instead. This will be removed in a future version.
   */
  get math() {
    this._showDeprecationWarning("const math = context.math", "const { math, ta, input } = context.pine");
    return this.pine.math;
  }
  /**
   * @deprecated Use context.pine.ta instead. This will be removed in a future version.
   */
  get ta() {
    this._showDeprecationWarning("const ta = context.ta", "const { ta, math, input } = context.pine");
    return this.pine.ta;
  }
  /**
   * @deprecated Use context.pine.input instead. This will be removed in a future version.
   */
  get input() {
    this._showDeprecationWarning("const input = context.input", "const { input, math, ta } = context.pine");
    return this.pine.input;
  }
  /**
   * @deprecated Use context.pine.request instead. This will be removed in a future version.
   */
  get request() {
    this._showDeprecationWarning("const request = context.request", "const { request, math, ta } = context.pine");
    return this.pine.request;
  }
  /**
   * @deprecated Use context.pine.array instead. This will be removed in a future version.
   */
  get array() {
    this._showDeprecationWarning("const array = context.array", "const { array, math, ta } = context.pine");
    return this.pine.array;
  }
  /**
   * @deprecated Use context.pine.* (e.g., context.pine.na, context.pine.plot) instead. This will be removed in a future version.
   */
  get core() {
    this._showDeprecationWarning("context.core.*", "context.pine (e.g., const { na, plotchar, color, plot, nz } = context.pine)");
    return {
      na: this.pine.na,
      plotchar: this.pine.plotchar,
      color: this.pine.color,
      plot: this.pine.plot,
      nz: this.pine.nz
    };
  }
  /**
   * Shows a deprecation warning once per property access pattern
   */
  _showDeprecationWarning(oldUsage, newUsage) {
    const warningKey = `${oldUsage}->${newUsage}`;
    if (!_Context._deprecationWarningsShown.has(warningKey)) {
      _Context._deprecationWarningsShown.add(warningKey);
      if (typeof window !== "undefined") {
        console.warn(
          "%c[WARNING]%c %s syntax is deprecated. Use %s instead. This will be removed in a future version.",
          "color: #FFA500; font-weight: bold;",
          "color: #FFA500;",
          oldUsage,
          newUsage
        );
      } else {
        console.warn(
          `\x1B[33m[WARNING] ${oldUsage} syntax is deprecated. Use ${newUsage} instead. This will be removed in a future version.\x1B[0m`
        );
      }
    }
  }
  //#endregion
};
// Track deprecation warnings to avoid spam
__publicField$2(_Context, "_deprecationWarningsShown", /* @__PURE__ */ new Set());
let Context = _Context;

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class PineTS {
  constructor(source, tickerId, timeframe, limit, sDate, eDate) {
    this.source = source;
    this.tickerId = tickerId;
    this.timeframe = timeframe;
    this.limit = limit;
    this.sDate = sDate;
    this.eDate = eDate;
    __publicField$1(this, "data", []);
    //#region [Pine Script built-in variables]
    __publicField$1(this, "open", []);
    __publicField$1(this, "high", []);
    __publicField$1(this, "low", []);
    __publicField$1(this, "close", []);
    __publicField$1(this, "volume", []);
    __publicField$1(this, "hl2", []);
    __publicField$1(this, "hlc3", []);
    __publicField$1(this, "ohlc4", []);
    __publicField$1(this, "openTime", []);
    __publicField$1(this, "closeTime", []);
    //#endregion
    //#region run context
    // private _periods: number = undefined;
    // public get periods() {
    //     return this._periods;
    // }
    //#endregion
    //public fn: Function;
    __publicField$1(this, "_readyPromise", null);
    __publicField$1(this, "_ready", false);
    __publicField$1(this, "_debugSettings", {
      ln: false,
      debug: false
    });
    __publicField$1(this, "_transpiledCode", null);
    __publicField$1(this, "_isSecondaryContext", false);
    this._readyPromise = new Promise((resolve) => {
      this.loadMarketData(source, tickerId, timeframe, limit, sDate, eDate).then((data) => {
        const marketData = data;
        this.data = marketData;
        const _open = marketData.map((d) => d.open);
        const _close = marketData.map((d) => d.close);
        const _high = marketData.map((d) => d.high);
        const _low = marketData.map((d) => d.low);
        const _volume = marketData.map((d) => d.volume);
        const _hlc3 = marketData.map((d) => (d.high + d.low + d.close) / 3);
        const _hl2 = marketData.map((d) => (d.high + d.low) / 2);
        const _ohlc4 = marketData.map((d) => (d.high + d.low + d.open + d.close) / 4);
        const _openTime = marketData.map((d) => d.openTime);
        const _closeTime = marketData.map((d) => d.closeTime);
        this.open = _open;
        this.close = _close;
        this.high = _high;
        this.low = _low;
        this.volume = _volume;
        this.hl2 = _hl2;
        this.hlc3 = _hlc3;
        this.ohlc4 = _ohlc4;
        this.openTime = _openTime;
        this.closeTime = _closeTime;
        this._ready = true;
        resolve(true);
      });
    });
  }
  get transpiledCode() {
    return this._transpiledCode;
  }
  markAsSecondary() {
    this._isSecondaryContext = true;
  }
  setDebugSettings({ ln, debug }) {
    this._debugSettings.ln = ln;
    this._debugSettings.debug = debug;
  }
  async loadMarketData(source, tickerId, timeframe, limit, sDate, eDate) {
    if (Array.isArray(source)) {
      return source;
    } else {
      return source.getMarketData(tickerId, timeframe, limit, sDate, eDate);
    }
  }
  async ready() {
    if (this._ready) return true;
    if (!this._readyPromise) throw new Error("PineTS is not ready");
    return this._readyPromise;
  }
  /**
   * Run the Pine Script code and return the resulting context.
   * if pageSize is provided, the function will return an iterator that will yield the results page by page.
   * each page contains the results of "pageSize" periods.
   * @param pineTSCode
   * @param periods
   * @param pageSize
   * @returns Context if pageSize is 0 or undefined, or AsyncGenerator<Context> if pageSize > 0
   */
  run(pineTSCode, periods, pageSize) {
    if (pageSize && pageSize > 0) {
      const enableLiveStream = typeof this.eDate === "undefined" && !Array.isArray(this.source);
      return this._runPaginated(pineTSCode, periods, pageSize, enableLiveStream);
    } else {
      return this._runComplete(pineTSCode, periods);
    }
  }
  /**
   * Run the script completely and return the final context (backward compatible behavior)
   * @private
   */
  async _runComplete(pineTSCode, periods) {
    await this.ready();
    if (!periods) periods = this.data.length;
    const context = this._initializeContext(pineTSCode, this._isSecondaryContext);
    this._transpiledCode = this._transpileCode(pineTSCode);
    await this._executeIterations(context, this._transpiledCode, this.data.length - periods, this.data.length);
    return context;
  }
  /**
   * Run the script with pagination, yielding results page by page
   * Each page contains only the new results for that page, not cumulative results
   * Uses a unified loop that handles both historical and live streaming data
   * @private
   */
  async *_runPaginated(pineTSCode, periods, pageSize, enableLiveStream = false) {
    await this.ready();
    if (!periods) periods = this.data.length;
    const context = this._initializeContext(pineTSCode, this._isSecondaryContext);
    this._transpiledCode = this._transpileCode(pineTSCode);
    const startIdx = this.data.length - periods;
    let processedUpToIdx = startIdx;
    while (true) {
      const availableData = this.data.length;
      const unprocessedCount = availableData - processedUpToIdx;
      if (unprocessedCount > 0) {
        const toProcess = Math.min(unprocessedCount, pageSize);
        const previousResultLength = this._getResultLength(context.result);
        await this._executeIterations(context, this._transpiledCode, processedUpToIdx, processedUpToIdx + toProcess);
        processedUpToIdx += toProcess;
        const pageContext = this._createPageContext(context, previousResultLength);
        yield pageContext;
        continue;
      }
      if (!enableLiveStream || Array.isArray(this.source)) {
        break;
      }
      const { newCandles, updatedLastCandle } = await this._updateMarketData();
      if (newCandles === 0 && !updatedLastCandle) {
        yield null;
        continue;
      }
      this._removeLastResult(context);
      processedUpToIdx = this.data.length - (newCandles + 1);
    }
  }
  /**
   * Get the length of the result (works for arrays and objects)
   * @private
   */
  _getResultLength(result) {
    if (Array.isArray(result)) {
      return result.length;
    } else if (typeof result === "object" && result !== null) {
      const keys = Object.keys(result);
      if (keys.length > 0 && Array.isArray(result[keys[0]])) {
        return result[keys[0]].length;
      }
    }
    return 0;
  }
  /**
   * Create a context containing only the new results for the current page
   * @private
   */
  _createPageContext(fullContext, previousResultLength) {
    const pageContext = new Context({
      marketData: this.data,
      source: this.source,
      tickerId: this.tickerId,
      timeframe: this.timeframe,
      limit: this.limit,
      sDate: this.sDate,
      eDate: this.eDate
    });
    pageContext.pineTSCode = fullContext.pineTSCode;
    pageContext.idx = fullContext.idx;
    if (Array.isArray(fullContext.result)) {
      pageContext.result = fullContext.result.slice(previousResultLength);
    } else if (typeof fullContext.result === "object" && fullContext.result !== null) {
      pageContext.result = {};
      for (let key in fullContext.result) {
        if (Array.isArray(fullContext.result[key])) {
          pageContext.result[key] = fullContext.result[key].slice(previousResultLength);
        } else {
          pageContext.result[key] = fullContext.result[key];
        }
      }
    } else {
      pageContext.result = fullContext.result;
    }
    pageContext.plots = { ...fullContext.plots };
    return pageContext;
  }
  /**
   * Update market data from the last known candle to now (or eDate if provided)
   * Intelligently replaces the last candle if it's still open, or appends new candles
   * @param eDate - Optional end date, defaults to now
   * @returns Object containing: { newCandles: number, updatedLastCandle: boolean }
   * @private
   */
  async _updateMarketData(eDate) {
    if (Array.isArray(this.source)) {
      return { newCandles: 0, updatedLastCandle: false };
    }
    const provider = this.source;
    const lastCandleIdx = this.data.length - 1;
    const lastCandle = this.data[lastCandleIdx];
    const lastCandleOpenTime = lastCandle.openTime;
    try {
      const newData = await provider.getMarketData(this.tickerId, this.timeframe, void 0, lastCandleOpenTime, eDate);
      if (!newData || newData.length === 0) {
        return { newCandles: 0, updatedLastCandle: false };
      }
      let updatedLastCandle = false;
      let newCandles = 0;
      for (let i = 0; i < newData.length; i++) {
        const candle = newData[i];
        if (candle.openTime === lastCandleOpenTime) {
          this._replaceCandle(lastCandleIdx, candle);
          updatedLastCandle = true;
        } else if (candle.openTime > lastCandleOpenTime) {
          this._appendCandle(candle);
          newCandles++;
        }
      }
      return { newCandles, updatedLastCandle };
    } catch (error) {
      console.error("Error updating market data:", error);
      return { newCandles: 0, updatedLastCandle: false };
    }
  }
  /**
   * Replace a candle at a specific index with new data
   * @private
   */
  _replaceCandle(index, candle) {
    this.data[index] = candle;
    this.open[index] = candle.open;
    this.close[index] = candle.close;
    this.high[index] = candle.high;
    this.low[index] = candle.low;
    this.volume[index] = candle.volume;
    this.hl2[index] = (candle.high + candle.low) / 2;
    this.hlc3[index] = (candle.high + candle.low + candle.close) / 3;
    this.ohlc4[index] = (candle.high + candle.low + candle.open + candle.close) / 4;
    this.openTime[index] = candle.openTime;
    this.closeTime[index] = candle.closeTime;
  }
  /**
   * Append a new candle to the end of market data arrays
   * @private
   */
  _appendCandle(candle) {
    this.data.push(candle);
    this.open.push(candle.open);
    this.close.push(candle.close);
    this.high.push(candle.high);
    this.low.push(candle.low);
    this.volume.push(candle.volume);
    this.hl2.push((candle.high + candle.low) / 2);
    this.hlc3.push((candle.high + candle.low + candle.close) / 3);
    this.ohlc4.push((candle.high + candle.low + candle.open + candle.close) / 4);
    this.openTime.push(candle.openTime);
    this.closeTime.push(candle.closeTime);
  }
  /**
   * Remove the last result from context (for updating an open candle)
   * @private
   */
  _removeLastResult(context) {
    if (Array.isArray(context.result)) {
      context.result.pop();
    } else if (typeof context.result === "object" && context.result !== null) {
      for (let key in context.result) {
        if (Array.isArray(context.result[key])) {
          context.result[key].pop();
        }
      }
    }
    context.data.close.data.pop();
    context.data.open.data.pop();
    context.data.high.data.pop();
    context.data.low.data.pop();
    context.data.volume.data.pop();
    context.data.hl2.data.pop();
    context.data.hlc3.data.pop();
    context.data.ohlc4.data.pop();
    context.data.openTime.data.pop();
    if (context.data.closeTime) {
      context.data.closeTime.data.pop();
    }
  }
  /**
   * Initialize a new context for running Pine Script code
   * @private
   */
  _initializeContext(pineTSCode, isSecondary = false) {
    const context = new Context({
      marketData: this.data,
      source: this.source,
      tickerId: this.tickerId,
      timeframe: this.timeframe,
      limit: this.limit,
      sDate: this.sDate,
      eDate: this.eDate
    });
    context.pineTSCode = pineTSCode;
    context.isSecondaryContext = isSecondary;
    context.data.close = new Series([]);
    context.data.open = new Series([]);
    context.data.high = new Series([]);
    context.data.low = new Series([]);
    context.data.volume = new Series([]);
    context.data.hl2 = new Series([]);
    context.data.hlc3 = new Series([]);
    context.data.ohlc4 = new Series([]);
    context.data.openTime = new Series([]);
    context.data.closeTime = new Series([]);
    return context;
  }
  /**
   * Transpile the Pine Script code
   * @private
   */
  _transpileCode(pineTSCode) {
    const transformer = transpile.bind(this);
    return transformer(pineTSCode, this._debugSettings);
  }
  /**
   * Execute iterations from startIdx to endIdx, updating the context
   * @private
   */
  async _executeIterations(context, transpiledFn, startIdx, endIdx) {
    const contextVarNames = ["const", "var", "let", "params"];
    for (let i = startIdx; i < endIdx; i++) {
      context.idx = i;
      context.data.close.data.push(this.close[i]);
      context.data.open.data.push(this.open[i]);
      context.data.high.data.push(this.high[i]);
      context.data.low.data.push(this.low[i]);
      context.data.volume.data.push(this.volume[i]);
      context.data.hl2.data.push(this.hl2[i]);
      context.data.hlc3.data.push(this.hlc3[i]);
      context.data.ohlc4.data.push(this.ohlc4[i]);
      context.data.openTime.data.push(this.openTime[i]);
      context.data.closeTime.data.push(this.closeTime[i]);
      const result = await transpiledFn(context);
      if (typeof result === "object") {
        if (typeof context.result !== "object") {
          context.result = {};
        }
        for (let key in result) {
          if (context.result[key] === void 0) {
            context.result[key] = [];
          }
          let val;
          if (result[key] instanceof Series) {
            val = result[key].get(0);
          } else if (Array.isArray(result[key])) {
            val = result[key][result[key].length - 1];
          } else {
            val = result[key];
          }
          context.result[key].push(val);
        }
      } else {
        if (!Array.isArray(context.result)) {
          context.result = [];
        }
        context.result.push(result);
      }
      for (let ctxVarName of contextVarNames) {
        for (let key in context[ctxVarName]) {
          const item = context[ctxVarName][key];
          if (item instanceof Series) {
            const val = item.get(0);
            item.data.push(val);
          } else if (Array.isArray(item)) {
            const val = item[item.length - 1];
            item.push(val);
          }
        }
      }
    }
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const BINANCE_API_URL = "https://api.binance.com/api/v3";
const timeframe_to_binance = {
  "1": "1m",
  // 1 minute
  "3": "3m",
  // 3 minutes
  "5": "5m",
  // 5 minutes
  "15": "15m",
  // 15 minutes
  "30": "30m",
  // 30 minutes
  "45": null,
  // 45 minutes (not directly supported by Binance, needs custom handling)
  "60": "1h",
  // 1 hour
  "120": "2h",
  // 2 hours
  "180": null,
  // 3 hours (not directly supported by Binance, needs custom handling)
  "240": "4h",
  // 4 hours
  "4H": "4h",
  // 4 hours
  "1D": "1d",
  // 1 day
  D: "1d",
  // 1 day
  "1W": "1w",
  // 1 week
  W: "1w",
  // 1 week
  "1M": "1M",
  // 1 month
  M: "1M"
  // 1 month
};
class CacheManager {
  constructor(cacheDuration = 5 * 60 * 1e3) {
    __publicField(this, "cache");
    __publicField(this, "cacheDuration");
    this.cache = /* @__PURE__ */ new Map();
    this.cacheDuration = cacheDuration;
  }
  generateKey(params) {
    return Object.entries(params).filter(([_, value]) => value !== void 0).map(([key, value]) => `${key}:${value}`).join("|");
  }
  get(params) {
    const key = this.generateKey(params);
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }
  set(params, data) {
    const key = this.generateKey(params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  clear() {
    this.cache.clear();
  }
  // Optional: method to remove expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheDuration) {
        this.cache.delete(key);
      }
    }
  }
}
class BinanceProvider {
  constructor() {
    __publicField(this, "cacheManager");
    this.cacheManager = new CacheManager(5 * 60 * 1e3);
  }
  async getMarketDataInterval(tickerId, timeframe, sDate, eDate) {
    try {
      const interval = timeframe_to_binance[timeframe.toUpperCase()];
      if (!interval) {
        console.error(`Unsupported timeframe: ${timeframe}`);
        return [];
      }
      const timeframeDurations = {
        "1m": 60 * 1e3,
        "3m": 3 * 60 * 1e3,
        "5m": 5 * 60 * 1e3,
        "15m": 15 * 60 * 1e3,
        "30m": 30 * 60 * 1e3,
        "1h": 60 * 60 * 1e3,
        "2h": 2 * 60 * 60 * 1e3,
        "4h": 4 * 60 * 60 * 1e3,
        "1d": 24 * 60 * 60 * 1e3,
        "1w": 7 * 24 * 60 * 60 * 1e3,
        "1M": 30 * 24 * 60 * 60 * 1e3
      };
      let allData = [];
      let currentStart = sDate;
      const endTime = eDate;
      const intervalDuration = timeframeDurations[interval];
      if (!intervalDuration) {
        console.error(`Duration not defined for interval: ${interval}`);
        return [];
      }
      while (currentStart < endTime) {
        const chunkEnd = Math.min(currentStart + 1e3 * intervalDuration, endTime);
        const data = await this.getMarketData(
          tickerId,
          timeframe,
          1e3,
          // Max allowed by Binance
          currentStart,
          chunkEnd
        );
        if (data.length === 0) break;
        allData = allData.concat(data);
        currentStart = data[data.length - 1].closeTime + 1;
      }
      return allData;
    } catch (error) {
      console.error("Error in getMarketDataInterval:", error);
      return [];
    }
  }
  async getMarketData(tickerId, timeframe, limit, sDate, eDate) {
    try {
      const cacheParams = { tickerId, timeframe, limit, sDate, eDate };
      const cachedData = this.cacheManager.get(cacheParams);
      if (cachedData) {
        return cachedData;
      }
      const interval = timeframe_to_binance[timeframe.toUpperCase()];
      if (!interval) {
        console.error(`Unsupported timeframe: ${timeframe}`);
        return [];
      }
      const needsPagination = this.shouldPaginate(timeframe, limit, sDate, eDate);
      if (needsPagination && sDate && eDate) {
        const allData = await this.getMarketDataInterval(tickerId, timeframe, sDate, eDate);
        const result2 = limit ? allData.slice(0, limit) : allData;
        this.cacheManager.set(cacheParams, result2);
        return result2;
      }
      let url = `${BINANCE_API_URL}/klines?symbol=${tickerId}&interval=${interval}`;
      if (limit) {
        url += `&limit=${Math.min(limit, 1e3)}`;
      }
      if (sDate) {
        url += `&startTime=${sDate}`;
      }
      if (eDate) {
        url += `&endTime=${eDate}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data = result.map((item) => {
        return {
          openTime: parseInt(item[0]),
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5]),
          closeTime: parseInt(item[6]),
          quoteAssetVolume: parseFloat(item[7]),
          numberOfTrades: parseInt(item[8]),
          takerBuyBaseAssetVolume: parseFloat(item[9]),
          takerBuyQuoteAssetVolume: parseFloat(item[10]),
          ignore: item[11]
        };
      });
      this.cacheManager.set(cacheParams, data);
      return data;
    } catch (error) {
      console.error("Error in binance.klines:", error);
      return [];
    }
  }
  /**
   * Determines if pagination is needed based on the parameters
   */
  shouldPaginate(timeframe, limit, sDate, eDate) {
    if (limit && limit > 1e3) {
      return true;
    }
    if (sDate && eDate) {
      const interval = timeframe_to_binance[timeframe.toUpperCase()];
      const timeframeDurations = {
        "1m": 60 * 1e3,
        "3m": 3 * 60 * 1e3,
        "5m": 5 * 60 * 1e3,
        "15m": 15 * 60 * 1e3,
        "30m": 30 * 60 * 1e3,
        "1h": 60 * 60 * 1e3,
        "2h": 2 * 60 * 60 * 1e3,
        "4h": 4 * 60 * 60 * 1e3,
        "1d": 24 * 60 * 60 * 1e3,
        "1w": 7 * 24 * 60 * 60 * 1e3,
        "1M": 30 * 24 * 60 * 60 * 1e3
      };
      const intervalDuration = timeframeDurations[interval];
      if (intervalDuration) {
        const requiredCandles = Math.ceil((eDate - sDate) / intervalDuration);
        return requiredCandles > 1e3;
      }
    }
    return false;
  }
}

typeof process !== "undefined" && process.versions && process.versions.node;
const Provider = {
  Binance: new BinanceProvider()
  // Only include Mock provider in Node.js environments (excluded from browser builds)
  // ...(MockProviderInstance ? { Mock: MockProviderInstance } : {}),
  //TODO : add other providers (polygon, etc.)
};

export { Context, PineTS, Provider, transpile };
//# sourceMappingURL=pinets.dev.es.js.map
