(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[11],{112:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"e",(function(){return l})),r.d(t,"o",(function(){return p})),r.d(t,"d",(function(){return f})),r.d(t,"f",(function(){return v})),r.d(t,"b",(function(){return b})),r.d(t,"c",(function(){return j})),r.d(t,"g",(function(){return m})),r.d(t,"l",(function(){return h})),r.d(t,"k",(function(){return O})),r.d(t,"n",(function(){return x})),r.d(t,"h",(function(){return g})),r.d(t,"m",(function(){return w})),r.d(t,"j",(function(){return y})),r.d(t,"i",(function(){return N}));var n=r(57),a=r.n(n),c=r(59),o=r(63),i=r(64),u=r(66),s=function(e){return i.a.get(e).then((function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.data}))},d={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/order?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},l={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/product-orders?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},p={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/zemam?".concat(t));case 2:return r=e.sent,n=r.data,console.log(null===n||void 0===n?void 0:n.data),e.abrupt("return",null===n||void 0===n?void 0:n.data);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},f=(function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/product-need?".concat(t));case 2:return r=e.sent,n=r.data,console.log(null===n||void 0===n?void 0:n.data),e.abrupt("return",null===n||void 0===n?void 0:n.data);case 6:case"end":return e.stop()}}),e)})))}(),{order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/outlays?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}),v={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/purchases?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},b={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/customs-statement?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},j={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/depts?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},m={order:function(){var e=Object(c.a)(a.a.mark((function e(t){var r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.get("report/product-stock?".concat(t));case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};function h(e){return Object(o.b)("report","report/product-sales",e)}function O(e){return Object(o.b)("report","report/product-sale",e)}function x(e){return Object(o.b)("report","report/product-stock",e)}function g(e){return Object(o.b)("report","report/product-need",e)}function w(e){return Object(o.b)("report","product/sales",e)}function y(e){var t="report/outlays?".concat(e),r=Object(u.a)(t,s,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),n=r.data,a=r.error;return{loading:!(null===n||void 0===n?void 0:n.data)&&!a,error:a,data:n}}function N(e){var t=e.params,r="report/order".concat(t),n=Object(u.a)(r,s,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),a=n.data,c=n.error;return{loading:!(null===a||void 0===a?void 0:a.data)&&!c,error:c,data:a}}},128:function(e,t,r){},56:function(e,t,r){},62:function(e,t,r){"use strict";var n=r(61),a=r(79),c=r(80),o=r(3);t.a=function(e){var t=e.breadCrumbTitle,r=e.breadCrumbParent,i=e.breadCrumbParent2,u=e.breadCrumbParent3,s=e.breadCrumbActive,d=e.right;return Object(o.jsxs)("div",{className:"content-header row",children:[Object(o.jsx)("div",{className:"content-header-left col-9 mb-2",children:Object(o.jsx)("div",{className:"row breadcrumbs-top",children:Object(o.jsxs)("div",{className:"col-12",children:[t?Object(o.jsx)("h2",{className:"content-header-title float-left mb-0",children:t}):"",Object(o.jsx)("div",{className:"breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12",children:Object(o.jsxs)(a.a,{children:[Object(o.jsx)(c.a,{tag:"li",children:Object(o.jsx)(n.b,{to:"/",children:"Home"})}),r&&Object(o.jsx)(c.a,{tag:"li",className:"text-primary",children:r}),i?Object(o.jsx)(c.a,{tag:"li",className:"text-primary",children:i}):"",u?Object(o.jsx)(c.a,{tag:"li",className:"text-primary",children:u}):"",Object(o.jsx)(c.a,{tag:"li",active:!0,children:s})]})})]})})}),d?Object(o.jsx)("div",{className:"content-header-right text-md-right col-3",children:Object(o.jsx)("div",{className:"form-group breadcrum-right dropdown",children:d})}):""]})}},63:function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"c",(function(){return d})),r.d(t,"d",(function(){return l})),r.d(t,"b",(function(){return p})),r.d(t,"e",(function(){return f}));var n=r(57),a=r.n(n),c=r(59),o=r(66),i=r(64),u=function(e){return i.a.get(e).then((function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.data}))},s={create:function(){var e=Object(c.a)(a.a.mark((function e(t,r){var n,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.post(t,r);case 2:return n=e.sent,c=n.data,e.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}(),update:function(){var e=Object(c.a)(a.a.mark((function e(t,r,n){var c,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.put("".concat(t,"/").concat(r),n);case 2:return c=e.sent,o=c.data,e.abrupt("return",null===o||void 0===o?void 0:o.data);case 5:case"end":return e.stop()}}),e)})));return function(t,r,n){return e.apply(this,arguments)}}(),delete:function(){var e=Object(c.a)(a.a.mark((function e(t,r){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.delete("".concat(t,"/").concat(r));case 2:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}()};function d(e,t){var r=Object(o.a)("".concat(e,"/").concat(t),u),n=r.data,i=r.mutate,d=r.error;return{loading:!n&&!d,error:d,data:n,mutate:i,update:function(){var r=Object(c.a)(a.a.mark((function r(n){return a.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,s.update(e,t,n);case 2:return r.next=4,i();case 4:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}()}}function l(e){var t=Object(o.a)(e,u,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),r=t.data,n=t.mutate,i=t.error;return{loading:!r&&!i,error:i,data:r||[],mutate:n,create:function(){var e=Object(c.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s.create(t));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}function p(e,t,r){var n=r.page,i=r.limit,d=r.search,l=r.order,p=void 0===l?{}:l,f=r.conditions,v=void 0===f?{}:f,b="".concat(t,"?page=").concat(n,"&limit=").concat(i,"&search=").concat(d,"&order=").concat(JSON.stringify(p),"&conditions=").concat(JSON.stringify(v)),j=Object(o.a)(b,u),m=j.data,h=j.mutate,O=j.error;return{loading:!m&&!O,error:O,data:(null===m||void 0===m?void 0:m.items)||[],total:(null===m||void 0===m?void 0:m.total)||0,mutate:h,mutates:{delete:function(){var t=Object(c.a)(a.a.mark((function t(r){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s.delete(e,r);case 2:return t.next=4,h(b);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}}function f(e,t){var r=t.conditions,n="".concat(e,"?conditions=").concat(JSON.stringify(r)),a=Object(o.a)(n,u),c=a.data,i=a.mutate,s=a.error;return{loading:!c&&!s,error:s,data:(null===c||void 0===c?void 0:c.items)||[],total:(null===c||void 0===c?void 0:c.total)||0,mutate:i}}},73:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r(278),a=r(292),c=r(3);function o(e){var t=e.title,r=void 0===t?"":t;return Object(c.jsx)(c.Fragment,{children:r&&Object(c.jsx)(n.a,{className:"py-1",children:Object(c.jsx)(a.a,{children:r})})})}},75:function(e,t,r){"use strict";r.d(t,"a",(function(){return y}));var n=r(2),a=r(8),c=r(17),o=r(0),i=r(102),u=r.n(i),s=r(109),d=r(101),l=r(110),p=r(108),f=r(55),v=r(92),b=r(104),j=r(61),m=r(103),h=r.n(m),O=r(290),x=r(76),g=(r(56),r(73)),w=r(3);function y(e){var t=e.useDatatable,r=e.columns,i=e.add,m=e.actions,y=e.conditions,N=e.filterBar,k=e.hasSearch,C=void 0===k||k,S=e.title,F=void 0===S?"":S,P=e.header,L=e.footer,H=void 0===L||L,R=e.initialOrder,W=void 0===R?{}:R,I=Object(c.a)(e,["useDatatable","columns","add","actions","conditions","filterBar","hasSearch","title","header","footer","initialOrder"]),J=Object(o.useState)(0),T=Object(a.a)(J,2),D=T[0],A=T[1],B=Object(o.useState)(10),z=Object(a.a)(B,2),V=z[0],E=z[1],K=Object(o.useState)(W),M=Object(a.a)(K,2),q=M[0],G=M[1],Q=Object(o.useState)(""),U=Object(a.a)(Q,2),X=U[0],Y=U[1],Z=t({page:D,limit:V,search:X,order:q,conditions:y}),$=Z.data,_=Z.total,ee=Z.mutates,te=Z.loading;m&&r.push({name:"Actions",allowOverflow:!0,width:"200px",cell:function(e){return m(e,ee)}});var re=function(e){A(0),Y(e)},ne=function(){return Object(w.jsxs)(l.a,{className:"mx-0 mt-1 mb-50",children:[C&&Object(w.jsx)(p.a,{className:"d-flex align-items-center",sm:"4",children:Object(w.jsx)(x.a,{handleFilter:re,initialSearchValue:X})}),Object(w.jsxs)(p.a,{className:"d-flex align-items-center justify-content-end",sm:"8",children:[N,i&&Object(w.jsx)(f.a.Ripple,{tag:j.b,to:i,color:"primary ml-1",children:"Add Record"})]})]})};return Object(w.jsx)(o.Fragment,{children:Object(w.jsxs)(v.a,{children:[Object(w.jsx)(g.a,{title:F}),P||Object(w.jsx)(ne,{}),Object(w.jsx)(h.a,Object(n.a)({noHeader:!0,className:"react-dataTable",columns:r,sortIcon:Object(w.jsx)(O.a,{size:10}),onSort:function(e,t){G({column:(null===e||void 0===e?void 0:e.sortField)||e.selector,dir:t})},pagination:!0,paginationServer:!0,paginationComponent:function(){var e=Math.ceil(_/V);return H?Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("hr",{className:"my-0"}),Object(w.jsxs)("div",{className:"d-flex",children:[Object(w.jsxs)("div",{className:"px-1 d-flex align-items-center",children:[Object(w.jsx)(s.a,{for:"sort-select",children:"show"}),Object(w.jsxs)(d.a,{className:"dataTable-select",type:"select",id:"sort-select",value:V,onChange:function(e){return function(e){A(0),E(parseInt(e.target.value))}(e)},children:[Object(w.jsx)("option",{value:10,children:"10"}),Object(w.jsx)("option",{value:25,children:"25"}),Object(w.jsx)("option",{value:50,children:"50"}),Object(w.jsx)("option",{value:100,children:"100"})]}),Object(w.jsx)(s.a,{for:"sort-select",children:"entries"})]}),Object(w.jsx)("div",{className:"ml-auto px-1",children:Object(w.jsx)(u.a,{previousLabel:"",nextLabel:"",breakLabel:"...",pageCount:e||1,marginPagesDisplayed:2,pageRangeDisplayed:2,activeClassName:"active",forcePage:D,onPageChange:function(e){return function(e){return A(e.selected)}(e)},pageClassName:"page-item",nextLinkClassName:"page-link",nextClassName:"page-item next",previousClassName:"page-item prev",previousLinkClassName:"page-link",pageLinkClassName:"page-link",breakClassName:"page-item",breakLinkClassName:"page-link",containerClassName:"pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"})})]})]}):Object(w.jsx)(w.Fragment,{})},data:$.slice(0,V),progressPending:te,progressComponent:Object(w.jsx)(b.a,{color:"primary",className:"my-3"}),persistTableHead:!0},I))]})})}},76:function(e,t,r){"use strict";var n=r(8),a=r(0),c=r(109),o=r(101),i=(r(56),r(3));t.a=function(e){var t=e.handleFilter,r=e.initialSearchValue,u=Object(a.useState)(r||""),s=Object(n.a)(u,2),d=s[0],l=s[1],p=Object(a.useState)(),f=Object(n.a)(p,2);f[0],f[1];return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(c.a,{className:"mr-1",for:"search-input",children:"Search"}),Object(i.jsx)(o.a,{className:"dataTable-filter mr-50",type:"text",id:"search-input",value:d,onChange:function(e){l(e.target.value)},onBlur:function(e){t(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&t(e.target.value)}})]})}}}]);
//# sourceMappingURL=11.f8f1df06.chunk.js.map