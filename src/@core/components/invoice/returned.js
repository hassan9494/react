// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'
import logo from "../../assets/images/logo.png"
import QRCode from 'qrcode'
import React, {useEffect, useState} from "react"
import { usePrintStyles } from './../../../utility/hooks/usePrintStyles'


const Print = ({ order, meta: { total, subtotal, discount, subtotalDiscount, taxAmount } }) => {
    const date = order?.migrated_at

        usePrintStyles(order?.number)

    const fixProductName = (name) => {
  return name && /^\d/.test(name) ? `\u200E${  name}` : name
}
    return (
        <div className="invoice">
            <InvoiceHeader order={order}/>
            <div>
                <h3 className='text-center mt-1 mb-2 invoice-title'>
                    <strong>فاتورة إرجاع - Returned Invoice</strong>
                </h3>
                <Row>
                     <Col>
                                           <h4>
                                               <div className='d-flex m-0'>
                                                   <span className='field-label '>التاريخ </span>
                                                   <span className="underline-dotted flex-grow-1 dotdate"><strong className='ml-1'>:</strong><strong>{ moment(order?.migrated_at).format('DD/MM/Y') }</strong></span>
                                               </div>
                                           </h4>
                                       </Col>
                   <Col>
                                         <h4>
                                             <div className='d-flex m-0'>
                                                 <span className='font-20'>رقم الفاتورة </span>
                                                 <span className="underline-dotted flex-grow-1 dotinvoice"><strong className='ml-1'>:</strong> <strong>{order?.number}</strong>
                                                 </span>
                                             </div>
                                         </h4>
                                     </Col>
                                     <Col>
                                         <h4>
                                             <div className='d-flex m-0'>
                                <span className='font-20'>رقم الفاتورة الاصلية </span>
                                                 <span className="underline-dotted flex-grow-1 dotinvoice"><strong className='ml-1'>:</strong><strong>{order?.oldOrder?.tax_number}</strong>
                                                 </span>
                                             </div>
                                         </h4>
                                     </Col>
                </Row>
                <Row className='mt-0'>
                    <Col md={8} sm={8}>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>السيد / السيدة</span>
                                  <span className="underline-dotted flex-grow-1 dotinvoice">
                                    <strong className='ml-1'>:</strong>
                                    <strong>{order?.oldOrder?.customer?.name}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>الهاتف </span>
                                                               <span className="underline-dotted flex-grow-1 dotphonereturn"><strong className='ml-1'>:</strong>
                                    <strong>{order?.oldOrder?.customer?.phone}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='my-0'>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>العنوان </span>
                                <span className="underline-dotted flex-grow-1 dotaddress"><strong className='ml-1'>:</strong>
                                    <strong>{order?.oldOrder?.shipping?.address}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col>
                        <table className="table1" style={{ width: '100%', tableLayout: 'auto' }}>
                            <colgroup>
                                <col style={{ width: '1%' }} />    {/* الرقم */}
                                <col />                             {/* البيان - takes remaining */}
                                <col style={{ width: '1%' }} />    {/*  الكمية المرجعة */}
                                <col style={{ width: '1%' }} />    {/* السعر */}
                                <col style={{ width: '1%' }} />    {/* الاجمالي */}
                            </colgroup>
                            <thead>
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>الرقم</th>
                                <th>البيان</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الكمية المرجعة</th>
                                <th style={{ whiteSpace: 'nowrap' }}>السعر</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الاجمالي</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [...order?.products || [], ...order?.extra_items || []]
                                    .sort((a, b) => a.number - b.number) // Sort by id, ascending
                                    .map((e, i) => (
                                        e.returned_quantity > 0 &&
                                    <tr>
                                        <td style={{ whiteSpace: 'nowrap' }}>{i + 1}</td>
                                        <td>{fixProductName(e.name)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{e.returned_quantity}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{Number.parseFloat(e.price).toFixed(2)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{(e.returned_quantity * e.price).toFixed(2)}</td>
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
                             <td rowSpan="4" >
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
                               <div>{Number.parseFloat(discount).toFixed(3)}</div>
                             </td>
                           </tr>
                   
                           <tr>
                             <td className="text-nowrap">
                               <div className='d-block' style={{ whiteSpace: 'nowrap' }}>المجموع بعد الخصم - Sub Total</div>
                             </td>
                             <td className="text-nowrap text-left">
                               <div>{Number.parseFloat(subtotalDiscount).toFixed(3)}</div>
                             </td>
                           </tr>
                   
                           <tr>
                             <td className="text-nowrap">
                               <div className='d-block' style={{ whiteSpace: 'nowrap' }}>الضريبة (16%) - Tax</div>
                             </td>
                             <td className="text-nowrap text-left">
                               <div>{Number.parseFloat(taxAmount).toFixed(3)}</div>
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
                {
                    <InvoiceFooter order={order}/>
                }
            </div>
        </div>
    )
}

function InvoiceHeader({order}) {
    const [qrUrl, setQrUrl] = useState('')
    useEffect(() => {
        if (order?.qr_code) {
            QRCode.toDataURL(order.qr_code)
                .then(url => setQrUrl(url))
                .catch(console.error)
        }
    }, [order?.qr_code])
    return (
    <>
       <Row className="small text-muted justify-content-between invoice-header no-gutters fixed-hight">
    {/* Address Information - RIGHT SIDE */}
     <Col xl={4} lg={4} md={4} sm={4} xs={4} className="address-col p-0">
        <div className="content-wrapper w-100">
            <p className="address-line">موقع الشركة:    الأردن - عمان - شارع الملكة رانيا</p>
            <p className="address-line">طلوع نيفين - مجمع خليفة الطابق 3 (مكتب 308)</p>
            <p className="address-line">إيميل: info@mikroelectron.com</p>
            
            {/* Phone Connection Container */}
            <div className="phone-connection-container">
                <p className="address-line d-flex align-items-center"> هاتف :     062225522 / فاكس : 065344778</p> </div>
            <p className="address-line m-0  p-0 textsize text-nowrap d-flex align-items-center">
                <div className="l-shaped-arrow-clean ">
                    <div className="arrow-head"></div>
                </div>
               <p className='subtitle'> (المبيعات فرعي 1 , الدعم الفني فرعي 2 , الإدارة فرعي 3)</p>
            </p>
        </div>
    </Col>
    {/* QR Code - CENTER */}
    {order?.qr_code && (
        <Col xl={3} lg={3} md={3} sm={3} xs={3} className="text-center p-0">
            <img src={qrUrl} alt="QR Code" className="qr-code img-fluid" />
        </Col>
    )}

    {/* Logo - LEFT SIDE */}
    <Col xl={4} lg={4} md={4} sm={4} xs={4} className="logo-col p-0">
        <div className="content-wrapper w-100">
            <img src={logo} className="logo img-fluid" alt="Logo" />
            <p className="company-name">مؤسســة منتصر ومحمود للالكترونيات</p>
            <p className="website">WWW.MIKROELECTRON.COM</p>
            <p className="tax-number">الرقم الضريبي : 013461320</p>
        </div>
    </Col>

</Row>
            <hr/>
        </>
    )
}

function InvoiceFooter({order}) {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
       <>
                  <br/>
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
                  </Row>
                  )}
                  <Row className='mt-0'>
                      <Col md={6} sm={6}>
                          <h4 className="invoice-field">
                              <div className='d-flex mb-0'>
                                  <h4 className='field-label '>
                                      اسم المستلم
                                  </h4>
                                  <span className=" underline-dotted flex-grow-1 dotreseve"><strong className='ml-1'>:</strong></span>
                              </div>
                          </h4>
                      </Col>
                      <Col md={6} sm={6}>
                          <h4 className="invoice-field">
                              <div className='d-flex mb-0'>
                                  <h4 className='field-label'>
                                      اسم البائع
                                  </h4>
                                  <span className=" underline-dotted flex-grow-1 dotnamereseve"><strong className='ml-1'>:</strong><strong>{user?.name}</strong></span>
                              </div>
                          </h4>
                      </Col>
                  </Row>
                   <Row className='mt-0'>
                      <Col md={6} sm={6}>
                          <h4 className="invoice-field">
                              <div className='d-flex mb-0'>
                                  <h4 className='field-label'>
                                      توقيع المستلم 
                                  </h4>
                                  <span className=" underline-dotted flex-grow-1 dotsign"><strong className='ml-1'>:</strong></span>
                              </div>
                          </h4>
                      </Col>
                      <Col md={6} sm={6}>
                          <h4 className="invoice-field">
                              <div className='d-flex mb-0'>
                                  <h4 className='field-label'>
                                      الختم 
                                  </h4>
                                  <span className=" underline-dotted flex-grow-1 dotmikro"><strong className='ml-1'>:</strong></span>
                              </div>
                          </h4>
                      </Col>
                  </Row>
                
                  {/* <p className="text-left">{order?.number}</p> */}
              </>
          )
      }
      
      export default Print