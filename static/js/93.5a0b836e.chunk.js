(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[93],{140:function(t,e,n){"use strict";n.d(e,"a",(function(){return d})),n.d(e,"c",(function(){return l})),n.d(e,"b",(function(){return f})),n.d(e,"d",(function(){return p}));var a=n(2),r=n(57),c=n.n(r),i=n(58),u=n(65),o=n(64),s=function(t){return o.a.get(t).then((function(t){var e;return null===(e=t.data)||void 0===e?void 0:e.data}))},d={create:function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("product",e);case 2:return n=t.sent,a=n.data,t.abrupt("return",null===a||void 0===a?void 0:a.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),update:function(){var t=Object(i.a)(c.a.mark((function t(e,n){var a,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.put("product/".concat(e),n);case 2:return a=t.sent,r=a.data,t.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),delete:function(){var t=Object(i.a)(c.a.mark((function t(e){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.delete("product/".concat(e));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),autocomplete:function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.get("product/autocomplete?q=".concat(e));case 2:return n=t.sent,a=n.data,t.abrupt("return",null===a||void 0===a?void 0:a.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),stock:function(){var t=Object(i.a)(c.a.mark((function t(e){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("product/stock",e);case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),sku:function(){var t=Object(i.a)(c.a.mark((function t(e){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("product/sku",e);case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};function l(t){var e=Object(u.a)("product/".concat(t),s,{revalidateOnFocus:!1}),n=e.data,a=e.mutate,r=e.error;return{loading:!n&&!r,error:r,data:n,mutate:a,update:function(){var e=Object(i.a)(c.a.mark((function e(n){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.update(t,n);case 2:return e.next=4,a();case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}function f(t){var e=t.page,n=t.limit,r=t.search,o=t.order,l=void 0===o?{}:o,f="product/datatable?page=".concat(e,"&limit=").concat(n,"&search=").concat(r,"&order=").concat(JSON.stringify(l)),p=Object(u.a)(f,s),b=p.data,j=p.mutate,v=p.error,m=!b&&!v,h={delete:function(){var t=Object(i.a)(c.a.mark((function t(e){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d.delete(e);case 2:j(Object(a.a)({},b));case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};return{loading:m,error:v,data:(null===b||void 0===b?void 0:b.items)||[],total:(null===b||void 0===b?void 0:b.total)||0,mutates:h}}function p(t){var e=t.page,n=t.limit,a=t.search,r=t.order,c="product/datatable?page=".concat(e,"&limit=").concat(n,"&search=").concat(a,"&order=").concat(null===r||void 0===r?void 0:r.column,"&dir=").concat(null===r||void 0===r?void 0:r.direction),i=Object(u.a)(c,s),o=i.data,d=i.error;return{loading:!o&&!d,error:d,data:(null===o||void 0===o?void 0:o.items)||[],total:(null===o||void 0===o?void 0:o.total)||0}}},153:function(t,e,n){"use strict";var a=n(2),r=n(7),c=n(8),i=n(17),u=n(11),o=n.n(u),s=n(306),d=n(308),l=n(0),f=n(528),p=n(529),b=n(55),j=n(99),v=(n(195),n(3)),m=function(t){var e,n=t.min,u=t.max,s=t.step,d=t.size,m=t.wrap,h=t.value,O=t.style,x=t.upIcon,g=t.disabled,w=t.readonly,y=t.onChange,k=t.downIcon,N=t.vertical,C=t.className,S=t.onDecrement,E=t.onIncrement,D=t.inputClassName,I=Object(i.a)(t,["min","max","step","size","wrap","value","style","upIcon","disabled","readonly","onChange","downIcon","vertical","className","onDecrement","onIncrement","inputClassName"]),B=Object(l.useState)(h||n),z=Object(c.a)(B,2),P=z[0],M=z[1],q=function(t){if(t.preventDefault(),!g&&!w){if(!m&&P<=n)return;M(P-s<n?m?u:n:P-s),S&&E(P)}},A=function(t){if(t.preventDefault(),!g&&!w){if(!m&&P>=u)return;M(P+s>u?m?n:u:P+s),E&&E(P)}};return Object(l.useEffect)((function(){y&&y(P)}),[P]),Object(v.jsxs)(f.a,Object(a.a)(Object(a.a)({className:o()("number-input",(e={disabled:g,readonly:w},Object(r.a)(e,C,C),Object(r.a)(e,"vertical-number-input",N),Object(r.a)(e,"vertical-number-input-".concat(d),N&&d),e))},O?{style:O}:{}),{},{children:[Object(v.jsx)(p.a,{addonType:"prepend",onClick:q,children:Object(v.jsx)(b.a,Object(a.a)(Object(a.a)({className:"btn-icon",color:"transparent"},d?{size:d}:{}),{},{disabled:!m&&P<=n||g||w,children:k}))}),Object(v.jsx)(j.a,Object(a.a)(Object(a.a)({},I),{},{type:"number",value:P,disabled:g,readOnly:w,onKeyDown:function(t){w||(38===t.keyCode&&A(),40===t.keyCode&&q())},onChange:function(t){M(Number(t.target.value))},className:o()(Object(r.a)({},D,D))},d?{bsSize:d}:{})),Object(v.jsx)(p.a,{addonType:"append",onClick:A,children:Object(v.jsx)(b.a,Object(a.a)(Object(a.a)({className:"btn-icon",color:"transparent"},d?{size:d}:{}),{},{disabled:!m&&P>=u||g||w,children:x}))})]}))};e.a=m,m.defaultProps={min:1,step:1,wrap:!1,max:1/0,disabled:!1,readonly:!1,downIcon:Object(v.jsx)(s.a,{size:14}),upIcon:Object(v.jsx)(d.a,{size:14})}},154:function(t,e,n){"use strict";n.d(e,"a",(function(){return d})),n.d(e,"c",(function(){return l})),n.d(e,"b",(function(){return f}));var a=n(2),r=n(57),c=n.n(r),i=n(58),u=(n(65),n(64)),o=n(63),s="user",d={create:function(t){return o.a.create(s,t)},update:function(t,e){return o.a.update(s,t,e)},delete:function(t){return o.a.delete(s,t)},autocomplete:function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.get("".concat(s,"/autocomplete?q=").concat(e));case 2:return n=t.sent,a=n.data,t.abrupt("return",null===a||void 0===a?void 0:a.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),changePassword:function(){var t=Object(i.a)(c.a.mark((function t(e,n){var a,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.post("".concat(s,"/").concat(e,"/change-password"),n);case 2:return a=t.sent,r=a.data,t.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),verificationEmail:function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.post("".concat(s,"/").concat(e,"/verification-email"));case 2:return n=t.sent,a=n.data,t.abrupt("return",null===a||void 0===a?void 0:a.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};function l(t){return Object(o.c)(s,t)}function f(t){var e=Object(o.b)(s,"".concat(s,"/datatable"),t);return e.mutates=Object(a.a)(Object(a.a)({},e.mutates),{},{verificationEmail:d.verificationEmail}),e}},172:function(t,e,n){"use strict";n.d(e,"a",(function(){return c})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return u})),n.d(e,"d",(function(){return o}));var a=n(63),r="coupon",c={create:function(t){return a.a.create(r,t)},update:function(t,e){return a.a.update(r,t,e)},delete:function(t){return a.a.delete(r,t)}};function i(t){return Object(a.c)(r,t)}function u(t){return Object(a.b)(r,"".concat(r,"/datatable"),t)}function o(){return Object(a.d)(r)}},195:function(t,e,n){},200:function(t,e,n){"use strict";n(0),n(11);var a=n(3);e.a=function(t){var e=t.data;return Object(a.jsx)("a",{className:"text-dark",href:"".concat("http://46.101.120.149:3000","/product/").concat(e.sku),target:"_blank",children:e.name})}},289:function(t,e,n){},514:function(t,e,n){"use strict";n.d(e,"a",(function(){return d})),n.d(e,"c",(function(){return l})),n.d(e,"b",(function(){return f}));var a=n(2),r=n(57),c=n.n(r),i=n(58),u=n(65),o=n(64),s=function(t){return o.a.get(t).then((function(t){var e;return null===(e=t.data)||void 0===e?void 0:e.data}))},d={create:function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("invoice",e);case 2:return n=t.sent,a=n.data,t.abrupt("return",null===a||void 0===a?void 0:a.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),update:function(){var t=Object(i.a)(c.a.mark((function t(e,n){var a,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.put("invoice/".concat(e),n);case 2:return a=t.sent,r=a.data,t.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),status:function(){var t=Object(i.a)(c.a.mark((function t(e,n){var a,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("invoice/".concat(e,"/status"),n);case 2:return a=t.sent,r=a.data,t.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()};function l(t){var e="invoice/".concat(t),n=Object(u.a)("invoice/".concat(t),s,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),r=n.data,o=n.error,l=!r&&!o,f=function(){var n=Object(i.a)(c.a.mark((function n(a){return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,d.update(t,a);case 2:return n.next=4,Object(u.b)(e);case 4:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}(),p=function(){var n=Object(i.a)(c.a.mark((function n(i){return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,d.status(t,i);case 2:return n.next=4,Object(u.b)(e,Object(a.a)(Object(a.a)({},r),i),!1);case 4:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}();return{loading:l,error:o,data:r,mutate:u.b,update:f,updateStatus:p}}function f(t){var e=t.page,n=t.limit,a=t.search,r=t.order,c=void 0===r?{}:r,i=t.conditions,o=void 0===i?{}:i,d="invoice/datatable?page=".concat(e,"&limit=").concat(n,"&search=").concat(a,"&order=").concat(JSON.stringify(c),"&conditions=").concat(JSON.stringify(o)),l=Object(u.a)(d,s),f=l.data,p=(l.mutate,l.error);return{loading:!f&&!p,error:p,data:(null===f||void 0===f?void 0:f.items)||[],total:(null===f||void 0===f?void 0:f.total)||0,mutates:{}}}},559:function(t,e,n){"use strict";var a=n(57),r=n.n(a),c=n(58),i=n(8),u=n(89),o=n(152),s=n(751),d=n(55),l=n(69),f=n(0),p=n(22),b=n(85),j=n(3);e.a=function(t){var e=t.update,n=t.invoice,a=Object(f.useState)(null),v=Object(i.a)(a,2),m=v[0],h=v[1];Object(f.useEffect)((function(){m||h(null===n||void 0===n?void 0:n.status)}),[n]);var O=[{label:"New Invoice",value:"DRAFT"},{label:"Canceled",value:"CANCELED"},{label:"Completed",value:"COMPLETED"}],x=function(){var t=Object(c.a)(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:Object(b.a)(Object(c.a)(r.a.mark((function t(){var n,a;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e({status:m});case 3:p.b.success("Success"),t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),p.b.error(null===(n=t.t0.response)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.message);case 9:case"end":return t.stop()}}),t,null,[[0,6]])}))));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),g=function(){var t=Object(c.a)(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:Object(b.b)(Object(c.a)(r.a.mark((function t(){var n,a;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e({status:"CANCELED"});case 3:h("CANCELED"),p.b.success("Success"),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),p.b.error(null===(n=t.t0.response)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.message);case 10:case"end":return t.stop()}}),t,null,[[0,7]])}))));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(j.jsx)(u.a,{className:"invoice-action-wrapper",children:Object(j.jsxs)(o.a,{children:[Object(j.jsx)(s.a,{children:Object(j.jsx)(l.a,{className:"react-select",classNamePrefix:"select",value:O.filter((function(t){return t.value===(m||(null===n||void 0===n?void 0:n.status))})),options:O,onChange:function(t){return h(null===t||void 0===t?void 0:t.value)}})}),Object(j.jsx)(d.a.Ripple,{color:"primary",block:!0,onClick:x,disabled:"COMPLETED"===(null===n||void 0===n?void 0:n.status),children:"Update Status"}),"PENDING"===(null===n||void 0===n?void 0:n.status)&&Object(j.jsx)(d.a.Ripple,{color:"danger",outline:!0,className:"mt-1",block:!0,onClick:g,children:"Delete Invoice"})]})})}},560:function(t,e,n){"use strict";var a=n(2),r=n(88),c=n(84),i=n(57),u=n.n(i),o=n(58),s=n(8),d=n(0),l=n(531),f=n(110),p=n(109),b=n(99),j=n(55),v=n(106),m=n(89),h=n(288),O=n(152),x=n(547),g=n(119),w=n(64),y=n(3);function k(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,e="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=n.length,r=0;r<t;r++)e+=n.charAt(Math.floor(Math.random()*a));return e}function N(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;if(0===t)return"0 Bytes";var n=1024,a=e<0?0:e,r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],c=Math.floor(Math.log(t)/Math.log(n));return"".concat(parseFloat((t/Math.pow(n,c)).toFixed(a))," ").concat(r[c])}e.a=function(t){var e=t.onChange,n=t.files,i=void 0===n?[]:n,C=Object(d.useState)([]),S=Object(s.a)(C,2),E=S[0],D=S[1],I=function(){var t=Object(o.a)(u.a.mark((function t(n){var a,r,c,o;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(a=new FormData).append("file",n.file),a.append("id",n.id),t.next=5,w.a.post("media/invoice",a);case 5:r=t.sent,c=r.data,o=i.map((function(t){return t.id===c.id&&(t.url=c.url,t.key=c.key,t.name=c.name,t.new=!0),t})),e(o);case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),B=Object(l.a)({maxFiles:5,multiple:!0,onDropAccepted:function(t){t=t.map((function(t){return{id:k(),file:t}})),e([].concat(Object(c.a)(i),Object(c.a)(t))),D(t)}}),z=(B.acceptedFiles,B.getRootProps),P=B.getInputProps;Object(d.useEffect)((function(){var t,e=Object(r.a)(E);try{for(e.s();!(t=e.n()).done;){var n=t.value;I(n)}}catch(a){e.e(a)}finally{e.f()}}),[E]),Object(d.useEffect)((function(){e(i)}),[i]);var M=i.filter((function(t){return!t.deleted})).map((function(t,n){var a=t.file,r=t.id,u=t.url,o=t.name,s=t.size;return Object(y.jsxs)("section",{children:[Object(y.jsxs)(f.a,{className:"justify-content-between align-items-center",children:[Object(y.jsx)(p.a,{md:10,className:"mb-1",children:Object(y.jsx)(b.a,{type:"text",disabled:!0,value:"[".concat(N(s||a.size),"] - ").concat(o||u||a.path)})}),Object(y.jsx)(p.a,{md:1,className:"text-center mb-1",children:Object(y.jsx)("a",{href:u,target:"_blank",children:Object(y.jsx)(j.a.Ripple,{block:!0,className:"btn-icon",color:"light",children:u?Object(y.jsx)(x.a,{size:20}):Object(y.jsx)(v.a,{size:"sm"})})})}),Object(y.jsx)(p.a,{md:1,className:"text-center mb-1",children:Object(y.jsx)(j.a.Ripple,{block:!0,className:"btn-icon",color:"light",onClick:function(){return function(t){var n=Object(c.a)(i);n[t].new?n.splice(t,1):n[t].deleted=!0,e(n)}(n)},children:Object(y.jsx)(g.a,{size:20})})})]}),Object(y.jsx)("hr",{className:"m-0 mb-1"})]},r)}));return Object(y.jsxs)(m.a,{children:[Object(y.jsx)(h.a,{children:Object(y.jsx)("h4",{children:"Attachments"})}),Object(y.jsxs)(O.a,{children:[Object(y.jsxs)("div",Object(a.a)(Object(a.a)({},z({className:"dropzone"})),{},{children:[Object(y.jsx)("input",Object(a.a)({},P())),Object(y.jsx)("p",{className:"attachments-box",children:"Drag 'n' drop some files here, or click to select files"})]})),M]})]})}},586:function(t,e,n){"use strict";var a=n(8),r=n(89),c=n(152),i=n(55),u=n(57),o=n.n(u),s=n(58),d=n(84),l=n(530),f=n(528),p=n(99),b=n(529),j=n(199),v=n(669),m=n(664),h=n(665),O=n(751),x=n(666),g=n(59),w=n(119),y=n(307),k=n(0),N=n(176),C=n(85),S=n(153),E=n(140),D=n(200),I=n(3),B=function(t){var e=t.disabled,n=t.form,a=function(t,n,a,r){e||r(t.map((function(t){return t.id===n&&(t[a.name]=a.value),t})))};return Object(I.jsxs)(l.a,{striped:!0,hover:!0,size:"sm",children:[Object(I.jsx)("thead",{children:Object(I.jsxs)("tr",{children:[Object(I.jsx)("th",{children:"Product"}),Object(I.jsx)("th",{width:"15%",children:"Quantity"}),Object(I.jsx)("th",{width:"15%",children:"Price"}),Object(I.jsx)("th",{width:"15%",className:"text-center",children:"Actions"})]})}),Object(I.jsx)("tbody",{children:Object(I.jsx)(g.a,{control:n.control,defaultValue:null,name:"products",render:function(t){var n=t.onChange,r=t.value;t.name,t.ref;return Object(I.jsxs)(I.Fragment,{children:[(r||[]).map((function(t){return Object(I.jsxs)("tr",{children:[Object(I.jsxs)("td",{children:[Object(I.jsx)("img",{className:"mr-75",src:t.image,alt:"angular",height:"60",width:"60"}),Object(I.jsx)("span",{className:"align-middle font-weight-bold",children:Object(I.jsx)(D.a,{data:t})})]}),Object(I.jsx)("td",{children:Object(I.jsx)(S.a,{disabled:e,value:t.quantity,name:"quantity",type:"number",required:!0,onChange:function(e){return a(r,t.id,{name:"quantity",value:e},n)}})}),Object(I.jsx)("td",{children:Object(I.jsxs)(f.a,{children:[Object(I.jsx)(p.a,{disabled:e,value:t.price,name:"price",type:"number",step:1,required:!0,onChange:function(e){a(r,t.id,e.target,n)}}),Object(I.jsx)(b.a,{addonType:"append",children:Object(I.jsx)(j.a,{children:"$"})})]})}),Object(I.jsx)("td",{className:"text-center",children:Object(I.jsx)(w.a,{className:"cursor-pointer",size:20,onClick:function(){return function(t,n,a){if(!e){var r=t.filter((function(t){return t.id!==n})).map((function(t){return t}));Object(C.a)((function(){a(r)}))}}(r,t.id,n)}})})]},t.id)})),Object(I.jsx)("tr",{children:Object(I.jsx)("td",{className:"text-center p-2",children:Object(I.jsx)(z,{products:[],onSubmit:function(t){return function(t,n,a){var r,c;e||(t=null!==(r=t)&&void 0!==r?r:[],n.quantity=1,(null===(c=t)||void 0===c?void 0:c.some((function(t){return t.id===n.id})))||a([].concat(Object(d.a)(t),[n])))}(r,t,n)}})})})]})}})})]})};function z(t){t.products;var e=t.onSubmit,n=Object(k.useState)(!1),r=Object(a.a)(n,2),c=r[0],u=r[1],d=Object(k.useState)(null),l=Object(a.a)(d,2),f=l[0],p=l[1],b=function(t){t.id;var e=t.name,n=t.image,a=(t.price,t.stock);return Object(I.jsxs)("div",{className:"d-flex justify-content-left align-items-center",children:[Object(I.jsx)("div",{className:"avatar mr-50",width:"32",height:"32",children:Object(I.jsx)("img",{src:n,height:"32",width:"32"})}),Object(I.jsxs)("div",{className:"d-flex flex-column",children:[Object(I.jsx)("h6",{className:"user-name text-truncate mb-0",children:e}),Object(I.jsxs)("small",{className:"text-truncate text-muted mb-0",children:["Available Quantity: ",a]})]})]})},j=function(){var t=Object(s.a)(o.a.mark((function t(e){var n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E.a.autocomplete(e);case 2:return n=t.sent,t.abrupt("return",n.map((function(t){var e=t.id,n=t.name,a=t.image,r=t.price,c=t.stock,i=t.min_price,u=t.normal_price,o=t.sku;return{label:b({id:e,name:n,image:a,price:r,stock:c}),value:e,item:{id:e,name:n,image:a,stock:c,price:r,min_price:i,normal_price:u,sku:o}}})));case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)(y.a,{className:"cursor-pointer",size:22,onClick:function(){return u(!0)}}),Object(I.jsxs)(v.a,{isOpen:c,toggle:function(){return u(!c)},className:"modal-dialog-centered",children:[Object(I.jsx)(m.a,{toggle:function(){return u(!c)},children:"Add Product"}),Object(I.jsx)(h.a,{children:Object(I.jsx)(O.a,{children:Object(I.jsx)(N.a,{isClearable:!0,className:"react-select",classNamePrefix:"select",loadOptions:j,cacheOptions:!0,onChange:function(t,e){e.action,e.removedValue;p(null===t||void 0===t?void 0:t.item)}})})}),Object(I.jsxs)(x.a,{children:[Object(I.jsx)(i.a,{color:"primary",onClick:function(){e&&f&&e(f)},children:"Save"})," "]})]})]})}var P=n(67),M=n.n(P),q=n(551),A=n(151),F=n(110),R=n(109),T=n(103),J=(n(154),function(t){var e=t.form,n=(t.invoice,t.disabled);return Object(I.jsxs)(F.a,{children:[Object(I.jsx)(R.a,{sm:"6",children:Object(I.jsxs)(O.a,{children:[Object(I.jsx)(T.a,{for:"number",children:"Invoice Number"}),Object(I.jsx)(p.a,{disabled:n,id:"number",type:"text",name:"number",innerRef:e.register({required:!1}),invalid:e.errors.notes&&!0})]})}),Object(I.jsx)(R.a,{sm:"12",children:Object(I.jsxs)(O.a,{children:[Object(I.jsx)(T.a,{for:"note",children:"Invoice Notes"}),Object(I.jsx)(p.a,{disabled:n,id:"note",type:"textarea",name:"note",innerRef:e.register({required:!1}),invalid:e.errors.notes&&!0})]})})]})});n(7),n(2);n(172),n(69),n(20),e.a=function(t){var e=t.invoice,n=t.form,u=t.isCompleted,o=Object(k.useState)(!0),s=Object(a.a)(o,2),d=s[0],l=s[1],f=n.watch("products");Object(A.h)();return Object(k.useEffect)((function(){l(e&&"COMPLETED"===(null===e||void 0===e?void 0:e.status)||u)}),[e,f]),Object(I.jsxs)(r.a,{children:[Object(I.jsx)(c.a,{className:"px-2 pb-0",children:Object(I.jsxs)("div",{className:"d-flex justify-content-between flex-md-row flex-column",children:[Object(I.jsx)("div",{children:Object(I.jsx)("strong",{children:(null===e||void 0===e?void 0:e.number)?"Invoice: #".concat(null===e||void 0===e?void 0:e.number," "):"New Invoice"})}),Object(I.jsxs)("div",{children:["Date: ",Object(I.jsx)("span",{className:"invoice-number",children:M()().format("Y-MM-DD")})]})]})}),Object(I.jsx)("hr",{className:"invoice-spacing"}),Object(I.jsx)(c.a,{className:"px-2 pt-0",children:Object(I.jsx)(J,{form:n,invoice:e,disabled:u})}),Object(I.jsx)(B,{form:n,disabled:d}),Object(I.jsx)("hr",{className:"invoice-spacing"}),Object(I.jsx)(c.a,{className:"invoice-padding pt-0 d-flex",children:Object(I.jsxs)(i.a.Ripple,{color:"secondary",type:"submit",children:[Object(I.jsx)(q.a,{size:14}),Object(I.jsx)("span",{className:"align-middle ml-25",children:"Save Changes"})]})})]})}},63:function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"c",(function(){return d})),n.d(e,"d",(function(){return l})),n.d(e,"b",(function(){return f})),n.d(e,"e",(function(){return p}));var a=n(57),r=n.n(a),c=n(58),i=n(65),u=n(64),o=function(t){return u.a.get(t).then((function(t){var e;return null===(e=t.data)||void 0===e?void 0:e.data}))},s={create:function(){var t=Object(c.a)(r.a.mark((function t(e,n){var a,c;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.post(e,n);case 2:return a=t.sent,c=a.data,t.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),update:function(){var t=Object(c.a)(r.a.mark((function t(e,n,a){var c,i;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.put("".concat(e,"/").concat(n),a);case 2:return c=t.sent,i=c.data,t.abrupt("return",null===i||void 0===i?void 0:i.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n,a){return t.apply(this,arguments)}}(),delete:function(){var t=Object(c.a)(r.a.mark((function t(e,n){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.delete("".concat(e,"/").concat(n));case 2:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()};function d(t,e){var n=Object(i.a)("".concat(t,"/").concat(e),o),a=n.data,u=n.mutate,d=n.error;return{loading:!a&&!d,error:d,data:a,mutate:u,update:function(){var n=Object(c.a)(r.a.mark((function n(a){return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,s.update(t,e,a);case 2:return n.next=4,u();case 4:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}()}}function l(t){var e=Object(i.a)(t,o,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),n=e.data,a=e.mutate,u=e.error;return{loading:!n&&!u,error:u,data:n||[],mutate:a,create:function(){var t=Object(c.a)(r.a.mark((function t(e){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",s.create(e));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}function f(t,e,n){var a=n.page,u=n.limit,d=n.search,l=n.order,f=void 0===l?{}:l,p=n.conditions,b=void 0===p?{}:p,j="".concat(e,"?page=").concat(a,"&limit=").concat(u,"&search=").concat(d,"&order=").concat(JSON.stringify(f),"&conditions=").concat(JSON.stringify(b)),v=Object(i.a)(j,o),m=v.data,h=v.mutate,O=v.error;return{loading:!m&&!O,error:O,data:(null===m||void 0===m?void 0:m.items)||[],total:(null===m||void 0===m?void 0:m.total)||0,mutate:h,mutates:{delete:function(){var e=Object(c.a)(r.a.mark((function e(n){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.delete(t,n);case 2:return e.next=4,h(j);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}}function p(t,e){var n=e.conditions,a="".concat(t,"?conditions=").concat(JSON.stringify(n)),r=Object(i.a)(a,o),c=r.data,u=r.mutate,s=r.error;return{loading:!c&&!s,error:s,data:(null===c||void 0===c?void 0:c.items)||[],total:(null===c||void 0===c?void 0:c.total)||0,mutate:u}}},774:function(t,e,n){"use strict";n.r(e);var a=n(88),r=n(57),c=n.n(r),i=n(58),u=n(8),o=n(761),s=n(110),d=n(109),l=(n(289),n(0)),f=n(151),p=n(59),b=n(514),j=n(22),v=n(586),m=n(559),h=n(560),O=n(3),x=["number","note","products","status","attachments"];e.default=function(){var t=Object(f.i)().id,e=Object(b.c)(t),n=e.data,r=(e.update,e.updateStatus,Object(p.b)()),g=Object(f.g)(),w=Object(l.useState)(!1),y=Object(u.a)(w,2),k=y[0],N=y[1],C=Object(l.useState)(!1),S=Object(u.a)(C,2),E=(S[0],S[1]),D=function(){var t=Object(i.a)(c.a.mark((function t(e){var n,a,r,i,u;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.products=(null===(n=e.products)||void 0===n?void 0:n.map((function(t){return{id:t.id,price:t.price,quantity:t.quantity}})))||[],t.next=4,b.a.create(e);case 4:a=t.sent,r=a.id,j.b.success("Invoice Created"),g.push("/invoice/edit/".concat(r)),t.next=14;break;case 10:t.prev=10,t.t0=t.catch(0),j.b.error(null===t.t0||void 0===t.t0||null===(i=t.t0.response)||void 0===i||null===(u=i.data)||void 0===u?void 0:u.message),console.log(t.t0);case 14:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(e){return t.apply(this,arguments)}}();return Object(l.useEffect)((function(){if(!k&&n){N(!0);var t,e=Object(a.a)(x);try{for(e.s();!(t=e.n()).done;){var c=t.value;"note"===c||"number"===c||"status"===c?r.setValue(c,null):r.setValue(c,n[c])}}catch(u){e.e(u)}finally{e.f()}}var i="COMPLETED"===(null===n||void 0===n?void 0:n.status);E(i)}),[n]),Object(O.jsx)(o.a,{onSubmit:r.handleSubmit(D),children:Object(O.jsxs)(s.a,{children:[Object(O.jsxs)(d.a,{md:9,sm:12,children:[Object(O.jsx)(v.a,{invoice:n,form:r,isCompleted:!1}),Object(O.jsx)(p.a,{control:r.control,defaultValue:[],name:"attachments",render:function(t){var e=t.value,n=t.onChange;return Object(O.jsx)(h.a,{onChange:n,files:e})}})]}),Object(O.jsx)(d.a,{md:3,sm:12,children:Object(O.jsx)(m.a,{})})]})})}},85:function(t,e,n){"use strict";n.d(e,"a",(function(){return d})),n.d(e,"b",(function(){return l}));var a=n(57),r=n.n(a),c=n(58),i=n(114),u=n.n(i),o=n(115),s=n.n(o)()(u.a),d=function(){var t=Object(c.a)(r.a.mark((function t(e){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:s.fire({title:"Are you sure?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, do it!",customClass:{confirmButton:"btn btn-primary",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(t){t.value&&e()}));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),l=function(){var t=Object(c.a)(r.a.mark((function t(e){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:s.fire({title:"Are you sure want to delete?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it!",customClass:{confirmButton:"btn btn-danger",cancelButton:"btn btn-outline-danger ml-1"},buttonsStyling:!1}).then((function(t){t.value&&e()}));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}]);
//# sourceMappingURL=93.5a0b836e.chunk.js.map