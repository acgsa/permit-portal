"use client";
import { jsx as e, Fragment as w, jsxs as c } from "react/jsx-runtime";
import V, { createContext as E, useState as f, useEffect as M, useCallback as N, useId as $, useRef as C } from "react";
const F = E({
  theme: "light",
  toggleTheme: () => {
  }
});
function se({ children: r }) {
  const [n, t] = f("light"), [a, l] = f(!1);
  M(() => {
    const i = localStorage.getItem("theme"), h = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    t(i || h), l(!0);
  }, []), M(() => {
    a && (document.documentElement.setAttribute("data-theme", n), localStorage.setItem("theme", n));
  }, [n, a]);
  const s = N(() => {
    t((i) => i === "light" ? "dark" : "light");
  }, []);
  return a ? /* @__PURE__ */ e(F.Provider, { value: { theme: n, toggleTheme: s }, children: r }) : /* @__PURE__ */ e(w, { children: r });
}
const oe = ({ size: r = 14 }) => /* @__PURE__ */ c("svg", { width: r, height: r, viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("line", { x1: "7", y1: "2", x2: "7", y2: "12", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" }),
  /* @__PURE__ */ e("line", { x1: "2", y1: "7", x2: "12", y2: "7", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round" })
] });
function O({
  variant: r = "primary",
  size: n = "md",
  className: t = "",
  leadingIcon: a,
  trailingIcon: l,
  children: s,
  ...i
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      className: `btn btn-${r} btn-${n} ${t}`,
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
  variant: r = "primary",
  size: n = "md",
  className: t = "",
  leadingIcon: a,
  trailingIcon: l,
  children: s,
  ...i
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      className: `btn btn-pill btn-${r} btn-${n} ${t}`,
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
  variant: r = "primary",
  size: n = "md",
  shape: t = "square",
  className: a = "",
  icon: l,
  label: s,
  ...i
}) {
  const h = t === "circle" ? "btn-icon-circle" : "", m = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24
  }[n], v = V.cloneElement(l, { size: m });
  return /* @__PURE__ */ e(
    "button",
    {
      className: `btn btn-icon ${h} btn-${r} btn-${n} ${a}`,
      "aria-label": s,
      ...i,
      children: v
    }
  );
}
const he = ({
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
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
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ c(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
    ...t,
    children: [
      /* @__PURE__ */ e("path", { d: "M12.8438 3.84375C12.8438 3.37776 12.466 3 12 3C11.534 3 11.1563 3.37776 11.1563 3.84375V13.534L7.83217 10.0144C7.51221 9.67563 6.97819 9.66037 6.63941 9.98033C6.30063 10.3003 6.28538 10.8343 6.60533 11.1731L11.3866 16.2356C11.546 16.4044 11.7679 16.5 12 16.5C12.2321 16.5 12.454 16.4044 12.6134 16.2356L17.3947 11.1731C17.7146 10.8343 17.6994 10.3003 17.3606 9.98033C17.0218 9.66037 16.4878 9.67563 16.1678 10.0144L12.8438 13.534V3.84375Z", fill: "currentColor" }),
      /* @__PURE__ */ e("path", { d: "M4.6875 15.0938C4.6875 14.6278 4.30974 14.25 3.84375 14.25C3.37776 14.25 3 14.6278 3 15.0938V17.9062C3 19.6149 4.38512 21 6.09375 21H17.9062C19.6149 21 21 19.6149 21 17.9062V15.0938C21 14.6278 20.6222 14.25 20.1562 14.25C19.6903 14.25 19.3125 14.6278 19.3125 15.0938V17.9062C19.3125 18.6829 18.6829 19.3125 17.9062 19.3125H6.09375C5.3171 19.3125 4.6875 18.6829 4.6875 17.9062V15.0938Z", fill: "currentColor" })
    ]
  }
), X = ({
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
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
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
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
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
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
  size: r = 24,
  className: n = "",
  ...t
}) => /* @__PURE__ */ e(
  "svg",
  {
    width: r,
    height: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: n,
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
  size: r = "md",
  icon: n = /* @__PURE__ */ e(G, {}),
  disabled: t = !1,
  ...a
}) {
  return /* @__PURE__ */ e(
    "button",
    {
      className: `action-button action-button-${r}`,
      disabled: t,
      type: "button",
      ...a,
      children: n
    }
  );
}
const K = () => /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
] }), J = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("path", { d: "M11 8.5V12a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1h3.5M8 1h5v5M13 1L5.5 8.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
function ue({
  variant: r = "default",
  href: n = "#",
  leadingIcon: t,
  trailingIcon: a,
  disabled: l = !1,
  children: s,
  className: i = "",
  ...h
}) {
  const p = /* @__PURE__ */ c(w, { children: [
    t ?? /* @__PURE__ */ e(K, {}),
    /* @__PURE__ */ e("span", { className: "link-text", children: s }),
    a ?? /* @__PURE__ */ e(J, {})
  ] }), m = `link link-${r}${l ? " link-disabled" : ""} ${i}`.trim();
  return l ? /* @__PURE__ */ e("span", { className: m, "aria-disabled": "true", children: p }) : /* @__PURE__ */ e("a", { href: n, className: m, ...h, children: p });
}
function pe({
  children: r,
  direction: n = "horizontal",
  fullWidth: t = !1
}) {
  const a = [
    "btn-group",
    `btn-group-${n}`,
    t ? "btn-group-full" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("div", { className: a, children: r });
}
const Q = () => /* @__PURE__ */ e("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3,4.5 6,7.5 9,4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
function me({ items: r, shape: n = "default", onSelect: t }) {
  const [a, l] = f(null), s = (i) => {
    l((h) => h === i ? null : i), t == null || t(i);
  };
  return /* @__PURE__ */ e("div", { className: `filter-group filter-group-${n}`, children: r.map((i) => /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: `filter-btn ${n === "pill" ? "filter-btn-pill" : ""} ${a === i.id ? "filter-btn-active" : ""}`,
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
  label: r,
  hint: n,
  error: t,
  inputSize: a = "md",
  className: l = "",
  id: s,
  ...i
}) {
  const h = $(), p = s || h;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    r && /* @__PURE__ */ e("label", { htmlFor: p, className: "input-label", children: r }),
    /* @__PURE__ */ e(
      "input",
      {
        id: p,
        className: `input-field input-${a} ${t ? "input-error" : ""} ${l}`,
        ...i
      }
    ),
    n && !t && /* @__PURE__ */ e("span", { className: "input-hint", children: n }),
    t && /* @__PURE__ */ e("span", { className: "input-error-msg", children: t })
  ] });
}
function be({ label: r, id: n, ...t }) {
  const a = $(), l = n || a;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    r && /* @__PURE__ */ e("label", { htmlFor: l, className: "input-label", children: r }),
    /* @__PURE__ */ e("textarea", { id: l, className: "textarea-field", ...t })
  ] });
}
function ke({
  label: r,
  options: n,
  selectSize: t = "md",
  id: a,
  ...l
}) {
  const s = a || `select-${Math.random().toString(36).slice(2, 8)}`;
  return /* @__PURE__ */ c("div", { className: "input-wrapper", children: [
    r && /* @__PURE__ */ e("label", { htmlFor: s, className: "input-label", children: r }),
    /* @__PURE__ */ e(
      "select",
      {
        id: s,
        className: `select-field input-${t}`,
        ...l,
        children: n.map((i) => /* @__PURE__ */ e("option", { value: i.value, children: i.label }, i.value))
      }
    )
  ] });
}
function fe({ label: r, id: n, ...t }) {
  const a = $(), l = n || a;
  return /* @__PURE__ */ c("label", { className: "check-item", htmlFor: l, children: [
    /* @__PURE__ */ e("input", { type: "checkbox", id: l, ...t }),
    /* @__PURE__ */ e("span", { children: r })
  ] });
}
function ge({ label: r, id: n, ...t }) {
  const a = $(), l = n || a;
  return /* @__PURE__ */ c("label", { className: "check-item", htmlFor: l, children: [
    /* @__PURE__ */ e("input", { type: "radio", id: l, ...t }),
    /* @__PURE__ */ e("span", { children: r })
  ] });
}
function Ne({
  label: r,
  checked: n = !1,
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
        checked: n,
        onChange: (i) => t == null ? void 0 : t(i.target.checked),
        disabled: l
      }
    ),
    /* @__PURE__ */ e("span", { className: "toggle-track" }),
    r && /* @__PURE__ */ e("span", { children: r })
  ] });
}
function xe({ title: r, children: n, footer: t, size: a = "md" }) {
  const l = a === "md" ? "" : `card-${a}`;
  return /* @__PURE__ */ c("div", { className: `card ${l}`, children: [
    /* @__PURE__ */ c("div", { className: "card-body", children: [
      r && /* @__PURE__ */ e("div", { className: "card-title", children: r }),
      /* @__PURE__ */ e("div", { className: "card-text", children: n })
    ] }),
    t && /* @__PURE__ */ e("div", { className: "card-footer", children: t })
  ] });
}
function ye({
  children: r,
  color: n = "steel",
  size: t = "md",
  dot: a = !1,
  icon: l = !1,
  dismissible: s = !1,
  onDismiss: i
}) {
  const h = () => typeof a == "string" ? `badge-dot badge-dot-${a}` : "badge-dot", p = () => {
    if (typeof a != "string")
      return { background: "currentColor" };
  };
  return /* @__PURE__ */ c("span", { className: `badge badge-${n} badge-${t}`, children: [
    a && /* @__PURE__ */ e("span", { className: h(), style: p() }),
    l && /* @__PURE__ */ c("svg", { width: "12", height: "12", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0, color: "var(--icon-color)" }, children: [
      /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
      /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
      /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
    ] }),
    r,
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
function U({ variant: r }) {
  return /* @__PURE__ */ c(
    "svg",
    {
      width: 20,
      height: 20,
      viewBox: "0 0 20 20",
      "aria-hidden": "true",
      className: "alert-icon",
      children: [
        r === "warning" ? /* @__PURE__ */ e(
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
        }[r] })
      ]
    }
  );
}
function we({ variant: r, title: n, children: t, onDismiss: a }) {
  return /* @__PURE__ */ c("div", { className: `alert alert-${r}`, children: [
    /* @__PURE__ */ e(U, { variant: r }),
    /* @__PURE__ */ c("div", { className: "alert-content", children: [
      n && /* @__PURE__ */ e("span", { className: "alert-title", children: n }),
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
function A({
  initials: r,
  src: n,
  alt: t = "",
  size: a = "md",
  shape: l = "circle",
  color: s,
  status: i
}) {
  const h = l === "square" ? "avatar-square" : "", p = s ? `avatar-${s}` : "";
  return /* @__PURE__ */ c("div", { className: "avatar-wrapper", children: [
    /* @__PURE__ */ e("div", { className: `avatar avatar-${a} ${h} ${p}`.trim(), children: n ? /* @__PURE__ */ e("img", { src: n, alt: t }) : /* @__PURE__ */ e("span", { children: r || "?" }) }),
    i && /* @__PURE__ */ e("span", { className: `avatar-status avatar-status-${i}` })
  ] });
}
function Ce({
  initials: r,
  fullName: n,
  governmentEntity: t,
  size: a = "lg",
  shape: l = "square",
  color: s = "steel",
  ...i
}) {
  return /* @__PURE__ */ c("div", { className: "avatar-with-info", children: [
    /* @__PURE__ */ e(
      A,
      {
        initials: r,
        size: a,
        shape: l,
        color: s,
        ...i
      }
    ),
    /* @__PURE__ */ c("div", { className: "avatar-with-info-text", children: [
      /* @__PURE__ */ e("span", { className: "avatar-with-info-name", children: n }),
      /* @__PURE__ */ e("span", { className: "avatar-with-info-entity", children: t })
    ] })
  ] });
}
function $e({ items: r, defaultTab: n }) {
  var s;
  const [t, a] = f(n || ((s = r[0]) == null ? void 0 : s.id)), l = r.find((i) => i.id === t);
  return /* @__PURE__ */ c("div", { children: [
    /* @__PURE__ */ e("div", { className: "tabs", children: r.map((i) => /* @__PURE__ */ c(
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
function Le({ title: r, actionButtons: n = [], dropdown: t }) {
  const a = n.slice(0, 3);
  return /* @__PURE__ */ c("div", { className: "table-header", children: [
    /* @__PURE__ */ e("h2", { className: "table-header-title", children: r }),
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
function Me({ header: r, columns: n, data: t }) {
  return /* @__PURE__ */ c("div", { className: "table-section", children: [
    r && /* @__PURE__ */ e("div", { className: "table-header-wrap", children: r }),
    /* @__PURE__ */ e("div", { className: "table-wrapper", children: /* @__PURE__ */ c("table", { className: "table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ e("tr", { children: n.map((a) => /* @__PURE__ */ e("th", { children: a.header }, a.key)) }) }),
      /* @__PURE__ */ e("tbody", { children: t.map((a, l) => /* @__PURE__ */ e("tr", { children: n.map((s) => /* @__PURE__ */ e("td", { children: s.render ? s.render(a[s.key], a) : a[s.key] }, s.key)) }, l)) })
    ] }) })
  ] });
}
function Be({ open: r, onClose: n, title: t, description: a, children: l, footer: s }) {
  return r ? /* @__PURE__ */ e("div", { className: "modal-overlay", onClick: n, children: /* @__PURE__ */ c("div", { className: "modal", onClick: (i) => i.stopPropagation(), children: [
    /* @__PURE__ */ c("div", { className: "modal-header", children: [
      /* @__PURE__ */ c("svg", { className: "modal-icon", width: "40", height: "40", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
        /* @__PURE__ */ e("circle", { cx: "10", cy: "10", r: "10", className: "alert-icon-fill" }),
        /* @__PURE__ */ c("g", { className: "alert-icon-knockout", children: [
          /* @__PURE__ */ e("rect", { x: "8.75", y: "5.5", width: "2.5", height: "5.5", rx: "1", fill: "currentColor" }),
          /* @__PURE__ */ e("circle", { cx: "10", cy: "14", r: "1.5", fill: "currentColor" })
        ] })
      ] }),
      /* @__PURE__ */ e("h2", { className: "modal-title", children: t }),
      /* @__PURE__ */ e("button", { className: "modal-close", onClick: n, "aria-label": "Close", children: /* @__PURE__ */ e("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ e("path", { d: "M5 5l10 10M15 5L5 15" }) }) })
    ] }),
    /* @__PURE__ */ c("div", { className: "modal-body", children: [
      a && /* @__PURE__ */ e("p", { className: "modal-description", children: a }),
      l && /* @__PURE__ */ e("div", { className: "modal-content", children: l })
    ] }),
    s && /* @__PURE__ */ e("div", { className: "modal-footer", children: s })
  ] }) }) : null;
}
function Ie({
  value: r,
  max: n = 100,
  size: t = "md",
  variant: a = "default",
  showLabel: l = !1
}) {
  const s = Math.min(100, Math.max(0, r / n * 100)), i = a === "default" ? "" : `progress-fill-${a}`;
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
function We({ size: r = "md" }) {
  return /* @__PURE__ */ e("div", { className: `spinner spinner-${r}`, role: "status", "aria-label": "Loading" });
}
function Se({ text: r, children: n }) {
  return /* @__PURE__ */ c("span", { className: "tooltip-wrapper", children: [
    n,
    /* @__PURE__ */ e("span", { className: "tooltip-content", children: r })
  ] });
}
function Ve({ items: r }) {
  return /* @__PURE__ */ e("nav", { "aria-label": "Breadcrumb", children: /* @__PURE__ */ e("ol", { className: "breadcrumb", children: r.map((n, t) => /* @__PURE__ */ c(V.Fragment, { children: [
    t > 0 && /* @__PURE__ */ e("span", { className: "breadcrumb-separator", children: "/" }),
    /* @__PURE__ */ e("li", { className: "breadcrumb-item", children: t < r.length - 1 && n.href ? /* @__PURE__ */ e("a", { href: n.href, children: n.label }) : /* @__PURE__ */ e("span", { className: "breadcrumb-current", children: n.label }) })
  ] }, t)) }) });
}
const _ = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3.5,5.5 7,9 10.5,5.5", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) });
function Ae({ trigger: r, label: n = "Dropdown", size: t = "md", disabled: a = !1, items: l }) {
  const [s, i] = f(!1), h = C(null);
  M(() => {
    function m(v) {
      h.current && !h.current.contains(v.target) && i(!1);
    }
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, []);
  const p = r ? null : /* @__PURE__ */ c(
    "button",
    {
      className: `dropdown-trigger dropdown-trigger-${t}`,
      onClick: () => !a && i(!s),
      disabled: a,
      type: "button",
      children: [
        n,
        /* @__PURE__ */ e(_, {})
      ]
    }
  );
  return /* @__PURE__ */ c("div", { className: "dropdown", ref: h, children: [
    r ? /* @__PURE__ */ e("div", { onClick: () => !a && i(!s), style: { cursor: a ? "not-allowed" : "pointer" }, children: r }) : p,
    s && !a && /* @__PURE__ */ e("div", { className: "dropdown-menu", children: l.map(
      (m, v) => m.divider ? /* @__PURE__ */ e("div", { className: "dropdown-divider" }, v) : /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `dropdown-item${m.destructive ? " dropdown-item-destructive" : ""}`,
          onClick: () => {
            var d;
            (d = m.onClick) == null || d.call(m), i(!1);
          },
          children: m.label
        },
        v
      )
    ) })
  ] });
}
function Te({ strong: r, subtle: n }) {
  const t = [
    "divider",
    r ? "divider-strong" : "",
    n ? "divider-subtle" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("hr", { className: t });
}
function Re({ brand: r, links: n = [], actions: t }) {
  return /* @__PURE__ */ c("nav", { className: "navbar", children: [
    /* @__PURE__ */ e("span", { className: "navbar-brand", children: r }),
    n.length > 0 && /* @__PURE__ */ e("ul", { className: "navbar-links", children: n.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("a", { href: a.href, children: a.label }) }, a.href)) }),
    t && /* @__PURE__ */ e("div", { className: "navbar-actions", children: t })
  ] });
}
const ee = () => /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 18 18", "aria-hidden": "true", style: { flexShrink: 0 }, children: [
  /* @__PURE__ */ e("circle", { cx: "9", cy: "9", r: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("ellipse", { cx: "9", cy: "9", rx: "3.5", ry: "7.5", fill: "none", stroke: "currentColor", strokeWidth: "1.25" }),
  /* @__PURE__ */ e("line", { x1: "1.5", y1: "9", x2: "16.5", y2: "9", stroke: "currentColor", strokeWidth: "1.25" })
] }), re = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "3.5,5.5 7,9 10.5,5.5", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) }), ne = () => /* @__PURE__ */ e("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", style: { flexShrink: 0 }, children: /* @__PURE__ */ e("polyline", { points: "5,3 9.5,7 5,11", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) });
function W({
  items: r,
  size: n = "md",
  defaultActiveIndex: t = null,
  activeIndex: a,
  onActiveIndexChange: l,
  allowDeselect: s = !0
}) {
  const [i, h] = f(t), p = a !== void 0, m = p ? a : i, v = (o) => {
    p || h(o), l == null || l(o);
  };
  return /* @__PURE__ */ e("nav", { className: `menu ${n === "sm" ? "menu-sm" : ""}`.trim(), children: r.map((o, u) => {
    const x = m === u;
    return o.type === "icon" ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `menu-item menu-item-icon ${x ? "menu-item-active" : ""}`.trim(),
        disabled: o.disabled,
        onClick: () => {
          var y;
          v(x && s ? null : u), (y = o.onClick) == null || y.call(o);
        },
        children: [
          (x ? o.activeIcon : o.icon) || o.icon || /* @__PURE__ */ e(ee, {}),
          /* @__PURE__ */ e("span", { className: "menu-item-label", children: o.label }),
          /* @__PURE__ */ e(re, {})
        ]
      },
      u
    ) : /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `menu-item menu-item-subtext ${x ? "menu-item-active" : ""}`.trim(),
        disabled: o.disabled,
        onClick: () => {
          var y;
          v(x && s ? null : u), (y = o.onClick) == null || y.call(o);
        },
        children: [
          /* @__PURE__ */ c("div", { className: "menu-item-text", children: [
            /* @__PURE__ */ e("span", { className: "menu-item-label", children: o.label }),
            /* @__PURE__ */ e("span", { className: "menu-item-sub", children: o.subtext })
          ] }),
          /* @__PURE__ */ e(ne, {})
        ]
      },
      u
    );
  }) });
}
function S({
  state: r = "open",
  direction: n = "right",
  disabled: t = !1,
  className: a,
  ...l
}) {
  const s = r === "closed" ? /* @__PURE__ */ e(X, { size: 24 }) : /* @__PURE__ */ e(Y, { size: 24 }), i = r === "closed" ? n === "right" ? /* @__PURE__ */ e(B, { size: 24 }) : /* @__PURE__ */ e(I, { size: 24 }) : n === "right" ? /* @__PURE__ */ e(I, { size: 24 }) : /* @__PURE__ */ e(B, { size: 24 });
  return /* @__PURE__ */ c(
    "button",
    {
      className: `drawer-button drawer-button-${r} drawer-button-${n} ${a || ""}`.trim(),
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
function je() {
  const [r, n] = f(!0);
  return /* @__PURE__ */ c("aside", { className: `sidebar-nav-panel${r ? "" : " sidebar-nav-panel-closed"}`, "aria-label": "Sidebar navigation panel", children: [
    /* @__PURE__ */ e("div", { className: "sidebar-nav-panel-top", children: r ? /* @__PURE__ */ c(w, { children: [
      /* @__PURE__ */ e("button", { type: "button", className: "sidebar-nav-logo", "aria-label": "Agency home", children: /* @__PURE__ */ e(te, {}) }),
      /* @__PURE__ */ e(
        S,
        {
          state: "open",
          direction: "right",
          onClick: () => n(!1),
          "aria-label": "Collapse sidebar",
          className: "sidebar-nav-toggle"
        }
      )
    ] }) : /* @__PURE__ */ e(
      S,
      {
        state: "closed",
        direction: "right",
        onClick: () => n(!0),
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
        className: `sidebar-nav-new-app${r ? "" : " sidebar-nav-new-app-collapsed"}`,
        "aria-label": "New Application",
        children: [
          /* @__PURE__ */ e("span", { className: "sidebar-nav-plus", "aria-hidden": "true", children: "+" }),
          /* @__PURE__ */ e("span", { className: "sidebar-nav-new-app-text", children: "New Application" })
        ]
      }
    ),
    /* @__PURE__ */ c("div", { className: `sidebar-nav-menus${r ? "" : " sidebar-nav-menus-hidden"}`, children: [
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
      /* @__PURE__ */ e(A, { initials: "JK", size: "md", shape: "square", color: "blue-400" }),
      /* @__PURE__ */ c("div", { className: `sidebar-nav-user-copy${r ? "" : " sidebar-nav-user-copy-hidden"}`, children: [
        /* @__PURE__ */ e("div", { className: "sidebar-nav-user-name", children: "Jack Kassidy" }),
        /* @__PURE__ */ e("div", { className: "sidebar-nav-user-org", children: "Company ABC" })
      ] })
    ] })
  ] });
}
function ae(r, n, t) {
  let a = 0;
  for (let l = 0; l < n.length; l++) {
    const s = a / t * 360;
    a += n[l].value;
    const i = a / t * 360;
    if (r >= s && r < i) return l;
  }
  return 0;
}
function De({ title: r, segments: n, size: t = 160 }) {
  const a = n.reduce((b, k) => b + k.value, 0), l = Math.max(24, t * 0.2), s = (t - l) / 2, i = t / 2, h = 2 * Math.PI * s;
  let p = -h / 4;
  const m = n.map((b) => {
    const k = b.value / a * h, g = `${k} ${h - k}`, L = p;
    return p -= k, { colorVar: b.colorVar, dashArray: g, dashOffset: L };
  }), [v, d] = f(null), o = C(null), u = C(null), x = N(
    (b) => {
      const k = u.current;
      if (!k) return;
      const g = k.getBoundingClientRect(), L = (b.clientX - g.left) / g.width, T = (b.clientY - g.top) / g.height, R = 0.5, j = 0.5, D = L - R, z = T - j, H = (450 - Math.atan2(z, D) * 180 / Math.PI) % 360, P = ae(H, n, a);
      d({ index: P, x: b.clientX - g.left, y: b.clientY - g.top });
    },
    [n, a]
  ), y = N(() => d(null), []);
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-donut", children: [
    /* @__PURE__ */ e("div", { className: "chart-card-title", children: r }),
    /* @__PURE__ */ c("div", { className: "chart-card-content chart-donut-wrap", children: [
      /* @__PURE__ */ c(
        "div",
        {
          ref: o,
          style: { position: "relative", display: "inline-block" },
          onMouseMove: x,
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
                children: m.map((b, k) => /* @__PURE__ */ e(
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
                  k
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
                  /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: n[v.index].label }),
                  /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
                    /* @__PURE__ */ e(
                      "span",
                      {
                        className: "chart-kpi-card-bullet",
                        style: { background: n[v.index].colorVar }
                      }
                    ),
                    /* @__PURE__ */ e("span", { className: "chart-kpi-card-label", children: "Total" }),
                    /* @__PURE__ */ e("span", { className: "chart-kpi-card-value", children: n[v.index].value.toLocaleString() })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e("div", { className: "chart-legend", children: n.map((b, k) => /* @__PURE__ */ c("div", { className: "chart-legend-item", children: [
        /* @__PURE__ */ e(
          "span",
          {
            className: "chart-legend-swatch",
            style: { background: b.colorVar }
          }
        ),
        /* @__PURE__ */ e("span", { className: "chart-legend-label", children: b.label }),
        /* @__PURE__ */ e("span", { className: "chart-legend-value", children: b.value.toLocaleString() })
      ] }, k)) })
    ] })
  ] });
}
function ze({ title: r, items: n }) {
  const t = Math.max(...n.map((d) => d.value), 1), a = 120, [l, s] = f(null), i = C(null), h = N((d, o) => {
    if (!i.current) return;
    const u = i.current.getBoundingClientRect();
    s({
      index: o,
      x: d.clientX - u.left,
      y: d.clientY - u.top
    });
  }, []), p = N(
    (d, o) => h(d, o),
    [h]
  ), m = N(
    (d, o) => {
      (l == null ? void 0 : l.index) === o && h(d, o);
    },
    [l == null ? void 0 : l.index, h]
  ), v = N(() => s(null), []);
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-bar", ref: i, children: [
    /* @__PURE__ */ e("div", { className: "chart-card-title", children: r }),
    /* @__PURE__ */ c("div", { className: "chart-card-content chart-bar-wrap", children: [
      /* @__PURE__ */ e("div", { className: "chart-bars", children: n.map((d, o) => /* @__PURE__ */ c(
        "div",
        {
          className: "chart-bar-group",
          onMouseEnter: (u) => p(u, o),
          onMouseMove: (u) => m(u, o),
          onMouseLeave: v,
          children: [
            /* @__PURE__ */ e(
              "div",
              {
                className: "chart-bar",
                style: {
                  height: `${d.value / t * a}px`
                }
              }
            ),
            /* @__PURE__ */ c("div", { className: "chart-bar-labels", children: [
              /* @__PURE__ */ e("span", { className: "chart-bar-value", children: d.value.toLocaleString() }),
              /* @__PURE__ */ e("span", { className: "chart-bar-label", children: d.label })
            ] })
          ]
        },
        o
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
            /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: n[l.index].label }),
            /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-bullet", style: { background: "var(--chart-bar)" } }),
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-label", children: "Total" }),
              /* @__PURE__ */ e("span", { className: "chart-kpi-card-value", children: n[l.index].value.toLocaleString() })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function He({ label: r, value: n, changePercent: t, trend: a }) {
  const l = a === "increase", s = typeof n == "number" ? n.toLocaleString() : n, i = `${t}% ${a}`;
  return /* @__PURE__ */ c("div", { className: "kpi-card-small", children: [
    /* @__PURE__ */ c("div", { className: "kpi-card-small-header", children: [
      /* @__PURE__ */ e("span", { className: "kpi-card-small-label", children: r }),
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
function Pe({ title: r, description: n, actionLabel: t = "View report", onAction: a, segments: l, totalApplications: s = 15e4 }) {
  const i = l.reduce((d, o) => d + o.percent, 0) || 1, [h, p] = f(null), m = C(null), v = N(
    (d, o) => {
      if (!m.current) return;
      const u = m.current.getBoundingClientRect();
      p({ index: o, x: d.clientX - u.left, y: d.clientY - u.top });
    },
    []
  );
  return /* @__PURE__ */ c("div", { className: "chart-card chart-card-tracker", ref: m, children: [
    /* @__PURE__ */ c("div", { className: "completion-tracker-header", children: [
      /* @__PURE__ */ e("div", { className: "chart-card-title", style: { marginBottom: 0 }, children: r }),
      t && /* @__PURE__ */ e(O, { variant: "primary", size: "sm", onClick: a, children: t })
    ] }),
    n && /* @__PURE__ */ e("p", { className: "completion-tracker-desc", children: n }),
    /* @__PURE__ */ c("div", { className: "completion-tracker-bar-wrap", children: [
      /* @__PURE__ */ e("div", { className: "completion-tracker-bar", children: l.map((d, o) => /* @__PURE__ */ e(
        "div",
        {
          className: `completion-tracker-segment${d.texture ? ` completion-tracker-segment--${d.texture}` : ""}`,
          style: {
            background: (h == null ? void 0 : h.index) === o && d.hoverColorVar ? d.hoverColorVar : d.colorVar,
            width: `${d.percent / i * 100}%`
          },
          onMouseEnter: (u) => v(u, o),
          onMouseMove: (u) => v(u, o),
          onMouseLeave: () => p(null),
          children: d.texture && /* @__PURE__ */ e("div", { className: "completion-tracker-segment-texture", "aria-hidden": !0 })
        },
        o
      )) }),
      /* @__PURE__ */ e("div", { className: "completion-tracker-labels", children: l.map((d, o) => /* @__PURE__ */ c(
        "div",
        {
          className: "completion-tracker-label-cell",
          style: { width: `${d.percent / i * 100}%` },
          onMouseEnter: (u) => v(u, o),
          onMouseMove: (u) => v(u, o),
          onMouseLeave: () => p(null),
          children: [
            /* @__PURE__ */ c("span", { className: "completion-tracker-pct", children: [
              d.percent,
              "%"
            ] }),
            /* @__PURE__ */ e("span", { className: "completion-tracker-name", children: d.label })
          ]
        },
        o
      )) })
    ] }),
    h !== null && (() => {
      const d = l[h.index], o = Math.round(s * d.percent / 100);
      return /* @__PURE__ */ c(
        "div",
        {
          className: "chart-kpi-card",
          style: { left: h.x + 12, top: h.y + 12 },
          children: [
            /* @__PURE__ */ e("div", { className: "chart-kpi-card-title", children: d.label }),
            /* @__PURE__ */ c("div", { className: "chart-kpi-card-row", children: [
              /* @__PURE__ */ e(
                "span",
                {
                  className: "chart-kpi-card-bullet",
                  style: { background: d.colorVar }
                }
              ),
              /* @__PURE__ */ c("span", { className: "chart-kpi-card-value", children: [
                o.toLocaleString(),
                " applications"
              ] }),
              /* @__PURE__ */ c("span", { className: "chart-kpi-card-value", children: [
                d.percent,
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
  we as Alert,
  he as ArrowDownIcon,
  A as Avatar,
  Ce as AvatarWithInfo,
  ye as Badge,
  ze as BarChart,
  Ve as Breadcrumb,
  O as Button,
  pe as ButtonGroup,
  xe as Card,
  fe as Checkbox,
  Pe as CompletionTracker,
  Te as Divider,
  De as DonutChart,
  G as DownloadIcon,
  S as DrawerButton,
  Ae as Dropdown,
  me as FilterGroup,
  de as IconButton,
  ve as Input,
  ue as Link,
  W as Menu,
  Be as Modal,
  Re as Navbar,
  q as PillButton,
  oe as PlusIcon,
  Ie as Progress,
  ge as Radio,
  ke as Select,
  je as SidebarNavigationPanel,
  He as SmallKpiCard,
  We as Spinner,
  Me as Table,
  Le as TableHeader,
  $e as Tabs,
  be as Textarea,
  se as ThemeProvider,
  Ne as Toggle,
  Se as Tooltip
};
//# sourceMappingURL=usds.js.map
