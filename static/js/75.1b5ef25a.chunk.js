(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[75],{108:function(e,t,a){"use strict";var r=a(4),n=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,type:o.a.string,size:o.a.string,color:o.a.string,className:o.a.string,cssModule:o.a.object,children:o.a.string},m=function(e){var t=e.className,a=e.cssModule,c=e.type,i=e.size,o=e.color,l=e.children,b=e.tag,m=Object(n.a)(e,["className","cssModule","type","size","color","children","tag"]),p=Object(d.m)(u()(t,!!i&&"spinner-"+c+"-"+i,"spinner-"+c,!!o&&"text-"+o),a);return s.a.createElement(b,Object(r.a)({role:"status"},m,{className:p}),l&&s.a.createElement("span",{className:Object(d.m)("sr-only",a)},l))};m.propTypes=b,m.defaultProps={tag:"div",type:"border",children:"Loading..."},t.a=m},109:function(e,t,a){"use strict";var r=a(4),n=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b=o.a.oneOfType([o.a.number,o.a.string]),m=o.a.oneOfType([o.a.bool,o.a.number,o.a.string,o.a.shape({size:o.a.oneOfType([o.a.bool,o.a.number,o.a.string]),order:b,offset:b})]),p={tag:d.q,xs:m,sm:m,md:m,lg:m,xl:m,className:o.a.string,cssModule:o.a.object,widths:o.a.array},f={tag:"div",widths:["xs","sm","md","lg","xl"]},j=function(e,t,a){return!0===a||""===a?e?"col":"col-"+t:"auto"===a?e?"col-auto":"col-"+t+"-auto":e?"col-"+a:"col-"+t+"-"+a},h=function(e){var t=e.className,a=e.cssModule,c=e.widths,i=e.tag,o=Object(n.a)(e,["className","cssModule","widths","tag"]),l=[];c.forEach((function(t,r){var n=e[t];if(delete o[t],n||""===n){var c=!r;if(Object(d.k)(n)){var s,i=c?"-":"-"+t+"-",b=j(c,t,n.size);l.push(Object(d.m)(u()(((s={})[b]=n.size||""===n.size,s["order"+i+n.order]=n.order||0===n.order,s["offset"+i+n.offset]=n.offset||0===n.offset,s)),a))}else{var m=j(c,t,n);l.push(m)}}})),l.length||l.push("col");var b=Object(d.m)(u()(t,l),a);return s.a.createElement(i,Object(r.a)({},o,{className:b}))};h.propTypes=p,h.defaultProps=f,t.a=h},110:function(e,t,a){"use strict";var r=a(4),n=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b=o.a.oneOfType([o.a.number,o.a.string]),m={tag:d.q,noGutters:o.a.bool,className:o.a.string,cssModule:o.a.object,form:o.a.bool,xs:b,sm:b,md:b,lg:b,xl:b},p={tag:"div",widths:["xs","sm","md","lg","xl"]},f=function(e){var t=e.className,a=e.cssModule,c=e.noGutters,i=e.tag,o=e.form,l=e.widths,b=Object(n.a)(e,["className","cssModule","noGutters","tag","form","widths"]),m=[];l.forEach((function(t,a){var r=e[t];if(delete b[t],r){var n=!a;m.push(n?"row-cols-"+r:"row-cols-"+t+"-"+r)}}));var p=Object(d.m)(u()(t,c?"no-gutters":null,o?"form-row":"row",m),a);return s.a.createElement(i,Object(r.a)({},b,{className:p}))};f.propTypes=m,f.defaultProps=p,t.a=f},116:function(e,t,a){"use strict";var r=a(0),n=a.n(r),c=a(1),s=a.n(c);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},c=Object.keys(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=Object(r.forwardRef)((function(e,t){var a=e.color,r=void 0===a?"currentColor":a,c=e.size,s=void 0===c?24:c,l=o(e,["color","size"]);return n.a.createElement("svg",i({ref:t,xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:r,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),n.a.createElement("polyline",{points:"3 6 5 6 21 6"}),n.a.createElement("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.displayName="Trash",t.a=l},133:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return d})),a.d(t,"d",(function(){return b})),a.d(t,"c",(function(){return m}));var r=a(2),n=a(57),c=a.n(n),s=a(59),i=a(65),o=a(64),l=function(e){return o.a.get(e).then((function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.data}))},u={create:function(){var e=Object(s.a)(c.a.mark((function e(t){var a,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.post("brand",t);case 2:return a=e.sent,r=a.data,e.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),update:function(){var e=Object(s.a)(c.a.mark((function e(t,a){var r,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.put("brand/".concat(t),a);case 2:return r=e.sent,n=r.data,e.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),delete:function(){var e=Object(s.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.delete("brand/".concat(t));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};function d(e){var t=Object(i.a)("brand/".concat(e),l),a=t.data,r=t.mutate,n=t.error;return{loading:!a&&!n,error:n,data:a,mutate:r,update:function(){var t=Object(s.a)(c.a.mark((function t(a){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",u.update(e,a));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}function b(){var e=Object(i.a)("brand",l),t=e.data,a=e.mutate,r=e.error;return{loading:!t&&!r,error:r,data:t||[],mutate:a,create:function(){var e=Object(s.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.create(t));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}function m(e){var t=e.page,a=e.limit,n=e.search,o=e.order,d=void 0===o?{}:o,b="brand/datatable?page=".concat(t,"&limit=").concat(a,"&search=").concat(n,"&order=").concat(JSON.stringify(d)),m=Object(i.a)(b,l),p=m.data,f=m.mutate,j=m.error,h=!p&&!j,g={delete:function(){var e=Object(s.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.delete(t);case 2:f(Object(r.a)({},p));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};return{loading:h,error:j,data:(null===p||void 0===p?void 0:p.items)||[],total:(null===p||void 0===p?void 0:p.total)||0,mutates:g}}},281:function(e,t,a){"use strict";var r=a(0),n=a.n(r),c=a(1),s=a.n(c);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},c=Object.keys(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=Object(r.forwardRef)((function(e,t){var a=e.color,r=void 0===a?"currentColor":a,c=e.size,s=void 0===c?24:c,l=o(e,["color","size"]);return n.a.createElement("svg",i({ref:t,xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:r,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),n.a.createElement("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),n.a.createElement("polyline",{points:"14 2 14 8 20 8"}),n.a.createElement("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),n.a.createElement("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),n.a.createElement("polyline",{points:"10 9 9 9 8 9"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.displayName="FileText",t.a=l},282:function(e,t,a){"use strict";var r=a(0),n=a.n(r),c=a(1),s=a.n(c);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},c=Object.keys(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)a=c[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=Object(r.forwardRef)((function(e,t){var a=e.color,r=void 0===a?"currentColor":a,c=e.size,s=void 0===c?24:c,l=o(e,["color","size"]);return n.a.createElement("svg",i({ref:t,xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:r,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),n.a.createElement("circle",{cx:"12",cy:"12",r:"1"}),n.a.createElement("circle",{cx:"12",cy:"5",r:"1"}),n.a.createElement("circle",{cx:"12",cy:"19",r:"1"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.displayName="MoreVertical",t.a=l},56:function(e,t,a){},62:function(e,t,a){"use strict";var r=a(61),n=a(79),c=a(80),s=a(3);t.a=function(e){var t=e.breadCrumbTitle,a=e.breadCrumbParent,i=e.breadCrumbParent2,o=e.breadCrumbParent3,l=e.breadCrumbActive,u=e.right;return Object(s.jsxs)("div",{className:"content-header row",children:[Object(s.jsx)("div",{className:"content-header-left col-9 mb-2",children:Object(s.jsx)("div",{className:"row breadcrumbs-top",children:Object(s.jsxs)("div",{className:"col-12",children:[t?Object(s.jsx)("h2",{className:"content-header-title float-left mb-0",children:t}):"",Object(s.jsx)("div",{className:"breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12",children:Object(s.jsxs)(n.a,{children:[Object(s.jsx)(c.a,{tag:"li",children:Object(s.jsx)(r.b,{to:"/",children:"Home"})}),a&&Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:a}),i?Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:i}):"",o?Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:o}):"",Object(s.jsx)(c.a,{tag:"li",active:!0,children:l})]})})]})})}),u?Object(s.jsx)("div",{className:"content-header-right text-md-right col-3",children:Object(s.jsx)("div",{className:"form-group breadcrum-right dropdown",children:u})}):""]})}},76:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var r=a(283),n=a(296),c=a(3);function s(e){var t=e.title,a=void 0===t?"":t;return Object(c.jsx)(c.Fragment,{children:a&&Object(c.jsx)(r.a,{className:"py-1",children:Object(c.jsx)(n.a,{children:a})})})}},78:function(e,t,a){"use strict";a.d(t,"a",(function(){return w}));var r=a(2),n=a(8),c=a(17),s=a(0),i=a(106),o=a.n(i),l=a(103),u=a(99),d=a(110),b=a(109),m=a(55),p=a(92),f=a(108),j=a(61),h=a(107),g=a.n(h),v=a(294),O=a(81),x=(a(56),a(76)),y=a(3);function w(e){var t=e.useDatatable,a=e.columns,i=e.add,h=e.actions,w=e.conditions,N=e.filterBar,k=e.hasSearch,C=void 0===k||k,T=e.title,E=void 0===T?"":T,S=e.header,P=e.footer,z=void 0===P||P,M=e.initialOrder,B=void 0===M?{}:M,L=Object(c.a)(e,["useDatatable","columns","add","actions","conditions","filterBar","hasSearch","title","header","footer","initialOrder"]),F=Object(s.useState)(0),D=Object(n.a)(F,2),W=D[0],q=D[1],A=Object(s.useState)(10),I=Object(n.a)(A,2),R=I[0],V=I[1],H=Object(s.useState)(B),G=Object(n.a)(H,2),J=G[0],_=G[1],Y=Object(s.useState)(""),K=Object(n.a)(Y,2),Q=K[0],U=K[1],X=t({page:W,limit:R,search:Q,order:J,conditions:w}),Z=X.data,$=X.total,ee=X.mutates,te=X.loading;h&&a.push({name:"Actions",allowOverflow:!0,width:"200px",cell:function(e){return h(e,ee)}});var ae=function(e){q(0),U(e)},re=function(){return Object(y.jsxs)(d.a,{className:"mx-0 mt-1 mb-50",children:[C&&Object(y.jsx)(b.a,{className:"d-flex align-items-center",sm:"4",children:Object(y.jsx)(O.a,{handleFilter:ae,initialSearchValue:Q})}),Object(y.jsxs)(b.a,{className:"d-flex align-items-center justify-content-end",sm:"8",children:[N,i&&Object(y.jsx)(m.a.Ripple,{tag:j.b,to:i,color:"primary ml-1",children:"Add Record"})]})]})};return Object(y.jsx)(s.Fragment,{children:Object(y.jsxs)(p.a,{children:[Object(y.jsx)(x.a,{title:E}),S||Object(y.jsx)(re,{}),Object(y.jsx)(g.a,Object(r.a)({noHeader:!0,className:"react-dataTable",columns:a,sortIcon:Object(y.jsx)(v.a,{size:10}),onSort:function(e,t){_({column:(null===e||void 0===e?void 0:e.sortField)||e.selector,dir:t})},pagination:!0,paginationServer:!0,paginationComponent:function(){var e=Math.ceil($/R);return z?Object(y.jsxs)(y.Fragment,{children:[Object(y.jsx)("hr",{className:"my-0"}),Object(y.jsxs)("div",{className:"d-flex",children:[Object(y.jsxs)("div",{className:"px-1 d-flex align-items-center",children:[Object(y.jsx)(l.a,{for:"sort-select",children:"show"}),Object(y.jsxs)(u.a,{className:"dataTable-select",type:"select",id:"sort-select",value:R,onChange:function(e){return function(e){q(0),V(parseInt(e.target.value))}(e)},children:[Object(y.jsx)("option",{value:10,children:"10"}),Object(y.jsx)("option",{value:25,children:"25"}),Object(y.jsx)("option",{value:50,children:"50"}),Object(y.jsx)("option",{value:100,children:"100"})]}),Object(y.jsx)(l.a,{for:"sort-select",children:"entries"})]}),Object(y.jsx)("div",{className:"ml-auto px-1",children:Object(y.jsx)(o.a,{previousLabel:"",nextLabel:"",breakLabel:"...",pageCount:e||1,marginPagesDisplayed:2,pageRangeDisplayed:2,activeClassName:"active",forcePage:W,onPageChange:function(e){return function(e){return q(e.selected)}(e)},pageClassName:"page-item",nextLinkClassName:"page-link",nextClassName:"page-item next",previousClassName:"page-item prev",previousLinkClassName:"page-link",pageLinkClassName:"page-link",breakClassName:"page-item",breakLinkClassName:"page-link",containerClassName:"pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"})})]})]}):Object(y.jsx)(y.Fragment,{})},data:Z.slice(0,R),progressPending:te,progressComponent:Object(y.jsx)(f.a,{color:"primary",className:"my-3"}),persistTableHead:!0},L))]})})}},79:function(e,t,a){"use strict";var r=a(4),n=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,listTag:d.q,className:o.a.string,listClassName:o.a.string,cssModule:o.a.object,children:o.a.node,"aria-label":o.a.string},m=function(e){var t=e.className,a=e.listClassName,c=e.cssModule,i=e.children,o=e.tag,l=e.listTag,b=e["aria-label"],m=Object(n.a)(e,["className","listClassName","cssModule","children","tag","listTag","aria-label"]),p=Object(d.m)(u()(t),c),f=Object(d.m)(u()("breadcrumb",a),c);return s.a.createElement(o,Object(r.a)({},m,{className:p,"aria-label":b}),s.a.createElement(l,{className:f},i))};m.propTypes=b,m.defaultProps={tag:"nav",listTag:"ol","aria-label":"breadcrumb"},t.a=m},80:function(e,t,a){"use strict";var r=a(4),n=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,active:o.a.bool,className:o.a.string,cssModule:o.a.object},m=function(e){var t=e.className,a=e.cssModule,c=e.active,i=e.tag,o=Object(n.a)(e,["className","cssModule","active","tag"]),l=Object(d.m)(u()(t,!!c&&"active","breadcrumb-item"),a);return s.a.createElement(i,Object(r.a)({},o,{className:l,"aria-current":c?"page":void 0}))};m.propTypes=b,m.defaultProps={tag:"li"},t.a=m},81:function(e,t,a){"use strict";var r=a(8),n=a(0),c=a(103),s=a(99),i=(a(56),a(3));t.a=function(e){var t=e.handleFilter,a=e.initialSearchValue,o=Object(n.useState)(a||""),l=Object(r.a)(o,2),u=l[0],d=l[1],b=Object(n.useState)(),m=Object(r.a)(b,2);m[0],m[1];return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(c.a,{className:"mr-1",for:"search-input",children:"Search"}),Object(i.jsx)(s.a,{className:"dataTable-filter mr-50",type:"text",id:"search-input",value:u,onChange:function(e){d(e.target.value)},onBlur:function(e){t(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&t(e.target.value)}})]})}},826:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a(62),c=a(78),s=a(133),i=a(57),o=a.n(i),l=a(59),u=a(747),d=a(821),b=a(748),m=a(750),p=a(282),f=a(281),j=a(116),h=a(61),g=a(87),v=a(20),O=a(3),x=function(){var e=Object(l.a)(o.a.mark((function e(t,a,r){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),Object(g.a)((function(){return r.delete(a.id)}));case 2:case"end":return e.stop()}}),e)})));return function(t,a,r){return e.apply(this,arguments)}}(),y=v.a.can("read","category_edit"),w=v.a.can("read","category_delete"),N=function(e,t){return Object(O.jsx)("div",{className:"column-action d-flex align-items-center",children:(w||y)&&Object(O.jsxs)(u.a,{children:[Object(O.jsx)(d.a,{className:"pr-1",tag:"span",children:Object(O.jsx)(p.a,{size:15,className:"cursor-pointer"})}),Object(O.jsxs)(b.a,{right:!0,children:[y&&Object(O.jsxs)(m.a,{tag:h.b,to:"/brand/edit/".concat(e.id),className:"w-100",children:[Object(O.jsx)(f.a,{size:15}),Object(O.jsx)("span",{className:"align-middle ml-50",children:"Edit"})]}),w&&Object(O.jsxs)(m.a,{tag:"a",href:"/",className:"w-100",onClick:function(a){return x(a,e,t)},children:[Object(O.jsx)(j.a,{size:15}),Object(O.jsx)("span",{className:"align-middle ml-50",children:"Delete"})]})]})]})})},k=v.a.can("read","category_add");t.default=function(){return Object(O.jsxs)(r.Fragment,{children:[Object(O.jsx)(n.a,{breadCrumbTitle:"Brands",breadCrumbActive:"Brands"}),Object(O.jsx)(c.a,{add:k?"/brand/add":null,useDatatable:s.c,actions:N,columns:[{name:"ID",selector:"id",sortable:!0,minWidth:"100px"},{name:"Name",selector:"name",sortable:!0,minWidth:"225px"},{name:"Slug",selector:"slug",sortable:!0,minWidth:"250px"},{name:"Order",selector:"order",sortable:!0,minWidth:"250px"}]})]})}},87:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return d}));var r=a(57),n=a.n(r),c=a(59),s=a(113),i=a.n(s),o=a(114),l=a.n(o)()(i.a),u=function(){var e=Object(c.a)(n.a.mark((function e(t){return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l.fire({title:"Are you sure?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, do it!",customClass:{confirmButton:"btn btn-primary",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(e){e.value&&t()}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(c.a)(n.a.mark((function e(t){return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l.fire({title:"Are you sure want to delete?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it!",customClass:{confirmButton:"btn btn-danger",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(e){e.value&&t()}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}]);
//# sourceMappingURL=75.1b5ef25a.chunk.js.map