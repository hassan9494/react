(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[125],{123:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"c",(function(){return j})),n.d(t,"b",(function(){return h}));var r=n(2),c=n(57),s=n.n(c),i=n(59),a=n(65),l=n(64),d=function(e){return l.a.get(e).then((function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.data}))},o={create:function(){var e=Object(i.a)(s.a.mark((function e(t){var n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.post("order",t);case 2:return n=e.sent,r=n.data,e.abrupt("return",null===r||void 0===r?void 0:r.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),update:function(){var e=Object(i.a)(s.a.mark((function e(t,n){var r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.put("order/".concat(t),n);case 2:return r=e.sent,c=r.data,e.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),status:function(){var e=Object(i.a)(s.a.mark((function e(t,n){var r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.post("order/".concat(t,"/status"),n);case 2:return r=e.sent,c=r.data,e.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),supplier:function(){var e=Object(i.a)(s.a.mark((function e(t,n){var r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.post("order/".concat(t,"/supplier"),n);case 2:return r=e.sent,c=r.data,e.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),shippingStatus:function(){var e=Object(i.a)(s.a.mark((function e(t,n){var r,c,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.status,e.next=3,l.a.post("order/".concat(t,"/shipping-status"),{shipping_status:r});case 3:return c=e.sent,i=c.data,e.abrupt("return",null===i||void 0===i?void 0:i.data);case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()};function j(e){var t="order/".concat(e),n=Object(a.a)("order/".concat(e),d,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),c=n.data,l=n.error,j=!c&&!l,h=function(){var n=Object(i.a)(s.a.mark((function n(r){return s.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,o.update(e,r);case 2:return n.next=4,Object(a.b)(t);case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),b=function(){var n=Object(i.a)(s.a.mark((function n(i){return s.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,o.status(e,i);case 2:return n.next=4,Object(a.b)(t,Object(r.a)(Object(r.a)({},c),i),!1);case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),x=function(){var n=Object(i.a)(s.a.mark((function n(i){return s.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,o.supplier(e,i);case 2:return n.next=4,Object(a.b)(t,Object(r.a)(Object(r.a)({},c),{},{status:i.status}),!1);case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return{loading:j,error:l,data:c,mutate:a.b,update:h,updateStatus:b,updateSupplier:x,updateShippingStatus:function(t){return o.shippingStatus(e,t)}}}function h(e){var t=e.page,n=e.limit,r=e.search,c=e.order,s=void 0===c?{}:c,i=e.conditions,l=void 0===i?{}:i,o="order/datatable?page=".concat(t,"&limit=").concat(n,"&search=").concat(r,"&order=").concat(JSON.stringify(s),"&conditions=").concat(JSON.stringify(l)),j=Object(a.a)(o,d),h=j.data,b=(j.mutate,j.error);return{loading:!h&&!b,error:b,data:(null===h||void 0===h?void 0:h.items)||[],total:(null===h||void 0===h?void 0:h.total)||0,mutates:{}}}},124:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(172),c=n(173),s=n(69),i=n.n(s);function a(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];n&&(t="".concat(t,"-").concat(i()().format("Y-MM-DD")));var s="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",a=".xlsx",l=c.utils.json_to_sheet(e),d={Sheets:{data:l},SheetNames:["data"]},o=c.write(d,{bookType:"xlsx",type:"array"}),j=new Blob([o],{type:s});r.saveAs(j,t+a)}},136:function(e,t,n){},152:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return a}));var r=n(124),c=n(69),s=n.n(c),i=function(e){var t=Number.parseFloat(e.discount)||0,n=Number.parseFloat(e.subtotal)||0,r=Number.parseFloat(e.tax_amount||0),c=n-t-r,s=n-t;return{fixedDiscount:t,discount:(t+r).toFixed(2),total:s.toFixed(2),subtotal:n.toFixed(2),subtotalDiscount:c.toFixed(2),taxAmount:r.toFixed(2)}},a=function(e,t){Object(r.a)(e.map((function(e){var t,n=i(e),r=n.discount,c=n.total,a=n.subtotal,l=n.subtotalDiscount,d=n.taxAmount;return{Number:e.id,"Invoice Number":e.tax_number,date:s()(e.created_at).format("DD/MM/Y"),name:null===(t=e.customer)||void 0===t?void 0:t.name,subtotal:a,discount:r,subtotalDiscount:l,tax:d,total:c,"Is Returned":"RETURNED"===e.status||"CANCELED"===e.status?"\u0645\u0631\u062a\u062c\u0639":""}})),t||"orders-report")}},157:function(e,t){},174:function(e,t){},175:function(e,t){},211:function(e,t,n){"use strict";function r(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"SDG",r=e.toString().split(".");if(this.fraction=0,r.length>1)if(r[1].length>1)if((t=parseInt(r[1]))>=1&&t<=99)this.fraction=1===r[1].length?10*t:t;else{var c=Array.from(r[1]);this.fraction="";for(var s=0;s<this.currencies[n].decimals;s++)this.fraction+=c[s]}else this.fraction=parseInt(r[1]);this.digit=r[0],this.currency=n}n.d(t,"a",(function(){return r})),r.prototype.parse=function(){var e=[],t=[],n=1,r=this.length(),c=this.getColumnIndex();if(!(r>=16)){Array.from(this.digit.toString()).reverse().forEach((function(c,s){t.push(c),3==n&&(e.unshift(t),t=[],n=0),0==n&&r-(s+1)<3&&r-(s+1)!=0&&e.unshift(t),n++}));for(var s=[],i=this.getColumnIndex();i<this.columns.length;i++)s[i]=" \u0648";if(this.digit>999&&0==parseInt(Array.from(e[e.length-1]).join("")))for(s[parseInt(s.length-1)]="",l=e.length-1;l>=1&&0==parseInt(Array.from(e[l]).join(""));l--)s[l]="";var a="";if(a+="\u0641\u0642\u0637 ",this.length()>=1&&this.length()<=3)a+=this.read(this.digit);else for(var l=0;l<e.length;l++){var d=parseInt(e[l].reverse().join(""));0!=d?(null==c||c+1>this.columns.length?a+=this.read(d):a+=this.addSuffixPrefix(e[l],c)+s[c],c++):c++}return""!=this.currency&&(this.digit>=3&&this.digit<=10?a+=" "+this.currencies[this.currency].plural:a+=" "+this.currencies[this.currency].singular,0!=this.fraction&&(this.digit>=3&&this.digit<=10?a+=" \u0648"+this.read(this.fraction)+" "+this.currencies[this.currency].fractions:a+=" \u0648"+this.read(this.fraction)+" "+this.currencies[this.currency].fraction)),a+=" \u0644\u0627 \u063a\u064a\u0631"}console.error("Number out of range!")},r.prototype.addSuffixPrefix=function(e,t){if(1!=e.length){var n=parseInt(e.join(""));return n>1?this.read(n)+" "+this[this.columns[t]].singular:this[this.columns[t]].singular}return 1==parseInt(e[0])?this[this.columns[t]].singular:2==parseInt(e[0])?this[this.columns[t]].binary:parseInt(e[0])>2&&parseInt(e[0])<=9?this.readOnes(parseInt(e[0]))+" "+this[this.columns[t]].plural:void 0},r.prototype.read=function(e){var t="",n=Array.from(e.toString()).length;return 1==n?t+=this.readOnes(e):2==n?t+=this.readTens(e):3==n&&(t+=this.readHundreds(e)),t},r.prototype.readOnes=function(e){if(0!=e)return this.ones["_"+e.toString()]},r.prototype.readTens=function(e){return"0"===Array.from(e.toString())[1]?this.tens["_"+e.toString()]:e>10&&e<20?this.teens["_"+e.toString()]:e>19&&e<100&&"0"!==Array.from(e.toString())[1]?this.readOnes(Array.from(e.toString())[1])+" \u0648"+this.tens["_"+Array.from(e.toString())[0]+"0"]:void 0},r.prototype.readHundreds=function(e){var t="";return t+=this.hundreds["_"+Array.from(e.toString())[0]+"00"],"0"===Array.from(e.toString())[1]&&"0"!==Array.from(e.toString())[2]&&(t+=" \u0648"+this.readOnes(Array.from(e.toString())[2])),"0"!==Array.from(e.toString())[1]&&(t+=" \u0648"+this.readTens((Array.from(e.toString())[1]+Array.from(e.toString())[2]).toString())),t},r.prototype.length=function(){return Array.from(this.digit.toString()).length},r.prototype.getColumnIndex=function(){var e=null;return this.length()>12?e=0:this.length()<=12&&this.length()>9?e=1:this.length()<=9&&this.length()>6?e=2:this.length()<=6&&this.length()>=4&&(e=3),e},r.prototype.ones={_1:"\u0648\u0627\u062d\u062f",_2:"\u0671\u062b\u0646\u064a\u0646",_3:"\u062b\u0644\u0627\u062b\u0629",_4:"\u0623\u0631\u0628\u0639\u0629",_5:"\u062e\u0645\u0633\u0629",_6:"\u0633\u062a\u0629",_7:"\u0633\u0628\u0639\u0629",_8:"\u062b\u0645\u0627\u0646\u064a\u0629",_9:"\u062a\u0633\u0639\u0629"},r.prototype.teens={_11:"\u0623\u062d\u062f \u0639\u0634\u0631",_12:"\u0623\u062b\u0646\u064a \u0639\u0634\u0631",_13:"\u062b\u0644\u0627\u062b\u0629 \u0639\u0634\u0631",_14:"\u0623\u0631\u0628\u0639\u0629 \u0639\u0634\u0631",_15:"\u062e\u0645\u0633\u0629 \u0639\u0634\u0631",_16:"\u0633\u062a\u0629 \u0639\u0634\u0631",_17:"\u0633\u0628\u0639\u0629 \u0639\u0634\u0631",_18:"\u062b\u0645\u0627\u0646\u064a\u0629 \u0639\u0634\u0631",_19:"\u062a\u0633\u0639\u0629 \u0639\u0634\u0631"},r.prototype.tens={_10:"\u0639\u0634\u0631\u0629",_20:"\u0639\u0634\u0631\u0648\u0646",_30:"\u062b\u0644\u0627\u062b\u0648\u0646",_40:"\u0623\u0631\u0628\u0639\u0648\u0646",_50:"\u062e\u0645\u0633\u0648\u0646",_60:"\u0633\u062a\u0648\u0646",_70:"\u0633\u0628\u0639\u0648\u0646",_80:"\u062b\u0645\u0627\u0646\u0648\u0646",_90:"\u062a\u0633\u0639\u0648\u0646"},r.prototype.hundreds={_100:"\u0645\u0627\u0626\u0629",_200:"\u0645\u0627\u0626\u062a\u064a\u0646",_300:"\u062b\u0644\u0627\u062b\u0645\u0627\u0626\u0629",_400:"\u0623\u0631\u0628\u0639\u0645\u0627\u0626\u0629",_500:"\u062e\u0645\u0633\u0645\u0627\u0626\u0629",_600:"\u0633\u062a\u0645\u0627\u0626\u0629",_700:"\u0633\u0628\u0639\u0645\u0627\u0626\u0629",_800:"\u062b\u0645\u0627\u0646\u0645\u0627\u0626\u0629",_900:"\u062a\u0633\u0639\u0645\u0627\u0626\u0629"},r.prototype.thousands={singular:"\u0623\u0644\u0641",binary:"\u0623\u0644\u0641\u064a\u0646",plural:"\u0623\u0644\u0622\u0641"},r.prototype.milions={singular:"\u0645\u0644\u064a\u0648\u0646",binary:"\u0645\u0644\u064a\u0648\u0646\u064a\u0646",plural:"\u0645\u0644\u0627\u064a\u064a\u0646"},r.prototype.bilions={singular:"\u0645\u0644\u064a\u0627\u0631",binary:"\u0645\u0644\u064a\u0627\u0631\u064a\u0646",plural:"\u0645\u0644\u064a\u0627\u0631\u0627\u062a"},r.prototype.trilions={singular:"\u062a\u0631\u0644\u064a\u0648\u0646",binary:"\u062a\u0631\u0644\u064a\u0648\u0646\u064a\u0646",plural:"\u062a\u0631\u0644\u064a\u0648\u0646\u0627\u062a"},r.prototype.columns=["trilions","bilions","milions","thousands"],r.prototype.currencies={SDG:{singular:"\u062c\u0646\u064a\u0647 \u0633\u0648\u062f\u0627\u0646\u064a",plural:"\u062c\u0646\u064a\u0647\u0627\u062a \u0633\u0648\u062f\u0627\u0646\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},JOD:{singular:"\u062f\u064a\u0646\u0627\u0631\u064b\u0627 \u0623\u0631\u062f\u0646\u064a\u064b\u0627",plural:"\u062f\u064a\u0646\u0627\u0631\u0627\u062a \u0623\u0631\u062f\u0646\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},SAR:{singular:"\u0631\u064a\u0627\u0644 \u0633\u0639\u0648\u062f\u064a",plural:"\u0631\u064a\u0627\u0644\u0627\u062a \u0633\u0639\u0648\u062f\u064a\u0629",fraction:"\u0647\u0644\u0644\u0629",fractions:"\u0647\u0644\u0644\u0627\u062a",decimals:2},QAR:{singular:"\u0631\u064a\u0627\u0644 \u0642\u0637\u0631\u064a",plural:"\u0631\u064a\u0627\u0644\u0627\u062a \u0642\u0637\u0631\u064a\u0629",fraction:"\u062f\u0631\u0647\u0645",fractions:"\u062f\u0631\u0627\u0647\u0645",decimals:2},AED:{singular:"\u062f\u0631\u0647\u0645 \u0623\u0645\u0627\u0631\u0627\u062a\u064a",plural:"\u062f\u0631\u0627\u0647\u0645 \u0623\u0645\u0627\u0631\u0627\u062a\u064a\u0629",fraction:"\u0641\u0644\u0633",fractions:"\u0641\u0644\u0648\u0633",decimals:2},EGP:{singular:"\u062c\u0646\u064a\u0647 \u0645\u0635\u0631\u064a",plural:"\u062c\u0646\u064a\u0647\u0627\u062a \u0645\u0635\u0631\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},USD:{singular:"\u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a",plural:"\u062f\u0648\u0644\u0627\u0631\u0627\u062a \u0623\u0645\u0631\u064a\u0643\u064a\u0629",fraction:"\u0633\u0646\u062a",fractions:"\u0633\u0646\u062a\u0627\u062a",decimals:2},AUD:{singular:"\u062f\u0648\u0644\u0627\u0631 \u0623\u0633\u062a\u0631\u0627\u0644\u064a",plural:"\u062f\u0648\u0644\u0627\u0631\u0627\u062a \u0623\u0633\u062a\u0631\u0627\u0644\u064a\u0629",fraction:"\u0633\u0646\u062a",fractions:"\u0633\u0646\u062a\u0627\u062a",decimals:2},TND:{singular:"\u062f\u064a\u0646\u0627\u0631 \u062a\u0648\u0646\u0633\u064a",plural:"\u062f\u0646\u0627\u0646\u064a\u0631 \u062a\u0648\u0646\u0633\u064a\u0629",fraction:"\u0645\u0644\u064a\u0645",fractions:"\u0645\u0644\u064a\u0645\u0627\u062a",decimals:3},TRY:{singular:"\u0644\u064a\u0631\u0629 \u062a\u0631\u0643\u064a\u0629",plural:"\u0644\u064a\u0631\u0627\u062a \u062a\u0631\u0643\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2}}},842:function(e,t,n){"use strict";n.r(t);var r=n(0),c=(n(136),n(153)),s=n(123),i=n(72),a=n(99),l=n(97),d=n(211),o=n(69),j=n.n(o),h=n(3);function b(e){e.order;return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(a.a,{children:[Object(h.jsxs)(l.a,{children:[Object(h.jsx)("p",{children:"\u0639\u0645\u0627\u0646 - \u0634\u0627\u0631\u0639 \u0627\u0644\u0645\u0644\u0643\u0629 \u0631\u0627\u0646\u064a\u0627 - \u0637\u0644\u0648\u0639 \u0646\u064a\u0641\u064a\u0646 - \u0645\u062c\u0645\u0639 \u062e\u0644\u064a\u0641\u0629"}),Object(h.jsx)("p",{children:"\u0627\u0644\u0637\u0627\u0628\u0642 \u0627\u0644\u062b\u0627\u0644\u062b - \u0645\u0643\u062a\u0628 308"}),Object(h.jsx)("p",{children:"\u0647\u0627\u062a\u0641 : 065344772"}),Object(h.jsx)("p",{children:"\u0641\u0627\u0643\u0633 : 065344778"}),Object(h.jsx)("p",{children:"\u0628\u0631\u064a\u062f \u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: info@mikroelectron.com"}),Object(h.jsx)("p",{children:"\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: www.mikroelectron.com"})]}),Object(h.jsx)(l.a,{children:Object(h.jsxs)("div",{className:"float-left",children:[Object(h.jsx)("img",{src:"http://mikroelectron.com/assets/img/logo-1.png",width:"325px",height:"auto",alt:"Logo MikroElectron"}),Object(h.jsx)("p",{className:"pb-1",children:"\u0645\u0624\u0633\u0633\u0629 \u0645\u0646\u062a\u0635\u0631 \u0648\u0645\u062d\u0645\u0648\u062f \u0644\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a"}),Object(h.jsx)("p",{children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0636\u0631\u064a\u0628\u064a : 013461320"})})]})})]}),Object(h.jsx)("hr",{})]})}function x(e){var t=e.order;return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)("br",{}),Object(h.jsxs)(a.a,{className:"mt-2",children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0644\u0645 :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1"})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0626\u0639 :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:"Muntasir"})]})})})]}),Object(h.jsx)(a.a,{className:"mt-2",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u0645\u0644\u0627\u062d\u0638\u0627\u062a :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:null===t||void 0===t?void 0:t.invoice_notes})]})})})}),Object(h.jsx)("p",{className:"text-left",children:null===t||void 0===t?void 0:t.number})]})}var u=function(e){var t,n,r,c=e.order,s=e.meta,o=s.total,u=s.subtotal,O=s.discount,p=s.subtotalDiscount,m=s.taxAmount,f=(null===c||void 0===c?void 0:c.taxed_at)||(null===c||void 0===c?void 0:c.completed_at)||(null===c||void 0===c?void 0:c.created_at);return Object(h.jsxs)("div",{className:"invoice",children:[Object(h.jsx)(b,{order:c}),Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{className:"text-center my-3",children:Object(h.jsx)("strong",{children:"\u0641\u0627\u062a\u0648\u0631\u0629 \u0628\u064a\u0639 \u0646\u0642\u062f\u064a - Cash Invoice"})}),Object(h.jsxs)(a.a,{children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u062a\u0627\u0631\u064a\u062e :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:j()(f).format("DD/MM/Y")})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c?void 0:c.tax_number})})]})})})]}),Object(h.jsxs)(a.a,{className:"mt-1",children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0633\u064a\u062f / \u0627\u0644\u0633\u064a\u062f\u0629 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(t=c.customer)||void 0===t?void 0:t.name})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0647\u0627\u062a\u0641 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(n=c.customer)||void 0===n?void 0:n.phone})})]})})})]}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(r=c.shipping)||void 0===r?void 0:r.address})})]})})})}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsxs)("table",{className:"table1",children:[Object(h.jsx)("thead",{children:Object(h.jsxs)("tr",{children:[Object(h.jsx)("th",{children:"\u0627\u0644\u0631\u0642\u0645"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0628\u064a\u0627\u0646"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0643\u0645\u064a\u0629"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0633\u0639\u0631"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0645\u0648\u0642\u0639"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a"})]})}),Object(h.jsxs)("tbody",{children:[[].concat(Object(i.a)((null===c||void 0===c?void 0:c.products)||[]),Object(i.a)((null===c||void 0===c?void 0:c.extra_items)||[])).map((function(e,t){return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:t+1}),Object(h.jsx)("td",{children:e.name}),Object(h.jsx)("td",{children:e.quantity}),Object(h.jsx)("td",{children:Number.parseFloat(e.price).toFixed(2)}),Object(h.jsx)("td",{children:e.location}),Object(h.jsx)("td",{children:(e.quantity*e.price).toFixed(2)})]})})),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{rowSpan:"4",colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u062a\u064a \u062a\u0628\u0627\u0639 \u0644\u0627 \u062a\u0631\u062f \u0648\u0644\u0627 \u062a\u0633\u062a\u0628\u062f\u0644"})}),Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 - Sub Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:u})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u062e\u0635\u0645 - Discount"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:O})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0628\u0639\u062f \u0627\u0644\u062e\u0635\u0645 - Sub Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:p})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{rowSpan:"1",colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0636\u0631\u064a\u0628\u0629 (16%) - Tax"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:m})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:new d.a(o,"JOD").parse()})}),Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064a - Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:o})})]})]})]})})}),Object(h.jsx)(x,{order:c})]})]})};function O(e){e.order;return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(a.a,{children:[Object(h.jsxs)(l.a,{children:[Object(h.jsx)("p",{children:"\u0639\u0645\u0627\u0646 - \u0634\u0627\u0631\u0639 \u0627\u0644\u0645\u0644\u0643\u0629 \u0631\u0627\u0646\u064a\u0627 - \u0637\u0644\u0648\u0639 \u0646\u064a\u0641\u064a\u0646 - \u0645\u062c\u0645\u0639 \u062e\u0644\u064a\u0641\u0629"}),Object(h.jsx)("p",{children:"\u0627\u0644\u0637\u0627\u0628\u0642 \u0627\u0644\u062b\u0627\u0644\u062b - \u0645\u0643\u062a\u0628 308"}),Object(h.jsx)("p",{children:"\u0647\u0627\u062a\u0641 : 065344772"}),Object(h.jsx)("p",{children:"\u0641\u0627\u0643\u0633 : 065344778"}),Object(h.jsx)("p",{children:"\u0628\u0631\u064a\u062f \u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: info@mikroelectron.com"}),Object(h.jsx)("p",{children:"\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: www.mikroelectron.com"})]}),Object(h.jsx)(l.a,{children:Object(h.jsxs)("div",{className:"float-left",children:[Object(h.jsx)("img",{src:"http://mikroelectron.com/assets/img/logo-1.png",width:"325px",height:"auto",alt:"Logo MikroElectron"}),Object(h.jsx)("p",{className:"pb-1",children:"\u0645\u0624\u0633\u0633\u0629 \u0645\u0646\u062a\u0635\u0631 \u0648\u0645\u062d\u0645\u0648\u062f \u0644\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a"}),Object(h.jsx)("p",{children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0636\u0631\u064a\u0628\u064a : 013461320"})})]})})]}),Object(h.jsx)("hr",{})]})}function p(e){var t=e.order;return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)("br",{}),Object(h.jsxs)(a.a,{className:"mt-2",children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0644\u0645 :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1"})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0626\u0639 :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:"Muntasir"})]})})})]}),Object(h.jsx)(a.a,{className:"mt-2",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u0645\u0644\u0627\u062d\u0638\u0627\u062a :"}),Object(h.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:null===t||void 0===t?void 0:t.invoice_notes})]})})})}),Object(h.jsx)("p",{className:"text-left",children:null===t||void 0===t?void 0:t.number})]})}var m=function(e){var t,n,r,c=e.order,s=e.meta,o=s.total,b=s.subtotal,x=s.discount,u=s.subtotalDiscount,m=s.taxAmount,f=(null===c||void 0===c?void 0:c.taxed_at)||(null===c||void 0===c?void 0:c.completed_at)||(null===c||void 0===c?void 0:c.created_at);return Object(h.jsxs)("div",{className:"invoice",children:[Object(h.jsx)(O,{order:c}),Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{className:"text-center my-3",children:Object(h.jsx)("strong",{children:"\u0641\u0627\u062a\u0648\u0631\u0629 \u0628\u064a\u0639 \u0630\u0645\u0645 - Receivable Invoice"})}),Object(h.jsxs)(a.a,{children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u062a\u0627\u0631\u064a\u062e :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:j()(f).format("DD/MM/Y")})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c?void 0:c.tax_number})})]})})})]}),Object(h.jsxs)(a.a,{className:"mt-1",children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0633\u064a\u062f / \u0627\u0644\u0633\u064a\u062f\u0629 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(t=c.customer)||void 0===t?void 0:t.name})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0647\u0627\u062a\u0641 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(n=c.customer)||void 0===n?void 0:n.phone})})]})})})]}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(r=c.shipping)||void 0===r?void 0:r.address})})]})})})}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsxs)("table",{className:"table1",children:[Object(h.jsx)("thead",{children:Object(h.jsxs)("tr",{children:[Object(h.jsx)("th",{children:"\u0627\u0644\u0631\u0642\u0645"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0628\u064a\u0627\u0646"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0643\u0645\u064a\u0629"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0633\u0639\u0631"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0645\u0648\u0642\u0639"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a"})]})}),Object(h.jsxs)("tbody",{children:[[].concat(Object(i.a)((null===c||void 0===c?void 0:c.products)||[]),Object(i.a)((null===c||void 0===c?void 0:c.extra_items)||[])).map((function(e,t){return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:t+1}),Object(h.jsx)("td",{children:e.name}),Object(h.jsx)("td",{children:e.quantity}),Object(h.jsx)("td",{children:Number.parseFloat(e.price).toFixed(2)}),Object(h.jsx)("td",{children:e.location}),Object(h.jsx)("td",{children:(e.quantity*e.price).toFixed(2)})]})})),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{rowSpan:"4",colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u062a\u064a \u062a\u0628\u0627\u0639 \u0644\u0627 \u062a\u0631\u062f \u0648\u0644\u0627 \u062a\u0633\u062a\u0628\u062f\u0644"})}),Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 - Sub Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:b})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u062e\u0635\u0645 - Discount"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:x})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0628\u0639\u062f \u0627\u0644\u062e\u0635\u0645 - Sub Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:u})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{rowSpan:"1",colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0636\u0631\u064a\u0628\u0629 (16%) - Tax"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:m})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:new d.a(o,"JOD").parse()})}),Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064a - Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:o})})]})]})]})})}),Object(h.jsx)(p,{order:c})]})]})},f=function(e){var t,n,r,c=e.order,s=e.meta,o=s.total,b=s.subtotal,x=(s.discount,s.subtotalDiscount,s.fixedDiscount),u=(null===c||void 0===c?void 0:c.taxed_at)||(null===c||void 0===c?void 0:c.completed_at)||(null===c||void 0===c?void 0:c.created_at);return Object(h.jsx)("div",{className:"invoice",children:Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{className:"text-center my-3",children:Object(h.jsx)("strong",{children:"\u0639\u0631\u0636 \u0633\u0639\u0631 - Price Offer"})}),Object(h.jsxs)(a.a,{children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u062a\u0627\u0631\u064a\u062e :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:j()(u).format("DD/MM/Y")})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0631\u0642\u0645 \u0627\u0644\u0639\u0631\u0636 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c?void 0:c.number})})]})})})]}),Object(h.jsxs)(a.a,{className:"mt-1",children:[Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0633\u064a\u062f / \u0627\u0644\u0633\u064a\u062f\u0629 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(t=c.customer)||void 0===t?void 0:t.name})})]})})}),Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0647\u0627\u062a\u0641 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(n=c.customer)||void 0===n?void 0:n.phone})})]})})})]}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("span",{className:"font-20",children:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646 :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c||null===(r=c.shipping)||void 0===r?void 0:r.address})})]})})})}),Object(h.jsx)(a.a,{className:"my-1",children:Object(h.jsx)(l.a,{children:Object(h.jsxs)("table",{className:"table1",children:[Object(h.jsx)("thead",{children:Object(h.jsxs)("tr",{children:[Object(h.jsx)("th",{children:"\u0627\u0644\u0631\u0642\u0645"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0628\u064a\u0627\u0646"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0643\u0645\u064a\u0629"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0633\u0639\u0631"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0645\u0648\u0642\u0639"}),Object(h.jsx)("th",{children:"\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a"})]})}),Object(h.jsxs)("tbody",{children:[[].concat(Object(i.a)((null===c||void 0===c?void 0:c.products)||[]),Object(i.a)((null===c||void 0===c?void 0:c.extra_items)||[])).map((function(e,t){return Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{children:t+1}),Object(h.jsx)("td",{children:e.name}),Object(h.jsx)("td",{children:e.quantity}),Object(h.jsx)("td",{children:Number.parseFloat(e.price).toFixed(2)}),Object(h.jsx)("td",{children:e.location}),Object(h.jsx)("td",{children:(e.quantity*e.price).toFixed(2)})]})})),Object(h.jsx)("tr",{children:Object(h.jsx)("td",{rowSpan:"3",colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u062a\u064a \u062a\u0628\u0627\u0639 \u0644\u0627 \u062a\u0631\u062f \u0648\u0644\u0627 \u062a\u0633\u062a\u0628\u062f\u0644"})})}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 - Sub Total"})}),Object(h.jsx)("td",{colSpan:3,children:Object(h.jsx)("strong",{children:b})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u062e\u0635\u0645 - Discount"})}),Object(h.jsx)("td",{colSpan:3,children:Object(h.jsx)("strong",{children:x})})]}),Object(h.jsxs)("tr",{children:[Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:new d.a(o,"JOD").parse()})}),Object(h.jsx)("td",{colSpan:2,children:Object(h.jsx)("strong",{children:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064a - Total"})}),Object(h.jsx)("td",{children:Object(h.jsx)("strong",{children:o})})]})]})]})})}),Object(h.jsx)(a.a,{className:"mt-3",children:Object(h.jsx)(l.a,{children:Object(h.jsx)("h4",{children:Object(h.jsxs)("div",{className:"d-flex mb-2",children:[Object(h.jsx)("strong",{className:"font-20",children:"\u0645\u0644\u0627\u062d\u0638\u0627\u062a :"}),Object(h.jsx)("span",{className:"underline-dotted flex-grow-1 pr-1",children:Object(h.jsx)("strong",{children:null===c||void 0===c?void 0:c.invoice_notes})})]})})})})]})})},v=n(152);t.default=function(){var e=Object(c.i)().id,t=Object(s.c)(e).data;return Object(r.useEffect)((function(){t&&setTimeout((function(){window.print()}),200)}),[t]),console.log(null===t||void 0===t?void 0:t.options.dept),t?(null===t||void 0===t?void 0:t.options.dept)?(console.log("test"),Object(h.jsx)(m,{order:t,meta:Object(v.a)(t)})):(null===t||void 0===t?void 0:t.options.taxed)?Object(h.jsx)(u,{order:t,meta:Object(v.a)(t)}):Object(h.jsx)(f,{order:t,meta:Object(v.a)(t)}):Object(h.jsx)(h.Fragment,{})}}}]);
//# sourceMappingURL=125.02430755.chunk.js.map