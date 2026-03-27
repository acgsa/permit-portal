"use client";
import { jsx as e, Fragment as w, jsxs as c } from "react/jsx-runtime";
import A, { createContext as E, useState as k, useEffect as M, useCallback as x, useId as C, useRef as $ } from "react";
const F = E({
  theme: "light",
  toggleTheme: () => {
  }
});
function se({ children: n }) {
  const [r, t] = k("light"), [a, l] = k(!1);
  M(() => {
    const i = localStorage.getItem("theme"), h = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    t(i || h), l(!0);
  }, []), M(() => {
    a && (document.documentElement.setAttribute("data-theme", r), localStorage.setItem("theme", r));
  }, [r, a]);
  const s = x(() => {
    t((i) => i === "light" ? "dark" : "light");
  }, []);
  return a ? /* @__PURE__ */ e(F.Provider, { value: { theme: r, toggleTheme: s }, children: n }) : /* @__PURE__ */ e(w, { children: n });
}
const oe = ({ size: n = 14 }) => /* @__PURE__ */ c("svg", { width: n, height: n, viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("line", { x1: "7", y1: "2", x2: "7", y2: "12", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }),
  /* @__PURE__ */ e("line", { x1: "2", y1: "7", x2: "12", y2: "7", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" })
] });
function O({
  variant: n = "primary",
  size: r = "md",
  className: t = "",
  leadingIcon: a,
  trailingIcon: l,
  children: s,
  ...i
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      className: `btn btn-${n} btn-${r} ${t}`,
      ...i,
      children: [
        a,
        s,
        l
      ]
    }
  );
}
function q({
  variant: n = "primary",
  size: r = "md",
  className: t = "",
  leadingIcon: a,
  trailingIcon: l,
  children: s,
  ...i
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      className: `btn btn-pill btn-${n} btn-${r} ${t}`,
      ...i,
      children: [
        a,
        s,
        l
      ]
    }
  );
}
function de({
  variant: n = "primary",
  size: r = "md",
  shape: t = "square",
  className: a = "",
  icon: l,
  label: s,
  ...i
}) {
  const h = t === "circle" ? "btn-icon-circle" : "", p = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24
  }[r], v = A.cloneElement(l, { size: p });
  return /* @__PURE__ */ e(
    "button",
    {
      className: `btn btn-icon ${h} btn-${n} btn-${r} ${a}`,
      "aria-label": s,
      ...i,
      children: v
    }
  );
}
const he = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: /* @__PURE__ */ e(
      "path",
      {
        d: "M19.5 13.5L12 21M12 21L4.5 13.5M12 21V3",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  }
), G = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ c(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: [
      /* @__PURE__ */ e("path", { d: "M12.8438 3.84375C12.8438 3.37776 12.466 3 12 3C11.534 3 11.1563 3.37776 11.1563 3.84375V13.534L7.83217 10.0144C7.51221 9.67563 6.97819 9.66037 6.63941 9.98033C6.30063 10.3003 6.28538 10.8343 6.60533 11.1731L11.3866 16.2356C11.546 16.4044 11.7679 16.5 12 16.5C12.2321 16.5 12.454 16.4044 12.6134 16.2356L17.3947 11.1731C17.7146 10.8343 17.6994 10.3003 17.3606 9.98033C17.0218 9.66037 16.4878 9.67563 16.1678 10.0144L12.8438 13.534V3.84375Z", fill: "currentColor" }),
      /* @__PURE__ */ e("path", { d: "M4.6875 15.0938C4.6875 14.6278 4.30974 14.25 3.84375 14.25C3.37776 14.25 3 14.6278 3 15.0938V17.9062C3 19.6149 4.38512 21 6.09375 21H17.9062C19.6149 21 21 19.6149 21 17.9062V15.0938C21 14.6278 20.6222 14.25 20.1562 14.25C19.6903 14.25 19.3125 14.6278 19.3125 15.0938V17.9062C19.3125 18.6829 18.6829 19.3125 17.9062 19.3125H6.09375C5.3171 19.3125 4.6875 18.6829 4.6875 17.9062V15.0938Z", fill: "currentColor" })
    ]
  }
), X = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: /* @__PURE__ */ e(
      "path",
      {
        d: "M9.18018 3.27196V20.9481M5.25 3H18.75C19.9926 3 21 4.09894 21 5.45455V18.5455C21 19.9011 19.9926 21 18.75 21H5.25C4.00736 21 3 19.9011 3 18.5455V5.45455C3 4.09894 4.00736 3 5.25 3Z",
        stroke: "currentColor",
        strokeWidth: "1.5"
      }
    )
  }
), Y = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: /* @__PURE__ */ e(
      "path",
      {
        d: "M8.18018 5.45501V18.5459M5.25 3H18.75C19.9926 3 21 4.09894 21 5.45455V18.5455C21 19.9011 19.9926 21 18.75 21H5.25C4.00736 21 3 19.9011 3 18.5455V5.45455C3 4.09894 4.00736 3 5.25 3Z",
        stroke: "currentColor",
        strokeWidth: "1.5"
      }
    )
  }
), B = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: /* @__PURE__ */ e(
      "path",
      {
        d: "M11.75 18L18 12M18 12L11.75 6M18 12L3 12M21 3V21",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  }
), I = ({
  size: n = 24,
  className: r = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: n,
    height: n,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: r,
    ...t,
    children: /* @__PURE__ */ e(
      "path",
      {
        d: "M12.25 18L6 12M6 12L12.25 6M6 12L21 12M3 3V21",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  }
);
function Z({
  size: n = "md",
  icon: r = /* @__PURE__ */ e(G, {}),
  disabled: t = !1,
  ...a
}) {
  return /* @__PURE__ */ e(
    "button",
    {
      className: `action-button action-button-${n}`,
      disabled: t,
      type: "button",
      ...a,
      children: r
    }
  );
}
const K = () => /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
] }), J = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("path", { d: "M11 8.5V12a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1h3.5M8 1h5v5M13 1L5.5 8.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
function ue({
  variant: n = "default",
  href: r = "#",
  leadingIcon: t,
  trailingIcon: a,
  disabled: l = !1,
  children: s,
  className: i = "",
  ...h
}) {
  const m = /* @__PURE__ */ c(w, { children: [
    t ?? /* @__PURE__ */ e(K, {}),
    /* @__PURE__ */ e("span", { className: "link-text", children: s }),
    a ?? /* @__PURE__ */ e(J, {})
  ] }), p = `link link-${n}${l ? " link-disabled" : ""} ${i}`.trim();
  return l ? /* @__PURE__ */ e("span", { className: p, "aria-disabled": "true", children: m }) : /* @__PURE__ */ e("a", { href: r, className: p, ...h, children: m });
}
function me({
  children: n,
  direction: r = "horizontal",
  fullWidth: t = !1
}) {
  const a = [
    "btn-group",
    `btn-group-${r}`,
    t ? "btn-group-full" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("div", { className: a, children: n });
}
const Q = () => /* @__PURE__ */ e("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3,4.5 6,7.5 9,4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
function pe({ items: n, shape: r = "default", onSelect: t }) {
  const [a, l] = k(null), s = (i) => {
    l((h) => h === i ? null : i), t == null || t(i);
  };
  return /* @__PURE__ */ e("div", { className: `filter-group filter-group-${r}`, children: n.map((i) => /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: `filter-btn ${r === "pill" ? "filter-btn-pill" : ""} ${a === i.id ? "filter-btn-active" : ""}`,
      onClick: () => s(i.id),
      children: [
        i.label,
        i.hasDropdown && /* @__PURE__ */ e(Q, {})
      ]
    },
    i.id
  )) });
}
function ve({
  label: n,
  hint: r,
  error: t,
  inputSize: a = "md",
  className: l = "",
  id: s,
  ...i
}) {
  const h = C(), m = s || h;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    n && /* @__PURE__ */ e("label", { htmlFor: m, className: "input-label", children: n }),
    /* @__PURE__ */ e(
      "input",
      {
        id: m,
        className: `input-field input-${a} ${t ? "input-error" : ""} ${l}`,
        ...i
      }
    ),
    r && !t && /* @__PURE__ */ e("span", { className: "input-hint", children: r }),
    t && /* @__PURE__ */ e("span", { className: "input-error-msg", children: t })
  ] });
}
function be({ label: n, id: r, ...t }) {
  const a = C(), l = r || a;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    n && /* @__PURE__ */ e("label", { htmlFor: l, className: "input-label", children: n }),
    /* @__PURE__ */ e("textarea", { id: l, className: "textarea-field", ...t })
  ] });
}
function fe({
  label: n,
  options: r,
  selectSize: t = "md",
  id: a,
  ...l
}) {
  const s = C(), i = a || s;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    n && /* @__PURE__ */ e("label", { htmlFor: i, className: "input-label", children: n }),
    /* @__PURE__ */ e(
      "select",
      {
        id: i,
        className: `select-field input-${t}`,
        ...l,
        children: r.map((h) => /* @__PURE__ */ e("option", { value: h.value, children: h.label }, h.value))
      }
    )
  ] });
}
function ke({ label: n, id: r, ...t }) {
  const a = C(), l = r || a;
  return /* @__PURE__ */ c("label", { className: "check-item", htmlFor: l, children: [
    /* @__PURE__ */ e("input", { type: "checkbox", id: l, ...t }),
    /* @__PURE__ */ e("span", { children: n })
  ] });
}
function ge({ label: n, id: r, ...t }) {
  const a = C(), l = r || a;
  return /* @__PURE__ */ c("label", { className: "check-item", htmlFor: l, children: [
    /* @__PURE__ */ e("input", { type: "radio", id: l, ...t }),
    /* @__PURE__ */ e("span", { children: n })
  ] });
}
function Ne({
  options: n,
  value: r,
  onChange: t,
  type: a = "checkbox",
  name: l,
  layout: s = "inline",
  className: i = ""
}) {
  const h = C(), m = l || h, p = (o) => Array.isArray(r) ? r.includes(o) : r === o, v = (o) => {
    if (a === "radio")
      t(o);
    else {
      const d = Array.isArray(r) ? r : [], u = d.includes(o) ? d.filter((g) => g !== o) : [...d, o];
      t(u);
    }
  };
  return /* @__PURE__ */ e("div", { className: `form-choice-group${s !== "inline" ? ` form-choice-group-${s}` : ""} ${i}`.trim(), children: n.map((o) => /* @__PURE__ */ c("label", { className: "form-choice-item", children: [
    /* @__PURE__ */ e(
      "input",
      {
        type: a,
        name: a === "radio" ? m : void 0,
        value: o.value,
        checked: p(o.value),
        onChange: () => v(o.value)
      }
    ),
    /* @__PURE__ */ e("span", { children: o.label })
  ] }, o.value)) });
}
function xe({
  label: n,
  checked: r = !1,
  onChange: t,
  size: a = "md",
  disabled: l = !1
}) {
  const s = a === "md" ? "" : `toggle-${a}`;
  return /* @__PURE__ */ c("label", { className: `toggle ${s}`, children: [
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        checked: r,
        onChange: (i) => t == null ? void 0 : t(i.target.checked),
        disabled: l
      }
    ),
    /* @__PURE__ */ e("span", { className: "toggle-track" }),
    n && /* @__PURE__ */ e("span", { children: n })
  ] });
}
function ye({ title: n, children: r, footer: t, size: a = "md" }) {
  const l = a === "md" ? "" : `card-${a}`;
  return /* @__PURE__ */ c("div", { className: `card ${l}`, children: [
    /* @__PURE__ */ c("div", { className: "card-body", children: [
      n && /* @__PURE__ */ e("div", { className: "card-title", children: n }),
      /* @__PURE__ */ e("div", { className: "card-text", children: r })
    ] }),
    t && /* @__PURE__ */ e("div", { className: "card-footer", children: t })
  ] });
}
function we({
  children: n,
  color: r = "steel",
  size: t = "md",
  dot: a = !1,
  icon: l = !1,
  dismissible: s = !1,
  onDismiss: i
}) {
  const h = () => typeof a == "string" ? `badge-dot badge-dot-${a}` : "badge-dot", m = () => {
    if (typeof a != "string")
      return { background: "currentColor" };
  };
  return /* @__PURE__ */ c("span", { className: `badge badge-${r} badge-${t}`, children: [
    a && /* @__PURE__ */ e("span", { className: h(), style: m() }),
    l && /* @__PURE__ */ c("svg", { width: "12", height: "12", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0, color: "var(--icon-color)" }, children: [
      /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
      /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
      /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
    ] }),
    n,
    s && /* @__PURE__ */ e(
      "button",
      {
        className: "badge-dismiss",
        onClick: i,
        "aria-label": "Remove",
        type: "button",
        children: /* @__PURE__ */ c("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { color: "var(--icon-color)" }, children: [
          /* @__PURE__ */ e("line", { x1: "3", y1: "3", x2: "9", y2: "9", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }),
          /* @__PURE__ */ e("line", { x1: "9", y1: "3", x2: "3", y2: "9", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" })
        ] })
      }
    )
  ] });
}
function U({ variant: n }) {
  return /* @__PURE__ */ c(
    "svg",
    {
      width: 20,
      height: 20,
      viewBox: "0 0 20 20",
      "aria-hidden": "true",
      className: "alert-icon",
      children: [
        n === "warning" ? /* @__PURE__ */ e(
          "polygon",
          {
            points: "10,1 19.5,18 0.5,18",
            className: "alert-icon-fill",
            fill: "currentColor",
            stroke: "currentColor",
            strokeWidth: 1.5,
            strokeLinejoin: "round"
          }
        ) : /* @__PURE__ */ e("circle", { cx: 10, cy: 10, r: 10, className: "alert-icon-fill" }),
        /* @__PURE__ */ e("g", { className: "alert-icon-knockout", children: {
          info: /* @__PURE__ */ c(w, { children: [
            /* @__PURE__ */ e("circle", { cx: "10", cy: "6", r: "1.5", fill: "currentColor" }),
            /* @__PURE__ */ e("rect", { x: "8.75", y: "9", width: "2.5", height: "6", rx: "1", fill: "currentColor" })
          ] }),
          success: /* @__PURE__ */ e(
            "polyline",
            {
              points: "6,10.5 9,13.5 14.5,7",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.25",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          warning: /* @__PURE__ */ c(w, { children: [
            /* @__PURE__ */ e("rect", { x: "8.75", y: "7.5", width: "2.5", height: "5", rx: "1", fill: "currentColor" }),
            /* @__PURE__ */ e("circle", { cx: "10", cy: "15.5", r: "1.5", fill: "currentColor" })
          ] }),
          error: /* @__PURE__ */ c(w, { children: [
            /* @__PURE__ */ e("rect", { x: "8.75", y: "5.5", width: "2.5", height: "5.5", rx: "1", fill: "currentColor" }),
            /* @__PURE__ */ e("circle", { cx: "10", cy: "14", r: "1.5", fill: "currentColor" })
          ] })
        }[n] })
      ]
    }
  );
}
function Ce({ variant: n, title: r, children: t, onDismiss: a }) {
  return /* @__PURE__ */ c("div", { className: `alert alert-${n}`, children: [
    /* @__PURE__ */ e(U, { variant: n }),
    /* @__PURE__ */ c("div", { className: "alert-content", children: [
      r && /* @__PURE__ */ e("span", { className: "alert-title", children: r }),
      /* @__PURE__ */ e("span", { className: "alert-body", children: t })
    ] }),
    a && /* @__PURE__ */ e(
      "button",
      {
        className: "alert-dismiss",
        onClick: a,
        "aria-label": "Dismiss",
        type: "button",
        children: /* @__PURE__ */ c("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
          /* @__PURE__ */ e("line", { x1: "4", y1: "4", x2: "12", y2: "12", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }),
          /* @__PURE__ */ e("line", { x1: "12", y1: "4", x2: "4", y2: "12", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" })
        ] })
      }
    )
  ] });
}
function V({
  initials: n,
  src: r,
  alt: t = "",
  size: a = "md",
  shape: l = "circle",
  color: s,
  status: i
}) {
  const h = l === "square" ? "avatar-square" : "", m = s ? `avatar-${s}` : "";
  return /* @__PURE__ */ c("div", { className: "avatar-wrapper", children: [
    /* @__PURE__ */ e("div", { className: `avatar avatar-${a} ${h} ${m}`.trim(), children: r ? /* @__PURE__ */ e("img", { src: r, alt: t }) : /* @__PURE__ */ e("span", { children: n || "?" }) }),
    i && /* @__PURE__ */ e("span", { className: `avatar-status avatar-status-${i}` })
  ] });
}
function $e({
  initials: n,
  fullName: r,
  governmentEntity: t,
  size: a = "lg",
  shape: l = "square",
  color: s = "steel",
  ...i
}) {
  return /* @__PURE__ */ c("div", { className: "avatar-with-info", children: [
    /* @__PURE__ */ e(
      V,
      {
        initials: n,
        size: a,
        shape: l,
        color: s,
        ...i
      }
    ),
    /* @__PURE__ */ c("div", { className: "avatar-with-info-text", children: [
      /* @__PURE__ */ e("span", { className: "avatar-with-info-name", children: r }),
      /* @__PURE__ */ e("span", { className: "avatar-with-info-entity", children: t })
    ] })
  ] });
}
function Le({ items: n, defaultTab: r }) {
  var s;
  const [t, a] = k(r || ((s = n[0]) == null ? void 0 : s.id)), l = n.find((i) => i.id === t);
  return /* @__PURE__ */ c("div", { children: [
    /* @__PURE__ */ e("div", { className: "tabs", children: n.map((i) => /* @__PURE__ */ c(
      "button",
      {
        className: `tab ${t === i.id ? "tab-active" : "tab-inactive"}`,
        onClick: () => a(i.id),
        type: "button",
        children: [
          i.icon && /* @__PURE__ */ e("span", { className: "tab-icon", children: i.icon }),
          i.label
        ]
      },
      i.id
    )) }),
    (l == null ? void 0 : l.content) && /* @__PURE__ */ e("div", { style: { padding: "var(--space-md) 0" }, children: l.content })
  ] });
}
function Me({ title: n, actionButtons: r = [], dropdown: t }) {
  const a = r.slice(0, 3);
  return /* @__PURE__ */ c("div", { className: "table-header", children: [
    /* @__PURE__ */ e("h2", { className: "table-header-title", children: n }),
    /* @__PURE__ */ c("div", { className: "table-header-actions", children: [
      a.length > 0 && /* @__PURE__ */ e("div", { className: "table-header-buttons", children: a.map((l, s) => /* @__PURE__ */ e(
        Z,
        {
          size: "sm",
          icon: l.icon,
          onClick: l.onClick,
          "aria-label": l.label
        },
        s
      )) }),
      t && /* @__PURE__ */ e("div", { className: "table-header-dropdown", children: t })
    ] })
  ] });
}
function Be({ header: n, columns: r, data: t }) {
  return /* @__PURE__ */ c("div", { className: "table-section", children: [
    n && /* @__PURE__ */ e("div", { className: "table-header-wrap", children: n }),
    /* @__PURE__ */ e("div", { className: "table-wrapper", children: /* @__PURE__ */ c("table", { className: "table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ e("tr", { children: r.map((a) => /* @__PURE__ */ e("th", { children: a.header }, a.key)) }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((a, l) => /* @__PURE__ */ e("tr", { children: r.map((s) => /* @__PURE__ */ e("td", { children: s.render ? s.render(a[s.key], a) : a[s.key] }, s.key)) }, l)) })
    ] }) })
  ] });
}
function Ie({ open: n, onClose: r, title: t, description: a, children: l, footer: s }) {
  return n ? /* @__PURE__ */ e("div", { className: "modal-overlay", onClick: r, children: /* @__PURE__ */ c("div", { className: "modal", onClick: (i) => i.stopPropagation(), children: [
    /* @__PURE__ */ c("div", { className: "modal-header", children: [
      /* @__PURE__ */ c("svg", { className: "modal-icon", width: "40", height: "40", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
        /* @__PURE__ */ e("circle", { cx: "10", cy: "10", r: "10", className: "alert-icon-fill" }),
        /* @__PURE__ */ c("g", { className: "alert-icon-knockout", children: [
          /* @__PURE__ */ e("rect", { x: "8.75", y: "5.5", width: "2.5", height: "5.5", rx: "1", fill: "currentColor" }),
          /* @__PURE__ */ e("circle", { cx: "10", cy: "14", r: "1.5", fill: "currentColor" })
        ] })
      ] }),
      /* @__PURE__ */ e("h2", { className: "modal-title", children: t }),
      /* @__PURE__ */ e("button", { className: "modal-close", onClick: r, "aria-label": "Close", children: /* @__PURE__ */ e("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ e("path", { d: "M5 5l10 10M15 5L5 15" }) }) })
    ] }),
    /* @__PURE__ */ c("div", { className: "modal-body", children: [
      a && /* @__PURE__ */ e("p", { className: "modal-description", children: a }),
      l && /* @__PURE__ */ e("div", { className: "modal-content", children: l })
    ] }),
    s && /* @__PURE__ */ e("div", { className: "modal-footer", children: s })
  ] }) }) : null;
}
function We({
  value: n,
  max: r = 100,
  size: t = "md",
  variant: a = "default",
  showLabel: l = !1
}) {
  const s = Math.min(100, Math.max(0, n / r * 100)), i = a === "default" ? "" : `progress-fill-${a}`;
  return /* @__PURE__ */ c("div", { style: { width: "100%" }, children: [
    /* @__PURE__ */ e("div", { className: `progress-bar progress-bar-${t}`, children: /* @__PURE__ */ e(
      "div",
      {
        className: `progress-fill ${i}`,
        style: { width: `${s}%` }
      }
    ) }),
    l && /* @__PURE__ */ c("div", { style: { marginTop: 4, fontSize: "var(--font-size-body-xs)", color: "var(--color-text-body)" }, children: [
      Math.round(s),
      "%"
    ] })
  ] });
}
function Se({ size: n = "md" }) {
  return /* @__PURE__ */ e("div", { className: `spinner spinner-${n}`, role: "status", "aria-label": "Loading" });
}
function Ae({ text: n, children: r }) {
  return /* @__PURE__ */ c("span", { className: "tooltip-wrapper", children: [
    r,
    /* @__PURE__ */ e("span", { className: "tooltip-content", children: n })
  ] });
}
function Ve({ items: n }) {
  return /* @__PURE__ */ e("nav", { "aria-label": "Breadcrumb", children: /* @__PURE__ */ e("ol", { className: "breadcrumb", children: n.map((r, t) => /* @__PURE__ */ c(A.Fragment, { children: [
    t > 0 && /* @__PURE__ */ e("span", { className: "breadcrumb-separator", children: "/" }),
    /* @__PURE__ */ e("li", { className: "breadcrumb-item", children: t < n.length - 1 && r.href ? /* @__PURE__ */ e("a", { href: r.href, children: r.label }) : /* @__PURE__ */ e("span", { className: "breadcrumb-current", children: r.label }) })
  ] }, t)) }) });
}
const _ = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3.5,5.5 7,9 10.5,5.5", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) });
function Te({ trigger: n, label: r = "Dropdown", size: t = "md", disabled: a = !1, items: l }) {
  const [s, i] = k(!1), h = $(null);
  M(() => {
    function p(v) {
      h.current && !h.current.contains(v.target) && i(!1);
    }
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, []);
  const m = n ? null : /* @__PURE__ */ c(
    "button",
    {
      className: `dropdown-trigger dropdown-trigger-${t}`,
      onClick: () => !a && i(!s),
      disabled: a,
      type: "button",
      children: [
        r,
        /* @__PURE__ */ e(_, {})
      ]
    }
  );
  return /* @__PURE__ */ c("div", { className: "dropdown", ref: h, children: [
    n ? /* @__PURE__ */ e("div", { onClick: () => !a && i(!s), style: { cursor: a ? "not-allowed" : "pointer" }, children: n }) : m,
    s && !a && /* @__PURE__ */ e("div", { className: "dropdown-menu", children: l.map(
      (p, v) => p.divider ? /* @__PURE__ */ e("div", { className: "dropdown-divider" }, v) : /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `dropdown-item${p.destructive ? " dropdown-item-destructive" : ""}`,
          onClick: () => {
            var o;
            (o = p.onClick) == null || o.call(p), i(!1);
          },
          children: p.label
        },
        v
      )
    ) })
  ] });
}
function Re({ strong: n, subtle: r }) {
  const t = [
    "divider",
    n ? "divider-strong" : "",
    r ? "divider-subtle" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("hr", { className: t });
}
function je({ brand: n, links: r = [], actions: t }) {
  return /* @__PURE__ */ c("nav", { className: "navbar", children: [
    /* @__PURE__ */ e("span", { className: "navbar-brand", children: n }),
    r.length > 0 && /* @__PURE__ */ e("ul", { className: "navbar-links", children: r.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("a", { href: a.href, children: a.label }) }, a.href)) }),
    t && /* @__PURE__ */ e("div", { className: "navbar-actions", children: t })
  ] });
}
const ee = () => /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
] }), re = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3.5,5.5 7,9 10.5,5.5", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) }), ne = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "5,3 9.5,7 5,11", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) });
function W({
  items: n,
  size: r = "md",
  defaultActiveIndex: t = null,
  activeIndex: a,
  onActiveIndexChange: l,
  allowDeselect: s = !0
}) {
  const [i, h] = k(t), m = a !== void 0, p = m ? a : i, v = (d) => {
    m || h(d), l == null || l(d);
  };
  return /* @__PURE__ */ e("nav", { className: `menu ${r === "sm" ? "menu-sm" : ""}`.trim(), children: n.map((d, u) => {
    const g = p === u;
    return d.type === "icon" ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `menu-item menu-item-icon ${g ? "menu-item-active" : ""}`.trim(),
        disabled: d.disabled,
        onClick: () => {
          var y;
          v(g && s ? null : u), (y = d.onClick) == null || y.call(d);
        },
        children: [
          (g ? d.activeIcon : d.icon) || d.icon || /* @__PURE__ */ e(ee, {}),
          /* @__PURE__ */ e("span", { className: "menu-item-label", children: d.label }),
          /* @__PURE__ */ e(re, {})
        ]
      },
      u
    ) : /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `menu-item menu-item-subtext ${g ? "menu-item-active" : ""}`.trim(),
        disabled: d.disabled,
        onClick: () => {
          var y;
          v(g && s ? null : u), (y = d.onClick) == null || y.call(d);
        },
        children: [
          /* @__PURE__ */ c("div", { className: "menu-item-text", children: [
            /* @__PURE__ */ e("span", { className: "menu-item-label", children: d.label }),
            /* @__PURE__ */ e("span", { className: "menu-item-sub", children: d.subtext })
          ] }),
          /* @__PURE__ */ e(ne, {})
        ]
      },
      u
    );
  }) });
}
function S({
  state: n = "open",
  direction: r = "right",
  disabled: t = !1,
  className: a,
  ...l
}) {
  const s = n === "closed" ? /* @__PURE__ */ e(X, { size: 24 }) : /* @__PURE__ */ e(Y, { size: 24 }), i = n === "closed" ? r === "right" ? /* @__PURE__ */ e(B, { size: 24 }) : /* @__PURE__ */ e(I, { size: 24 }) : r === "right" ? /* @__PURE__ */ e(I, { size: 24 }) : /* @__PURE__ */ e(B, { size: 24 });
  return /* @__PURE__ */ c(
    "button",
    {
      className: `drawer-button drawer-button-${n} drawer-button-${r} ${a || ""}`.trim(),
      disabled: t,
      type: "button",
      ...l,
      children: [
        /* @__PURE__ */ e("span", { className: "drawer-button-default", children: s }),
        /* @__PURE__ */ e("span", { className: "drawer-button-hover", children: i })
      ]
    }
  );
}
const te = () => /* @__PURE__ */ c("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("circle", { cx: "20", cy: "20", r: "20", fill: "var(--color-bg-strong)" }),
  /* @__PURE__ */ e("text", { x: "20", y: "20", textAnchor: "middle", dominantBaseline: "central", fill: "var(--color-text-secondary)", fontSize: "10", fontWeight: "600", fontFamily: "var(--font-primary)", children: "LOGO" })
] });
function De() {
  const [n, r] = k(!0);
  return /* @__PURE__ */ c("aside", { className: `sidebar-nav-panel${n ? "" : " sidebar-nav-panel-closed"}`, "aria-label": "Sidebar navigation panel", children: [
    /* @__PURE__ */ e("div", { className: "sidebar-nav-panel-top", children: n ? /* @__PURE__ */ c(w, { children: [
      /* @__PURE__ */ e("button", { type: "button", className: "sidebar-nav-logo", "aria-label": "Agency home", children: /* @__PURE__ */ e(te, {}) }),
      /* @__PURE__ */ e(
        S,
        {
          state: "open",
          direction: "right",
          onClick: () => r(!1),
          "aria-label": "Collapse sidebar",
          className: "sidebar-nav-toggle"
        }
      )
    ] }) : /* @__PURE__ */ e(
      S,
      {
        state: "closed",
        direction: "right",
        onClick: () => r(!0),
        "aria-label": "Expand sidebar",
        className: "sidebar-nav-toggle sidebar-nav-toggle-collapsed"
      }
    ) }),
    /* @__PURE__ */ c(
      q,
      {
        type: "button",
        variant: "secondary",
        size: "md",
        className: `sidebar-nav-new-app${n ? "" : " sidebar-nav-new-app-collapsed"}`,
        "aria-label": "New Application",
        children: [
          /* @__PURE__ */ e("span", { className: "sidebar-nav-plus", "aria-hidden": "true", children: "+" }),
          /* @__PURE__ */ e("span", { className: "sidebar-nav-new-app-text", children: "New Application" })
        ]
      }
    ),
    /* @__PURE__ */ c("div", { className: `sidebar-nav-menus${n ? "" : " sidebar-nav-menus-hidden"}`, children: [
      /* @__PURE__ */ e("div", { className: "sidebar-nav-menu-wrap", children: /* @__PURE__ */ e(
        W,
        {
          size: "sm",
          defaultActiveIndex: 0,
          allowDeselect: !1,
          items: [
            { type: "subtext", label: "Home", subtext: "" },
            { type: "subtext", label: "Applications", subtext: "" },
            { type: "subtext", label: "My Tasks", subtext: "" },
            { type: "subtext", label: "Messages", subtext: "" }
          ]
        }
      ) }),
      /* @__PURE__ */ e("div", { className: "sidebar-nav-heading", children: "Resources" }),
      /* @__PURE__ */ e("div", { className: "sidebar-nav-menu-wrap", children: /* @__PURE__ */ e(
        W,
        {
          size: "sm",
          items: [
            { type: "subtext", label: "Permit Types", subtext: "" },
            { type: "subtext", label: "Regulations", subtext: "" },
            { type: "subtext", label: "Resources", subtext: "" },
            { type: "subtext", label: "Help Center", subtext: "" }
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ c("div", { className: "sidebar-nav-footer", children: [
      /* @__PURE__ */ e(V, { initials: "JK", size: "md", shape: "square", color: "blue-400" }),
      /* @__PURE__ */ c("div", { className: `sidebar-nav-user-copy${n ? "" : " sidebar-nav-user-copy-hidden"}`, children: [
        /* @__PURE__ */ e("div", { className: "sidebar-nav-user-name", children: "Jack Kassidy" }),
        /* @__PURE__ */ e("div", { className: "sidebar-nav-user-org", children: "Company ABC" })
      ] })
    ] })
  ] });
}
function ae(n, r, t) {
  let a = 0;
  for (let l = 0; l < r.length; l++) {
    const s = a / t * 360;
    a += r[l].value;
    const i = a / t * 360;
    if (n >= s && n < i) return l;
  }
  return 0;
}
function ze({ title: n, segments: r, size: t = 160 }) {
  const a = r.reduce((b, f) => b + f.value, 0), l = Math.max(24, t * 0.2), s = (t - l) / 2, i = t / 2, h = 2 * Math.PI * s;
  let m = -h / 4;
  const p = r.map((b) => {
    const f = b.value / a * h, N = `${f} ${h - f}`, L = m;
    return m -= f, { colorVar: b.colorVar, dashArray: N, dashOffset: L };
  }), [v, o] = k(null), d = $(null), u = $(null), g = x(
    (b) => {
      const f = u.current;
      if (!f) return;
      const N = f.getBoundingClientRect(), L = (b.clientX - N.left) / N.width, T = (b.clientY - N.top) / N.height, R = 0.5, j = 0.5, D = L - R, z = T - j, H = (450 - Math.atan2(z, D) * 180 / Math.PI) % 360, P = ae(H, r, a);
      o({ index: P, x: b.clientX - N.left, y: b.clientY - N.top });
    },
    [r, a]
  ), y = x(() => o(null), []);
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-donut", children: [
    /* @__PURE__ */ e("div", { className: "chart-card-title", children: n }),
    /* @__PURE__ */ c("div", { className: "chart-card-content chart-donut-wrap", children: [
      /* @__PURE__ */ c(
        "div",
        {
          ref: d,
          style: { position: "relative", display: "inline-block" },
          onMouseMove: g,
          onMouseLeave: y,
          children: [
            /* @__PURE__ */ e(
              "svg",
              {
                ref: u,
                className: "chart-donut",
                width: t,
                height: t,
                viewBox: `0 0 ${t} ${t}`,
                "aria-hidden": !0,
                children: p.map((b, f) => /* @__PURE__ */ e(
                  "circle",
                  {
                    cx: i,
                    cy: i,
                    r: s,
                    fill: "none",
                    stroke: b.colorVar,
                    strokeWidth: l,
                    strokeDasharray: b.dashArray,
                    strokeDashoffset: b.dashOffset,
                    strokeLinecap: "butt"
                  },
                  f
                ))
              }
            ),
            v !== null && /* @__PURE__ */ c(
              "div",
              {
                className: "chart-kpi-card",
                style: {
                  left: v.x + 12,
                  top: v.y + 12
                },
                children: [
                  /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: r[v.index].label }),
                  /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
                    /* @__PURE__ */ e(
                      "span",
                      {
                        className: "chart-kpi-card-bullet",
                        style: { background: r[v.index].colorVar }
                      }
                    ),
                    /* @__PURE__ */ e("span", { className: "chart-kpi-card-label", children: "Total" }),
                    /* @__PURE__ */ e("span", { className: "chart-kpi-card-value", children: r[v.index].value.toLocaleString() })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e("div", { className: "chart-legend", children: r.map((b, f) => /* @__PURE__ */ c("div", { className: "chart-legend-item", children: [
        /* @__PURE__ */ e(
          "span",
          {
            className: "chart-legend-swatch",
            style: { background: b.colorVar }
          }
        ),
        /* @__PURE__ */ e("span", { className: "chart-legend-label", children: b.label }),
        /* @__PURE__ */ e("span", { className: "chart-legend-value", children: b.value.toLocaleString() })
      ] }, f)) })
    ] })
  ] });
}
function He({ title: n, items: r }) {
  const t = Math.max(...r.map((o) => o.value), 1), a = 120, [l, s] = k(null), i = $(null), h = x((o, d) => {
    if (!i.current) return;
    const u = i.current.getBoundingClientRect();
    s({
      index: d,
      x: o.clientX - u.left,
      y: o.clientY - u.top
    });
  }, []), m = x(
    (o, d) => h(o, d),
    [h]
  ), p = x(
    (o, d) => {
      (l == null ? void 0 : l.index) === d && h(o, d);
    },
    [l == null ? void 0 : l.index, h]
  ), v = x(() => s(null), []);
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-bar", ref: i, children: [
    /* @__PURE__ */ e("div", { className: "chart-card-title", children: n }),
    /* @__PURE__ */ c("div", { className: "chart-card-content chart-bar-wrap", children: [
      /* @__PURE__ */ e("div", { className: "chart-bars", children: r.map((o, d) => /* @__PURE__ */ c(
        "div",
        {
          className: "chart-bar-group",
          onMouseEnter: (u) => m(u, d),
          onMouseMove: (u) => p(u, d),
          onMouseLeave: v,
          children: [
            /* @__PURE__ */ e(
              "div",
              {
                className: "chart-bar",
                style: {
                  height: `${o.value / t * a}px`
                }
              }
            ),
            /* @__PURE__ */ c("div", { className: "chart-bar-labels", children: [
              /* @__PURE__ */ e("span", { className: "chart-bar-value", children: o.value.toLocaleString() }),
              /* @__PURE__ */ e("span", { className: "chart-bar-label", children: o.label })
            ] })
          ]
        },
        d
      )) }),
      l !== null && /* @__PURE__ */ c(
        "div",
        {
          className: "chart-kpi-card",
          style: {
            left: l.x + 12,
            top: l.y + 12
          },
          children: [
            /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: r[l.index].label }),
            /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-bullet", style: { background: "var(--chart-bar)" } }),
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-label", children: "Total" }),
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-value", children: r[l.index].value.toLocaleString() })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Pe({ label: n, value: r, changePercent: t, trend: a }) {
  const l = a === "increase", s = typeof r == "number" ? r.toLocaleString() : r, i = `${t}% ${a}`;
  return /* @__PURE__ */ c("div", { className: "kpi-card-small", children: [
    /* @__PURE__ */ c("div", { className: "kpi-card-small-header", children: [
      /* @__PURE__ */ e("span", { className: "kpi-card-small-label", children: n }),
      /* @__PURE__ */ e(
        "span",
        {
          className: "kpi-card-small-trend-icon",
          "aria-hidden": !0,
          style: { color: l ? "var(--color-success)" : "var(--color-error)" },
          children: l ? /* @__PURE__ */ e("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e("path", { d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" }) }) : /* @__PURE__ */ e("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e("g", { transform: "scale(1, -1) translate(0, -24)", children: /* @__PURE__ */ e("path", { d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" }) }) })
        }
      )
    ] }),
    /* @__PURE__ */ e("div", { className: "kpi-card-small-value", children: s }),
    /* @__PURE__ */ e(
      "div",
      {
        className: "kpi-card-small-change",
        style: { color: l ? "var(--color-success)" : "var(--color-error)" },
        children: i
      }
    )
  ] });
}
function Ee({ title: n, description: r, actionLabel: t = "View report", onAction: a, segments: l, totalApplications: s = 15e4 }) {
  const i = l.reduce((o, d) => o + d.percent, 0) || 1, [h, m] = k(null), p = $(null), v = x(
    (o, d) => {
      if (!p.current) return;
      const u = p.current.getBoundingClientRect();
      m({ index: d, x: o.clientX - u.left, y: o.clientY - u.top });
    },
    []
  );
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-tracker", ref: p, children: [
    /* @__PURE__ */ c("div", { className: "completion-tracker-header", children: [
      /* @__PURE__ */ e("div", { className: "chart-card-title", style: { marginBottom: 0 }, children: n }),
      t && /* @__PURE__ */ e(O, { variant: "primary", size: "sm", onClick: a, children: t })
    ] }),
    r && /* @__PURE__ */ e("p", { className: "completion-tracker-desc", children: r }),
    /* @__PURE__ */ c("div", { className: "completion-tracker-bar-wrap", children: [
      /* @__PURE__ */ e("div", { className: "completion-tracker-bar", children: l.map((o, d) => /* @__PURE__ */ e(
        "div",
        {
          className: `completion-tracker-segment${o.texture ? ` completion-tracker-segment--${o.texture}` : ""}`,
          style: {
            background: (h == null ? void 0 : h.index) === d && o.hoverColorVar ? o.hoverColorVar : o.colorVar,
            width: `${o.percent / i * 100}%`
          },
          onMouseEnter: (u) => v(u, d),
          onMouseMove: (u) => v(u, d),
          onMouseLeave: () => m(null),
          children: o.texture && /* @__PURE__ */ e("div", { className: "completion-tracker-segment-texture", "aria-hidden": !0 })
        },
        d
      )) }),
      /* @__PURE__ */ e("div", { className: "completion-tracker-labels", children: l.map((o, d) => /* @__PURE__ */ c(
        "div",
        {
          className: "completion-tracker-label-cell",
          style: { width: `${o.percent / i * 100}%` },
          onMouseEnter: (u) => v(u, d),
          onMouseMove: (u) => v(u, d),
          onMouseLeave: () => m(null),
          children: [
            /* @__PURE__ */ c("span", { className: "completion-tracker-pct", children: [
              o.percent,
              "%"
            ] }),
            /* @__PURE__ */ e("span", { className: "completion-tracker-name", children: o.label })
          ]
        },
        d
      )) })
    ] }),
    h !== null && (() => {
      const o = l[h.index], d = Math.round(s * o.percent / 100);
      return /* @__PURE__ */ c(
        "div",
        {
          className: "chart-kpi-card",
          style: { left: h.x + 12, top: h.y + 12 },
          children: [
            /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: o.label }),
            /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
              /* @__PURE__ */ e(
                "span",
                {
                  className: "chart-kpi-card-bullet",
                  style: { background: o.colorVar }
                }
              ),
              /* @__PURE__ */ c("span", { className: "chart-kpi-card-value", children: [
                d.toLocaleString(),
                " applications"
              ] }),
              /* @__PURE__ */ c("span", { className: "chart-kpi-card-value", children: [
                o.percent,
                "%"
              ] })
            ] })
          ]
        }
      );
    })()
  ] });
}
export {
  Ce as Alert,
  he as ArrowDownIcon,
  V as Avatar,
  $e as AvatarWithInfo,
  we as Badge,
  He as BarChart,
  Ve as Breadcrumb,
  O as Button,
  me as ButtonGroup,
  ye as Card,
  ke as Checkbox,
  Ee as CompletionTracker,
  Re as Divider,
  ze as DonutChart,
  G as DownloadIcon,
  S as DrawerButton,
  Te as Dropdown,
  pe as FilterGroup,
  Ne as FormChoice,
  de as IconButton,
  ve as Input,
  ue as Link,
  W as Menu,
  Ie as Modal,
  je as Navbar,
  q as PillButton,
  oe as PlusIcon,
  We as Progress,
  ge as Radio,
  fe as Select,
  De as SidebarNavigationPanel,
  Pe as SmallKpiCard,
  Se as Spinner,
  Be as Table,
  Me as TableHeader,
  Le as Tabs,
  be as Textarea,
  se as ThemeProvider,
  xe as Toggle,
  Ae as Tooltip
};
//# sourceMappingURL=usds.js.map
