import { Row, Col } from 'reactstrap'
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'
import logo from "../../assets/images/logo.png"
import React from "react"
import Avatar from '@components/avatar'


const Print = ({ order, meta: { total, subtotal, discount, subtotalDiscount, fixedDiscount } }) => {
    const date = order?.taxed_at || order?.completed_at || order?.created_at

const fixProductName = (name) => {
  return name && /^\d/.test(name) ? `\u200E${  name}` : name
}

    const sortedProducts = [...order?.products || [], ...order?.extra_items || []]
        .sort((a, b) => {
            // Handle cases where location might be null/undefined
            const locationA = (a.location || '').toString().toUpperCase()
            const locationB = (b.location || '').toString().toUpperCase()
            
            // Natural sorting for alphanumeric locations (A1, A2, B1, etc.)
            return locationA.localeCompare(locationB, undefined, { 
                numeric: true, 
                sensitivity: 'base' 
            })
        })

    return (
        <div className="invoice" >
            {/*<InvoiceHeader order={order}/>*/}
            <div>
                <h3 className='text-center mt-1 mb-2 invoice-title'>
                    <strong>طلب تحضير - Preparation Order</strong>
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
                                <col style={{ width: '1%' }} />    {/* الصورة */}
                                <col />                             {/* البيان - takes remaining */}
                                <col style={{ width: '1%' }} />    {/* الموقع */}
                                <col style={{ width: '1%' }} />    {/* الكمية */}
                                <col style={{ width: '1%' }} />    {/* السعر */}
                                <col style={{ width: '1%' }} />    {/* الاجمالي */}
                            </colgroup>
                            <thead>
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>الرقم</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الصورة</th>
                                <th>البيان</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الموقع</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الكمية</th>
                                <th style={{ whiteSpace: 'nowrap' }}>السعر</th>
                                <th style={{ whiteSpace: 'nowrap' }}>الاجمالي</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedProducts.map((e, i) => (
                                    <tr>
                                        <td style={{ whiteSpace: 'nowrap' }}>{i + 1}</td>
                                        <td className="text-center align-middle" style={{ whiteSpace: 'nowrap' }}>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <Avatar imgWidth={50} imgHeight={50} img={e.image} className="m-0" />
                                            </div>
                                        </td>
                                        <td >{fixProductName(e.name)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{[e.location, e.stock_location].filter(Boolean).join(' / ') || '-'}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{e.quantity}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{Number.parseFloat(e.price).toFixed(2)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{(e.quantity * e.price).toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                          <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
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
function InvoiceHeader({order}) {
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
export default Print
