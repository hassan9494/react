(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[110],{761:function(e,t,a){"use strict";a.r(t);var l=a(8),i=a(0),o=a(62),s=a(75),n=a(129),r=a(280),c=a(741),d=a(86),u=a(71),p=a(20),m=a(3),v=[{value:!1,label:"Paid"},{value:!0,label:"Zemam"}],h={WAITING:"light-warning",SHIPPED:"light-info",DELIVERED:"light-success"};t.default=function(){var e=Object(i.useState)(!1),t=Object(l.a)(e,2),a=t[0],b=t[1],x=Object(i.useState)([{col:"status",op:"=",val:"PROCESSING"},{col:"options->dept",op:"=",val:!1},{col:"shipping->status",op:"!=",val:"SHIPPED"},{col:"shipping->status",op:"!=",val:"DELIVERED"},p.a.can("read","untaxed_list_view")||p.a.can("read","befor_completed_untaxed_list_view")?{}:{col:"options->taxed",val:!0}]),j=Object(l.a)(x,2),f=j[0],O=j[1],g=function(){return Object(m.jsx)(u.a,{theme:d.c,classNamePrefix:"select",className:"react-select w-25",options:v,value:v.filter((function(e){return e.value===a})),onChange:function(e){return function(e,t){var a=f.filter((function(e){return e.col!==t}));null!==e&&void 0!==e&&(a.push({val:e,col:t}),O(a)),b(e)}(null===e||void 0===e?void 0:e.value,"options->dept")}})},N=p.a.can("read","order_add");return Object(m.jsxs)(i.Fragment,{children:[Object(m.jsx)(o.a,{breadCrumbTitle:"Orders",breadCrumbActive:"Orders"}),Object(m.jsx)(s.a,{useDatatable:n.b,initialOrder:{column:"id",dir:"desc"},defaultSortField:"number",defaultSortAsc:!1,filterBar:Object(m.jsx)(g,{}),conditions:f,actions:r.a,add:N?"/order/create":null,columns:[{name:"Number",selector:"number",sortable:!0,defaultSortAsc:!1,sortField:"id",minWidth:"100px"},{name:"customer",selector:"customer.name",sortable:!0,sortField:"customer->name",minWidth:"100px"},{name:"phone",selector:"customer.phone",sortable:!0,sortField:"customer->phone",minWidth:"100px"},{name:"Info",sortable:!1,minWidth:"100px",cell:function(e){var t,a,l,i,o;return Object(m.jsxs)(m.Fragment,{children:[(null===(t=e.options)||void 0===t?void 0:t.dept)&&Object(m.jsx)(c.a,{className:"text-capitalize",color:"light-secondary",pill:!0,children:"Zemam"}),(null===(a=e.options)||void 0===a?void 0:a.taxed)&&Object(m.jsx)(c.a,{className:"text-capitalize",color:"light-secondary",pill:!0,children:"Taxed"}),!(null===(l=e.options)||void 0===l?void 0:l.taxed)&&Object(m.jsx)(c.a,{className:"text-capitalize",color:"light-secondary",pill:!0,children:"Normal"}),(null===(i=e.options)||void 0===i?void 0:i.tax_exempt)&&Object(m.jsx)(c.a,{className:"text-capitalize",color:"light-secondary",pill:!0,children:"M3fe"}),(null===(o=e.options)||void 0===o?void 0:o.price_offer)&&Object(m.jsx)(c.a,{className:"text-capitalize",color:"light-secondary",pill:!0,children:"Offer"})]})}},{name:"shipping",selector:"shipping.status",sortable:!0,sortField:"shipping->status",minWidth:"100px",cell:function(e){var t,a;return Object(m.jsx)(c.a,{className:"text-capitalize",color:h[null===e||void 0===e||null===(t=e.shipping)||void 0===t?void 0:t.status]||"",pill:!0,children:null===e||void 0===e||null===(a=e.shipping)||void 0===a?void 0:a.status})}},{name:"Total",selector:"total",sortable:!0,minWidth:"100px",cell:function(e){return Number.parseFloat(null===e||void 0===e?void 0:e.total).toFixed(2)}}]})]})}}}]);
//# sourceMappingURL=110.7dfc3717.chunk.js.map