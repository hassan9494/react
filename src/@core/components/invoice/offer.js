import { Row, Col } from 'reactstrap'
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'
import logo from "../../assets/images/logo.png"
import React from "react"

const Print = ({ order, meta: { total, subtotal, discount, subtotalDiscount, fixedDiscount } }) => {
    const date = order?.taxed_at || order?.completed_at || order?.created_at
    
    const fixProductName = (name) => {
  return name && /^\d/.test(name) ? `\u200E${  name}` : name
}

    return (
        <div className="invoice">
            <div>
                <h3 className='text-center mt-1 mb-2 invoice-title'>
                    <strong>عرض سعر - Price Offer</strong>
                </h3>
                        <Row>
                             <Col>
                                 <h4>
                                     <div className='d-flex m-0'>
                                         <span className='field-label '>التاريخ </span>
                                         <span className="underline-dotted flex-grow-1 dotdate"><strong className='ml-1'>:</strong><strong>{ moment(date).format('DD/MM/Y') }</strong></span>
                                     </div>
                                 </h4>
                             </Col>
                             <Col>
                                 <h4>
                                     <div className='d-flex m-0'>
                                         <span className='font-20'>رقم العرض </span>
                                         <span className="underline-dotted flex-grow-1 dotinvoice"><strong className='ml-1'>:</strong><strong>{order?.number}</strong></span>
                                     </div>
                                 </h4>
                             </Col>
                         </Row>
                         <Row className='mt-0'>
                             <Col>
                                 <h4>
                                     <div className='d-flex m-0'>
                                         <span className='font-20'>السيد / السيدة </span>
                                         <span className="underline-dotted flex-grow-1 dotinvoice"><strong className='ml-1'>:</strong><strong>{order?.customer?.name}</strong></span>
                                     </div>
                                 </h4>
                             </Col>
                             <Col>
                                 <h4>
                                     <div className='d-flex m-0'>
                                         <span className='font-20'>الهاتف </span>
                                         <span className="underline-dotted flex-grow-1 dotphone"><strong className='ml-1'>:</strong><strong>{order?.customer?.phone}</strong></span>
                                     </div>
                                 </h4>
                             </Col>
                         </Row>
                         <Row className='my-0'>
                             <Col>
                                 <h4>
                                     <div className='d-flex m-0'>
                                         <span className='font-20'>العنوان </span>
                                         <span className="underline-dotted flex-grow-1 dotaddress"><strong className='ml-1'>:</strong><strong>{order?.shipping?.address}</strong></span>
                                     </div>
                                 </h4>
                             </Col>
                         </Row>
         
                <Row className='my-1'>
                    <Col>
                         <table className="table1" style={{ width: '100%', tableLayout: 'auto' }}>
                            <colgroup>
                                <col style={{ width: '1%' }} />    {/* الرقم */}
                                <col />                             {/* البيان - takes remaining */}
                                <col style={{ width: '1%' }} />    {/* الكمية */}
                                <col style={{ width: '1%' }} />    {/* السعر */}
                                <col style={{ width: '1%' }} />    {/* الاجمالي */}
                            </colgroup>
                            <thead>
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>الرقم</th>
                                <th>البيان</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الكمية</th>
                                <th style={{ whiteSpace: 'nowrap' }}>السعر</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الاجمالي</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [...order?.products || [], ...order?.extra_items || []]
                                    .sort((a, b) => a.number - b.number) // Sort by id, ascending
                                    .map((e, i) => (
                                        <tr key={i}>
                                        <td style={{ whiteSpace: 'nowrap' }}>{i + 1}</td>
                                        <td>{fixProductName(e.name)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{e.quantity}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{Number.parseFloat(e.price).toFixed(2)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{(e.quantity * e.price).toFixed(2)}</td>
                                    </tr>
                                    ))
                            }

        <tr>
  <td colSpan={5} style={{ padding: 0 }}>
    <table className="table mb-0 w-100 totals-table">
      <colgroup>
        <col style={{ width: 'auto' }} /> {/* Note column - takes remaining space */}
        <col style={{ width: '1%' }} />   {/* Labels column - minimal width */}
        <col style={{ width: '1%' }} />   {/* Amounts column - minimal width */}
      </colgroup>
      <tbody>
        <tr>
          <td rowSpan="2" >
            <div className='d-block'>البضاعة التي تباع لا ترد ولا تستبدل</div>
            <div>تم استلام البضاعة وذلك بحالة جيدة ومطابقة للمواصفات المطلوبة</div>
          </td>
          <td className="text-nowrap">
            <div className='d-block' style={{ whiteSpace: 'nowrap' }}>المجموع - Sub total</div>
          </td>
          <td className="text-nowrap text-left">
            <div>{Number.parseFloat(subtotal).toFixed(3)}</div>
          </td>
        </tr>
                       
        <tr>
          <td className="text-nowrap">
            <div className='d-block' style={{ whiteSpace: 'nowrap' }}>الخصم - Discount</div>
          </td>
          <td className="text-nowrap text-left">
            <div>{Number.parseFloat(fixedDiscount).toFixed(3)}</div>
          </td>
        </tr>
                               <tr>
                                 <td>
                                   <strong>{new toArabic(total, 'JOD').parse()}</strong>
                                 </td>
                                 <td className="text-nowrap">
                                   <strong>المجموع الكلي - Total</strong>
                                 </td>
                                 <td className="text-nowrap text-left">
                                   <strong>{Number.parseFloat(total).toFixed(3)}</strong>
                                    </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

                            </tbody>
                        </table>
                    </Col>
                </Row>
              {order?.invoice_notes && (
                       <Row className='mt-0'>
                           <Col>
                               <h4 className="invoice-field">
                                   <div className='d-flex mb-0'>
                                       <h4 className='field-label dotnotes'>ملاحظات </h4>
                                       <h4>:</h4>
                                       <span className="flex-grow-1 ml-1">
                                           <strong >
                                               {order?.invoice_notes?.split('\n').map((line, index) => (
                                                   <div className="underline-dotted pr-1" style={{display: "block"}} key={index}>
                                                       {line}
                                                   </div>
                                               ))}
                                           </strong>
                                       </span>
                                   </div>
                               </h4>
                           </Col>
                       </Row>)}
            </div>
        </div>
    )
}

export default Print
