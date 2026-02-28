(function() {
  const f = "data-ln-ajax", d = "lnAjax";
  if (window[d] !== void 0)
    return;
  function b(e, o, r) {
    e.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function v(e, o, r) {
    var t = new CustomEvent(o, {
      bubbles: !0,
      cancelable: !0,
      detail: r || {}
    });
    return e.dispatchEvent(t), t;
  }
  function m(e) {
    if (!e.hasAttribute(f) || e[d])
      return;
    e[d] = !0;
    const o = a(e);
    g(o.links), y(o.forms);
  }
  function g(e) {
    e.forEach(function(o) {
      if (o._lnAjaxAttached) return;
      const r = o.getAttribute("href");
      r && r.includes("#") || (o._lnAjaxAttached = !0, o.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1)
          return;
        t.preventDefault();
        const c = o.getAttribute("href");
        c && i("GET", c, null, o);
      }));
    });
  }
  function y(e) {
    e.forEach(function(o) {
      o._lnAjaxAttached || (o._lnAjaxAttached = !0, o.addEventListener("submit", function(r) {
        r.preventDefault();
        const t = o.method.toUpperCase(), c = o.action, s = new FormData(o);
        o.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
          u.disabled = !0;
        }), i(t, c, s, o, function() {
          o.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
            u.disabled = !1;
          });
        });
      }));
    });
  }
  function i(e, o, r, t, c) {
    var s = v(t, "ln-ajax:before-start", { method: e, url: o });
    if (s.defaultPrevented) return;
    b(t, "ln-ajax:start", { method: e, url: o }), t.classList.add("ln-ajax--loading");
    const u = document.createElement("span");
    u.className = "ln-ajax-spinner", t.appendChild(u);
    function h() {
      t.classList.remove("ln-ajax--loading");
      const E = t.querySelector(".ln-ajax-spinner");
      E && E.remove(), c && c();
    }
    let _ = o;
    const w = document.querySelector('meta[name="csrf-token"]'), A = w ? w.getAttribute("content") : null;
    r instanceof FormData && A && r.append("_token", A);
    const S = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (S.headers["X-CSRF-TOKEN"] = A), e === "GET" && r) {
      const E = new URLSearchParams(r);
      _ = o + (o.includes("?") ? "&" : "?") + E.toString();
    } else e !== "GET" && r && (S.body = r);
    fetch(_, S).then((E) => E.json()).then((E) => {
      if (E.title && (document.title = E.title), E.content)
        for (let T in E.content) {
          const O = document.getElementById(T);
          O && (O.innerHTML = E.content[T]);
        }
      if (t.tagName === "A") {
        const T = t.getAttribute("href");
        T && window.history.pushState({ ajax: !0 }, "", T);
      } else t.tagName === "FORM" && t.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
      b(t, "ln-ajax:success", { method: e, url: _, data: E }), b(t, "ln-ajax:complete", { method: e, url: _ }), h();
    }).catch((E) => {
      b(t, "ln-ajax:error", { method: e, url: _, error: E }), b(t, "ln-ajax:complete", { method: e, url: _ }), h();
    });
  }
  function a(e) {
    const o = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(f) !== "false" ? o.links.push(e) : e.tagName === "FORM" && e.getAttribute(f) !== "false" ? o.forms.push(e) : (o.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function n() {
    new MutationObserver(function(o) {
      o.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          if (t.nodeType === 1 && (m(t), !t.hasAttribute(f))) {
            t.querySelectorAll("[" + f + "]").forEach(function(u) {
              m(u);
            });
            var c = t.closest && t.closest("[" + f + "]");
            if (c && c.getAttribute(f) !== "false") {
              var s = a(t);
              console.log("[ln-ajax] re-attach on injected node:", t, "links:", s.links.length, "forms:", s.forms.length), g(s.links), y(s.forms);
            }
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function l() {
    document.querySelectorAll("[" + f + "]").forEach(function(e) {
      m(e);
    });
  }
  window[d] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const f = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0)
    return;
  function b(e, o, r) {
    e.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: Object.assign({ modalId: e.id, target: e }, {})
    }));
  }
  function v(e, o) {
    var r = new CustomEvent(o, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: e.id, target: e }
    });
    return e.dispatchEvent(r), r;
  }
  function m(e) {
    const o = document.getElementById(e);
    if (!o) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    var r = v(o, "ln-modal:before-open");
    r.defaultPrevented || (o.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), b(o, "ln-modal:open"));
  }
  function g(e) {
    const o = document.getElementById(e);
    if (o) {
      var r = v(o, "ln-modal:before-close");
      r.defaultPrevented || (o.classList.remove("ln-modal--open"), b(o, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
    }
  }
  function y(e) {
    const o = document.getElementById(e);
    if (!o) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    o.classList.contains("ln-modal--open") ? g(e) : m(e);
  }
  function i(e) {
    const o = e.querySelectorAll("[data-ln-modal-close]"), r = e.id;
    o.forEach(function(t) {
      t._lnModalCloseAttached || (t._lnModalCloseAttached = !0, t.addEventListener("click", function(c) {
        c.preventDefault(), g(r);
      }));
    });
  }
  function a(e) {
    e.forEach(function(o) {
      o._lnModalAttached || (o._lnModalAttached = !0, o.addEventListener("click", function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1)
          return;
        r.preventDefault();
        const t = o.getAttribute(f);
        t && y(t);
      }));
    });
  }
  function n() {
    const e = document.querySelectorAll("[" + f + "]");
    a(e), document.querySelectorAll(".ln-modal").forEach(function(r) {
      i(r);
    }), document.addEventListener("keydown", function(r) {
      r.key === "Escape" && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(c) {
        g(c.id);
      });
    });
  }
  function l() {
    new MutationObserver(function(o) {
      o.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          if (t.nodeType === 1) {
            t.hasAttribute(f) && a([t]);
            const c = t.querySelectorAll("[" + f + "]");
            c.length > 0 && a(c), t.id && t.classList.contains("ln-modal") && i(t);
            const s = t.querySelectorAll(".ln-modal");
            s.length > 0 && s.forEach(function(u) {
              i(u);
            });
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = {
    open: m,
    close: g,
    toggle: y
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const f = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0)
    return;
  const b = /* @__PURE__ */ new WeakMap();
  var v = [];
  if (!history._lnNavPatched) {
    var m = history.pushState;
    history.pushState = function() {
      m.apply(history, arguments), v.forEach(function(e) {
        e();
      });
    }, history._lnNavPatched = !0;
  }
  function g(e) {
    if (!e.hasAttribute(f) || b.has(e)) return;
    const o = e.getAttribute(f);
    if (!o) return;
    const r = y(e, o);
    b.set(e, r);
  }
  function y(e, o) {
    let r = Array.from(e.querySelectorAll("a"));
    a(r, o, window.location.pathname);
    var t = function() {
      r = Array.from(e.querySelectorAll("a")), a(r, o, window.location.pathname);
    };
    window.addEventListener("popstate", t), v.push(t);
    const c = new MutationObserver(function(s) {
      s.forEach(function(u) {
        u.type === "childList" && (u.addedNodes.forEach(function(h) {
          if (h.nodeType === 1) {
            if (h.tagName === "A")
              r.push(h), a([h], o, window.location.pathname);
            else if (h.querySelectorAll) {
              const _ = Array.from(h.querySelectorAll("a"));
              r = r.concat(_), a(_, o, window.location.pathname);
            }
          }
        }), u.removedNodes.forEach(function(h) {
          if (h.nodeType === 1) {
            if (h.tagName === "A")
              r = r.filter(function(_) {
                return _ !== h;
              });
            else if (h.querySelectorAll) {
              const _ = Array.from(h.querySelectorAll("a"));
              r = r.filter(function(w) {
                return !_.includes(w);
              });
            }
          }
        }));
      });
    });
    return c.observe(e, { childList: !0, subtree: !0 }), { navElement: e, activeClass: o, observer: c };
  }
  function i(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function a(e, o, r) {
    const t = i(r);
    e.forEach(function(c) {
      const s = c.getAttribute("href");
      if (!s) return;
      const u = i(s);
      c.classList.remove(o);
      const h = u === t, _ = u !== "/" && t.startsWith(u + "/");
      (h || _) && c.classList.add(o);
    });
  }
  function n() {
    var e = new MutationObserver(function(o) {
      o.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          t.nodeType === 1 && (t.hasAttribute && t.hasAttribute(f) && g(t), t.querySelectorAll && t.querySelectorAll("[" + f + "]").forEach(g));
        });
      });
    });
    e.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[d] = g;
  function l() {
    document.querySelectorAll("[" + f + "]").forEach(g);
  }
  n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const f = window.TomSelect;
  if (!f) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const d = /* @__PURE__ */ new WeakMap();
  function b(y) {
    if (d.has(y))
      return;
    const i = y.getAttribute("data-ln-select");
    let a = {};
    if (i && i.trim() !== "")
      try {
        a = JSON.parse(i);
      } catch (e) {
        console.warn("Invalid JSON in data-ln-select attribute:", e);
      }
    const l = { ...{
      // Allow clearing selection
      allowEmptyOption: !0,
      // Show dropdown arrow
      controlInput: null,
      // Disable creation by default
      create: !1,
      // Highlight matching text
      highlight: !0,
      // Close dropdown after selection (for single select)
      closeAfterSelect: !0,
      // Placeholder handling
      placeholder: y.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...a };
    try {
      const e = new f(y, l);
      d.set(y, e);
      const o = y.closest("form");
      o && o.addEventListener("reset", () => {
        setTimeout(() => {
          e.clear(), e.clearOptions(), e.sync();
        }, 0);
      });
    } catch (e) {
      console.error("Failed to initialize Tom Select:", e);
    }
  }
  function v(y) {
    const i = d.get(y);
    i && (i.destroy(), d.delete(y));
  }
  function m() {
    document.querySelectorAll("select[data-ln-select]").forEach(b);
  }
  function g() {
    new MutationObserver((i) => {
      i.forEach((a) => {
        a.addedNodes.forEach((n) => {
          n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && b(n), n.querySelectorAll && n.querySelectorAll("select[data-ln-select]").forEach(b));
        }), a.removedNodes.forEach((n) => {
          n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && v(n), n.querySelectorAll && n.querySelectorAll("select[data-ln-select]").forEach(v));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    m(), g();
  }) : (m(), g()), window.lnSelect = {
    initialize: b,
    destroy: v,
    getInstance: (y) => d.get(y)
  };
})();
(function() {
  const f = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function b(n = document.body) {
    v(n);
  }
  function v(n) {
    if (n.nodeType !== 1) return;
    let l = Array.from(n.querySelectorAll("[" + f + "]"));
    n.hasAttribute && n.hasAttribute(f) && l.push(n), l.forEach(function(e) {
      e[d] || (e[d] = new g(e));
    });
  }
  function m() {
    const n = (location.hash || "").replace("#", ""), l = {};
    return n && n.split("&").forEach(function(e) {
      const o = e.indexOf(":");
      o > 0 && (l[e.slice(0, o)] = e.slice(o + 1));
    }), l;
  }
  function g(n) {
    return this.dom = n, y.call(this), this;
  }
  function y() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const l = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      l && (this.mapTabs[l] = n);
    }
    for (const n of this.panels) {
      const l = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      l && (this.mapPanels[l] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.tabs.forEach((n) => {
      n.addEventListener("click", () => {
        const l = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (l)
          if (this.hashEnabled) {
            const e = m();
            e[this.nsKey] = l;
            const o = Object.keys(e).map(function(r) {
              return r + ":" + e[r];
            }).join("&");
            location.hash === "#" + o ? this.activate(l) : location.hash = o;
          } else
            this.activate(l);
      });
    }), this._hashHandler = () => {
      if (!this.hashEnabled) return;
      const n = m();
      this.activate(this.nsKey in n ? n[this.nsKey] : this.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  g.prototype.activate = function(n) {
    var l;
    (!n || !(n in this.mapPanels)) && (n = this.defaultKey);
    for (const e in this.mapTabs) {
      const o = this.mapTabs[e];
      e === n ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const o = this.mapPanels[e], r = e === n;
      o.classList.toggle("hidden", !r), o.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (l = this.mapPanels[n]) == null ? void 0 : l.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    i(this.dom, "ln-tabs:change", { key: n, tab: this.mapTabs[n], panel: this.mapPanels[n] });
  };
  function i(n, l, e) {
    n.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function a() {
    new MutationObserver(function(l) {
      l.forEach(function(e) {
        e.addedNodes.forEach(function(o) {
          v(o);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  a(), window[d] = b, b(document.body);
})();
(function() {
  const f = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function b(n) {
    v(n), m(n);
  }
  function v(n) {
    var l = Array.from(n.querySelectorAll("[" + f + "]"));
    n.hasAttribute && n.hasAttribute(f) && l.push(n), l.forEach(function(e) {
      e[d] || (e[d] = new g(e));
    });
  }
  function m(n) {
    var l = Array.from(n.querySelectorAll("[data-ln-toggle-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-toggle-for") && l.push(n), l.forEach(function(e) {
      e[d + "Trigger"] || (e[d + "Trigger"] = !0, e.addEventListener("click", function(o) {
        if (!(o.ctrlKey || o.metaKey || o.button === 1)) {
          o.preventDefault();
          var r = e.getAttribute("data-ln-toggle-for"), t = document.getElementById(r);
          if (!(!t || !t[d])) {
            var c = e.getAttribute("data-ln-toggle-action") || "toggle";
            t[d][c]();
          }
        }
      }));
    });
  }
  function g(n) {
    this.dom = n, this.isOpen = n.getAttribute(f) === "open", this.isOpen && n.classList.add("open");
    var l = this;
    return n.addEventListener("ln-toggle:request-close", function() {
      l.isOpen && l.close();
    }), n.addEventListener("ln-toggle:request-open", function() {
      l.isOpen || l.open();
    }), this;
  }
  g.prototype.open = function() {
    if (!this.isOpen) {
      var n = i(this.dom, "ln-toggle:before-open", { target: this.dom });
      n.defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), y(this.dom, "ln-toggle:open", { target: this.dom }));
    }
  }, g.prototype.close = function() {
    if (this.isOpen) {
      var n = i(this.dom, "ln-toggle:before-close", { target: this.dom });
      n.defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), y(this.dom, "ln-toggle:close", { target: this.dom }));
    }
  }, g.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  function y(n, l, e) {
    n.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function i(n, l, e) {
    var o = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return n.dispatchEvent(o), o;
  }
  function a() {
    var n = new MutationObserver(function(l) {
      l.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(o) {
          o.nodeType === 1 && (v(o), m(o));
        });
      });
    });
    n.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = b, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function b(i) {
    v(i);
  }
  function v(i) {
    var a = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && a.push(i), a.forEach(function(n) {
      n[d] || (n[d] = new m(n));
    });
  }
  function m(i) {
    return this.dom = i, i.addEventListener("ln-toggle:open", function(a) {
      var n = i.querySelectorAll("[data-ln-toggle]");
      n.forEach(function(l) {
        l !== a.detail.target && l.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
      }), g(i, "ln-accordion:change", { target: a.detail.target });
    }), this;
  }
  function g(i, a, n) {
    i.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function y() {
    var i = new MutationObserver(function(a) {
      a.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(l) {
          l.nodeType === 1 && v(l);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = b, y(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-toast", d = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[d] !== void 0 && window[d] !== null) return;
  function v(r = document.body) {
    return m(r), e;
  }
  function m(r) {
    if (!r || r.nodeType !== 1) return;
    let t = Array.from(r.querySelectorAll("[" + f + "]"));
    r.hasAttribute && r.hasAttribute(f) && t.push(r), t.forEach((c) => {
      c[d] || new g(c);
    });
  }
  function g(r) {
    return this.dom = r, r[d] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10), Array.from(r.querySelectorAll("[data-ln-toast-item]")).forEach((t) => {
      y(t);
    }), this;
  }
  function y(r) {
    const t = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), c = r.getAttribute("data-title"), s = (r.innerText || r.textContent || "").trim();
    r.className = "ln-toast__item", r.removeAttribute("data-ln-toast-item");
    const u = document.createElement("div");
    u.className = "ln-toast__card ln-toast__card--" + t, u.setAttribute("role", t === "error" ? "alert" : "status"), u.setAttribute("aria-live", t === "error" ? "assertive" : "polite");
    const h = document.createElement("div");
    h.className = "ln-toast__side", h.innerHTML = b[t] || b.info;
    const _ = document.createElement("div");
    _.className = "ln-toast__content";
    const w = document.createElement("div");
    w.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = c || (t === "success" ? "Success" : t === "error" ? "Error" : t === "warn" ? "Warning" : "Information");
    const S = document.createElement("button");
    if (S.type = "button", S.className = "ln-toast__close ln-icon-close", S.setAttribute("aria-label", "Close"), S.addEventListener("click", () => a(r)), w.appendChild(A), _.appendChild(w), _.appendChild(S), s) {
      const E = document.createElement("div");
      E.className = "ln-toast__body";
      const T = document.createElement("p");
      T.textContent = s, E.appendChild(T), _.appendChild(E);
    }
    u.appendChild(h), u.appendChild(_), r.innerHTML = "", r.appendChild(u), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function i(r, t) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(t), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function a(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function n(r = {}) {
    let t = r.container;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), !t) return null;
    const c = t[d] || new g(t), s = Number.isFinite(r.timeout) ? r.timeout : c.timeoutDefault, u = (r.type || "info").toLowerCase(), h = document.createElement("li");
    h.className = "ln-toast__item";
    const _ = document.createElement("div");
    _.className = "ln-toast__card ln-toast__card--" + u, _.setAttribute("role", u === "error" ? "alert" : "status"), _.setAttribute("aria-live", u === "error" ? "assertive" : "polite");
    const w = document.createElement("div");
    w.className = "ln-toast__side", w.innerHTML = b[u] || b.info;
    const A = document.createElement("div");
    A.className = "ln-toast__content";
    const S = document.createElement("div");
    S.className = "ln-toast__head";
    const E = document.createElement("strong");
    E.className = "ln-toast__title", E.textContent = r.title || (u === "success" ? "Success" : u === "error" ? "Error" : u === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close ln-icon-close", T.setAttribute("aria-label", "Close"), T.addEventListener("click", () => a(h)), S.appendChild(E), A.appendChild(S), A.appendChild(T), r.message || r.data && r.data.errors) {
      const O = document.createElement("div");
      if (O.className = "ln-toast__body", r.message)
        if (Array.isArray(r.message)) {
          const k = document.createElement("ul");
          r.message.forEach(function(D) {
            const p = document.createElement("li");
            p.textContent = D, k.appendChild(p);
          }), O.appendChild(k);
        } else {
          const k = document.createElement("p");
          k.textContent = r.message, O.appendChild(k);
        }
      if (r.data && r.data.errors) {
        const k = document.createElement("ul");
        Object.values(r.data.errors).flat().forEach((D) => {
          const p = document.createElement("li");
          p.textContent = D, k.appendChild(p);
        }), O.appendChild(k);
      }
      A.appendChild(O);
    }
    return _.appendChild(w), _.appendChild(A), h.appendChild(_), i(c, h), s > 0 && (h._timer = setTimeout(() => a(h), s)), h;
  }
  function l(r) {
    let t = r;
    typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), t && Array.from(t.children).forEach(a);
  }
  const e = function(r) {
    return v(r);
  };
  e.enqueue = n, e.clear = l, new MutationObserver((r) => {
    r.forEach((t) => t.addedNodes.forEach((c) => m(c)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[d] = e, window.addEventListener("ln-toast:enqueue", function(r) {
    r.detail && e.enqueue(r.detail);
  }), v(document.body);
})();
(function() {
  const f = "data-ln-upload", d = "lnUpload", b = "data-ln-upload-dict", v = "data-ln-upload-accept", m = "data-ln-upload-context";
  if (window[d] !== void 0)
    return;
  function g(t, c) {
    const s = t.querySelector("[" + b + '="' + c + '"]');
    return s ? s.textContent : c;
  }
  function y(t) {
    if (t === 0) return "0 B";
    const c = 1024, s = ["B", "KB", "MB", "GB"], u = Math.floor(Math.log(t) / Math.log(c));
    return parseFloat((t / Math.pow(c, u)).toFixed(1)) + " " + s[u];
  }
  function i(t) {
    return t.split(".").pop().toLowerCase();
  }
  function a(t) {
    return t === "docx" && (t = "doc"), ["pdf", "doc", "epub"].includes(t) ? "ln-icon-file-" + t : "ln-icon-file";
  }
  function n(t, c) {
    if (!c) return !0;
    const s = "." + i(t.name);
    return c.split(",").map(function(h) {
      return h.trim().toLowerCase();
    }).includes(s.toLowerCase());
  }
  function l(t, c, s) {
    t.dispatchEvent(new CustomEvent(c, {
      bubbles: !0,
      detail: s
    }));
  }
  function e(t) {
    if (t.hasAttribute("data-ln-upload-initialized")) return;
    t.setAttribute("data-ln-upload-initialized", "true");
    const c = t.querySelector(".ln-upload__zone"), s = t.querySelector(".ln-upload__list"), u = t.getAttribute(v) || "";
    let h = t.querySelector('input[type="file"]');
    h || (h = document.createElement("input"), h.type = "file", h.multiple = !0, h.style.display = "none", u && (h.accept = u.split(",").map(function(p) {
      return p = p.trim(), p.startsWith(".") ? p : "." + p;
    }).join(",")), t.appendChild(h));
    const _ = t.getAttribute(f) || "/files/upload", w = t.getAttribute(m) || "", A = /* @__PURE__ */ new Map();
    let S = 0;
    function E() {
      const p = document.querySelector('meta[name="csrf-token"]');
      return p ? p.getAttribute("content") : "";
    }
    function T(p) {
      if (!n(p, u)) {
        const C = g(t, "invalid-type");
        l(t, "ln-upload:invalid", {
          file: p,
          message: C
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: C || "This file type is not allowed"
          }
        }));
        return;
      }
      const L = "file-" + ++S, M = i(p.name), B = a(M), x = document.createElement("li");
      x.className = "ln-upload__item ln-upload__item--uploading " + B, x.setAttribute("data-file-id", L);
      const F = document.createElement("span");
      F.className = "ln-upload__name", F.textContent = p.name;
      const I = document.createElement("span");
      I.className = "ln-upload__size", I.textContent = "0%";
      const N = document.createElement("button");
      N.type = "button", N.className = "ln-upload__remove ln-icon-close", N.title = g(t, "remove"), N.textContent = "×", N.disabled = !0;
      const K = document.createElement("div");
      K.className = "ln-upload__progress";
      const z = document.createElement("div");
      z.className = "ln-upload__progress-bar", K.appendChild(z), x.appendChild(F), x.appendChild(I), x.appendChild(N), x.appendChild(K), s.appendChild(x);
      const P = new FormData();
      P.append("file", p), P.append("context", w);
      const q = new XMLHttpRequest();
      q.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const j = Math.round(C.loaded / C.total * 100);
          z.style.width = j + "%", I.textContent = j + "%";
        }
      }), q.addEventListener("load", function() {
        if (q.status >= 200 && q.status < 300) {
          var C;
          try {
            C = JSON.parse(q.responseText);
          } catch {
            R("Invalid response");
            return;
          }
          x.classList.remove("ln-upload__item--uploading"), I.textContent = y(C.size || p.size), N.disabled = !1, A.set(L, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), O(), l(t, "ln-upload:uploaded", {
            localId: L,
            serverId: C.id,
            name: C.name
          });
        } else {
          var j = "Upload failed";
          try {
            var U = JSON.parse(q.responseText);
            j = U.message || j;
          } catch {
          }
          R(j);
        }
      }), q.addEventListener("error", function() {
        R("Network error");
      });
      function R(C) {
        x.classList.remove("ln-upload__item--uploading"), x.classList.add("ln-upload__item--error"), z.style.width = "100%", I.textContent = g(t, "error"), N.disabled = !1, l(t, "ln-upload:error", {
          file: p,
          message: C
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: C || g(t, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      q.open("POST", _), q.setRequestHeader("X-CSRF-TOKEN", E()), q.setRequestHeader("Accept", "application/json"), q.send(P);
    }
    function O() {
      t.querySelectorAll('input[name="file_ids[]"]').forEach(function(p) {
        p.remove();
      }), A.forEach(function(p) {
        const L = document.createElement("input");
        L.type = "hidden", L.name = "file_ids[]", L.value = p.serverId, t.appendChild(L);
      });
    }
    function k(p) {
      const L = A.get(p), M = s.querySelector('[data-file-id="' + p + '"]');
      if (!L || !L.serverId) {
        M && M.remove(), A.delete(p), O();
        return;
      }
      M && M.classList.add("ln-upload__item--deleting"), fetch("/files/" + L.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": E(),
          Accept: "application/json"
        }
      }).then((B) => {
        B.status === 200 ? (M && M.remove(), A.delete(p), O(), l(t, "ln-upload:removed", {
          localId: p,
          serverId: L.serverId
        })) : (M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: g(t, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((B) => {
        console.error("Delete error:", B), M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function D(p) {
      Array.from(p).forEach(function(L) {
        T(L);
      }), h.value = "";
    }
    c.addEventListener("click", function() {
      h.click();
    }), h.addEventListener("change", function() {
      D(this.files);
    }), c.addEventListener("dragenter", function(p) {
      p.preventDefault(), p.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragover", function(p) {
      p.preventDefault(), p.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragleave", function(p) {
      p.preventDefault(), p.stopPropagation(), c.classList.remove("ln-upload__zone--dragover");
    }), c.addEventListener("drop", function(p) {
      p.preventDefault(), p.stopPropagation(), c.classList.remove("ln-upload__zone--dragover"), D(p.dataTransfer.files);
    }), s.addEventListener("click", function(p) {
      if (p.target.classList.contains("ln-upload__remove")) {
        const L = p.target.closest(".ln-upload__item");
        L && k(L.getAttribute("data-file-id"));
      }
    }), t.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(p) {
          return p.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        A.forEach(function(p) {
          p.serverId && fetch("/files/" + p.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": E(),
              Accept: "application/json"
            }
          });
        }), A.clear(), s.innerHTML = "", O(), l(t, "ln-upload:cleared", {});
      }
    };
  }
  function o() {
    document.querySelectorAll("[" + f + "]").forEach(e);
  }
  function r() {
    new MutationObserver(function(c) {
      c.forEach(function(s) {
        s.type === "childList" && s.addedNodes.forEach(function(u) {
          u.nodeType === 1 && (u.hasAttribute(f) && e(u), u.querySelectorAll("[" + f + "]").forEach(e));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = {
    init: e,
    initAll: o
  }, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const f = "lnExternalLinks";
  if (window[f] !== void 0)
    return;
  function d(a, n, l) {
    a.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: l
    }));
  }
  function b(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function v(a) {
    a.getAttribute("data-ln-external-link") !== "processed" && b(a) && (a.target = "_blank", a.rel = "noopener noreferrer", a.setAttribute("data-ln-external-link", "processed"), d(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    }));
  }
  function m(a) {
    a = a || document.body, a.querySelectorAll("a, area").forEach(function(l) {
      v(l);
    });
  }
  function g() {
    document.body.addEventListener("click", function(a) {
      const n = a.target.closest("a, area");
      n && n.getAttribute("data-ln-external-link") === "processed" && d(n, "ln-external-links:clicked", {
        link: n,
        href: n.href,
        text: n.textContent || n.title || ""
      });
    });
  }
  function y() {
    new MutationObserver(function(n) {
      n.forEach(function(l) {
        l.type === "childList" && l.addedNodes.forEach(function(e) {
          if (e.nodeType === 1) {
            e.matches && (e.matches("a") || e.matches("area")) && v(e);
            const o = e.querySelectorAll && e.querySelectorAll("a, area");
            o && o.forEach(v);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function i() {
    g(), y(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[f] = {
    process: m
  }, i();
})();
(function() {
  const f = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  function b(s, u, h) {
    var _ = new CustomEvent(u, {
      bubbles: !0,
      cancelable: !0,
      detail: h || {}
    });
    return s.dispatchEvent(_), _;
  }
  var v = null;
  function m() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function g(s) {
    v && (v.textContent = s, v.classList.add("ln-link-status--visible"));
  }
  function y() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function i(s, u) {
    if (!u.target.closest("a, button, input, select, textarea")) {
      var h = s.querySelector("a");
      if (h) {
        var _ = h.getAttribute("href");
        if (_) {
          if (u.ctrlKey || u.metaKey || u.button === 1) {
            window.open(_, "_blank");
            return;
          }
          var w = b(s, "ln-link:navigate", { target: s, href: _, link: h });
          w.defaultPrevented || h.click();
        }
      }
    }
  }
  function a(s) {
    var u = s.querySelector("a");
    if (u) {
      var h = u.getAttribute("href");
      h && g(h);
    }
  }
  function n() {
    y();
  }
  function l(s) {
    s._lnLinkInit || (s._lnLinkInit = !0, s.querySelector("a") && (s.addEventListener("click", function(u) {
      i(s, u);
    }), s.addEventListener("mouseenter", function() {
      a(s);
    }), s.addEventListener("mouseleave", n)));
  }
  function e(s) {
    if (!s._lnLinkInit) {
      s._lnLinkInit = !0;
      var u = s.tagName;
      if (u === "TABLE" || u === "TBODY") {
        var h = u === "TABLE" && s.querySelector("tbody") || s, _ = h.querySelectorAll("tr");
        _.forEach(l);
      } else l(s);
    }
  }
  function o(s) {
    s.hasAttribute && s.hasAttribute(f) && e(s);
    var u = s.querySelectorAll ? s.querySelectorAll("[" + f + "]") : [];
    u.forEach(e);
  }
  function r() {
    var s = new MutationObserver(function(u) {
      u.forEach(function(h) {
        h.type === "childList" && h.addedNodes.forEach(function(_) {
          if (_.nodeType === 1 && (o(_), _.tagName === "TR")) {
            var w = _.closest("[" + f + "]");
            w && l(_);
          }
        });
      });
    });
    s.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function t(s) {
    o(s);
  }
  window[d] = { init: t };
  function c() {
    m(), r(), t(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const f = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0)
    return;
  var b = [
    ":host {",
    "    display: flex;",
    "    height: var(--spacing-xs);",
    "    width: 100%;",
    "    border-radius: var(--radius-full);",
    "    background-color: var(--color-bg-body);",
    "    overflow: hidden;",
    "}",
    "::slotted([data-ln-progress]) {",
    "    width: 0;",
    "    transition: width 0.2s ease;",
    "    border-radius: 0;",
    "}",
    "::slotted([data-ln-progress]:last-child) {",
    "    border-top-right-radius: var(--radius-full);",
    "    border-bottom-right-radius: var(--radius-full);",
    "}",
    "::slotted(.green)  { background-color: var(--color-success); }",
    "::slotted(.red)    { background-color: var(--color-error); }",
    "::slotted(.yellow) { background-color: var(--color-warning); }"
  ].join(`
`), v = null;
  function m() {
    if (v) return v;
    try {
      v = new CSSStyleSheet(), v.replaceSync(b);
    } catch {
      v = null;
    }
    return v;
  }
  function g(t) {
    var c = t.getAttribute("data-ln-progress");
    return c !== null && c !== "";
  }
  function y(t) {
    if (!t.shadowRoot) {
      var c = t.attachShadow({ mode: "open" }), s = m();
      if (s)
        c.adoptedStyleSheets = [s];
      else {
        var u = document.createElement("style");
        u.textContent = b, c.appendChild(u);
      }
      c.appendChild(document.createElement("slot"));
    }
  }
  function i(t) {
    n(t);
  }
  function a(t, c, s) {
    t.dispatchEvent(new CustomEvent(c, {
      bubbles: !0,
      composed: !0,
      detail: s || {}
    }));
  }
  function n(t) {
    var c = Array.from(t.querySelectorAll(f));
    c.forEach(function(s) {
      g(s) && !s[d] ? s[d] = new l(s) : g(s) || y(s);
    }), t.hasAttribute && t.hasAttribute("data-ln-progress") && (g(t) && !t[d] ? t[d] = new l(t) : g(t) || y(t));
  }
  function l(t) {
    return this.dom = t, r.call(this), o.call(this), this;
  }
  function e() {
    var t = new MutationObserver(function(c) {
      c.forEach(function(s) {
        s.type === "childList" && s.addedNodes.forEach(function(u) {
          u.nodeType === 1 && n(u);
        });
      });
    });
    t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  e();
  function o() {
    var t = this, c = new MutationObserver(function(s) {
      s.forEach(function(u) {
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && r.call(t);
      });
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function r() {
    var t = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, s = c > 0 ? t / c * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%", a(this.dom, "ln-progress:change", { target: this.dom, value: t, max: c, percentage: s });
  }
  window[d] = i, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
(function() {
  const f = "data-ln-search", d = "lnSearch";
  if (window[d] !== void 0) return;
  function b(i) {
    v(i);
  }
  function v(i) {
    var a = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && a.push(i), a.forEach(function(n) {
      n[d] || (n[d] = new m(n));
    });
  }
  function m(i) {
    return this.dom = i, i[d] = this, this._query = "", this._debounceMs = parseInt(i.getAttribute("data-ln-search-debounce") || "0", 10), this._debounceTimer = null, this._target = null, this._targetObserver = null, this._input = i.querySelector("[data-ln-search-input]"), this._bindEvents(), this;
  }
  m.prototype._bindEvents = function() {
    var i = this;
    this._input && this._input.addEventListener("input", function() {
      var a = i._input.value;
      i._debounceMs > 0 ? (clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
        i.search(a);
      }, i._debounceMs)) : i.search(a);
    });
  }, m.prototype.search = function(i) {
    this._query = (i || "").toLowerCase().trim(), this._input && this._input.value !== (i || "") && (this._input.value = i || ""), this._apply(), this._ensureTargetObserver();
    var a = this._getItems(), n = 0;
    a.forEach(function(l) {
      l.hasAttribute("data-ln-search-hide") || n++;
    }), g(this.dom, "ln-search:input", {
      query: this._query,
      count: n,
      total: a.length
    });
  }, m.prototype.clear = function() {
    this._query = "", this._input && (this._input.value = ""), this._apply();
    var i = this._getItems();
    g(this.dom, "ln-search:clear", {
      count: i.length,
      total: i.length
    });
  }, m.prototype.getQuery = function() {
    return this._query;
  }, m.prototype._resolveTarget = function() {
    if (!this._target) {
      var i = this.dom.getAttribute(f);
      this._target = i ? document.getElementById(i) : null;
    }
    return this._target;
  }, m.prototype._getItems = function() {
    var i = this._resolveTarget();
    return i ? Array.from(i.children) : [];
  }, m.prototype._apply = function() {
    var i = this._query;
    this._getItems().forEach(function(a) {
      i === "" || a.textContent.toLowerCase().indexOf(i) !== -1 ? a.removeAttribute("data-ln-search-hide") : a.setAttribute("data-ln-search-hide", "");
    });
  }, m.prototype._ensureTargetObserver = function() {
    var i = this._resolveTarget();
    if (!(!i || this._targetObserver)) {
      var a = this;
      this._targetObserver = new MutationObserver(function() {
        a._query && a._apply();
      }), this._targetObserver.observe(i, { childList: !0 });
    }
  };
  function g(i, a, n) {
    i.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function y() {
    var i = new MutationObserver(function(a) {
      a.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(l) {
          l.nodeType === 1 && v(l);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = b, y(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-filter", d = "lnFilter";
  if (window[d] !== void 0) return;
  function b(i) {
    v(i);
  }
  function v(i) {
    var a = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && a.push(i), a.forEach(function(n) {
      n[d] || (n[d] = new m(n));
    });
  }
  function m(i) {
    this.dom = i, i[d] = this, this._activeKey = null, this._activeValue = null, this._target = null, this._targetObserver = null, this._bindEvents();
    var a = i.querySelector('[data-ln-filter-key][data-ln-filter-value=""]');
    return a && a.setAttribute("data-active", ""), this;
  }
  m.prototype._bindEvents = function() {
    var i = this;
    this.dom.addEventListener("click", function(a) {
      var n = a.target.closest("[data-ln-filter-key]");
      if (!(!n || !i.dom.contains(n))) {
        var l = n.getAttribute("data-ln-filter-key"), e = n.getAttribute("data-ln-filter-value");
        i.filter(l, e);
      }
    });
  }, m.prototype.filter = function(i, a) {
    var n = Array.from(this.dom.querySelectorAll("[data-ln-filter-key]"));
    n.forEach(function(e) {
      e.removeAttribute("data-active");
    });
    var l = this.dom.querySelector(
      '[data-ln-filter-key="' + i + '"][data-ln-filter-value="' + (a || "") + '"]'
    );
    if (l && l.setAttribute("data-active", ""), !a) {
      this._activeKey = null, this._activeValue = null, this._apply(), g(this.dom, "ln-filter:reset", {});
      return;
    }
    this._activeKey = i, this._activeValue = a, this._apply(), this._ensureTargetObserver(), g(this.dom, "ln-filter:changed", {
      key: i,
      value: a
    });
  }, m.prototype.reset = function() {
    var i = this.dom.querySelector('[data-ln-filter-key][data-ln-filter-value=""]'), a = i ? i.getAttribute("data-ln-filter-key") : "";
    this.filter(a, "");
  }, m.prototype.getActive = function() {
    return this._activeKey ? { key: this._activeKey, value: this._activeValue } : null;
  }, m.prototype._resolveTarget = function() {
    if (!this._target) {
      var i = this.dom.getAttribute(f);
      this._target = i ? document.getElementById(i) : null;
    }
    return this._target;
  }, m.prototype._getItems = function() {
    var i = this._resolveTarget();
    return i ? Array.from(i.children) : [];
  }, m.prototype._apply = function() {
    var i = this._activeKey, a = this._activeValue;
    this._getItems().forEach(function(n) {
      if (!i || !a)
        n.removeAttribute("data-ln-filter-hide");
      else {
        var l = n.getAttribute("data-" + i);
        l !== null && l.toLowerCase().indexOf(a.toLowerCase()) !== -1 ? n.removeAttribute("data-ln-filter-hide") : n.setAttribute("data-ln-filter-hide", "");
      }
    });
  }, m.prototype._ensureTargetObserver = function() {
    var i = this._resolveTarget();
    if (!(!i || this._targetObserver)) {
      var a = this;
      this._targetObserver = new MutationObserver(function() {
        a._activeKey && a._apply();
      }), this._targetObserver.observe(i, { childList: !0 });
    }
  };
  function g(i, a, n) {
    i.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function y() {
    var i = new MutationObserver(function(a) {
      a.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(l) {
          l.nodeType === 1 && v(l);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[d] = b, y(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
