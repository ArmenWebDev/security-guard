!function (global) {
    var ym = {
        project: {preload: [], namespace: "", jsonpPrefix: "", loadLimit: 500},
        ns: {},
        env: {},
        envCallbacks: []
    };
    !function () {
        var e = {exports: {}}, t = e.exports;
        !function (n) {
            var r, o = {NOT_RESOLVED: "NOT_RESOLVED", IN_RESOLVING: "IN_RESOLVING", RESOLVED: "RESOLVED"},
                i = function () {
                    var e = {trackCircularDependencies: !0, allowMultipleDeclarations: !0}, t = {}, p = !1, m = [],
                        h = function (e, n, i) {
                            i || (i = n, n = []);
                            var s = t[e];
                            s || (s = t[e] = {name: e, decl: r}), s.decl = {
                                name: e,
                                prev: s.decl,
                                fn: i,
                                state: o.NOT_RESOLVED,
                                deps: n,
                                dependents: [],
                                exports: r
                            }
                        }, v = function (e, t, r) {
                            "string" == typeof e && (e = [e]), p || (p = !0, d(b)), m.push({
                                deps: e, cb: function (e, o) {
                                    o ? (r || s)(o) : t.apply(n, e)
                                }
                            })
                        }, y = function (e) {
                            var n = t[e];
                            return n ? o[n.decl.state] : "NOT_DEFINED"
                        }, g = function (e) {
                            var n = t[e];
                            return n ? n.decl.deps : null
                        }, _ = function (e) {
                            return !!t[e]
                        }, E = function (t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }, b = function () {
                            p = !1, w()
                        }, w = function () {
                            var e, t = m, n = 0;
                            for (m = []; e = t[n++];) x(null, e.deps, [], e.cb)
                        }, x = function (e, n, r, o) {
                            var i = n.length;
                            i || o([]);
                            for (var s, u, c = [], l = function (e, t) {
                                if (t) return void o(null, t);
                                if (!--i) {
                                    for (var n, r = [], s = 0; n = c[s++];) r.push(n.exports);
                                    o(r)
                                }
                            }, f = 0, d = i; d > f;) {
                                if (s = n[f++], "string" == typeof s) {
                                    if (!t[s]) return void o(null, a(s, e));
                                    u = t[s].decl
                                } else u = s;
                                c.push(u), k(u, r, l)
                            }
                        }, k = function (t, r, i) {
                            if (t.state === o.RESOLVED) return void i(t.exports);
                            if (t.state === o.IN_RESOLVING) return void (e.trackCircularDependencies && f(t, r) ? i(null, u(t, r)) : t.dependents.push(i));
                            if (t.dependents.push(i), t.prev && !e.allowMultipleDeclarations) return void C(t, l(t));
                            e.trackCircularDependencies && (r = r.slice()).push(t);
                            var s = !1, a = t.prev ? t.deps.concat([t.prev]) : t.deps;
                            t.state = o.IN_RESOLVING, x(t, a, r, function (e, r) {
                                return r ? void C(t, r) : (e.unshift(function (e, n) {
                                    return s ? void i(null, c(t)) : (s = !0, void (n ? C(t, n) : j(t, e)))
                                }), void t.fn.apply({name: t.name, deps: t.deps, global: n}, e))
                            })
                        }, j = function (e, t) {
                            e.exports = t, e.state = o.RESOLVED;
                            for (var n, i = 0; n = e.dependents[i++];) n(t);
                            e.dependents = r
                        }, C = function (e, t) {
                            e.state = o.NOT_RESOLVED;
                            for (var n, r = 0; n = e.dependents[r++];) n(null, t);
                            e.dependents = []
                        };
                    return {
                        create: i,
                        define: h,
                        require: v,
                        getState: y,
                        getDependencies: g,
                        isDefined: _,
                        setOptions: E,
                        flush: b,
                        nextTick: d
                    }
                }, s = function (e) {
                    d(function () {
                        throw e
                    })
                }, a = function (e, t) {
                    return Error(t ? 'Module "' + t.name + '": can\'t resolve dependence "' + e + '"' : 'Required module "' + e + "\" can't be resolved")
                }, u = function (e, t) {
                    for (var n, r = [], o = 0; n = t[o++];) r.push(n.name);
                    return r.push(e.name), Error('Circular dependence has been detected: "' + r.join(" -> ") + '"')
                }, c = function (e) {
                    return Error('Declaration of module "' + e.name + '" has already been provided')
                }, l = function (e) {
                    return Error('Multiple declarations of module "' + e.name + '" have been detected')
                }, f = function (e, t) {
                    for (var n, r = 0; n = t[r++];) if (e === n) return !0;
                    return !1
                }, d = function () {
                    var e = [], t = function (t) {
                        return 1 === e.push(t)
                    }, r = function () {
                        var t = e, n = 0, r = e.length;
                        for (e = []; r > n;) t[n++]()
                    };
                    if ("object" == typeof process && process.nextTick) return function (e) {
                        t(e) && process.nextTick(r)
                    };
                    if (n.setImmediate) return function (e) {
                        t(e) && n.setImmediate(r)
                    };
                    if (n.postMessage && !n.opera) {
                        var o = !0;
                        if (n.attachEvent) {
                            var i = function () {
                                o = !1
                            };
                            n.attachEvent("onmessage", i), n.postMessage("__checkAsync", "*"), n.detachEvent("onmessage", i)
                        }
                        if (o) {
                            var s = "__modules" + +new Date, a = function (e) {
                                e.data === s && (e.stopPropagation && e.stopPropagation(), r())
                            };
                            return n.addEventListener ? n.addEventListener("message", a, !0) : n.attachEvent("onmessage", a), function (e) {
                                t(e) && n.postMessage(s, "*")
                            }
                        }
                    }
                    var u = n.document;
                    if ("onreadystatechange" in u.createElement("script")) {
                        var c = u.getElementsByTagName("head")[0], l = function () {
                            var e = u.createElement("script");
                            e.onreadystatechange = function () {
                                e.parentNode.removeChild(e), e = e.onreadystatechange = null, r()
                            }, c.appendChild(e)
                        };
                        return function (e) {
                            t(e) && l()
                        }
                    }
                    return function (e) {
                        t(e) && setTimeout(r, 0)
                    }
                }();
            "object" == typeof t ? e.exports = i() : n.modules = i()
        }(this), ym.modules = e.exports
    }(), ym.modules.setOptions({
        trackCircularDependencies: !0,
        allowMultipleDeclarations: !1
    }), ym.ns.modules = ym.modules, function () {
        {
            var e, t, n = {exports: {}};
            n.exports
        }
        !function (r) {
            var o, i = function () {
                var e = [], t = function (t) {
                    return 1 === e.push(t)
                }, n = function () {
                    var t = e, n = 0, r = e.length;
                    for (e = []; r > n;) t[n++]()
                };
                if ("function" == typeof setImmediate) return function (e) {
                    t(e) && setImmediate(n)
                };
                if ("object" == typeof process && process.nextTick) return function (e) {
                    t(e) && process.nextTick(n)
                };
                if (r.postMessage) {
                    var o = !0;
                    if (r.attachEvent) {
                        var i = function () {
                            o = !1
                        };
                        r.attachEvent("onmessage", i), r.postMessage("__checkAsync", "*"), r.detachEvent("onmessage", i)
                    }
                    if (o) {
                        var s = "__promise" + +new Date, a = function (e) {
                            e.data === s && (e.stopPropagation && e.stopPropagation(), n())
                        };
                        return r.addEventListener ? r.addEventListener("message", a, !0) : r.attachEvent("onmessage", a), function (e) {
                            t(e) && r.postMessage(s, "*")
                        }
                    }
                }
                var u = r.document;
                if ("onreadystatechange" in u.createElement("script")) {
                    var c = function () {
                        var e = u.createElement("script");
                        e.onreadystatechange = function () {
                            e.parentNode.removeChild(e), e = e.onreadystatechange = null, n()
                        }, (u.documentElement || u.body).appendChild(e)
                    };
                    return function (e) {
                        t(e) && c()
                    }
                }
                return function (e) {
                    t(e) && setTimeout(n, 0)
                }
            }(), s = function (e, t, n) {
                if (b.debug) n ? e.call(n) : e(); else try {
                    n ? e.call(n) : e()
                } catch (r) {
                    return n ? t.call(n, r) : t(r), !1
                }
                return !0
            }, a = function (e) {
                i(function () {
                    throw e
                })
            }, u = function (e) {
                return "function" == typeof e
            }, c = function (e) {
                return null !== e && "object" == typeof e
            }, l = Object.prototype.toString, f = Array.isArray || function (e) {
                return "[object Array]" === l.call(e)
            }, d = function (e) {
                for (var t = [], n = 0, r = e.length; r > n;) t.push(n++);
                return t
            }, p = Object.keys || function (e) {
                var t = [];
                for (var n in e) e.hasOwnProperty(n) && t.push(n);
                return t
            }, m = function (e) {
                var t = function (t) {
                    this.name = e, this.message = t
                };
                return t.prototype = new Error, t
            }, h = function (e, t) {
                return function (n) {
                    e.call(this, n, t)
                }
            }, v = function () {
                this._promise = new g
            };
            v.prototype = {
                promise: function () {
                    return this._promise
                }, resolve: function (e) {
                    this._promise.isResolved() || this._promise._resolve(e)
                }, reject: function (e) {
                    this._promise.isResolved() || (b.isPromise(e) ? (e = e.then(function (e) {
                        var t = b.defer();
                        return t.reject(e), t.promise()
                    }), this._promise._resolve(e)) : this._promise._reject(e))
                }, notify: function (e) {
                    this._promise.isResolved() || this._promise._notify(e)
                }
            };
            var y = {PENDING: 0, RESOLVED: 1, FULFILLED: 2, REJECTED: 3}, g = function (e) {
                if (this._value = o, this._status = y.PENDING, this._fulfilledCallbacks = [], this._rejectedCallbacks = [], this._progressCallbacks = [], e) {
                    var t = this, n = e.length;
                    e(function (e) {
                        t.isResolved() || t._resolve(e)
                    }, n > 1 ? function (e) {
                        t.isResolved() || t._reject(e)
                    } : o, n > 2 ? function (e) {
                        t.isResolved() || t._notify(e)
                    } : o)
                }
            };
            g.prototype = {
                valueOf: function () {
                    return this._value
                }, isResolved: function () {
                    return this._status !== y.PENDING
                }, isFulfilled: function () {
                    return this._status === y.FULFILLED
                }, isRejected: function () {
                    return this._status === y.REJECTED
                }, then: function (e, t, n, r) {
                    var o = new v;
                    return this._addCallbacks(o, e, t, n, r), o.promise()
                }, "catch": function (e, t) {
                    return this.then(o, e, t)
                }, fail: function (e, t) {
                    return this.then(o, e, t)
                }, always: function (e, t) {
                    var n = this, r = function () {
                        return e.call(this, n)
                    };
                    return this.then(r, r, t)
                }, progress: function (e, t) {
                    return this.then(o, o, e, t)
                }, spread: function (e, t, n) {
                    return this.then(function (t) {
                        return e.apply(this, t)
                    }, t, n)
                }, done: function (e, t, n, r) {
                    this.then(e, t, n, r).fail(a)
                }, delay: function (e) {
                    var t, n = this.then(function (n) {
                        var r = new v;
                        return t = setTimeout(function () {
                            r.resolve(n)
                        }, e), r.promise()
                    });
                    return n.always(function () {
                        clearTimeout(t)
                    }), n
                }, timeout: function (e) {
                    var t = new v, n = setTimeout(function () {
                        t.reject(new b.TimedOutError("timed out"))
                    }, e);
                    return this.then(function (e) {
                        t.resolve(e)
                    }, function (e) {
                        t.reject(e)
                    }), t.promise().always(function () {
                        clearTimeout(n)
                    }), t.promise()
                }, _vow: !0, _resolve: function (e) {
                    if (!(this._status > y.RESOLVED)) {
                        if (e === this) return void this._reject(TypeError("Can't resolve promise with itself"));
                        if (this._status = y.RESOLVED, e && e._vow) return void (e.isFulfilled() ? this._fulfill(e.valueOf()) : e.isRejected() ? this._reject(e.valueOf()) : e.then(this._fulfill, this._reject, this._notify, this));
                        if (c(e) || u(e)) {
                            var t, n = s(function () {
                                t = e.then
                            }, function (e) {
                                this._reject(e)
                            }, this);
                            if (!n) return;
                            if (u(t)) {
                                var r = this, o = !1;
                                return void s(function () {
                                    t.call(e, function (e) {
                                        o || (o = !0, r._resolve(e))
                                    }, function (e) {
                                        o || (o = !0, r._reject(e))
                                    }, function (e) {
                                        r._notify(e)
                                    })
                                }, function (e) {
                                    o || this._reject(e)
                                }, this)
                            }
                        }
                        this._fulfill(e)
                    }
                }, _fulfill: function (e) {
                    this._status > y.RESOLVED || (this._status = y.FULFILLED, this._value = e, this._callCallbacks(this._fulfilledCallbacks, e), this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = o)
                }, _reject: function (e) {
                    this._status > y.RESOLVED || (this._status = y.REJECTED, this._value = e, this._callCallbacks(this._rejectedCallbacks, e), this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = o)
                }, _notify: function (e) {
                    this._callCallbacks(this._progressCallbacks, e)
                }, _addCallbacks: function (e, t, n, r, i) {
                    n && !u(n) ? (i = n, n = o) : r && !u(r) && (i = r, r = o);
                    var s;
                    this.isRejected() || (s = {
                        defer: e,
                        fn: u(t) ? t : o,
                        ctx: i
                    }, this.isFulfilled() ? this._callCallbacks([s], this._value) : this._fulfilledCallbacks.push(s)), this.isFulfilled() || (s = {
                        defer: e,
                        fn: n,
                        ctx: i
                    }, this.isRejected() ? this._callCallbacks([s], this._value) : this._rejectedCallbacks.push(s)), this._status <= y.RESOLVED && this._progressCallbacks.push({
                        defer: e,
                        fn: r,
                        ctx: i
                    })
                }, _callCallbacks: function (e, t) {
                    var n = e.length;
                    if (n) {
                        var r = this.isResolved(), o = this.isFulfilled();
                        i(function () {
                            for (var i, a, u, c = 0; n > c;) if (i = e[c++], a = i.defer, u = i.fn) {
                                var l, f = i.ctx, d = s(function () {
                                    l = f ? u.call(f, t) : u(t)
                                }, function (e) {
                                    a.reject(e)
                                });
                                if (!d) continue;
                                r ? a.resolve(l) : a.notify(l)
                            } else r ? o ? a.resolve(t) : a.reject(t) : a.notify(t)
                        })
                    }
                }
            };
            var _ = {
                cast: function (e) {
                    return b.cast(e)
                }, all: function (e) {
                    return b.all(e)
                }, race: function (e) {
                    return b.anyResolved(e)
                }, resolve: function (e) {
                    return b.resolve(e)
                }, reject: function (e) {
                    return b.reject(e)
                }
            };
            for (var E in _) _.hasOwnProperty(E) && (g[E] = _[E]);
            var b = {
                debug: !1, Deferred: v, Promise: g, defer: function () {
                    return new v
                }, when: function (e, t, n, r, o) {
                    return b.cast(e).then(t, n, r, o)
                }, fail: function (e, t, n) {
                    return b.when(e, o, t, n)
                }, always: function (e, t, n) {
                    return b.when(e).always(t, n)
                }, progress: function (e, t, n) {
                    return b.when(e).progress(t, n)
                }, spread: function (e, t, n, r) {
                    return b.when(e).spread(t, n, r)
                }, done: function (e, t, n, r, o) {
                    b.when(e).done(t, n, r, o)
                }, isPromise: function (e) {
                    return c(e) && u(e.then)
                }, cast: function (e) {
                    return b.isPromise(e) ? e : b.resolve(e)
                }, valueOf: function (e) {
                    return e && u(e.valueOf) ? e.valueOf() : e
                }, isFulfilled: function (e) {
                    return e && u(e.isFulfilled) ? e.isFulfilled() : !0
                }, isRejected: function (e) {
                    return e && u(e.isRejected) ? e.isRejected() : !1
                }, isResolved: function (e) {
                    return e && u(e.isResolved) ? e.isResolved() : !0
                }, resolve: function (e) {
                    var t = b.defer();
                    return t.resolve(e), t.promise()
                }, fulfill: function (e) {
                    var t = b.defer(), n = t.promise();
                    return t.resolve(e), n.isFulfilled() ? n : n.then(null, function (e) {
                        return e
                    })
                }, reject: function (e) {
                    var t = b.defer();
                    return t.reject(e), t.promise()
                }, invoke: function (e) {
                    var t, n, o = Math.max(arguments.length - 1, 0);
                    if (o) {
                        t = Array(o);
                        for (var i = 0; o > i;) t[i++] = arguments[i]
                    }
                    return s(function () {
                        n = b.resolve(t ? e.apply(r, t) : e.call(r))
                    }, function (e) {
                        n = b.reject(e)
                    }), n
                }, all: function (e) {
                    var t = new v, n = f(e), r = n ? d(e) : p(e), o = r.length, i = n ? [] : {};
                    if (!o) return t.resolve(i), t.promise();
                    var s = o;
                    return b._forEach(e, function (e, n) {
                        i[r[n]] = e, --s || t.resolve(i)
                    }, t.reject, t.notify, t, r), t.promise()
                }, allResolved: function (e) {
                    var t = new v, n = f(e), r = n ? d(e) : p(e), o = r.length, i = n ? [] : {};
                    if (!o) return t.resolve(i), t.promise();
                    var s = function () {
                        --o || t.resolve(e)
                    };
                    return b._forEach(e, s, s, t.notify, t, r), t.promise()
                }, allPatiently: function (e) {
                    return b.allResolved(e).then(function () {
                        var t, n, r, o, i = f(e), s = i ? d(e) : p(e), a = s.length, u = 0;
                        if (!a) return i ? [] : {};
                        for (; a > u;) r = s[u++], o = e[r], b.isRejected(o) ? (t || (t = i ? [] : {}), i ? t.push(o.valueOf()) : t[r] = o.valueOf()) : t || ((n || (n = i ? [] : {}))[r] = b.valueOf(o));
                        return t ? b.reject(t) : n
                    })
                }, any: function (e) {
                    var t = new v, n = e.length;
                    if (!n) return t.reject(Error()), t.promise();
                    var r, o = 0;
                    return b._forEach(e, t.resolve, function (e) {
                        o || (r = e), ++o === n && t.reject(r)
                    }, t.notify, t), t.promise()
                }, anyResolved: function (e) {
                    var t = new v, n = e.length;
                    return n ? (b._forEach(e, t.resolve, t.reject, t.notify, t), t.promise()) : (t.reject(Error()), t.promise())
                }, delay: function (e, t) {
                    return b.resolve(e).delay(t)
                }, timeout: function (e, t) {
                    return b.resolve(e).timeout(t)
                }, _forEach: function (e, t, n, r, o, i) {
                    for (var s = i ? i.length : e.length, a = 0; s > a;) b.when(e[i ? i[a] : a], h(t, a), n, r, o), ++a
                }, TimedOutError: m("TimedOut")
            }, w = !0;
            "object" == typeof n && "object" == typeof n.exports && (n.exports = b, w = !1), "object" == typeof t && (t.define("vow", function (e) {
                e(b)
            }), w = !1), "function" == typeof e && (e(function (e, t, n) {
                n.exports = b
            }), w = !1), w && (r.vow = b)
        }(this), ym.vow = n.exports
    }(), ym.modules.define("vow", [], function (e) {
        e(ym.vow)
    }), ym.ns.vow = ym.vow;
    var _backup_modules = this.modules;
    !function (e, t, n) {
        function r(e) {
            this.entry = e
        }

        function o() {
            this._fallbacks = [], this._retrieversData = {}
        }

        var i, s = 10, a = ym.vow, u = Array.prototype.slice, c = {}, l = {}, f = function (e, t) {
            return new Error('The key "' + t + '" isn\'t declared in "' + e + '" storage.')
        }, d = function (e) {
            return new Error('The dynamic depend "' + e + '" not found.')
        }, p = function (e) {
            return new Error("Undefined module `" + e + "` with no matching fallback.")
        };
        i = {
            fallbacks: new o, define: function (e, n, r, o) {
                var s, a, u, c = this;
                if ("function" == typeof n && "function" != typeof r) r = n, o = r, n = []; else if ("object" == typeof e) {
                    var f = e;
                    e = f.name, n = f.depends, r = f.declaration, o = f.context, u = f.dynamicDepends, s = f.storage, a = f.key
                }
                if (l.hasOwnProperty(e) || (l[e] = {name: e}), "function" == typeof n && (n = n.call({name: e}, ym)), l[e].callback = r, l[e].context = o, s && a) {
                    if ("string" != typeof a) for (var d = 0, p = a.length; p > d; d++) this._createKeyStorageRef(e, a[d], s); else this._createKeyStorageRef(e, a, s);
                    l[e].key = a, l[e].storage = s
                }
                u && (l[e].dynamicDepends = u);
                var m = i._createPatchedCallback(e);
                if (null != n) {
                    for (var h = [], d = 0, p = n.length; p > d; d++) h[d] = this._processModuleName(n[d]);
                    h = this.fallbacks.addRetrievers(h), this.nextTick(function () {
                        c.fallbacks.removeRetrievers(t.getDependencies(e))
                    }), t.define(e, h, m)
                } else t.define(e, m);
                return this
            }, require: function (r, o, s, c, l) {
                var f = a.defer(), d = f.promise(), p = n;
                if (3 == arguments.length && "function" != typeof s) c = s, s = null; else if (!r.hasOwnProperty("length") && "object" == typeof r) {
                    var m = r;
                    r = m.modules, o = m.successCallback, s = m.errorCallback, c = m.context, m.hasOwnProperty("data") && (p = m.data)
                }
                r = "string" != typeof r && r.hasOwnProperty("length") ? r : [r];
                var h = r.length, v = this._processModuleList(r, p);
                return r = v.list, ym.env.debug && !l && this.watchResolving(r), v.error ? f.reject(v.error) : t.require(r, function () {
                    var t = u.call(arguments, arguments.length - h);
                    f.resolve(t), o && o.apply(c || e, t)
                }, function (e) {
                    l ? f.reject(e) : i.fallbacks.retrieve(r).then(function () {
                        f.resolve(i.require(r, o, s, c, !0))
                    }).fail(function (e) {
                        f.reject(e)
                    })
                }), s && !l && d.fail(function (t) {
                    s.call(c || e, t)
                }), d
            }, defineSync: function (e, t) {
                var n, r;
                if ("object" == typeof e) {
                    var o = e;
                    t = o.module, n = o.storage, r = o.key, e = o.name
                }
                if (i.isDefined(e)) {
                    var s = l[e];
                    s.name = e, s.module = t, s.callback = function (e) {
                        e(t)
                    }, s.context = null
                } else l[e] = {name: e, module: t}, i.define(e, function (e) {
                    e(t)
                });
                r && n && (l[e].key = r, l[e].storage = n, this._createKeyStorageRef(e, r, n))
            }, requireSync: function (e) {
                var t = this.getDefinition(e), n = null;
                return t && (n = t.getModuleSync.apply(t, u.call(arguments, 1))), n
            }, providePackage: function (e) {
                var t = this, n = Array.prototype.slice.call(arguments, 1);
                i.require(["system.mergeImports"]).spread(function (r) {
                    e(r.joinImports(t.name, {}, t.deps, n))
                })
            }, getDefinition: function (e) {
                var t = null;
                return e = this._processModuleName(e), l.hasOwnProperty(e) && (t = new r(l[e])), t
            }, getState: function (e) {
                return t.getState(this._processModuleName(e))
            }, isDefined: function (e) {
                return t.isDefined(this._processModuleName(e))
            }, setOptions: function (e) {
                return t.setOptions(e)
            }, flush: function () {
                return t.flush()
            }, nextTick: function (e) {
                return t.nextTick(e)
            }, watchResolving: function (e) {
                if ("object" == typeof console && "function" == typeof console.warn) {
                    var t = this;
                    "undefined" == typeof this._failCounter && (this._failCounter = 0), setTimeout(function () {
                        0 == t._failCounter && setTimeout(function () {
                            t._failCounter = 0
                        }, 150);
                        for (var n = 0, r = e.length; r > n; n++) if ("RESOLVED" != t.getState(e[n])) {
                            if (t._failCounter++, 5 == t._failCounter) setTimeout(function () {
                                console.warn("Timeout: Totally " + t._failCounter + " modules were required but not resolved within " + s + " sec.")
                            }, 100); else if (t._failCounter > 5) continue;
                            console.warn("Timeout: Module `" + e[n] + "` was required but is still " + t.getState(e[n]) + " within " + s + " sec.")
                        }
                    }, 1e3 * s)
                }
            }, _createPatchedCallback: function (e) {
                var t = this;
                return function () {
                    var n = l[e], r = u.call(arguments, 0), o = n.callback, s = n.context;
                    ym.env.debug && t.watchResolving([e]), r[0] = i._patchProvideFunction(r[0], e), o && o.apply(s || this, r)
                }
            }, _processModuleList: function (e, n, r) {
                for (var o = {list: []}, i = 0, s = e.length; s > i; i++) {
                    var a = this._processModuleName(e[i]);
                    if (!a) {
                        o.error = f(e[i].storage, e[i].key);
                        break
                    }
                    if ("undefined" != typeof n) {
                        var u = t.getDependencies(a), c = l[a];
                        if (u) {
                            var d = this._processModuleList(u, n, !0);
                            if (d.error) {
                                o.error = d.error;
                                break
                            }
                            o.list = o.list.concat(d.list)
                        }
                        if (c && c.dynamicDepends) {
                            var p = [];
                            for (var m in c.dynamicDepends) {
                                var h = c.dynamicDepends[m](n);
                                this._isDepend(h) && p.push(h)
                            }
                            var d = this._processModuleList(p, n);
                            if (d.error) {
                                o.error = d.error;
                                break
                            }
                            o.list = o.list.concat(d.list)
                        }
                        this.fallbacks.isRetriever(a) && this.fallbacks.addRetrieverData(a, n)
                    }
                    r || o.list.push(a)
                }
                return o
            }, _createKeyStorageRef: function (e, t, n) {
                c.hasOwnProperty(n) || (c[n] = {}), c[n][t] = e
            }, _processModuleName: function (e) {
                if ("string" != typeof e) {
                    var t = e.storage;
                    e = c.hasOwnProperty(t) ? c[t][e.key] || null : null
                }
                return e
            }, _patchProvideFunction: function (e, t) {
                var r = function (n, r) {
                    var o = l[t];
                    o.module = n, e(n, r), r || (delete o.callback, delete o.context)
                };
                return r.provide = r, r.dynamicDepends = {
                    getValue: function (e, n) {
                        var r = a.defer(), o = l[t];
                        if (o.dynamicDepends && o.dynamicDepends.hasOwnProperty(e)) {
                            var s = o.dynamicDepends[e](n);
                            r.resolve(i._isDepend(s) ? i.getDefinition(s).getModule(n) : [s])
                        } else r.reject(d(e));
                        return r.promise()
                    }, getValueSync: function (e, r) {
                        var o = n, s = l[t];
                        if (s.dynamicDepends && s.dynamicDepends.hasOwnProperty(e)) {
                            var a = s.dynamicDepends[e](r);
                            o = i._isDepend(a) ? i.getDefinition(a).getModuleSync(r) : a
                        }
                        return o
                    }
                }, r
            }, _isDepend: function (e) {
                return "string" == typeof e || e && e.key && e.storage
            }
        }, r.prototype.getModuleKey = function () {
            return this.entry.key
        }, r.prototype.getModuleStorage = function () {
            return this.entry.storage
        }, r.prototype.getModuleName = function () {
            return this.entry.name
        }, r.prototype.getModuleSync = function (e) {
            if (arguments.length > 0) {
                var t = this.entry.dynamicDepends;
                for (var r in t) {
                    var o = t[r](e);
                    if (i._isDepend(o) && !i.getDefinition(o).getModuleSync(e)) return n
                }
            }
            return this.entry.module
        }, r.prototype.getModule = function (e) {
            var t = {modules: [this.entry.name]};
            return e && (t.data = e), i.require(t)
        };
        var m = "_retriever@";
        o.prototype.register = function (e, t) {
            e && "*" != e ? this._fallbacks.unshift({filter: e, func: t}) : this._fallbacks.push({
                filter: e || "*",
                func: t
            })
        }, o.prototype.retrieve = function (e) {
            "string" == typeof e && (e = [e]);
            for (var t = [], n = 0, r = e.length; r > n; n++) {
                var o = a.defer(), s = e[n];
                if (t[n] = o.promise(), i.isDefined(s)) o.resolve(!0); else {
                    var u = this.find(s);
                    if (!u) {
                        o.reject(p(s));
                        break
                    }
                    o.resolve(u.func(s, u.filter))
                }
            }
            return a.all(t)
        }, o.prototype.find = function (e) {
            for (var t = 0, n = this._fallbacks.length; n > t; t++) {
                var r = this._fallbacks[t].filter;
                if ("*" === r) return this._fallbacks[t];
                if ("function" == typeof r && r(e)) return this._fallbacks[t];
                if (e.match(r)) return this._fallbacks[t]
            }
            return null
        }, o.prototype.addRetrievers = function (e) {
            for (var t, n, r = [], o = 0, s = e.length; s > o; o++) t = e[o], i.isDefined(t) ? r.push(t) : (n = m + t, r.push(n), i.isDefined(n) || this._defineRetriever(n));
            return r
        }, o.prototype.removeRetrievers = function (e) {
            for (var t, n = 0, r = e.length; r > n; n++) this.isRetriever(e[n]) && !this._retrieversData[e[n]] && (t = e[n].replace(m, ""), i.isDefined(t) && (e[n] = t))
        }, o.prototype.isRetriever = function (e) {
            return 0 === e.indexOf(m)
        }, o.prototype.addRetrieverData = function (e, t) {
            this._retrieversData[e] || (this._retrieversData[e] = []), this._retrieversData[e].push(t)
        }, o.prototype._defineRetriever = function (e) {
            var t = this;
            i.define(e, [], function (e) {
                var n = this.name.replace(m, "");
                t.retrieve(n).then(function () {
                    return t._requireAfterRetrieve(n)
                }).spread(e).fail(e)
            })
        }, o.prototype._requireAfterRetrieve = function (e) {
            var t = this._retrieversData[m + e];
            if (!t) return i.require(e);
            for (var n = [], r = 0, o = t.length; o > r; r++) n.push(i.require({modules: [e], data: t[r]}));
            return a.all(n).then(function (e) {
                return e[0]
            })
        }, e.modules = i
    }(this, ym.modules), ym.modules = this.modules, this.modules = _backup_modules, _backup_modules = void 0, ym.ns.modules = ym.modules, function (e) {
        function t(e, t, n) {
            if (t) {
                var r = e;
                t = t.split(".");
                for (var o, i = 0, s = t.length - 1; s > i; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                return r[t[s]] = n, r[t[s]]
            }
            return n
        }

        ym.project.namespace && ("function" == typeof setupAsync ? ym.envCallbacks.push(function (n) {
            n.namespace !== !1 && t(e, n.namespace || ym.project.namespace, ym.ns)
        }) : t(e, ym.project.namespace, ym.ns))
    }(this), ym.modules.define("cnst.localization", ["cnst.env"], function (e, t) {
        var n = {
            en: {
                "constructor-service": {
                    move_to_map: "See full-size map",
                    removed_map: "Map removed by owner. Find addresses and places with <a>Yandex.Maps</a>"
                }
            },
            fr: {"constructor-service": {move_to_map: "", removed_map: ""}},
            kk: {"constructor-service": {move_to_map: "", removed_map: ""}},
            ru: {
                "constructor-service": {
                    move_to_map: "На большую карту",
                    removed_map: "Карта удалена владельцем, нужные адрес или место можно найти <a>на Яндекс.Картах</a>"
                }
            },
            tr: {
                "constructor-service": {
                    move_to_map: "Haritalar'da aç",
                    removed_map: "Harita, sahibi tarafından silindi, istediğiniz adresi veya yeri <a>Yandex.Haritalar'da</a> bulabilirsiniz"
                }
            },
            uk: {
                "constructor-service": {
                    move_to_map: "На велику карту",
                    removed_map: "Карту видалено власником, потрібні адресу та місце можна знайти <a>на Яндекс.Картах</a>\n"
                }
            },
            uz: {"constructor-service": {move_to_map: "", removed_map: ""}}
        };
        e(n[t.lang] && n[t.lang]["constructor-service"])
    }), ym.modules.define("main", ["map-data", "params", "cnst.current-script"], function (e, t, n, r) {
        function o() {
            var e = document.createElement("ymaps");
            return e.setAttribute("id", "ymaps" + n.tid), e.style.display = "block", e.style.width = n.containerSize[0], e.style.height = n.containerSize[1], e
        }

        function i(e) {
            for (; e;) {
                if (e.parentNode === document.body) return !0;
                e = e.parentNode
            }
            return !1
        }

        function s(e) {
            console && console.error && console.error(e)
        }

        return t.maps && t.maps.length ? (r ? ym.modules.require(["ymaps", "create-map"], function (e, t) {
            var a, u = o();
            if (n.elementId) {
                if (a = document.getElementById(n.elementId), !a) return void s("DOMElement #" + n.elementId + " not found.");
                a.appendChild(u)
            } else {
                if (!document.documentElement.contains(r)) return void s("Script element was removed from document.");
                i(r) ? r.parentNode.insertBefore(u, r) : document.body.appendChild(u)
            }
            t(u), r.parentNode && r.parentNode.removeChild(r)
        }) : s("Script element was not found."), void e({})) : void e()
    }), ym.modules.require("main", function () {
    }), ym.modules.define("cnst.env", function (e) {
        e({"lang": "ru"})
    }), ym.modules.define("create-map", ["config", "params", "map-data", "check-size-component", "ymaps", "show"], function (e, t, n, r, o, i, s) {
        var a = r.maps[0];
        e(function (e) {
            function t(e, t) {
                if (window.MutationObserver) {
                    var n = new window.MutationObserver(function (r) {
                        var o = !r.some(function (e) {
                            return 0 === e.removedNodes.length
                        });
                        o && !document.body.contains(t) && (n.disconnect(), n = null, e.destroy(), e = null, t = null)
                    });
                    n.observe(document.body, {childList: !0, subtree: !0})
                }
            }

            [].indexOf(1);
            var u = {autoFitToViewport: "always"},
                c = ["fullscreenControl", "rulerControl", "trafficControl", "zoomControl", "geolocationControl"];
            n.isApiKeyValid && c.push("routeButtonControl", "searchControl"), n.isApiKeyValid && (u.searchControlProvider = "yandex#search", c.push("typeSelector"));
            var l = new i.Map(e, {
                center: a.state.center,
                zoom: Math.round(a.state.zoom),
                type: a.state.type,
                controls: c
            }, u);
            n.isApiKeyValid || (l.controls.options.set("panoramasItemMode", "off"), l.options.set("yandexMapDisablePoiInteractivity", !0), i.control.GeolocationControl.prototype._getLocation = function () {
                return i.geolocation.get({
                    mapStateAutoApply: !0,
                    autoReverseGeocode: !1,
                    useMapMargin: this.options.get("useMapMargin", !0)
                })
            }), o(l, e);
            var f = a.properties.sid.split(":");
            return l.state.set({
                mapSourceType: f[0],
                mapSid: f[1]
            }), n.scrollZoomBehavior || l.behaviors.disable("scrollZoom"), a.state.traffic && a.state.traffic.shown && l.controls.get("trafficControl").state.set("trafficShown", !0), s(l, r), t(l, e), l
        })
    });
    var currentScript = document.currentScript;
    ym.modules.define("cnst.current-script", ["config"], function (e, t) {
        function n(e, t) {
            return e ? t.indexOf(e.replace(/^.*?\/\//, "")) > -1 : !1
        }

        if (!currentScript || !currentScript.parentNode) for (var r, o = document.getElementsByTagName("script"), i = 0, s = o.length; s > i; i++) if (r = o[i], !r.ctorInited && n(r.src, t.originalUrl)) {
            r.ctorInited = !0, currentScript = r;
            break
        }
        e(currentScript)
    }), ym.modules.define("error", ["util.defineClass", "util.extend"], function (e, t) {
        function n(e, t) {
            function n(t) {
                Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.name = e, this.message = t
            }

            return t && (n.errorClass = t), r[e] = n, n
        }

        var r = {
            create: function (e, t) {
                return r[e] ? new r[e](t) : void r.log("ProcessError", e + ": is undefined error type")
            }, throwException: function (e, t) {
                if (ym.env.debug) throw"object" == typeof e ? e : r.create(e, t)
            }, throwExceptionIf: function (e, t, n) {
                e && r.throwException(t, n)
            }, warn: function (e, t) {
                if (ym.env.debug && "object" == typeof console && console.warn) {
                    var n = "object" == typeof e ? e : r.create(e, t), o = new Error(n.name + ": " + n.message);
                    o.stack = n.stack, console.warn(o)
                }
            }, warnIf: function (e, t, n) {
                e && r.warn(t, n)
            }
        }, o = n("_YMError");
        t(o, Error);
        var i = n("ClientError");
        t(i, o);
        var s = n("InputError", "ClientError");
        t(s, i);
        var a = n("StateError", "ClientError");
        t(a, i);
        var u = n("ProcessError", "ClientError");
        t(u, i);
        var c = n("StorageItemAccessError", "ClientError");
        t(c, i);
        var l = n("FeatureRemovedError", "ClientError");
        t(l, i);
        var f = n("ExternalError");
        t(f, o);
        var d = n("RequestError", "ExternalError");
        t(d, f);
        var p = n("DataProcessingError", "ExternalError");
        t(p, f);
        var m = n("AccessError", "ExternalError");
        t(m, f);
        var h = n("NotSupportedError", "ExternalError");
        t(h, f);
        var v = n("Reject");
        t(v, o);
        var y = n("OperationUnallowedReject", "Reject");
        t(y, v);
        var g = n("OperationCanceledReject", "Reject");
        t(g, v);
        var _ = n("EmptyResultReject", "Reject");
        t(_, v);
        var E = n("OperationUnawailableReject", "Reject");
        t(E, v);
        var b = n("Warning");
        t(b, o);
        var w = n("DeprecationWarning", "Warning");
        t(w, b);
        var x = n("OveruseWarning", "Warning");
        t(x, b), e(r)
    }), ym.modules.define("config", [], function (e) {
        e({
            "imgUrl": "https://api-maps.yandex.ru/services/constructor/1.0/img",
            "show": "https://api-maps.yandex.ru/services/constructor/1.0/show",
            "host": "https://api-maps.yandex.ru/",
            "originalUrl": "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ae8f38e3ef2db007a48b0c8b09fd1e4d60121e559c163982bc4d7e3b90209e791&amp;width=100%25&amp;height=500&amp;lang=ru_RU&amp;scroll=true",
            "namespace": "ymaps_ctor",
            "apiVersion": "2.1",
            "minContainerSize": [320, 200],
            "mapHost": "https://yandex.ru/maps/",
            "capImgFormat": "svg"
        })
    }), ym.modules.define("map-data", [], function (e) {
        e({
            "ymj": "1.0",
            "maps": [{
                "properties": {
                    "sid": "constructor:e8f38e3ef2db007a48b0c8b09fd1e4d60121e559c163982bc4d7e3b90209e791",
                    "created": 1598437299,
                    "updated": 1598437599,
                    "access": "public",
                    "revision": "5",
                    "name": "Alfa-Force",
                    "description": "Группа охранных\nкомпаний"
                },
                "state": {
                    "size": [500, 500],
                    "center": [38.148639497265584, 55.661337844095655],
                    "zoom": 9,
                    "type": "yandex#map",
                    "traffic": {"shown": false}
                },
                "geoObjects": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "id": "215973237",
                        "properties": {
                            "name": "Россия, Москва, Варшавское шоссе, 120к2",
                            "description": "",
                            "iconContent": "",
                            "iconCaption": "Alfa-Force"
                        },
                        "geometry": {"type": "Point", "coordinates": [37.617114, 55.630273]},
                        "options": {"zIndex": 800000000, "order": 800000000, "preset": "islands#blueIcon"}
                    }]
                }
            }],
            "presetStorage": {}
        })
    }), ym.modules.define("params", ["config", "map-data"], function (e, t, n) {
        function r(e) {
            return e ? isNaN(Number(e)) ? e : e + "px" : "100%"
        }

        var o = {
            "scrollZoomBehavior": true,
            "size": ["100%", "500"],
            "elementId": "",
            "lang": "ru_RU",
            "key": "",
            "apikey": "",
            "isApiKeyValid": false,
            "csp": false
        };
        o.containerSize = [r(o.size[0]), r(o.size[1])], o.lang = (o.lang || n.maps[0] && n.maps[0].state && n.maps[0].state.lang || "ru_RU").replace("-", "_"), o.tid = String(Number(new Date)) + String(Math.round(1e6 * Math.random())), o.ns = [t.namespace, o.lang, o.key.replace(/\W/g, ""), o.apikey.replace(/\W/g, "")].join("__"), e(o)
    }), ym.modules.define("show", ["js-loader", "config", "params", "ymaps"], function (e, t, n, r, o) {
        function i() {
            o.modules.require("constructor.show").then(function (t) {
                e(t[0])
            })
        }

        ym.modules.isDefined("constructor.show") ? i() : t(n.show + "?ns=" + r.ns, i)
    }), ym.modules.define("system.createNs", [], function (e) {
        e(function (e, t, n) {
            if (t) {
                var r = e;
                t = t.split(".");
                for (var o, i = 0, s = t.length - 1; s > i; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                return r[t[s]] = n, r[t[s]]
            }
            return n
        })
    }), ym.modules.define("system.mergeImports", [], function (e) {
        function t(e, t, n) {
            if (t) {
                var r = e;
                t = t.split(".");
                for (var o, i = 0, s = t.length - 1; s > i; i++) t[i] && (r = r[o = t[i]] || (r[o] = {}));
                return r[t[s]] = n, r[t[s]]
            }
            return n
        }

        function n(e, t) {
            return e[2] - t[2]
        }

        function r(e) {
            return 0 === e.indexOf("package.")
        }

        function o(e, n, r) {
            for (var o = [], i = {}, s = 0, a = n.length; a > s; ++s) {
                var u = r[s].__package;
                if (u) for (var c = 0; c < u.length; ++c) i[u[c][0]] || (t(e, u[c][0], u[c][1]), o.push([u[c][0], u[c][1]]), i[u[c][0]] = 1); else t(e, n[s], r[s]), i[n[s]] || (o.push([n[s], r[s]]), i[n[s]] = 1)
            }
            return e.__package = o, e
        }

        function i(e, i, s, a) {
            var u = [], c = r(e);
            if (c) return o(i, s, a);
            for (var l = 0, f = s.length; f > l; ++l) u.push([s[l], l, s[l].length]);
            u.sort(n);
            for (var l = 0, f = u.length; f > l; ++l) {
                var d = u[l][1], p = s[d];
                if (r(p)) for (var m = a[d].__package, h = 0; h < m.length; ++h) t(i, m[h][0], m[h][1]); else t(i, p, a[d])
            }
            return i
        }

        e({isPackage: r, joinImports: i, createNS: t})
    }), ym.modules.define("system.provideCss", ["system.nextTick"], function (e, t) {
        function n() {
            if (a = !1, s.length) {
                r || (r = document.createElement("style"), r.type = "text/css", r.setAttribute && r.setAttribute("data-ymaps", "css-modules")), r.styleSheet ? (i += o, r.styleSheet.cssText = i, r.parentNode || document.getElementsByTagName("head")[0].appendChild(r)) : (r.appendChild(document.createTextNode(o)), document.getElementsByTagName("head")[0].appendChild(r), r = null), u = 1, o = "";
                var e = s;
                s = [];
                for (var t = 0, n = e.length; n > t; ++t) e[t]();
                u = 0
            }
        }

        var r, o = "", i = "", s = [], a = !1, u = 0;
        e(function (e, r) {
            o += e + "\n/**/\n", s.push(r), a || (t(n), a = !0)
        })
    }), ym.modules.define("system.supports.css", [], function (e) {
        function t(e) {
            return "undefined" == typeof f[e] ? f[e] = n(e) : f[e]
        }

        function n(e) {
            return r(e) || r(p + i(e)) || r(d.cssPrefix + i(e))
        }

        function r(e) {
            return "undefined" != typeof o().style[e] ? e : null
        }

        function o() {
            return u || (u = document.createElement("div"))
        }

        function i(e) {
            return e ? e.substr(0, 1).toUpperCase() + e.substr(1) : e
        }

        function s(e) {
            var n = t(e);
            return n && n != e && (n = "-" + p + "-" + e), n
        }

        function a(e) {
            return c[e] && t("transitionProperty") ? s(c[e]) : null
        }

        var u, c = {
            transform: "transform",
            opacity: "opacity",
            transitionTimingFunction: "transition-timing-function",
            userSelect: "user-select",
            height: "height"
        }, l = {}, f = {}, d = ym.env.browser, p = d.cssPrefix.toLowerCase();
        e({
            checkProperty: t, checkTransitionProperty: function (e) {
                return "undefined" == typeof l[e] ? l[e] = a(e) : l[e]
            }, checkTransitionAvailability: a
        })
    }), ym.modules.define("system.supports.graphics", [], function (e) {
        function t() {
            if (!r && window.WebGLRenderingContext) {
                var e = document.createElement("canvas"), t = e.getContext("webgl", o);
                t && "function" == typeof t.getParameter ? r = "webgl" : (t = e.getContext("experimental-webgl", o), t && "function" == typeof t.getParameter && (r = "experimental-webgl"))
            }
            return r
        }

        function n(e, t) {
            e.width = 226, e.height = 256, t.fillStyle = "#fff", t.fillRect(0, 0, 150, 150), t.globalCompositeOperation = "xor", t.fillStyle = "#f00", t.fillRect(10, 10, 100, 100), t.fillStyle = "#0f0", t.fillRect(50, 50, 100, 100);
            for (var n = t.getImageData(49, 49, 2, 2), r = [], o = 0; 16 > o; o++) r.push(n.data[o]);
            return "0x0x0x0x0x0x0x0x0x0x0x0x0x255x0x255" == r.join("x")
        }

        var r = null, o = {failIfMajorPerformanceCaveat: !0}, i = {};
        e({
            hasSvg: function () {
                return "svg" in i || (i.svg = document.implementation && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")), i.svg
            }, hasCanvas: function () {
                if (!("canvas" in i)) {
                    var e = document.createElement("canvas"), t = "getContext" in e ? e.getContext("2d") : null;
                    i.canvas = t ? n(e, t) : !1
                }
                return i.canvas
            }, hasWebgl: function () {
                if (!window.WebGLRenderingContext) return !1;
                if (!("webgl" in i) || i.webgl) {
                    var e = document.createElement("canvas"), n = "getContext" in e ? e.getContext(t(), o) : !1;
                    if (i.webgl = n && "function" == typeof n.getParameter, i.webgl) {
                        var r = n.getExtension("WEBGL_lose_context");
                        r && r.loseContext()
                    }
                }
                return i.webgl
            }, hasVml: function () {
                if (!("vml" in i)) {
                    var e = !1, t = document.createElement("div");
                    t.innerHTML = '<v:shape id="yamaps_testVML"  adj="1" />';
                    var n = t.firstChild;
                    n && n.style && (n.style.behavior = "url(#default#VML)", e = n ? "object" == typeof n.adj : !0, t.removeChild(n)), i.vml = e
                }
                return i.vml
            }, getWebglContextName: t
        })
    }), ym.modules.define("template.Parser", ["util.id"], function (provide, utilId) {
        function trim(e) {
            return nativeTrim ? e.trim() : e.replace(trimRegExp, "")
        }

        function escape(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")
        }

        function getKeyValuePairs(e) {
            for (var t = [], n = trim(e).replace(/\s*=\s*/g, "=").replace(/\s+/g, " ").split(" "), r = 0, o = n.length; o > r; r++) t.push(n[r].split("=", 2));
            return t
        }

        function removeQuotes(e) {
            var t = e.charAt(0);
            return "'" == t || '"' == t ? e.slice(1, e.length - 1) : e
        }

        function parseExpression(e) {
            for (var t, n = /'|"/g, r = 0, o = []; t = n.exec(e);) {
                var i = t.index;
                if (i >= r) {
                    var s = e.indexOf(t[0], i + 1);
                    r != i && parseExpressionSubstitutes(o, e.slice(r, i)), o.push(e.slice(i, s + 1)), r = s + 1
                }
            }
            return r < e.length && parseExpressionSubstitutes(o, e.slice(r)), o.join("")
        }

        function parseExpressionSubstitutes(e, t) {
            for (var n, r = /(^|[^\w\$])([A-Za-z_\$][\w\$\.]*)(?:[^\w\d_\$]|$)/g, o = 0; n = r.exec(t);) {
                var i = n.index + n[1].length, s = n[2], a = i + s.length;
                i > o && e.push(t.slice(o, i)), e.push(stopWords[s] ? s : 'data.get("' + s + '")'), o = a
            }
            o < t.length && e.push(t.slice(o))
        }

        function evaluateExpression(expression, data) {
            var result;
            return eval("result = " + expression), result
        }

        var trimRegExp = /^\s+|\s+$/g, nativeTrim = "function" == typeof String.prototype.trim,
            DataLogger = function (e) {
                this._dataManager = e, this._renderedValues = {}, this._contexts = {}
            };
        DataLogger.prototype.get = function (e) {
            if (this._renderedValues.hasOwnProperty(e)) return this._renderedValues[e].value;
            var t = e.indexOf("."), n = trim(t > -1 ? e.substring(0, t) : e);
            this._contexts.hasOwnProperty(n) && (e = e.replace(n, this._contexts[n]));
            var r = this._dataManager.get(e);
            return this.set(e, r), r
        }, DataLogger.prototype.setContext = function (e, t) {
            this._contexts[e] = t
        }, DataLogger.prototype.set = function (e, t) {
            if (e.indexOf(".") > -1) for (var n = e.split("."), r = "", o = 0, i = n.length - 1; i > o; o++) r += (0 === o ? "" : ".") + n[o], this._renderedValues[r] = {value: this._dataManager.get(r)};
            this._renderedValues[e] = {value: t}
        }, DataLogger.prototype.getRenderedValues = function () {
            return this._renderedValues
        };
        var stopWords = {"true": !0, "false": !0, undefined: !0, "null": !0, "typeof": !0}, CONTENT = 0,
            startTokenRegExp = new RegExp(["\\$\\[\\[", "\\$\\[(?!\\])", "\\[if", "\\[else\\]", "\\[endif\\]", "\\{\\{", "\\{%"].join("|"), "g"),
            Parser = function (e) {
                this.filtersStorage = e
            };
        Parser.prototype.scanners = {}, Parser.prototype.builders = {}, Parser.prototype.parse = function (e) {
            var t, n, r, o, i = [], s = 0;
            for (startTokenRegExp.lastIndex = 0; o = startTokenRegExp.exec(e);) if (o.index >= s) {
                t = o.index, r = t + o[0].length, s != t && i.push(CONTENT, e.slice(s, t));
                var a = this.scanners[o[0]];
                a.token ? (i.push(a.token, null), s = r) : (n = e.indexOf(a.stopToken, r), a.scan(i, e.slice(r, n)), s = n + a.stopToken.length)
            }
            return s < e.length && i.push(CONTENT, e.slice(s)), i
        }, Parser.prototype.build = function (e, t) {
            var n = {
                nodes: e,
                left: 0,
                right: e.length,
                empty: !0,
                subnodes: [],
                sublayouts: [],
                strings: [],
                data: new DataLogger(t)
            };
            return this._buildTree(n), n.renderedValues = n.data.getRenderedValues(), n
        }, Parser.prototype._buildTree = function (e) {
            for (var t = e.nodes, n = e.strings; e.left < e.right;) {
                var r = t[e.left];
                r == CONTENT ? (n.push(t[e.left + 1]), e.empty = !1, e.left += 2) : this.builders[r](e, this)
            }
        };
        var OLD_SUBSTITUTE = 1001, OLD_SUBLAYOUT = 1002, OLD_IF = 1003, OLD_ELSE = 1004, OLD_ENDIF = 1005;
        Parser.prototype.scanners["$[["] = {
            stopToken: "]]", scan: function (e, t) {
                var n = t.match(/^(\S+)\s*(\S.*)?$/);
                e.push(OLD_SUBLAYOUT, [n[1], n[2] ? getKeyValuePairs(n[2]) : []])
            }
        }, Parser.prototype.scanners["$["] = {
            stopToken: "]", scan: function (e, t) {
                var n = t.split("|", 2);
                e.push(OLD_SUBSTITUTE, n)
            }
        }, Parser.prototype.scanners["[if"] = {
            stopToken: "]", scan: function (e, t) {
                var n = t.match(/^(def)? (.+)$/), r = parseExpression(n[2]);
                e.push(OLD_IF, [n[1], r])
            }
        }, Parser.prototype.scanners["[else]"] = {token: OLD_ELSE}, Parser.prototype.scanners["[endif]"] = {token: OLD_ENDIF}, Parser.prototype.builders[OLD_SUBSTITUTE] = function (e) {
            var t = e.nodes[e.left + 1][0], n = e.data.get(t);
            "undefined" == typeof n && (n = e.nodes[e.left + 1][1]), e.strings.push(n), e.left += 2, e.empty = e.empty && !n
        }, Parser.prototype.builders[OLD_SUBLAYOUT] = function (e) {
            var t = utilId.prefix() + utilId.gen(), n = e.nodes[e.left + 1][0];
            e.strings.push('<ymaps id="' + t + '"></ymaps>');
            for (var r = {
                id: t,
                key: n,
                value: e.data.get(n) || n
            }, o = [], i = [], s = e.nodes[e.left + 1][1], a = 0, u = s.length; u > a; a++) {
                var c, l = s[a], f = l[0], d = l[1] || "true", p = d.length - 1;
                '"' == d.charAt(0) && '"' == d.charAt(p) || "'" == d.charAt(0) && "'" == d.charAt(p) ? c = d.substring(1, p) : isNaN(Number(d)) ? "true" == d ? c = !0 : "false" == d ? c = !1 : (i = d.split("|"), c = e.data.get(i[0], i[1]), o.push(i[0])) : c = d, r[f] = c
            }
            r.monitorValues = o, e.sublayouts.push(r), e.left += 2
        }, Parser.prototype.builders[OLD_IF] = function (e, t) {
            for (var n, r, o, i = e.nodes, s = e.left, a = i[s + 1][0], u = i[s + 1][1], c = evaluateExpression(u, e.data), l = a ? "undefined" != typeof c : !!c, f = e.left + 2, d = e.right, p = 1; d > f && (i[f] == OLD_IF ? p++ : i[f] == OLD_ELSE ? 1 == p && (r = f) : i[f] == OLD_ENDIF && (--p || (o = f)), !o);) f += 2;
            if (l ? (n = e.left + 2, d = r ? r : o) : (n = r ? r + 2 : o, d = o), n != d) {
                var m = e.right, h = e.empty;
                e.left = n, e.right = d, t._buildTree(e), e.empty = e.empty && h, e.right = m
            }
            e.left = o + 2
        };
        var SUBSTITUTE = 2001, INCLUDE = 2002, IF = 2003, ELSE = 2004, ENDIF = 2005, FOR = 2006, ENDFOR = 2007,
            ELSEIF = 2008;
        Parser.prototype.scanners["{{"] = {
            stopToken: "}}", scan: function (e, t) {
                for (var n = t.split("|"), r = [], o = 1, i = n.length; i > o; o++) {
                    var s = n[o].split(":", 2), a = trim(s[0]), u = s[1];
                    s[1] && (u = "default" != a ? parseExpression(removeQuotes(s[1])) : trim(s[1])), r.push([a, u])
                }
                e.push(SUBSTITUTE, [trim(n[0]), r])
            }
        }, Parser.prototype.scanners["{%"] = {
            stopToken: "%}", scan: function (e, t) {
                var n = trim(t).match(/^([A-Za-z]+)(\s+\S.*)?$/), r = n[1], o = n[2] ? trim(n[2]) : null;
                switch (r) {
                    case"if":
                        e.push(IF, parseExpression(o));
                        break;
                    case"else":
                        e.push(ELSE, null);
                        break;
                    case"elseif":
                        e.push(ELSEIF, parseExpression(o));
                        break;
                    case"endif":
                        e.push(ENDIF, null);
                        break;
                    case"include":
                        var i = getKeyValuePairs(o);
                        e.push(INCLUDE, [removeQuotes(i[0][0]), i.slice(1)]);
                        break;
                    case"for":
                        e.push(FOR, o);
                        break;
                    case"endfor":
                        e.push(ENDFOR, null)
                }
            }
        }, Parser.prototype.builders[SUBSTITUTE] = function (e, t) {
            var n, r, o, i = /\[\s*(\d+|\'[^\']+\'|\"[^\"]+\")\s*\]/g, s = e.nodes[e.left + 1], a = s[0], u = !0,
                c = s[1];
            if (i.test(a)) {
                var l, f = a.match(i), d = a.split(f[0]);
                if (o = f.length, a = d[0], l = a + "." + removeQuotes(trim(f[0].replace("[", "").replace("]", ""))), d = d[1], o > 1) for (r = 1; o > r; r++) {
                    var p = f[r];
                    d = d.split(p), p = trim(p.replace("[", "").replace("]", "")), p = removeQuotes(p), d[0].length && (l += d[0]), l += "." + p, d = d[1]
                } else l += d;
                n = e.data.get(l)
            } else n = e.data.get(a);
            for (r = 0, o = c.length; o > r; r++) {
                var m, h = c[r];
                t.filtersStorage && (m = t.filtersStorage.get(h[0])) ? n = m(e.data, n, h[1]) : "raw" == h[0] && (u = !1)
            }
            u && "string" == typeof n && (n = escape(n)), e.strings.push(n), e.left += 2, e.empty = e.empty && !n
        }, Parser.prototype.builders[INCLUDE] = Parser.prototype.builders[OLD_SUBLAYOUT], Parser.prototype.builders[FOR] = function (e, t) {
            for (var n, r, o = e.nodes, i = e.left + 2, s = e.right, a = 1; s > i && (o[i] == FOR ? a++ : o[i] == ENDFOR && (--a || (r = i)), !r);) i += 2;
            if (n = e.left + 2, s = r, n != s) {
                var u = o[e.left + 1].split(/\sin\s/), c = trim(u[0]), l = trim(u[1]), f = e.data.get(l),
                    d = c.split(","), p = d.length, m = e.right, h = e.empty, v = e.data, y = new DataLogger(v);
                e.data = y;
                for (var g in f) e.left = n, e.right = s, f.hasOwnProperty(g) && (1 == p ? y.setContext(c, l + "." + g) : (y.set(trim(d[0]), g), y.setContext(trim(d[1]), l + "." + g)), t._buildTree(e));
                e.empty = e.empty && h, e.right = m, e.data = v
            }
            e.left = r + 2
        }, Parser.prototype.builders[IF] = Parser.prototype.builders[ELSEIF] = function (e, t) {
            for (var n, r, o, i, s, a = e.nodes, u = e.left, c = a[u + 1], l = evaluateExpression(c, e.data), f = !!l, d = e.left + 2, p = e.right, m = 1; p > d && (s = a[d], s == IF ? m++ : s == ELSEIF ? 1 != m || o || (o = d) : s == ELSE ? 1 == m && (r = d) : s == ENDIF && (--m || (i = d)), !i);) d += 2;
            if (f ? (n = e.left + 2, p = o || r || i) : o ? (n = o, p = i + 1) : (n = r ? r + 2 : i, p = i), n != p) {
                var h = e.right, v = e.empty;
                e.left = n, e.right = p, t._buildTree(e), e.empty = e.empty && v, e.right = h
            }
            e.left = i + 2
        }, provide(Parser)
    }), ym.modules.define("util.defineClass", ["util.extend"], function (e, t) {
        function n(e, n, r) {
            return e.prototype = (Object.create || function (e) {
                function t() {
                }

                return t.prototype = e, new t
            })(n.prototype), e.prototype.constructor = e, e.superclass = n.prototype, e.superclass.constructor = n, r && t(e.prototype, r), e.prototype
        }

        function r(e, r) {
            var o = "function" == typeof r;
            o && n(e, r);
            for (var i = o ? 2 : 1, s = arguments.length; s > i; i++) t(e.prototype, arguments[i]);
            return e
        }

        e(r)
    }), ym.modules.define("util.extend", ["util.objectKeys"], function (e, t) {
        function n(e) {
            if (ym.env.debug && !e) throw new Error("util.extend: не передан параметр target");
            for (var t = 1, n = arguments.length; n > t; t++) {
                var r = arguments[t];
                if (r) for (var o in r) r.hasOwnProperty(o) && (e[o] = r[o])
            }
            return e
        }

        function r(e) {
            if (ym.env.debug && !e) throw new Error("util.extend: не передан параметр target");
            for (var n = 1, r = arguments.length; r > n; n++) {
                var o = arguments[n];
                if (o) for (var i = t(o), s = 0, a = i.length; a > s; s++) e[i[s]] = o[i[s]]
            }
            return e
        }

        e("function" == typeof Object.keys ? r : n)
    }), ym.modules.define("util.id", [], function (e) {
        var t = new function () {
            function e() {
                return (++n).toString()
            }

            var t = ("id_" + +new Date + Math.round(1e4 * Math.random())).toString(),
                n = Math.round(1e4 * Math.random());
            this.prefix = function () {
                return t
            }, this.gen = e, this.get = function (n) {
                return n === window ? t : n[t] || (n[t] = e())
            }
        };
        e(t)
    }), ym.modules.define("ie-version", [], function (e) {
        e(function () {
            for (var e, t = 3, n = document.createElement("div"), r = n.getElementsByTagName("i"); n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", r[0];) ;
            return t > 4 ? t : e
        }())
    }), ym.modules.define("js-loader", [], function (e) {
        e(function (e, t) {
            var n = document.getElementsByTagName("head")[0], r = document.createElement("script"), o = function () {
                n.removeChild(r), t && t(), t = null
            };
            return r.charset = "utf-8", r.src = e, n.insertBefore(r, n.firstChild), r.onreadystatechange = function () {
                ("complete" === this.readyState || "loaded" === this.readyState) && o()
            }, r.onload = o, r.src = e, r
        })
    }), ym.modules.define("util.jsonp", ["util.id", "util.querystring", "util.script"], function (e, t, n, r) {
        function o(e) {
            return o.handler ? o.handler(e, i) : i(e)
        }

        function i(e) {
            var o, i, a = "undefined" == typeof e.checkResponse ? !0 : e.checkResponse,
                l = e.responseFieldName || "response", f = e.requestParams ? "&" + n.stringify(e.requestParams) : "",
                d = ym.vow.defer(), p = d.promise(), m = e.timeout || 3e4, h = setTimeout(function () {
                    d.reject(u)
                }, m), v = function () {
                    s(i, o), clearTimeout(h), h = null
                };
            e.padding || (o = e.paddingKey || t.prefix() + t.gen(), window[o] = function (e) {
                if (a) {
                    var t = !e || e.error || e[l] && e[l].error;
                    t ? d.reject(t) : d.resolve(e && e[l] || e)
                } else d.resolve(e)
            });
            var y = e.url + (/\?/.test(e.url) ? "&" : "?") + (e.paramName || "callback") + "=" + (e.padding || o) + (e.noCache ? "&_=" + Math.floor(1e7 * Math.random()) : "") + f;
            return e.postprocessUrl && (y = e.postprocessUrl(y)), i = r.create(y), i.onerror = function () {
                d.reject(c)
            }, p.then(v, v), p
        }

        function s(e, t) {
            t && a(t), setTimeout(function () {
                e && e.parentNode && e.parentNode.removeChild(e)
            }, 0)
        }

        function a(e) {
            window[e] = l, setTimeout(function () {
                window[e] = void 0;
                try {
                    delete window[e]
                } catch (t) {
                }
            }, 500)
        }

        var u = {message: "timeoutExceeded"}, c = {message: "scriptError"}, l = function () {
        };
        e(o)
    }), ym.modules.define("system.nextTick", [], function (e) {
        var t = function () {
            var e = [], t = function (t) {
                return 1 === e.push(t)
            }, n = function () {
                var t = e, n = 0, r = e.length;
                for (e = []; r > n;) t[n++]()
            };
            if ("object" == typeof process && process.nextTick) return function (e) {
                t(e) && process.nextTick(n)
            };
            if (global.setImmediate) return function (e) {
                t(e) && global.setImmediate(n)
            };
            if (global.postMessage && !global.opera) {
                var r = !0;
                if (global.attachEvent) {
                    var o = function () {
                        r = !1
                    };
                    global.attachEvent("onmessage", o), global.postMessage("__checkAsync", "*"), global.detachEvent("onmessage", o)
                }
                if (r) {
                    var i = "__ym" + +new Date, s = function (e) {
                        e.data === i && (e.stopPropagation && e.stopPropagation(), n())
                    };
                    return global.addEventListener ? global.addEventListener("message", s, !0) : global.attachEvent("onmessage", s), function (e) {
                        t(e) && global.postMessage(i, "*")
                    }
                }
            }
            var a = global.document;
            if ("onreadystatechange" in a.createElement("script")) {
                var u = a.getElementsByTagName("head")[0], c = function () {
                    var e = a.createElement("script");
                    e.onreadystatechange = function () {
                        e.parentNode.removeChild(e), e = e.onreadystatechange = null, n()
                    }, u.appendChild(e)
                };
                return function (e) {
                    t(e) && c()
                }
            }
            return function (e) {
                t(e) && setTimeout(n, 0)
            }
        }();
        e(t)
    }), ym.modules.define("util.objectKeys", [], function (e) {
        var t = "function" == typeof Object.keys ? Object.keys : function (e) {
            var t = [];
            for (var n in e) e.hasOwnProperty(n) && t.push(n);
            return t
        };
        e(function (e) {
            var n, r = typeof e;
            if ("object" != r && "function" != r) throw new TypeError("Object.keys called on non-object");
            return n = t(e)
        })
    }), ym.modules.define("util.providePackage", ["system.mergeImports"], function (e, t) {
        e(function (e, n) {
            var r = n[0], o = Array.prototype.slice.call(n, 1), i = t.joinImports(e.name, {}, e.deps, o);
            r(i)
        })
    }), ym.modules.define("util.querystring", [], function (e) {
        function t(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }

        e({
            parse: function (e, n, r, o) {
                n = n || "&", r = r || "=", o = o || {};
                for (var i, s, a, u = o.decodeURIComponent || decodeURIComponent, c = {}, l = e.split(n), f = 0; f < l.length; ++f) i = l[f].split(r), s = u(i[0]), a = u(i.slice(1).join(r)), t(c[s]) ? c[s].push(a) : c[s] = c.hasOwnProperty(s) ? [c[s], a] : a;
                return c
            }, stringify: function (e, n, r, o) {
                n = n || "&", r = r || "=", o = o || {};
                var i, s, a = o.encodeURIComponent || encodeURIComponent, u = [];
                for (i in e) if (e.hasOwnProperty(i)) if (s = e[i], t(s)) for (var c = 0; c < s.length; ++c) "undefined" != typeof s && u.push(a(i) + r + a(s)); else "undefined" != typeof s && u.push(a(i) + r + a(s));
                return u.join(n)
            }
        })
    }), ym.modules.define("util.script", [], function (e) {
        var t = document.getElementsByTagName("head")[0];
        e({
            create: function (e, n) {
                var r = document.createElement("script");
                return r.charset = n || "utf-8", r.src = e, setTimeout(function () {
                    t.insertBefore(r, t.firstChild)
                }, 0), r
            }
        })
    }), ym.modules.define("ymaps", ["config", "params", "js-loader"], function (e, t, n, r) {
        function o() {
            e(window[i])
        }

        var i = n.ns, s = window[i], a = i + "loader";
        if (s && !window[a]) s.ready(o); else if (window[a]) window[a].queue.push(o); else {
            var u = "fid" + n.tid, c = t.host;
            0 === c.indexOf("/") && (c = "https:" + c);
            var l = c + t.apiVersion + "/",
                f = ["Map", "GeoObject", "geoObject.addon.balloon", "map.associate.serviceGeoObjects", "geoObject.addon.hint", "templateLayoutFactory", "domEvent.manager", "control.Button", "control.FullscreenControl", "control.GeolocationControl", "control.RouteButton", "control.RulerControl", "control.SearchControl", "control.TrafficControl", "control.TypeSelector", "control.ZoomControl", "system.browser", "meta", "mapType.storage", "option.presetStorage", "geolocation", "util.dom.styleSheet"];
            l = [l, "?lang=", n.lang, "&coordorder=longlat&load=", f.join(","), "&wizard=constructor&ns=", n.ns, "&counter_prefix=constructor"].join(""), n.csp && (l += "&csp=true"), n.key && (l += "&key=" + n.key), n.apikey && (l += "&apikey=" + n.apikey), "debug" === n.mode && (l += "&mode=debug"), r(l + "&onload=" + u), window[u] = function (e) {
                e.ready(function () {
                    function e() {
                        var e = window[a];
                        try {
                            delete window[u], delete window[a]
                        } catch (t) {
                            window[u] = window[a] = null
                        }
                        for (var n = 0, r = e.queue.length; r > n; n++) e.queue[n]()
                    }

                    e()
                })
            }, window[a] = {queue: [o], callback: window[u]}
        }
    }), ym.modules.define("check-size-component", ["config", "params", "distribution"], function (e, t, n, r) {
        var o;
        e(function (e) {
            function i() {
                e.container.events.add(["fullscreenenter", "fullscreenexit"], a), window.attachEvent ? window.attachEvent("onresize", a) : window.addEventListener("resize", a)
            }

            function s() {
                e.container.events.remove(["fullscreenenter", "fullscreenexit"], a), window.detachEvent ? window.detachEvent("onresize", a) : window.removeEventListener("resize", a)
            }

            function a() {
                var i, s = document.documentElement;
                if (e.container.isFullscreen()) i = [s.clientWidth, s.clientHeight]; else {
                    var u = e.container.getParentElement().getBoundingClientRect();
                    i = [u.width, u.height]
                }
                var c = t.minContainerSize, l = "0,0" === i.toString(), f = i[0] < c[0], d = !l && (f || i[1] < c[1]),
                    p = ["rulerControl", "trafficControl", "geolocationControl"];
                n.isApiKeyValid && p.push("routeButtonControl", "searchControl");
                for (var m = 0, h = p.length; h > m; m++) e.controls.get(p[m]).options.set("visible", !d);
                (e.state.get("narrowMode") || !e.options.get("suppressMapOpenBlock", !1)) && (e.state.get("narrowMode") !== f ? f ? r.show(e) : r.hide(e) : f && r.onResize(e)), e.state.get("compactMode") !== d && (d ? (n.isApiKeyValid || e.controls.remove("typeSelector"), e.controls.get("zoomControl").options.set({
                    position: {
                        top: 10,
                        left: 10
                    }, size: "small"
                })) : (n.isApiKeyValid || e.controls.add("typeSelector"), e.controls.get("zoomControl").options.unset(["position", "size"]))), l ? o || (o = window.setInterval(a, 200)) : o && (window.clearInterval(o), o = 0), e.state.set({
                    compactMode: d,
                    narrowMode: f
                })
            }

            e.events.add("destroy", s), i(), a()
        })
    }), ym.modules.define("distribution", ["config", "params", "ymaps", "ymaps-counter", "ie-version", "cnst.localization", "map-data"], function (e, t, n, r, o, i, s, a) {
        function u(e) {
            function t(e) {
                var t = e.getElement();
                t && t.firstChild && t.parentNode && (t.firstChild.style.width = "100%", t.firstChild.firstChild && (t.firstChild.firstChild.style.padding = "0px"))
            }

            y = "cnst_" + (new Date).getTime();
            var n = y + "-button", o = r.util.dom.styleSheet;
            o.addStyle("." + n, "{display: block; text-align:center;}"), o.addStyle("." + n + "-inner", "{ " + m + "} "), v = new r.control.Button({
                data: {content: ['<ymaps class="' + n + '">', '<ymaps class="' + y + " " + n + '-inner">', d, "</ymaps>", "</ymaps>"].join("")},
                options: {maxWidth: "99999", selectOnClick: !1}
            }), e.controls.add(v, {
                position: {
                    left: 10,
                    right: 10,
                    bottom: 5
                }
            }), v.getLayoutSync() ? t(v.getLayoutSync()) : v.getLayout().then(t), e.panes.get("copyrights").getElement().style.marginBottom = "29px", c(e)
        }

        function c(e) {
            function t(t) {
                var n = t.getElement().querySelector("." + y), r = e.container.getSize();
                r[0] < 175 ? (n.style.paddingLeft = "0px", n.style.backgroundImage = null) : (n.style.paddingLeft = "18px", n.style.backgroundImage = "url(" + p + ")")
            }

            9 > i || v && (v.getLayoutSync() ? t(v.getLayoutSync()) : v.getLayout().then(t))
        }

        function l(e) {
            e.controls.remove("fullscreenControl")
        }

        function f(e) {
            e.controls.add("fullscreenControl")
        }

        var d = s.move_to_map,
            p = ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAxNCAyMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtLjUgLS4yMjIpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik01LjUgMjMuMjIybDUuNTM1LTcuNTdzMS42LTIuMTg1IDIuNjEtNC4xNWMxLjAxLTEuOTY2Ljg0NS00LjI4Ljg0NS00LjI4TDggMTMuMiA1LjUgMjMuMjJ6IiBmaWxsPSIjQ0QwMDAwIi8+PGNpcmNsZSBmaWxsPSIjRTAwIiBjeD0iNy41IiBjeT0iNy4yMjIiIHI9IjciLz48ZWxsaXBzZSBmaWxsPSIjRkZGIiBjeD0iNy41IiBjeT0iNy4yMjIiIHJ4PSIzIiByeT0iMyIvPjwvZz48L3N2Zz4="].join(""),
            m = "background-size: 10px 16px; background-repeat: no-repeat; background-position: left center;display: inline-block;";
        9 > i && (m = "");
        var h, v, y;
        e({
            show: function (e) {
                function n(e) {
                    o.countByKey("distribution", [e, r.system.browser.platform, r.meta.version.replace(/\W/g, "_")].join("."))
                }

                e.options.set({
                    copyrightLogoVisible: !1,
                    suppressMapOpenBlock: !0
                }), u(e), l(e), v.events.add("click", function () {
                    window.open(t.mapHost + "?um=" + encodeURIComponent(a.maps[0].properties.sid) + "&source=constructor"), n("mapsButton-constructor.smallMap")
                })
            }, onResize: function (e) {
                c(e)
            }, hide: function (e) {
                v && e.controls.remove(v), f(e), e.panes.get("copyrights").getElement().style.marginBottom = "0px", e.options.unset(["copyrightLogoVisible", "suppressMapOpenBlock"]), h && (h.removeAll(), h = null)
            }
        })
    }), ym.modules.define("ymaps-counter", ["ymaps"], function (e, t) {
        var n;
        e({
            countByKey: function (e, r) {
                n || (n = t.modules.require("yandex.counter").then(function (e) {
                    return e[0]
                })), n.then(function (t) {
                    return t.countByKey(e, r), t
                })
            }
        })
    })
}(this);