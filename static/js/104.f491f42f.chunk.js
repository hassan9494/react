(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[104],{109:function(t,r,e){"use strict";var n=e(4),a=e(5),o=e(0),c=e.n(o),i=e(1),s=e.n(i),u=e(11),l=e.n(u),d=e(12),f=s.a.oneOfType([s.a.number,s.a.string]),h=s.a.oneOfType([s.a.bool,s.a.number,s.a.string,s.a.shape({size:s.a.oneOfType([s.a.bool,s.a.number,s.a.string]),order:f,offset:f})]),p={tag:d.q,xs:h,sm:h,md:h,lg:h,xl:h,className:s.a.string,cssModule:s.a.object,widths:s.a.array},v={tag:"div",widths:["xs","sm","md","lg","xl"]},m=function(t,r,e){return!0===e||""===e?t?"col":"col-"+r:"auto"===e?t?"col-auto":"col-"+r+"-auto":t?"col-"+e:"col-"+r+"-"+e},j=function(t){var r=t.className,e=t.cssModule,o=t.widths,i=t.tag,s=Object(a.a)(t,["className","cssModule","widths","tag"]),u=[];o.forEach((function(r,n){var a=t[r];if(delete s[r],a||""===a){var o=!n;if(Object(d.k)(a)){var c,i=o?"-":"-"+r+"-",f=m(o,r,a.size);u.push(Object(d.m)(l()(((c={})[f]=a.size||""===a.size,c["order"+i+a.order]=a.order||0===a.order,c["offset"+i+a.offset]=a.offset||0===a.offset,c)),e))}else{var h=m(o,r,a);u.push(h)}}})),u.length||u.push("col");var f=Object(d.m)(l()(r,u),e);return c.a.createElement(i,Object(n.a)({},s,{className:f}))};j.propTypes=p,j.defaultProps=v,r.a=j},110:function(t,r,e){"use strict";var n=e(4),a=e(5),o=e(0),c=e.n(o),i=e(1),s=e.n(i),u=e(11),l=e.n(u),d=e(12),f=s.a.oneOfType([s.a.number,s.a.string]),h={tag:d.q,noGutters:s.a.bool,className:s.a.string,cssModule:s.a.object,form:s.a.bool,xs:f,sm:f,md:f,lg:f,xl:f},p={tag:"div",widths:["xs","sm","md","lg","xl"]},v=function(t){var r=t.className,e=t.cssModule,o=t.noGutters,i=t.tag,s=t.form,u=t.widths,f=Object(a.a)(t,["className","cssModule","noGutters","tag","form","widths"]),h=[];u.forEach((function(r,e){var n=t[r];if(delete f[r],n){var a=!e;h.push(a?"row-cols-"+n:"row-cols-"+r+"-"+n)}}));var p=Object(d.m)(l()(r,o?"no-gutters":null,s?"form-row":"row",h),e);return c.a.createElement(i,Object(n.a)({},f,{className:p}))};v.propTypes=h,v.defaultProps=p,r.a=v},112:function(t,r,e){"use strict";e.d(r,"a",(function(){return l})),e.d(r,"e",(function(){return d})),e.d(r,"p",(function(){return f})),e.d(r,"d",(function(){return h})),e.d(r,"f",(function(){return p})),e.d(r,"b",(function(){return v})),e.d(r,"c",(function(){return m})),e.d(r,"g",(function(){return j})),e.d(r,"m",(function(){return b})),e.d(r,"l",(function(){return g})),e.d(r,"o",(function(){return x})),e.d(r,"h",(function(){return O})),e.d(r,"n",(function(){return y})),e.d(r,"k",(function(){return _})),e.d(r,"j",(function(){return w})),e.d(r,"i",(function(){return N}));var n=e(57),a=e.n(n),o=e(58),c=e(63),i=e(64),s=e(65),u=function(t){return i.a.get(t).then((function(t){var r;return null===(r=t.data)||void 0===r?void 0:r.data}))},l={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/order?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},d={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/product-orders?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},f={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/zemam?".concat(r));case 2:return e=t.sent,n=e.data,console.log(null===n||void 0===n?void 0:n.data),t.abrupt("return",null===n||void 0===n?void 0:n.data);case 6:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},h=(function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/product-need?".concat(r));case 2:return e=t.sent,n=e.data,console.log(null===n||void 0===n?void 0:n.data),t.abrupt("return",null===n||void 0===n?void 0:n.data);case 6:case"end":return t.stop()}}),t)})))}(),{order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/outlays?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()}),p={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/purchases?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},v={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/customs-statement?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},m={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/depts?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()},j={order:function(){var t=Object(o.a)(a.a.mark((function t(r){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.get("report/product-stock?".concat(r));case 2:return e=t.sent,n=e.data,t.abrupt("return",null===n||void 0===n?void 0:n.data);case 5:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()};function b(t){return Object(c.b)("report","report/product-sales",t)}function g(t){return Object(c.b)("report","report/product-sale",t)}function x(t){return Object(c.b)("report","report/product-stock",t)}function O(t){return Object(c.b)("report","report/product-need",t)}function y(t){return Object(c.b)("report","product/sales",t)}function _(t){var r="report/outlays?".concat(t),e=Object(s.a)(r,u,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),n=e.data,a=e.error;return{loading:!(null===n||void 0===n?void 0:n.data)&&!a,error:a,data:n}}function w(t){var r=t.params,e="report/order".concat(r),n=Object(s.a)(e,u,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),a=n.data,o=n.error;return{loading:!(null===a||void 0===a?void 0:a.data)&&!o,error:o,data:a}}function N(t){var r=t.params,e="report/product-stock".concat(r),n=Object(s.a)(e,u,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),a=n.data,o=n.error;return{loading:!(null===a||void 0===a?void 0:a.data)&&!o,error:o,data:a}}},113:function(t,r){},124:function(t,r,e){"use strict";e.d(r,"a",(function(){return i}));var n=e(130),a=e(131),o=e(67),c=e.n(o);function i(t,r){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];e&&(r="".concat(r,"-").concat(c()().format("Y-MM-DD")));var o="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",i=".xlsx",s=a.utils.json_to_sheet(t),u={Sheets:{data:s},SheetNames:["data"]},l=a.write(u,{bookType:"xlsx",type:"array"}),d=new Blob([l],{type:o});n.saveAs(d,r+i)}},132:function(t,r){},133:function(t,r){},156:function(t,r,e){},515:function(t,r,e){"use strict";e.d(r,"a",(function(){return c})),e.d(r,"b",(function(){return i}));var n=e(124),a=e(67),o=e.n(a),c=function(t){var r=t.name,e=t.sub_type,n=t.date,a=Number.parseFloat(t.amount||0),o=Number.parseFloat(t.total_amount||0),c=t.invoice,i=t.tax,s=t.notes;return{outlay:r,outlay_sub_type:e,outlay_date:n,outlay_amount:a.toFixed(2),outlay_total_amount:o.toFixed(2),outlay_invoice:c,outlay_tax:i,outlay_notes:s}},i=function(t,r){Object(n.a)(t.map((function(t){var r=c(t);r.name,r.sub_type,r.date,r.amount,r.total_amount,r.invoice,r.tax,r.notes;return{Name:t.name,OutlayType:t.sub_type,Date:o()(t.date).format("DD/MM/Y"),Amount:t.amount,Total:t.total_amount,Invoice:t.invoice,Tax:t.tax,Notes:t.notes}})),r||"outlays-report")}},63:function(t,r,e){"use strict";e.d(r,"a",(function(){return u})),e.d(r,"c",(function(){return l})),e.d(r,"d",(function(){return d})),e.d(r,"b",(function(){return f})),e.d(r,"e",(function(){return h}));var n=e(57),a=e.n(n),o=e(58),c=e(65),i=e(64),s=function(t){return i.a.get(t).then((function(t){var r;return null===(r=t.data)||void 0===r?void 0:r.data}))},u={create:function(){var t=Object(o.a)(a.a.mark((function t(r,e){var n,o;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.post(r,e);case 2:return n=t.sent,o=n.data,t.abrupt("return",null===o||void 0===o?void 0:o.data);case 5:case"end":return t.stop()}}),t)})));return function(r,e){return t.apply(this,arguments)}}(),update:function(){var t=Object(o.a)(a.a.mark((function t(r,e,n){var o,c;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.put("".concat(r,"/").concat(e),n);case 2:return o=t.sent,c=o.data,t.abrupt("return",null===c||void 0===c?void 0:c.data);case 5:case"end":return t.stop()}}),t)})));return function(r,e,n){return t.apply(this,arguments)}}(),delete:function(){var t=Object(o.a)(a.a.mark((function t(r,e){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.delete("".concat(r,"/").concat(e));case 2:case"end":return t.stop()}}),t)})));return function(r,e){return t.apply(this,arguments)}}()};function l(t,r){var e=Object(c.a)("".concat(t,"/").concat(r),s),n=e.data,i=e.mutate,l=e.error;return{loading:!n&&!l,error:l,data:n,mutate:i,update:function(){var e=Object(o.a)(a.a.mark((function e(n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.update(t,r,n);case 2:return e.next=4,i();case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}function d(t){var r=Object(c.a)(t,s,{revalidateOnFocus:!1,revalidateOnReconnect:!1,refreshWhenOffline:!1,refreshWhenHidden:!1,refreshInterval:0}),e=r.data,n=r.mutate,i=r.error;return{loading:!e&&!i,error:i,data:e||[],mutate:n,create:function(){var t=Object(o.a)(a.a.mark((function t(r){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",u.create(r));case 1:case"end":return t.stop()}}),t)})));return function(r){return t.apply(this,arguments)}}()}}function f(t,r,e){var n=e.page,i=e.limit,l=e.search,d=e.order,f=void 0===d?{}:d,h=e.conditions,p=void 0===h?{}:h,v="".concat(r,"?page=").concat(n,"&limit=").concat(i,"&search=").concat(l,"&order=").concat(JSON.stringify(f),"&conditions=").concat(JSON.stringify(p)),m=Object(c.a)(v,s),j=m.data,b=m.mutate,g=m.error;return{loading:!j&&!g,error:g,data:(null===j||void 0===j?void 0:j.items)||[],total:(null===j||void 0===j?void 0:j.total)||0,mutate:b,mutates:{delete:function(){var r=Object(o.a)(a.a.mark((function r(e){return a.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,u.delete(t,e);case 2:return r.next=4,b(v);case 4:case"end":return r.stop()}}),r)})));return function(t){return r.apply(this,arguments)}}()}}}function h(t,r){var e=r.conditions,n="".concat(t,"?conditions=").concat(JSON.stringify(e)),a=Object(c.a)(n,s),o=a.data,i=a.mutate,u=a.error;return{loading:!o&&!u,error:u,data:(null===o||void 0===o?void 0:o.items)||[],total:(null===o||void 0===o?void 0:o.total)||0,mutate:i}}},824:function(t,r,e){"use strict";e.r(r);var n=e(151),a=e(112),o=e(110),c=e(109);e(156);function s(t){var r,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"SDG",n=t.toString().split(".");if(this.fraction=0,n.length>1)if(n[1].length>1)if((r=parseInt(n[1]))>=1&&r<=99)this.fraction=1===n[1].length?10*r:r;else{var a=Array.from(n[1]);this.fraction="";for(var o=0;o<this.currencies[e].decimals;o++)this.fraction+=a[o]}else this.fraction=parseInt(n[1]);this.digit=n[0],this.currency=e}s.prototype.parse=function(){var t=[],r=[],e=1,n=this.length(),a=this.getColumnIndex();if(!(n>=16)){Array.from(this.digit.toString()).reverse().forEach((function(a,o){r.push(a),3==e&&(t.unshift(r),r=[],e=0),0==e&&n-(o+1)<3&&n-(o+1)!=0&&t.unshift(r),e++}));for(var o=[],c=this.getColumnIndex();c<this.columns.length;c++)o[c]=" \u0648";if(this.digit>999&&0==parseInt(Array.from(t[t.length-1]).join("")))for(o[parseInt(o.length-1)]="",i=t.length-1;i>=1&&0==parseInt(Array.from(t[i]).join(""));i--)o[i]="";var s="";if(s+="\u0641\u0642\u0637 ",this.length()>=1&&this.length()<=3)s+=this.read(this.digit);else for(i=0;i<t.length;i++){var u=parseInt(t[i].reverse().join(""));0!=u?(null==a||a+1>this.columns.length?s+=this.read(u):s+=this.addSuffixPrefix(t[i],a)+o[a],a++):a++}return""!=this.currency&&(this.digit>=3&&this.digit<=10?s+=" "+this.currencies[this.currency].plural:s+=" "+this.currencies[this.currency].singular,0!=this.fraction&&(this.digit>=3&&this.digit<=10?s+=" \u0648"+this.read(this.fraction)+" "+this.currencies[this.currency].fractions:s+=" \u0648"+this.read(this.fraction)+" "+this.currencies[this.currency].fraction)),s+=" \u0644\u0627 \u063a\u064a\u0631"}console.error("Number out of range!")},s.prototype.addSuffixPrefix=function(t,r){if(1!=t.length){var e=parseInt(t.join(""));return e>1?this.read(e)+" "+this[this.columns[r]].singular:this[this.columns[r]].singular}return 1==parseInt(t[0])?this[this.columns[r]].singular:2==parseInt(t[0])?this[this.columns[r]].binary:parseInt(t[0])>2&&parseInt(t[0])<=9?this.readOnes(parseInt(t[0]))+" "+this[this.columns[r]].plural:void 0},s.prototype.read=function(t){var r="",e=Array.from(t.toString()).length;return 1==e?r+=this.readOnes(t):2==e?r+=this.readTens(t):3==e&&(r+=this.readHundreds(t)),r},s.prototype.readOnes=function(t){if(0!=t)return this.ones["_"+t.toString()]},s.prototype.readTens=function(t){return"0"===Array.from(t.toString())[1]?this.tens["_"+t.toString()]:t>10&&t<20?this.teens["_"+t.toString()]:t>19&&t<100&&"0"!==Array.from(t.toString())[1]?this.readOnes(Array.from(t.toString())[1])+" \u0648"+this.tens["_"+Array.from(t.toString())[0]+"0"]:void 0},s.prototype.readHundreds=function(t){var r="";return r+=this.hundreds["_"+Array.from(t.toString())[0]+"00"],"0"===Array.from(t.toString())[1]&&"0"!==Array.from(t.toString())[2]&&(r+=" \u0648"+this.readOnes(Array.from(t.toString())[2])),"0"!==Array.from(t.toString())[1]&&(r+=" \u0648"+this.readTens((Array.from(t.toString())[1]+Array.from(t.toString())[2]).toString())),r},s.prototype.length=function(){return Array.from(this.digit.toString()).length},s.prototype.getColumnIndex=function(){var t=null;return this.length()>12?t=0:this.length()<=12&&this.length()>9?t=1:this.length()<=9&&this.length()>6?t=2:this.length()<=6&&this.length()>=4&&(t=3),t},s.prototype.ones={_1:"\u0648\u0627\u062d\u062f",_2:"\u0671\u062b\u0646\u064a\u0646",_3:"\u062b\u0644\u0627\u062b\u0629",_4:"\u0623\u0631\u0628\u0639\u0629",_5:"\u062e\u0645\u0633\u0629",_6:"\u0633\u062a\u0629",_7:"\u0633\u0628\u0639\u0629",_8:"\u062b\u0645\u0627\u0646\u064a\u0629",_9:"\u062a\u0633\u0639\u0629"},s.prototype.teens={_11:"\u0623\u062d\u062f \u0639\u0634\u0631",_12:"\u0623\u062b\u0646\u064a \u0639\u0634\u0631",_13:"\u062b\u0644\u0627\u062b\u0629 \u0639\u0634\u0631",_14:"\u0623\u0631\u0628\u0639\u0629 \u0639\u0634\u0631",_15:"\u062e\u0645\u0633\u0629 \u0639\u0634\u0631",_16:"\u0633\u062a\u0629 \u0639\u0634\u0631",_17:"\u0633\u0628\u0639\u0629 \u0639\u0634\u0631",_18:"\u062b\u0645\u0627\u0646\u064a\u0629 \u0639\u0634\u0631",_19:"\u062a\u0633\u0639\u0629 \u0639\u0634\u0631"},s.prototype.tens={_10:"\u0639\u0634\u0631\u0629",_20:"\u0639\u0634\u0631\u0648\u0646",_30:"\u062b\u0644\u0627\u062b\u0648\u0646",_40:"\u0623\u0631\u0628\u0639\u0648\u0646",_50:"\u062e\u0645\u0633\u0648\u0646",_60:"\u0633\u062a\u0648\u0646",_70:"\u0633\u0628\u0639\u0648\u0646",_80:"\u062b\u0645\u0627\u0646\u0648\u0646",_90:"\u062a\u0633\u0639\u0648\u0646"},s.prototype.hundreds={_100:"\u0645\u0627\u0626\u0629",_200:"\u0645\u0627\u0626\u062a\u064a\u0646",_300:"\u062b\u0644\u0627\u062b\u0645\u0627\u0626\u0629",_400:"\u0623\u0631\u0628\u0639\u0645\u0627\u0626\u0629",_500:"\u062e\u0645\u0633\u0645\u0627\u0626\u0629",_600:"\u0633\u062a\u0645\u0627\u0626\u0629",_700:"\u0633\u0628\u0639\u0645\u0627\u0626\u0629",_800:"\u062b\u0645\u0627\u0646\u0645\u0627\u0626\u0629",_900:"\u062a\u0633\u0639\u0645\u0627\u0626\u0629"},s.prototype.thousands={singular:"\u0623\u0644\u0641",binary:"\u0623\u0644\u0641\u064a\u0646",plural:"\u0623\u0644\u0622\u0641"},s.prototype.milions={singular:"\u0645\u0644\u064a\u0648\u0646",binary:"\u0645\u0644\u064a\u0648\u0646\u064a\u0646",plural:"\u0645\u0644\u0627\u064a\u064a\u0646"},s.prototype.bilions={singular:"\u0645\u0644\u064a\u0627\u0631",binary:"\u0645\u0644\u064a\u0627\u0631\u064a\u0646",plural:"\u0645\u0644\u064a\u0627\u0631\u0627\u062a"},s.prototype.trilions={singular:"\u062a\u0631\u0644\u064a\u0648\u0646",binary:"\u062a\u0631\u0644\u064a\u0648\u0646\u064a\u0646",plural:"\u062a\u0631\u0644\u064a\u0648\u0646\u0627\u062a"},s.prototype.columns=["trilions","bilions","milions","thousands"],s.prototype.currencies={SDG:{singular:"\u062c\u0646\u064a\u0647 \u0633\u0648\u062f\u0627\u0646\u064a",plural:"\u062c\u0646\u064a\u0647\u0627\u062a \u0633\u0648\u062f\u0627\u0646\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},JOD:{singular:"\u062f\u064a\u0646\u0627\u0631\u064b\u0627 \u0623\u0631\u062f\u0646\u064a\u064b\u0627",plural:"\u062f\u064a\u0646\u0627\u0631\u0627\u062a \u0623\u0631\u062f\u0646\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},SAR:{singular:"\u0631\u064a\u0627\u0644 \u0633\u0639\u0648\u062f\u064a",plural:"\u0631\u064a\u0627\u0644\u0627\u062a \u0633\u0639\u0648\u062f\u064a\u0629",fraction:"\u0647\u0644\u0644\u0629",fractions:"\u0647\u0644\u0644\u0627\u062a",decimals:2},QAR:{singular:"\u0631\u064a\u0627\u0644 \u0642\u0637\u0631\u064a",plural:"\u0631\u064a\u0627\u0644\u0627\u062a \u0642\u0637\u0631\u064a\u0629",fraction:"\u062f\u0631\u0647\u0645",fractions:"\u062f\u0631\u0627\u0647\u0645",decimals:2},AED:{singular:"\u062f\u0631\u0647\u0645 \u0623\u0645\u0627\u0631\u0627\u062a\u064a",plural:"\u062f\u0631\u0627\u0647\u0645 \u0623\u0645\u0627\u0631\u0627\u062a\u064a\u0629",fraction:"\u0641\u0644\u0633",fractions:"\u0641\u0644\u0648\u0633",decimals:2},EGP:{singular:"\u062c\u0646\u064a\u0647 \u0645\u0635\u0631\u064a",plural:"\u062c\u0646\u064a\u0647\u0627\u062a \u0645\u0635\u0631\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2},USD:{singular:"\u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a",plural:"\u062f\u0648\u0644\u0627\u0631\u0627\u062a \u0623\u0645\u0631\u064a\u0643\u064a\u0629",fraction:"\u0633\u0646\u062a",fractions:"\u0633\u0646\u062a\u0627\u062a",decimals:2},AUD:{singular:"\u062f\u0648\u0644\u0627\u0631 \u0623\u0633\u062a\u0631\u0627\u0644\u064a",plural:"\u062f\u0648\u0644\u0627\u0631\u0627\u062a \u0623\u0633\u062a\u0631\u0627\u0644\u064a\u0629",fraction:"\u0633\u0646\u062a",fractions:"\u0633\u0646\u062a\u0627\u062a",decimals:2},TND:{singular:"\u062f\u064a\u0646\u0627\u0631 \u062a\u0648\u0646\u0633\u064a",plural:"\u062f\u0646\u0627\u0646\u064a\u0631 \u062a\u0648\u0646\u0633\u064a\u0629",fraction:"\u0645\u0644\u064a\u0645",fractions:"\u0645\u0644\u064a\u0645\u0627\u062a",decimals:3},TRY:{singular:"\u0644\u064a\u0631\u0629 \u062a\u0631\u0643\u064a\u0629",plural:"\u0644\u064a\u0631\u0627\u062a \u062a\u0631\u0643\u064a\u0629",fraction:"\u0642\u0631\u0634",fractions:"\u0642\u0631\u0648\u0634",decimals:2}};e(67);var u=e(3);function l(t){var r=t.outlay;return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsxs)(o.a,{children:[Object(u.jsxs)(c.a,{children:[Object(u.jsx)("p",{children:"\u0639\u0645\u0627\u0646 - \u0634\u0627\u0631\u0639 \u0627\u0644\u0645\u0644\u0643\u0629 \u0631\u0627\u0646\u064a\u0627 - \u0637\u0644\u0648\u0639 \u0646\u064a\u0641\u064a\u0646 - \u0645\u062c\u0645\u0639 \u062e\u0644\u064a\u0641\u0629"}),Object(u.jsx)("p",{children:"\u0627\u0644\u0637\u0627\u0628\u0642 \u0627\u0644\u062b\u0627\u0644\u062b - \u0645\u0643\u062a\u0628 308"}),Object(u.jsx)("p",{children:"\u0647\u0627\u062a\u0641 : 065344772"}),Object(u.jsx)("p",{children:"\u0641\u0627\u0643\u0633 : 065344778"}),Object(u.jsx)("p",{children:"\u0628\u0631\u064a\u062f \u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: info@mikroelectron.com"}),Object(u.jsx)("p",{children:"\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a: www.mikroelectron.com"})]}),Object(u.jsx)(c.a,{children:Object(u.jsxs)("div",{className:"float-left",children:[Object(u.jsx)("img",{src:"http://mikroelectron.com/assets/img/logo-1.png",width:"325px",height:"auto",alt:"Logo MikroElectron"}),Object(u.jsx)("p",{className:"pb-1",children:"\u0645\u0624\u0633\u0633\u0629 \u0645\u0646\u062a\u0635\u0631 \u0648\u0645\u062d\u0645\u0648\u062f \u0644\u0644\u0627\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a"}),Object(u.jsx)("p",{children:Object(u.jsx)("strong",{children:"\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0636\u0631\u064a\u0628\u064a : 013461320"})}),Object(u.jsx)("p",{className:"text-center",children:null===r||void 0===r?void 0:r.outlay_invoice})]})})]}),Object(u.jsx)("hr",{})]})}function d(t){var r=t.outlay;return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("br",{}),Object(u.jsxs)(o.a,{className:"mt-2",children:[Object(u.jsx)(c.a,{children:Object(u.jsx)("h4",{children:Object(u.jsxs)("div",{className:"d-flex mb-2",children:[Object(u.jsx)("strong",{className:"font-20",children:"\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0644\u0645 :"}),Object(u.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1"})]})})}),Object(u.jsx)(c.a,{children:Object(u.jsx)("h4",{children:Object(u.jsxs)("div",{className:"d-flex mb-2",children:[Object(u.jsx)("strong",{className:"font-20",children:"\u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0626\u0639 :"}),Object(u.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:"Muntasir"})]})})})]}),Object(u.jsx)(o.a,{className:"mt-2",children:Object(u.jsx)(c.a,{children:Object(u.jsx)("h4",{children:Object(u.jsxs)("div",{className:"d-flex mb-2",children:[Object(u.jsx)("strong",{className:"font-20",children:"\u0645\u0644\u0627\u062d\u0638\u0627\u062a :"}),Object(u.jsx)("strong",{className:"underline-dotted flex-grow-1 pr-1",children:null===r||void 0===r?void 0:r.notes})]})})})})]})}var f=function(t){var r=t.outlay,e=t.meta;e.name,e.amount,e.date,e.invoice,e.sub_type,e.total_amount,e.tax,e.notes,r.date;return Object(u.jsxs)("div",{className:"invoice",children:[Object(u.jsx)(l,{outlay:r}),Object(u.jsxs)("div",{children:[Object(u.jsx)("h2",{className:"text-center my-3",children:Object(u.jsx)("strong",{children:"\u0627\u0644\u0645\u0635\u0627\u0631\u064a\u0641 - Outlays"})}),Object(u.jsx)(o.a,{className:"my-1",children:Object(u.jsx)(c.a,{children:Object(u.jsxs)("table",{className:"table1",children:[Object(u.jsx)("thead",{children:Object(u.jsxs)("tr",{children:[Object(u.jsx)("th",{children:"Name"}),Object(u.jsx)("th",{children:"OutlayType"}),Object(u.jsx)("th",{children:"Date"}),Object(u.jsx)("th",{children:"Amount"}),Object(u.jsx)("th",{children:"Total"}),Object(u.jsx)("th",{children:"Invoice"}),Object(u.jsx)("th",{children:"Tax"}),Object(u.jsx)("th",{children:"Notes"})]})}),Object(u.jsx)("tbody",{})]})})}),Object(u.jsx)(d,{outlay:r})]})]})},h=e(515);r.default=function(){var t=Object(n.h)().search,r=Object(a.k)({params:t}).data;return Object(u.jsx)(u.Fragment,{children:null===r||void 0===r?void 0:r.map((function(t){return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)(f,{outlay:t,meta:Object(h.a)(t)}),Object(u.jsx)("p",{style:{pageBreakBefore:"always"}})]})}))})}}}]);
//# sourceMappingURL=104.f491f42f.chunk.js.map