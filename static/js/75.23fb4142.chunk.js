(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[75],{100:function(e,t,a){"use strict";var n=a(4),r=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b=o.a.oneOfType([o.a.number,o.a.string]),f=o.a.oneOfType([o.a.bool,o.a.number,o.a.string,o.a.shape({size:o.a.oneOfType([o.a.bool,o.a.number,o.a.string]),order:b,offset:b})]),m={tag:d.q,xs:f,sm:f,md:f,lg:f,xl:f,className:o.a.string,cssModule:o.a.object,widths:o.a.array},p={tag:"div",widths:["xs","sm","md","lg","xl"]},j=function(e,t,a){return!0===a||""===a?e?"col":"col-"+t:"auto"===a?e?"col-auto":"col-"+t+"-auto":e?"col-"+a:"col-"+t+"-"+a},v=function(e){var t=e.className,a=e.cssModule,c=e.widths,i=e.tag,o=Object(r.a)(e,["className","cssModule","widths","tag"]),l=[];c.forEach((function(t,n){var r=e[t];if(delete o[t],r||""===r){var c=!n;if(Object(d.k)(r)){var s,i=c?"-":"-"+t+"-",b=j(c,t,r.size);l.push(Object(d.m)(u()(((s={})[b]=r.size||""===r.size,s["order"+i+r.order]=r.order||0===r.order,s["offset"+i+r.offset]=r.offset||0===r.offset,s)),a))}else{var f=j(c,t,r);l.push(f)}}})),l.length||l.push("col");var b=Object(d.m)(u()(t,l),a);return s.a.createElement(i,Object(n.a)({},o,{className:b}))};v.propTypes=m,v.defaultProps=p,t.a=v},105:function(e,t,a){"use strict";var n=a(4),r=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b=o.a.oneOfType([o.a.number,o.a.string]),f={tag:d.q,noGutters:o.a.bool,className:o.a.string,cssModule:o.a.object,form:o.a.bool,xs:b,sm:b,md:b,lg:b,xl:b},m={tag:"div",widths:["xs","sm","md","lg","xl"]},p=function(e){var t=e.className,a=e.cssModule,c=e.noGutters,i=e.tag,o=e.form,l=e.widths,b=Object(r.a)(e,["className","cssModule","noGutters","tag","form","widths"]),f=[];l.forEach((function(t,a){var n=e[t];if(delete b[t],n){var r=!a;f.push(r?"row-cols-"+n:"row-cols-"+t+"-"+n)}}));var m=Object(d.m)(u()(t,c?"no-gutters":null,o?"form-row":"row",f),a);return s.a.createElement(i,Object(n.a)({},b,{className:m}))};p.propTypes=f,p.defaultProps=m,t.a=p},113:function(e,t,a){"use strict";var n=a(0),r=a.n(n),c=a(1),s=a.n(c);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=Object(n.forwardRef)((function(e,t){var a=e.color,n=void 0===a?"currentColor":a,c=e.size,s=void 0===c?24:c,l=o(e,["color","size"]);return r.a.createElement("svg",i({ref:t,xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:n,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),r.a.createElement("polyline",{points:"3 6 5 6 21 6"}),r.a.createElement("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.displayName="Trash",t.a=l},126:function(e,t,a){"use strict";var n=a(0),r=a.n(n),c=a(1),s=a.n(c);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=Object(n.forwardRef)((function(e,t){var a=e.color,n=void 0===a?"currentColor":a,c=e.size,s=void 0===c?24:c,l=o(e,["color","size"]);return r.a.createElement("svg",i({ref:t,xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:n,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},l),r.a.createElement("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),r.a.createElement("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.displayName="Edit",t.a=l},188:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return i}));var n=a(59),r="outlay",c={create:function(e){return n.a.create(r,e)},update:function(e,t){return n.a.update(r,e,t)},delete:function(e){return n.a.delete(r,e)}};function s(e){return Object(n.c)(r,e)}function i(e){return Object(n.b)(r,"".concat(r,"/datatable"),e)}},52:function(e,t,a){},58:function(e,t,a){"use strict";var n=a(57),r=a(72),c=a(73),s=a(3);t.a=function(e){var t=e.breadCrumbTitle,a=e.breadCrumbParent,i=e.breadCrumbParent2,o=e.breadCrumbParent3,l=e.breadCrumbActive,u=e.right;return Object(s.jsxs)("div",{className:"content-header row",children:[Object(s.jsx)("div",{className:"content-header-left col-9 mb-2",children:Object(s.jsx)("div",{className:"row breadcrumbs-top",children:Object(s.jsxs)("div",{className:"col-12",children:[t?Object(s.jsx)("h2",{className:"content-header-title float-left mb-0",children:t}):"",Object(s.jsx)("div",{className:"breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12",children:Object(s.jsxs)(r.a,{children:[Object(s.jsx)(c.a,{tag:"li",children:Object(s.jsx)(n.b,{to:"/",children:"Home"})}),a&&Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:a}),i?Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:i}):"",o?Object(s.jsx)(c.a,{tag:"li",className:"text-primary",children:o}):"",Object(s.jsx)(c.a,{tag:"li",active:!0,children:l})]})})]})})}),u?Object(s.jsx)("div",{className:"content-header-right text-md-right col-3",children:Object(s.jsx)("div",{className:"form-group breadcrum-right dropdown",children:u})}):""]})}},59:function(e,t,a){"use strict";a.d(t,"a",(function(){return l})),a.d(t,"c",(function(){return u})),a.d(t,"d",(function(){return d})),a.d(t,"b",(function(){return b})),a.d(t,"e",(function(){return f}));var n=a(53),r=a.n(n),c=a(54),s=a(61),i=a(60),o=function(e){return i.a.get(e).then((function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.data}))},l={create:function(){var e=Object(c.a)(r.a.mark((function e(t,a){var n,c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.post(t,a);case 2:return n=e.sent,c=n.data,e.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),update:function(){var e=Object(c.a)(r.a.mark((function e(t,a,n){var c,s;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.put("".concat(t,"/").concat(a),n);case 2:return c=e.sent,s=c.data,e.abrupt("return",null===s||void 0===s?void 0:s.data);case 5:case"end":return e.stop()}}),e)})));return function(t,a,n){return e.apply(this,arguments)}}(),delete:function(){var e=Object(c.a)(r.a.mark((function e(t,a){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.delete("".concat(t,"/").concat(a));case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()};function u(e,t){var a=Object(s.a)("".concat(e,"/").concat(t),o),n=a.data,i=a.mutate,u=a.error;return{loading:!n&&!u,error:u,data:n,mutate:i,update:function(){var a=Object(c.a)(r.a.mark((function a(n){return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l.update(e,t,n);case 2:return a.next=4,i();case 4:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}}function d(e){var t=Object(s.a)(e,o,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),a=t.data,n=t.mutate,i=t.error;return{loading:!a&&!i,error:i,data:a||[],mutate:n,create:function(){var e=Object(c.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",l.create(t));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}function b(e,t,a){var n=a.page,i=a.limit,u=a.search,d=a.order,b=void 0===d?{}:d,f=a.conditions,m=void 0===f?{}:f,p="".concat(t,"?page=").concat(n,"&limit=").concat(i,"&search=").concat(u,"&order=").concat(JSON.stringify(b),"&conditions=").concat(JSON.stringify(m)),j=Object(s.a)(p,o),v=j.data,h=j.mutate,O=j.error;return{loading:!v&&!O,error:O,data:(null===v||void 0===v?void 0:v.items)||[],total:(null===v||void 0===v?void 0:v.total)||0,mutate:h,mutates:{delete:function(){var t=Object(c.a)(r.a.mark((function t(a){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l.delete(e,a);case 2:return t.next=4,h(p);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}}function f(e,t){var a=t.conditions,n="".concat(e,"?conditions=").concat(JSON.stringify(a)),r=Object(s.a)(n,o),c=r.data,i=r.mutate,l=r.error;return{loading:!c&&!l,error:l,data:(null===c||void 0===c?void 0:c.items)||[],total:(null===c||void 0===c?void 0:c.total)||0,mutate:i}}},68:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a(192),r=a(274),c=a(3);function s(e){var t=e.title,a=void 0===t?"":t;return Object(c.jsx)(c.Fragment,{children:a&&Object(c.jsx)(n.a,{className:"py-1",children:Object(c.jsx)(r.a,{children:a})})})}},69:function(e,t,a){"use strict";var n=a(8),r=a(0),c=a(101),s=a(95),i=(a(52),a(3));t.a=function(e){var t=e.handleFilter,a=e.initialSearchValue,o=Object(r.useState)(a||""),l=Object(n.a)(o,2),u=l[0],d=l[1],b=Object(r.useState)(),f=Object(n.a)(b,2);f[0],f[1];return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(c.a,{className:"mr-1",for:"search-input",children:"Search"}),Object(i.jsx)(s.a,{className:"dataTable-filter mr-50",type:"text",id:"search-input",value:u,onChange:function(e){d(e.target.value)},onBlur:function(e){t(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&t(e.target.value)}})]})}},71:function(e,t,a){"use strict";a.d(t,"a",(function(){return N}));var n=a(2),r=a(8),c=a(18),s=a(0),i=a(96),o=a.n(i),l=a(101),u=a(95),d=a(105),b=a(100),f=a(51),m=a(87),p=a(98),j=a(57),v=a(97),h=a.n(v),O=a(286),g=a(69),x=(a(52),a(68)),y=a(3);function N(e){var t=e.useDatatable,a=e.columns,i=e.add,v=e.actions,N=e.conditions,w=e.filterBar,k=e.hasSearch,C=void 0===k||k,T=e.title,S=void 0===T?"":T,P=e.header,M=e.footer,E=void 0===M||M,z=e.initialOrder,B=void 0===z?{}:z,L=Object(c.a)(e,["useDatatable","columns","add","actions","conditions","filterBar","hasSearch","title","header","footer","initialOrder"]),F=Object(s.useState)(0),A=Object(r.a)(F,2),D=A[0],H=A[1],R=Object(s.useState)(10),q=Object(r.a)(R,2),I=q[0],J=q[1],W=Object(s.useState)(B),V=Object(r.a)(W,2),Y=V[0],G=V[1],U=Object(s.useState)(""),K=Object(r.a)(U,2),Q=K[0],X=K[1],Z=t({page:D,limit:I,search:Q,order:Y,conditions:N}),$=Z.data,_=Z.total,ee=Z.mutates,te=Z.loading;v&&a.push({name:"Actions",allowOverflow:!0,width:"200px",cell:function(e){return v(e,ee)}});var ae=function(e){H(0),X(e)},ne=function(){return Object(y.jsxs)(d.a,{className:"mx-0 mt-1 mb-50",children:[C&&Object(y.jsx)(b.a,{className:"d-flex align-items-center",sm:"4",children:Object(y.jsx)(g.a,{handleFilter:ae,initialSearchValue:Q})}),Object(y.jsxs)(b.a,{className:"d-flex align-items-center justify-content-end",sm:"8",children:[w,i&&Object(y.jsx)(f.a.Ripple,{tag:j.b,to:i,color:"primary ml-1",children:"Add Record"})]})]})};return Object(y.jsx)(s.Fragment,{children:Object(y.jsxs)(m.a,{children:[Object(y.jsx)(x.a,{title:S}),P||Object(y.jsx)(ne,{}),Object(y.jsx)(h.a,Object(n.a)({noHeader:!0,className:"react-dataTable",columns:a,sortIcon:Object(y.jsx)(O.a,{size:10}),onSort:function(e,t){G({column:(null===e||void 0===e?void 0:e.sortField)||e.selector,dir:t})},pagination:!0,paginationServer:!0,paginationComponent:function(){var e=Math.ceil(_/I);return E?Object(y.jsxs)(y.Fragment,{children:[Object(y.jsx)("hr",{className:"my-0"}),Object(y.jsxs)("div",{className:"d-flex",children:[Object(y.jsxs)("div",{className:"px-1 d-flex align-items-center",children:[Object(y.jsx)(l.a,{for:"sort-select",children:"show"}),Object(y.jsxs)(u.a,{className:"dataTable-select",type:"select",id:"sort-select",value:I,onChange:function(e){return function(e){H(0),J(parseInt(e.target.value))}(e)},children:[Object(y.jsx)("option",{value:10,children:"10"}),Object(y.jsx)("option",{value:25,children:"25"}),Object(y.jsx)("option",{value:50,children:"50"}),Object(y.jsx)("option",{value:100,children:"100"})]}),Object(y.jsx)(l.a,{for:"sort-select",children:"entries"})]}),Object(y.jsx)("div",{className:"ml-auto px-1",children:Object(y.jsx)(o.a,{previousLabel:"",nextLabel:"",breakLabel:"...",pageCount:e||1,marginPagesDisplayed:2,pageRangeDisplayed:2,activeClassName:"active",forcePage:D,onPageChange:function(e){return function(e){return H(e.selected)}(e)},pageClassName:"page-item",nextLinkClassName:"page-link",nextClassName:"page-item next",previousClassName:"page-item prev",previousLinkClassName:"page-link",pageLinkClassName:"page-link",breakClassName:"page-item",breakLinkClassName:"page-link",containerClassName:"pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"})})]})]}):Object(y.jsx)(y.Fragment,{})},data:$.slice(0,I),progressPending:te,progressComponent:Object(y.jsx)(p.a,{color:"primary",className:"my-3"}),persistTableHead:!0},L))]})})}},72:function(e,t,a){"use strict";var n=a(4),r=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,listTag:d.q,className:o.a.string,listClassName:o.a.string,cssModule:o.a.object,children:o.a.node,"aria-label":o.a.string},f=function(e){var t=e.className,a=e.listClassName,c=e.cssModule,i=e.children,o=e.tag,l=e.listTag,b=e["aria-label"],f=Object(r.a)(e,["className","listClassName","cssModule","children","tag","listTag","aria-label"]),m=Object(d.m)(u()(t),c),p=Object(d.m)(u()("breadcrumb",a),c);return s.a.createElement(o,Object(n.a)({},f,{className:m,"aria-label":b}),s.a.createElement(l,{className:p},i))};f.propTypes=b,f.defaultProps={tag:"nav",listTag:"ol","aria-label":"breadcrumb"},t.a=f},73:function(e,t,a){"use strict";var n=a(4),r=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,active:o.a.bool,className:o.a.string,cssModule:o.a.object},f=function(e){var t=e.className,a=e.cssModule,c=e.active,i=e.tag,o=Object(r.a)(e,["className","cssModule","active","tag"]),l=Object(d.m)(u()(t,!!c&&"active","breadcrumb-item"),a);return s.a.createElement(i,Object(n.a)({},o,{className:l,"aria-current":c?"page":void 0}))};f.propTypes=b,f.defaultProps={tag:"li"},t.a=f},81:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return d}));var n=a(53),r=a.n(n),c=a(54),s=a(109),i=a.n(s),o=a(110),l=a.n(o)()(i.a),u=function(){var e=Object(c.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l.fire({title:"Are you sure?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, do it!",customClass:{confirmButton:"btn btn-primary",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(e){e.value&&t()}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(c.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l.fire({title:"Are you sure want to delete?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it!",customClass:{confirmButton:"btn btn-danger",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(e){e.value&&t()}));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},833:function(e,t,a){"use strict";a.r(t);var n=a(8),r=a(0),c=a(58),s=a(71),i=a(188),o=a(63),l=a.n(o),u=a(53),d=a.n(u),b=a(54),f=a(126),m=a(113),p=a(57),j=a(81),v=a(3),h=function(){var e=Object(b.a)(d.a.mark((function e(t,a){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Object(j.b)((function(){return a.delete(t.id)}));case 1:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),O=function(e,t){return Object(v.jsxs)("div",{className:"column-action d-flex align-items-center",children:[Object(v.jsx)(p.b,{to:"/outlay/edit/".concat(e.id),className:"mx-1",children:Object(v.jsx)(f.a,{size:17})}),Object(v.jsx)(p.b,{to:"#",className:"mx-1",children:Object(v.jsx)(m.a,{size:17,onClick:function(){return h(e,t)}})})]})},g=a(66),x=(a(82),[{value:"PURCHASE",label:"Purchase"},{value:"OUTLAY",label:"Outlay"}]);t.default=function(){var e=Object(r.useState)(),t=Object(n.a)(e,2),a=t[0],o=t[1],u=Object(r.useState)([]),d=Object(n.a)(u,2),b=d[0],f=d[1],m=function(){return Object(v.jsx)(g.a,{isClearable:!0,placeholder:"Type",classNamePrefix:"select",className:"react-select w-25",options:x,value:x.filter((function(e){return(null===e||void 0===e?void 0:e.value)===a})),onChange:function(e){return t=null===e||void 0===e?void 0:e.value,a="type",f(t?[{val:t,col:a}]:[]),void o(t);var t,a}})};return Object(v.jsxs)(r.Fragment,{children:[Object(v.jsx)(c.a,{breadCrumbTitle:"Others",breadCrumbActive:"Outlays"}),Object(v.jsx)(s.a,{add:"/outlay/add",useDatatable:i.b,actions:O,initialOrder:{column:"id",dir:"desc"},defaultSortField:"id",defaultSortAsc:!1,conditions:b,filterBar:Object(v.jsx)(m,{}),columns:[{name:"ID",selector:"id",sortable:!0,minWidth:"100px"},{name:"Outlay",selector:"name",sortable:!0},{name:"Type",selector:"type",sortable:!0},{name:"Date",selector:"date",sortable:!0,cell:function(e){return l()(e.date).format("Y-MM-DD")}},{name:"Amount",selector:"amount",sortable:!0}]})]})}},98:function(e,t,a){"use strict";var n=a(4),r=a(5),c=a(0),s=a.n(c),i=a(1),o=a.n(i),l=a(11),u=a.n(l),d=a(12),b={tag:d.q,type:o.a.string,size:o.a.string,color:o.a.string,className:o.a.string,cssModule:o.a.object,children:o.a.string},f=function(e){var t=e.className,a=e.cssModule,c=e.type,i=e.size,o=e.color,l=e.children,b=e.tag,f=Object(r.a)(e,["className","cssModule","type","size","color","children","tag"]),m=Object(d.m)(u()(t,!!i&&"spinner-"+c+"-"+i,"spinner-"+c,!!o&&"text-"+o),a);return s.a.createElement(b,Object(n.a)({role:"status"},f,{className:m}),l&&s.a.createElement("span",{className:Object(d.m)("sr-only",a)},l))};f.propTypes=b,f.defaultProps={tag:"div",type:"border",children:"Loading..."},t.a=f}}]);
//# sourceMappingURL=75.23fb4142.chunk.js.map