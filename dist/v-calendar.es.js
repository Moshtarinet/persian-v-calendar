import { openBlock, createBlock, Transition, withCtx, renderSlot, h, reactive, computed, createElementBlock, createElementVNode, normalizeStyle, normalizeClass, createCommentVNode, createTextVNode, toDisplayString, resolveComponent, createVNode, Fragment, renderList, mergeProps, withModifiers } from "vue";
import { createPopper } from "@popperjs/core";
const PERSIAN_EPOCH = 1948320;
const PERSIAN_NUM_DAYS = [
  0,
  31,
  62,
  93,
  124,
  155,
  186,
  216,
  246,
  276,
  306,
  336
];
function toJalali(gy, gm, gd) {
  return d2j$1(g2d$1(gy, gm, gd));
}
function toGregorian$2(jy, jm, jd) {
  return d2g$1(j2d$1(jy, jm, jd));
}
function j2d$1(jy, jm, jd) {
  const [ny, nm] = normalizeMonth(jy, jm);
  jy = ny;
  jm = nm;
  const month = jm - 1;
  const year = jy;
  const day = jd;
  let julianDay = PERSIAN_EPOCH - 1 + 365 * (year - 1) + div$2(8 * year + 21, 33);
  if (month != 0) {
    julianDay += PERSIAN_NUM_DAYS[month];
  }
  return julianDay + day;
}
function d2j$1(julianDay) {
  if (isNaN(julianDay)) {
    return { jy: NaN, jm: NaN, jd: NaN };
  }
  let month, dayOfYear;
  const daysSinceEpoch = julianDay - PERSIAN_EPOCH;
  let year = 1 + div$2(33 * daysSinceEpoch + 3, 12053);
  dayOfYear = daysSinceEpoch - (365 * (year - 1) + div$2(8 * year + 21, 33));
  if (dayOfYear < 0) {
    year--;
    dayOfYear = daysSinceEpoch - (365 * (year - 1) + div$2(8 * year + 21, 33));
  }
  if (dayOfYear < 216) {
    month = div$2(dayOfYear, 31);
  } else {
    month = div$2(dayOfYear - 6, 30);
  }
  const dayOfMonth = dayOfYear - PERSIAN_NUM_DAYS[month] + 1;
  dayOfYear++;
  const jy = year;
  const jm = month + 1;
  const jd = dayOfMonth;
  return { jy, jm, jd };
}
function g2d$1(gy, gm, gd) {
  const [ny, nm] = normalizeMonth(gy, gm);
  gy = ny;
  gm = nm;
  return div$2(1461 * (gy + 4800 + div$2(gm - 14, 12)), 4) + div$2(367 * (gm - 2 - 12 * div$2(gm - 14, 12)), 12) - div$2(3 * div$2(gy + 4900 + div$2(gm - 14, 12), 100), 4) + gd - 32075;
}
function d2g$1(jdn) {
  if (isNaN(jdn)) {
    return { gy: NaN, gm: NaN, gd: NaN };
  }
  let L = jdn + 68569;
  const n = div$2(4 * L, 146097);
  L = L - div$2(146097 * n + 3, 4);
  const i = div$2(4e3 * (L + 1), 1461001);
  L = L - div$2(1461 * i, 4) + 31;
  const j = div$2(80 * L, 2447);
  const gd = L - div$2(2447 * j, 80);
  L = div$2(j, 11);
  const gm = j + 2 - 12 * L;
  const gy = 100 * (n - 49) + i + L;
  return { gy, gm, gd };
}
function normalizeMonth(year, month) {
  month = month - 1;
  if (month < 0) {
    const old_month = month;
    month = pmod(month, 12);
    year -= div$2(month - old_month, 12);
  }
  if (month > 11) {
    year += div$2(month, 12);
    month = mod$2(month, 12);
  }
  return [year, month + 1];
}
function div$2(a, b) {
  return ~~(a / b);
}
function mod$2(a, b) {
  return a - ~~(a / b) * b;
}
function pmod(a, b) {
  return mod$2(mod$2(a, b) + b, b);
}
function newDate(...args) {
  if (args.length > 1) {
    const [year, month, day = 1, ...rest] = args;
    const g = toGregorian$2(year, month + 1, day);
    return new Date(...[g.gy, g.gm - 1, g.gd, ...rest]);
  }
  return new Date(...args);
}
function toDate$1(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return newDate(argument);
  } else {
    return newDate(NaN);
  }
}
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return newDate(value);
  }
}
function getDate(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jd;
}
function setDate$1(cleanDate, ...args) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  const j = toJalali(gy, gm, gd);
  const [date] = args;
  const g = toGregorian$2(j.jy, j.jm, date);
  return cleanDate.setFullYear(g.gy, g.gm - 1, g.gd);
}
function addDays$1(date, amount) {
  const _date = toDate$1(date);
  if (isNaN(amount))
    return constructFrom(date, NaN);
  if (!amount) {
    return _date;
  }
  setDate$1(_date, getDate(_date) + amount);
  return _date;
}
function getMonth$1(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jm - 1;
}
function setMonth(cleanDate, ...args) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  const j = toJalali(gy, gm, gd);
  const [month, date = j.jd] = args;
  const g = toGregorian$2(j.jy, month + 1, date);
  return cleanDate.setFullYear(g.gy, g.gm - 1, g.gd);
}
function getFullYear(cleanDate) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  return toJalali(gy, gm, gd).jy;
}
function setFullYear(cleanDate, ...args) {
  const gd = cleanDate.getDate();
  const gm = cleanDate.getMonth() + 1;
  const gy = cleanDate.getFullYear();
  const j = toJalali(gy, gm, gd);
  const [year, month = j.jm - 1, date = j.jd] = args;
  const g = toGregorian$2(year, month + 1, date);
  return cleanDate.setFullYear(g.gy, g.gm - 1, g.gd);
}
function addMonths(date, amount) {
  const _date = toDate$1(date);
  if (isNaN(amount))
    return constructFrom(date, NaN);
  if (!amount) {
    return _date;
  }
  const dayOfMonth = getDate(_date);
  const endOfDesiredMonth = constructFrom(date, _date.getTime());
  setMonth(endOfDesiredMonth, getMonth$1(_date) + amount + 1, 0);
  const daysInMonth = getDate(endOfDesiredMonth);
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    setFullYear(
      _date,
      getFullYear(endOfDesiredMonth),
      getMonth$1(endOfDesiredMonth),
      dayOfMonth
    );
    return _date;
  }
}
function addYears(date, amount) {
  return addMonths(date, amount * 12);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$8 = freeGlobal || freeSelf || Function("return this")();
var _root = root$8;
var root$7 = _root;
var Symbol$7 = root$7.Symbol;
var _Symbol = Symbol$7;
var Symbol$6 = _Symbol;
var objectProto$h = Object.prototype;
var hasOwnProperty$e = objectProto$h.hasOwnProperty;
var nativeObjectToString$1 = objectProto$h.toString;
var symToStringTag$1 = Symbol$6 ? Symbol$6.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$e.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto$g = Object.prototype;
var nativeObjectToString = objectProto$g.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$5 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$5 ? Symbol$5.toStringTag : void 0;
function baseGetTag$a(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$a;
function isObjectLike$d(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$d;
var baseGetTag$9 = _baseGetTag, isObjectLike$c = isObjectLike_1;
var boolTag$4 = "[object Boolean]";
function isBoolean(value) {
  return value === true || value === false || isObjectLike$c(value) && baseGetTag$9(value) == boolTag$4;
}
var isBoolean_1 = isBoolean;
var baseGetTag$8 = _baseGetTag, isObjectLike$b = isObjectLike_1;
var numberTag$4 = "[object Number]";
function isNumber(value) {
  return typeof value == "number" || isObjectLike$b(value) && baseGetTag$8(value) == numberTag$4;
}
var isNumber_1 = isNumber;
var isArray$f = Array.isArray;
var isArray_1 = isArray$f;
var baseGetTag$7 = _baseGetTag, isArray$e = isArray_1, isObjectLike$a = isObjectLike_1;
var stringTag$4 = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray$e(value) && isObjectLike$a(value) && baseGetTag$7(value) == stringTag$4;
}
var isString_1 = isString;
function isObject$d(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$d;
var baseGetTag$6 = _baseGetTag, isObject$c = isObject_1;
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$3(value) {
  if (!isObject$c(value)) {
    return false;
  }
  var tag = baseGetTag$6(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$3;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength$3(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}
var isLength_1 = isLength$3;
var isFunction$2 = isFunction_1, isLength$2 = isLength_1;
function isArrayLike$6(value) {
  return value != null && isLength$2(value.length) && !isFunction$2(value);
}
var isArrayLike_1 = isArrayLike$6;
var isArrayLike$5 = isArrayLike_1, isObjectLike$9 = isObjectLike_1;
function isArrayLikeObject$1(value) {
  return isObjectLike$9(value) && isArrayLike$5(value);
}
var isArrayLikeObject_1 = isArrayLikeObject$1;
function isUndefined(value) {
  return value === void 0;
}
var isUndefined_1 = isUndefined;
var baseGetTag$5 = _baseGetTag, isObjectLike$8 = isObjectLike_1;
var dateTag$4 = "[object Date]";
function baseIsDate$1(value) {
  return isObjectLike$8(value) && baseGetTag$5(value) == dateTag$4;
}
var _baseIsDate = baseIsDate$1;
function baseUnary$4(func) {
  return function(value) {
    return func(value);
  };
}
var _baseUnary = baseUnary$4;
var _nodeUtil = { exports: {} };
(function(module, exports) {
  var freeGlobal2 = _freeGlobal;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  module.exports = nodeUtil2;
})(_nodeUtil, _nodeUtil.exports);
var baseIsDate = _baseIsDate, baseUnary$3 = _baseUnary, nodeUtil$3 = _nodeUtil.exports;
var nodeIsDate = nodeUtil$3 && nodeUtil$3.isDate;
var isDate$2 = nodeIsDate ? baseUnary$3(nodeIsDate) : baseIsDate;
var isDate_1 = isDate$2;
function baseClamp$1(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
var _baseClamp = baseClamp$1;
var reWhitespace = /\s/;
function trimmedEndIndex$1(string) {
  var index2 = string.length;
  while (index2-- && reWhitespace.test(string.charAt(index2))) {
  }
  return index2;
}
var _trimmedEndIndex = trimmedEndIndex$1;
var trimmedEndIndex = _trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim$1(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
var _baseTrim = baseTrim$1;
var baseGetTag$4 = _baseGetTag, isObjectLike$7 = isObjectLike_1;
var symbolTag$3 = "[object Symbol]";
function isSymbol$4(value) {
  return typeof value == "symbol" || isObjectLike$7(value) && baseGetTag$4(value) == symbolTag$3;
}
var isSymbol_1 = isSymbol$4;
var baseTrim = _baseTrim, isObject$b = isObject_1, isSymbol$3 = isSymbol_1;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol$3(value)) {
    return NAN;
  }
  if (isObject$b(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$b(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_1 = toNumber$1;
var baseClamp = _baseClamp, toNumber = toNumber_1;
function clamp(number, lower, upper) {
  if (upper === void 0) {
    upper = lower;
    lower = void 0;
  }
  if (upper !== void 0) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== void 0) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}
var clamp_1 = clamp;
var isArray$d = isArray_1, isSymbol$2 = isSymbol_1;
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey$3(value, object) {
  if (isArray$d(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol$2(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var _isKey = isKey$3;
var root$6 = _root;
var coreJsData$1 = root$6["__core-js_shared__"];
var _coreJsData = coreJsData$1;
var coreJsData = _coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked$1;
var funcProto$2 = Function.prototype;
var funcToString$2 = funcProto$2.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$1 = isFunction_1, isMasked = _isMasked, isObject$a = isObject_1, toSource$1 = _toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$f = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$d = objectProto$f.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$d).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative$1(value) {
  if (!isObject$a(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue$1;
var baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$7(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var _getNative = getNative$7;
var getNative$6 = _getNative;
var nativeCreate$4 = getNative$6(Object, "create");
var _nativeCreate = nativeCreate$4;
var nativeCreate$3 = _nativeCreate;
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}
var _hashClear = hashClear$1;
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete$1;
var nativeCreate$2 = _nativeCreate;
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$e = Object.prototype;
var hasOwnProperty$c = objectProto$e.hasOwnProperty;
function hashGet$1(key) {
  var data2 = this.__data__;
  if (nativeCreate$2) {
    var result = data2[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$c.call(data2, key) ? data2[key] : void 0;
}
var _hashGet = hashGet$1;
var nativeCreate$1 = _nativeCreate;
var objectProto$d = Object.prototype;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
function hashHas$1(key) {
  var data2 = this.__data__;
  return nativeCreate$1 ? data2[key] !== void 0 : hasOwnProperty$b.call(data2, key);
}
var _hashHas = hashHas$1;
var nativeCreate = _nativeCreate;
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet$1(key, value) {
  var data2 = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data2[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
var _hashSet = hashSet$1;
var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
function Hash$1(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash$1.prototype.clear = hashClear;
Hash$1.prototype["delete"] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;
var _Hash = Hash$1;
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear$1;
function eq$6(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$6;
var eq$5 = eq_1;
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$5(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf$4;
var assocIndexOf$3 = _assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete$1(key) {
  var data2 = this.__data__, index2 = assocIndexOf$3(data2, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data2.length - 1;
  if (index2 == lastIndex) {
    data2.pop();
  } else {
    splice.call(data2, index2, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete$1;
var assocIndexOf$2 = _assocIndexOf;
function listCacheGet$1(key) {
  var data2 = this.__data__, index2 = assocIndexOf$2(data2, key);
  return index2 < 0 ? void 0 : data2[index2][1];
}
var _listCacheGet = listCacheGet$1;
var assocIndexOf$1 = _assocIndexOf;
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas$1;
var assocIndexOf = _assocIndexOf;
function listCacheSet$1(key, value) {
  var data2 = this.__data__, index2 = assocIndexOf(data2, key);
  if (index2 < 0) {
    ++this.size;
    data2.push([key, value]);
  } else {
    data2[index2][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet$1;
var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
function ListCache$4(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype["delete"] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;
var _ListCache = ListCache$4;
var getNative$5 = _getNative, root$5 = _root;
var Map$3 = getNative$5(root$5, "Map");
var _Map = Map$3;
var Hash = _Hash, ListCache$3 = _ListCache, Map$2 = _Map;
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$2 || ListCache$3)(),
    "string": new Hash()
  };
}
var _mapCacheClear = mapCacheClear$1;
function isKeyable$1(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable = isKeyable$1;
var isKeyable = _isKeyable;
function getMapData$4(map2, key) {
  var data2 = map2.__data__;
  return isKeyable(key) ? data2[typeof key == "string" ? "string" : "hash"] : data2.map;
}
var _getMapData = getMapData$4;
var getMapData$3 = _getMapData;
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete$1;
var getMapData$2 = _getMapData;
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}
var _mapCacheGet = mapCacheGet$1;
var getMapData$1 = _getMapData;
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}
var _mapCacheHas = mapCacheHas$1;
var getMapData = _getMapData;
function mapCacheSet$1(key, value) {
  var data2 = getMapData(this, key), size = data2.size;
  data2.set(key, value);
  this.size += data2.size == size ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet$1;
var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
function MapCache$3(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache$3.prototype.clear = mapCacheClear;
MapCache$3.prototype["delete"] = mapCacheDelete;
MapCache$3.prototype.get = mapCacheGet;
MapCache$3.prototype.has = mapCacheHas;
MapCache$3.prototype.set = mapCacheSet;
var _MapCache = MapCache$3;
var MapCache$2 = _MapCache;
var FUNC_ERROR_TEXT = "Expected a function";
function memoize$1(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2)();
  return memoized;
}
memoize$1.Cache = MapCache$2;
var memoize_1 = memoize$1;
var memoize = memoize_1;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped$1(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var _memoizeCapped = memoizeCapped$1;
var memoizeCapped = _memoizeCapped;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath$1 = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match2, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
  });
  return result;
});
var _stringToPath = stringToPath$1;
function arrayMap$4(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index2 < length) {
    result[index2] = iteratee(array[index2], index2, array);
  }
  return result;
}
var _arrayMap = arrayMap$4;
var Symbol$4 = _Symbol, arrayMap$3 = _arrayMap, isArray$c = isArray_1, isSymbol$1 = isSymbol_1;
var INFINITY$1 = 1 / 0;
var symbolProto$2 = Symbol$4 ? Symbol$4.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
function baseToString$1(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray$c(value)) {
    return arrayMap$3(value, baseToString$1) + "";
  }
  if (isSymbol$1(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
var _baseToString = baseToString$1;
var baseToString = _baseToString;
function toString$1(value) {
  return value == null ? "" : baseToString(value);
}
var toString_1 = toString$1;
var isArray$b = isArray_1, isKey$2 = _isKey, stringToPath = _stringToPath, toString = toString_1;
function castPath$6(value, object) {
  if (isArray$b(value)) {
    return value;
  }
  return isKey$2(value, object) ? [value] : stringToPath(toString(value));
}
var _castPath = castPath$6;
var isSymbol = isSymbol_1;
var INFINITY = 1 / 0;
function toKey$6(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var _toKey = toKey$6;
var castPath$5 = _castPath, toKey$5 = _toKey;
function baseGet$4(object, path) {
  path = castPath$5(path, object);
  var index2 = 0, length = path.length;
  while (object != null && index2 < length) {
    object = object[toKey$5(path[index2++])];
  }
  return index2 && index2 == length ? object : void 0;
}
var _baseGet = baseGet$4;
var baseGet$3 = _baseGet;
function get$1(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet$3(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_1 = get$1;
var getNative$4 = _getNative;
var defineProperty$2 = function() {
  try {
    var func = getNative$4(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var _defineProperty = defineProperty$2;
var defineProperty$1 = _defineProperty;
function baseAssignValue$4(object, key, value) {
  if (key == "__proto__" && defineProperty$1) {
    defineProperty$1(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var _baseAssignValue = baseAssignValue$4;
var baseAssignValue$3 = _baseAssignValue, eq$4 = eq_1;
var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
function assignValue$3(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$a.call(object, key) && eq$4(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue$3(object, key, value);
  }
}
var _assignValue = assignValue$3;
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex$4(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var _isIndex = isIndex$4;
var assignValue$2 = _assignValue, castPath$4 = _castPath, isIndex$3 = _isIndex, isObject$9 = isObject_1, toKey$4 = _toKey;
function baseSet$2(object, path, value, customizer) {
  if (!isObject$9(object)) {
    return object;
  }
  path = castPath$4(path, object);
  var index2 = -1, length = path.length, lastIndex = length - 1, nested = object;
  while (nested != null && ++index2 < length) {
    var key = toKey$4(path[index2]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    if (index2 != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject$9(objValue) ? objValue : isIndex$3(path[index2 + 1]) ? [] : {};
      }
    }
    assignValue$2(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var _baseSet = baseSet$2;
var baseSet$1 = _baseSet;
function set(object, path, value) {
  return object == null ? object : baseSet$1(object, path, value);
}
var set_1 = set;
function createBaseFor$1(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index2];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var _createBaseFor = createBaseFor$1;
var createBaseFor = _createBaseFor;
var baseFor$2 = createBaseFor();
var _baseFor = baseFor$2;
function baseTimes$1(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var _baseTimes = baseTimes$1;
var baseGetTag$3 = _baseGetTag, isObjectLike$6 = isObjectLike_1;
var argsTag$3 = "[object Arguments]";
function baseIsArguments$1(value) {
  return isObjectLike$6(value) && baseGetTag$3(value) == argsTag$3;
}
var _baseIsArguments = baseIsArguments$1;
var baseIsArguments = _baseIsArguments, isObjectLike$5 = isObjectLike_1;
var objectProto$b = Object.prototype;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;
var isArguments$4 = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike$5(value) && hasOwnProperty$9.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
var isArguments_1 = isArguments$4;
var isBuffer$4 = { exports: {} };
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
(function(module, exports) {
  var root2 = _root, stubFalse2 = stubFalse_1;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root2.Buffer : void 0;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse2;
  module.exports = isBuffer2;
})(isBuffer$4, isBuffer$4.exports);
var baseGetTag$2 = _baseGetTag, isLength$1 = isLength_1, isObjectLike$4 = isObjectLike_1;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$6 = "[object Map]", numberTag$3 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$6 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$6] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$6] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray$1(value) {
  return isObjectLike$4(value) && isLength$1(value.length) && !!typedArrayTags[baseGetTag$2(value)];
}
var _baseIsTypedArray = baseIsTypedArray$1;
var baseIsTypedArray = _baseIsTypedArray, baseUnary$2 = _baseUnary, nodeUtil$2 = _nodeUtil.exports;
var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;
var isTypedArray$3 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray_1 = isTypedArray$3;
var baseTimes = _baseTimes, isArguments$3 = isArguments_1, isArray$a = isArray_1, isBuffer$3 = isBuffer$4.exports, isIndex$2 = _isIndex, isTypedArray$2 = isTypedArray_1;
var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$a(value), isArg = !isArr && isArguments$3(value), isBuff = !isArr && !isArg && isBuffer$3(value), isType = !isArr && !isArg && !isBuff && isTypedArray$2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex$2(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var _arrayLikeKeys = arrayLikeKeys$2;
var objectProto$9 = Object.prototype;
function isPrototype$3(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$9;
  return value === proto;
}
var _isPrototype = isPrototype$3;
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg$2;
var overArg$1 = _overArg;
var nativeKeys$1 = overArg$1(Object.keys, Object);
var _nativeKeys = nativeKeys$1;
var isPrototype$2 = _isPrototype, nativeKeys = _nativeKeys;
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function baseKeys$1(object) {
  if (!isPrototype$2(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys$1;
var arrayLikeKeys$1 = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike$4 = isArrayLike_1;
function keys$6(object) {
  return isArrayLike$4(object) ? arrayLikeKeys$1(object) : baseKeys(object);
}
var keys_1 = keys$6;
var baseFor$1 = _baseFor, keys$5 = keys_1;
function baseForOwn$2(object, iteratee) {
  return object && baseFor$1(object, iteratee, keys$5);
}
var _baseForOwn = baseForOwn$2;
var ListCache$2 = _ListCache;
function stackClear$1() {
  this.__data__ = new ListCache$2();
  this.size = 0;
}
var _stackClear = stackClear$1;
function stackDelete$1(key) {
  var data2 = this.__data__, result = data2["delete"](key);
  this.size = data2.size;
  return result;
}
var _stackDelete = stackDelete$1;
function stackGet$1(key) {
  return this.__data__.get(key);
}
var _stackGet = stackGet$1;
function stackHas$1(key) {
  return this.__data__.has(key);
}
var _stackHas = stackHas$1;
var ListCache$1 = _ListCache, Map$1 = _Map, MapCache$1 = _MapCache;
var LARGE_ARRAY_SIZE = 200;
function stackSet$1(key, value) {
  var data2 = this.__data__;
  if (data2 instanceof ListCache$1) {
    var pairs = data2.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data2.size;
      return this;
    }
    data2 = this.__data__ = new MapCache$1(pairs);
  }
  data2.set(key, value);
  this.size = data2.size;
  return this;
}
var _stackSet = stackSet$1;
var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
function Stack$4(entries) {
  var data2 = this.__data__ = new ListCache(entries);
  this.size = data2.size;
}
Stack$4.prototype.clear = stackClear;
Stack$4.prototype["delete"] = stackDelete;
Stack$4.prototype.get = stackGet;
Stack$4.prototype.has = stackHas;
Stack$4.prototype.set = stackSet;
var _Stack = Stack$4;
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
var _setCacheAdd = setCacheAdd$1;
function setCacheHas$1(value) {
  return this.__data__.has(value);
}
var _setCacheHas = setCacheHas$1;
var MapCache = _MapCache, setCacheAdd = _setCacheAdd, setCacheHas = _setCacheHas;
function SetCache$1(values) {
  var index2 = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index2 < length) {
    this.add(values[index2]);
  }
}
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
SetCache$1.prototype.has = setCacheHas;
var _SetCache = SetCache$1;
function arraySome$2(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (predicate(array[index2], index2, array)) {
      return true;
    }
  }
  return false;
}
var _arraySome = arraySome$2;
function cacheHas$1(cache, key) {
  return cache.has(key);
}
var _cacheHas = cacheHas$1;
var SetCache = _SetCache, arraySome$1 = _arraySome, cacheHas = _cacheHas;
var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index2 < arrLength) {
    var arrValue = array[index2], othValue = other[index2];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome$1(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var _equalArrays = equalArrays$2;
var root$4 = _root;
var Uint8Array$2 = root$4.Uint8Array;
var _Uint8Array = Uint8Array$2;
function mapToArray$2(map2) {
  var index2 = -1, result = Array(map2.size);
  map2.forEach(function(value, key) {
    result[++index2] = [key, value];
  });
  return result;
}
var _mapToArray = mapToArray$2;
function setToArray$1(set2) {
  var index2 = -1, result = Array(set2.size);
  set2.forEach(function(value) {
    result[++index2] = value;
  });
  return result;
}
var _setToArray = setToArray$1;
var Symbol$3 = _Symbol, Uint8Array$1 = _Uint8Array, eq$3 = eq_1, equalArrays$1 = _equalArrays, mapToArray$1 = _mapToArray, setToArray = _setToArray;
var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", mapTag$5 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$3 = "[object DataView]";
var symbolProto$1 = Symbol$3 ? Symbol$3.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$3:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$2:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag$2:
    case dateTag$2:
    case numberTag$2:
      return eq$3(+object, +other);
    case errorTag$1:
      return object.name == other.name && object.message == other.message;
    case regexpTag$2:
    case stringTag$2:
      return object == other + "";
    case mapTag$5:
      var convert = mapToArray$1;
    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;
      stack.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag$2:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}
var _equalByTag = equalByTag$1;
function arrayPush$3(array, values) {
  var index2 = -1, length = values.length, offset = array.length;
  while (++index2 < length) {
    array[offset + index2] = values[index2];
  }
  return array;
}
var _arrayPush = arrayPush$3;
var arrayPush$2 = _arrayPush, isArray$9 = isArray_1;
function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$9(object) ? result : arrayPush$2(result, symbolsFunc(object));
}
var _baseGetAllKeys = baseGetAllKeys$2;
function arrayFilter$1(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array[index2];
    if (predicate(value, index2, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var _arrayFilter = arrayFilter$1;
function stubArray$2() {
  return [];
}
var stubArray_1 = stubArray$2;
var arrayFilter = _arrayFilter, stubArray$1 = stubArray_1;
var objectProto$7 = Object.prototype;
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var _getSymbols = getSymbols$3;
var baseGetAllKeys$1 = _baseGetAllKeys, getSymbols$2 = _getSymbols, keys$4 = keys_1;
function getAllKeys$2(object) {
  return baseGetAllKeys$1(object, keys$4, getSymbols$2);
}
var _getAllKeys = getAllKeys$2;
var getAllKeys$1 = _getAllKeys;
var COMPARE_PARTIAL_FLAG$3 = 1;
var objectProto$6 = Object.prototype;
var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys$1(object), objLength = objProps.length, othProps = getAllKeys$1(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index2 = objLength;
  while (index2--) {
    var key = objProps[index2];
    if (!(isPartial ? key in other : hasOwnProperty$6.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index2 < objLength) {
    key = objProps[index2];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var _equalObjects = equalObjects$1;
var getNative$3 = _getNative, root$3 = _root;
var DataView$1 = getNative$3(root$3, "DataView");
var _DataView = DataView$1;
var getNative$2 = _getNative, root$2 = _root;
var Promise$2 = getNative$2(root$2, "Promise");
var _Promise = Promise$2;
var getNative$1 = _getNative, root$1 = _root;
var Set$2 = getNative$1(root$1, "Set");
var _Set = Set$2;
var getNative = _getNative, root = _root;
var WeakMap$1 = getNative(root, "WeakMap");
var _WeakMap = WeakMap$1;
var DataView = _DataView, Map = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap = _WeakMap, baseGetTag$1 = _baseGetTag, toSource = _toSource;
var mapTag$4 = "[object Map]", objectTag$3 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$2 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap);
var getTag$5 = baseGetTag$1;
if (DataView && getTag$5(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map && getTag$5(new Map()) != mapTag$4 || Promise$1 && getTag$5(Promise$1.resolve()) != promiseTag || Set$1 && getTag$5(new Set$1()) != setTag$4 || WeakMap && getTag$5(new WeakMap()) != weakMapTag$1) {
  getTag$5 = function(value) {
    var result = baseGetTag$1(value), Ctor = result == objectTag$3 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;
        case mapCtorString:
          return mapTag$4;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$4;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var _getTag = getTag$5;
var Stack$3 = _Stack, equalArrays = _equalArrays, equalByTag = _equalByTag, equalObjects = _equalObjects, getTag$4 = _getTag, isArray$8 = isArray_1, isBuffer$2 = isBuffer$4.exports, isTypedArray$1 = isTypedArray_1;
var COMPARE_PARTIAL_FLAG$2 = 1;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", objectTag$2 = "[object Object]";
var objectProto$5 = Object.prototype;
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$8(object), othIsArr = isArray$8(other), objTag = objIsArr ? arrayTag$1 : getTag$4(object), othTag = othIsArr ? arrayTag$1 : getTag$4(other);
  objTag = objTag == argsTag$1 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$1 ? objectTag$2 : othTag;
  var objIsObj = objTag == objectTag$2, othIsObj = othTag == objectTag$2, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer$2(object)) {
    if (!isBuffer$2(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack$3());
    return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty$5.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$5.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack$3());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack$3());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
var _baseIsEqualDeep = baseIsEqualDeep$1;
var baseIsEqualDeep = _baseIsEqualDeep, isObjectLike$3 = isObjectLike_1;
function baseIsEqual$2(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike$3(value) && !isObjectLike$3(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$2, stack);
}
var _baseIsEqual = baseIsEqual$2;
var Stack$2 = _Stack, baseIsEqual$1 = _baseIsEqual;
var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function baseIsMatch$1(object, source, matchData, customizer) {
  var index2 = matchData.length, length = index2, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index2--) {
    var data2 = matchData[index2];
    if (noCustomizer && data2[2] ? data2[1] !== object[data2[0]] : !(data2[0] in object)) {
      return false;
    }
  }
  while (++index2 < length) {
    data2 = matchData[index2];
    var key = data2[0], objValue = object[key], srcValue = data2[1];
    if (noCustomizer && data2[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack$2();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var _baseIsMatch = baseIsMatch$1;
var isObject$8 = isObject_1;
function isStrictComparable$2(value) {
  return value === value && !isObject$8(value);
}
var _isStrictComparable = isStrictComparable$2;
var isStrictComparable$1 = _isStrictComparable, keys$3 = keys_1;
function getMatchData$1(object) {
  var result = keys$3(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable$1(value)];
  }
  return result;
}
var _getMatchData = getMatchData$1;
function matchesStrictComparable$2(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var _matchesStrictComparable = matchesStrictComparable$2;
var baseIsMatch = _baseIsMatch, getMatchData = _getMatchData, matchesStrictComparable$1 = _matchesStrictComparable;
function baseMatches$1(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}
var _baseMatches = baseMatches$1;
function baseHasIn$1(object, key) {
  return object != null && key in Object(object);
}
var _baseHasIn = baseHasIn$1;
var castPath$3 = _castPath, isArguments$2 = isArguments_1, isArray$7 = isArray_1, isIndex$1 = _isIndex, isLength = isLength_1, toKey$3 = _toKey;
function hasPath$2(object, path, hasFunc) {
  path = castPath$3(path, object);
  var index2 = -1, length = path.length, result = false;
  while (++index2 < length) {
    var key = toKey$3(path[index2]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index2 != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex$1(key, length) && (isArray$7(object) || isArguments$2(object));
}
var _hasPath = hasPath$2;
var baseHasIn = _baseHasIn, hasPath$1 = _hasPath;
function hasIn$2(object, path) {
  return object != null && hasPath$1(object, path, baseHasIn);
}
var hasIn_1 = hasIn$2;
var baseIsEqual = _baseIsEqual, get = get_1, hasIn$1 = hasIn_1, isKey$1 = _isKey, isStrictComparable = _isStrictComparable, matchesStrictComparable = _matchesStrictComparable, toKey$2 = _toKey;
var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty$1(path, srcValue) {
  if (isKey$1(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey$2(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn$1(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}
var _baseMatchesProperty = baseMatchesProperty$1;
function identity$3(value) {
  return value;
}
var identity_1 = identity$3;
function baseProperty$1(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var _baseProperty = baseProperty$1;
var baseGet$2 = _baseGet;
function basePropertyDeep$1(path) {
  return function(object) {
    return baseGet$2(object, path);
  };
}
var _basePropertyDeep = basePropertyDeep$1;
var baseProperty = _baseProperty, basePropertyDeep = _basePropertyDeep, isKey = _isKey, toKey$1 = _toKey;
function property$1(path) {
  return isKey(path) ? baseProperty(toKey$1(path)) : basePropertyDeep(path);
}
var property_1 = property$1;
var baseMatches = _baseMatches, baseMatchesProperty = _baseMatchesProperty, identity$2 = identity_1, isArray$6 = isArray_1, property = property_1;
function baseIteratee$3(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity$2;
  }
  if (typeof value == "object") {
    return isArray$6(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}
var _baseIteratee = baseIteratee$3;
var baseAssignValue$2 = _baseAssignValue, baseForOwn$1 = _baseForOwn, baseIteratee$2 = _baseIteratee;
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee$2(iteratee);
  baseForOwn$1(object, function(value, key, object2) {
    baseAssignValue$2(result, key, iteratee(value, key, object2));
  });
  return result;
}
var mapValues_1 = mapValues;
var arrayMap$2 = _arrayMap;
function baseToPairs$1(object, props) {
  return arrayMap$2(props, function(key) {
    return [key, object[key]];
  });
}
var _baseToPairs = baseToPairs$1;
function setToPairs$1(set2) {
  var index2 = -1, result = Array(set2.size);
  set2.forEach(function(value) {
    result[++index2] = [value, value];
  });
  return result;
}
var _setToPairs = setToPairs$1;
var baseToPairs = _baseToPairs, getTag$3 = _getTag, mapToArray = _mapToArray, setToPairs = _setToPairs;
var mapTag$3 = "[object Map]", setTag$3 = "[object Set]";
function createToPairs$1(keysFunc) {
  return function(object) {
    var tag = getTag$3(object);
    if (tag == mapTag$3) {
      return mapToArray(object);
    }
    if (tag == setTag$3) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}
var _createToPairs = createToPairs$1;
var createToPairs = _createToPairs, keys$2 = keys_1;
var toPairs = createToPairs(keys$2);
var toPairs_1 = toPairs;
function apply$2(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply = apply$2;
var apply$1 = _apply;
var nativeMax = Math.max;
function overRest$2(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index2 = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index2 < length) {
      array[index2] = args[start + index2];
    }
    index2 = -1;
    var otherArgs = Array(start + 1);
    while (++index2 < start) {
      otherArgs[index2] = args[index2];
    }
    otherArgs[start] = transform(array);
    return apply$1(func, this, otherArgs);
  };
}
var _overRest = overRest$2;
function constant$1(value) {
  return function() {
    return value;
  };
}
var constant_1 = constant$1;
var constant = constant_1, defineProperty = _defineProperty, identity$1 = identity_1;
var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var _baseSetToString = baseSetToString$1;
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut$1(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var _shortOut = shortOut$1;
var baseSetToString = _baseSetToString, shortOut = _shortOut;
var setToString$2 = shortOut(baseSetToString);
var _setToString = setToString$2;
var identity = identity_1, overRest$1 = _overRest, setToString$1 = _setToString;
function baseRest$3(func, start) {
  return setToString$1(overRest$1(func, start, identity), func + "");
}
var _baseRest = baseRest$3;
var eq$2 = eq_1, isArrayLike$3 = isArrayLike_1, isIndex = _isIndex, isObject$7 = isObject_1;
function isIterateeCall$3(value, index2, object) {
  if (!isObject$7(object)) {
    return false;
  }
  var type = typeof index2;
  if (type == "number" ? isArrayLike$3(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
    return eq$2(object[index2], value);
  }
  return false;
}
var _isIterateeCall = isIterateeCall$3;
function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var _nativeKeysIn = nativeKeysIn$1;
var isObject$6 = isObject_1, isPrototype$1 = _isPrototype, nativeKeysIn = _nativeKeysIn;
var objectProto$4 = Object.prototype;
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
function baseKeysIn$1(object) {
  if (!isObject$6(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$1(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$4.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var _baseKeysIn = baseKeysIn$1;
var arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike$2 = isArrayLike_1;
function keysIn$6(object) {
  return isArrayLike$2(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var keysIn_1 = keysIn$6;
var baseRest$2 = _baseRest, eq$1 = eq_1, isIterateeCall$2 = _isIterateeCall, keysIn$5 = keysIn_1;
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
var defaults = baseRest$2(function(object, sources) {
  object = Object(object);
  var index2 = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : void 0;
  if (guard && isIterateeCall$2(sources[0], sources[1], guard)) {
    length = 1;
  }
  while (++index2 < length) {
    var source = sources[index2];
    var props = keysIn$5(source);
    var propsIndex = -1;
    var propsLength = props.length;
    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];
      if (value === void 0 || eq$1(value, objectProto$3[key]) && !hasOwnProperty$3.call(object, key)) {
        object[key] = source[key];
      }
    }
  }
  return object;
});
var defaults_1 = defaults;
var baseAssignValue$1 = _baseAssignValue, eq = eq_1;
function assignMergeValue$2(object, key, value) {
  if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue$1(object, key, value);
  }
}
var _assignMergeValue = assignMergeValue$2;
var _cloneBuffer = { exports: {} };
(function(module, exports) {
  var root2 = _root;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer2(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  module.exports = cloneBuffer2;
})(_cloneBuffer, _cloneBuffer.exports);
var Uint8Array = _Uint8Array;
function cloneArrayBuffer$3(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}
var _cloneArrayBuffer = cloneArrayBuffer$3;
var cloneArrayBuffer$2 = _cloneArrayBuffer;
function cloneTypedArray$2(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$2(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var _cloneTypedArray = cloneTypedArray$2;
function copyArray$2(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var _copyArray = copyArray$2;
var isObject$5 = isObject_1;
var objectCreate$1 = Object.create;
var baseCreate$1 = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject$5(proto)) {
      return {};
    }
    if (objectCreate$1) {
      return objectCreate$1(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var _baseCreate = baseCreate$1;
var overArg = _overArg;
var getPrototype$3 = overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype$3;
var baseCreate = _baseCreate, getPrototype$2 = _getPrototype, isPrototype = _isPrototype;
function initCloneObject$2(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype$2(object)) : {};
}
var _initCloneObject = initCloneObject$2;
var baseGetTag = _baseGetTag, getPrototype$1 = _getPrototype, isObjectLike$2 = isObjectLike_1;
var objectTag$1 = "[object Object]";
var funcProto = Function.prototype, objectProto$2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject$2(value) {
  if (!isObjectLike$2(value) || baseGetTag(value) != objectTag$1) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var isPlainObject_1 = isPlainObject$2;
function safeGet$2(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var _safeGet = safeGet$2;
var assignValue$1 = _assignValue, baseAssignValue = _baseAssignValue;
function copyObject$6(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue$1(object, key, newValue);
    }
  }
  return object;
}
var _copyObject = copyObject$6;
var copyObject$5 = _copyObject, keysIn$4 = keysIn_1;
function toPlainObject$1(value) {
  return copyObject$5(value, keysIn$4(value));
}
var toPlainObject_1 = toPlainObject$1;
var assignMergeValue$1 = _assignMergeValue, cloneBuffer$1 = _cloneBuffer.exports, cloneTypedArray$1 = _cloneTypedArray, copyArray$1 = _copyArray, initCloneObject$1 = _initCloneObject, isArguments$1 = isArguments_1, isArray$5 = isArray_1, isArrayLikeObject = isArrayLikeObject_1, isBuffer$1 = isBuffer$4.exports, isFunction = isFunction_1, isObject$4 = isObject_1, isPlainObject$1 = isPlainObject_1, isTypedArray = isTypedArray_1, safeGet$1 = _safeGet, toPlainObject = toPlainObject_1;
function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet$1(object, key), srcValue = safeGet$1(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue$1(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray$5(srcValue), isBuff = !isArr && isBuffer$1(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray$5(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray$1(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer$1(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray$1(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject$1(srcValue) || isArguments$1(srcValue)) {
      newValue = objValue;
      if (isArguments$1(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject$4(objValue) || isFunction(objValue)) {
        newValue = initCloneObject$1(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue$1(object, key, newValue);
}
var _baseMergeDeep = baseMergeDeep$1;
var Stack$1 = _Stack, assignMergeValue = _assignMergeValue, baseFor = _baseFor, baseMergeDeep = _baseMergeDeep, isObject$3 = isObject_1, keysIn$3 = keysIn_1, safeGet = _safeGet;
function baseMerge$2(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack$1());
    if (isObject$3(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge$2, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn$3);
}
var _baseMerge = baseMerge$2;
var baseMerge$1 = _baseMerge, isObject$2 = isObject_1;
function customDefaultsMerge$1(objValue, srcValue, key, object, source, stack) {
  if (isObject$2(objValue) && isObject$2(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge$1(objValue, srcValue, void 0, customDefaultsMerge$1, stack);
    stack["delete"](srcValue);
  }
  return objValue;
}
var _customDefaultsMerge = customDefaultsMerge$1;
var baseRest$1 = _baseRest, isIterateeCall$1 = _isIterateeCall;
function createAssigner$1(assigner) {
  return baseRest$1(function(object, sources) {
    var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall$1(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index2 < length) {
      var source = sources[index2];
      if (source) {
        assigner(object, source, index2, customizer);
      }
    }
    return object;
  });
}
var _createAssigner = createAssigner$1;
var baseMerge = _baseMerge, createAssigner = _createAssigner;
var mergeWith$1 = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});
var mergeWith_1 = mergeWith$1;
var apply = _apply, baseRest = _baseRest, customDefaultsMerge = _customDefaultsMerge, mergeWith = mergeWith_1;
var defaultsDeep = baseRest(function(args) {
  args.push(void 0, customDefaultsMerge);
  return apply(mergeWith, void 0, args);
});
var defaultsDeep_1 = defaultsDeep;
var baseGet$1 = _baseGet, baseSet = _baseSet, castPath$2 = _castPath;
function basePickBy$1(object, paths, predicate) {
  var index2 = -1, length = paths.length, result = {};
  while (++index2 < length) {
    var path = paths[index2], value = baseGet$1(object, path);
    if (predicate(value, path)) {
      baseSet(result, castPath$2(path, object), value);
    }
  }
  return result;
}
var _basePickBy = basePickBy$1;
var basePickBy = _basePickBy, hasIn = hasIn_1;
function basePick$1(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}
var _basePick = basePick$1;
var Symbol$2 = _Symbol, isArguments = isArguments_1, isArray$4 = isArray_1;
var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : void 0;
function isFlattenable$1(value) {
  return isArray$4(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var _isFlattenable = isFlattenable$1;
var arrayPush$1 = _arrayPush, isFlattenable = _isFlattenable;
function baseFlatten$1(array, depth, predicate, isStrict, result) {
  var index2 = -1, length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index2 < length) {
    var value = array[index2];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$1(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var _baseFlatten = baseFlatten$1;
var baseFlatten = _baseFlatten;
function flatten$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}
var flatten_1 = flatten$1;
var flatten = flatten_1, overRest = _overRest, setToString = _setToString;
function flatRest$2(func) {
  return setToString(overRest(func, void 0, flatten), func + "");
}
var _flatRest = flatRest$2;
var basePick = _basePick, flatRest$1 = _flatRest;
var pick = flatRest$1(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});
var pick_1 = pick;
function arrayEach$1(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (iteratee(array[index2], index2, array) === false) {
      break;
    }
  }
  return array;
}
var _arrayEach = arrayEach$1;
var copyObject$4 = _copyObject, keys$1 = keys_1;
function baseAssign$1(object, source) {
  return object && copyObject$4(source, keys$1(source), object);
}
var _baseAssign = baseAssign$1;
var copyObject$3 = _copyObject, keysIn$2 = keysIn_1;
function baseAssignIn$1(object, source) {
  return object && copyObject$3(source, keysIn$2(source), object);
}
var _baseAssignIn = baseAssignIn$1;
var copyObject$2 = _copyObject, getSymbols$1 = _getSymbols;
function copySymbols$1(source, object) {
  return copyObject$2(source, getSymbols$1(source), object);
}
var _copySymbols = copySymbols$1;
var arrayPush = _arrayPush, getPrototype = _getPrototype, getSymbols = _getSymbols, stubArray = stubArray_1;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};
var _getSymbolsIn = getSymbolsIn$2;
var copyObject$1 = _copyObject, getSymbolsIn$1 = _getSymbolsIn;
function copySymbolsIn$1(source, object) {
  return copyObject$1(source, getSymbolsIn$1(source), object);
}
var _copySymbolsIn = copySymbolsIn$1;
var baseGetAllKeys = _baseGetAllKeys, getSymbolsIn = _getSymbolsIn, keysIn$1 = keysIn_1;
function getAllKeysIn$2(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}
var _getAllKeysIn = getAllKeysIn$2;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function initCloneArray$1(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty$1.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var _initCloneArray = initCloneArray$1;
var cloneArrayBuffer$1 = _cloneArrayBuffer;
function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var _cloneDataView = cloneDataView$1;
var reFlags = /\w*$/;
function cloneRegExp$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var _cloneRegExp = cloneRegExp$1;
var Symbol$1 = _Symbol;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function cloneSymbol$1(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var _cloneSymbol = cloneSymbol$1;
var cloneArrayBuffer = _cloneArrayBuffer, cloneDataView = _cloneDataView, cloneRegExp = _cloneRegExp, cloneSymbol = _cloneSymbol, cloneTypedArray = _cloneTypedArray;
var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag$1(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);
    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);
    case dataViewTag$1:
      return cloneDataView(object, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$2:
      return new Ctor();
    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);
    case regexpTag$1:
      return cloneRegExp(object);
    case setTag$2:
      return new Ctor();
    case symbolTag$1:
      return cloneSymbol(object);
  }
}
var _initCloneByTag = initCloneByTag$1;
var getTag$2 = _getTag, isObjectLike$1 = isObjectLike_1;
var mapTag$1 = "[object Map]";
function baseIsMap$1(value) {
  return isObjectLike$1(value) && getTag$2(value) == mapTag$1;
}
var _baseIsMap = baseIsMap$1;
var baseIsMap = _baseIsMap, baseUnary$1 = _baseUnary, nodeUtil$1 = _nodeUtil.exports;
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;
var isMap_1 = isMap$1;
var getTag$1 = _getTag, isObjectLike = isObjectLike_1;
var setTag$1 = "[object Set]";
function baseIsSet$1(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$1;
}
var _baseIsSet = baseIsSet$1;
var baseIsSet = _baseIsSet, baseUnary = _baseUnary, nodeUtil = _nodeUtil.exports;
var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
var isSet_1 = isSet$1;
var Stack = _Stack, arrayEach = _arrayEach, assignValue = _assignValue, baseAssign = _baseAssign, baseAssignIn = _baseAssignIn, cloneBuffer = _cloneBuffer.exports, copyArray = _copyArray, copySymbols = _copySymbols, copySymbolsIn = _copySymbolsIn, getAllKeys = _getAllKeys, getAllKeysIn$1 = _getAllKeysIn, getTag = _getTag, initCloneArray = _initCloneArray, initCloneByTag = _initCloneByTag, initCloneObject = _initCloneObject, isArray$3 = isArray_1, isBuffer = isBuffer$4.exports, isMap = isMap_1, isObject$1 = isObject_1, isSet = isSet_1, keys = keys_1, keysIn = keysIn_1;
var CLONE_DEEP_FLAG$1 = 1, CLONE_FLAT_FLAG$1 = 2, CLONE_SYMBOLS_FLAG$1 = 4;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone$1(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG$1, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject$1(value)) {
    return value;
  }
  var isArr = isArray$3(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn$1 : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var _baseClone = baseClone$1;
function last$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_1 = last$1;
function baseSlice$1(array, start, end) {
  var index2 = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index2 < length) {
    result[index2] = array[index2 + start];
  }
  return result;
}
var _baseSlice = baseSlice$1;
var baseGet = _baseGet, baseSlice = _baseSlice;
function parent$1(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}
var _parent = parent$1;
var castPath$1 = _castPath, last = last_1, parent = _parent, toKey = _toKey;
function baseUnset$1(object, path) {
  path = castPath$1(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}
var _baseUnset = baseUnset$1;
var isPlainObject = isPlainObject_1;
function customOmitClone$1(value) {
  return isPlainObject(value) ? void 0 : value;
}
var _customOmitClone = customOmitClone$1;
var arrayMap$1 = _arrayMap, baseClone = _baseClone, baseUnset = _baseUnset, castPath = _castPath, copyObject = _copyObject, customOmitClone = _customOmitClone, flatRest = _flatRest, getAllKeysIn = _getAllKeysIn;
var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap$1(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});
var omit_1 = omit;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseHas$1(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}
var _baseHas = baseHas$1;
var baseHas = _baseHas, hasPath = _hasPath;
function has$1(object, path) {
  return object != null && hasPath(object, path, baseHas);
}
var has_1 = has$1;
var isArrayLike$1 = isArrayLike_1;
function createBaseEach$1(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike$1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index2 = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index2-- : ++index2 < length) {
      if (iteratee(iterable[index2], index2, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var _createBaseEach = createBaseEach$1;
var baseForOwn = _baseForOwn, createBaseEach = _createBaseEach;
var baseEach$2 = createBaseEach(baseForOwn);
var _baseEach = baseEach$2;
var baseEach$1 = _baseEach, isArrayLike = isArrayLike_1;
function baseMap$1(collection, iteratee) {
  var index2 = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach$1(collection, function(value, key, collection2) {
    result[++index2] = iteratee(value, key, collection2);
  });
  return result;
}
var _baseMap = baseMap$1;
var arrayMap = _arrayMap, baseIteratee$1 = _baseIteratee, baseMap = _baseMap, isArray$2 = isArray_1;
function map(collection, iteratee) {
  var func = isArray$2(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee$1(iteratee));
}
var map_1 = map;
function head(array) {
  return array && array.length ? array[0] : void 0;
}
var head_1 = head;
var baseEach = _baseEach;
function baseSome$1(collection, predicate) {
  var result;
  baseEach(collection, function(value, index2, collection2) {
    result = predicate(value, index2, collection2);
    return !result;
  });
  return !!result;
}
var _baseSome = baseSome$1;
var arraySome = _arraySome, baseIteratee = _baseIteratee, baseSome = _baseSome, isArray$1 = isArray_1, isIterateeCall = _isIterateeCall;
function some$1(collection, predicate, guard) {
  var func = isArray$1(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee(predicate));
}
var some_1 = some$1;
const getType = (value) => Object.prototype.toString.call(value).slice(8, -1);
const isDate$1 = (value) => isDate_1(value) && !isNaN(value.getTime());
const isObject = (value) => getType(value) === "Object";
const has = has_1;
const hasAny = (obj, props) => some_1(props, (p) => has_1(obj, p));
const some = some_1;
const pad = (val, len, char = "0") => {
  val = val !== null && val !== void 0 ? String(val) : "";
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
};
const mergeEvents = (...args) => {
  const result = {};
  args.forEach(
    (e) => Object.entries(e).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = value;
      } else if (isArrayLikeObject_1(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    })
  );
  return result;
};
const pageIsValid = (page) => !!(page && page.month && page.year);
const pageIsBeforePage = (page, comparePage) => {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  if (page.year === comparePage.year)
    return page.month < comparePage.month;
  return page.year < comparePage.year;
};
const pageIsAfterPage = (page, comparePage) => {
  if (!pageIsValid(page) || !pageIsValid(comparePage))
    return false;
  if (page.year === comparePage.year)
    return page.month > comparePage.month;
  return page.year > comparePage.year;
};
const pageIsBetweenPages = (page, fromPage, toPage) => (page || false) && !pageIsBeforePage(page, fromPage) && !pageIsAfterPage(page, toPage);
const pageIsEqualToPage = (aPage, bPage) => {
  if (!aPage && bPage)
    return false;
  if (aPage && !bPage)
    return false;
  if (!aPage && !bPage)
    return true;
  return aPage.month === bPage.month && aPage.year === bPage.year;
};
const addPages = ({ month, year }, count) => {
  const incr = count > 0 ? 1 : -1;
  for (let i = 0; i < Math.abs(count); i++) {
    month += incr;
    if (month > 12) {
      month = 1;
      year++;
    } else if (month < 1) {
      month = 12;
      year--;
    }
  }
  return {
    month,
    year
  };
};
const pageRangeToArray = (from, to) => {
  if (!pageIsValid(from) || !pageIsValid(to))
    return [];
  const result = [];
  while (!pageIsAfterPage(from, to)) {
    result.push(from);
    from = addPages(from, 1);
  }
  return result;
};
function datesAreEqual(a, b) {
  const aIsDate = isDate$1(a);
  const bIsDate = isDate$1(b);
  if (!aIsDate && !bIsDate)
    return true;
  if (aIsDate !== bIsDate)
    return false;
  return a.getTime() === b.getTime();
}
const arrayHasItems = (array) => isArrayLikeObject_1(array) && array.length > 0;
const mixinOptionalProps = (source, target, props) => {
  const assigned = [];
  props.forEach((p) => {
    const name = p.name || p.toString();
    const mixin = p.mixin;
    const validate = p.validate;
    if (Object.prototype.hasOwnProperty.call(source, name)) {
      const value = validate ? validate(source[name]) : source[name];
      target[name] = mixin && isObject(value) ? { ...mixin, ...value } : value;
      assigned.push(name);
    }
  });
  return {
    target,
    assigned: assigned.length ? assigned : null
  };
};
const on = (element, event, handler, opts) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, opts);
  }
};
const off = (element, event, handler, opts) => {
  if (element && event) {
    element.removeEventListener(event, handler, opts);
  }
};
const elementContains = (element, child) => !!element && !!child && (element === child || element.contains(child));
const onSpaceOrEnter = (event, handler) => {
  if (event.key === " " || event.key === "Enter") {
    handler(event);
    event.preventDefault();
  }
};
const createGuid = () => {
  function S4() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};
function hash(str) {
  let hashcode = 0;
  let i = 0;
  let chr;
  if (str.length === 0)
    return hashcode;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hashcode = (hashcode << 5) - hashcode + chr;
    hashcode |= 0;
  }
  return hashcode;
}
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$a = {
  name: "CustomTransition",
  emits: [
    "before-enter",
    "before-transition",
    "after-enter",
    "after-transition"
  ],
  props: {
    name: String,
    appear: Boolean
  },
  computed: {
    name_() {
      return `vc-${this.name || "none"}`;
    }
  },
  methods: {
    beforeEnter(el) {
      this.$emit("before-enter", el);
      this.$emit("before-transition", el);
    },
    afterEnter(el) {
      this.$emit("after-enter", el);
      this.$emit("after-transition", el);
    }
  }
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    name: $options.name_,
    appear: $props.appear,
    onBeforeEnter: $options.beforeEnter,
    onAfterEnter: $options.afterEnter
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["name", "appear", "onBeforeEnter", "onAfterEnter"]);
}
var CustomTransition = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$5]]);
const _sfc_main$9 = {
  name: "Popover",
  emits: ["before-show", "after-show", "before-hide", "after-hide"],
  render() {
    return h(
      "div",
      {
        class: [
          "vc-popover-content-wrapper",
          {
            "is-interactive": this.isInteractive
          }
        ],
        ref: "popover"
      },
      [
        h(
          CustomTransition,
          {
            name: this.transition,
            appear: true,
            "on-before-enter": this.beforeEnter,
            "on-after-enter": this.afterEnter,
            "on-before-leave": this.beforeLeave,
            "on-after-leave": this.afterLeave
          },
          {
            default: () => this.isVisible ? h(
              "div",
              {
                tabindex: -1,
                class: [
                  "vc-popover-content",
                  `direction-${this.direction}`,
                  this.contentClass
                ],
                style: this.contentStyle
              },
              [
                this.content,
                h("span", {
                  class: [
                    "vc-popover-caret",
                    `direction-${this.direction}`,
                    `align-${this.alignment}`
                  ]
                })
              ]
            ) : null
          }
        )
      ]
    );
  },
  props: {
    id: { type: String, required: true },
    contentClass: String
  },
  data() {
    return {
      ref: null,
      opts: null,
      data: null,
      transition: "slide-fade",
      transitionTranslate: "15px",
      transitionDuration: "0.15s",
      placement: "bottom",
      positionFixed: false,
      modifiers: [],
      isInteractive: false,
      isHovered: false,
      isFocused: false,
      showDelay: 0,
      hideDelay: 110,
      autoHide: false,
      popperEl: null
    };
  },
  computed: {
    content() {
      return isFunction_1(this.$slots.default) && this.$slots.default({
        direction: this.direction,
        alignment: this.alignment,
        data: this.data,
        updateLayout: this.setupPopper,
        hide: (opts) => this.hide(opts)
      }) || this.$slots.default;
    },
    contentStyle() {
      return {
        "--slide-translate": this.transitionTranslate,
        "--slide-duration": this.transitionDuration
      };
    },
    popperOptions() {
      return {
        placement: this.placement,
        strategy: this.positionFixed ? "fixed" : "absolute",
        modifiers: [
          {
            name: "onUpdate",
            enabled: true,
            phase: "afterWrite",
            fn: this.onPopperUpdate
          },
          ...this.modifiers || []
        ],
        onFirstUpdate: this.onPopperUpdate
      };
    },
    isVisible() {
      return !!(this.ref && this.content);
    },
    direction() {
      return this.placement && this.placement.split("-")[0] || "bottom";
    },
    alignment() {
      const isLeftRight = this.direction === "left" || this.direction === "right";
      let alignment = this.placement.split("-");
      alignment = alignment.length > 1 ? alignment[1] : "";
      if (["start", "top", "left"].includes(alignment)) {
        return isLeftRight ? "top" : "left";
      }
      if (["end", "bottom", "right"].includes(alignment)) {
        return isLeftRight ? "bottom" : "right";
      }
      return isLeftRight ? "middle" : "center";
    }
  },
  watch: {
    opts(val, oldVal) {
      if (oldVal && oldVal.callback) {
        oldVal.callback({
          ...oldVal,
          completed: !val,
          reason: val ? "Overridden by action" : null
        });
      }
    }
  },
  mounted() {
    this.popoverEl = this.$refs.popover;
    this.addEvents();
  },
  beforeUnmount() {
    this.destroyPopper();
    this.removeEvents();
    this.popoverEl = null;
  },
  methods: {
    addEvents() {
      on(this.popoverEl, "click", this.onClick);
      on(this.popoverEl, "mouseover", this.onMouseOver);
      on(this.popoverEl, "mouseleave", this.onMouseLeave);
      on(this.popoverEl, "focusin", this.onFocusIn);
      on(this.popoverEl, "focusout", this.onFocusOut);
      on(document, "keydown", this.onDocumentKeydown);
      on(document, "click", this.onDocumentClick);
      on(document, "show-popover", this.onDocumentShowPopover);
      on(document, "hide-popover", this.onDocumentHidePopover);
      on(document, "toggle-popover", this.onDocumentTogglePopover);
      on(document, "update-popover", this.onDocumentUpdatePopover);
    },
    removeEvents() {
      off(this.popoverEl, "click", this.onClick);
      off(this.popoverEl, "mouseover", this.onMouseOver);
      off(this.popoverEl, "mouseleave", this.onMouseLeave);
      off(this.popoverEl, "focusin", this.onFocusIn);
      off(this.popoverEl, "focusout", this.onFocusOut);
      off(document, "keydown", this.onDocumentKeydown);
      off(document, "click", this.onDocumentClick);
      off(document, "show-popover", this.onDocumentShowPopover);
      off(document, "hide-popover", this.onDocumentHidePopover);
      off(document, "toggle-popover", this.onDocumentTogglePopover);
      off(document, "update-popover", this.onDocumentUpdatePopover);
    },
    onClick(e) {
      e.stopPropagation();
    },
    onMouseOver() {
      this.isHovered = true;
      if (this.isInteractive)
        this.show();
    },
    onMouseLeave() {
      this.isHovered = false;
      if (this.autoHide && !this.isFocused && (!this.ref || this.ref !== document.activeElement)) {
        this.hide();
      }
    },
    onFocusIn() {
      this.isFocused = true;
      if (this.isInteractive)
        this.show();
    },
    onFocusOut(e) {
      if (!e.relatedTarget || !elementContains(this.popoverEl, e.relatedTarget)) {
        this.isFocused = false;
        if (!this.isHovered && this.autoHide)
          this.hide();
      }
    },
    onDocumentClick(e) {
      if (!this.$refs.popover || !this.ref) {
        return;
      }
      if (elementContains(this.popoverEl, e.target) || elementContains(this.ref, e.target)) {
        return;
      }
      this.hide();
    },
    onDocumentKeydown(e) {
      if (e.key === "Esc" || e.key === "Escape") {
        this.hide();
      }
    },
    onDocumentShowPopover({ detail }) {
      if (!detail.id || detail.id !== this.id)
        return;
      this.show(detail);
    },
    onDocumentHidePopover({ detail }) {
      if (!detail.id || detail.id !== this.id)
        return;
      this.hide(detail);
    },
    onDocumentTogglePopover({ detail }) {
      if (!detail.id || detail.id !== this.id)
        return;
      this.toggle(detail);
    },
    onDocumentUpdatePopover({ detail }) {
      if (!detail.id || detail.id !== this.id)
        return;
      this.update(detail);
    },
    show(opts = {}) {
      opts.action = "show";
      const ref = opts.ref || this.ref;
      const delay = opts.showDelay >= 0 ? opts.showDelay : this.showDelay;
      if (!ref) {
        if (opts.callback) {
          opts.callback({
            completed: false,
            reason: "Invalid reference element provided"
          });
        }
        return;
      }
      clearTimeout(this.timeout);
      this.opts = opts;
      const fn = () => {
        Object.assign(this, omit_1(opts, ["id"]));
        this.setupPopper();
        this.opts = null;
      };
      if (delay > 0) {
        this.timeout = setTimeout(() => fn(), delay);
      } else {
        fn();
      }
    },
    hide(opts = {}) {
      opts.action = "hide";
      const ref = opts.ref || this.ref;
      const delay = opts.hideDelay >= 0 ? opts.hideDelay : this.hideDelay;
      if (!this.ref || ref !== this.ref) {
        if (opts.callback) {
          opts.callback({
            ...opts,
            completed: false,
            reason: this.ref ? "Invalid reference element provided" : "Popover already hidden"
          });
        }
        return;
      }
      const fn = () => {
        this.ref = null;
        this.opts = null;
      };
      clearTimeout(this.timeout);
      this.opts = opts;
      if (delay > 0) {
        this.timeout = setTimeout(fn, delay);
      } else {
        fn();
      }
    },
    toggle(opts = {}) {
      if (this.isVisible && opts.ref === this.ref) {
        this.hide(opts);
      } else {
        this.show(opts);
      }
    },
    update(opts = {}) {
      Object.assign(this, omit_1(opts, ["id"]));
      this.setupPopper();
    },
    setupPopper() {
      this.$nextTick(() => {
        if (!this.ref || !this.$refs.popover)
          return;
        if (this.popper && this.popper.reference !== this.ref) {
          this.destroyPopper();
        }
        if (!this.popper) {
          this.popper = createPopper(
            this.ref,
            this.popoverEl,
            this.popperOptions
          );
        } else {
          this.popper.update();
        }
      });
    },
    onPopperUpdate(args) {
      if (args.placement) {
        this.placement = args.placement;
      } else if (args.state) {
        this.placement = args.state.placement;
      }
    },
    beforeEnter(e) {
      this.$emit("before-show", e);
    },
    afterEnter(e) {
      this.$emit("after-show", e);
    },
    beforeLeave(e) {
      this.$emit("before-hide", e);
    },
    afterLeave(e) {
      this.destroyPopper();
      this.$emit("after-hide", e);
    },
    destroyPopper() {
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
    }
  }
};
const childMixin$1 = {
  inject: ["sharedState"],
  computed: {
    masks() {
      return this.sharedState.masks;
    },
    theme() {
      return this.sharedState.theme;
    },
    locale() {
      return this.sharedState.locale;
    },
    dayPopoverId() {
      return this.sharedState.dayPopoverId;
    }
  },
  methods: {
    format(date, mask) {
      return this.locale.format(date, mask);
    },
    pageForDate(date) {
      return this.locale.getDateParts(this.locale.normalizeDate(date));
    }
  }
};
const targetProps = ["base", "start", "end", "startEnd"];
const displayProps = [
  "class",
  "contentClass",
  "style",
  "contentStyle",
  "color",
  "fillMode"
];
const defConfig = {
  color: "blue",
  isDark: false,
  highlight: {
    base: { fillMode: "light" },
    start: { fillMode: "solid" },
    end: { fillMode: "solid" }
  },
  dot: {
    base: { fillMode: "solid" },
    start: { fillMode: "solid" },
    end: { fillMode: "solid" }
  },
  bar: {
    base: { fillMode: "solid" },
    start: { fillMode: "solid" },
    end: { fillMode: "solid" }
  },
  content: {
    base: {},
    start: {},
    end: {}
  }
};
class Theme {
  constructor(config) {
    Object.assign(this, defConfig, config);
  }
  normalizeAttr({ config, type }) {
    let rootColor = this.color;
    let root2 = {};
    const normAttr = this[type];
    if (config === true || isString_1(config)) {
      rootColor = isString_1(config) ? config : rootColor;
      root2 = { ...normAttr };
    } else if (isObject(config)) {
      if (hasAny(config, targetProps)) {
        root2 = { ...config };
      } else {
        root2 = {
          base: { ...config },
          start: { ...config },
          end: { ...config }
        };
      }
    } else {
      return null;
    }
    defaults_1(root2, { start: root2.startEnd, end: root2.startEnd }, normAttr);
    toPairs_1(root2).forEach(([targetType, targetConfig]) => {
      let targetColor = rootColor;
      if (targetConfig === true || isString_1(targetConfig)) {
        targetColor = isString_1(targetConfig) ? targetConfig : targetColor;
        root2[targetType] = { color: targetColor };
      } else if (isObject(targetConfig)) {
        if (hasAny(targetConfig, displayProps)) {
          root2[targetType] = { ...targetConfig };
        } else {
          root2[targetType] = {};
        }
      }
      if (!has(root2, `${targetType}.color`)) {
        set_1(root2, `${targetType}.color`, targetColor);
      }
    });
    return root2;
  }
  normalizeHighlight(config) {
    const highlight = this.normalizeAttr({
      config,
      type: "highlight"
    });
    toPairs_1(highlight).forEach(([_, targetConfig]) => {
      const c = defaults_1(targetConfig, {
        isDark: this.isDark,
        color: this.color
      });
      targetConfig.style = {
        ...this.getHighlightBgStyle(c),
        ...targetConfig.style
      };
      targetConfig.contentStyle = {
        ...this.getHighlightContentStyle(c),
        ...targetConfig.contentStyle
      };
    });
    return highlight;
  }
  getHighlightBgStyle({ fillMode, color, isDark }) {
    switch (fillMode) {
      case "outline":
      case "none":
        return {
          backgroundColor: isDark ? "var(--gray-900)" : "var(--white)",
          border: "2px solid",
          borderColor: isDark ? `var(--${color}-200)` : `var(--${color}-700)`,
          borderRadius: "var(--rounded-full)"
        };
      case "light":
        return {
          backgroundColor: isDark ? `var(--${color}-800)` : `var(--${color}-200)`,
          opacity: isDark ? 0.75 : 1,
          borderRadius: "var(--rounded-full)"
        };
      case "solid":
        return {
          backgroundColor: isDark ? `var(--${color}-500)` : `var(--${color}-600)`,
          borderRadius: "var(--rounded-full)"
        };
      default:
        return {
          borderRadius: "var(--rounded-full)"
        };
    }
  }
  getHighlightContentStyle({ fillMode, color, isDark }) {
    switch (fillMode) {
      case "outline":
      case "none":
        return {
          fontWeight: "var(--font-bold)",
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`
        };
      case "light":
        return {
          fontWeight: "var(--font-bold)",
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`
        };
      case "solid":
        return {
          fontWeight: "var(--font-bold)",
          color: "var(--white)"
        };
      default:
        return "";
    }
  }
  bgAccentHigh({ color, isDark }) {
    return {
      backgroundColor: isDark ? `var(--${color}-500)` : `var(--${color}-600)`
    };
  }
  contentAccent({ color, isDark }) {
    if (!color)
      return null;
    return {
      fontWeight: "var(--font-bold)",
      color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`
    };
  }
  normalizeDot(config) {
    return this.normalizeNonHighlight("dot", config, this.bgAccentHigh);
  }
  normalizeBar(config) {
    return this.normalizeNonHighlight("bar", config, this.bgAccentHigh);
  }
  normalizeContent(config) {
    return this.normalizeNonHighlight("content", config, this.contentAccent);
  }
  normalizeNonHighlight(type, config, styleFn) {
    const attr = this.normalizeAttr({ type, config });
    toPairs_1(attr).forEach(([_, targetConfig]) => {
      defaults_1(targetConfig, { isDark: this.isDark, color: this.color });
      targetConfig.style = {
        ...styleFn(targetConfig),
        ...targetConfig.style
      };
    });
    return attr;
  }
}
var moment$1 = { exports: {} };
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    var hookCallback;
    function hooks() {
      return hookCallback.apply(null, arguments);
    }
    function setHookCallback(callback) {
      hookCallback = callback;
    }
    function isArray2(input2) {
      return input2 instanceof Array || Object.prototype.toString.call(input2) === "[object Array]";
    }
    function isObject2(input2) {
      return input2 != null && Object.prototype.toString.call(input2) === "[object Object]";
    }
    function hasOwnProp(a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
    }
    function isObjectEmpty(obj) {
      if (Object.getOwnPropertyNames) {
        return Object.getOwnPropertyNames(obj).length === 0;
      } else {
        var k;
        for (k in obj) {
          if (hasOwnProp(obj, k)) {
            return false;
          }
        }
        return true;
      }
    }
    function isUndefined2(input2) {
      return input2 === void 0;
    }
    function isNumber2(input2) {
      return typeof input2 === "number" || Object.prototype.toString.call(input2) === "[object Number]";
    }
    function isDate2(input2) {
      return input2 instanceof Date || Object.prototype.toString.call(input2) === "[object Date]";
    }
    function map2(arr, fn) {
      var res = [], i, arrLen = arr.length;
      for (i = 0; i < arrLen; ++i) {
        res.push(fn(arr[i], i));
      }
      return res;
    }
    function extend2(a, b) {
      for (var i in b) {
        if (hasOwnProp(b, i)) {
          a[i] = b[i];
        }
      }
      if (hasOwnProp(b, "toString")) {
        a.toString = b.toString;
      }
      if (hasOwnProp(b, "valueOf")) {
        a.valueOf = b.valueOf;
      }
      return a;
    }
    function createUTC(input2, format3, locale2, strict) {
      return createLocalOrUTC(input2, format3, locale2, strict, true).utc();
    }
    function defaultParsingFlags() {
      return {
        empty: false,
        unusedTokens: [],
        unusedInput: [],
        overflow: -2,
        charsLeftOver: 0,
        nullInput: false,
        invalidEra: null,
        invalidMonth: null,
        invalidFormat: false,
        userInvalidated: false,
        iso: false,
        parsedDateParts: [],
        era: null,
        meridiem: null,
        rfc2822: false,
        weekdayMismatch: false
      };
    }
    function getParsingFlags(m) {
      if (m._pf == null) {
        m._pf = defaultParsingFlags();
      }
      return m._pf;
    }
    var some2;
    if (Array.prototype.some) {
      some2 = Array.prototype.some;
    } else {
      some2 = function(fun) {
        var t = Object(this), len = t.length >>> 0, i;
        for (i = 0; i < len; i++) {
          if (i in t && fun.call(this, t[i], i, t)) {
            return true;
          }
        }
        return false;
      };
    }
    function isValid2(m) {
      var flags = null, parsedParts = false, isNowValid = m._d && !isNaN(m._d.getTime());
      if (isNowValid) {
        flags = getParsingFlags(m);
        parsedParts = some2.call(flags.parsedDateParts, function(i) {
          return i != null;
        });
        isNowValid = flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
        if (m._strict) {
          isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
        }
      }
      if (Object.isFrozen == null || !Object.isFrozen(m)) {
        m._isValid = isNowValid;
      } else {
        return isNowValid;
      }
      return m._isValid;
    }
    function createInvalid(flags) {
      var m = createUTC(NaN);
      if (flags != null) {
        extend2(getParsingFlags(m), flags);
      } else {
        getParsingFlags(m).userInvalidated = true;
      }
      return m;
    }
    var momentProperties = hooks.momentProperties = [], updateInProgress = false;
    function copyConfig(to2, from2) {
      var i, prop, val, momentPropertiesLen = momentProperties.length;
      if (!isUndefined2(from2._isAMomentObject)) {
        to2._isAMomentObject = from2._isAMomentObject;
      }
      if (!isUndefined2(from2._i)) {
        to2._i = from2._i;
      }
      if (!isUndefined2(from2._f)) {
        to2._f = from2._f;
      }
      if (!isUndefined2(from2._l)) {
        to2._l = from2._l;
      }
      if (!isUndefined2(from2._strict)) {
        to2._strict = from2._strict;
      }
      if (!isUndefined2(from2._tzm)) {
        to2._tzm = from2._tzm;
      }
      if (!isUndefined2(from2._isUTC)) {
        to2._isUTC = from2._isUTC;
      }
      if (!isUndefined2(from2._offset)) {
        to2._offset = from2._offset;
      }
      if (!isUndefined2(from2._pf)) {
        to2._pf = getParsingFlags(from2);
      }
      if (!isUndefined2(from2._locale)) {
        to2._locale = from2._locale;
      }
      if (momentPropertiesLen > 0) {
        for (i = 0; i < momentPropertiesLen; i++) {
          prop = momentProperties[i];
          val = from2[prop];
          if (!isUndefined2(val)) {
            to2[prop] = val;
          }
        }
      }
      return to2;
    }
    function Moment(config) {
      copyConfig(this, config);
      this._d = new Date(config._d != null ? config._d.getTime() : NaN);
      if (!this.isValid()) {
        this._d = new Date(NaN);
      }
      if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
      }
    }
    function isMoment(obj) {
      return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
    }
    function warn(msg) {
      if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
        console.warn("Deprecation warning: " + msg);
      }
    }
    function deprecate(msg, fn) {
      var firstTime = true;
      return extend2(function() {
        if (hooks.deprecationHandler != null) {
          hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
          var args = [], arg, i, key, argLen = arguments.length;
          for (i = 0; i < argLen; i++) {
            arg = "";
            if (typeof arguments[i] === "object") {
              arg += "\n[" + i + "] ";
              for (key in arguments[0]) {
                if (hasOwnProp(arguments[0], key)) {
                  arg += key + ": " + arguments[0][key] + ", ";
                }
              }
              arg = arg.slice(0, -2);
            } else {
              arg = arguments[i];
            }
            args.push(arg);
          }
          warn(
            msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
          );
          firstTime = false;
        }
        return fn.apply(this, arguments);
      }, fn);
    }
    var deprecations = {};
    function deprecateSimple(name, msg) {
      if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
      }
      if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
      }
    }
    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;
    function isFunction2(input2) {
      return typeof Function !== "undefined" && input2 instanceof Function || Object.prototype.toString.call(input2) === "[object Function]";
    }
    function set2(config) {
      var prop, i;
      for (i in config) {
        if (hasOwnProp(config, i)) {
          prop = config[i];
          if (isFunction2(prop)) {
            this[i] = prop;
          } else {
            this["_" + i] = prop;
          }
        }
      }
      this._config = config;
      this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
      );
    }
    function mergeConfigs(parentConfig, childConfig) {
      var res = extend2({}, parentConfig), prop;
      for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
          if (isObject2(parentConfig[prop]) && isObject2(childConfig[prop])) {
            res[prop] = {};
            extend2(res[prop], parentConfig[prop]);
            extend2(res[prop], childConfig[prop]);
          } else if (childConfig[prop] != null) {
            res[prop] = childConfig[prop];
          } else {
            delete res[prop];
          }
        }
      }
      for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject2(parentConfig[prop])) {
          res[prop] = extend2({}, res[prop]);
        }
      }
      return res;
    }
    function Locale2(config) {
      if (config != null) {
        this.set(config);
      }
    }
    var keys2;
    if (Object.keys) {
      keys2 = Object.keys;
    } else {
      keys2 = function(obj) {
        var i, res = [];
        for (i in obj) {
          if (hasOwnProp(obj, i)) {
            res.push(i);
          }
        }
        return res;
      };
    }
    var defaultCalendar = {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    };
    function calendar(key, mom, now2) {
      var output = this._calendar[key] || this._calendar["sameElse"];
      return isFunction2(output) ? output.call(mom, now2) : output;
    }
    function zeroFill(number, targetLength, forceSign) {
      var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
      return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }
    var formattingTokens2 = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens2 = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions2 = {}, formatTokenFunctions2 = {};
    function addFormatToken(token3, padded, ordinal2, callback) {
      var func = callback;
      if (typeof callback === "string") {
        func = function() {
          return this[callback]();
        };
      }
      if (token3) {
        formatTokenFunctions2[token3] = func;
      }
      if (padded) {
        formatTokenFunctions2[padded[0]] = function() {
          return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
      }
      if (ordinal2) {
        formatTokenFunctions2[ordinal2] = function() {
          return this.localeData().ordinal(
            func.apply(this, arguments),
            token3
          );
        };
      }
    }
    function removeFormattingTokens(input2) {
      if (input2.match(/\[[\s\S]/)) {
        return input2.replace(/^\[|\]$/g, "");
      }
      return input2.replace(/\\/g, "");
    }
    function makeFormatFunction2(format3) {
      var array = format3.match(formattingTokens2), i, length;
      for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions2[array[i]]) {
          array[i] = formatTokenFunctions2[array[i]];
        } else {
          array[i] = removeFormattingTokens(array[i]);
        }
      }
      return function(mom) {
        var output = "", i2;
        for (i2 = 0; i2 < length; i2++) {
          output += isFunction2(array[i2]) ? array[i2].call(mom, format3) : array[i2];
        }
        return output;
      };
    }
    function formatMoment(m, format3) {
      if (!m.isValid()) {
        return m.localeData().invalidDate();
      }
      format3 = expandFormat(format3, m.localeData());
      formatFunctions2[format3] = formatFunctions2[format3] || makeFormatFunction2(format3);
      return formatFunctions2[format3](m);
    }
    function expandFormat(format3, locale2) {
      var i = 5;
      function replaceLongDateFormatTokens(input2) {
        return locale2.longDateFormat(input2) || input2;
      }
      localFormattingTokens2.lastIndex = 0;
      while (i >= 0 && localFormattingTokens2.test(format3)) {
        format3 = format3.replace(
          localFormattingTokens2,
          replaceLongDateFormatTokens
        );
        localFormattingTokens2.lastIndex = 0;
        i -= 1;
      }
      return format3;
    }
    var defaultLongDateFormat = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function longDateFormat(key) {
      var format3 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
      if (format3 || !formatUpper) {
        return format3;
      }
      this._longDateFormat[key] = formatUpper.match(formattingTokens2).map(function(tok) {
        if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
          return tok.slice(1);
        }
        return tok;
      }).join("");
      return this._longDateFormat[key];
    }
    var defaultInvalidDate = "Invalid date";
    function invalidDate() {
      return this._invalidDate;
    }
    var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
    function ordinal(number) {
      return this._ordinal.replace("%d", number);
    }
    var defaultRelativeTime = {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    };
    function relativeTime(number, withoutSuffix, string, isFuture) {
      var output = this._relativeTime[string];
      return isFunction2(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }
    function pastFuture(diff2, output) {
      var format3 = this._relativeTime[diff2 > 0 ? "future" : "past"];
      return isFunction2(format3) ? format3(output) : format3.replace(/%s/i, output);
    }
    var aliases = {
      D: "date",
      dates: "date",
      date: "date",
      d: "day",
      days: "day",
      day: "day",
      e: "weekday",
      weekdays: "weekday",
      weekday: "weekday",
      E: "isoWeekday",
      isoweekdays: "isoWeekday",
      isoweekday: "isoWeekday",
      DDD: "dayOfYear",
      dayofyears: "dayOfYear",
      dayofyear: "dayOfYear",
      h: "hour",
      hours: "hour",
      hour: "hour",
      ms: "millisecond",
      milliseconds: "millisecond",
      millisecond: "millisecond",
      m: "minute",
      minutes: "minute",
      minute: "minute",
      M: "month",
      months: "month",
      month: "month",
      Q: "quarter",
      quarters: "quarter",
      quarter: "quarter",
      s: "second",
      seconds: "second",
      second: "second",
      gg: "weekYear",
      weekyears: "weekYear",
      weekyear: "weekYear",
      GG: "isoWeekYear",
      isoweekyears: "isoWeekYear",
      isoweekyear: "isoWeekYear",
      w: "week",
      weeks: "week",
      week: "week",
      W: "isoWeek",
      isoweeks: "isoWeek",
      isoweek: "isoWeek",
      y: "year",
      years: "year",
      year: "year"
    };
    function normalizeUnits2(units) {
      return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
    }
    function normalizeObjectUnits(inputObject) {
      var normalizedInput = {}, normalizedProp, prop;
      for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
          normalizedProp = normalizeUnits2(prop);
          if (normalizedProp) {
            normalizedInput[normalizedProp] = inputObject[prop];
          }
        }
      }
      return normalizedInput;
    }
    var priorities = {
      date: 9,
      day: 11,
      weekday: 11,
      isoWeekday: 11,
      dayOfYear: 4,
      hour: 13,
      millisecond: 16,
      minute: 14,
      month: 8,
      quarter: 7,
      second: 15,
      weekYear: 1,
      isoWeekYear: 1,
      week: 5,
      isoWeek: 5,
      year: 1
    };
    function getPrioritizedUnits(unitsObj) {
      var units = [], u;
      for (u in unitsObj) {
        if (hasOwnProp(unitsObj, u)) {
          units.push({ unit: u, priority: priorities[u] });
        }
      }
      units.sort(function(a, b) {
        return a.priority - b.priority;
      });
      return units;
    }
    var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, match1to2NoLeadingZero = /^[1-9]\d?/, match1to2HasZero = /^([1-9]\d|\d)/, regexes;
    regexes = {};
    function addRegexToken(token3, regex, strictRegex) {
      regexes[token3] = isFunction2(regex) ? regex : function(isStrict, localeData2) {
        return isStrict && strictRegex ? strictRegex : regex;
      };
    }
    function getParseRegexForToken2(token3, config) {
      if (!hasOwnProp(regexes, token3)) {
        return new RegExp(unescapeFormat(token3));
      }
      return regexes[token3](config._strict, config._locale);
    }
    function unescapeFormat(s) {
      return regexEscape(
        s.replace("\\", "").replace(
          /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
          function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
          }
        )
      );
    }
    function regexEscape(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function absFloor(number) {
      if (number < 0) {
        return Math.ceil(number) || 0;
      } else {
        return Math.floor(number);
      }
    }
    function toInt(argumentForCoercion) {
      var coercedNumber = +argumentForCoercion, value = 0;
      if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
      }
      return value;
    }
    var tokens = {};
    function addParseToken(token3, callback) {
      var i, func = callback, tokenLen;
      if (typeof token3 === "string") {
        token3 = [token3];
      }
      if (isNumber2(callback)) {
        func = function(input2, array) {
          array[callback] = toInt(input2);
        };
      }
      tokenLen = token3.length;
      for (i = 0; i < tokenLen; i++) {
        tokens[token3[i]] = func;
      }
    }
    function addWeekParseToken(token3, callback) {
      addParseToken(token3, function(input2, array, config, token4) {
        config._w = config._w || {};
        callback(input2, config._w, config, token4);
      });
    }
    function addTimeToArrayFromToken2(token3, input2, config) {
      if (input2 != null && hasOwnProp(tokens, token3)) {
        tokens[token3](input2, config._a, config, token3);
      }
    }
    function isLeapYear(year) {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
    addFormatToken("Y", 0, 0, function() {
      var y = this.year();
      return y <= 9999 ? zeroFill(y, 4) : "+" + y;
    });
    addFormatToken(0, ["YY", 2], 0, function() {
      return this.year() % 100;
    });
    addFormatToken(0, ["YYYY", 4], 0, "year");
    addFormatToken(0, ["YYYYY", 5], 0, "year");
    addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
    addRegexToken("Y", matchSigned);
    addRegexToken("YY", match1to2, match2);
    addRegexToken("YYYY", match1to4, match4);
    addRegexToken("YYYYY", match1to6, match6);
    addRegexToken("YYYYYY", match1to6, match6);
    addParseToken(["YYYYY", "YYYYYY"], YEAR);
    addParseToken("YYYY", function(input2, array) {
      array[YEAR] = input2.length === 2 ? hooks.parseTwoDigitYear(input2) : toInt(input2);
    });
    addParseToken("YY", function(input2, array) {
      array[YEAR] = hooks.parseTwoDigitYear(input2);
    });
    addParseToken("Y", function(input2, array) {
      array[YEAR] = parseInt(input2, 10);
    });
    function daysInYear(year) {
      return isLeapYear(year) ? 366 : 365;
    }
    hooks.parseTwoDigitYear = function(input2) {
      return toInt(input2) + (toInt(input2) > 68 ? 1900 : 2e3);
    };
    var getSetYear = makeGetSet("FullYear", true);
    function getIsLeapYear() {
      return isLeapYear(this.year());
    }
    function makeGetSet(unit, keepTime) {
      return function(value) {
        if (value != null) {
          set$1(this, unit, value);
          hooks.updateOffset(this, keepTime);
          return this;
        } else {
          return get2(this, unit);
        }
      };
    }
    function get2(mom, unit) {
      if (!mom.isValid()) {
        return NaN;
      }
      var d = mom._d, isUTC = mom._isUTC;
      switch (unit) {
        case "Milliseconds":
          return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
        case "Seconds":
          return isUTC ? d.getUTCSeconds() : d.getSeconds();
        case "Minutes":
          return isUTC ? d.getUTCMinutes() : d.getMinutes();
        case "Hours":
          return isUTC ? d.getUTCHours() : d.getHours();
        case "Date":
          return isUTC ? d.getUTCDate() : d.getDate();
        case "Day":
          return isUTC ? d.getUTCDay() : d.getDay();
        case "Month":
          return isUTC ? d.getUTCMonth() : d.getMonth();
        case "FullYear":
          return isUTC ? d.getUTCFullYear() : d.getFullYear();
        default:
          return NaN;
      }
    }
    function set$1(mom, unit, value) {
      var d, isUTC, year, month, date;
      if (!mom.isValid() || isNaN(value)) {
        return;
      }
      d = mom._d;
      isUTC = mom._isUTC;
      switch (unit) {
        case "Milliseconds":
          return void (isUTC ? d.setUTCMilliseconds(value) : d.setMilliseconds(value));
        case "Seconds":
          return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
        case "Minutes":
          return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
        case "Hours":
          return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
        case "Date":
          return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
        case "FullYear":
          break;
        default:
          return;
      }
      year = value;
      month = mom.month();
      date = mom.date();
      date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;
      void (isUTC ? d.setUTCFullYear(year, month, date) : d.setFullYear(year, month, date));
    }
    function stringGet(units) {
      units = normalizeUnits2(units);
      if (isFunction2(this[units])) {
        return this[units]();
      }
      return this;
    }
    function stringSet(units, value) {
      if (typeof units === "object") {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units), i, prioritizedLen = prioritized.length;
        for (i = 0; i < prioritizedLen; i++) {
          this[prioritized[i].unit](units[prioritized[i].unit]);
        }
      } else {
        units = normalizeUnits2(units);
        if (isFunction2(this[units])) {
          return this[units](value);
        }
      }
      return this;
    }
    function mod2(n, x) {
      return (n % x + x) % x;
    }
    var indexOf;
    if (Array.prototype.indexOf) {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function(o) {
        var i;
        for (i = 0; i < this.length; ++i) {
          if (this[i] === o) {
            return i;
          }
        }
        return -1;
      };
    }
    function daysInMonth(year, month) {
      if (isNaN(year) || isNaN(month)) {
        return NaN;
      }
      var modMonth = mod2(month, 12);
      year += (month - modMonth) / 12;
      return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
    }
    addFormatToken("M", ["MM", 2], "Mo", function() {
      return this.month() + 1;
    });
    addFormatToken("MMM", 0, 0, function(format3) {
      return this.localeData().monthsShort(this, format3);
    });
    addFormatToken("MMMM", 0, 0, function(format3) {
      return this.localeData().months(this, format3);
    });
    addRegexToken("M", match1to2, match1to2NoLeadingZero);
    addRegexToken("MM", match1to2, match2);
    addRegexToken("MMM", function(isStrict, locale2) {
      return locale2.monthsShortRegex(isStrict);
    });
    addRegexToken("MMMM", function(isStrict, locale2) {
      return locale2.monthsRegex(isStrict);
    });
    addParseToken(["M", "MM"], function(input2, array) {
      array[MONTH] = toInt(input2) - 1;
    });
    addParseToken(["MMM", "MMMM"], function(input2, array, config, token3) {
      var month = config._locale.monthsParse(input2, token3, config._strict);
      if (month != null) {
        array[MONTH] = month;
      } else {
        getParsingFlags(config).invalidMonth = input2;
      }
    });
    var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
      "_"
    ), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
    function localeMonths(m, format3) {
      if (!m) {
        return isArray2(this._months) ? this._months : this._months["standalone"];
      }
      return isArray2(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format3) ? "format" : "standalone"][m.month()];
    }
    function localeMonthsShort(m, format3) {
      if (!m) {
        return isArray2(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
      }
      return isArray2(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format3) ? "format" : "standalone"][m.month()];
    }
    function handleStrictParse(monthName, format3, strict) {
      var i, ii, mom, llc = monthName.toLocaleLowerCase();
      if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
          mom = createUTC([2e3, i]);
          this._shortMonthsParse[i] = this.monthsShort(
            mom,
            ""
          ).toLocaleLowerCase();
          this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
        }
      }
      if (strict) {
        if (format3 === "MMM") {
          ii = indexOf.call(this._shortMonthsParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._longMonthsParse, llc);
          return ii !== -1 ? ii : null;
        }
      } else {
        if (format3 === "MMM") {
          ii = indexOf.call(this._shortMonthsParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._longMonthsParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._longMonthsParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortMonthsParse, llc);
          return ii !== -1 ? ii : null;
        }
      }
    }
    function localeMonthsParse(monthName, format3, strict) {
      var i, mom, regex;
      if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format3, strict);
      }
      if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
      }
      for (i = 0; i < 12; i++) {
        mom = createUTC([2e3, i]);
        if (strict && !this._longMonthsParse[i]) {
          this._longMonthsParse[i] = new RegExp(
            "^" + this.months(mom, "").replace(".", "") + "$",
            "i"
          );
          this._shortMonthsParse[i] = new RegExp(
            "^" + this.monthsShort(mom, "").replace(".", "") + "$",
            "i"
          );
        }
        if (!strict && !this._monthsParse[i]) {
          regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
          this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
        }
        if (strict && format3 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
          return i;
        } else if (strict && format3 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
          return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
          return i;
        }
      }
    }
    function setMonth2(mom, value) {
      if (!mom.isValid()) {
        return mom;
      }
      if (typeof value === "string") {
        if (/^\d+$/.test(value)) {
          value = toInt(value);
        } else {
          value = mom.localeData().monthsParse(value);
          if (!isNumber2(value)) {
            return mom;
          }
        }
      }
      var month = value, date = mom.date();
      date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
      void (mom._isUTC ? mom._d.setUTCMonth(month, date) : mom._d.setMonth(month, date));
      return mom;
    }
    function getSetMonth(value) {
      if (value != null) {
        setMonth2(this, value);
        hooks.updateOffset(this, true);
        return this;
      } else {
        return get2(this, "Month");
      }
    }
    function getDaysInMonth2() {
      return daysInMonth(this.year(), this.month());
    }
    function monthsShortRegex(isStrict) {
      if (this._monthsParseExact) {
        if (!hasOwnProp(this, "_monthsRegex")) {
          computeMonthsParse.call(this);
        }
        if (isStrict) {
          return this._monthsShortStrictRegex;
        } else {
          return this._monthsShortRegex;
        }
      } else {
        if (!hasOwnProp(this, "_monthsShortRegex")) {
          this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
      }
    }
    function monthsRegex(isStrict) {
      if (this._monthsParseExact) {
        if (!hasOwnProp(this, "_monthsRegex")) {
          computeMonthsParse.call(this);
        }
        if (isStrict) {
          return this._monthsStrictRegex;
        } else {
          return this._monthsRegex;
        }
      } else {
        if (!hasOwnProp(this, "_monthsRegex")) {
          this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
      }
    }
    function computeMonthsParse() {
      function cmpLenRev(a, b) {
        return b.length - a.length;
      }
      var shortPieces = [], longPieces = [], mixedPieces = [], i, mom, shortP, longP;
      for (i = 0; i < 12; i++) {
        mom = createUTC([2e3, i]);
        shortP = regexEscape(this.monthsShort(mom, ""));
        longP = regexEscape(this.months(mom, ""));
        shortPieces.push(shortP);
        longPieces.push(longP);
        mixedPieces.push(longP);
        mixedPieces.push(shortP);
      }
      shortPieces.sort(cmpLenRev);
      longPieces.sort(cmpLenRev);
      mixedPieces.sort(cmpLenRev);
      this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._monthsShortRegex = this._monthsRegex;
      this._monthsStrictRegex = new RegExp(
        "^(" + longPieces.join("|") + ")",
        "i"
      );
      this._monthsShortStrictRegex = new RegExp(
        "^(" + shortPieces.join("|") + ")",
        "i"
      );
    }
    function createDate(y, m, d, h2, M, s, ms) {
      var date;
      if (y < 100 && y >= 0) {
        date = new Date(y + 400, m, d, h2, M, s, ms);
        if (isFinite(date.getFullYear())) {
          date.setFullYear(y);
        }
      } else {
        date = new Date(y, m, d, h2, M, s, ms);
      }
      return date;
    }
    function createUTCDate(y) {
      var date, args;
      if (y < 100 && y >= 0) {
        args = Array.prototype.slice.call(arguments);
        args[0] = y + 400;
        date = new Date(Date.UTC.apply(null, args));
        if (isFinite(date.getUTCFullYear())) {
          date.setUTCFullYear(y);
        }
      } else {
        date = new Date(Date.UTC.apply(null, arguments));
      }
      return date;
    }
    function firstWeekOffset(year, dow, doy) {
      var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
      return -fwdlw + fwd - 1;
    }
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
      var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
      if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
      } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
      } else {
        resYear = year;
        resDayOfYear = dayOfYear;
      }
      return {
        year: resYear,
        dayOfYear: resDayOfYear
      };
    }
    function weekOfYear(mom, dow, doy) {
      var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
      if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
      } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
      } else {
        resYear = mom.year();
        resWeek = week;
      }
      return {
        week: resWeek,
        year: resYear
      };
    }
    function weeksInYear(year, dow, doy) {
      var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
      return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }
    addFormatToken("w", ["ww", 2], "wo", "week");
    addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
    addRegexToken("w", match1to2, match1to2NoLeadingZero);
    addRegexToken("ww", match1to2, match2);
    addRegexToken("W", match1to2, match1to2NoLeadingZero);
    addRegexToken("WW", match1to2, match2);
    addWeekParseToken(
      ["w", "ww", "W", "WW"],
      function(input2, week, config, token3) {
        week[token3.substr(0, 1)] = toInt(input2);
      }
    );
    function localeWeek(mom) {
      return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }
    var defaultLocaleWeek = {
      dow: 0,
      doy: 6
    };
    function localeFirstDayOfWeek() {
      return this._week.dow;
    }
    function localeFirstDayOfYear() {
      return this._week.doy;
    }
    function getSetWeek(input2) {
      var week = this.localeData().week(this);
      return input2 == null ? week : this.add((input2 - week) * 7, "d");
    }
    function getSetISOWeek(input2) {
      var week = weekOfYear(this, 1, 4).week;
      return input2 == null ? week : this.add((input2 - week) * 7, "d");
    }
    addFormatToken("d", 0, "do", "day");
    addFormatToken("dd", 0, 0, function(format3) {
      return this.localeData().weekdaysMin(this, format3);
    });
    addFormatToken("ddd", 0, 0, function(format3) {
      return this.localeData().weekdaysShort(this, format3);
    });
    addFormatToken("dddd", 0, 0, function(format3) {
      return this.localeData().weekdays(this, format3);
    });
    addFormatToken("e", 0, 0, "weekday");
    addFormatToken("E", 0, 0, "isoWeekday");
    addRegexToken("d", match1to2);
    addRegexToken("e", match1to2);
    addRegexToken("E", match1to2);
    addRegexToken("dd", function(isStrict, locale2) {
      return locale2.weekdaysMinRegex(isStrict);
    });
    addRegexToken("ddd", function(isStrict, locale2) {
      return locale2.weekdaysShortRegex(isStrict);
    });
    addRegexToken("dddd", function(isStrict, locale2) {
      return locale2.weekdaysRegex(isStrict);
    });
    addWeekParseToken(["dd", "ddd", "dddd"], function(input2, week, config, token3) {
      var weekday = config._locale.weekdaysParse(input2, token3, config._strict);
      if (weekday != null) {
        week.d = weekday;
      } else {
        getParsingFlags(config).invalidWeekday = input2;
      }
    });
    addWeekParseToken(["d", "e", "E"], function(input2, week, config, token3) {
      week[token3] = toInt(input2);
    });
    function parseWeekday(input2, locale2) {
      if (typeof input2 !== "string") {
        return input2;
      }
      if (!isNaN(input2)) {
        return parseInt(input2, 10);
      }
      input2 = locale2.weekdaysParse(input2);
      if (typeof input2 === "number") {
        return input2;
      }
      return null;
    }
    function parseIsoWeekday(input2, locale2) {
      if (typeof input2 === "string") {
        return locale2.weekdaysParse(input2) % 7 || 7;
      }
      return isNaN(input2) ? null : input2;
    }
    function shiftWeekdays(ws, n) {
      return ws.slice(n, 7).concat(ws.slice(0, n));
    }
    var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
    function localeWeekdays(m, format3) {
      var weekdays2 = isArray2(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format3) ? "format" : "standalone"];
      return m === true ? shiftWeekdays(weekdays2, this._week.dow) : m ? weekdays2[m.day()] : weekdays2;
    }
    function localeWeekdaysShort(m) {
      return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }
    function localeWeekdaysMin(m) {
      return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }
    function handleStrictParse$1(weekdayName, format3, strict) {
      var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
      if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];
        for (i = 0; i < 7; ++i) {
          mom = createUTC([2e3, 1]).day(i);
          this._minWeekdaysParse[i] = this.weekdaysMin(
            mom,
            ""
          ).toLocaleLowerCase();
          this._shortWeekdaysParse[i] = this.weekdaysShort(
            mom,
            ""
          ).toLocaleLowerCase();
          this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
        }
      }
      if (strict) {
        if (format3 === "dddd") {
          ii = indexOf.call(this._weekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else if (format3 === "ddd") {
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        }
      } else {
        if (format3 === "dddd") {
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else if (format3 === "ddd") {
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._minWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        }
      }
    }
    function localeWeekdaysParse(weekdayName, format3, strict) {
      var i, mom, regex;
      if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format3, strict);
      }
      if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
      }
      for (i = 0; i < 7; i++) {
        mom = createUTC([2e3, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
          this._fullWeekdaysParse[i] = new RegExp(
            "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
          this._shortWeekdaysParse[i] = new RegExp(
            "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
          this._minWeekdaysParse[i] = new RegExp(
            "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
        }
        if (!this._weekdaysParse[i]) {
          regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
          this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
        }
        if (strict && format3 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format3 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format3 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
          return i;
        }
      }
    }
    function getSetDayOfWeek(input2) {
      if (!this.isValid()) {
        return input2 != null ? this : NaN;
      }
      var day = get2(this, "Day");
      if (input2 != null) {
        input2 = parseWeekday(input2, this.localeData());
        return this.add(input2 - day, "d");
      } else {
        return day;
      }
    }
    function getSetLocaleDayOfWeek(input2) {
      if (!this.isValid()) {
        return input2 != null ? this : NaN;
      }
      var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return input2 == null ? weekday : this.add(input2 - weekday, "d");
    }
    function getSetISODayOfWeek(input2) {
      if (!this.isValid()) {
        return input2 != null ? this : NaN;
      }
      if (input2 != null) {
        var weekday = parseIsoWeekday(input2, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
      } else {
        return this.day() || 7;
      }
    }
    function weekdaysRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysStrictRegex;
        } else {
          return this._weekdaysRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
      }
    }
    function weekdaysShortRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysShortStrictRegex;
        } else {
          return this._weekdaysShortRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysShortRegex")) {
          this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
      }
    }
    function weekdaysMinRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysMinStrictRegex;
        } else {
          return this._weekdaysMinRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysMinRegex")) {
          this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
      }
    }
    function computeWeekdaysParse() {
      function cmpLenRev(a, b) {
        return b.length - a.length;
      }
      var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
      for (i = 0; i < 7; i++) {
        mom = createUTC([2e3, 1]).day(i);
        minp = regexEscape(this.weekdaysMin(mom, ""));
        shortp = regexEscape(this.weekdaysShort(mom, ""));
        longp = regexEscape(this.weekdays(mom, ""));
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
      }
      minPieces.sort(cmpLenRev);
      shortPieces.sort(cmpLenRev);
      longPieces.sort(cmpLenRev);
      mixedPieces.sort(cmpLenRev);
      this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._weekdaysShortRegex = this._weekdaysRegex;
      this._weekdaysMinRegex = this._weekdaysRegex;
      this._weekdaysStrictRegex = new RegExp(
        "^(" + longPieces.join("|") + ")",
        "i"
      );
      this._weekdaysShortStrictRegex = new RegExp(
        "^(" + shortPieces.join("|") + ")",
        "i"
      );
      this._weekdaysMinStrictRegex = new RegExp(
        "^(" + minPieces.join("|") + ")",
        "i"
      );
    }
    function hFormat() {
      return this.hours() % 12 || 12;
    }
    function kFormat() {
      return this.hours() || 24;
    }
    addFormatToken("H", ["HH", 2], 0, "hour");
    addFormatToken("h", ["hh", 2], 0, hFormat);
    addFormatToken("k", ["kk", 2], 0, kFormat);
    addFormatToken("hmm", 0, 0, function() {
      return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });
    addFormatToken("hmmss", 0, 0, function() {
      return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });
    addFormatToken("Hmm", 0, 0, function() {
      return "" + this.hours() + zeroFill(this.minutes(), 2);
    });
    addFormatToken("Hmmss", 0, 0, function() {
      return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });
    function meridiem(token3, lowercase) {
      addFormatToken(token3, 0, 0, function() {
        return this.localeData().meridiem(
          this.hours(),
          this.minutes(),
          lowercase
        );
      });
    }
    meridiem("a", true);
    meridiem("A", false);
    function matchMeridiem(isStrict, locale2) {
      return locale2._meridiemParse;
    }
    addRegexToken("a", matchMeridiem);
    addRegexToken("A", matchMeridiem);
    addRegexToken("H", match1to2, match1to2HasZero);
    addRegexToken("h", match1to2, match1to2NoLeadingZero);
    addRegexToken("k", match1to2, match1to2NoLeadingZero);
    addRegexToken("HH", match1to2, match2);
    addRegexToken("hh", match1to2, match2);
    addRegexToken("kk", match1to2, match2);
    addRegexToken("hmm", match3to4);
    addRegexToken("hmmss", match5to6);
    addRegexToken("Hmm", match3to4);
    addRegexToken("Hmmss", match5to6);
    addParseToken(["H", "HH"], HOUR);
    addParseToken(["k", "kk"], function(input2, array, config) {
      var kInput = toInt(input2);
      array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(["a", "A"], function(input2, array, config) {
      config._isPm = config._locale.isPM(input2);
      config._meridiem = input2;
    });
    addParseToken(["h", "hh"], function(input2, array, config) {
      array[HOUR] = toInt(input2);
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("hmm", function(input2, array, config) {
      var pos = input2.length - 2;
      array[HOUR] = toInt(input2.substr(0, pos));
      array[MINUTE] = toInt(input2.substr(pos));
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("hmmss", function(input2, array, config) {
      var pos1 = input2.length - 4, pos2 = input2.length - 2;
      array[HOUR] = toInt(input2.substr(0, pos1));
      array[MINUTE] = toInt(input2.substr(pos1, 2));
      array[SECOND] = toInt(input2.substr(pos2));
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("Hmm", function(input2, array, config) {
      var pos = input2.length - 2;
      array[HOUR] = toInt(input2.substr(0, pos));
      array[MINUTE] = toInt(input2.substr(pos));
    });
    addParseToken("Hmmss", function(input2, array, config) {
      var pos1 = input2.length - 4, pos2 = input2.length - 2;
      array[HOUR] = toInt(input2.substr(0, pos1));
      array[MINUTE] = toInt(input2.substr(pos1, 2));
      array[SECOND] = toInt(input2.substr(pos2));
    });
    function localeIsPM(input2) {
      return (input2 + "").toLowerCase().charAt(0) === "p";
    }
    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
    function localeMeridiem(hours2, minutes2, isLower) {
      if (hours2 > 11) {
        return isLower ? "pm" : "PM";
      } else {
        return isLower ? "am" : "AM";
      }
    }
    var baseConfig = {
      calendar: defaultCalendar,
      longDateFormat: defaultLongDateFormat,
      invalidDate: defaultInvalidDate,
      ordinal: defaultOrdinal,
      dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
      relativeTime: defaultRelativeTime,
      months: defaultLocaleMonths,
      monthsShort: defaultLocaleMonthsShort,
      week: defaultLocaleWeek,
      weekdays: defaultLocaleWeekdays,
      weekdaysMin: defaultLocaleWeekdaysMin,
      weekdaysShort: defaultLocaleWeekdaysShort,
      meridiemParse: defaultLocaleMeridiemParse
    };
    var locales2 = {}, localeFamilies = {}, globalLocale;
    function commonPrefix(arr1, arr2) {
      var i, minl = Math.min(arr1.length, arr2.length);
      for (i = 0; i < minl; i += 1) {
        if (arr1[i] !== arr2[i]) {
          return i;
        }
      }
      return minl;
    }
    function normalizeLocale(key) {
      return key ? key.toLowerCase().replace("_", "-") : key;
    }
    function chooseLocale(names) {
      var i = 0, j, next, locale2, split;
      while (i < names.length) {
        split = normalizeLocale(names[i]).split("-");
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split("-") : null;
        while (j > 0) {
          locale2 = loadLocale(split.slice(0, j).join("-"));
          if (locale2) {
            return locale2;
          }
          if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
            break;
          }
          j--;
        }
        i++;
      }
      return globalLocale;
    }
    function isLocaleNameSane(name) {
      return !!(name && name.match("^[^/\\\\]*$"));
    }
    function loadLocale(name) {
      var oldLocale = null, aliasedRequire;
      if (locales2[name] === void 0 && true && module && module.exports && isLocaleNameSane(name)) {
        try {
          oldLocale = globalLocale._abbr;
          aliasedRequire = commonjsRequire;
          aliasedRequire("./locale/" + name);
          getSetGlobalLocale(oldLocale);
        } catch (e) {
          locales2[name] = null;
        }
      }
      return locales2[name];
    }
    function getSetGlobalLocale(key, values) {
      var data2;
      if (key) {
        if (isUndefined2(values)) {
          data2 = getLocale(key);
        } else {
          data2 = defineLocale(key, values);
        }
        if (data2) {
          globalLocale = data2;
        } else {
          if (typeof console !== "undefined" && console.warn) {
            console.warn(
              "Locale " + key + " not found. Did you forget to load it?"
            );
          }
        }
      }
      return globalLocale._abbr;
    }
    function defineLocale(name, config) {
      if (config !== null) {
        var locale2, parentConfig = baseConfig;
        config.abbr = name;
        if (locales2[name] != null) {
          deprecateSimple(
            "defineLocaleOverride",
            "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
          );
          parentConfig = locales2[name]._config;
        } else if (config.parentLocale != null) {
          if (locales2[config.parentLocale] != null) {
            parentConfig = locales2[config.parentLocale]._config;
          } else {
            locale2 = loadLocale(config.parentLocale);
            if (locale2 != null) {
              parentConfig = locale2._config;
            } else {
              if (!localeFamilies[config.parentLocale]) {
                localeFamilies[config.parentLocale] = [];
              }
              localeFamilies[config.parentLocale].push({
                name,
                config
              });
              return null;
            }
          }
        }
        locales2[name] = new Locale2(mergeConfigs(parentConfig, config));
        if (localeFamilies[name]) {
          localeFamilies[name].forEach(function(x) {
            defineLocale(x.name, x.config);
          });
        }
        getSetGlobalLocale(name);
        return locales2[name];
      } else {
        delete locales2[name];
        return null;
      }
    }
    function updateLocale(name, config) {
      if (config != null) {
        var locale2, tmpLocale, parentConfig = baseConfig;
        if (locales2[name] != null && locales2[name].parentLocale != null) {
          locales2[name].set(mergeConfigs(locales2[name]._config, config));
        } else {
          tmpLocale = loadLocale(name);
          if (tmpLocale != null) {
            parentConfig = tmpLocale._config;
          }
          config = mergeConfigs(parentConfig, config);
          if (tmpLocale == null) {
            config.abbr = name;
          }
          locale2 = new Locale2(config);
          locale2.parentLocale = locales2[name];
          locales2[name] = locale2;
        }
        getSetGlobalLocale(name);
      } else {
        if (locales2[name] != null) {
          if (locales2[name].parentLocale != null) {
            locales2[name] = locales2[name].parentLocale;
            if (name === getSetGlobalLocale()) {
              getSetGlobalLocale(name);
            }
          } else if (locales2[name] != null) {
            delete locales2[name];
          }
        }
      }
      return locales2[name];
    }
    function getLocale(key) {
      var locale2;
      if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
      }
      if (!key) {
        return globalLocale;
      }
      if (!isArray2(key)) {
        locale2 = loadLocale(key);
        if (locale2) {
          return locale2;
        }
        key = [key];
      }
      return chooseLocale(key);
    }
    function listLocales() {
      return keys2(locales2);
    }
    function checkOverflow(m) {
      var overflow, a = m._a;
      if (a && getParsingFlags(m).overflow === -2) {
        overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
          overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
          overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
          overflow = WEEKDAY;
        }
        getParsingFlags(m).overflow = overflow;
      }
      return m;
    }
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
      ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
      ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
      ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
      ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
      ["YYYY-DDD", /\d{4}-\d{3}/],
      ["YYYY-MM", /\d{4}-\d\d/, false],
      ["YYYYYYMMDD", /[+-]\d{10}/],
      ["YYYYMMDD", /\d{8}/],
      ["GGGG[W]WWE", /\d{4}W\d{3}/],
      ["GGGG[W]WW", /\d{4}W\d{2}/, false],
      ["YYYYDDD", /\d{7}/],
      ["YYYYMM", /\d{6}/, false],
      ["YYYY", /\d{4}/, false]
    ], isoTimes = [
      ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
      ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
      ["HH:mm:ss", /\d\d:\d\d:\d\d/],
      ["HH:mm", /\d\d:\d\d/],
      ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
      ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
      ["HHmmss", /\d\d\d\d\d\d/],
      ["HHmm", /\d\d\d\d/],
      ["HH", /\d\d/]
    ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
      UT: 0,
      GMT: 0,
      EDT: -4 * 60,
      EST: -5 * 60,
      CDT: -5 * 60,
      CST: -6 * 60,
      MDT: -6 * 60,
      MST: -7 * 60,
      PDT: -7 * 60,
      PST: -8 * 60
    };
    function configFromISO(config) {
      var i, l, string = config._i, match5 = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
      if (match5) {
        getParsingFlags(config).iso = true;
        for (i = 0, l = isoDatesLen; i < l; i++) {
          if (isoDates[i][1].exec(match5[1])) {
            dateFormat = isoDates[i][0];
            allowTime = isoDates[i][2] !== false;
            break;
          }
        }
        if (dateFormat == null) {
          config._isValid = false;
          return;
        }
        if (match5[3]) {
          for (i = 0, l = isoTimesLen; i < l; i++) {
            if (isoTimes[i][1].exec(match5[3])) {
              timeFormat = (match5[2] || " ") + isoTimes[i][0];
              break;
            }
          }
          if (timeFormat == null) {
            config._isValid = false;
            return;
          }
        }
        if (!allowTime && timeFormat != null) {
          config._isValid = false;
          return;
        }
        if (match5[4]) {
          if (tzRegex.exec(match5[4])) {
            tzFormat = "Z";
          } else {
            config._isValid = false;
            return;
          }
        }
        config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
        configFromStringAndFormat(config);
      } else {
        config._isValid = false;
      }
    }
    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
      var result = [
        untruncateYear(yearStr),
        defaultLocaleMonthsShort.indexOf(monthStr),
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
      ];
      if (secondStr) {
        result.push(parseInt(secondStr, 10));
      }
      return result;
    }
    function untruncateYear(yearStr) {
      var year = parseInt(yearStr, 10);
      if (year <= 49) {
        return 2e3 + year;
      } else if (year <= 999) {
        return 1900 + year;
      }
      return year;
    }
    function preprocessRFC2822(s) {
      return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function checkWeekday(weekdayStr, parsedInput, config) {
      if (weekdayStr) {
        var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
          parsedInput[0],
          parsedInput[1],
          parsedInput[2]
        ).getDay();
        if (weekdayProvided !== weekdayActual) {
          getParsingFlags(config).weekdayMismatch = true;
          config._isValid = false;
          return false;
        }
      }
      return true;
    }
    function calculateOffset(obsOffset, militaryOffset, numOffset) {
      if (obsOffset) {
        return obsOffsets[obsOffset];
      } else if (militaryOffset) {
        return 0;
      } else {
        var hm = parseInt(numOffset, 10), m = hm % 100, h2 = (hm - m) / 100;
        return h2 * 60 + m;
      }
    }
    function configFromRFC2822(config) {
      var match5 = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
      if (match5) {
        parsedArray = extractFromRFC2822Strings(
          match5[4],
          match5[3],
          match5[2],
          match5[5],
          match5[6],
          match5[7]
        );
        if (!checkWeekday(match5[1], parsedArray, config)) {
          return;
        }
        config._a = parsedArray;
        config._tzm = calculateOffset(match5[8], match5[9], match5[10]);
        config._d = createUTCDate.apply(null, config._a);
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        getParsingFlags(config).rfc2822 = true;
      } else {
        config._isValid = false;
      }
    }
    function configFromString(config) {
      var matched = aspNetJsonRegex.exec(config._i);
      if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
      }
      configFromISO(config);
      if (config._isValid === false) {
        delete config._isValid;
      } else {
        return;
      }
      configFromRFC2822(config);
      if (config._isValid === false) {
        delete config._isValid;
      } else {
        return;
      }
      if (config._strict) {
        config._isValid = false;
      } else {
        hooks.createFromInputFallback(config);
      }
    }
    hooks.createFromInputFallback = deprecate(
      "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
      function(config) {
        config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
      }
    );
    function defaults2(a, b, c) {
      if (a != null) {
        return a;
      }
      if (b != null) {
        return b;
      }
      return c;
    }
    function currentDateArray(config) {
      var nowValue = new Date(hooks.now());
      if (config._useUTC) {
        return [
          nowValue.getUTCFullYear(),
          nowValue.getUTCMonth(),
          nowValue.getUTCDate()
        ];
      }
      return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }
    function configFromArray(config) {
      var i, date, input2 = [], currentDate, expectedWeekday, yearToUse;
      if (config._d) {
        return;
      }
      currentDate = currentDateArray(config);
      if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
      }
      if (config._dayOfYear != null) {
        yearToUse = defaults2(config._a[YEAR], currentDate[YEAR]);
        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
          getParsingFlags(config)._overflowDayOfYear = true;
        }
        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
      }
      for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input2[i] = currentDate[i];
      }
      for (; i < 7; i++) {
        config._a[i] = input2[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
      }
      if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
      }
      config._d = (config._useUTC ? createUTCDate : createDate).apply(
        null,
        input2
      );
      expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
      if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
      }
      if (config._nextDay) {
        config._a[HOUR] = 24;
      }
      if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
        getParsingFlags(config).weekdayMismatch = true;
      }
    }
    function dayOfYearFromWeekInfo(config) {
      var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
      w = config._w;
      if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;
        weekYear = defaults2(
          w.GG,
          config._a[YEAR],
          weekOfYear(createLocal(), 1, 4).year
        );
        week = defaults2(w.W, 1);
        weekday = defaults2(w.E, 1);
        if (weekday < 1 || weekday > 7) {
          weekdayOverflow = true;
        }
      } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;
        curWeek = weekOfYear(createLocal(), dow, doy);
        weekYear = defaults2(w.gg, config._a[YEAR], curWeek.year);
        week = defaults2(w.w, curWeek.week);
        if (w.d != null) {
          weekday = w.d;
          if (weekday < 0 || weekday > 6) {
            weekdayOverflow = true;
          }
        } else if (w.e != null) {
          weekday = w.e + dow;
          if (w.e < 0 || w.e > 6) {
            weekdayOverflow = true;
          }
        } else {
          weekday = dow;
        }
      }
      if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
      } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
      } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
      }
    }
    hooks.ISO_8601 = function() {
    };
    hooks.RFC_2822 = function() {
    };
    function configFromStringAndFormat(config) {
      if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
      }
      if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
      }
      config._a = [];
      getParsingFlags(config).empty = true;
      var string = "" + config._i, i, parsedInput, tokens2, token3, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
      tokens2 = expandFormat(config._f, config._locale).match(formattingTokens2) || [];
      tokenLen = tokens2.length;
      for (i = 0; i < tokenLen; i++) {
        token3 = tokens2[i];
        parsedInput = (string.match(getParseRegexForToken2(token3, config)) || [])[0];
        if (parsedInput) {
          skipped = string.substr(0, string.indexOf(parsedInput));
          if (skipped.length > 0) {
            getParsingFlags(config).unusedInput.push(skipped);
          }
          string = string.slice(
            string.indexOf(parsedInput) + parsedInput.length
          );
          totalParsedInputLength += parsedInput.length;
        }
        if (formatTokenFunctions2[token3]) {
          if (parsedInput) {
            getParsingFlags(config).empty = false;
          } else {
            getParsingFlags(config).unusedTokens.push(token3);
          }
          addTimeToArrayFromToken2(token3, parsedInput, config);
        } else if (config._strict && !parsedInput) {
          getParsingFlags(config).unusedTokens.push(token3);
        }
      }
      getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
      if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
      }
      if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = void 0;
      }
      getParsingFlags(config).parsedDateParts = config._a.slice(0);
      getParsingFlags(config).meridiem = config._meridiem;
      config._a[HOUR] = meridiemFixWrap(
        config._locale,
        config._a[HOUR],
        config._meridiem
      );
      era = getParsingFlags(config).era;
      if (era !== null) {
        config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
      }
      configFromArray(config);
      checkOverflow(config);
    }
    function meridiemFixWrap(locale2, hour, meridiem2) {
      var isPm;
      if (meridiem2 == null) {
        return hour;
      }
      if (locale2.meridiemHour != null) {
        return locale2.meridiemHour(hour, meridiem2);
      } else if (locale2.isPM != null) {
        isPm = locale2.isPM(meridiem2);
        if (isPm && hour < 12) {
          hour += 12;
        }
        if (!isPm && hour === 12) {
          hour = 0;
        }
        return hour;
      } else {
        return hour;
      }
    }
    function configFromStringAndArray(config) {
      var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
      if (configfLen === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
      }
      for (i = 0; i < configfLen; i++) {
        currentScore = 0;
        validFormatFound = false;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
          tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);
        if (isValid2(tempConfig)) {
          validFormatFound = true;
        }
        currentScore += getParsingFlags(tempConfig).charsLeftOver;
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
        getParsingFlags(tempConfig).score = currentScore;
        if (!bestFormatIsValid) {
          if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
            if (validFormatFound) {
              bestFormatIsValid = true;
            }
          }
        } else {
          if (currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
          }
        }
      }
      extend2(config, bestMoment || tempConfig);
    }
    function configFromObject(config) {
      if (config._d) {
        return;
      }
      var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
      config._a = map2(
        [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
        function(obj) {
          return obj && parseInt(obj, 10);
        }
      );
      configFromArray(config);
    }
    function createFromConfig(config) {
      var res = new Moment(checkOverflow(prepareConfig(config)));
      if (res._nextDay) {
        res.add(1, "d");
        res._nextDay = void 0;
      }
      return res;
    }
    function prepareConfig(config) {
      var input2 = config._i, format3 = config._f;
      config._locale = config._locale || getLocale(config._l);
      if (input2 === null || format3 === void 0 && input2 === "") {
        return createInvalid({ nullInput: true });
      }
      if (typeof input2 === "string") {
        config._i = input2 = config._locale.preparse(input2);
      }
      if (isMoment(input2)) {
        return new Moment(checkOverflow(input2));
      } else if (isDate2(input2)) {
        config._d = input2;
      } else if (isArray2(format3)) {
        configFromStringAndArray(config);
      } else if (format3) {
        configFromStringAndFormat(config);
      } else {
        configFromInput(config);
      }
      if (!isValid2(config)) {
        config._d = null;
      }
      return config;
    }
    function configFromInput(config) {
      var input2 = config._i;
      if (isUndefined2(input2)) {
        config._d = new Date(hooks.now());
      } else if (isDate2(input2)) {
        config._d = new Date(input2.valueOf());
      } else if (typeof input2 === "string") {
        configFromString(config);
      } else if (isArray2(input2)) {
        config._a = map2(input2.slice(0), function(obj) {
          return parseInt(obj, 10);
        });
        configFromArray(config);
      } else if (isObject2(input2)) {
        configFromObject(config);
      } else if (isNumber2(input2)) {
        config._d = new Date(input2);
      } else {
        hooks.createFromInputFallback(config);
      }
    }
    function createLocalOrUTC(input2, format3, locale2, strict, isUTC) {
      var c = {};
      if (format3 === true || format3 === false) {
        strict = format3;
        format3 = void 0;
      }
      if (locale2 === true || locale2 === false) {
        strict = locale2;
        locale2 = void 0;
      }
      if (isObject2(input2) && isObjectEmpty(input2) || isArray2(input2) && input2.length === 0) {
        input2 = void 0;
      }
      c._isAMomentObject = true;
      c._useUTC = c._isUTC = isUTC;
      c._l = locale2;
      c._i = input2;
      c._f = format3;
      c._strict = strict;
      return createFromConfig(c);
    }
    function createLocal(input2, format3, locale2, strict) {
      return createLocalOrUTC(input2, format3, locale2, strict, false);
    }
    var prototypeMin = deprecate(
      "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
      function() {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other < this ? this : other;
        } else {
          return createInvalid();
        }
      }
    ), prototypeMax = deprecate(
      "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
      function() {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other > this ? this : other;
        } else {
          return createInvalid();
        }
      }
    );
    function pickBy(fn, moments) {
      var res, i;
      if (moments.length === 1 && isArray2(moments[0])) {
        moments = moments[0];
      }
      if (!moments.length) {
        return createLocal();
      }
      res = moments[0];
      for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
          res = moments[i];
        }
      }
      return res;
    }
    function min() {
      var args = [].slice.call(arguments, 0);
      return pickBy("isBefore", args);
    }
    function max() {
      var args = [].slice.call(arguments, 0);
      return pickBy("isAfter", args);
    }
    var now = function() {
      return Date.now ? Date.now() : +new Date();
    };
    var ordering = [
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second",
      "millisecond"
    ];
    function isDurationValid(m) {
      var key, unitHasDecimal = false, i, orderLen = ordering.length;
      for (key in m) {
        if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
          return false;
        }
      }
      for (i = 0; i < orderLen; ++i) {
        if (m[ordering[i]]) {
          if (unitHasDecimal) {
            return false;
          }
          if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
            unitHasDecimal = true;
          }
        }
      }
      return true;
    }
    function isValid$1() {
      return this._isValid;
    }
    function createInvalid$1() {
      return createDuration(NaN);
    }
    function Duration(duration) {
      var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
      this._isValid = isDurationValid(normalizedInput);
      this._milliseconds = +milliseconds2 + seconds2 * 1e3 + minutes2 * 6e4 + hours2 * 1e3 * 60 * 60;
      this._days = +days2 + weeks2 * 7;
      this._months = +months2 + quarters * 3 + years2 * 12;
      this._data = {};
      this._locale = getLocale();
      this._bubble();
    }
    function isDuration(obj) {
      return obj instanceof Duration;
    }
    function absRound(number) {
      if (number < 0) {
        return Math.round(-1 * number) * -1;
      } else {
        return Math.round(number);
      }
    }
    function compareArrays(array1, array2, dontConvert) {
      var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
      for (i = 0; i < len; i++) {
        if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
          diffs++;
        }
      }
      return diffs + lengthDiff;
    }
    function offset(token3, separator) {
      addFormatToken(token3, 0, 0, function() {
        var offset2 = this.utcOffset(), sign2 = "+";
        if (offset2 < 0) {
          offset2 = -offset2;
          sign2 = "-";
        }
        return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
      });
    }
    offset("Z", ":");
    offset("ZZ", "");
    addRegexToken("Z", matchShortOffset);
    addRegexToken("ZZ", matchShortOffset);
    addParseToken(["Z", "ZZ"], function(input2, array, config) {
      config._useUTC = true;
      config._tzm = offsetFromString(matchShortOffset, input2);
    });
    var chunkOffset = /([\+\-]|\d\d)/gi;
    function offsetFromString(matcher, string) {
      var matches = (string || "").match(matcher), chunk, parts, minutes2;
      if (matches === null) {
        return null;
      }
      chunk = matches[matches.length - 1] || [];
      parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
      minutes2 = +(parts[1] * 60) + toInt(parts[2]);
      return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
    }
    function cloneWithOffset(input2, model2) {
      var res, diff2;
      if (model2._isUTC) {
        res = model2.clone();
        diff2 = (isMoment(input2) || isDate2(input2) ? input2.valueOf() : createLocal(input2).valueOf()) - res.valueOf();
        res._d.setTime(res._d.valueOf() + diff2);
        hooks.updateOffset(res, false);
        return res;
      } else {
        return createLocal(input2).local();
      }
    }
    function getDateOffset(m) {
      return -Math.round(m._d.getTimezoneOffset());
    }
    hooks.updateOffset = function() {
    };
    function getSetOffset(input2, keepLocalTime, keepMinutes) {
      var offset2 = this._offset || 0, localAdjust;
      if (!this.isValid()) {
        return input2 != null ? this : NaN;
      }
      if (input2 != null) {
        if (typeof input2 === "string") {
          input2 = offsetFromString(matchShortOffset, input2);
          if (input2 === null) {
            return this;
          }
        } else if (Math.abs(input2) < 16 && !keepMinutes) {
          input2 = input2 * 60;
        }
        if (!this._isUTC && keepLocalTime) {
          localAdjust = getDateOffset(this);
        }
        this._offset = input2;
        this._isUTC = true;
        if (localAdjust != null) {
          this.add(localAdjust, "m");
        }
        if (offset2 !== input2) {
          if (!keepLocalTime || this._changeInProgress) {
            addSubtract(
              this,
              createDuration(input2 - offset2, "m"),
              1,
              false
            );
          } else if (!this._changeInProgress) {
            this._changeInProgress = true;
            hooks.updateOffset(this, true);
            this._changeInProgress = null;
          }
        }
        return this;
      } else {
        return this._isUTC ? offset2 : getDateOffset(this);
      }
    }
    function getSetZone(input2, keepLocalTime) {
      if (input2 != null) {
        if (typeof input2 !== "string") {
          input2 = -input2;
        }
        this.utcOffset(input2, keepLocalTime);
        return this;
      } else {
        return -this.utcOffset();
      }
    }
    function setOffsetToUTC(keepLocalTime) {
      return this.utcOffset(0, keepLocalTime);
    }
    function setOffsetToLocal(keepLocalTime) {
      if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;
        if (keepLocalTime) {
          this.subtract(getDateOffset(this), "m");
        }
      }
      return this;
    }
    function setOffsetToParsedOffset() {
      if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
      } else if (typeof this._i === "string") {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
          this.utcOffset(tZone);
        } else {
          this.utcOffset(0, true);
        }
      }
      return this;
    }
    function hasAlignedHourOffset(input2) {
      if (!this.isValid()) {
        return false;
      }
      input2 = input2 ? createLocal(input2).utcOffset() : 0;
      return (this.utcOffset() - input2) % 60 === 0;
    }
    function isDaylightSavingTime() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function isDaylightSavingTimeShifted() {
      if (!isUndefined2(this._isDSTShifted)) {
        return this._isDSTShifted;
      }
      var c = {}, other;
      copyConfig(c, this);
      c = prepareConfig(c);
      if (c._a) {
        other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
      } else {
        this._isDSTShifted = false;
      }
      return this._isDSTShifted;
    }
    function isLocal() {
      return this.isValid() ? !this._isUTC : false;
    }
    function isUtcOffset() {
      return this.isValid() ? this._isUTC : false;
    }
    function isUtc() {
      return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function createDuration(input2, key) {
      var duration = input2, match5 = null, sign2, ret, diffRes;
      if (isDuration(input2)) {
        duration = {
          ms: input2._milliseconds,
          d: input2._days,
          M: input2._months
        };
      } else if (isNumber2(input2) || !isNaN(+input2)) {
        duration = {};
        if (key) {
          duration[key] = +input2;
        } else {
          duration.milliseconds = +input2;
        }
      } else if (match5 = aspNetRegex.exec(input2)) {
        sign2 = match5[1] === "-" ? -1 : 1;
        duration = {
          y: 0,
          d: toInt(match5[DATE]) * sign2,
          h: toInt(match5[HOUR]) * sign2,
          m: toInt(match5[MINUTE]) * sign2,
          s: toInt(match5[SECOND]) * sign2,
          ms: toInt(absRound(match5[MILLISECOND] * 1e3)) * sign2
        };
      } else if (match5 = isoRegex.exec(input2)) {
        sign2 = match5[1] === "-" ? -1 : 1;
        duration = {
          y: parseIso(match5[2], sign2),
          M: parseIso(match5[3], sign2),
          w: parseIso(match5[4], sign2),
          d: parseIso(match5[5], sign2),
          h: parseIso(match5[6], sign2),
          m: parseIso(match5[7], sign2),
          s: parseIso(match5[8], sign2)
        };
      } else if (duration == null) {
        duration = {};
      } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
        diffRes = momentsDifference(
          createLocal(duration.from),
          createLocal(duration.to)
        );
        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
      }
      ret = new Duration(duration);
      if (isDuration(input2) && hasOwnProp(input2, "_locale")) {
        ret._locale = input2._locale;
      }
      if (isDuration(input2) && hasOwnProp(input2, "_isValid")) {
        ret._isValid = input2._isValid;
      }
      return ret;
    }
    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;
    function parseIso(inp, sign2) {
      var res = inp && parseFloat(inp.replace(",", "."));
      return (isNaN(res) ? 0 : res) * sign2;
    }
    function positiveMomentsDifference(base, other) {
      var res = {};
      res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
      if (base.clone().add(res.months, "M").isAfter(other)) {
        --res.months;
      }
      res.milliseconds = +other - +base.clone().add(res.months, "M");
      return res;
    }
    function momentsDifference(base, other) {
      var res;
      if (!(base.isValid() && other.isValid())) {
        return { milliseconds: 0, months: 0 };
      }
      other = cloneWithOffset(other, base);
      if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
      } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
      }
      return res;
    }
    function createAdder(direction, name) {
      return function(val, period) {
        var dur, tmp;
        if (period !== null && !isNaN(+period)) {
          deprecateSimple(
            name,
            "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
          );
          tmp = val;
          val = period;
          period = tmp;
        }
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
      };
    }
    function addSubtract(mom, duration, isAdding, updateOffset) {
      var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
      if (!mom.isValid()) {
        return;
      }
      updateOffset = updateOffset == null ? true : updateOffset;
      if (months2) {
        setMonth2(mom, get2(mom, "Month") + months2 * isAdding);
      }
      if (days2) {
        set$1(mom, "Date", get2(mom, "Date") + days2 * isAdding);
      }
      if (milliseconds2) {
        mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
      }
      if (updateOffset) {
        hooks.updateOffset(mom, days2 || months2);
      }
    }
    var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
    function isString2(input2) {
      return typeof input2 === "string" || input2 instanceof String;
    }
    function isMomentInput(input2) {
      return isMoment(input2) || isDate2(input2) || isString2(input2) || isNumber2(input2) || isNumberOrStringArray(input2) || isMomentInputObject(input2) || input2 === null || input2 === void 0;
    }
    function isMomentInputObject(input2) {
      var objectTest = isObject2(input2) && !isObjectEmpty(input2), propertyTest = false, properties = [
        "years",
        "year",
        "y",
        "months",
        "month",
        "M",
        "days",
        "day",
        "d",
        "dates",
        "date",
        "D",
        "hours",
        "hour",
        "h",
        "minutes",
        "minute",
        "m",
        "seconds",
        "second",
        "s",
        "milliseconds",
        "millisecond",
        "ms"
      ], i, property2, propertyLen = properties.length;
      for (i = 0; i < propertyLen; i += 1) {
        property2 = properties[i];
        propertyTest = propertyTest || hasOwnProp(input2, property2);
      }
      return objectTest && propertyTest;
    }
    function isNumberOrStringArray(input2) {
      var arrayTest = isArray2(input2), dataTypeTest = false;
      if (arrayTest) {
        dataTypeTest = input2.filter(function(item) {
          return !isNumber2(item) && isString2(input2);
        }).length === 0;
      }
      return arrayTest && dataTypeTest;
    }
    function isCalendarSpec(input2) {
      var objectTest = isObject2(input2) && !isObjectEmpty(input2), propertyTest = false, properties = [
        "sameDay",
        "nextDay",
        "lastDay",
        "nextWeek",
        "lastWeek",
        "sameElse"
      ], i, property2;
      for (i = 0; i < properties.length; i += 1) {
        property2 = properties[i];
        propertyTest = propertyTest || hasOwnProp(input2, property2);
      }
      return objectTest && propertyTest;
    }
    function getCalendarFormat(myMoment, now2) {
      var diff2 = myMoment.diff(now2, "days", true);
      return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
    }
    function calendar$1(time, formats) {
      if (arguments.length === 1) {
        if (!arguments[0]) {
          time = void 0;
          formats = void 0;
        } else if (isMomentInput(arguments[0])) {
          time = arguments[0];
          formats = void 0;
        } else if (isCalendarSpec(arguments[0])) {
          formats = arguments[0];
          time = void 0;
        }
      }
      var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format3 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction2(formats[format3]) ? formats[format3].call(this, now2) : formats[format3]);
      return this.format(
        output || this.localeData().calendar(format3, this, createLocal(now2))
      );
    }
    function clone() {
      return new Moment(this);
    }
    function isAfter(input2, units) {
      var localInput = isMoment(input2) ? input2 : createLocal(input2);
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits2(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() > localInput.valueOf();
      } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
      }
    }
    function isBefore(input2, units) {
      var localInput = isMoment(input2) ? input2 : createLocal(input2);
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits2(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() < localInput.valueOf();
      } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
      }
    }
    function isBetween(from2, to2, units, inclusivity) {
      var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
      if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
        return false;
      }
      inclusivity = inclusivity || "()";
      return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }
    function isSame(input2, units) {
      var localInput = isMoment(input2) ? input2 : createLocal(input2), inputMs;
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits2(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() === localInput.valueOf();
      } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
      }
    }
    function isSameOrAfter(input2, units) {
      return this.isSame(input2, units) || this.isAfter(input2, units);
    }
    function isSameOrBefore(input2, units) {
      return this.isSame(input2, units) || this.isBefore(input2, units);
    }
    function diff(input2, units, asFloat) {
      var that, zoneDelta, output;
      if (!this.isValid()) {
        return NaN;
      }
      that = cloneWithOffset(input2, this);
      if (!that.isValid()) {
        return NaN;
      }
      zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
      units = normalizeUnits2(units);
      switch (units) {
        case "year":
          output = monthDiff(this, that) / 12;
          break;
        case "month":
          output = monthDiff(this, that);
          break;
        case "quarter":
          output = monthDiff(this, that) / 3;
          break;
        case "second":
          output = (this - that) / 1e3;
          break;
        case "minute":
          output = (this - that) / 6e4;
          break;
        case "hour":
          output = (this - that) / 36e5;
          break;
        case "day":
          output = (this - that - zoneDelta) / 864e5;
          break;
        case "week":
          output = (this - that - zoneDelta) / 6048e5;
          break;
        default:
          output = this - that;
      }
      return asFloat ? output : absFloor(output);
    }
    function monthDiff(a, b) {
      if (a.date() < b.date()) {
        return -monthDiff(b, a);
      }
      var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
      if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
        adjust = (b - anchor) / (anchor - anchor2);
      } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
        adjust = (b - anchor) / (anchor2 - anchor);
      }
      return -(wholeMonthDiff + adjust) || 0;
    }
    hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function toString2() {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function toISOString(keepOffset) {
      if (!this.isValid()) {
        return null;
      }
      var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
      if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(
          m,
          utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
        );
      }
      if (isFunction2(Date.prototype.toISOString)) {
        if (utc) {
          return this.toDate().toISOString();
        } else {
          return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
        }
      }
      return formatMoment(
        m,
        utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
      );
    }
    function inspect() {
      if (!this.isValid()) {
        return "moment.invalid(/* " + this._i + " */)";
      }
      var func = "moment", zone = "", prefix, year, datetime, suffix;
      if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
        zone = "Z";
      }
      prefix = "[" + func + '("]';
      year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
      datetime = "-MM-DD[T]HH:mm:ss.SSS";
      suffix = zone + '[")]';
      return this.format(prefix + year + datetime + suffix);
    }
    function format2(inputString) {
      if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
      }
      var output = formatMoment(this, inputString);
      return this.localeData().postformat(output);
    }
    function from(time, withoutSuffix) {
      if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
        return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
      } else {
        return this.localeData().invalidDate();
      }
    }
    function fromNow(withoutSuffix) {
      return this.from(createLocal(), withoutSuffix);
    }
    function to(time, withoutSuffix) {
      if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
        return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
      } else {
        return this.localeData().invalidDate();
      }
    }
    function toNow(withoutSuffix) {
      return this.to(createLocal(), withoutSuffix);
    }
    function locale(key) {
      var newLocaleData;
      if (key === void 0) {
        return this._locale._abbr;
      } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
          this._locale = newLocaleData;
        }
        return this;
      }
    }
    var lang = deprecate(
      "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
      function(key) {
        if (key === void 0) {
          return this.localeData();
        } else {
          return this.locale(key);
        }
      }
    );
    function localeData() {
      return this._locale;
    }
    var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
    function mod$12(dividend, divisor) {
      return (dividend % divisor + divisor) % divisor;
    }
    function localStartOfDate(y, m, d) {
      if (y < 100 && y >= 0) {
        return new Date(y + 400, m, d) - MS_PER_400_YEARS;
      } else {
        return new Date(y, m, d).valueOf();
      }
    }
    function utcStartOfDate(y, m, d) {
      if (y < 100 && y >= 0) {
        return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
      } else {
        return Date.UTC(y, m, d);
      }
    }
    function startOf(units) {
      var time, startOfDate;
      units = normalizeUnits2(units);
      if (units === void 0 || units === "millisecond" || !this.isValid()) {
        return this;
      }
      startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
      switch (units) {
        case "year":
          time = startOfDate(this.year(), 0, 1);
          break;
        case "quarter":
          time = startOfDate(
            this.year(),
            this.month() - this.month() % 3,
            1
          );
          break;
        case "month":
          time = startOfDate(this.year(), this.month(), 1);
          break;
        case "week":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - this.weekday()
          );
          break;
        case "isoWeek":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - (this.isoWeekday() - 1)
          );
          break;
        case "day":
        case "date":
          time = startOfDate(this.year(), this.month(), this.date());
          break;
        case "hour":
          time = this._d.valueOf();
          time -= mod$12(
            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
            MS_PER_HOUR
          );
          break;
        case "minute":
          time = this._d.valueOf();
          time -= mod$12(time, MS_PER_MINUTE);
          break;
        case "second":
          time = this._d.valueOf();
          time -= mod$12(time, MS_PER_SECOND);
          break;
      }
      this._d.setTime(time);
      hooks.updateOffset(this, true);
      return this;
    }
    function endOf(units) {
      var time, startOfDate;
      units = normalizeUnits2(units);
      if (units === void 0 || units === "millisecond" || !this.isValid()) {
        return this;
      }
      startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
      switch (units) {
        case "year":
          time = startOfDate(this.year() + 1, 0, 1) - 1;
          break;
        case "quarter":
          time = startOfDate(
            this.year(),
            this.month() - this.month() % 3 + 3,
            1
          ) - 1;
          break;
        case "month":
          time = startOfDate(this.year(), this.month() + 1, 1) - 1;
          break;
        case "week":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - this.weekday() + 7
          ) - 1;
          break;
        case "isoWeek":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - (this.isoWeekday() - 1) + 7
          ) - 1;
          break;
        case "day":
        case "date":
          time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
          break;
        case "hour":
          time = this._d.valueOf();
          time += MS_PER_HOUR - mod$12(
            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
            MS_PER_HOUR
          ) - 1;
          break;
        case "minute":
          time = this._d.valueOf();
          time += MS_PER_MINUTE - mod$12(time, MS_PER_MINUTE) - 1;
          break;
        case "second":
          time = this._d.valueOf();
          time += MS_PER_SECOND - mod$12(time, MS_PER_SECOND) - 1;
          break;
      }
      this._d.setTime(time);
      hooks.updateOffset(this, true);
      return this;
    }
    function valueOf() {
      return this._d.valueOf() - (this._offset || 0) * 6e4;
    }
    function unix() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function toDate2() {
      return new Date(this.valueOf());
    }
    function toArray() {
      var m = this;
      return [
        m.year(),
        m.month(),
        m.date(),
        m.hour(),
        m.minute(),
        m.second(),
        m.millisecond()
      ];
    }
    function toObject() {
      var m = this;
      return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
      };
    }
    function toJSON() {
      return this.isValid() ? this.toISOString() : null;
    }
    function isValid$2() {
      return isValid2(this);
    }
    function parsingFlags() {
      return extend2({}, getParsingFlags(this));
    }
    function invalidAt() {
      return getParsingFlags(this).overflow;
    }
    function creationData() {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
      };
    }
    addFormatToken("N", 0, 0, "eraAbbr");
    addFormatToken("NN", 0, 0, "eraAbbr");
    addFormatToken("NNN", 0, 0, "eraAbbr");
    addFormatToken("NNNN", 0, 0, "eraName");
    addFormatToken("NNNNN", 0, 0, "eraNarrow");
    addFormatToken("y", ["y", 1], "yo", "eraYear");
    addFormatToken("y", ["yy", 2], 0, "eraYear");
    addFormatToken("y", ["yyy", 3], 0, "eraYear");
    addFormatToken("y", ["yyyy", 4], 0, "eraYear");
    addRegexToken("N", matchEraAbbr);
    addRegexToken("NN", matchEraAbbr);
    addRegexToken("NNN", matchEraAbbr);
    addRegexToken("NNNN", matchEraName);
    addRegexToken("NNNNN", matchEraNarrow);
    addParseToken(
      ["N", "NN", "NNN", "NNNN", "NNNNN"],
      function(input2, array, config, token3) {
        var era = config._locale.erasParse(input2, token3, config._strict);
        if (era) {
          getParsingFlags(config).era = era;
        } else {
          getParsingFlags(config).invalidEra = input2;
        }
      }
    );
    addRegexToken("y", matchUnsigned);
    addRegexToken("yy", matchUnsigned);
    addRegexToken("yyy", matchUnsigned);
    addRegexToken("yyyy", matchUnsigned);
    addRegexToken("yo", matchEraYearOrdinal);
    addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
    addParseToken(["yo"], function(input2, array, config, token3) {
      var match5;
      if (config._locale._eraYearOrdinalRegex) {
        match5 = input2.match(config._locale._eraYearOrdinalRegex);
      }
      if (config._locale.eraYearOrdinalParse) {
        array[YEAR] = config._locale.eraYearOrdinalParse(input2, match5);
      } else {
        array[YEAR] = parseInt(input2, 10);
      }
    });
    function localeEras(m, format3) {
      var i, l, date, eras = this._eras || getLocale("en")._eras;
      for (i = 0, l = eras.length; i < l; ++i) {
        switch (typeof eras[i].since) {
          case "string":
            date = hooks(eras[i].since).startOf("day");
            eras[i].since = date.valueOf();
            break;
        }
        switch (typeof eras[i].until) {
          case "undefined":
            eras[i].until = Infinity;
            break;
          case "string":
            date = hooks(eras[i].until).startOf("day").valueOf();
            eras[i].until = date.valueOf();
            break;
        }
      }
      return eras;
    }
    function localeErasParse(eraName, format3, strict) {
      var i, l, eras = this.eras(), name, abbr, narrow;
      eraName = eraName.toUpperCase();
      for (i = 0, l = eras.length; i < l; ++i) {
        name = eras[i].name.toUpperCase();
        abbr = eras[i].abbr.toUpperCase();
        narrow = eras[i].narrow.toUpperCase();
        if (strict) {
          switch (format3) {
            case "N":
            case "NN":
            case "NNN":
              if (abbr === eraName) {
                return eras[i];
              }
              break;
            case "NNNN":
              if (name === eraName) {
                return eras[i];
              }
              break;
            case "NNNNN":
              if (narrow === eraName) {
                return eras[i];
              }
              break;
          }
        } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
          return eras[i];
        }
      }
    }
    function localeErasConvertYear(era, year) {
      var dir = era.since <= era.until ? 1 : -1;
      if (year === void 0) {
        return hooks(era.since).year();
      } else {
        return hooks(era.since).year() + (year - era.offset) * dir;
      }
    }
    function getEraName() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].name;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].name;
        }
      }
      return "";
    }
    function getEraNarrow() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].narrow;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].narrow;
        }
      }
      return "";
    }
    function getEraAbbr() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].abbr;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].abbr;
        }
      }
      return "";
    }
    function getEraYear() {
      var i, l, dir, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        dir = eras[i].since <= eras[i].until ? 1 : -1;
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
          return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
        }
      }
      return this.year();
    }
    function erasNameRegex(isStrict) {
      if (!hasOwnProp(this, "_erasNameRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasNameRegex : this._erasRegex;
    }
    function erasAbbrRegex(isStrict) {
      if (!hasOwnProp(this, "_erasAbbrRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }
    function erasNarrowRegex(isStrict) {
      if (!hasOwnProp(this, "_erasNarrowRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }
    function matchEraAbbr(isStrict, locale2) {
      return locale2.erasAbbrRegex(isStrict);
    }
    function matchEraName(isStrict, locale2) {
      return locale2.erasNameRegex(isStrict);
    }
    function matchEraNarrow(isStrict, locale2) {
      return locale2.erasNarrowRegex(isStrict);
    }
    function matchEraYearOrdinal(isStrict, locale2) {
      return locale2._eraYearOrdinalRegex || matchUnsigned;
    }
    function computeErasParse() {
      var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, erasName, erasAbbr, erasNarrow, eras = this.eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        erasName = regexEscape(eras[i].name);
        erasAbbr = regexEscape(eras[i].abbr);
        erasNarrow = regexEscape(eras[i].narrow);
        namePieces.push(erasName);
        abbrPieces.push(erasAbbr);
        narrowPieces.push(erasNarrow);
        mixedPieces.push(erasName);
        mixedPieces.push(erasAbbr);
        mixedPieces.push(erasNarrow);
      }
      this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
      this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
      this._erasNarrowRegex = new RegExp(
        "^(" + narrowPieces.join("|") + ")",
        "i"
      );
    }
    addFormatToken(0, ["gg", 2], 0, function() {
      return this.weekYear() % 100;
    });
    addFormatToken(0, ["GG", 2], 0, function() {
      return this.isoWeekYear() % 100;
    });
    function addWeekYearFormatToken(token3, getter) {
      addFormatToken(0, [token3, token3.length], 0, getter);
    }
    addWeekYearFormatToken("gggg", "weekYear");
    addWeekYearFormatToken("ggggg", "weekYear");
    addWeekYearFormatToken("GGGG", "isoWeekYear");
    addWeekYearFormatToken("GGGGG", "isoWeekYear");
    addRegexToken("G", matchSigned);
    addRegexToken("g", matchSigned);
    addRegexToken("GG", match1to2, match2);
    addRegexToken("gg", match1to2, match2);
    addRegexToken("GGGG", match1to4, match4);
    addRegexToken("gggg", match1to4, match4);
    addRegexToken("GGGGG", match1to6, match6);
    addRegexToken("ggggg", match1to6, match6);
    addWeekParseToken(
      ["gggg", "ggggg", "GGGG", "GGGGG"],
      function(input2, week, config, token3) {
        week[token3.substr(0, 2)] = toInt(input2);
      }
    );
    addWeekParseToken(["gg", "GG"], function(input2, week, config, token3) {
      week[token3] = hooks.parseTwoDigitYear(input2);
    });
    function getSetWeekYear(input2) {
      return getSetWeekYearHelper.call(
        this,
        input2,
        this.week(),
        this.weekday() + this.localeData()._week.dow,
        this.localeData()._week.dow,
        this.localeData()._week.doy
      );
    }
    function getSetISOWeekYear(input2) {
      return getSetWeekYearHelper.call(
        this,
        input2,
        this.isoWeek(),
        this.isoWeekday(),
        1,
        4
      );
    }
    function getISOWeeksInYear() {
      return weeksInYear(this.year(), 1, 4);
    }
    function getISOWeeksInISOWeekYear() {
      return weeksInYear(this.isoWeekYear(), 1, 4);
    }
    function getWeeksInYear() {
      var weekInfo = this.localeData()._week;
      return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }
    function getWeeksInWeekYear() {
      var weekInfo = this.localeData()._week;
      return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }
    function getSetWeekYearHelper(input2, week, weekday, dow, doy) {
      var weeksTarget;
      if (input2 == null) {
        return weekOfYear(this, dow, doy).year;
      } else {
        weeksTarget = weeksInYear(input2, dow, doy);
        if (week > weeksTarget) {
          week = weeksTarget;
        }
        return setWeekAll.call(this, input2, week, weekday, dow, doy);
      }
    }
    function setWeekAll(weekYear, week, weekday, dow, doy) {
      var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
      this.year(date.getUTCFullYear());
      this.month(date.getUTCMonth());
      this.date(date.getUTCDate());
      return this;
    }
    addFormatToken("Q", 0, "Qo", "quarter");
    addRegexToken("Q", match1);
    addParseToken("Q", function(input2, array) {
      array[MONTH] = (toInt(input2) - 1) * 3;
    });
    function getSetQuarter(input2) {
      return input2 == null ? Math.ceil((this.month() + 1) / 3) : this.month((input2 - 1) * 3 + this.month() % 3);
    }
    addFormatToken("D", ["DD", 2], "Do", "date");
    addRegexToken("D", match1to2, match1to2NoLeadingZero);
    addRegexToken("DD", match1to2, match2);
    addRegexToken("Do", function(isStrict, locale2) {
      return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
    });
    addParseToken(["D", "DD"], DATE);
    addParseToken("Do", function(input2, array) {
      array[DATE] = toInt(input2.match(match1to2)[0]);
    });
    var getSetDayOfMonth = makeGetSet("Date", true);
    addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
    addRegexToken("DDD", match1to3);
    addRegexToken("DDDD", match3);
    addParseToken(["DDD", "DDDD"], function(input2, array, config) {
      config._dayOfYear = toInt(input2);
    });
    function getSetDayOfYear(input2) {
      var dayOfYear = Math.round(
        (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
      ) + 1;
      return input2 == null ? dayOfYear : this.add(input2 - dayOfYear, "d");
    }
    addFormatToken("m", ["mm", 2], 0, "minute");
    addRegexToken("m", match1to2, match1to2HasZero);
    addRegexToken("mm", match1to2, match2);
    addParseToken(["m", "mm"], MINUTE);
    var getSetMinute = makeGetSet("Minutes", false);
    addFormatToken("s", ["ss", 2], 0, "second");
    addRegexToken("s", match1to2, match1to2HasZero);
    addRegexToken("ss", match1to2, match2);
    addParseToken(["s", "ss"], SECOND);
    var getSetSecond = makeGetSet("Seconds", false);
    addFormatToken("S", 0, 0, function() {
      return ~~(this.millisecond() / 100);
    });
    addFormatToken(0, ["SS", 2], 0, function() {
      return ~~(this.millisecond() / 10);
    });
    addFormatToken(0, ["SSS", 3], 0, "millisecond");
    addFormatToken(0, ["SSSS", 4], 0, function() {
      return this.millisecond() * 10;
    });
    addFormatToken(0, ["SSSSS", 5], 0, function() {
      return this.millisecond() * 100;
    });
    addFormatToken(0, ["SSSSSS", 6], 0, function() {
      return this.millisecond() * 1e3;
    });
    addFormatToken(0, ["SSSSSSS", 7], 0, function() {
      return this.millisecond() * 1e4;
    });
    addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
      return this.millisecond() * 1e5;
    });
    addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
      return this.millisecond() * 1e6;
    });
    addRegexToken("S", match1to3, match1);
    addRegexToken("SS", match1to3, match2);
    addRegexToken("SSS", match1to3, match3);
    var token2, getSetMillisecond;
    for (token2 = "SSSS"; token2.length <= 9; token2 += "S") {
      addRegexToken(token2, matchUnsigned);
    }
    function parseMs(input2, array) {
      array[MILLISECOND] = toInt(("0." + input2) * 1e3);
    }
    for (token2 = "S"; token2.length <= 9; token2 += "S") {
      addParseToken(token2, parseMs);
    }
    getSetMillisecond = makeGetSet("Milliseconds", false);
    addFormatToken("z", 0, 0, "zoneAbbr");
    addFormatToken("zz", 0, 0, "zoneName");
    function getZoneAbbr() {
      return this._isUTC ? "UTC" : "";
    }
    function getZoneName() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var proto = Moment.prototype;
    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format2;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate2;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
      proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
        return "Moment<" + this.format() + ">";
      };
    }
    proto.toJSON = toJSON;
    proto.toString = toString2;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth2;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
      "dates accessor is deprecated. Use date instead.",
      getSetDayOfMonth
    );
    proto.months = deprecate(
      "months accessor is deprecated. Use month instead",
      getSetMonth
    );
    proto.years = deprecate(
      "years accessor is deprecated. Use year instead",
      getSetYear
    );
    proto.zone = deprecate(
      "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
      getSetZone
    );
    proto.isDSTShifted = deprecate(
      "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
      isDaylightSavingTimeShifted
    );
    function createUnix(input2) {
      return createLocal(input2 * 1e3);
    }
    function createInZone() {
      return createLocal.apply(null, arguments).parseZone();
    }
    function preParsePostFormat(string) {
      return string;
    }
    var proto$1 = Locale2.prototype;
    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set2;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;
    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;
    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;
    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;
    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;
    function get$12(format3, index2, field, setter) {
      var locale2 = getLocale(), utc = createUTC().set(setter, index2);
      return locale2[field](utc, format3);
    }
    function listMonthsImpl(format3, index2, field) {
      if (isNumber2(format3)) {
        index2 = format3;
        format3 = void 0;
      }
      format3 = format3 || "";
      if (index2 != null) {
        return get$12(format3, index2, field, "month");
      }
      var i, out = [];
      for (i = 0; i < 12; i++) {
        out[i] = get$12(format3, i, field, "month");
      }
      return out;
    }
    function listWeekdaysImpl(localeSorted, format3, index2, field) {
      if (typeof localeSorted === "boolean") {
        if (isNumber2(format3)) {
          index2 = format3;
          format3 = void 0;
        }
        format3 = format3 || "";
      } else {
        format3 = localeSorted;
        index2 = format3;
        localeSorted = false;
        if (isNumber2(format3)) {
          index2 = format3;
          format3 = void 0;
        }
        format3 = format3 || "";
      }
      var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i, out = [];
      if (index2 != null) {
        return get$12(format3, (index2 + shift) % 7, field, "day");
      }
      for (i = 0; i < 7; i++) {
        out[i] = get$12(format3, (i + shift) % 7, field, "day");
      }
      return out;
    }
    function listMonths(format3, index2) {
      return listMonthsImpl(format3, index2, "months");
    }
    function listMonthsShort(format3, index2) {
      return listMonthsImpl(format3, index2, "monthsShort");
    }
    function listWeekdays(localeSorted, format3, index2) {
      return listWeekdaysImpl(localeSorted, format3, index2, "weekdays");
    }
    function listWeekdaysShort(localeSorted, format3, index2) {
      return listWeekdaysImpl(localeSorted, format3, index2, "weekdaysShort");
    }
    function listWeekdaysMin(localeSorted, format3, index2) {
      return listWeekdaysImpl(localeSorted, format3, index2, "weekdaysMin");
    }
    getSetGlobalLocale("en", {
      eras: [
        {
          since: "0001-01-01",
          until: Infinity,
          offset: 1,
          name: "Anno Domini",
          narrow: "AD",
          abbr: "AD"
        },
        {
          since: "0000-12-31",
          until: -Infinity,
          offset: 1,
          name: "Before Christ",
          narrow: "BC",
          abbr: "BC"
        }
      ],
      dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
      ordinal: function(number) {
        var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
        return number + output;
      }
    });
    hooks.lang = deprecate(
      "moment.lang is deprecated. Use moment.locale instead.",
      getSetGlobalLocale
    );
    hooks.langData = deprecate(
      "moment.langData is deprecated. Use moment.localeData instead.",
      getLocale
    );
    var mathAbs = Math.abs;
    function abs() {
      var data2 = this._data;
      this._milliseconds = mathAbs(this._milliseconds);
      this._days = mathAbs(this._days);
      this._months = mathAbs(this._months);
      data2.milliseconds = mathAbs(data2.milliseconds);
      data2.seconds = mathAbs(data2.seconds);
      data2.minutes = mathAbs(data2.minutes);
      data2.hours = mathAbs(data2.hours);
      data2.months = mathAbs(data2.months);
      data2.years = mathAbs(data2.years);
      return this;
    }
    function addSubtract$1(duration, input2, value, direction) {
      var other = createDuration(input2, value);
      duration._milliseconds += direction * other._milliseconds;
      duration._days += direction * other._days;
      duration._months += direction * other._months;
      return duration._bubble();
    }
    function add$1(input2, value) {
      return addSubtract$1(this, input2, value, 1);
    }
    function subtract$1(input2, value) {
      return addSubtract$1(this, input2, value, -1);
    }
    function absCeil(number) {
      if (number < 0) {
        return Math.floor(number);
      } else {
        return Math.ceil(number);
      }
    }
    function bubble() {
      var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data2 = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
      if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
        milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
        days2 = 0;
        months2 = 0;
      }
      data2.milliseconds = milliseconds2 % 1e3;
      seconds2 = absFloor(milliseconds2 / 1e3);
      data2.seconds = seconds2 % 60;
      minutes2 = absFloor(seconds2 / 60);
      data2.minutes = minutes2 % 60;
      hours2 = absFloor(minutes2 / 60);
      data2.hours = hours2 % 24;
      days2 += absFloor(hours2 / 24);
      monthsFromDays = absFloor(daysToMonths(days2));
      months2 += monthsFromDays;
      days2 -= absCeil(monthsToDays(monthsFromDays));
      years2 = absFloor(months2 / 12);
      months2 %= 12;
      data2.days = days2;
      data2.months = months2;
      data2.years = years2;
      return this;
    }
    function daysToMonths(days2) {
      return days2 * 4800 / 146097;
    }
    function monthsToDays(months2) {
      return months2 * 146097 / 4800;
    }
    function as(units) {
      if (!this.isValid()) {
        return NaN;
      }
      var days2, months2, milliseconds2 = this._milliseconds;
      units = normalizeUnits2(units);
      if (units === "month" || units === "quarter" || units === "year") {
        days2 = this._days + milliseconds2 / 864e5;
        months2 = this._months + daysToMonths(days2);
        switch (units) {
          case "month":
            return months2;
          case "quarter":
            return months2 / 3;
          case "year":
            return months2 / 12;
        }
      } else {
        days2 = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
          case "week":
            return days2 / 7 + milliseconds2 / 6048e5;
          case "day":
            return days2 + milliseconds2 / 864e5;
          case "hour":
            return days2 * 24 + milliseconds2 / 36e5;
          case "minute":
            return days2 * 1440 + milliseconds2 / 6e4;
          case "second":
            return days2 * 86400 + milliseconds2 / 1e3;
          case "millisecond":
            return Math.floor(days2 * 864e5) + milliseconds2;
          default:
            throw new Error("Unknown unit " + units);
        }
      }
    }
    function makeAs(alias) {
      return function() {
        return this.as(alias);
      };
    }
    var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y"), valueOf$1 = asMilliseconds;
    function clone$1() {
      return createDuration(this);
    }
    function get$2(units) {
      units = normalizeUnits2(units);
      return this.isValid() ? this[units + "s"]() : NaN;
    }
    function makeGetter(name) {
      return function() {
        return this.isValid() ? this._data[name] : NaN;
      };
    }
    var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
    function weeks() {
      return absFloor(this.days() / 7);
    }
    var round = Math.round, thresholds = {
      ss: 44,
      s: 45,
      m: 45,
      h: 22,
      d: 26,
      w: null,
      M: 11
    };
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
      return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
      var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
      if (thresholds2.w != null) {
        a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
      }
      a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
      a[2] = withoutSuffix;
      a[3] = +posNegDuration > 0;
      a[4] = locale2;
      return substituteTimeAgo.apply(null, a);
    }
    function getSetRelativeTimeRounding(roundingFunction) {
      if (roundingFunction === void 0) {
        return round;
      }
      if (typeof roundingFunction === "function") {
        round = roundingFunction;
        return true;
      }
      return false;
    }
    function getSetRelativeTimeThreshold(threshold, limit) {
      if (thresholds[threshold] === void 0) {
        return false;
      }
      if (limit === void 0) {
        return thresholds[threshold];
      }
      thresholds[threshold] = limit;
      if (threshold === "s") {
        thresholds.ss = limit - 1;
      }
      return true;
    }
    function humanize(argWithSuffix, argThresholds) {
      if (!this.isValid()) {
        return this.localeData().invalidDate();
      }
      var withSuffix = false, th = thresholds, locale2, output;
      if (typeof argWithSuffix === "object") {
        argThresholds = argWithSuffix;
        argWithSuffix = false;
      }
      if (typeof argWithSuffix === "boolean") {
        withSuffix = argWithSuffix;
      }
      if (typeof argThresholds === "object") {
        th = Object.assign({}, thresholds, argThresholds);
        if (argThresholds.s != null && argThresholds.ss == null) {
          th.ss = argThresholds.s - 1;
        }
      }
      locale2 = this.localeData();
      output = relativeTime$1(this, !withSuffix, th, locale2);
      if (withSuffix) {
        output = locale2.pastFuture(+this, output);
      }
      return locale2.postformat(output);
    }
    var abs$1 = Math.abs;
    function sign(x) {
      return (x > 0) - (x < 0) || +x;
    }
    function toISOString$1() {
      if (!this.isValid()) {
        return this.localeData().invalidDate();
      }
      var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
      if (!total) {
        return "P0D";
      }
      minutes2 = absFloor(seconds2 / 60);
      hours2 = absFloor(minutes2 / 60);
      seconds2 %= 60;
      minutes2 %= 60;
      years2 = absFloor(months2 / 12);
      months2 %= 12;
      s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
      totalSign = total < 0 ? "-" : "";
      ymSign = sign(this._months) !== sign(total) ? "-" : "";
      daysSign = sign(this._days) !== sign(total) ? "-" : "";
      hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
      return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
    }
    var proto$2 = Duration.prototype;
    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;
    proto$2.toIsoString = deprecate(
      "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
      toISOString$1
    );
    proto$2.lang = lang;
    addFormatToken("X", 0, 0, "unix");
    addFormatToken("x", 0, 0, "valueOf");
    addRegexToken("x", matchSigned);
    addRegexToken("X", matchTimestamp);
    addParseToken("X", function(input2, array, config) {
      config._d = new Date(parseFloat(input2) * 1e3);
    });
    addParseToken("x", function(input2, array, config) {
      config._d = new Date(toInt(input2));
    });
    //! moment.js
    hooks.version = "2.30.1";
    setHookCallback(createLocal);
    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate2;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits2;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;
    hooks.HTML5_FMT = {
      DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
      DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
      DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
      DATE: "YYYY-MM-DD",
      TIME: "HH:mm",
      TIME_SECONDS: "HH:mm:ss",
      TIME_MS: "HH:mm:ss.SSS",
      WEEK: "GGGG-[W]WW",
      MONTH: "YYYY-MM"
    };
    return hooks;
  });
})(moment$1);
var jalaaliJs = {
  toJalaali: toJalaali$1,
  toGregorian: toGregorian$1,
  isValidJalaaliDate,
  isLeapJalaaliYear,
  jalaaliMonthLength,
  jalCal,
  j2d,
  d2j,
  g2d,
  d2g,
  jalaaliToDateObject,
  jalaaliWeek
};
var breaks = [
  -61,
  9,
  38,
  199,
  426,
  686,
  756,
  818,
  1111,
  1181,
  1210,
  1635,
  2060,
  2097,
  2192,
  2262,
  2324,
  2394,
  2456,
  3178
];
function toJalaali$1(gy, gm, gd) {
  if (Object.prototype.toString.call(gy) === "[object Date]") {
    gd = gy.getDate();
    gm = gy.getMonth() + 1;
    gy = gy.getFullYear();
  }
  return d2j(g2d(gy, gm, gd));
}
function toGregorian$1(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd));
}
function isValidJalaaliDate(jy, jm, jd) {
  return jy >= -61 && jy <= 3177 && jm >= 1 && jm <= 12 && jd >= 1 && jd <= jalaaliMonthLength(jy, jm);
}
function isLeapJalaaliYear(jy) {
  return jalCalLeap(jy) === 0;
}
function jalaaliMonthLength(jy, jm) {
  if (jm <= 6)
    return 31;
  if (jm <= 11)
    return 30;
  if (isLeapJalaaliYear(jy))
    return 30;
  return 29;
}
function jalCalLeap(jy) {
  var bl = breaks.length, jp = breaks[0], jm, jump, leap, n, i;
  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error("Invalid Jalaali year " + jy);
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm)
      break;
    jp = jm;
  }
  n = jy - jp;
  if (jump - n < 6)
    n = n - jump + div$1(jump + 4, 33) * 33;
  leap = mod$1(mod$1(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }
  return leap;
}
function jalCal(jy, withoutLeap) {
  var bl = breaks.length, gy = jy + 621, leapJ = -14, jp = breaks[0], jm, jump, leap, leapG, march, n, i;
  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error("Invalid Jalaali year " + jy);
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm)
      break;
    leapJ = leapJ + div$1(jump, 33) * 8 + div$1(mod$1(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ = leapJ + div$1(n, 33) * 8 + div$1(mod$1(n, 33) + 3, 4);
  if (mod$1(jump, 33) === 4 && jump - n === 4)
    leapJ += 1;
  leapG = div$1(gy, 4) - div$1((div$1(gy, 100) + 1) * 3, 4) - 150;
  march = 20 + leapJ - leapG;
  if (withoutLeap)
    return { gy, march };
  if (jump - n < 6)
    n = n - jump + div$1(jump + 4, 33) * 33;
  leap = mod$1(mod$1(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }
  return {
    leap,
    gy,
    march
  };
}
function j2d(jy, jm, jd) {
  var r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div$1(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn) {
  var gy = d2g(jdn).gy, jy = gy - 621, r = jalCal(jy, false), jdn1f = g2d(gy, 3, r.march), jd, jm, k;
  k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div$1(k, 31);
      jd = mod$1(k, 31) + 1;
      return {
        jy,
        jm,
        jd
      };
    } else {
      k -= 186;
    }
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1)
      k += 1;
  }
  jm = 7 + div$1(k, 30);
  jd = mod$1(k, 30) + 1;
  return {
    jy,
    jm,
    jd
  };
}
function g2d(gy, gm, gd) {
  var d = div$1((gy + div$1(gm - 8, 6) + 100100) * 1461, 4) + div$1(153 * mod$1(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div$1(div$1(gy + 100100 + div$1(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn) {
  var j, i, gd, gm, gy;
  j = 4 * jdn + 139361631;
  j = j + div$1(div$1(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  i = div$1(mod$1(j, 1461), 4) * 5 + 308;
  gd = div$1(mod$1(i, 153), 5) + 1;
  gm = mod$1(div$1(i, 153), 12) + 1;
  gy = div$1(j, 1461) - 100100 + div$1(8 - gm, 6);
  return {
    gy,
    gm,
    gd
  };
}
function jalaaliWeek(jy, jm, jd) {
  var dayOfWeek = jalaaliToDateObject(jy, jm, jd).getDay();
  var startDayDifference = dayOfWeek == 6 ? 0 : -(dayOfWeek + 1);
  var endDayDifference = 6 + startDayDifference;
  return {
    saturday: d2j(j2d(jy, jm, jd + startDayDifference)),
    friday: d2j(j2d(jy, jm, jd + endDayDifference))
  };
}
function jalaaliToDateObject(jy, jm, jd, h2, m, s, ms) {
  var gregorianCalenderDate = toGregorian$1(jy, jm, jd);
  return new Date(
    gregorianCalenderDate.gy,
    gregorianCalenderDate.gm - 1,
    gregorianCalenderDate.gd,
    h2 || 0,
    m || 0,
    s || 0,
    ms || 0
  );
}
function div$1(a, b) {
  return ~~(a / b);
}
function mod$1(a, b) {
  return a - ~~(a / b) * b;
}
var momentJalaali = jMoment;
var moment = moment$1.exports, jalaali = jalaaliJs;
var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS?|LL?L?L?|l{1,4})/g, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{1,4}/, parseTokenSixDigits = /[+\-]?\d{1,6}/, parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, parseTokenT = /T/i, parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, symbolMap = {
  "1": "\u06F1",
  "2": "\u06F2",
  "3": "\u06F3",
  "4": "\u06F4",
  "5": "\u06F5",
  "6": "\u06F6",
  "7": "\u06F7",
  "8": "\u06F8",
  "9": "\u06F9",
  "0": "\u06F0"
}, numberMap = {
  "\u06F1": "1",
  "\u06F2": "2",
  "\u06F3": "3",
  "\u06F4": "4",
  "\u06F5": "5",
  "\u06F6": "6",
  "\u06F7": "7",
  "\u06F8": "8",
  "\u06F9": "9",
  "\u06F0": "0"
}, unitAliases = {
  jm: "jmonth",
  jmonths: "jmonth",
  jy: "jyear",
  jyears: "jyear"
}, formatFunctions = {}, ordinalizeTokens = "DDD w M D".split(" "), paddedTokens = "M D w".split(" "), formatTokenFunctions = {
  jM: function() {
    return this.jMonth() + 1;
  },
  jMMM: function(format2) {
    return this.localeData().jMonthsShort(this, format2);
  },
  jMMMM: function(format2) {
    return this.localeData().jMonths(this, format2);
  },
  jD: function() {
    return this.jDate();
  },
  jDDD: function() {
    return this.jDayOfYear();
  },
  jw: function() {
    return this.jWeek();
  },
  jYY: function() {
    return leftZeroFill(this.jYear() % 100, 2);
  },
  jYYYY: function() {
    return leftZeroFill(this.jYear(), 4);
  },
  jYYYYY: function() {
    return leftZeroFill(this.jYear(), 5);
  },
  jgg: function() {
    return leftZeroFill(this.jWeekYear() % 100, 2);
  },
  jgggg: function() {
    return this.jWeekYear();
  },
  jggggg: function() {
    return leftZeroFill(this.jWeekYear(), 5);
  }
};
function padToken(func, count) {
  return function(a) {
    return leftZeroFill(func.call(this, a), count);
  };
}
function ordinalizeToken(func, period) {
  return function(a) {
    return this.localeData().ordinal(func.call(this, a), period);
  };
}
(function() {
  var i;
  while (ordinalizeTokens.length) {
    i = ordinalizeTokens.pop();
    formatTokenFunctions["j" + i + "o"] = ordinalizeToken(formatTokenFunctions["j" + i], i);
  }
  while (paddedTokens.length) {
    i = paddedTokens.pop();
    formatTokenFunctions["j" + i + i] = padToken(formatTokenFunctions["j" + i], 2);
  }
  formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3);
})();
function extend(a, b) {
  var key;
  for (key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}
function leftZeroFill(number, targetLength) {
  var output = number + "";
  while (output.length < targetLength)
    output = "0" + output;
  return output;
}
function isArray(input2) {
  return Object.prototype.toString.call(input2) === "[object Array]";
}
function normalizeUnits(units) {
  if (units) {
    var lowered = units.toLowerCase();
    units = unitAliases[lowered] || lowered;
  }
  return units;
}
function setDate(m, year, month, date) {
  var d = m._d;
  if (isNaN(year)) {
    m._isValid = false;
  }
  if (m._isUTC) {
    m._d = new Date(Date.UTC(
      year,
      month,
      date,
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds()
    ));
  } else {
    m._d = new Date(
      year,
      month,
      date,
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    );
  }
}
function objectCreate(parent2) {
  function F() {
  }
  F.prototype = parent2;
  return new F();
}
function getPrototypeOf(object) {
  if (Object.getPrototypeOf)
    return Object.getPrototypeOf(object);
  else if ("".__proto__)
    return object.__proto__;
  else
    return object.constructor.prototype;
}
extend(
  getPrototypeOf(moment.localeData()),
  {
    _jMonths: [
      "Farvardin",
      "Ordibehesht",
      "Khordaad",
      "Tir",
      "Amordaad",
      "Shahrivar",
      "Mehr",
      "Aabaan",
      "Aazar",
      "Dey",
      "Bahman",
      "Esfand"
    ],
    jMonths: function(m) {
      return this._jMonths[m.jMonth()];
    },
    _jMonthsShort: [
      "Far",
      "Ord",
      "Kho",
      "Tir",
      "Amo",
      "Sha",
      "Meh",
      "Aab",
      "Aaz",
      "Dey",
      "Bah",
      "Esf"
    ],
    jMonthsShort: function(m) {
      return this._jMonthsShort[m.jMonth()];
    },
    jMonthsParse: function(monthName) {
      var i, mom, regex;
      if (!this._jMonthsParse)
        this._jMonthsParse = [];
      for (i = 0; i < 12; i += 1) {
        if (!this._jMonthsParse[i]) {
          mom = jMoment([2e3, (2 + i) % 12, 25]);
          regex = "^" + this.jMonths(mom, "") + "|^" + this.jMonthsShort(mom, "");
          this._jMonthsParse[i] = new RegExp(regex.replace(".", ""), "i");
        }
        if (this._jMonthsParse[i].test(monthName))
          return i;
      }
    }
  }
);
function makeFormatFunction(format2) {
  var array = format2.match(formattingTokens), length = array.length, i;
  for (i = 0; i < length; i += 1)
    if (formatTokenFunctions[array[i]])
      array[i] = formatTokenFunctions[array[i]];
  return function(mom) {
    var output = "";
    for (i = 0; i < length; i += 1)
      output += array[i] instanceof Function ? "[" + array[i].call(mom, format2) + "]" : array[i];
    return output;
  };
}
function getParseRegexForToken(token2, config) {
  switch (token2) {
    case "jDDDD":
      return parseTokenThreeDigits;
    case "jYYYY":
      return parseTokenFourDigits;
    case "jYYYYY":
      return parseTokenSixDigits;
    case "jDDD":
      return parseTokenOneToThreeDigits;
    case "jMMM":
    case "jMMMM":
      return parseTokenWord;
    case "jMM":
    case "jDD":
    case "jYY":
    case "jM":
    case "jD":
      return parseTokenOneOrTwoDigits;
    case "DDDD":
      return parseTokenThreeDigits;
    case "YYYY":
      return parseTokenFourDigits;
    case "YYYYY":
      return parseTokenSixDigits;
    case "S":
    case "SS":
    case "SSS":
    case "DDD":
      return parseTokenOneToThreeDigits;
    case "MMM":
    case "MMMM":
    case "dd":
    case "ddd":
    case "dddd":
      return parseTokenWord;
    case "a":
    case "A":
      return moment.localeData(config._l)._meridiemParse;
    case "X":
      return parseTokenTimestampMs;
    case "Z":
    case "ZZ":
      return parseTokenTimezone;
    case "T":
      return parseTokenT;
    case "MM":
    case "DD":
    case "YY":
    case "HH":
    case "hh":
    case "mm":
    case "ss":
    case "M":
    case "D":
    case "d":
    case "H":
    case "h":
    case "m":
    case "s":
      return parseTokenOneOrTwoDigits;
    default:
      return new RegExp(token2.replace("\\", ""));
  }
}
function addTimeToArrayFromToken(token2, input2, config) {
  var a, datePartArray = config._a;
  switch (token2) {
    case "jM":
    case "jMM":
      datePartArray[1] = input2 == null ? 0 : ~~input2 - 1;
      break;
    case "jMMM":
    case "jMMMM":
      a = moment.localeData(config._l).jMonthsParse(input2);
      if (a != null)
        datePartArray[1] = a;
      else
        config._isValid = false;
      break;
    case "jD":
    case "jDD":
    case "jDDD":
    case "jDDDD":
      if (input2 != null)
        datePartArray[2] = ~~input2;
      break;
    case "jYY":
      datePartArray[0] = ~~input2 + (~~input2 > 47 ? 1300 : 1400);
      break;
    case "jYYYY":
    case "jYYYYY":
      datePartArray[0] = ~~input2;
  }
  if (input2 == null)
    config._isValid = false;
}
function dateFromArray(config) {
  var g, j, jy = config._a[0], jm = config._a[1], jd = config._a[2];
  if (jy == null && jm == null && jd == null)
    return [0, 0, 1];
  jy = jy != null ? jy : 0;
  jm = jm != null ? jm : 0;
  jd = jd != null ? jd : 1;
  if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11)
    config._isValid = false;
  g = toGregorian(jy, jm, jd);
  j = toJalaali(g.gy, g.gm, g.gd);
  if (isNaN(g.gy))
    config._isValid = false;
  config._jDiff = 0;
  if (~~j.jy !== jy)
    config._jDiff += 1;
  if (~~j.jm !== jm)
    config._jDiff += 1;
  if (~~j.jd !== jd)
    config._jDiff += 1;
  return [g.gy, g.gm, g.gd];
}
function makeDateFromStringAndFormat(config) {
  var tokens = config._f.match(formattingTokens), string = config._i + "", len = tokens.length, i, token2, parsedInput;
  config._a = [];
  for (i = 0; i < len; i += 1) {
    token2 = tokens[i];
    parsedInput = (getParseRegexForToken(token2, config).exec(string) || [])[0];
    if (parsedInput)
      string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
    if (formatTokenFunctions[token2])
      addTimeToArrayFromToken(token2, parsedInput, config);
  }
  if (string)
    config._il = string;
  return dateFromArray(config);
}
function makeDateFromStringAndArray(config, utc) {
  var len = config._f.length, i, format2, tempMoment, bestMoment, currentScore, scoreToBeat;
  if (len === 0) {
    return makeMoment(new Date(NaN));
  }
  for (i = 0; i < len; i += 1) {
    format2 = config._f[i];
    currentScore = 0;
    tempMoment = makeMoment(config._i, format2, config._l, config._strict, utc);
    if (!tempMoment.isValid())
      continue;
    currentScore += tempMoment._jDiff;
    if (tempMoment._il)
      currentScore += tempMoment._il.length;
    if (scoreToBeat == null || currentScore < scoreToBeat) {
      scoreToBeat = currentScore;
      bestMoment = tempMoment;
    }
  }
  return bestMoment;
}
function removeParsedTokens(config) {
  var string = config._i + "", input2 = "", format2 = "", array = config._f.match(formattingTokens), len = array.length, i, match2, parsed;
  for (i = 0; i < len; i += 1) {
    match2 = array[i];
    parsed = (getParseRegexForToken(match2, config).exec(string) || [])[0];
    if (parsed)
      string = string.slice(string.indexOf(parsed) + parsed.length);
    if (!(formatTokenFunctions[match2] instanceof Function)) {
      format2 += match2;
      if (parsed)
        input2 += parsed;
    }
  }
  config._i = input2;
  config._f = format2;
}
function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
  var end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(), adjustedMoment;
  if (daysToDayOfWeek > end) {
    daysToDayOfWeek -= 7;
  }
  if (daysToDayOfWeek < end - 7) {
    daysToDayOfWeek += 7;
  }
  adjustedMoment = jMoment(mom).add(daysToDayOfWeek, "d");
  return {
    week: Math.ceil(adjustedMoment.jDayOfYear() / 7),
    year: adjustedMoment.jYear()
  };
}
var maxTimestamp = 57724432199999;
function makeMoment(input2, format2, lang, strict, utc) {
  if (typeof lang === "boolean") {
    strict = lang;
    lang = void 0;
  }
  if (format2 && typeof format2 === "string")
    format2 = fixFormat(format2, moment);
  var config = {
    _i: input2,
    _f: format2,
    _l: lang,
    _strict: strict,
    _isUTC: utc
  }, date, m, jm, origInput = input2, origFormat = format2;
  if (format2) {
    if (isArray(format2)) {
      return makeDateFromStringAndArray(config, utc);
    } else {
      date = makeDateFromStringAndFormat(config);
      removeParsedTokens(config);
      format2 = "YYYY-MM-DD-" + config._f;
      input2 = leftZeroFill(date[0], 4) + "-" + leftZeroFill(date[1] + 1, 2) + "-" + leftZeroFill(date[2], 2) + "-" + config._i;
    }
  }
  if (utc)
    m = moment.utc(input2, format2, lang, strict);
  else
    m = moment(input2, format2, lang, strict);
  if (config._isValid === false)
    m._isValid = false;
  m._jDiff = config._jDiff || 0;
  jm = objectCreate(jMoment.fn);
  extend(jm, m);
  if (strict && format2 && jm.isValid()) {
    jm._isValid = jm.format(origFormat) === origInput;
  }
  if (m._d.getTime() > maxTimestamp) {
    jm._isValid = false;
  }
  return jm;
}
function jMoment(input2, format2, lang, strict) {
  return makeMoment(input2, format2, lang, strict, false);
}
extend(jMoment, moment);
jMoment.fn = objectCreate(moment.fn);
jMoment.utc = function(input2, format2, lang, strict) {
  return makeMoment(input2, format2, lang, strict, true);
};
jMoment.unix = function(input2) {
  return makeMoment(input2 * 1e3);
};
function fixFormat(format2, _moment) {
  var i = 5;
  var replace = function(input2) {
    return _moment.localeData().longDateFormat(input2) || input2;
  };
  while (i > 0 && localFormattingTokens.test(format2)) {
    i -= 1;
    format2 = format2.replace(localFormattingTokens, replace);
  }
  return format2;
}
jMoment.fn.format = function(format2) {
  if (format2) {
    format2 = fixFormat(format2, this);
    if (!formatFunctions[format2]) {
      formatFunctions[format2] = makeFormatFunction(format2);
    }
    format2 = formatFunctions[format2](this);
  }
  return moment.fn.format.call(this, format2);
};
jMoment.fn.jYear = function(input2) {
  var lastDay, j, g;
  if (typeof input2 === "number") {
    j = toJalaali(this.year(), this.month(), this.date());
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input2, j.jm));
    g = toGregorian(input2, j.jm, lastDay);
    setDate(this, g.gy, g.gm, g.gd);
    moment.updateOffset(this);
    return this;
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jy;
  }
};
jMoment.fn.jMonth = function(input2) {
  var lastDay, j, g;
  if (input2 != null) {
    if (typeof input2 === "string") {
      input2 = this.localeData().jMonthsParse(input2);
      if (typeof input2 !== "number")
        return this;
    }
    j = toJalaali(this.year(), this.month(), this.date());
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input2));
    this.jYear(j.jy + div(input2, 12));
    input2 = mod(input2, 12);
    if (input2 < 0) {
      input2 += 12;
      this.jYear(this.jYear() - 1);
    }
    g = toGregorian(this.jYear(), input2, lastDay);
    setDate(this, g.gy, g.gm, g.gd);
    moment.updateOffset(this);
    return this;
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jm;
  }
};
jMoment.fn.jDate = function(input2) {
  var j, g;
  if (typeof input2 === "number") {
    j = toJalaali(this.year(), this.month(), this.date());
    g = toGregorian(j.jy, j.jm, input2);
    setDate(this, g.gy, g.gm, g.gd);
    moment.updateOffset(this);
    return this;
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jd;
  }
};
jMoment.fn.jDayOfYear = function(input2) {
  var dayOfYear = Math.round((jMoment(this).startOf("day") - jMoment(this).startOf("jYear")) / 864e5) + 1;
  return input2 == null ? dayOfYear : this.add(input2 - dayOfYear, "d");
};
jMoment.fn.jWeek = function(input2) {
  var week = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).week;
  return input2 == null ? week : this.add((input2 - week) * 7, "d");
};
jMoment.fn.jWeekYear = function(input2) {
  var year = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
  return input2 == null ? year : this.add(input2 - year, "y");
};
jMoment.fn.add = function(val, units) {
  var temp;
  if (units !== null && !isNaN(+units)) {
    temp = val;
    val = units;
    units = temp;
  }
  units = normalizeUnits(units);
  if (units === "jyear") {
    this.jYear(this.jYear() + val);
  } else if (units === "jmonth") {
    this.jMonth(this.jMonth() + val);
  } else {
    moment.fn.add.call(this, val, units);
    if (isNaN(this.jYear())) {
      this._isValid = false;
    }
  }
  return this;
};
jMoment.fn.subtract = function(val, units) {
  var temp;
  if (units !== null && !isNaN(+units)) {
    temp = val;
    val = units;
    units = temp;
  }
  units = normalizeUnits(units);
  if (units === "jyear") {
    this.jYear(this.jYear() - val);
  } else if (units === "jmonth") {
    this.jMonth(this.jMonth() - val);
  } else {
    moment.fn.subtract.call(this, val, units);
  }
  return this;
};
jMoment.fn.startOf = function(units) {
  units = normalizeUnits(units);
  if (units === "jyear" || units === "jmonth") {
    if (units === "jyear") {
      this.jMonth(0);
    }
    this.jDate(1);
    this.hours(0);
    this.minutes(0);
    this.seconds(0);
    this.milliseconds(0);
    return this;
  } else {
    return moment.fn.startOf.call(this, units);
  }
};
jMoment.fn.endOf = function(units) {
  units = normalizeUnits(units);
  if (units === void 0 || units === "milisecond") {
    return this;
  }
  return this.startOf(units).add(1, units === "isoweek" ? "week" : units).subtract(1, "ms");
};
jMoment.fn.isSame = function(other, units) {
  units = normalizeUnits(units);
  if (units === "jyear" || units === "jmonth") {
    return moment.fn.isSame.call(this.startOf(units), other.startOf(units));
  }
  return moment.fn.isSame.call(this, other, units);
};
jMoment.fn.clone = function() {
  return jMoment(this);
};
jMoment.fn.jYears = jMoment.fn.jYear;
jMoment.fn.jMonths = jMoment.fn.jMonth;
jMoment.fn.jDates = jMoment.fn.jDate;
jMoment.fn.jWeeks = jMoment.fn.jWeek;
jMoment.jDaysInMonth = function(year, month) {
  year += div(month, 12);
  month = mod(month, 12);
  if (month < 0) {
    month += 12;
    year -= 1;
  }
  if (month < 6) {
    return 31;
  } else if (month < 11) {
    return 30;
  } else if (jMoment.jIsLeapYear(year)) {
    return 30;
  } else {
    return 29;
  }
};
jMoment.jIsLeapYear = jalaali.isLeapJalaaliYear;
jMoment.loadPersian = function(args) {
  var usePersianDigits = args !== void 0 && args.hasOwnProperty("usePersianDigits") ? args.usePersianDigits : false;
  var dialect = args !== void 0 && args.hasOwnProperty("dialect") ? args.dialect : "persian";
  moment.locale("fa");
  moment.updateLocale(
    "fa",
    {
      months: "\u0698\u0627\u0646\u0648\u06CC\u0647_\u0641\u0648\u0631\u06CC\u0647_\u0645\u0627\u0631\u0633_\u0622\u0648\u0631\u06CC\u0644_\u0645\u0647_\u0698\u0648\u0626\u0646_\u0698\u0648\u0626\u06CC\u0647_\u0627\u0648\u062A_\u0633\u067E\u062A\u0627\u0645\u0628\u0631_\u0627\u06A9\u062A\u0628\u0631_\u0646\u0648\u0627\u0645\u0628\u0631_\u062F\u0633\u0627\u0645\u0628\u0631".split("_"),
      monthsShort: "\u0698\u0627\u0646\u0648\u06CC\u0647_\u0641\u0648\u0631\u06CC\u0647_\u0645\u0627\u0631\u0633_\u0622\u0648\u0631\u06CC\u0644_\u0645\u0647_\u0698\u0648\u0626\u0646_\u0698\u0648\u0626\u06CC\u0647_\u0627\u0648\u062A_\u0633\u067E\u062A\u0627\u0645\u0628\u0631_\u0627\u06A9\u062A\u0628\u0631_\u0646\u0648\u0627\u0645\u0628\u0631_\u062F\u0633\u0627\u0645\u0628\u0631".split("_"),
      weekdays: {
        "persian": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "persian-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysShort: {
        "persian": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "persian-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysMin: {
        "persian": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u0622_\u0634".split("_"),
        "persian-modern": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u062C_\u0634".split("_")
      }[dialect],
      longDateFormat: {
        LT: "HH:mm",
        L: "jYYYY/jMM/jDD",
        LL: "jD jMMMM jYYYY",
        LLL: "jD jMMMM jYYYY LT",
        LLLL: "dddd\u060C jD jMMMM jYYYY LT"
      },
      calendar: {
        sameDay: "[\u0627\u0645\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        nextDay: "[\u0641\u0631\u062F\u0627 \u0633\u0627\u0639\u062A] LT",
        nextWeek: "dddd [\u0633\u0627\u0639\u062A] LT",
        lastDay: "[\u062F\u06CC\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        lastWeek: "dddd [\u06CC \u067E\u06CC\u0634 \u0633\u0627\u0639\u062A] LT",
        sameElse: "L"
      },
      relativeTime: {
        future: "\u062F\u0631 %s",
        past: "%s \u067E\u06CC\u0634",
        s: "\u0686\u0646\u062F \u062B\u0627\u0646\u06CC\u0647",
        m: "1 \u062F\u0642\u06CC\u0642\u0647",
        mm: "%d \u062F\u0642\u06CC\u0642\u0647",
        h: "1 \u0633\u0627\u0639\u062A",
        hh: "%d \u0633\u0627\u0639\u062A",
        d: "1 \u0631\u0648\u0632",
        dd: "%d \u0631\u0648\u0632",
        M: "1 \u0645\u0627\u0647",
        MM: "%d \u0645\u0627\u0647",
        y: "1 \u0633\u0627\u0644",
        yy: "%d \u0633\u0627\u0644"
      },
      preparse: function(string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function(match2) {
            return numberMap[match2];
          }).replace(/،/g, ",");
        }
        return string;
      },
      postformat: function(string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function(match2) {
            return symbolMap[match2];
          }).replace(/,/g, "\u060C");
        }
        return string;
      },
      ordinal: "%d\u0645",
      week: {
        dow: 6,
        doy: 12
      },
      meridiem: function(hour) {
        return hour < 12 ? "\u0642.\u0638" : "\u0628.\u0638";
      },
      jMonths: {
        "persian": "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646_\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A_\u062E\u0631\u062F\u0627\u062F_\u062A\u06CC\u0631_\u0627\u0645\u0631\u062F\u0627\u062F_\u0634\u0647\u0631\u06CC\u0648\u0631_\u0645\u0647\u0631_\u0622\u0628\u0627\u0646_\u0622\u0630\u0631_\u062F\u06CC_\u0628\u0647\u0645\u0646_\u0627\u0633\u0641\u0646\u062F".split("_"),
        "persian-modern": "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646_\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A_\u062E\u0631\u062F\u0627\u062F_\u062A\u06CC\u0631_\u0645\u0631\u062F\u0627\u062F_\u0634\u0647\u0631\u06CC\u0648\u0631_\u0645\u0647\u0631_\u0622\u0628\u0627\u0646_\u0622\u0630\u0631_\u062F\u06CC_\u0628\u0647\u0645\u0646_\u0627\u0633\u0641\u0646\u062F".split("_")
      }[dialect],
      jMonthsShort: {
        "persian": "\u0641\u0631\u0648_\u0627\u0631\u062F_\u062E\u0631\u062F_\u062A\u06CC\u0631_\u0627\u0645\u0631_\u0634\u0647\u0631_\u0645\u0647\u0631_\u0622\u0628\u0627_\u0622\u0630\u0631_\u062F\u06CC_\u0628\u0647\u0645_\u0627\u0633\u0641".split("_"),
        "persian-modern": "\u0641\u0631\u0648_\u0627\u0631\u062F_\u062E\u0631\u062F_\u062A\u06CC\u0631_\u0645\u0631\u062F_\u0634\u0647\u0631_\u0645\u0647\u0631_\u0622\u0628\u0627_\u0622\u0630\u0631_\u062F\u06CC_\u0628\u0647\u0645_\u0627\u0633\u0641".split("_")
      }[dialect]
    }
  );
};
jMoment.loadPersian_dari = function(args) {
  var usePersianDigits = args !== void 0 && args.hasOwnProperty("usePersianDigits") ? args.usePersianDigits : false;
  var dialect = args !== void 0 && args.hasOwnProperty("dialect") ? args.dialect : "persian-dari";
  moment.locale("fa-af");
  moment.updateLocale(
    "fa-af",
    {
      months: "\u062C\u0646\u0648\u0631\u06CC_\u0641\u0628\u0631\u0648\u0631\u06CC_\u0645\u0627\u0631\u0686_\u0627\u067E\u0631\u06CC\u0644_\u0645\u06CC_\u062C\u0648\u0646_\u062C\u0648\u0644\u0627\u06CC_\u0622\u06AF\u0633\u062A_\u0633\u067E\u062A\u0645\u0628\u0631_\u0627\u06A9\u062A\u0648\u0628\u0631_\u0646\u0648\u0645\u0628\u0631_\u062F\u06CC\u0633\u0645\u0628\u0631".split("_"),
      monthsShort: "\u062C\u0646\u0648\u0631\u06CC_\u0641\u0628\u0631\u0648\u0631\u06CC_\u0645\u0627\u0631\u0686_\u0627\u067E\u0631\u06CC\u0644_\u0645\u06CC_\u062C\u0648\u0646_\u062C\u0648\u0644\u0627\u06CC_\u0622\u06AF\u0633\u062A_\u0633\u067E\u062A\u0645\u0628\u0631_\u0627\u06A9\u062A\u0648\u0628\u0631_\u0646\u0648\u0645\u0628\u0631_\u062F\u06CC\u0633\u0645\u0628\u0631".split("_"),
      weekdays: {
        "persian": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "persian-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysShort: {
        "persian": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "persian-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysMin: {
        "persian": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u0622_\u0634".split("_"),
        "persian-modern": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u062C_\u0634".split("_")
      }[dialect],
      longDateFormat: {
        LT: "HH:mm",
        L: "jYYYY/jMM/jDD",
        LL: "jD jMMMM jYYYY",
        LLL: "jD jMMMM jYYYY LT",
        LLLL: "dddd\u060C jD jMMMM jYYYY LT"
      },
      calendar: {
        sameDay: "[\u0627\u0645\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        nextDay: "[\u0641\u0631\u062F\u0627 \u0633\u0627\u0639\u062A] LT",
        nextWeek: "dddd [\u0633\u0627\u0639\u062A] LT",
        lastDay: "[\u062F\u06CC\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        lastWeek: "dddd [\u06CC \u067E\u06CC\u0634 \u0633\u0627\u0639\u062A] LT",
        sameElse: "L"
      },
      relativeTime: {
        future: "\u062F\u0631 %s",
        past: "%s \u067E\u06CC\u0634",
        s: "\u0686\u0646\u062F \u062B\u0627\u0646\u06CC\u0647",
        m: "1 \u062F\u0642\u06CC\u0642\u0647",
        mm: "%d \u062F\u0642\u06CC\u0642\u0647",
        h: "1 \u0633\u0627\u0639\u062A",
        hh: "%d \u0633\u0627\u0639\u062A",
        d: "1 \u0631\u0648\u0632",
        dd: "%d \u0631\u0648\u0632",
        M: "1 \u0645\u0627\u0647",
        MM: "%d \u0645\u0627\u0647",
        y: "1 \u0633\u0627\u0644",
        yy: "%d \u0633\u0627\u0644"
      },
      preparse: function(string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function(match2) {
            return numberMap[match2];
          }).replace(/،/g, ",");
        }
        return string;
      },
      postformat: function(string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function(match2) {
            return symbolMap[match2];
          }).replace(/,/g, "\u060C");
        }
        return string;
      },
      ordinal: "%d\u0645",
      week: {
        dow: 6,
        doy: 12
      },
      meridiem: function(hour) {
        return hour < 12 ? "\u0642.\u0638" : "\u0628.\u0638";
      },
      jMonths: {
        "persian-dari": "\u062D\u0645\u0644_\u062B\u0648\u0631_\u062C\u0648\u0632\u0627_\u0633\u0631\u0637\u0627\u0646_\u0627\u0633\u062F_\u0633\u0646\u0628\u0644\u0647_\u0645\u06CC\u0632\u0627\u0646_\u0639\u0642\u0631\u0628_\u0642\u0648\u0633_\u062C\u062F\u06CC_\u062F\u0644\u0648_\u062D\u0648\u062A".split("_"),
        "persian-modern-dari": "\u062D\u0645\u0644_\u062B\u0648\u0631_\u062C\u0648\u0632\u0627_\u0633\u0631\u0637\u0627\u0646_\u0627\u0633\u062F_\u0633\u0646\u0628\u0644\u0647_\u0645\u06CC\u0632\u0627\u0646_\u0639\u0642\u0631\u0628_\u0642\u0648\u0633_\u062C\u062F\u06CC_\u062F\u0644\u0648_\u062D\u0648\u062A".split("_")
      }[dialect],
      jMonthsShort: {
        "persian-dari": "\u062D\u0645\u0644_\u062B\u0648\u0631_\u062C\u0648\u0632\u0627_\u0633\u0631\u0637_\u0627\u0633\u062F_\u0633\u0646\u0628_\u0645\u06CC\u0632_\u0639\u0642\u0631_\u0642\u0648\u0633_\u062C\u062F\u06CC_\u062F\u0644\u0648_\u062D\u0648\u062A".split("_"),
        "persian-modern-dari": "\u062D\u0645\u0644_\u062B\u0648\u0631_\u062C\u0648\u0632\u0627_\u0633\u0631\u0637_\u0627\u0633\u062F_\u0633\u0646\u0628_\u0645\u06CC\u0632_\u0639\u0642\u0631_\u0642\u0648\u0633_\u062C\u062F\u06CC_\u062F\u0644\u0648_\u062D\u0648\u062A".split("_")
      }[dialect]
    }
  );
};
jMoment.loadPashto = function(args) {
  var usePersianDigits = args !== void 0 && args.hasOwnProperty("usePersianDigits") ? args.usePersianDigits : false;
  var dialect = args !== void 0 && args.hasOwnProperty("dialect") ? args.dialect : "pashto";
  moment.locale("ps-af");
  moment.updateLocale(
    "ps-af",
    {
      months: "\u062C\u0646\u0648\u0631\u06CC_\u0641\u0628\u0631\u0648\u0631\u06CC_\u0645\u0627\u0631\u0686_\u0627\u067E\u0631\u06CC\u0644_\u0645\u06CC_\u062C\u0648\u0646_\u062C\u0648\u0644\u0627\u06CC_\u0622\u06AF\u0633\u062A_\u0633\u067E\u062A\u0645\u0628\u0631_\u0627\u06A9\u062A\u0648\u0628\u0631_\u0646\u0648\u0645\u0628\u0631_\u062F\u06CC\u0633\u0645\u0628\u0631".split("_"),
      monthsShort: "\u062C\u0646\u0648\u0631\u06CC_\u0641\u0628\u0631\u0648\u0631\u06CC_\u0645\u0627\u0631\u0686_\u0627\u067E\u0631\u06CC\u0644_\u0645\u06CC_\u062C\u0648\u0646_\u062C\u0648\u0644\u0627\u06CC_\u0622\u06AF\u0633\u062A_\u0633\u067E\u062A\u0645\u0628\u0631_\u0627\u06A9\u062A\u0648\u0628\u0631_\u0646\u0648\u0645\u0628\u0631_\u062F\u06CC\u0633\u0645\u0628\u0631".split("_"),
      weekdays: {
        "pashto": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "pashto-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysShort: {
        "pashto": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u0622\u062F\u06CC\u0646\u0647_\u0634\u0646\u0628\u0647".split("_"),
        "pashto-modern": "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647_\u062F\u0648\u0634\u0646\u0628\u0647_\u0633\u0647\u200C\u0634\u0646\u0628\u0647_\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647_\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647_\u062C\u0645\u0639\u0647_\u0634\u0646\u0628\u0647".split("_")
      }[dialect],
      weekdaysMin: {
        "pashto": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u0622_\u0634".split("_"),
        "pashto-modern": "\u06CC_\u062F_\u0633_\u0686_\u067E_\u062C_\u0634".split("_")
      }[dialect],
      longDateFormat: {
        LT: "HH:mm",
        L: "jYYYY/jMM/jDD",
        LL: "jD jMMMM jYYYY",
        LLL: "jD jMMMM jYYYY LT",
        LLLL: "dddd\u060C jD jMMMM jYYYY LT"
      },
      calendar: {
        sameDay: "[\u0627\u0645\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        nextDay: "[\u0641\u0631\u062F\u0627 \u0633\u0627\u0639\u062A] LT",
        nextWeek: "dddd [\u0633\u0627\u0639\u062A] LT",
        lastDay: "[\u062F\u06CC\u0631\u0648\u0632 \u0633\u0627\u0639\u062A] LT",
        lastWeek: "dddd [\u06CC \u067E\u06CC\u0634 \u0633\u0627\u0639\u062A] LT",
        sameElse: "L"
      },
      relativeTime: {
        future: "\u062F\u0631 %s",
        past: "%s \u067E\u06CC\u0634",
        s: "\u0686\u0646\u062F \u062B\u0627\u0646\u06CC\u0647",
        m: "1 \u062F\u0642\u06CC\u0642\u0647",
        mm: "%d \u062F\u0642\u06CC\u0642\u0647",
        h: "1 \u0633\u0627\u0639\u062A",
        hh: "%d \u0633\u0627\u0639\u062A",
        d: "1 \u0631\u0648\u0632",
        dd: "%d \u0631\u0648\u0632",
        M: "1 \u0645\u0627\u0647",
        MM: "%d \u0645\u0627\u0647",
        y: "1 \u0633\u0627\u0644",
        yy: "%d \u0633\u0627\u0644"
      },
      preparse: function(string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function(match2) {
            return numberMap[match2];
          }).replace(/،/g, ",");
        }
        return string;
      },
      postformat: function(string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function(match2) {
            return symbolMap[match2];
          }).replace(/,/g, "\u060C");
        }
        return string;
      },
      ordinal: "%d\u0645",
      week: {
        dow: 6,
        doy: 12
      },
      meridiem: function(hour) {
        return hour < 12 ? "\u0642.\u0638" : "\u0628.\u0638";
      },
      jMonths: {
        "pashto": "\u0648\u0631\u06CC_\u063A\u0648\u06CC\u06CC_\u063A\u0628\u0631\u06AB\u0648\u0644\u06CC_\u0686\u0646\u06AB\u0627\u069A_\u0632\u0645\u0631\u06CC_\u0648\u0696\u06CC_\u062A\u0644\u0647_\u0644\u0693\u0645_\u0644\u06CC\u0646\u062F\u06CC_\u0645\u0631\u063A\u0648\u0645\u06CC_\u0633\u0644\u0648\u0627\u063A\u0647_\u06A9\u0628".split("_"),
        "pashto-modern": "\u0648\u0631\u06CC_\u063A\u0648\u06CC\u06CC_\u063A\u0628\u0631\u06AB\u0648\u0644\u06CC_\u0686\u0646\u06AB\u0627\u069A_\u0632\u0645\u0631\u06CC_\u0648\u0696\u06CC_\u062A\u0644\u0647_\u0644\u0693\u0645_\u0644\u06CC\u0646\u062F\u06CC_\u0645\u0631\u063A\u0648\u0645\u06CC_\u0633\u0644\u0648\u0627\u063A\u0647_\u06A9\u0628".split("_")
      }[dialect],
      jMonthsShort: {
        "pashto": "\u0648\u0631\u06CC_\u063A\u0648\u06CC_\u063A\u0628\u0631_\u0686\u0646\u06AB_\u0632\u0645\u0631_\u0648\u0696\u06CC_\u0644\u0693\u0645_\u0644\u06CC\u0646_\u0645\u0631\u063A_\u0633\u0644\u0648_\u06A9\u0628".split("_"),
        "pashto-modern": "\u0648\u0631\u06CC_\u063A\u0648\u06CC_\u063A\u0628\u0631_\u0686\u0646\u06AB_\u0632\u0645\u0631_\u0648\u0696\u06CC_\u0644\u0693\u0645_\u0644\u06CC\u0646_\u0645\u0631\u063A_\u0633\u0644\u0648_\u06A9\u0628".split("_")
      }[dialect]
    }
  );
};
jMoment.jConvert = {
  toJalaali,
  toGregorian
};
function toJalaali(gy, gm, gd) {
  try {
    var j = jalaali.toJalaali(gy, gm + 1, gd);
    j.jm -= 1;
    return j;
  } catch (e) {
    return {
      jy: NaN,
      jm: NaN,
      jd: NaN
    };
  }
}
function toGregorian(jy, jm, jd) {
  try {
    var g = jalaali.toGregorian(jy, jm + 1, jd);
    g.gm -= 1;
    return g;
  } catch (e) {
    return {
      gy: NaN,
      gm: NaN,
      gd: NaN
    };
  }
}
function div(a, b) {
  return ~~(a / b);
}
function mod(a, b) {
  return a - ~~(a / b) * b;
}
const millisecondsInWeek = 6048e5;
const millisecondsInDay = 864e5;
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function startOfWeek(date, options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = (_h = (_g = (_d = (_c = options == null ? void 0 : options.weekStartsOn) != null ? _c : (_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.weekStartsOn) != null ? _d : defaultOptions2.weekStartsOn) != null ? _g : (_f = (_e = defaultOptions2.locale) == null ? void 0 : _e.options) == null ? void 0 : _f.weekStartsOn) != null ? _h : 6;
  const _date = toDate$1(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  setDate$1(_date, getDate(_date) - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function startOfISOWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}
function getISOWeekYear(date) {
  const _date = toDate$1(date);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfDay(date) {
  const _date = toDate$1(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate$1(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function differenceInCalendarDays(dateLeft, dateRight) {
  const startOfDayLeft = startOfDay(dateLeft);
  const startOfDayRight = startOfDay(dateRight);
  const timestampLeft = +startOfDayLeft - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  const timestampRight = +startOfDayRight - getTimezoneOffsetInMilliseconds(startOfDayRight);
  return Math.round((timestampLeft - timestampRight) / millisecondsInDay);
}
function startOfISOWeekYear(date) {
  const year = getISOWeekYear(date);
  const fourthOfJanuary = constructFrom(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
function isValid(date) {
  if (!isDate(date) && typeof date !== "number") {
    return false;
  }
  const _date = toDate$1(date);
  return !isNaN(Number(_date));
}
function startOfMonth(date) {
  const _date = toDate$1(date);
  setDate$1(_date, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
function startOfYear(date) {
  const cleanDate = toDate$1(date);
  const _date = constructFrom(date, 0);
  setFullYear(_date, getFullYear(cleanDate), 0, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "\u06A9\u0645\u062A\u0631 \u0627\u0632 \u06CC\u06A9 \u062B\u0627\u0646\u06CC\u0647",
    other: "\u06A9\u0645\u062A\u0631 \u0627\u0632 {{count}} \u062B\u0627\u0646\u06CC\u0647"
  },
  xSeconds: {
    one: "1 \u062B\u0627\u0646\u06CC\u0647",
    other: "{{count}} \u062B\u0627\u0646\u06CC\u0647"
  },
  halfAMinute: "\u0646\u06CC\u0645 \u062F\u0642\u06CC\u0642\u0647",
  lessThanXMinutes: {
    one: "\u06A9\u0645\u062A\u0631 \u0627\u0632 \u06CC\u06A9 \u062F\u0642\u06CC\u0642\u0647",
    other: "\u06A9\u0645\u062A\u0631 \u0627\u0632 {{count}} \u062F\u0642\u06CC\u0642\u0647"
  },
  xMinutes: {
    one: "1 \u062F\u0642\u06CC\u0642\u0647",
    other: "{{count}} \u062F\u0642\u06CC\u0642\u0647"
  },
  aboutXHours: {
    one: "\u062D\u062F\u0648\u062F 1 \u0633\u0627\u0639\u062A",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0633\u0627\u0639\u062A"
  },
  xHours: {
    one: "1 \u0633\u0627\u0639\u062A",
    other: "{{count}} \u0633\u0627\u0639\u062A"
  },
  xDays: {
    one: "1 \u0631\u0648\u0632",
    other: "{{count}} \u0631\u0648\u0632"
  },
  aboutXWeeks: {
    one: "\u062D\u062F\u0648\u062F 1 \u0647\u0641\u062A\u0647",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0647\u0641\u062A\u0647"
  },
  xWeeks: {
    one: "1 \u0647\u0641\u062A\u0647",
    other: "{{count}} \u0647\u0641\u062A\u0647"
  },
  aboutXMonths: {
    one: "\u062D\u062F\u0648\u062F 1 \u0645\u0627\u0647",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0645\u0627\u0647"
  },
  xMonths: {
    one: "1 \u0645\u0627\u0647",
    other: "{{count}} \u0645\u0627\u0647"
  },
  aboutXYears: {
    one: "\u062D\u062F\u0648\u062F 1 \u0633\u0627\u0644",
    other: "\u062D\u062F\u0648\u062F {{count}} \u0633\u0627\u0644"
  },
  xYears: {
    one: "1 \u0633\u0627\u0644",
    other: "{{count}} \u0633\u0627\u0644"
  },
  overXYears: {
    one: "\u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 1 \u0633\u0627\u0644",
    other: "\u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 {{count}} \u0633\u0627\u0644"
  },
  almostXYears: {
    one: "\u0646\u0632\u062F\u06CC\u06A9 1 \u0633\u0627\u0644",
    other: "\u0646\u0632\u062F\u06CC\u06A9 {{count}} \u0633\u0627\u0644"
  }
};
const formatDistance = (token2, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token2];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options == null ? void 0 : options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "\u062F\u0631 " + result;
    } else {
      return result + " \u0642\u0628\u0644";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}
const dateFormats = {
  full: "EEEE do MMMM y",
  long: "do MMMM y",
  medium: "d MMM y",
  short: "yyyy/MM/dd"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} '\u062F\u0631' {{time}}",
  long: "{{date}} '\u062F\u0631' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "eeee '\u06AF\u0630\u0634\u062A\u0647 \u062F\u0631' p",
  yesterday: "'\u062F\u06CC\u0631\u0648\u0632 \u062F\u0631' p",
  today: "'\u0627\u0645\u0631\u0648\u0632 \u062F\u0631' p",
  tomorrow: "'\u0641\u0631\u062F\u0627 \u062F\u0631' p",
  nextWeek: "eeee '\u062F\u0631' p",
  other: "P"
};
const formatRelative = (token2, _date, _baseDate, _options) => formatRelativeLocale[token2];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index2 = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index2];
  };
}
const eraValues = {
  narrow: ["\u0642", "\u0628"],
  abbreviated: ["\u0642.\u0647.", "\u0628.\u0647."],
  wide: ["\u0642\u0628\u0644 \u0627\u0632 \u0647\u062C\u0631\u062A", "\u0628\u0639\u062F \u0627\u0632 \u0647\u062C\u0631\u062A"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["\u0633\u200C\u06451", "\u0633\u200C\u06452", "\u0633\u200C\u06453", "\u0633\u200C\u06454"],
  wide: ["\u0633\u0647\u200C\u0645\u0627\u0647\u0647 1", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 2", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 3", "\u0633\u0647\u200C\u0645\u0627\u0647\u0647 4"]
};
const monthValues = {
  narrow: [
    "\u0641\u0631",
    "\u0627\u0631",
    "\u062E\u0631",
    "\u062A\u06CC",
    "\u0645\u0631",
    "\u0634\u0647",
    "\u0645\u0647",
    "\u0622\u0628",
    "\u0622\u0630",
    "\u062F\u06CC",
    "\u0628\u0647",
    "\u0627\u0633"
  ],
  abbreviated: [
    "\u0641\u0631\u0648",
    "\u0627\u0631\u062F",
    "\u062E\u0631\u062F",
    "\u062A\u06CC\u0631",
    "\u0645\u0631\u062F",
    "\u0634\u0647\u0631",
    "\u0645\u0647\u0631",
    "\u0622\u0628\u0627",
    "\u0622\u0630\u0631",
    "\u062F\u06CC",
    "\u0628\u0647\u0645",
    "\u0627\u0633\u0641"
  ],
  wide: [
    "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646",
    "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A",
    "\u062E\u0631\u062F\u0627\u062F",
    "\u062A\u06CC\u0631",
    "\u0645\u0631\u062F\u0627\u062F",
    "\u0634\u0647\u0631\u06CC\u0648\u0631",
    "\u0645\u0647\u0631",
    "\u0622\u0628\u0627\u0646",
    "\u0622\u0630\u0631",
    "\u062F\u06CC",
    "\u0628\u0647\u0645\u0646",
    "\u0627\u0633\u0641\u0646\u062F"
  ]
};
const dayValues = {
  narrow: ["\u06CC", "\u062F", "\u0633", "\u0686", "\u067E", "\u062C", "\u0634"],
  short: ["1\u0634", "2\u0634", "3\u0634", "4\u0634", "5\u0634", "\u062C", "\u0634"],
  abbreviated: [
    "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647",
    "\u062F\u0648\u0634\u0646\u0628\u0647",
    "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
    "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
    "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647",
    "\u062C\u0645\u0639\u0647",
    "\u0634\u0646\u0628\u0647"
  ],
  wide: [
    "\u06CC\u06A9\u200C\u0634\u0646\u0628\u0647",
    "\u062F\u0648\u0634\u0646\u0628\u0647",
    "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
    "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
    "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647",
    "\u062C\u0645\u0639\u0647",
    "\u0634\u0646\u0628\u0647"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "\u0642",
    pm: "\u0628",
    midnight: "\u0646",
    noon: "\u0638",
    morning: "\u0635",
    afternoon: "\u0628.\u0638.",
    evening: "\u0639",
    night: "\u0634"
  },
  abbreviated: {
    am: "\u0642.\u0638.",
    pm: "\u0628.\u0638.",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  },
  wide: {
    am: "\u0642\u0628\u0644\u200C\u0627\u0632\u0638\u0647\u0631",
    pm: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "\u0642",
    pm: "\u0628",
    midnight: "\u0646",
    noon: "\u0638",
    morning: "\u0635",
    afternoon: "\u0628.\u0638.",
    evening: "\u0639",
    night: "\u0634"
  },
  abbreviated: {
    am: "\u0642.\u0638.",
    pm: "\u0628.\u0638.",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  },
  wide: {
    am: "\u0642\u0628\u0644\u200C\u0627\u0632\u0638\u0647\u0631",
    pm: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    midnight: "\u0646\u06CC\u0645\u0647\u200C\u0634\u0628",
    noon: "\u0638\u0647\u0631",
    morning: "\u0635\u0628\u062D",
    afternoon: "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631",
    evening: "\u0639\u0635\u0631",
    night: "\u0634\u0628"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  return number + "-\u0627\u0645";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : findKey(parsePatterns, (pattern) => pattern.test(matchedString));
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult)
      return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult)
      return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(-?ام)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?ه\.?|ب\.?\s?ه\.?|ه\.?)/i,
  wide: /^(قبل از هجرت|هجری شمسی|بعد از هجرت)/i
};
const parseEraPatterns = {
  any: [/^قبل/i, /^بعد/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^(ف|Q|س‌م)[1234]/i,
  wide: /^(فصل|quarter|سه‌ماهه) [1234](-ام|ام)?/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^(فر|ار|خر|تی|مر|شه|مه|آب|آذ|دی|به|اس)/i,
  abbreviated: /^(فرو|ارد|خرد|تیر|مرد|شهر|مهر|آبا|آذر|دی|بهم|اسف)/i,
  wide: /^(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/i
};
const parseMonthPatterns = {
  narrow: [
    /^فر/i,
    /^ار/i,
    /^خر/i,
    /^تی/i,
    /^مر/i,
    /^شه/i,
    /^مه/i,
    /^آب/i,
    /^آذ/i,
    /^دی/i,
    /^به/i,
    /^اس/i
  ],
  any: [
    /^فر/i,
    /^ار/i,
    /^خر/i,
    /^تی/i,
    /^مر/i,
    /^شه/i,
    /^مه/i,
    /^آب/i,
    /^آذ/i,
    /^دی/i,
    /^به/i,
    /^اس/i
  ]
};
const matchDayPatterns = {
  narrow: /^[شیدسچپج]/i,
  short: /^(ش|ج|1ش|2ش|3ش|4ش|5ش)/i,
  abbreviated: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i,
  wide: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه)/i
};
const parseDayPatterns = {
  narrow: [/^ی/i, /^دو/i, /^س/i, /^چ/i, /^پ/i, /^ج/i, /^ش/i],
  any: [
    /^(ی|1ش|یکشنبه)/i,
    /^(د|2ش|دوشنبه)/i,
    /^(س|3ش|سه‌شنبه)/i,
    /^(چ|4ش|چهارشنبه)/i,
    /^(پ|5ش|پنجشنبه)/i,
    /^(ج|جمعه)/i,
    /^(ش|شنبه)/i
  ]
};
const matchDayPeriodPatterns = {
  narrow: /^(ب|ق|ن|ظ|ص|ب.ظ.|ع|ش)/i,
  any: /^(ق.ظ.|ب.ظ.|قبل‌ازظهر|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^(ق|ق.ظ.|قبل‌ازظهر)/i,
    pm: /^(ب|ب.ظ.|بعدازظهر)/i,
    midnight: /^(‌نیمه‌شب|ن)/i,
    noon: /^(ظ|ظهر)/i,
    morning: /^(ص|صبح)/i,
    afternoon: /^(ب|ب.ظ.|بعدازظهر)/i,
    evening: /^(ع|عصر)/i,
    night: /^(ش|شب)/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index2) => index2 + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const faIR = {
  code: "fa-IR",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 6,
    firstWeekContainsDate: 1
  }
};
function getDayOfYear(date) {
  const _date = toDate$1(date);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}
function getISOWeek(date) {
  const _date = toDate$1(date);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}
function getWeekYear(date, options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const _date = toDate$1(date);
  const year = getFullYear(_date);
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = (_h = (_g = (_d = (_c = options == null ? void 0 : options.firstWeekContainsDate) != null ? _c : (_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) != null ? _d : defaultOptions2.firstWeekContainsDate) != null ? _g : (_f = (_e = defaultOptions2.locale) == null ? void 0 : _e.options) == null ? void 0 : _f.firstWeekContainsDate) != null ? _h : 1;
  const firstWeekOfNextYear = constructFrom(date, 0);
  setFullYear(firstWeekOfNextYear, year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(date, 0);
  setFullYear(firstWeekOfThisYear, year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfWeekYear(date, options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = (_h = (_g = (_d = (_c = options == null ? void 0 : options.firstWeekContainsDate) != null ? _c : (_b = (_a = options == null ? void 0 : options.locale) == null ? void 0 : _a.options) == null ? void 0 : _b.firstWeekContainsDate) != null ? _d : defaultOptions2.firstWeekContainsDate) != null ? _g : (_f = (_e = defaultOptions2.locale) == null ? void 0 : _e.options) == null ? void 0 : _f.firstWeekContainsDate) != null ? _h : 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(date, 0);
  setFullYear(firstWeek, year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}
function getWeek(date, options) {
  const _date = toDate$1(date);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}
const lightFormatters = {
  y(date, token2) {
    const signedYear = getFullYear(date);
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token2 === "yy" ? year % 100 : year, token2.length);
  },
  M(date, token2) {
    const month = getMonth$1(date);
    return token2 === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  d(date, token2) {
    return addLeadingZeros(getDate(date), token2.length);
  },
  a(date, token2) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
    switch (token2) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  h(date, token2) {
    return addLeadingZeros(date.getHours() % 12 || 12, token2.length);
  },
  H(date, token2) {
    return addLeadingZeros(date.getHours(), token2.length);
  },
  m(date, token2) {
    return addLeadingZeros(date.getMinutes(), token2.length);
  },
  s(date, token2) {
    return addLeadingZeros(date.getSeconds(), token2.length);
  },
  S(date, token2) {
    const numberOfDigits = token2.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3)
    );
    return addLeadingZeros(fractionalSeconds, token2.length);
  }
};
const dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
const formatters = {
  G: function(date, token2, localize2) {
    const era = getFullYear(date) > 0 ? 1 : 0;
    switch (token2) {
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, { width: "abbreviated" });
      case "GGGGG":
        return localize2.era(era, { width: "narrow" });
      case "GGGG":
      default:
        return localize2.era(era, { width: "wide" });
    }
  },
  y: function(date, token2, localize2) {
    if (token2 === "yo") {
      const signedYear = getFullYear(date);
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, { unit: "year" });
    }
    return lightFormatters.y(date, token2);
  },
  Y: function(date, token2, localize2, options) {
    const signedWeekYear = getWeekYear(date, options);
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token2 === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token2 === "Yo") {
      return localize2.ordinalNumber(weekYear, { unit: "year" });
    }
    return addLeadingZeros(weekYear, token2.length);
  },
  R: function(date, token2) {
    const isoWeekYear = getISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token2.length);
  },
  u: function(date, token2) {
    const year = getFullYear(date);
    return addLeadingZeros(year, token2.length);
  },
  Q: function(date, token2, localize2) {
    const quarter = Math.ceil((getMonth$1(date) + 1) / 3);
    switch (token2) {
      case "Q":
        return String(quarter);
      case "QQ":
        return addLeadingZeros(quarter, 2);
      case "Qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  q: function(date, token2, localize2) {
    const quarter = Math.ceil((getMonth$1(date) + 1) / 3);
    switch (token2) {
      case "q":
        return String(quarter);
      case "qq":
        return addLeadingZeros(quarter, 2);
      case "qo":
        return localize2.ordinalNumber(quarter, { unit: "quarter" });
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  M: function(date, token2, localize2) {
    const month = getMonth$1(date);
    switch (token2) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token2);
      case "Mo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return localize2.month(month, { width: "wide", context: "formatting" });
    }
  },
  L: function(date, token2, localize2) {
    const month = getMonth$1(date);
    switch (token2) {
      case "L":
        return String(month + 1);
      case "LL":
        return addLeadingZeros(month + 1, 2);
      case "Lo":
        return localize2.ordinalNumber(month + 1, { unit: "month" });
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return localize2.month(month, { width: "wide", context: "standalone" });
    }
  },
  w: function(date, token2, localize2, options) {
    const week = getWeek(date, options);
    if (token2 === "wo") {
      return localize2.ordinalNumber(week, { unit: "week" });
    }
    return addLeadingZeros(week, token2.length);
  },
  I: function(date, token2, localize2) {
    const isoWeek = getISOWeek(date);
    if (token2 === "Io") {
      return localize2.ordinalNumber(isoWeek, { unit: "week" });
    }
    return addLeadingZeros(isoWeek, token2.length);
  },
  d: function(date, token2, localize2) {
    if (token2 === "do") {
      return localize2.ordinalNumber(getDate(date), { unit: "date" });
    }
    return lightFormatters.d(date, token2);
  },
  D: function(date, token2, localize2) {
    const dayOfYear = getDayOfYear(date);
    if (token2 === "Do") {
      return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }
    return addLeadingZeros(dayOfYear, token2.length);
  },
  E: function(date, token2, localize2) {
    const dayOfWeek = date.getDay();
    switch (token2) {
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  e: function(date, token2, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token2) {
      case "e":
        return String(localDayOfWeek);
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  c: function(date, token2, localize2, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token2) {
      case "c":
        return String(localDayOfWeek);
      case "cc":
        return addLeadingZeros(localDayOfWeek, token2.length);
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  i: function(date, token2, localize2) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token2) {
      case "i":
        return String(isoDayOfWeek);
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token2.length);
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  a: function(date, token2, localize2) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token2) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  b: function(date, token2, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token2) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  B: function(date, token2, localize2) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token2) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  h: function(date, token2, localize2) {
    if (token2 === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0)
        hours = 12;
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return lightFormatters.h(date, token2);
  },
  H: function(date, token2, localize2) {
    if (token2 === "Ho") {
      return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
    }
    return lightFormatters.H(date, token2);
  },
  K: function(date, token2, localize2) {
    const hours = date.getHours() % 12;
    if (token2 === "Ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token2.length);
  },
  k: function(date, token2, localize2) {
    let hours = date.getHours();
    if (hours === 0)
      hours = 24;
    if (token2 === "ko") {
      return localize2.ordinalNumber(hours, { unit: "hour" });
    }
    return addLeadingZeros(hours, token2.length);
  },
  m: function(date, token2, localize2) {
    if (token2 === "mo") {
      return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }
    return lightFormatters.m(date, token2);
  },
  s: function(date, token2, localize2) {
    if (token2 === "so") {
      return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
    }
    return lightFormatters.s(date, token2);
  },
  S: function(date, token2) {
    return lightFormatters.S(date, token2);
  },
  X: function(date, token2, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token2) {
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      case "XXXXX":
      case "XXX":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  x: function(date, token2, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token2) {
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      case "xxxxx":
      case "xxx":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  O: function(date, token2, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token2) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  z: function(date, token2, _localize) {
    const timezoneOffset = date.getTimezoneOffset();
    switch (token2) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  t: function(date, token2, _localize) {
    const timestamp = Math.trunc(date.getTime() / 1e3);
    return addLeadingZeros(timestamp, token2.length);
  },
  T: function(date, token2, _localize) {
    const timestamp = date.getTime();
    return addLeadingZeros(timestamp, token2.length);
  }
};
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
const dateLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "P":
      return formatLong2.date({ width: "short" });
    case "PP":
      return formatLong2.date({ width: "medium" });
    case "PPP":
      return formatLong2.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong2.date({ width: "full" });
  }
};
const timeLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "p":
      return formatLong2.time({ width: "short" });
    case "pp":
      return formatLong2.time({ width: "medium" });
    case "ppp":
      return formatLong2.time({ width: "long" });
    case "pppp":
    default:
      return formatLong2.time({ width: "full" });
  }
};
const dateTimeLongFormatter = (pattern, formatLong2) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
const longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;
const throwTokens = ["D", "DD", "YY", "YYYY"];
function isProtectedDayOfYearToken(token2) {
  return dayOfYearTokenRE.test(token2);
}
function isProtectedWeekYearToken(token2) {
  return weekYearTokenRE.test(token2);
}
function warnOrThrowProtectedError(token2, format2, input2) {
  const _message = message(token2, format2, input2);
  console.warn(_message);
  if (throwTokens.includes(token2))
    throw new RangeError(_message);
}
function message(token2, format2, input2) {
  const subject = token2[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token2.toLowerCase()}\` instead of \`${token2}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input2}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(date, formatStr, options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const defaultOptions2 = getDefaultOptions();
  const locale = (_b = (_a = options == null ? void 0 : options.locale) != null ? _a : defaultOptions2.locale) != null ? _b : faIR;
  const firstWeekContainsDate = (_j = (_i = (_f = (_e = options == null ? void 0 : options.firstWeekContainsDate) != null ? _e : (_d = (_c = options == null ? void 0 : options.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) != null ? _f : defaultOptions2.firstWeekContainsDate) != null ? _i : (_h = (_g = defaultOptions2.locale) == null ? void 0 : _g.options) == null ? void 0 : _h.firstWeekContainsDate) != null ? _j : 1;
  const weekStartsOn = (_r = (_q = (_n = (_m = options == null ? void 0 : options.weekStartsOn) != null ? _m : (_l = (_k = options == null ? void 0 : options.locale) == null ? void 0 : _k.options) == null ? void 0 : _l.weekStartsOn) != null ? _n : defaultOptions2.weekStartsOn) != null ? _q : (_p = (_o = defaultOptions2.locale) == null ? void 0 : _o.options) == null ? void 0 : _p.weekStartsOn) != null ? _r : 6;
  const originalDate = toDate$1(date);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken)
      return part.value;
    const token2 = part.value;
    if (!(options == null ? void 0 : options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token2) || !(options == null ? void 0 : options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token2)) {
      warnOrThrowProtectedError(token2, formatStr, String(date));
    }
    const formatter = formatters[token2[0]];
    return formatter(originalDate, token2, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input2) {
  const matched = input2.match(escapedStringRegExp);
  if (!matched) {
    return input2;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}
function getDay(date) {
  const _date = toDate$1(date);
  const day = _date.getDay();
  return day;
}
function getDaysInMonth(date) {
  const _date = toDate$1(date);
  const year = getFullYear(_date);
  const monthIndex = getMonth$1(_date);
  const lastDayOfMonth = constructFrom(date, 0);
  setFullYear(lastDayOfMonth, year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return getDate(lastDayOfMonth);
}
function getMonth(date) {
  const _date = toDate$1(date);
  const month = getMonth$1(_date);
  return month;
}
function getYear(date) {
  return getFullYear(toDate$1(date));
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}
const millisecondsPerDay = 24 * 60 * 60 * 1e3;
class DateInfo {
  constructor(config, { order = 0, locale, isFullDay } = {}) {
    this.isDateInfo = true;
    this.order = order;
    this.locale = locale instanceof Locale ? locale : new Locale(locale);
    this.firstDayOfWeek = this.locale.firstDayOfWeek;
    if (!isObject(config)) {
      const date = this.locale.normalizeDate(config);
      if (isFullDay) {
        config = {
          start: date,
          end: date
        };
      } else {
        config = {
          startOn: date,
          endOn: date
        };
      }
    }
    let start = null;
    let end = null;
    if (config.start) {
      start = this.locale.normalizeDate(config.start, {
        ...this.opts,
        time: "00:00:00"
      });
    } else if (config.startOn) {
      start = this.locale.normalizeDate(config.startOn, this.opts);
    }
    if (config.end) {
      end = this.locale.normalizeDate(config.end, {
        ...this.opts,
        time: "23:59:59"
      });
    } else if (config.endOn) {
      end = this.locale.normalizeDate(config.endOn, this.opts);
    }
    if (start && end && start > end) {
      const temp = start;
      start = end;
      end = temp;
    } else if (start && config.span >= 1) {
      end = addDays(start, config.span - 1);
    }
    this.start = start;
    this.startTime = start ? start.getTime() : NaN;
    this.end = end;
    this.endTime = end ? end.getTime() : NaN;
    this.isDate = this.startTime && this.startTime === this.endTime;
    this.isRange = !this.isDate;
    const andOpt = mixinOptionalProps(config, {}, DateInfo.patternProps);
    if (andOpt.assigned) {
      this.on = { and: andOpt.target };
    }
    if (config.on) {
      const or = (isArrayLikeObject_1(config.on) ? config.on : [config.on]).map((o) => {
        if (isFunction_1(o))
          return o;
        const opt = mixinOptionalProps(o, {}, DateInfo.patternProps);
        return opt.assigned ? opt.target : null;
      }).filter((o) => o);
      if (or.length)
        this.on = { ...this.on, or };
    }
    this.isComplex = !!this.on;
  }
  get opts() {
    return {
      order: this.order,
      locale: this.locale
    };
  }
  toDateInfo(date) {
    return date.isDateInfo ? date : new DateInfo(date, this.opts);
  }
  startOfWeek(date) {
    const day = date.getDay() + 1;
    const daysToAdd = day >= this.firstDayOfWeek ? this.firstDayOfWeek - day : -(7 - (this.firstDayOfWeek - day));
    return addDays(date, daysToAdd);
  }
  diffInDays(d1, d2) {
    return Math.round((d2 - d1) / millisecondsPerDay);
  }
  diffInWeeks(d1, d2) {
    return this.diffInDays(this.startOfWeek(d1), this.startOfWeek(d2));
  }
  diffInYears(d1, d2) {
    return d2.getUTCFullYear() - d1.getUTCFullYear();
  }
  diffInMonths(d1, d2) {
    return this.diffInYears(d1, d2) * 12 + (d2.getMonth() - d1.getMonth());
  }
  static get patterns() {
    return {
      dailyInterval: {
        test: (day, interval, di) => di.diffInDays(di.start || new Date(), day.date) % interval === 0
      },
      weeklyInterval: {
        test: (day, interval, di) => di.diffInWeeks(di.start || new Date(), day.date) % interval === 0
      },
      monthlyInterval: {
        test: (day, interval, di) => di.diffInMonths(di.start || new Date(), day.date) % interval === 0
      },
      yearlyInterval: {
        test: () => (day, interval, di) => di.diffInYears(di.start || new Date(), day.date) % interval === 0
      },
      days: {
        validate: (days) => isArrayLikeObject_1(days) ? days : [parseInt(days, 10)],
        test: (day, days) => days.includes(day.day) || days.includes(-day.dayFromEnd)
      },
      weekdays: {
        validate: (weekdays2) => isArrayLikeObject_1(weekdays2) ? weekdays2 : [parseInt(weekdays2, 10)],
        test: (day, weekdays2) => weekdays2.includes(day.weekday)
      },
      ordinalWeekdays: {
        validate: (ordinalWeekdays) => Object.keys(ordinalWeekdays).reduce((obj, ck) => {
          const weekdays2 = ordinalWeekdays[ck];
          if (!weekdays2)
            return obj;
          obj[ck] = isArrayLikeObject_1(weekdays2) ? weekdays2 : [parseInt(weekdays2, 10)];
          return obj;
        }, {}),
        test: (day, ordinalWeekdays) => Object.keys(ordinalWeekdays).map((k) => parseInt(k, 10)).find(
          (k) => ordinalWeekdays[k].includes(day.weekday) && (k === day.weekdayOrdinal || k === -day.weekdayOrdinalFromEnd)
        )
      },
      weekends: {
        validate: (config) => config,
        test: (day) => day.weekday === 1 || day.weekday === 7
      },
      workweek: {
        validate: (config) => config,
        test: (day) => day.weekday >= 2 && day.weekday <= 6
      },
      weeks: {
        validate: (weeks) => isArrayLikeObject_1(weeks) ? weeks : [parseInt(weeks, 10)],
        test: (day, weeks) => weeks.includes(day.week) || weeks.includes(-day.weekFromEnd)
      },
      months: {
        validate: (months) => isArrayLikeObject_1(months) ? months : [parseInt(months, 10)],
        test: (day, months) => months.includes(day.month)
      },
      years: {
        validate: (years) => isArrayLikeObject_1(years) ? years : [parseInt(years, 10)],
        test: (day, years) => years.includes(day.year)
      }
    };
  }
  static get patternProps() {
    return Object.keys(DateInfo.patterns).map((k) => ({
      name: k,
      validate: DateInfo.patterns[k].validate
    }));
  }
  static testConfig(config, day, dateInfo) {
    if (isFunction_1(config))
      return config(day);
    if (isObject(config)) {
      return Object.keys(config).every(
        (k) => DateInfo.patterns[k].test(day, config[k], dateInfo)
      );
    }
    return null;
  }
  iterateDatesInRange({ start, end }, fn) {
    if (!start || !end || !isFunction_1(fn))
      return null;
    start = this.locale.normalizeDate(start, {
      ...this.opts,
      time: "00:00:00"
    });
    const state2 = {
      i: 0,
      date: start,
      day: this.locale.getDateParts(start),
      finished: false
    };
    let result = null;
    for (; !state2.finished && state2.date <= end; state2.i++) {
      result = fn(state2);
      state2.date = addDays(state2.date, 1);
      state2.day = this.locale.getDateParts(state2.date);
    }
    return result;
  }
  shallowIntersectingRange(other) {
    return this.rangeShallowIntersectingRange(this, this.toDateInfo(other));
  }
  rangeShallowIntersectingRange(date1, date2) {
    if (!this.dateShallowIntersectsDate(date1, date2)) {
      return null;
    }
    const thisRange = date1.toRange();
    const otherRange = date2.toRange();
    let start = null;
    let end = null;
    if (thisRange.start) {
      if (!otherRange.start) {
        start = thisRange.start;
      } else {
        start = thisRange.start > otherRange.start ? thisRange.start : otherRange.start;
      }
    } else if (otherRange.start) {
      start = otherRange.start;
    }
    if (thisRange.end) {
      if (!otherRange.end) {
        end = thisRange.end;
      } else {
        end = thisRange.end < otherRange.end ? thisRange.end : otherRange.end;
      }
    } else if (otherRange.end) {
      end = otherRange.end;
    }
    return { start, end };
  }
  intersectsDate(other) {
    const date = this.toDateInfo(other);
    if (!this.shallowIntersectsDate(date))
      return null;
    if (!this.on)
      return this;
    const range = this.rangeShallowIntersectingRange(this, date);
    let result = false;
    this.iterateDatesInRange(range, (state2) => {
      if (this.matchesDay(state2.day)) {
        result = result || date.matchesDay(state2.day);
        state2.finished = result;
      }
    });
    return result;
  }
  shallowIntersectsDate(other) {
    return this.dateShallowIntersectsDate(this, this.toDateInfo(other));
  }
  dateShallowIntersectsDate(date1, date2) {
    if (date1.isDate) {
      return date2.isDate ? date1.startTime === date2.startTime : this.dateShallowIncludesDate(date2, date1);
    }
    if (date2.isDate) {
      return this.dateShallowIncludesDate(date1, date2);
    }
    if (date1.start && date2.end && date1.start > date2.end) {
      return false;
    }
    if (date1.end && date2.start && date1.end < date2.start) {
      return false;
    }
    return true;
  }
  includesDate(other) {
    const date = this.toDateInfo(other);
    if (!this.shallowIncludesDate(date)) {
      return false;
    }
    if (!this.on) {
      return true;
    }
    const range = this.rangeShallowIntersectingRange(this, date);
    let result = true;
    this.iterateDatesInRange(range, (state2) => {
      if (this.matchesDay(state2.day)) {
        result = result && date.matchesDay(state2.day);
        state2.finished = !result;
      }
    });
    return result;
  }
  shallowIncludesDate(other) {
    return this.dateShallowIncludesDate(
      this,
      other.isDate ? other : new DateInfo(other, this.opts)
    );
  }
  dateShallowIncludesDate(date1, date2) {
    if (date1.isDate) {
      if (date2.isDate) {
        return date1.startTime === date2.startTime;
      }
      if (!date2.startTime || !date2.endTime) {
        return false;
      }
      return date1.startTime === date2.startTime && date1.startTime === date2.endTime;
    }
    if (date2.isDate) {
      if (date1.start && date2.start < date1.start) {
        return false;
      }
      if (date1.end && date2.start > date1.end) {
        return false;
      }
      return true;
    }
    if (date1.start && (!date2.start || date2.start < date1.start)) {
      return false;
    }
    if (date1.end && (!date2.end || date2.end > date1.end)) {
      return false;
    }
    return true;
  }
  intersectsDay(day) {
    if (!this.shallowIntersectsDate(day.range))
      return null;
    return this.matchesDay(day) ? this : null;
  }
  matchesDay(day) {
    if (!this.on)
      return true;
    if (this.on.and && !DateInfo.testConfig(this.on.and, day, this)) {
      return false;
    }
    if (this.on.or && !this.on.or.some((or) => DateInfo.testConfig(or, day, this))) {
      return false;
    }
    return true;
  }
  toRange() {
    return new DateInfo(
      {
        start: this.start,
        end: this.end
      },
      this.opts
    );
  }
  compare(other) {
    if (this.order !== other.order)
      return this.order - other.order;
    if (this.isDate !== other.isDate)
      return this.isDate ? 1 : -1;
    if (this.isDate)
      return 0;
    const diff = this.start - other.start;
    return diff !== 0 ? diff : this.end - other.end;
  }
}
const locales = {
  ar: { dow: 7, L: "D/\u200FM/\u200FYYYY" },
  bg: { dow: 2, L: "D.MM.YYYY" },
  ca: { dow: 2, L: "DD/MM/YYYY" },
  "zh-CN": { dow: 2, L: "YYYY/MM/DD" },
  "zh-TW": { dow: 1, L: "YYYY/MM/DD" },
  hr: { dow: 2, L: "DD.MM.YYYY" },
  cs: { dow: 2, L: "DD.MM.YYYY" },
  da: { dow: 2, L: "DD.MM.YYYY" },
  nl: { dow: 2, L: "DD-MM-YYYY" },
  "en-US": { dow: 1, L: "MM/DD/YYYY" },
  "en-AU": { dow: 2, L: "DD/MM/YYYY" },
  "en-CA": { dow: 1, L: "YYYY-MM-DD" },
  "en-GB": { dow: 2, L: "DD/MM/YYYY" },
  "en-IE": { dow: 2, L: "DD-MM-YYYY" },
  "en-NZ": { dow: 2, L: "DD/MM/YYYY" },
  "en-ZA": { dow: 1, L: "YYYY/MM/DD" },
  eo: { dow: 2, L: "YYYY-MM-DD" },
  et: { dow: 2, L: "DD.MM.YYYY" },
  fi: { dow: 2, L: "DD.MM.YYYY" },
  fr: { dow: 2, L: "DD/MM/YYYY" },
  "fr-CA": { dow: 1, L: "YYYY-MM-DD" },
  "fr-CH": { dow: 2, L: "DD.MM.YYYY" },
  de: { dow: 2, L: "DD.MM.YYYY" },
  he: { dow: 1, L: "DD.MM.YYYY" },
  id: { dow: 2, L: "DD/MM/YYYY" },
  it: { dow: 2, L: "DD/MM/YYYY" },
  ja: { dow: 1, L: "YYYY\u5E74M\u6708D\u65E5" },
  ko: { dow: 1, L: "YYYY.MM.DD" },
  lv: { dow: 2, L: "DD.MM.YYYY" },
  lt: { dow: 2, L: "DD.MM.YYYY" },
  mk: { dow: 2, L: "D.MM.YYYY" },
  nb: { dow: 2, L: "D. MMMM YYYY" },
  nn: { dow: 2, L: "D. MMMM YYYY" },
  pl: { dow: 2, L: "DD.MM.YYYY" },
  pt: { dow: 2, L: "DD/MM/YYYY" },
  ro: { dow: 2, L: "DD.MM.YYYY" },
  ru: { dow: 2, L: "DD.MM.YYYY" },
  sk: { dow: 2, L: "DD.MM.YYYY" },
  "es-ES": { dow: 2, L: "DD/MM/YYYY" },
  "es-MX": { dow: 2, L: "DD/MM/YYYY" },
  sv: { dow: 2, L: "YYYY-MM-DD" },
  th: { dow: 1, L: "DD/MM/YYYY" },
  tr: { dow: 2, L: "DD.MM.YYYY" },
  uk: { dow: 2, L: "DD.MM.YYYY" },
  vi: { dow: 2, L: "DD/MM/YYYY" },
  fa: { dow: 7, L: "YYYY/MM/DD" }
};
locales.en = locales["en-US"];
locales.es = locales["es-ES"];
locales.no = locales.nb;
locales.zh = locales["zh-CN"];
toPairs_1(locales).forEach(([id, { dow, L }]) => {
  locales[id] = {
    id,
    firstDayOfWeek: dow,
    masks: { L }
  };
});
const PATCH = {
  DATE_TIME: 1,
  DATE: 2,
  TIME: 3
};
const PATCH_KEYS = {
  1: ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds"],
  2: ["year", "month", "day"],
  3: ["hours", "minutes", "seconds", "milliseconds"]
};
const token = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|Z{1,4}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
const literal = /\[([^]*?)\]/gm;
const noop = () => {
};
const monthUpdate = (arrName) => (d, v, l) => {
  const index2 = l[arrName].indexOf(
    v.charAt(0).toUpperCase() + v.substring(1).toLowerCase()
  );
  if (~index2) {
    d.month = index2;
  }
};
const maskMacros = ["L", "iso"];
const daysInWeek = 7;
const hourOptions = [
  { value: 0, label: "00" },
  { value: 1, label: "01" },
  { value: 2, label: "02" },
  { value: 3, label: "03" },
  { value: 4, label: "04" },
  { value: 5, label: "05" },
  { value: 6, label: "06" },
  { value: 7, label: "07" },
  { value: 8, label: "08" },
  { value: 9, label: "09" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
  { value: 17, label: "17" },
  { value: 18, label: "18" },
  { value: 19, label: "19" },
  { value: 20, label: "20" },
  { value: 21, label: "21" },
  { value: 22, label: "22" },
  { value: 23, label: "23" }
];
const formatFlags = {
  D(d) {
    return d.day;
  },
  DD(d) {
    return pad(d.day);
  },
  Do(d, l) {
    return l.DoFn(d.day);
  },
  d(d) {
    return d.weekday - 1;
  },
  dd(d) {
    return pad(d.weekday - 1);
  },
  W(d, l) {
    return l.dayNamesNarrow[d.weekday - 1];
  },
  WW(d, l) {
    return l.dayNamesShorter[d.weekday - 1];
  },
  WWW(d, l) {
    return l.dayNamesShort[d.weekday - 1];
  },
  WWWW(d, l) {
    return l.dayNames[d.weekday - 1];
  },
  M(d) {
    return d.month;
  },
  MM(d) {
    return pad(d.month);
  },
  MMM(d, l) {
    return l.monthNamesShort[d.month - 1];
  },
  MMMM(d, l) {
    return l.monthNames[d.month - 1];
  },
  YY(d) {
    return String(d.year).substring(2);
  },
  YYYY(d) {
    return pad(d.year, 4);
  },
  h(d) {
    return d.hours % 12 || 12;
  },
  hh(d) {
    return pad(d.hours % 12 || 12);
  },
  H(d) {
    return d.hours;
  },
  HH(d) {
    return pad(d.hours);
  },
  m(d) {
    return d.minutes;
  },
  mm(d) {
    return pad(d.minutes);
  },
  s(d) {
    return d.seconds;
  },
  ss(d) {
    return pad(d.seconds);
  },
  S(d) {
    return Math.round(d.milliseconds / 100);
  },
  SS(d) {
    return pad(Math.round(d.milliseconds / 10), 2);
  },
  SSS(d) {
    return pad(d.milliseconds, 3);
  },
  a(d, l) {
    return d.hours < 12 ? l.amPm[0] : l.amPm[1];
  },
  A(d, l) {
    return d.hours < 12 ? l.amPm[0].toUpperCase() : l.amPm[1].toUpperCase();
  },
  Z() {
    return "Z";
  },
  ZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(Math.floor(Math.abs(o) / 60), 2)}`;
  },
  ZZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(
      Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60,
      4
    )}`;
  },
  ZZZZ(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? "-" : "+"}${pad(Math.floor(Math.abs(o) / 60), 2)}:${pad(
      Math.abs(o) % 60,
      2
    )}`;
  }
};
const parseFlags = {
  D: [
    twoDigits,
    (d, v) => {
      d.day = v;
    }
  ],
  Do: [
    new RegExp(twoDigits.source + word.source),
    (d, v) => {
      d.day = parseInt(v, 10);
    }
  ],
  d: [twoDigits, noop],
  W: [word, noop],
  M: [
    twoDigits,
    (d, v) => {
      d.month = v - 1;
    }
  ],
  MMM: [word, monthUpdate("monthNamesShort")],
  MMMM: [word, monthUpdate("monthNames")],
  YY: [
    twoDigits,
    (d, v) => {
      const da = new Date();
      const cent = +da.getFullYear().toString().substring(0, 2);
      d.year = `${v > 68 ? cent - 1 : cent}${v}`;
    }
  ],
  YYYY: [
    fourDigits,
    (d, v) => {
      d.year = v;
    }
  ],
  S: [
    /\d/,
    (d, v) => {
      d.millisecond = v * 100;
    }
  ],
  SS: [
    /\d{2}/,
    (d, v) => {
      d.millisecond = v * 10;
    }
  ],
  SSS: [
    threeDigits,
    (d, v) => {
      d.millisecond = v;
    }
  ],
  h: [
    twoDigits,
    (d, v) => {
      d.hour = v;
    }
  ],
  m: [
    twoDigits,
    (d, v) => {
      d.minute = v;
    }
  ],
  s: [
    twoDigits,
    (d, v) => {
      d.second = v;
    }
  ],
  a: [
    word,
    (d, v, l) => {
      const val = v.toLowerCase();
      if (val === l.amPm[0]) {
        d.isPm = false;
      } else if (val === l.amPm[1]) {
        d.isPm = true;
      }
    }
  ],
  Z: [
    /[^\s]*?[+-]\d\d:?\d\d|[^\s]*?Z?/,
    (d, v) => {
      if (v === "Z")
        v = "+00:00";
      const parts = `${v}`.match(/([+-]|\d\d)/gi);
      if (parts) {
        const minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === "+" ? minutes : -minutes;
      }
    }
  ]
};
parseFlags.DD = parseFlags.D;
parseFlags.dd = parseFlags.d;
parseFlags.WWWW = parseFlags.WWW = parseFlags.WW = parseFlags.W;
parseFlags.MM = parseFlags.M;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;
parseFlags.ZZZZ = parseFlags.ZZZ = parseFlags.ZZ = parseFlags.Z;
let localeId = null;
function resolveConfig(config, locales2) {
  const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  let id;
  if (isString_1(config)) {
    id = config;
  } else if (has(config, "id")) {
    id = config.id;
  }
  id = (id || detLocale).toLowerCase();
  const localeKeys = Object.keys(locales2);
  const validKey = (k) => localeKeys.find((lk) => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  const defLocale = { ...locales2["en-IE"], ...locales2[id], id };
  config = isObject(config) ? defaultsDeep_1(config, defLocale) : defLocale;
  localeId = config.id;
  return config;
}
class Locale {
  constructor(config, { locales: locales$1 = locales, timezone } = {}) {
    const { id, firstDayOfWeek, masks: masks2 } = resolveConfig(config, locales$1);
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp_1(firstDayOfWeek, 1, daysInWeek);
    this.masks = masks2;
    this.timezone = timezone || void 0;
    this.dayNames = this.getDayNames("long");
    this.dayNamesShort = this.getDayNames("short");
    this.dayNamesShorter = this.dayNamesShort.map((s) => s.substring(0, 2));
    this.dayNamesNarrow = this.getDayNames("narrow");
    this.monthNames = this.getMonthNames("long");
    this.monthNamesShort = this.getMonthNames("short");
    this.amPm = ["am", "pm"];
    this.monthData = {};
    this.getMonthComps = this.getMonthComps.bind(this);
    this.parse = this.parse.bind(this);
    this.format = this.format.bind(this);
    this.toPage = this.toPage.bind(this);
  }
  format(date, mask) {
    date = this.normalizeDate(date);
    if (!date)
      return "";
    mask = this.normalizeMasks(mask)[0];
    const literals = [];
    mask = mask.replace(literal, ($0, $1) => {
      literals.push($1);
      return "??";
    });
    const timezone = /Z$/.test(mask) ? "utc" : this.timezone;
    const dateParts = this.getDateParts(date, timezone);
    mask = mask.replace(
      token,
      ($0) => $0 in formatFlags ? formatFlags[$0](dateParts, this) : $0.slice(1, $0.length - 1)
    );
    return mask.replace(/\?\?/g, () => literals.shift());
  }
  parse(dateString, mask) {
    const masks2 = this.normalizeMasks(mask);
    return masks2.map((m) => {
      if (typeof m !== "string") {
        throw new Error("Invalid mask in fecha.parse");
      }
      let str = dateString;
      if (str.length > 1e3) {
        return false;
      }
      let isValid2 = true;
      const dateInfo = {};
      m.replace(token, ($0) => {
        if (parseFlags[$0]) {
          const info = parseFlags[$0];
          const index2 = str.search(info[0]);
          if (!~index2) {
            isValid2 = false;
          } else {
            str.replace(info[0], (result) => {
              info[1](dateInfo, result, this);
              str = str.substring(index2 + result.length);
              return result;
            });
          }
        }
        return parseFlags[$0] ? "" : $0.slice(1, $0.length - 1);
      });
      if (!isValid2) {
        return false;
      }
      const today = new Date();
      if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
      } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
      }
      let date;
      if (dateInfo.timezoneOffset != null) {
        dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
        date = new Date(
          Date.UTC(
            dateInfo.year || today.getFullYear(),
            dateInfo.month || 0,
            dateInfo.day || 1,
            dateInfo.hour || 0,
            dateInfo.minute || 0,
            dateInfo.second || 0,
            dateInfo.millisecond || 0
          )
        );
      } else {
        date = this.getDateFromParts({
          year: dateInfo.year || today.getFullYear(),
          month: (dateInfo.month || 0) + 1,
          day: dateInfo.day || 1,
          hours: dateInfo.hour || 0,
          minutes: dateInfo.minute || 0,
          seconds: dateInfo.second || 0,
          milliseconds: dateInfo.millisecond || 0
        });
      }
      return date;
    }).find((d) => d) || new Date(dateString);
  }
  normalizeMasks(masks2) {
    return (arrayHasItems(masks2) && masks2 || [
      isString_1(masks2) && masks2 || "YYYY-MM-DD"
    ]).map(
      (m) => maskMacros.reduce(
        (prev, curr) => prev.replace(curr, this.masks[curr] || ""),
        m
      )
    );
  }
  normalizeDate(d, config = {}) {
    let result = null;
    let { type, fillDate } = config;
    const { mask, patch, time } = config;
    const auto = type === "auto" || !type;
    if (isNumber_1(d)) {
      type = "number";
      result = new Date(+d);
    } else if (isString_1(d)) {
      type = "string";
      result = d ? this.parse(d, mask || "iso") : null;
    } else if (isObject(d)) {
      type = "object";
      result = this.getDateFromParts(d);
    } else {
      type = "date";
      result = isDate$1(d) ? new Date(d.getTime()) : null;
    }
    if (result && patch) {
      fillDate = fillDate == null ? new Date() : this.normalizeDate(fillDate);
      const parts = {
        ...this.getDateParts(fillDate),
        ...pick_1(this.getDateParts(result), PATCH_KEYS[patch])
      };
      result = this.getDateFromParts(parts);
    }
    if (auto)
      config.type = type;
    if (result && !isNaN(result.getTime())) {
      if (time) {
        result = this.adjustTimeForDate(result, {
          timeAdjust: time
        });
      }
      return result;
    }
    return null;
  }
  denormalizeDate(date, { type, mask } = {}) {
    switch (type) {
      case "number":
        return date ? date.getTime() : NaN;
      case "string":
        return date ? this.format(date, mask || "iso") : "";
      default:
        return date ? new Date(date) : null;
    }
  }
  hourIsValid(hour, validHours, dateParts) {
    if (!validHours)
      return true;
    if (isArrayLikeObject_1(validHours))
      return validHours.includes(hour);
    if (isObject(validHours)) {
      const min = validHours.min || 0;
      const max = validHours.max || 24;
      return min <= hour && max >= hour;
    }
    return validHours(hour, dateParts);
  }
  getHourOptions(validHours, dateParts) {
    return hourOptions.filter(
      (opt) => this.hourIsValid(opt.value, validHours, dateParts)
    );
  }
  getMinuteOptions(minuteIncrement) {
    const options = [];
    minuteIncrement = minuteIncrement > 0 ? minuteIncrement : 1;
    for (let i = 0; i <= 59; i += minuteIncrement) {
      options.push({
        value: i,
        label: pad(i, 2)
      });
    }
    return options;
  }
  nearestOptionValue(value, options) {
    if (value == null)
      return value;
    const result = options.reduce((prev, opt) => {
      if (opt.disabled)
        return prev;
      if (isNaN(prev))
        return opt.value;
      const diffPrev = Math.abs(prev - value);
      const diffCurr = Math.abs(opt.value - value);
      return diffCurr < diffPrev ? opt.value : prev;
    }, NaN);
    return isNaN(result) ? value : result;
  }
  adjustTimeForDate(date, { timeAdjust, validHours, minuteIncrement }) {
    if (!timeAdjust && !validHours && !minuteIncrement)
      return date;
    const dateParts = this.getDateParts(date);
    if (timeAdjust) {
      if (timeAdjust === "now") {
        const timeParts = this.getDateParts(new Date());
        dateParts.hours = timeParts.hours;
        dateParts.minutes = timeParts.minutes;
        dateParts.seconds = timeParts.seconds;
        dateParts.milliseconds = timeParts.milliseconds;
      } else {
        const d = new Date(`2000-01-01T${timeAdjust}Z`);
        dateParts.hours = d.getUTCHours();
        dateParts.minutes = d.getUTCMinutes();
        dateParts.seconds = d.getUTCSeconds();
        dateParts.milliseconds = d.getUTCMilliseconds();
      }
    }
    if (validHours) {
      const options = this.getHourOptions(validHours, dateParts);
      dateParts.hours = this.nearestOptionValue(dateParts.hours, options);
    }
    if (minuteIncrement) {
      const options = this.getMinuteOptions(minuteIncrement);
      dateParts.minutes = this.nearestOptionValue(dateParts.minutes, options);
    }
    date = this.getDateFromParts(dateParts);
    return date;
  }
  normalizeDates(dates, opts) {
    opts = opts || {};
    opts.locale = this;
    return (isArrayLikeObject_1(dates) ? dates : [dates]).map((d) => d && (d instanceof DateInfo ? d : new DateInfo(d, opts))).filter((d) => d);
  }
  getDateParts(date, timezone = this.timezone) {
    if (!date)
      return null;
    let tzDate = date;
    if (timezone) {
      const normDate = new Date(
        date.toLocaleString("en-US", { timeZone: timezone })
      );
      normDate.setMilliseconds(date.getMilliseconds());
      const diff = normDate.getTime() - date.getTime();
      tzDate = new Date(date.getTime() + diff);
    }
    const milliseconds = tzDate.getMilliseconds();
    const seconds = tzDate.getSeconds();
    const minutes = tzDate.getMinutes();
    const hours = tzDate.getHours();
    const month = tzDate.getMonth() + 1;
    const year = tzDate.getFullYear();
    const comps = this.getMonthComps(month, year);
    const day = tzDate.getDate();
    const dayFromEnd = comps.days - day + 1;
    const weekday = tzDate.getDay() + 1;
    const weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
    const weekdayOrdinalFromEnd = Math.floor((comps.days - day) / 7 + 1);
    const week = Math.ceil(
      (day + Math.abs(comps.firstWeekday - comps.firstDayOfWeek)) / 7
    );
    const weekFromEnd = comps.weeks - week + 1;
    const parts = {
      milliseconds,
      seconds,
      minutes,
      hours,
      day,
      dayFromEnd,
      weekday,
      weekdayOrdinal,
      weekdayOrdinalFromEnd,
      week,
      weekFromEnd,
      month,
      year,
      date,
      isValid: true
    };
    parts.timezoneOffset = this.getTimezoneOffset(parts);
    return parts;
  }
  getDateFromParts(parts) {
    if (!parts)
      return null;
    const d = new Date();
    const {
      year = d.getFullYear(),
      month = d.getMonth() + 1,
      day = d.getDate(),
      hours: hrs = 0,
      minutes: min = 0,
      seconds: sec = 0,
      milliseconds: ms = 0
    } = parts;
    if (this.timezone) {
      const dateString = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(
        hrs,
        2
      )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
      return toDate$1(dateString, { timeZone: this.timezone });
    }
    return new Date(year, month - 1, day, hrs, min, sec, ms);
  }
  getTimezoneOffset(parts) {
    const {
      year: y,
      month: m,
      day: d,
      hours: hrs = 0,
      minutes: min = 0,
      seconds: sec = 0,
      milliseconds: ms = 0
    } = parts;
    let date;
    const utcDate = new Date(Date.UTC(y, m - 1, d, hrs, min, sec, ms));
    if (this.timezone) {
      const dateString = `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}T${pad(
        hrs,
        2
      )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
      date = toDate$1(dateString, { timeZone: this.timezone });
    } else {
      date = new Date(y, m - 1, d, hrs, min, sec, ms);
    }
    return (date - utcDate) / 6e4;
  }
  toPage(arg, fromPage) {
    if (isNumber_1(arg)) {
      return addPages(fromPage, arg);
    }
    if (isString_1(arg)) {
      return this.getDateParts(this.normalizeDate(arg));
    }
    if (isDate$1(arg)) {
      return this.getDateParts(arg);
    }
    if (isObject(arg)) {
      return arg;
    }
    return null;
  }
  getMonthDates(year = 2e3) {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(year, i, 15));
    }
    return dates;
  }
  getMonthNames(length) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      month: length,
      timezome: "UTC"
    });
    return this.getMonthDates().map((d) => dtf.format(d));
  }
  getWeekdayDates(firstDayOfWeek = this.firstDayOfWeek) {
    const dates = [];
    const year = 2020;
    const month = 1;
    const day = 5 + firstDayOfWeek - 1;
    for (let i = 0; i < daysInWeek; i++) {
      dates.push(
        this.getDateFromParts({
          year,
          month,
          day: day + i,
          hours: 12
        })
      );
    }
    return dates;
  }
  getDayNames(length) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      weekday: length,
      timeZone: this.timezone
    });
    return this.getWeekdayDates(1).map((d) => dtf.format(d));
  }
  getMonthComps(month, year) {
    let comps;
    if (localeId === "fa") {
      const m = momentJalaali(`${year}-${month}-01`, "YYYY-MM-DD").locale("fa");
      const firstDayOfMonth = m.clone().startOf("jMonth");
      const days = firstDayOfMonth.daysInMonth();
      let weeks = 0;
      let date = firstDayOfMonth.clone();
      while (date.jMonth() + 1 === month) {
        weeks++;
        date.add(7, "days");
      }
      const weeknumbers = [];
      const isoWeeknumbers = [];
      for (let i = 0; i < weeks; i++) {
        const date2 = firstDayOfMonth.clone().add(i * 7, "days");
        weeknumbers.push(date2.week());
        isoWeeknumbers.push(date2.isoWeek());
      }
      comps = {
        firstDayOfWeek: this.firstDayOfWeek,
        inLeapYear: days === 30,
        firstWeekday: firstDayOfMonth.day() + 1,
        days,
        weeks,
        month,
        year,
        weeknumbers,
        isoWeeknumbers
      };
    } else {
      const key = `${month}-${year}`;
      comps = this.monthData[key];
      if (!comps) {
        const firstDayOfMonth = startOfMonth(new Date(year, month - 1, 1));
        const firstWeekday = (getDay(firstDayOfMonth) + 1) % 7 || 7;
        const days = getDaysInMonth(firstDayOfMonth);
        const weekStartsOn = this.firstDayOfWeek - 1;
        let weeks = 0;
        let date = firstDayOfMonth;
        while (date.getMonth() + 1 === month) {
          weeks++;
          date = addDays$1(date, 7);
        }
        const weeknumbers = [];
        const isoWeeknumbers = [];
        for (let i = 0; i < weeks; i++) {
          const date2 = addDays$1(firstDayOfMonth, i * 7);
          weeknumbers.push(getWeek(new Date(date2), { weekStartsOn }));
          isoWeeknumbers.push(getISOWeek(new Date(date2)));
        }
        comps = {
          firstDayOfWeek: this.firstDayOfWeek,
          inLeapYear: days === 30,
          firstWeekday,
          days,
          weeks,
          month,
          year,
          weeknumbers,
          isoWeeknumbers
        };
        this.monthData[key] = comps;
      }
    }
    return comps;
  }
  getThisMonthComps() {
    const { month, year } = this.getDateParts(new Date());
    return this.getMonthComps(month, year);
  }
  getPrevMonthComps(month, year) {
    if (month === 1)
      return this.getMonthComps(12, year - 1);
    return this.getMonthComps(month - 1, year);
  }
  getNextMonthComps(month, year) {
    if (month === 12)
      return this.getMonthComps(1, year + 1);
    return this.getMonthComps(month + 1, year);
  }
  getDayId(date) {
    return this.format(date, "YYYY-MM-DD");
  }
  getCalendarDays({ weeks, monthComps, prevMonthComps, nextMonthComps }) {
    const days = [];
    const { firstDayOfWeek, firstWeekday, isoWeeknumbers, weeknumbers } = monthComps;
    const prevMonthDaysToShow = firstWeekday + (firstWeekday < firstDayOfWeek ? 7 : 0) - firstDayOfWeek;
    let prevMonth = true;
    let thisMonth = false;
    let nextMonth = false;
    const formatter = new Intl.DateTimeFormat(this.id, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    let day = prevMonthComps.days - prevMonthDaysToShow + 1;
    let dayFromEnd = prevMonthComps.days - day + 1;
    let weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
    let weekdayOrdinalFromEnd = 1;
    let week = prevMonthComps.weeks;
    let weekFromEnd = 1;
    let month = prevMonthComps.month;
    let year = prevMonthComps.year;
    let today = null;
    let todayDay = null;
    let todayMonth = null;
    let todayYear = null;
    if (localeId === "fa") {
      momentJalaali.loadPersian({ usePersianDigits: false });
      today = momentJalaali();
      todayDay = today.jDate();
      todayMonth = today.jMonth() + 1;
      todayYear = today.jYear();
    } else {
      today = new Date();
      todayDay = today.getDate();
      todayMonth = today.getMonth() + 1;
      todayYear = today.getFullYear();
    }
    const dft = (y, m, d) => (hours, minutes, seconds, milliseconds) => this.normalizeDate({
      year: y,
      month: m,
      day: d,
      hours,
      minutes,
      seconds,
      milliseconds
    });
    for (let w = 1; w <= weeks; w++) {
      for (let i = 1, weekday = firstDayOfWeek; i <= 7; i++, weekday += weekday === 7 ? 1 - 7 : 1) {
        if (prevMonth && weekday === firstWeekday) {
          day = 1;
          dayFromEnd = monthComps.days;
          weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
          weekdayOrdinalFromEnd = Math.floor(
            (monthComps.days - day) / 7 + 1
          );
          week = 1;
          weekFromEnd = monthComps.weeks;
          month = monthComps.month;
          year = monthComps.year;
          prevMonth = false;
          thisMonth = true;
        }
        const dateFromTime = dft(year, month, day);
        const range = {
          start: dateFromTime(0, 0, 0),
          end: dateFromTime(23, 59, 59, 999)
        };
        const date = range.start;
        const id = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const weekdayPosition = i;
        const weekdayPositionFromEnd = 7 - i;
        const weeknumber = weeknumbers[w - 1];
        const isoWeeknumber = isoWeeknumbers[w - 1];
        const isToday = day === todayDay && month === todayMonth && year === todayYear;
        const isFirstDay = thisMonth && day === 1;
        const isLastDay = thisMonth && day === monthComps.days;
        const onTop = w === 1;
        const onBottom = w === weeks;
        const onLeft = i === 1;
        const onRight = i === 7;
        days.push({
          id,
          label: day.toString(),
          ariaLabel: formatter.format(new Date(year, month - 1, day)),
          day,
          dayFromEnd,
          weekday,
          weekdayPosition,
          weekdayPositionFromEnd,
          weekdayOrdinal,
          weekdayOrdinalFromEnd,
          week,
          weekFromEnd,
          weeknumber,
          isoWeeknumber,
          month,
          year,
          dateFromTime,
          date,
          range,
          isToday,
          isFirstDay,
          isLastDay,
          inMonth: thisMonth,
          inPrevMonth: prevMonth,
          inNextMonth: nextMonth,
          onTop,
          onBottom,
          onLeft,
          onRight,
          classes: [
            `id-${id}`,
            `day-${day}`,
            `day-from-end-${dayFromEnd}`,
            `weekday-${weekday}`,
            `weekday-position-${weekdayPosition}`,
            `weekday-ordinal-${weekdayOrdinal}`,
            `weekday-ordinal-from-end-${weekdayOrdinalFromEnd}`,
            `week-${week}`,
            `week-from-end-${weekFromEnd}`,
            {
              "is-today": isToday,
              "is-first-day": isFirstDay,
              "is-last-day": isLastDay,
              "in-month": thisMonth,
              "in-prev-month": prevMonth,
              "in-next-month": nextMonth,
              "on-top": onTop,
              "on-bottom": onBottom,
              "on-left": onLeft,
              "on-right": onRight
            }
          ]
        });
        if (thisMonth && isLastDay) {
          thisMonth = false;
          nextMonth = true;
          day = 1;
          dayFromEnd = nextMonthComps.days;
          weekdayOrdinal = 1;
          weekdayOrdinalFromEnd = Math.floor(
            (nextMonthComps.days - day) / 7 + 1
          );
          week = 1;
          weekFromEnd = nextMonthComps.weeks;
          month = nextMonthComps.month;
          year = nextMonthComps.year;
        } else {
          day++;
          dayFromEnd--;
          weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
          weekdayOrdinalFromEnd = Math.floor(
            (monthComps.days - day) / 7 + 1
          );
        }
      }
      week++;
      weekFromEnd--;
    }
    return days;
  }
}
class Attribute {
  constructor({
    key,
    hashcode,
    highlight,
    content,
    dot,
    bar,
    popover,
    dates,
    excludeDates,
    excludeMode,
    customData,
    order,
    pinPage
  }, theme, locale) {
    this.key = isUndefined_1(key) ? createGuid() : key;
    this.hashcode = hashcode;
    this.customData = customData;
    this.order = order || 0;
    this.dateOpts = { order, locale };
    this.pinPage = pinPage;
    if (highlight) {
      this.highlight = theme.normalizeHighlight(highlight);
    }
    if (content) {
      this.content = theme.normalizeContent(content);
    }
    if (dot) {
      this.dot = theme.normalizeDot(dot);
    }
    if (bar) {
      this.bar = theme.normalizeBar(bar);
    }
    if (popover) {
      this.popover = popover;
    }
    this.dates = locale.normalizeDates(dates, this.dateOpts);
    this.hasDates = !!arrayHasItems(this.dates);
    this.excludeDates = locale.normalizeDates(excludeDates, this.dateOpts);
    this.hasExcludeDates = !!arrayHasItems(this.excludeDates);
    this.excludeMode = excludeMode || "intersects";
    if (this.hasExcludeDates && !this.hasDates) {
      this.dates.push(new DateInfo({}, this.dateOpts));
      this.hasDates = true;
    }
    this.isComplex = some(this.dates, (d) => d.isComplex);
  }
  intersectsDate(date) {
    date = date instanceof DateInfo ? date : new DateInfo(date, this.dateOpts);
    return !this.excludesDate(date) && (this.dates.find((d) => d.intersectsDate(date)) || false);
  }
  includesDate(date) {
    date = date instanceof DateInfo ? date : new DateInfo(date, this.dateOpts);
    return !this.excludesDate(date) && (this.dates.find((d) => d.includesDate(date)) || false);
  }
  excludesDate(date) {
    date = date instanceof DateInfo ? date : new DateInfo(date, this.dateOpts);
    return this.hasExcludeDates && this.excludeDates.find(
      (ed) => this.excludeMode === "intersects" && ed.intersectsDate(date) || this.excludeMode === "includes" && ed.includesDate(date)
    );
  }
  intersectsDay(day) {
    return !this.excludesDay(day) && (this.dates.find((d) => d.intersectsDay(day)) || false);
  }
  excludesDay(day) {
    return this.hasExcludeDates && this.excludeDates.find((ed) => ed.intersectsDay(day));
  }
}
const maxSwipeTime = 300;
const minHorizontalSwipeDistance = 60;
const maxVerticalSwipeDistance = 80;
var touch = {
  maxSwipeTime,
  minHorizontalSwipeDistance,
  maxVerticalSwipeDistance
};
const title = "MMMM YYYY";
const weekdays = "W";
const navMonths = "MMM";
const input = [
  "L",
  "YYYY-MM-DD",
  "YYYY/MM/DD"
];
const inputDateTime = [
  "L h:mm A",
  "YYYY-MM-DD h:mm A",
  "YYYY/MM/DD h:mm A"
];
const inputDateTime24hr = [
  "L HH:mm",
  "YYYY-MM-DD HH:mm",
  "YYYY/MM/DD HH:mm"
];
const inputTime = [
  "h:mm A"
];
const inputTime24hr = [
  "HH:mm"
];
const dayPopover = "WWW, MMM D, YYYY";
const data = [
  "L",
  "YYYY-MM-DD",
  "YYYY/MM/DD"
];
const model = "iso";
const iso = "YYYY-MM-DDTHH:mm:ss.SSSZ";
var masks = {
  title,
  weekdays,
  navMonths,
  input,
  inputDateTime,
  inputDateTime24hr,
  inputTime,
  inputTime24hr,
  dayPopover,
  data,
  model,
  iso
};
const sm = "640px";
const md = "768px";
const lg = "1024px";
const xl = "1280px";
var defaultScreens = {
  sm,
  md,
  lg,
  xl
};
const defaultConfig = {
  componentPrefix: "v",
  color: "blue",
  isDark: false,
  navVisibility: "click",
  titlePosition: "center",
  transition: "slide-h",
  touch,
  masks,
  screens: defaultScreens,
  locales,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1e3,
    popover: {
      visibility: "hover-focus",
      placement: "bottom-start",
      keepVisibleOnInput: false,
      isInteractive: true
    }
  }
};
const state = reactive(defaultConfig);
const computedLocales = computed(() => {
  return mapValues_1(state.locales, (v) => {
    v.masks = defaultsDeep_1(v.masks, state.masks);
    return v;
  });
});
const getDefault = (path) => {
  if (window && has(window.__vcalendar__, path)) {
    return get_1(window.__vcalendar__, path);
  }
  return get_1(state, path);
};
const setupDefaults = (app, userDefaults) => {
  app.config.globalProperties.$VCalendar = state;
  return Object.assign(state, defaultsDeep_1(userDefaults, state));
};
const rootMixin$1 = {
  props: {
    color: {
      type: String,
      default: () => getDefault("color")
    },
    isDark: {
      type: Boolean,
      default: () => getDefault("isDark")
    },
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
    timezone: String,
    minDate: null,
    maxDate: null,
    minDateExact: null,
    maxDateExact: null,
    disabledDates: null,
    availableDates: null,
    theme: null
  },
  computed: {
    $theme() {
      if (this.theme instanceof Theme)
        return this.theme;
      return new Theme({
        color: this.color,
        isDark: this.isDark
      });
    },
    $locale() {
      if (this.locale instanceof Locale)
        return this.locale;
      const config = isObject(this.locale) ? this.locale : {
        id: this.locale,
        firstDayOfWeek: this.firstDayOfWeek,
        masks: this.masks
      };
      return new Locale(config, {
        locales: computedLocales.value,
        timezone: this.timezone
      });
    },
    disabledDates_() {
      const dates = this.normalizeDates(this.disabledDates);
      const { minDate, minDateExact, maxDate, maxDateExact } = this;
      if (minDateExact || minDate) {
        const end = minDateExact ? this.normalizeDate(minDateExact) : this.normalizeDate(minDate, { time: "00:00:00" });
        dates.push({
          start: null,
          end: new Date(end.getTime() - 1e3)
        });
      }
      if (maxDateExact || maxDate) {
        const start = maxDateExact ? this.normalizeDate(maxDateExact) : this.normalizeDate(maxDate, { time: "23:59:59" });
        dates.push({
          start: new Date(start.getTime() + 1e3),
          end: null
        });
      }
      return dates;
    },
    availableDates_() {
      return this.normalizeDates(this.availableDates);
    },
    disabledAttribute() {
      return new Attribute(
        {
          key: "disabled",
          dates: this.disabledDates_,
          excludeDates: this.availableDates_,
          excludeMode: "includes",
          order: 100
        },
        this.$theme,
        this.$locale
      );
    }
  },
  methods: {
    formatDate(date, mask) {
      return this.$locale ? this.$locale.format(date, mask) : "";
    },
    parseDate(text, mask) {
      if (!this.$locale)
        return null;
      const value = this.$locale.parse(text, mask);
      return isDate$1(value) ? value : null;
    },
    normalizeDate(date, config) {
      return this.$locale ? this.$locale.normalizeDate(date, config) : date;
    },
    normalizeDates(dates) {
      return this.$locale.normalizeDates(dates, {
        isFullDay: true
      });
    },
    pageForDate(date) {
      return this.$locale.getDateParts(this.normalizeDate(date));
    },
    pageForThisMonth() {
      return this.pageForDate(new Date());
    }
  }
};
const slotMixin$1 = {
  methods: {
    safeSlot(name, args, def = null) {
      return isFunction_1(this.$slots[name]) ? this.$slots[name](args) : def;
    }
  }
};
const childMixin = childMixin$1;
const rootMixin = rootMixin$1;
const slotMixin = slotMixin$1;
const _sfc_main$8 = {
  name: "PopoverRow",
  mixins: [childMixin],
  props: {
    attribute: Object
  },
  computed: {
    indicator() {
      const { highlight, dot, bar, popover } = this.attribute;
      if (popover && popover.hideIndicator)
        return null;
      if (highlight) {
        const { color, isDark } = highlight.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark
            }),
            width: "10px",
            height: "5px",
            borderRadius: "3px"
          }
        };
      }
      if (dot) {
        const { color, isDark } = dot.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark
            }),
            width: "5px",
            height: "5px",
            borderRadius: "50%"
          }
        };
      }
      if (bar) {
        const { color, isDark } = bar.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark
            }),
            width: "10px",
            height: "3px"
          }
        };
      }
      return null;
    }
  }
};
const _hoisted_1$4 = { class: "vc-day-popover-row" };
const _hoisted_2$4 = {
  key: 0,
  class: "vc-day-popover-row-indicator"
};
const _hoisted_3$3 = { class: "vc-day-popover-row-content" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    $options.indicator ? (openBlock(), createElementBlock("div", _hoisted_2$4, [
      createElementVNode("span", {
        style: normalizeStyle($options.indicator.style),
        class: normalizeClass($options.indicator.class)
      }, null, 6)
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_3$3, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createTextVNode(toDisplayString($props.attribute.popover ? $props.attribute.popover.label : "No content provided"), 1)
      ])
    ])
  ]);
}
var PopoverRow = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$4]]);
const _defSize = "26px";
const _defViewBox = "0 0 32 32";
const icons = {
  "left-arrow": {
    viewBox: "0 -1 16 34",
    path: "M11.196 10c0 0.143-0.071 0.304-0.179 0.411l-7.018 7.018 7.018 7.018c0.107 0.107 0.179 0.268 0.179 0.411s-0.071 0.304-0.179 0.411l-0.893 0.893c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-8.321-8.321c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l8.321-8.321c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l0.893 0.893c0.107 0.107 0.179 0.25 0.179 0.411z"
  },
  "right-arrow": {
    viewBox: "-5 -1 16 34",
    path: "M10.625 17.429c0 0.143-0.071 0.304-0.179 0.411l-8.321 8.321c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-0.893-0.893c-0.107-0.107-0.179-0.25-0.179-0.411 0-0.143 0.071-0.304 0.179-0.411l7.018-7.018-7.018-7.018c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l0.893-0.893c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l8.321 8.321c0.107 0.107 0.179 0.268 0.179 0.411z"
  }
};
const _sfc_main$7 = {
  props: ["name"],
  data() {
    return {
      width: _defSize,
      height: _defSize,
      viewBox: _defViewBox,
      path: "",
      isBaseline: false
    };
  },
  mounted() {
    this.updateIcon();
  },
  watch: {
    name() {
      this.updateIcon();
    }
  },
  methods: {
    updateIcon() {
      const icon = icons[this.name];
      if (icon) {
        this.width = icon.width || _defSize;
        this.height = icon.height || _defSize;
        this.viewBox = icon.viewBox;
        this.path = icon.path;
      }
    }
  }
};
const _hoisted_1$3 = ["width", "height", "viewBox"];
const _hoisted_2$3 = ["d"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    class: "vc-svg-icon",
    width: $data.width,
    height: $data.height,
    viewBox: $data.viewBox
  }, [
    createElementVNode("path", { d: $data.path }, null, 8, _hoisted_2$3)
  ], 8, _hoisted_1$3);
}
var SvgIcon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$3]]);
const _yearGroupCount = 12;
const _sfc_main$6 = {
  name: "CalendarNav",
  emits: ["input"],
  components: {
    SvgIcon
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true }
  },
  data() {
    return {
      monthMode: true,
      yearIndex: 0,
      yearGroupIndex: 0,
      onSpaceOrEnter
    };
  },
  computed: {
    month() {
      return this.value ? this.value.month || 0 : 0;
    },
    year() {
      return this.value ? this.value.year || 0 : 0;
    },
    title() {
      let _jalali = 0;
      if (this.locale.id == "fa") {
        _jalali = 621;
      }
      return this.monthMode ? this.yearIndex - _jalali : `${this.firstYear - _jalali} - ${this.lastYear - _jalali}`;
    },
    monthItems() {
      return this.getMonthItems(this.yearIndex);
    },
    yearItems() {
      return this.getYearItems(this.yearGroupIndex);
    },
    prevItemsEnabled() {
      return this.monthMode ? this.prevMonthItemsEnabled : this.prevYearItemsEnabled;
    },
    nextItemsEnabled() {
      return this.monthMode ? this.nextMonthItemsEnabled : this.nextYearItemsEnabled;
    },
    prevMonthItemsEnabled() {
      return this.getMonthItems(this.yearIndex - 1).some((i) => !i.isDisabled);
    },
    nextMonthItemsEnabled() {
      return this.getMonthItems(this.yearIndex + 1).some((i) => !i.isDisabled);
    },
    prevYearItemsEnabled() {
      return this.getYearItems(this.yearGroupIndex - 1).some(
        (i) => !i.isDisabled
      );
    },
    nextYearItemsEnabled() {
      return this.getYearItems(this.yearGroupIndex + 1).some(
        (i) => !i.isDisabled
      );
    },
    activeItems() {
      return this.monthMode ? this.monthItems : this.yearItems;
    },
    firstYear() {
      return head_1(this.yearItems.map((i) => i.year));
    },
    lastYear() {
      return last_1(this.yearItems.map((i) => i.year));
    }
  },
  watch: {
    year() {
      this.yearIndex = this.year;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val);
    },
    value() {
      this.focusFirstItem();
    }
  },
  created() {
    this.yearIndex = this.year;
  },
  mounted() {
    this.focusFirstItem();
  },
  methods: {
    focusFirstItem() {
      this.$nextTick(() => {
        const focusableEl = this.$refs.navContainer.querySelector(
          ".vc-nav-item:not(.is-disabled)"
        );
        if (focusableEl) {
          focusableEl.focus();
        }
      });
    },
    getItemClasses({ isActive, isCurrent, isDisabled }) {
      const classes = ["vc-nav-item"];
      if (isActive) {
        classes.push("is-active");
      } else if (isCurrent) {
        classes.push("is-current");
      }
      if (isDisabled) {
        classes.push("is-disabled");
      }
      return classes;
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    getMonthItems(year) {
      const today = new Date();
      const thisMonth = getMonth(today) + 1;
      const thisYear = getYear(today);
      let len = 12;
      if (this.locale.id == "fa") {
        len = 15;
      }
      let _monthes = Array.from({ length: len }).map((_, i) => {
        const month = i + 1;
        const date = new Date(year, i, 1);
        return {
          month,
          year,
          id: `${year}.${pad(month, 2)}`,
          label: format(date, "MMMM"),
          ariaLabel: format(date, "MMMM yyyy"),
          isActive: month === this.month && year === this.year,
          isCurrent: month === thisMonth && year === thisYear,
          isDisabled: !this.validator({ month, year }),
          click: () => this.monthClick(month, year)
        };
      });
      if (this.locale.id == "fa") {
        _monthes = _monthes.slice(3);
      }
      return _monthes;
    },
    getYearItems(yearGroupIndex) {
      const today = new Date();
      const thisYear = getYear(today);
      const startYear = yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      let _jalali = 0;
      if (this.locale.id == "fa") {
        _jalali = 621;
      }
      return Array.from({ length: endYear - startYear }).map((_, i) => {
        const year = startYear + i;
        const enabled = Array.from({ length: 12 }).some(
          (_2, month) => this.validator({ month: month + 1, year })
        );
        return {
          year,
          id: year.toString(),
          label: year.toString() - _jalali,
          ariaLabel: year.toString(),
          isActive: year === this.year,
          isCurrent: year === thisYear,
          isDisabled: !enabled,
          click: () => this.yearClick(year)
        };
      });
    },
    monthClick(month, year) {
      if (this.validator({ month, year })) {
        this.$emit("input", { month, year });
      }
    },
    yearClick(year) {
      this.yearIndex = year;
      this.monthMode = true;
      this.focusFirstItem();
    },
    toggleMode() {
      this.monthMode = !this.monthMode;
    },
    movePrev() {
      if (!this.prevItemsEnabled)
        return;
      if (this.monthMode) {
        this.movePrevYear();
      }
      this.movePrevYearGroup();
    },
    moveNext() {
      if (!this.nextItemsEnabled)
        return;
      if (this.monthMode) {
        this.moveNextYear();
      }
      this.moveNextYearGroup();
    },
    movePrevYear() {
      this.yearIndex--;
    },
    moveNextYear() {
      this.yearIndex++;
    },
    movePrevYearGroup() {
      this.yearGroupIndex--;
    },
    moveNextYearGroup() {
      this.yearGroupIndex++;
    }
  }
};
const _hoisted_1$2 = {
  class: "vc-nav-container",
  ref: "navContainer"
};
const _hoisted_2$2 = { class: "vc-nav-header" };
const _hoisted_3$2 = ["tabindex"];
const _hoisted_4$2 = ["tabindex"];
const _hoisted_5$1 = { class: "vc-nav-items" };
const _hoisted_6$1 = ["data-id", "aria-label", "tabindex", "onClick", "onKeydown"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = resolveComponent("svg-icon");
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("div", _hoisted_2$2, [
      createElementVNode("span", {
        role: "button",
        class: normalizeClass(["vc-nav-arrow is-left", { "is-disabled": !$options.prevItemsEnabled }]),
        tabindex: $options.prevItemsEnabled ? 0 : void 0,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.movePrev && $options.movePrev(...args)),
        onKeydown: _cache[1] || (_cache[1] = (e) => $data.onSpaceOrEnter(e, $options.movePrev))
      }, [
        renderSlot(_ctx.$slots, "nav-left-button", {}, () => [
          createVNode(_component_svg_icon, {
            name: "left-arrow",
            width: "20px",
            height: "24px"
          })
        ])
      ], 42, _hoisted_3$2),
      createElementVNode("span", {
        role: "button",
        class: "vc-nav-title vc-grid-focus",
        style: { whiteSpace: "nowrap" },
        tabindex: "0",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleMode && $options.toggleMode(...args)),
        onKeydown: _cache[3] || (_cache[3] = (e) => $data.onSpaceOrEnter(e, $options.toggleMode))
      }, toDisplayString($options.title), 33),
      createElementVNode("span", {
        role: "button",
        class: normalizeClass(["vc-nav-arrow is-right", { "is-disabled": !$options.nextItemsEnabled }]),
        tabindex: $options.nextItemsEnabled ? 0 : void 0,
        onClick: _cache[4] || (_cache[4] = (...args) => $options.moveNext && $options.moveNext(...args)),
        onKeydown: _cache[5] || (_cache[5] = (e) => $data.onSpaceOrEnter(e, $options.moveNext))
      }, [
        renderSlot(_ctx.$slots, "nav-right-button", {}, () => [
          createVNode(_component_svg_icon, {
            name: "right-arrow",
            width: "20px",
            height: "24px"
          })
        ])
      ], 42, _hoisted_4$2)
    ]),
    createElementVNode("div", _hoisted_5$1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.activeItems, (item) => {
        return openBlock(), createElementBlock("span", {
          key: item.label,
          role: "button",
          "data-id": item.id,
          "aria-label": item.ariaLabel,
          class: normalizeClass($options.getItemClasses(item)),
          tabindex: item.isDisabled ? void 0 : 0,
          onClick: item.click,
          onKeydown: (e) => $data.onSpaceOrEnter(e, item.click)
        }, toDisplayString(item.label), 43, _hoisted_6$1);
      }), 128))
    ])
  ], 512);
}
var CalendarNav = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2]]);
function showPopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("show-popover", {
        detail: opts
      })
    );
  }
}
function hidePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("hide-popover", {
        detail: opts
      })
    );
  }
}
function togglePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("toggle-popover", {
        detail: opts
      })
    );
  }
}
function updatePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent("update-popover", {
        detail: opts
      })
    );
  }
}
function getPopoverTriggerEvents(opts) {
  const { visibility } = opts;
  const click = visibility === "click";
  const hover = visibility === "hover";
  const hoverFocus = visibility === "hover-focus";
  const focus = visibility === "focus";
  opts.autoHide = !click;
  let hovered = false;
  let focused = false;
  const { isRenderFn } = opts;
  const events = {
    click: isRenderFn ? "onClick" : "click",
    mousemove: isRenderFn ? "onMousemove" : "mousemove",
    mouseleave: isRenderFn ? "onMouseleave" : "mouseleave",
    focusin: isRenderFn ? "onFocusin" : "focusin",
    focusout: isRenderFn ? "onFocusout" : "focusout"
  };
  return {
    [events.click](e) {
      if (click) {
        opts.ref = e.target;
        togglePopover(opts);
        e.stopPropagation();
      }
    },
    [events.mousemove](e) {
      opts.ref = e.currentTarget;
      if (!hovered) {
        hovered = true;
        if (hover || hoverFocus) {
          showPopover(opts);
        }
      }
    },
    [events.mouseleave](e) {
      opts.ref = e.target;
      if (hovered) {
        hovered = false;
        if (hover || hoverFocus && !focused) {
          hidePopover(opts);
        }
      }
    },
    [events.focusin](e) {
      opts.ref = e.currentTarget;
      if (!focused) {
        focused = true;
        if (focus || hoverFocus) {
          showPopover(opts);
        }
      }
    },
    [events.focusout](e) {
      opts.ref = e.currentTarget;
      if (focused && !elementContains(opts.ref, e.relatedTarget)) {
        focused = false;
        if (focus || hoverFocus && !hovered) {
          hidePopover(opts);
        }
      }
    }
  };
}
const _sfc_main$5 = {
  name: "CalendarDay",
  emits: [
    "dayclick",
    "daymouseenter",
    "daymouseleave",
    "dayfocusin",
    "dayfocusout",
    "daykeydown"
  ],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    const backgroundsLayer = () => this.hasBackgrounds && false;
    const contentLayer = () => this.safeSlot("day-content", {
      day: this.day,
      attributes: this.day.attributes,
      attributesMap: this.day.attributesMap,
      dayProps: this.dayContentProps,
      dayEvents: this.dayContentEvents
    }) || h(
      "span",
      {
        ...this.dayContentProps,
        class: this.dayContentClass,
        style: this.dayContentStyle,
        ...this.dayContentEvents,
        ref: "content"
      },
      [this.day.label]
    );
    const dotsLayer = () => this.hasDots && h(
      "div",
      {
        class: "vc-day-layer vc-day-box-center-bottom"
      },
      [
        h(
          "div",
          {
            class: "vc-dots"
          },
          this.dots.map(
            ({ key, class: bgClass, style }) => h("span", {
              key,
              class: bgClass,
              style
            })
          )
        )
      ]
    );
    const barsLayer = () => this.hasBars && h(
      "div",
      {
        class: "vc-day-layer vc-day-box-center-bottom"
      },
      [
        h(
          "div",
          {
            class: "vc-bars"
          },
          this.bars.map(
            ({ key, class: bgClass, style }) => h("span", {
              key,
              class: bgClass,
              style
            })
          )
        )
      ]
    );
    return h(
      "div",
      {
        class: [
          "vc-day",
          ...this.day.classes,
          { "vc-day-box-center-center": !this.$slots["day-content"] },
          { "is-not-in-month": !this.inMonth }
        ]
      },
      [backgroundsLayer(), contentLayer(), dotsLayer(), barsLayer()]
    );
  },
  inject: ["sharedState"],
  props: {
    day: { type: Object, required: true }
  },
  data() {
    return {
      glyphs: {},
      dayContentEvents: {}
    };
  },
  computed: {
    label() {
      return this.day.label;
    },
    startTime() {
    },
    endTime() {
    },
    inMonth() {
      return this.day.inMonth;
    },
    isDisabled() {
      return this.day.isDisabled;
    },
    backgrounds() {
      return this.glyphs.backgrounds;
    },
    hasBackgrounds() {
      return !!arrayHasItems(this.backgrounds);
    },
    content() {
      return this.glyphs.content;
    },
    dots() {
      return this.glyphs.dots;
    },
    hasDots() {
      return !!arrayHasItems(this.dots);
    },
    bars() {
      return this.glyphs.bars;
    },
    hasBars() {
      return !!arrayHasItems(this.bars);
    },
    popovers() {
      return this.glyphs.popovers;
    },
    hasPopovers() {
      return !!arrayHasItems(this.popovers);
    },
    dayContentClass() {
      return [
        "vc-day-content vc-focusable",
        { "is-disabled": this.isDisabled },
        get_1(last_1(this.content), "class") || ""
      ];
    },
    dayContentStyle() {
      return get_1(last_1(this.content), "style");
    },
    dayContentProps() {
      let tabindex;
      if (this.day.isFocusable) {
        tabindex = "0";
      } else if (this.day.inMonth) {
        tabindex = "-1";
      }
      return {
        tabindex,
        "aria-label": this.day.ariaLabel,
        "aria-disabled": this.day.isDisabled ? "true" : "false",
        role: "button"
      };
    },
    dayEvent() {
      return {
        ...this.day,
        el: this.$refs.content,
        popovers: this.popovers
      };
    }
  },
  watch: {
    theme() {
      this.refresh();
    },
    popovers() {
      this.refreshPopovers();
    },
    "day.shouldRefresh"() {
      this.refresh();
    }
  },
  mounted() {
    this.refreshPopovers();
    this.refresh();
  },
  methods: {
    getDayEvent(origEvent) {
      return {
        ...this.dayEvent,
        event: origEvent
      };
    },
    click(e) {
      this.$emit("dayclick", this.getDayEvent(e));
    },
    mouseenter(e) {
      this.$emit("daymouseenter", this.getDayEvent(e));
    },
    mouseleave(e) {
      this.$emit("daymouseleave", this.getDayEvent(e));
    },
    focusin(e) {
      this.$emit("dayfocusin", this.getDayEvent(e));
    },
    focusout(e) {
      this.$emit("dayfocusout", this.getDayEvent(e));
    },
    keydown(e) {
      this.$emit("daykeydown", this.getDayEvent(e));
    },
    refresh() {
      if (!this.day.shouldRefresh)
        return;
      this.day.shouldRefresh = false;
      const glyphs = {
        backgrounds: [],
        dots: [],
        bars: [],
        popovers: [],
        content: []
      };
      this.day.attributes = Object.values(this.day.attributesMap || {}).sort(
        (a, b) => a.order - b.order
      );
      this.day.attributes.forEach((attr) => {
        const { targetDate } = attr;
        const { isDate: isDate2, isComplex, startTime, endTime } = targetDate;
        const onStart = this.startTime <= startTime;
        const onEnd = this.endTime >= endTime;
        const onStartAndEnd = onStart && onEnd;
        const onStartOrEnd = onStart || onEnd;
        const dateInfo = {
          isDate: isDate2,
          isComplex,
          onStart,
          onEnd,
          onStartAndEnd,
          onStartOrEnd
        };
        this.processHighlight(attr, dateInfo, glyphs);
        this.processNonHighlight(attr, "content", dateInfo, glyphs.content);
        this.processNonHighlight(attr, "dot", dateInfo, glyphs.dots);
        this.processNonHighlight(attr, "bar", dateInfo, glyphs.bars);
        this.processPopover(attr, glyphs);
      });
      this.glyphs = glyphs;
    },
    processHighlight({ key, highlight }, { isDate: isDate2, isComplex, onStart, onEnd, onStartAndEnd }, { backgrounds, content }) {
      if (!highlight)
        return;
      const { base, start, end } = highlight;
      if (isDate2 || isComplex) {
        backgrounds.push({
          key,
          wrapperClass: "vc-day-layer vc-day-box-center-center",
          class: ["vc-highlight", start.class],
          style: start.style
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle
        });
      } else if (onStartAndEnd) {
        backgrounds.push({
          key,
          wrapperClass: "vc-day-layer vc-day-box-center-center",
          class: ["vc-highlight", start.class],
          style: start.style
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle
        });
      } else if (onStart) {
        backgrounds.push({
          key: `${key}-base`,
          wrapperClass: "vc-day-layer vc-day-box-right-center",
          class: ["vc-highlight vc-highlight-base-start", base.class],
          style: base.style
        });
        backgrounds.push({
          key,
          wrapperClass: "vc-day-layer vc-day-box-center-center",
          class: ["vc-highlight", start.class],
          style: start.style
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle
        });
      } else if (onEnd) {
        backgrounds.push({
          key: `${key}-base`,
          wrapperClass: "vc-day-layer vc-day-box-left-center",
          class: ["vc-highlight vc-highlight-base-end", base.class],
          style: base.style
        });
        backgrounds.push({
          key,
          wrapperClass: "vc-day-layer vc-day-box-center-center",
          class: ["vc-highlight", end.class],
          style: end.style
        });
        content.push({
          key: `${key}-content`,
          class: end.contentClass,
          style: end.contentStyle
        });
      } else {
        backgrounds.push({
          key: `${key}-middle`,
          wrapperClass: "vc-day-layer vc-day-box-center-center",
          class: ["vc-highlight vc-highlight-base-middle", base.class],
          style: base.style
        });
        content.push({
          key: `${key}-content`,
          class: base.contentClass,
          style: base.contentStyle
        });
      }
    },
    processNonHighlight(attr, itemKey, { isDate: isDate2, onStart, onEnd }, list) {
      if (!attr[itemKey])
        return;
      const { key } = attr;
      const className = `vc-${itemKey}`;
      const { base, start, end } = attr[itemKey];
      if (isDate2 || onStart) {
        list.push({
          key,
          class: [className, start.class],
          style: start.style
        });
      } else if (onEnd) {
        list.push({
          key,
          class: [className, end.class],
          style: end.style
        });
      } else {
        list.push({
          key,
          class: [className, base.class],
          style: base.style
        });
      }
    },
    processPopover(attribute, { popovers }) {
      const { key, customData, popover } = attribute;
      if (!popover)
        return;
      const resolvedPopover = defaults_1(
        {
          key,
          customData,
          attribute
        },
        { ...popover },
        {
          visibility: popover.label ? "hover" : "click",
          placement: "bottom",
          isInteractive: !popover.label
        }
      );
      popovers.splice(0, 0, resolvedPopover);
    },
    refreshPopovers() {
      let popoverEvents = {};
      if (arrayHasItems(this.popovers)) {
        popoverEvents = getPopoverTriggerEvents(
          defaults_1(
            { id: this.dayPopoverId, data: this.day, isRenderFn: true },
            ...this.popovers
          )
        );
      }
      this.dayContentEvents = mergeEvents(
        {
          onClick: this.click,
          onMouseenter: this.mouseenter,
          onMouseleave: this.mouseleave,
          onFocusin: this.focusin,
          onFocusout: this.focusout,
          onKeydown: this.keydown
        },
        popoverEvents
      );
      updatePopover({
        id: this.dayPopoverId,
        data: this.day
      });
    }
  }
};
const _sfc_main$4 = {
  name: "CalendarPane",
  emits: ["update:page", "weeknumberclick"],
  mixins: [childMixin, slotMixin],
  inheritAttrs: false,
  render() {
    console.log(this.page);
    const header = this.safeSlot("header", this.page) || h("div", { class: `vc-header align-${this.titlePosition}` }, [
      h(
        "div",
        {
          class: "vc-title",
          ...this.navPopoverEvents
        },
        [this.safeSlot("header-title", this.page, this.page.title)]
      )
    ]);
    const weekdayCells = this.weekdayLabels.map(
      (wl, i) => h(
        "div",
        {
          key: i + 1,
          class: "vc-weekday"
        },
        [wl]
      )
    );
    const showWeeknumbersLeft = this.showWeeknumbers_.startsWith("left");
    const showWeeknumbersRight = this.showWeeknumbers_.startsWith("right");
    let _dir = "ltr";
    if (this.locale.id == "fa") {
      _dir = "rtl";
    }
    if (showWeeknumbersLeft) {
      weekdayCells.unshift(
        h("div", {
          class: "vc-weekday"
        })
      );
    } else if (showWeeknumbersRight) {
      weekdayCells.push(
        h("div", {
          class: "vc-weekday"
        })
      );
    }
    const getWeeknumberCell = (weeknumber) => h(
      "div",
      {
        class: ["vc-weeknumber"]
      },
      [
        h(
          "span",
          {
            class: ["vc-weeknumber-content", `is-${this.showWeeknumbers_}`],
            onClick: (event) => {
              this.$emit("weeknumberclick", {
                weeknumber,
                days: this.page.days.filter(
                  (d) => d[this.weeknumberKey] === weeknumber
                ),
                event
              });
            }
          },
          [weeknumber]
        )
      ]
    );
    const dayCells = [];
    const { daysInWeek: daysInWeek2 } = this.locale;
    this.page.days.forEach((day, i) => {
      const mod2 = i % daysInWeek2;
      if (showWeeknumbersLeft && mod2 === 0 || showWeeknumbersRight && mod2 === daysInWeek2) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
      dayCells.push(
        h(
          _sfc_main$5,
          {
            ...this.$attrs,
            day
          },
          this.$slots
        )
      );
      if (showWeeknumbersRight && mod2 === daysInWeek2 - 1) {
        dayCells.push(getWeeknumberCell(day[this.weeknumberKey]));
      }
    });
    const weeks = h(
      "div",
      {
        class: {
          "vc-weeks": true,
          "vc-show-weeknumbers": this.showWeeknumbers_,
          "is-left": showWeeknumbersLeft,
          "is-right": showWeeknumbersRight
        },
        dir: _dir
      },
      [weekdayCells, dayCells]
    );
    return h(
      "div",
      {
        class: [
          "vc-pane",
          `row-from-end-${this.rowFromEnd}`,
          `column-from-end-${this.columnFromEnd}`
        ],
        ref: "pane"
      },
      [header, weeks]
    );
  },
  props: {
    page: Object,
    position: Number,
    row: Number,
    rowFromEnd: Number,
    column: Number,
    columnFromEnd: Number,
    titlePosition: String,
    navVisibility: {
      type: String,
      default: () => getDefault("navVisibility")
    },
    showWeeknumbers: [Boolean, String],
    showIsoWeeknumbers: [Boolean, String]
  },
  computed: {
    weeknumberKey() {
      return this.showWeeknumbers ? "weeknumber" : "isoWeeknumber";
    },
    showWeeknumbers_() {
      const showWeeknumbers = this.showWeeknumbers || this.showIsoWeeknumbers;
      if (showWeeknumbers == null)
        return "";
      if (isBoolean_1(showWeeknumbers)) {
        return showWeeknumbers ? "left" : "";
      }
      if (showWeeknumbers.startsWith("right")) {
        return this.columnFromEnd > 1 ? "right" : showWeeknumbers;
      }
      return this.column > 1 ? "left" : showWeeknumbers;
    },
    navPlacement() {
      switch (this.titlePosition) {
        case "left":
          return "bottom-start";
        case "right":
          return "bottom-end";
        default:
          return "bottom";
      }
    },
    navPopoverEvents() {
      const { sharedState, navVisibility, navPlacement, page, position } = this;
      return getPopoverTriggerEvents({
        id: sharedState.navPopoverId,
        visibility: navVisibility,
        placement: navPlacement,
        modifiers: [
          { name: "flip", options: { fallbackPlacements: ["bottom"] } }
        ],
        data: { page, position },
        isInteractive: true,
        isRenderFn: true
      });
    },
    weekdayLabels() {
      return this.locale.getWeekdayDates().map((d) => this.format(d, this.masks.weekdays));
    }
  }
};
class AttributeStore {
  constructor(theme, locale, attrs) {
    this.theme = theme;
    this.locale = locale;
    this.map = {};
    this.refresh(attrs, true);
  }
  destroy() {
    this.theme = null;
    this.locale = null;
    this.map = {};
    this.list = [];
    this.pinAttr = null;
  }
  refresh(attrs, reset) {
    const map2 = {};
    const list = [];
    let pinAttr = null;
    const adds = [];
    const deletes = reset ? /* @__PURE__ */ new Set() : new Set(Object.keys(this.map));
    if (arrayHasItems(attrs)) {
      attrs.forEach((attr, i) => {
        if (!attr || !attr.dates)
          return;
        const key = attr.key ? attr.key.toString() : i.toString();
        const order = attr.order || 0;
        const hashcode = hash(JSON.stringify(attr));
        let exAttr = this.map[key];
        if (!reset && exAttr && exAttr.hashcode === hashcode) {
          deletes.delete(key);
        } else {
          exAttr = new Attribute(
            {
              key,
              order,
              hashcode,
              ...attr
            },
            this.theme,
            this.locale
          );
          adds.push(exAttr);
        }
        if (exAttr && exAttr.pinPage) {
          pinAttr = exAttr;
        }
        map2[key] = exAttr;
        list.push(exAttr);
      });
    }
    this.map = map2;
    this.list = list;
    this.pinAttr = pinAttr;
    return { adds, deletes: Array.from(deletes) };
  }
}
const addHorizontalSwipeHandler = (element, handler, { maxSwipeTime: maxSwipeTime2, minHorizontalSwipeDistance: minHorizontalSwipeDistance2, maxVerticalSwipeDistance: maxVerticalSwipeDistance2 }) => {
  if (!element || !element.addEventListener || !isFunction_1(handler)) {
    return null;
  }
  let startX = 0;
  let startY = 0;
  let startTime = null;
  let isSwiping = false;
  function touchStart(e) {
    const t = e.changedTouches[0];
    startX = t.screenX;
    startY = t.screenY;
    startTime = new Date().getTime();
    isSwiping = true;
  }
  function touchEnd(e) {
    if (!isSwiping)
      return;
    isSwiping = false;
    const t = e.changedTouches[0];
    const deltaX = t.screenX - startX;
    const deltaY = t.screenY - startY;
    const deltaTime = new Date().getTime() - startTime;
    if (deltaTime < maxSwipeTime2) {
      if (Math.abs(deltaX) >= minHorizontalSwipeDistance2 && Math.abs(deltaY) <= maxVerticalSwipeDistance2) {
        const arg = { toLeft: false, toRight: false };
        if (deltaX < 0) {
          arg.toLeft = true;
        } else {
          arg.toRight = true;
        }
        handler(arg);
      }
    }
  }
  on(element, "touchstart", touchStart, { passive: true });
  on(element, "touchend", touchEnd, { passive: true });
  return () => {
    off(element, "touchstart", touchStart);
    off(element, "touchend", touchEnd);
  };
};
const _sfc_main$3 = {
  name: "Calendar",
  emits: [
    "dayfocusin",
    "dayfocusout",
    "transition-start",
    "transition-end",
    "update:from-page",
    "update:to-page"
  ],
  render() {
    const panes = this.pages.map((page, i) => {
      const position = i + 1;
      const row = Math.ceil((i + 1) / this.columns);
      const rowFromEnd = this.rows - row + 1;
      const column = position % this.columns || this.columns;
      const columnFromEnd = this.columns - column + 1;
      return h(
        _sfc_main$4,
        {
          ...this.$attrs,
          key: page.key,
          attributes: this.store,
          page,
          position,
          row,
          rowFromEnd,
          column,
          columnFromEnd,
          titlePosition: this.titlePosition,
          canMove: this.canMove,
          "onUpdate:page": (e) => this.move(e, { position: i + 1 }),
          onDayfocusin: (e) => {
            this.lastFocusedDay = e;
            this.$emit("dayfocusin", e);
          },
          onDayfocusout: (e) => {
            this.lastFocusedDay = null;
            this.$emit("dayfocusout", e);
          }
        },
        this.$slots
      );
    });
    const getArrowButton = (isPrev) => {
      const click = () => this.move(isPrev ? -this.step_ : this.step_);
      const keydown = (e) => onSpaceOrEnter(e, click);
      const isDisabled = isPrev ? !this.canMovePrev : !this.canMoveNext;
      return h(
        "div",
        {
          class: [
            "vc-arrow",
            `is-${isPrev ? "left" : "right"}`,
            { "is-disabled": isDisabled }
          ],
          role: "button",
          onClick: click,
          onKeydown: keydown
        },
        [
          (isPrev ? this.safeSlot("header-left-button", { click }) : this.safeSlot("header-right-button", { click })) || h(SvgIcon, {
            name: isPrev ? "left-arrow" : "right-arrow"
          })
        ]
      );
    };
    const getNavPopover = () => h(
      _sfc_main$9,
      {
        id: this.sharedState.navPopoverId,
        contentClass: "vc-nav-popover-container",
        ref: "navPopover"
      },
      {
        default: ({ data: data2 }) => {
          const { position, page } = data2;
          return h(
            CalendarNav,
            {
              value: page,
              position,
              validator: (e) => this.canMove(e, { position }),
              onInput: (e) => this.move(e)
            },
            {
              ...this.$slots
            }
          );
        }
      }
    );
    const getDayPopover = () => h(
      _sfc_main$9,
      {
        id: this.sharedState.dayPopoverId,
        contentClass: "vc-day-popover-container"
      },
      {
        default: ({ data: day, updateLayout, hide }) => {
          const attributes = Object.values(day.attributes).filter(
            (a) => a.popover
          );
          const masks2 = this.$locale.masks;
          const format2 = this.formatDate;
          const dayTitle = format2(day.date, masks2.dayPopover);
          return this.safeSlot(
            "day-popover",
            {
              day,
              attributes,
              masks: masks2,
              format: format2,
              dayTitle,
              updateLayout,
              hide
            },
            h("div", [
              masks2.dayPopover && h(
                "div",
                {
                  class: ["vc-day-popover-header"]
                },
                [dayTitle]
              ),
              attributes.map(
                (attribute) => h(PopoverRow, {
                  key: attribute.key,
                  attribute
                })
              )
            ])
          );
        }
      }
    );
    return h(
      "div",
      {
        "data-helptext": "Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year",
        class: [
          "vc-container",
          `vc-${this.$theme.color}`,
          {
            "vc-is-expanded": this.isExpanded,
            "vc-is-dark": this.$theme.isDark
          }
        ],
        onKeydown: this.handleKeydown,
        onMouseup: (e) => e.preventDefault(),
        ref: "container"
      },
      [
        getNavPopover(),
        h(
          "div",
          {
            class: [
              "vc-pane-container",
              { "in-transition": this.inTransition }
            ]
          },
          [
            h(
              CustomTransition,
              {
                name: this.transitionName,
                "on-before-enter": () => {
                  this.inTransition = true;
                },
                "on-after-enter": () => {
                  this.inTransition = false;
                }
              },
              {
                default: () => h(
                  "div",
                  {
                    ...this.$attrs,
                    class: "vc-pane-layout",
                    style: {
                      gridTemplateColumns: `repeat(${this.columns}, 1fr)`
                    },
                    key: this.firstPage ? this.firstPage.key : ""
                  },
                  panes
                )
              }
            ),
            h(
              "div",
              {
                class: [`vc-arrows-container title-${this.titlePosition}`]
              },
              [getArrowButton(true), getArrowButton(false)]
            ),
            this.$slots.footer && this.$slots.footer()
          ]
        ),
        getDayPopover()
      ]
    );
  },
  mixins: [rootMixin, slotMixin],
  provide() {
    return {
      sharedState: this.sharedState
    };
  },
  props: {
    rows: {
      type: Number,
      default: 1
    },
    columns: {
      type: Number,
      default: 1
    },
    step: Number,
    titlePosition: {
      type: String,
      default: () => getDefault("titlePosition")
    },
    isExpanded: Boolean,
    fromDate: Date,
    toDate: Date,
    fromPage: Object,
    toPage: Object,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: [Object, Array],
    trimWeeks: Boolean,
    disablePageSwipe: Boolean
  },
  data() {
    return {
      pages: [],
      store: null,
      lastFocusedDay: null,
      focusableDay: new Date().getDate(),
      transitionName: "",
      inTransition: false,
      sharedState: {
        navPopoverId: createGuid(),
        dayPopoverId: createGuid(),
        theme: {},
        masks: {},
        locale: {}
      }
    };
  },
  computed: {
    firstPage() {
      return head_1(this.pages);
    },
    lastPage() {
      return last_1(this.pages);
    },
    minPage_() {
      return this.minPage || this.pageForDate(this.minDate);
    },
    maxPage_() {
      return this.maxPage || this.pageForDate(this.maxDate);
    },
    count() {
      return this.rows * this.columns;
    },
    step_() {
      return this.step || this.count;
    },
    canMovePrev() {
      return this.canMove(-this.step_);
    },
    canMoveNext() {
      return this.canMove(this.step_);
    }
  },
  watch: {
    $locale() {
      this.refreshLocale();
      this.refreshPages({ page: this.firstPage, ignoreCache: true });
      this.initStore();
    },
    $theme() {
      this.refreshTheme();
      this.initStore();
    },
    fromDate() {
      this.refreshPages();
    },
    fromPage(val) {
      const firstPage = this.pages && this.pages[0];
      if (pageIsEqualToPage(val, firstPage))
        return;
      this.refreshPages();
    },
    toPage(val) {
      const lastPage = this.pages && this.pages[this.pages.length - 1];
      if (pageIsEqualToPage(val, lastPage))
        return;
      this.refreshPages();
    },
    count() {
      this.refreshPages();
    },
    attributes: {
      handler(val) {
        const { adds, deletes } = this.store.refresh(val);
        this.refreshAttrs(this.pages, adds, deletes);
      },
      deep: true
    },
    pages(val) {
      this.refreshAttrs(val, this.store.list, null, true);
    },
    disabledAttribute() {
      this.refreshDisabledDays();
    },
    lastFocusedDay(val) {
      if (val) {
        this.focusableDay = val.day;
        this.refreshFocusableDays();
      }
    },
    inTransition(val) {
      if (val) {
        this.$emit("transition-start");
      } else {
        this.$emit("transition-end");
        if (this.transitionPromise) {
          this.transitionPromise.resolve(true);
          this.transitionPromise = null;
        }
      }
    }
  },
  created() {
    this.refreshLocale();
    this.refreshTheme();
    this.initStore();
    this.refreshPages();
  },
  mounted() {
    if (!this.disablePageSwipe) {
      this.removeHandlers = addHorizontalSwipeHandler(
        this.$refs.container,
        ({ toLeft, toRight }) => {
          if (toLeft) {
            this.moveNext();
          } else if (toRight) {
            this.movePrev();
          }
        },
        getDefault("touch")
      );
    }
  },
  beforeUnmount() {
    this.pages = [];
    this.store.destroy();
    this.store = null;
    this.sharedState = null;
    if (this.removeHandlers)
      this.removeHandlers();
  },
  methods: {
    refreshLocale() {
      this.sharedState.locale = this.$locale;
      this.sharedState.masks = this.$locale.masks;
    },
    refreshTheme() {
      this.sharedState.theme = this.$theme;
    },
    canMove(arg, opts = {}) {
      const page = this.firstPage && this.$locale.toPage(arg, this.firstPage);
      if (!page)
        return false;
      let { position } = opts;
      if (isNumber_1(arg))
        position = 1;
      if (!position) {
        if (pageIsBeforePage(page, this.firstPage)) {
          position = -1;
        } else if (pageIsAfterPage(page, this.lastPage)) {
          position = 1;
        } else {
          return true;
        }
      }
      Object.assign(
        opts,
        this.getTargetPageRange(page, {
          position,
          force: true
        })
      );
      return pageRangeToArray(opts.fromPage, opts.toPage).some(
        (p) => pageIsBetweenPages(p, this.minPage_, this.maxPage_)
      );
    },
    movePrev(opts) {
      return this.move(-this.step_, opts);
    },
    moveNext(opts) {
      return this.move(this.step_, opts);
    },
    move(arg, opts = {}) {
      const canMove = this.canMove(arg, opts);
      if (!opts.force && !canMove) {
        return Promise.reject(
          new Error(`Move target is disabled: ${JSON.stringify(opts)}`)
        );
      }
      this.$refs.navPopover.hide({ hideDelay: 0 });
      if (opts.fromPage && !pageIsEqualToPage(opts.fromPage, this.firstPage)) {
        return this.refreshPages({
          ...opts,
          page: opts.fromPage,
          position: 1,
          force: true
        });
      }
      return Promise.resolve(true);
    },
    focusDate(date, opts = {}) {
      return this.move(date, opts).then(() => {
        const focusableEl = this.$el.querySelector(
          `.id-${this.$locale.getDayId(date)}.in-month .vc-focusable`
        );
        if (focusableEl) {
          focusableEl.focus();
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
    },
    showPageRange(range, opts) {
      let fromPage;
      let toPage;
      if (isDate$1(range)) {
        fromPage = this.pageForDate(range);
      } else if (isObject(range)) {
        const { month, year } = range;
        const { from, to } = range;
        if (isNumber_1(month) && isNumber_1(year)) {
          fromPage = range;
        } else if (from || to) {
          fromPage = isDate$1(from) ? this.pageForDate(from) : from;
          toPage = isDate$1(to) ? this.pageForDate(to) : to;
        }
      } else {
        return Promise.reject(new Error("Invalid page range provided."));
      }
      const lastPage = this.lastPage;
      let page = fromPage;
      if (pageIsAfterPage(toPage, lastPage)) {
        page = addPages(toPage, -(this.pages.length - 1));
      }
      if (pageIsBeforePage(page, fromPage)) {
        page = fromPage;
      }
      return this.refreshPages({ ...opts, page });
    },
    getTargetPageRange(page, { position, force } = {}) {
      let fromPage = null;
      let toPage = null;
      if (pageIsValid(page)) {
        let pagesToAdd = 0;
        position = +position;
        if (!isNaN(position)) {
          pagesToAdd = position > 0 ? 1 - position : -(this.count + position);
        }
        fromPage = addPages(page, pagesToAdd);
      } else {
        fromPage = this.getDefaultInitialPage();
      }
      toPage = addPages(fromPage, this.count - 1);
      if (!force) {
        if (pageIsBeforePage(fromPage, this.minPage_)) {
          fromPage = this.minPage_;
        } else if (pageIsAfterPage(toPage, this.maxPage_)) {
          fromPage = addPages(this.maxPage_, 1 - this.count);
        }
        toPage = addPages(fromPage, this.count - 1);
      }
      return { fromPage, toPage };
    },
    getDefaultInitialPage() {
      let page = this.fromPage || this.pageForDate(this.fromDate);
      if (!pageIsValid(page)) {
        const toPage = this.toPage || this.pageForDate(this.toPage);
        if (pageIsValid(toPage)) {
          page = addPages(toPage, 1 - this.count);
        }
      }
      if (!pageIsValid(page)) {
        page = this.getPageForAttributes();
      }
      if (!pageIsValid(page)) {
        page = this.pageForThisMonth();
      }
      return page;
    },
    refreshPages({ page, position = 1, force, transition, ignoreCache } = {}) {
      return new Promise((resolve, reject) => {
        const { fromPage, toPage } = this.getTargetPageRange(page, {
          position,
          force
        });
        const pages = [];
        for (let i = 0; i < this.count; i++) {
          pages.push(this.buildPage(addPages(fromPage, i), ignoreCache));
        }
        this.refreshDisabledDays(pages);
        this.refreshFocusableDays(pages);
        this.transitionName = this.getPageTransition(
          this.pages[0],
          pages[0],
          transition
        );
        this.pages = pages;
        this.$emit("update:from-page", fromPage);
        this.$emit("update:to-page", toPage);
        if (this.transitionName && this.transitionName !== "none") {
          this.transitionPromise = {
            resolve,
            reject
          };
        } else {
          resolve(true);
        }
      });
    },
    refreshDisabledDays(pages) {
      this.getPageDays(pages).forEach((d) => {
        d.isDisabled = !!this.disabledAttribute && this.disabledAttribute.intersectsDay(d);
      });
    },
    refreshFocusableDays(pages) {
      this.getPageDays(pages).forEach((d) => {
        d.isFocusable = d.inMonth && d.day === this.focusableDay;
      });
    },
    getPageDays(pages = this.pages) {
      return pages.reduce((prev, curr) => prev.concat(curr.days), []);
    },
    getPageTransition(oldPage, newPage, transition = this.transition) {
      if (transition === "none")
        return transition;
      if (transition === "fade" || !transition && this.count > 1 || !pageIsValid(oldPage) || !pageIsValid(newPage)) {
        return "fade";
      }
      const movePrev = pageIsBeforePage(newPage, oldPage);
      if (transition === "slide-v") {
        return movePrev ? "slide-down" : "slide-up";
      }
      return movePrev ? "slide-right" : "slide-left";
    },
    getPageForAttributes() {
      let page = null;
      const attr = this.store.pinAttr;
      if (attr && attr.hasDates) {
        let [date] = attr.dates;
        date = date.start || date.date;
        page = this.pageForDate(date);
      }
      return page;
    },
    buildPage({ month, year }, ignoreCache) {
      console.log("hello page", month, year);
      let yearLabel = "";
      let shortYearLabel = "";
      let title2 = "";
      let shortMonthLabel = "";
      let monthLabel = "";
      let date = new Date(year, month - 1);
      if (this.$locale.id == "fa" && year > 1900) {
        const jalaliDate = date;
        yearLabel = format(jalaliDate, "yyyy");
        shortYearLabel = format(jalaliDate, "yy");
        title2 = format(date, "yyyy - MMMM");
        shortMonthLabel = format(jalaliDate, "MMM");
        monthLabel = format(jalaliDate, "MMMM");
      } else {
        yearLabel = this.$locale.format(date, "Y");
        shortYearLabel = this.$locale.format(date, "YY");
        title2 = this.$locale.format(date, this.$locale.masks.title);
        shortMonthLabel = this.$locale.format(date, "MMM");
        monthLabel = this.$locale.format(date, "MMMM");
      }
      const key = `${year.toString()}-${month.toString()}`;
      console.log("key", key);
      let page = this.pages.find((p) => p.key === key);
      if (!page || ignoreCache) {
        const monthComps = this.$locale.getMonthComps(month, year);
        const prevMonthComps = this.$locale.getPrevMonthComps(month, year);
        const nextMonthComps = this.$locale.getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          weeks: this.trimWeeks ? monthComps.weeks : 6,
          title: title2,
          shortMonthLabel,
          monthLabel,
          shortYearLabel,
          yearLabel,
          monthComps,
          prevMonthComps,
          nextMonthComps,
          canMove: (pg) => this.canMove(pg),
          move: (pg) => this.move(pg),
          moveThisMonth: () => this.moveThisMonth(),
          movePrevMonth: () => this.move(prevMonthComps),
          moveNextMonth: () => this.move(nextMonthComps),
          refresh: true
        };
        console.log(this.$locale.getCalendarDays(page));
        page.days = this.$locale.getCalendarDays(page);
      }
      return page;
    },
    initStore() {
      this.store = new AttributeStore(
        this.$theme,
        this.$locale,
        this.attributes
      );
      this.refreshAttrs(this.pages, this.store.list, [], true);
    },
    refreshAttrs(pages = [], adds = [], deletes = [], reset) {
      if (!arrayHasItems(pages))
        return;
      pages.forEach((p) => {
        p.days.forEach((d) => {
          let shouldRefresh = false;
          let map2 = {};
          if (reset) {
            shouldRefresh = true;
          } else if (hasAny(d.attributesMap, deletes)) {
            map2 = omit_1(d.attributesMap, deletes);
            shouldRefresh = true;
          } else {
            map2 = d.attributesMap || {};
          }
          adds.forEach((attr) => {
            const targetDate = attr.intersectsDay(d);
            if (targetDate) {
              const newAttr = {
                ...attr,
                targetDate
              };
              map2[attr.key] = newAttr;
              shouldRefresh = true;
            }
          });
          if (shouldRefresh) {
            d.attributesMap = map2;
            d.shouldRefresh = true;
          }
        });
      });
    },
    handleKeydown(e) {
      const day = this.lastFocusedDay;
      if (day != null) {
        day.event = e;
        this.handleDayKeydown(day);
      }
    },
    handleDayKeydown(day) {
      const { dateFromTime, event } = day;
      const date = dateFromTime(12);
      let newDate2 = null;
      switch (event.key) {
        case "ArrowLeft": {
          newDate2 = addDays$1(date, -1);
          break;
        }
        case "ArrowRight": {
          newDate2 = addDays$1(date, 1);
          break;
        }
        case "ArrowUp": {
          newDate2 = addDays$1(date, -7);
          break;
        }
        case "ArrowDown": {
          newDate2 = addDays$1(date, 7);
          break;
        }
        case "Home": {
          newDate2 = addDays$1(date, -day.weekdayPosition + 1);
          break;
        }
        case "End": {
          newDate2 = addDays$1(date, day.weekdayPositionFromEnd);
          break;
        }
        case "PageUp": {
          if (event.altKey) {
            newDate2 = addYears(date, -1);
          } else {
            newDate2 = addMonths(date, -1);
          }
          break;
        }
        case "PageDown": {
          if (event.altKey) {
            newDate2 = addYears(date, 1);
          } else {
            newDate2 = addMonths(date, 1);
          }
          break;
        }
      }
      if (newDate2) {
        event.preventDefault();
        this.focusDate(newDate2).catch();
      }
    }
  }
};
const _sfc_main$2 = {
  inheritAttrs: false,
  emits: ["update:modelValue"],
  props: {
    options: Array,
    modelValue: null
  }
};
const _hoisted_1$1 = { class: "vc-select" };
const _hoisted_2$1 = ["value"];
const _hoisted_3$1 = ["value", "disabled"];
const _hoisted_4$1 = /* @__PURE__ */ createElementVNode("div", { class: "vc-select-arrow" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20"
  }, [
    /* @__PURE__ */ createElementVNode("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" })
  ])
], -1);
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createElementVNode("select", mergeProps(_ctx.$attrs, {
      value: $props.modelValue,
      onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.value))
    }), [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.options, (option) => {
        return openBlock(), createElementBlock("option", {
          key: option.value,
          value: option.value,
          disabled: option.disabled
        }, toDisplayString(option.label), 9, _hoisted_3$1);
      }), 128))
    ], 16, _hoisted_2$1),
    _hoisted_4$1
  ]);
}
var TimeSelect = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
const _amOptions = [
  { value: 0, label: "12" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" }
];
const _pmOptions = [
  { value: 12, label: "12" },
  { value: 13, label: "1" },
  { value: 14, label: "2" },
  { value: 15, label: "3" },
  { value: 16, label: "4" },
  { value: 17, label: "5" },
  { value: 18, label: "6" },
  { value: 19, label: "7" },
  { value: 20, label: "8" },
  { value: 21, label: "9" },
  { value: 22, label: "10" },
  { value: 23, label: "11" }
];
const _sfc_main$1 = {
  name: "TimePicker",
  components: { TimeSelect },
  emits: ["update:modelValue"],
  props: {
    modelValue: { type: Object, required: true },
    locale: { type: Object, required: true },
    theme: { type: Object, required: true },
    is24hr: { type: Boolean, default: true },
    showBorder: Boolean,
    hourOptions: Array,
    minuteOptions: Array
  },
  computed: {
    date() {
      let date = this.locale.normalizeDate(this.modelValue);
      if (this.modelValue.hours === 24) {
        date = new Date(date.getTime() - 1);
      }
      return date;
    },
    hours: {
      get() {
        return this.modelValue.hours;
      },
      set(value) {
        this.updateValue(value, this.minutes);
      }
    },
    minutes: {
      get() {
        return this.modelValue.minutes;
      },
      set(value) {
        this.updateValue(this.hours, value);
      }
    },
    isAM: {
      get() {
        return this.modelValue.hours < 12;
      },
      set(value) {
        let hours = this.hours;
        if (value && hours >= 12) {
          hours -= 12;
        } else if (!value && hours < 12) {
          hours += 12;
        }
        this.updateValue(hours, this.minutes);
      }
    },
    amHourOptions() {
      return _amOptions.filter(
        (opt) => this.hourOptions.some((ho) => ho.value === opt.value)
      );
    },
    pmHourOptions() {
      return _pmOptions.filter(
        (opt) => this.hourOptions.some((ho) => ho.value === opt.value)
      );
    },
    hourOptions_() {
      if (this.is24hr)
        return this.hourOptions;
      if (this.isAM)
        return this.amHourOptions;
      return this.pmHourOptions;
    },
    amDisabled() {
      return !arrayHasItems(this.amHourOptions);
    },
    pmDisabled() {
      return !arrayHasItems(this.pmHourOptions);
    }
  },
  methods: {
    updateValue(hours, minutes = this.minutes) {
      if (hours !== this.hours || minutes !== this.minutes) {
        this.$emit("update:modelValue", {
          ...this.modelValue,
          hours,
          minutes,
          seconds: 0,
          milliseconds: 0
        });
      }
    }
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("div", null, [
  /* @__PURE__ */ createElementVNode("svg", {
    fill: "none",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    viewBox: "0 0 24 24",
    class: "vc-time-icon",
    stroke: "currentColor"
  }, [
    /* @__PURE__ */ createElementVNode("path", { d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
  ])
], -1);
const _hoisted_2 = { class: "vc-time-content" };
const _hoisted_3 = {
  key: 0,
  class: "vc-time-date"
};
const _hoisted_4 = { class: "vc-time-weekday" };
const _hoisted_5 = { class: "vc-time-month" };
const _hoisted_6 = { class: "vc-time-day" };
const _hoisted_7 = { class: "vc-time-year" };
const _hoisted_8 = { class: "vc-time-select" };
const _hoisted_9 = /* @__PURE__ */ createElementVNode("span", { style: { "margin": "0 4px" } }, ":", -1);
const _hoisted_10 = {
  key: 0,
  class: "vc-am-pm"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_time_select = resolveComponent("time-select");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["vc-time-picker", [{ "vc-invalid": !$props.modelValue.isValid, "vc-bordered": $props.showBorder }]])
  }, [
    _hoisted_1,
    createElementVNode("div", _hoisted_2, [
      $options.date ? (openBlock(), createElementBlock("div", _hoisted_3, [
        createElementVNode("span", _hoisted_4, toDisplayString($props.locale.format($options.date, "WWW")), 1),
        createElementVNode("span", _hoisted_5, toDisplayString($props.locale.format($options.date, "MMM")), 1),
        createElementVNode("span", _hoisted_6, toDisplayString($props.locale.format($options.date, "D")), 1),
        createElementVNode("span", _hoisted_7, toDisplayString($props.locale.format($options.date, "YYYY")), 1)
      ])) : createCommentVNode("", true),
      createElementVNode("div", _hoisted_8, [
        createVNode(_component_time_select, {
          modelValue: $options.hours,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.hours = $event),
          modelModifiers: { number: true },
          options: $options.hourOptions_
        }, null, 8, ["modelValue", "options"]),
        _hoisted_9,
        createVNode(_component_time_select, {
          modelValue: $options.minutes,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $options.minutes = $event),
          modelModifiers: { number: true },
          options: $props.minuteOptions
        }, null, 8, ["modelValue", "options"]),
        !$props.is24hr ? (openBlock(), createElementBlock("div", _hoisted_10, [
          createElementVNode("button", {
            class: normalizeClass({ active: $options.isAM, "vc-disabled": $options.amDisabled }),
            onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $options.isAM = true, ["prevent"])),
            type: "button"
          }, " AM ", 2),
          createElementVNode("button", {
            class: normalizeClass({ active: !$options.isAM, "vc-disabled": $options.pmDisabled }),
            onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $options.isAM = false, ["prevent"])),
            type: "button"
          }, " PM ", 2)
        ])) : createCommentVNode("", true)
      ])
    ])
  ], 2);
}
var TimePicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
const _baseConfig = {
  type: "auto",
  mask: "iso",
  timeAdjust: ""
};
const _config = [_baseConfig, _baseConfig];
const MODE = {
  DATE: "date",
  DATE_TIME: "datetime",
  TIME: "time"
};
const RANGE_PRIORITY = {
  NONE: 0,
  START: 1,
  END: 2,
  BOTH: 3
};
const _sfc_main = {
  name: "DatePicker",
  emits: [
    "update:modelValue",
    "drag",
    "dayclick",
    "daykeydown",
    "popover-will-show",
    "popover-did-show",
    "popover-will-hide",
    "popover-did-hide"
  ],
  render() {
    const footer = (wrap, wrapperEl) => {
      if (!this.$slots.footer)
        return wrap;
      const children = [wrap, this.$slots.footer()];
      return wrapperEl ? h(wrapperEl, children) : children;
    };
    const timePicker = () => {
      if (!this.dateParts)
        return null;
      const parts = this.isRange ? this.dateParts : [this.dateParts[0]];
      return h(
        "div",
        {},
        {
          ...this.$slots,
          default: () => parts.map((dp, idx) => {
            const hourOptions2 = this.$locale.getHourOptions(
              this.modelConfig_[idx].validHours,
              dp
            );
            const minuteOptions = this.$locale.getMinuteOptions(
              this.modelConfig_[idx].minuteIncrement,
              dp
            );
            return h(TimePicker, {
              modelValue: dp,
              locale: this.$locale,
              theme: this.$theme,
              is24hr: this.is24hr,
              showBorder: !this.isTime,
              isDisabled: this.isDateTime && !dp.isValid || this.isDragging,
              hourOptions: hourOptions2,
              minuteOptions,
              "onUpdate:modelValue": (p) => this.onTimeInput(p, idx === 0)
            });
          })
        }
      );
    };
    const calendar = () => h(
      _sfc_main$3,
      {
        ...this.$attrs,
        attributes: this.attributes_,
        theme: this.$theme,
        locale: this.$locale,
        minDate: this.minDateExact || this.minDate,
        maxDate: this.maxDateExact || this.maxDate,
        disabledDates: this.disabledDates,
        availableDates: this.availableDates,
        onDayclick: this.onDayClick,
        onDaykeydown: this.onDayKeydown,
        onDaymouseenter: this.onDayMouseEnter,
        ref: "calendar"
      },
      {
        ...this.$slots,
        footer: () => this.isDateTime ? footer(timePicker()) : footer()
      }
    );
    const content = () => {
      if (this.isTime) {
        return h(
          "div",
          {
            class: [
              "vc-container",
              `vc-${this.$theme.color}`,
              { "vc-is-dark": this.$theme.isDark }
            ]
          },
          footer(timePicker(), "div")
        );
      }
      return calendar();
    };
    return this.$slots.default ? h("div", [
      this.$slots.default(this.slotArgs),
      h(
        _sfc_main$9,
        {
          id: this.datePickerPopoverId,
          placement: "bottom-start",
          contentClass: `vc-container${this.isDark ? " vc-is-dark" : ""}`,
          "on-before-show": (e) => this.$emit("popover-will-show", e),
          "on-after-show": (e) => this.$emit("popover-did-show", e),
          "on-before-hide": (e) => this.$emit("popover-will-hide", e),
          "on-after-hide": (e) => this.$emit("popover-did-hide", e),
          ref: "popover"
        },
        {
          default: content
        }
      )
    ]) : content();
  },
  mixins: [rootMixin],
  props: {
    mode: { type: String, default: MODE.DATE },
    modelValue: { type: null, required: true },
    modelConfig: { type: Object, default: () => ({}) },
    is24hr: Boolean,
    minuteIncrement: Number,
    isRequired: Boolean,
    isRange: Boolean,
    updateOnInput: {
      type: Boolean,
      default: () => getDefault("datePicker.updateOnInput")
    },
    inputDebounce: {
      type: Number,
      default: () => getDefault("datePicker.inputDebounce")
    },
    popover: { type: Object, default: () => ({}) },
    dragAttribute: Object,
    selectAttribute: Object,
    attributes: Array,
    validHours: [Object, Array, Function]
  },
  data() {
    return {
      value_: null,
      dateParts: null,
      activeDate: "",
      dragValue: null,
      inputValues: ["", ""],
      updateTimeout: null,
      watchValue: true,
      datePickerPopoverId: createGuid()
    };
  },
  computed: {
    isDate() {
      return this.mode.toLowerCase() === MODE.DATE;
    },
    isDateTime() {
      return this.mode.toLowerCase() === MODE.DATE_TIME;
    },
    isTime() {
      return this.mode.toLowerCase() === MODE.TIME;
    },
    isDragging() {
      return !!this.dragValue;
    },
    modelConfig_() {
      return this.normalizeConfig(this.modelConfig, _config);
    },
    inputMask() {
      const masks2 = this.$locale.masks;
      if (this.isTime) {
        return this.is24hr ? masks2.inputTime24hr : masks2.inputTime;
      }
      if (this.isDateTime) {
        return this.is24hr ? masks2.inputDateTime24hr : masks2.inputDateTime;
      }
      return this.$locale.masks.input;
    },
    inputMaskHasTime() {
      return /[Hh]/g.test(this.inputMask);
    },
    inputMaskHasDate() {
      return /[dD]{1,2}|Do|W{1,4}|M{1,4}|YY(?:YY)?/g.test(this.inputMask);
    },
    inputMaskPatch() {
      if (this.inputMaskHasTime && this.inputMaskHasDate) {
        return PATCH.DATE_TIME;
      }
      if (this.inputMaskHasDate)
        return PATCH.DATE;
      if (this.inputMaskHasTime)
        return PATCH.TIME;
      return void 0;
    },
    slotArgs() {
      const {
        isRange,
        isDragging,
        updateValue,
        showPopover: showPopover2,
        hidePopover: hidePopover2,
        togglePopover: togglePopover2
      } = this;
      const inputValue = isRange ? {
        start: this.inputValues[0],
        end: this.inputValues[1]
      } : this.inputValues[0];
      const events = [true, false].map((isStart) => ({
        input: this.onInputInput(isStart),
        change: this.onInputChange(isStart),
        keyup: this.onInputKeyup,
        ...getPopoverTriggerEvents({
          ...this.popover_,
          id: this.datePickerPopoverId,
          callback: (e) => {
            if (e.action === "show" && e.completed) {
              this.onInputShow(isStart);
            }
          }
        })
      }));
      const inputEvents = isRange ? {
        start: events[0],
        end: events[1]
      } : events[0];
      return {
        inputValue,
        inputEvents,
        isDragging,
        updateValue,
        showPopover: showPopover2,
        hidePopover: hidePopover2,
        togglePopover: togglePopover2,
        getPopoverTriggerEvents
      };
    },
    popover_() {
      return defaultsDeep_1(this.popover, getDefault("datePicker.popover"));
    },
    selectAttribute_() {
      if (!this.hasValue(this.value_))
        return null;
      const attribute = {
        key: "select-drag",
        ...this.selectAttribute,
        dates: this.value_,
        pinPage: true
      };
      const { dot, bar, highlight, content } = attribute;
      if (!dot && !bar && !highlight && !content) {
        attribute.highlight = true;
      }
      return attribute;
    },
    dragAttribute_() {
      if (!this.isRange || !this.hasValue(this.dragValue)) {
        return null;
      }
      const attribute = {
        key: "select-drag",
        ...this.dragAttribute,
        dates: this.dragValue
      };
      const { dot, bar, highlight, content } = attribute;
      if (!dot && !bar && !highlight && !content) {
        attribute.highlight = {
          startEnd: {
            fillMode: "outline"
          }
        };
      }
      return attribute;
    },
    attributes_() {
      const attrs = isArrayLikeObject_1(this.attributes) ? [...this.attributes] : [];
      if (this.dragAttribute_) {
        attrs.push(this.dragAttribute_);
      } else if (this.selectAttribute_) {
        attrs.push(this.selectAttribute_);
      }
      return attrs;
    }
  },
  watch: {
    inputMask() {
      this.formatInput();
    },
    modelValue(val) {
      if (!this.watchValue)
        return;
      this.forceUpdateValue(val, {
        config: this.modelConfig_,
        formatInput: true,
        hidePopover: false
      });
    },
    value_() {
      this.refreshDateParts();
    },
    dragValue() {
      this.refreshDateParts();
    },
    timezone() {
      this.refreshDateParts();
      this.forceUpdateValue(this.value_, { formatInput: true });
    }
  },
  created() {
    this.value_ = this.normalizeValue(
      this.modelValue,
      this.modelConfig_,
      PATCH.DATE_TIME,
      RANGE_PRIORITY.BOTH
    );
    this.forceUpdateValue(this.modelValue, {
      config: this.modelConfig_,
      formatInput: true,
      hidePopover: false
    });
    this.refreshDateParts();
  },
  mounted() {
    on(document, "keydown", this.onDocumentKeyDown);
    on(document, "click", this.onDocumentClick);
  },
  beforeUnmount() {
    off(document, "keydown", this.onDocumentKeyDown);
    off(document, "click", this.onDocumentClick);
  },
  methods: {
    getDateParts(date) {
      return this.$locale.getDateParts(date);
    },
    getDateFromParts(parts) {
      return this.$locale.getDateFromParts(parts);
    },
    refreshDateParts() {
      const value = this.dragValue || this.value_;
      const dateParts = [];
      if (this.isRange) {
        if (value && value.start) {
          dateParts.push(this.getDateParts(value.start));
        } else {
          dateParts.push({});
        }
        if (value && value.end) {
          dateParts.push(this.getDateParts(value.end));
        } else {
          dateParts.push({});
        }
      } else if (value) {
        dateParts.push(this.getDateParts(value));
      } else {
        dateParts.push({});
      }
      this.$nextTick(() => this.dateParts = dateParts);
    },
    onDocumentKeyDown(e) {
      if (this.dragValue && e.key === "Escape") {
        this.dragValue = null;
      }
    },
    onDocumentClick(e) {
      if (document.body.contains(e.target) && !elementContains(this.$el, e.target)) {
        this.dragValue = null;
        this.formatInput();
      }
    },
    onDayClick(day) {
      this.handleDayClick(day);
      this.$emit("dayclick", day);
    },
    onDayKeydown(day) {
      switch (day.event.key) {
        case " ":
        case "Enter": {
          this.handleDayClick(day);
          day.event.preventDefault();
          break;
        }
        case "Escape": {
          this.hidePopover();
        }
      }
      this.$emit("daykeydown", day);
    },
    handleDayClick(day) {
      const { keepVisibleOnInput, visibility } = this.popover_;
      const opts = {
        patch: PATCH.DATE,
        adjustTime: true,
        formatInput: true,
        hidePopover: this.isDate && !keepVisibleOnInput && visibility !== "visible"
      };
      if (this.isRange) {
        if (!this.isDragging) {
          this.dragTrackingValue = { ...day.range };
        } else {
          this.dragTrackingValue.end = day.date;
        }
        opts.isDragging = !this.isDragging;
        opts.rangePriority = opts.isDragging ? RANGE_PRIORITY.NONE : RANGE_PRIORITY.BOTH;
        opts.hidePopover = opts.hidePopover && !opts.isDragging;
        this.updateValue(this.dragTrackingValue, opts);
      } else {
        opts.clearIfEqual = !this.isRequired;
        if (this.$locale.id == "fa") {
          let date_to_edit = day.date;
          let date_1 = new Date(date_to_edit).toLocaleDateString();
          let day_data = date_1.split("/");
          let day_1 = day_data[1];
          let month_1 = day_data[0];
          let year_1 = day_data[2];
          year_1 = year_1 - 621;
          let month_dic = {
            "4": 1,
            "5": 2,
            "6": 3,
            "7": 4,
            "8": 5,
            "9": 6,
            "10": 7,
            "11": 8,
            "12": 9,
            "1": 10,
            "2": 11,
            "3": 12
          };
          month_1 = month_dic[month_1];
          date_1 = year_1 + "-" + month_1 + "-" + day_1;
          console.log(date_1);
          let date_2 = new momentJalaali(date_1, "jYYYY-jMM-jDD").format("YYYY-MM-DD");
          console.log(date_2);
          day.date = date_2;
          day.shamsi = date_1;
          day.real_date = date_2;
        }
        this.updateValue(day.date, opts, day.shamsi);
      }
    },
    onDayMouseEnter(day) {
      if (!this.isDragging)
        return;
      this.dragTrackingValue.end = day.date;
      this.updateValue(this.dragTrackingValue, {
        patch: PATCH.DATE,
        adjustTime: true,
        formatInput: true,
        hidePriority: false,
        rangePriority: RANGE_PRIORITY.NONE
      });
    },
    onTimeInput(parts, isStart) {
      let value = null;
      if (this.isRange) {
        const start = isStart ? parts : this.dateParts[0];
        const end = isStart ? this.dateParts[1] : parts;
        value = { start, end };
      } else {
        value = parts;
      }
      this.updateValue(value, {
        patch: PATCH.TIME,
        rangePriority: isStart ? RANGE_PRIORITY.START : RANGE_PRIORITY.END
      }).then(() => this.adjustPageRange(isStart));
    },
    onInputInput(isStart) {
      return (e) => {
        if (!this.updateOnInput)
          return;
        this.onInputUpdate(e.target.value, isStart, {
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce
        });
      };
    },
    onInputChange(isStart) {
      return (e) => {
        this.onInputUpdate(e.target.value, isStart, {
          formatInput: true,
          hidePopover: false
        });
      };
    },
    onInputUpdate(inputValue, isStart, opts) {
      this.inputValues.splice(isStart ? 0 : 1, 1, inputValue);
      const value = this.isRange ? {
        start: this.inputValues[0],
        end: this.inputValues[1] || this.inputValues[0]
      } : inputValue;
      const config = {
        type: "string",
        mask: this.inputMask
      };
      this.updateValue(value, {
        ...opts,
        config,
        patch: this.inputMaskPatch,
        rangePriority: isStart ? RANGE_PRIORITY.START : RANGE_PRIORITY.END
      }).then(() => this.adjustPageRange(isStart));
    },
    onInputShow(isStart) {
      this.adjustPageRange(isStart);
    },
    onInputKeyup(e) {
      if (e.key !== "Escape")
        return;
      this.updateValue(this.value_, {
        formatInput: true,
        hidePopover: true
      });
    },
    updateValue(value, opts = {}, shamsi_date) {
      clearTimeout(this.updateTimeout);
      return new Promise((resolve) => {
        const { debounce, ...args } = opts;
        if (debounce > 0) {
          this.updateTimeout = setTimeout(() => {
            this.forceUpdateValue(value, args, shamsi_date);
            resolve(this.value_);
          }, debounce);
        } else {
          this.forceUpdateValue(value, args, shamsi_date);
          resolve(this.value_);
        }
      });
    },
    normalizeConfig(config, baseConfig = this.modelConfig_) {
      config = isArrayLikeObject_1(config) ? config : [config.start || config, config.end || config];
      return baseConfig.map((b, i) => ({
        validHours: this.validHours,
        minuteIncrement: this.minuteIncrement,
        ...b,
        ...config[i]
      }));
    },
    forceUpdateValue(value, {
      config = this.modelConfig_,
      patch = PATCH.DATE_TIME,
      clearIfEqual = false,
      formatInput = true,
      hidePopover: hidePopover2 = false,
      isDragging = this.isDragging,
      rangePriority = RANGE_PRIORITY.BOTH
    } = {}, shamsi_date) {
      config = this.normalizeConfig(config);
      let normalizedValue = this.normalizeValue(
        value,
        config,
        patch,
        rangePriority
      );
      if (!normalizedValue && this.isRequired) {
        normalizedValue = this.value_;
      }
      normalizedValue = this.adjustTimeForValue(normalizedValue, config);
      const isDisabled = this.valueIsDisabled(normalizedValue);
      if (isDisabled) {
        if (isDragging)
          return;
        normalizedValue = this.value_;
        hidePopover2 = false;
      }
      const valueKey = isDragging ? "dragValue" : "value_";
      let valueChanged = !this.valuesAreEqual(this[valueKey], normalizedValue);
      if (!isDisabled && !valueChanged && clearIfEqual) {
        normalizedValue = null;
        valueChanged = true;
      }
      if (valueChanged) {
        this[valueKey] = normalizedValue;
        if (!isDragging)
          this.dragValue = null;
        const denormalizedValue = this.denormalizeValue(normalizedValue);
        const event = this.isDragging ? "drag" : "update:modelValue";
        this.watchValue = false;
        this.$emit(event, denormalizedValue);
        this.$nextTick(() => this.watchValue = true);
      }
      if (hidePopover2)
        this.hidePopover();
      if (formatInput)
        this.formatInput();
    },
    hasValue(value) {
      if (this.isRange) {
        return isObject(value) && !!value.start && !!value.end;
      }
      return !!value;
    },
    normalizeValue(value, config, patch, rangePriority) {
      if (!this.hasValue(value))
        return null;
      if (this.isRange) {
        const result = {};
        const start = value.start > value.end ? value.end : value.start;
        result.start = this.normalizeDate(start, {
          ...config[0],
          fillDate: this.value_ && this.value_.start || config[0].fillDate,
          patch
        });
        const end = value.start > value.end ? value.start : value.end;
        result.end = this.normalizeDate(end, {
          ...config[1],
          fillDate: this.value_ && this.value_.end || config[1].fillDate,
          patch
        });
        return this.sortRange(result, rangePriority);
      }
      return this.normalizeDate(value, {
        ...config[0],
        fillDate: this.value_ || config[0].fillDate,
        patch
      });
    },
    adjustTimeForValue(value, config) {
      if (!this.hasValue(value))
        return null;
      if (this.isRange) {
        return {
          start: this.$locale.adjustTimeForDate(value.start, config[0]),
          end: this.$locale.adjustTimeForDate(value.end, config[1])
        };
      }
      return this.$locale.adjustTimeForDate(value, config[0]);
    },
    sortRange(range, priority = RANGE_PRIORITY.NONE) {
      const { start, end } = range;
      if (start > end) {
        switch (priority) {
          case RANGE_PRIORITY.START:
            return { start, end: start };
          case RANGE_PRIORITY.END:
            return { start: end, end };
          case RANGE_PRIORITY.BOTH:
            return { start: end, end: start };
        }
      }
      return { start, end };
    },
    denormalizeValue(value, config = this.modelConfig_) {
      if (this.isRange) {
        if (!this.hasValue(value))
          return null;
        return {
          start: this.$locale.denormalizeDate(value.start, config[0]),
          end: this.$locale.denormalizeDate(value.end, config[1])
        };
      }
      return this.$locale.denormalizeDate(value, config[0]);
    },
    valuesAreEqual(a, b) {
      if (this.isRange) {
        const aHasValue = this.hasValue(a);
        const bHasValue = this.hasValue(b);
        if (!aHasValue && !bHasValue)
          return true;
        if (aHasValue !== bHasValue)
          return false;
        return datesAreEqual(a.start, b.start) && datesAreEqual(a.end, b.end);
      }
      return datesAreEqual(a, b);
    },
    valueIsDisabled(value) {
      return this.hasValue(value) && this.disabledAttribute && this.disabledAttribute.intersectsDate(value);
    },
    formatInput() {
      this.$nextTick(() => {
        const config = this.normalizeConfig({
          type: "string",
          mask: this.inputMask
        });
        const value = this.denormalizeValue(
          this.dragValue || this.value_,
          config
        );
        if (this.isRange) {
          this.inputValues = [value && value.start, value && value.end];
        } else {
          this.inputValues = [value, ""];
        }
      });
    },
    showPopover(opts = {}) {
      showPopover({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId
      });
    },
    hidePopover(opts = {}) {
      hidePopover({
        hideDelay: 10,
        ...this.showPopover_,
        ...opts,
        id: this.datePickerPopoverId
      });
    },
    togglePopover(opts) {
      togglePopover({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId
      });
    },
    adjustPageRange(isStart) {
      this.$nextTick(() => {
        const calendar = this.$refs.calendar;
        const page = this.getPageForValue(isStart);
        const position = isStart ? 1 : -1;
        if (page && calendar && !pageIsBetweenPages(page, calendar.firstPage, calendar.lastPage)) {
          calendar.move(page, {
            position,
            transition: "fade"
          });
        }
      });
    },
    getPageForValue(isStart) {
      if (this.hasValue(this.value_)) {
        return this.pageForDate(
          this.isRange ? this.value_[isStart ? "start" : "end"] : this.value_
        );
      }
      return null;
    },
    move(args, opts) {
      if (this.$refs.calendar) {
        return this.$refs.calendar.move(args, opts);
      }
      return Promise.reject(
        new Error("Navigation disabled while calendar is not yet displayed")
      );
    },
    focusDate(date, opts) {
      if (this.$refs.calendar) {
        return this.$refs.calendar.focusDate(date, opts);
      }
      return Promise.reject(
        new Error("Navigation disabled while calendar is not yet displayed")
      );
    }
  }
};
var components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Calendar: _sfc_main$3,
  DatePicker: _sfc_main,
  Popover: _sfc_main$9,
  PopoverRow
}, Symbol.toStringTag, { value: "Module" }));
function buildMediaQuery(screens) {
  if (isString_1(screens)) {
    screens = { min: screens };
  }
  if (!isArrayLikeObject_1(screens)) {
    screens = [screens];
  }
  return screens.map((screen) => {
    if (has(screen, "raw")) {
      return screen.raw;
    }
    return map_1(screen, (value, feature) => {
      feature = get_1(
        {
          min: "min-width",
          max: "max-width"
        },
        feature,
        feature
      );
      return `(${feature}: ${value})`;
    }).join(" and ");
  }).join(", ");
}
var screensPlugin = {
  install: (app, screens) => {
    screens = defaultsDeep_1(
      screens,
      window && window.__screens__,
      defaultScreens
    );
    let shouldRefreshQueries = true;
    const state2 = reactive({
      matches: [],
      queries: []
    });
    const refreshMatches = () => {
      state2.matches = toPairs_1(state2.queries).filter((p) => p[1].matches).map((p) => p[0]);
    };
    const refreshQueries = () => {
      if (!shouldRefreshQueries || !window || !window.matchMedia)
        return;
      state2.queries = mapValues_1(screens, (v) => {
        const query = window.matchMedia(buildMediaQuery(v));
        if (isFunction_1(query.addEventListener)) {
          query.addEventListener("change", refreshMatches);
        } else {
          query.addListener(refreshMatches);
        }
        return query;
      });
      shouldRefreshQueries = false;
      refreshMatches();
    };
    app.mixin({
      mounted() {
        refreshQueries();
      },
      computed: {
        $screens() {
          return (config, def) => state2.matches.reduce(
            (prev, curr) => has(config, curr) ? config[curr] : prev,
            isUndefined_1(def) ? config.default : def
          );
        }
      }
    });
  }
};
var setup = (app, defaults2) => {
  const { screens } = setupDefaults(app, defaults2);
  app.use(screensPlugin, screens);
};
var main = "";
const install = (app, defaults2 = {}) => {
  app.use(setup, defaults2);
  const prefix = app.config.globalProperties.$VCalendar.componentPrefix;
  for (const componentKey in components) {
    const component = components[componentKey];
    app.component(`${prefix}${component.name}`, component);
  }
};
var index = { install };
export { _sfc_main$3 as Calendar, _sfc_main as DatePicker, _sfc_main$9 as Popover, PopoverRow, screensPlugin as Screens, setup as SetupCalendar, index as default };
