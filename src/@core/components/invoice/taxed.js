// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'

const Print = ({ order, meta: { total, subtotal, discount, subtotalDiscount, taxAmount } }) => {
    const date = order?.taxed_at || order?.completed_at || order?.created_at
    return (
        <div className="invoice">
            <InvoiceHeader order={order}/>
            <div>
                <h2 className='text-center my-3'><strong>فاتورة بيع نقدي - Cash Invoice</strong></h2>
                <Row>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                  <span className='font-20'>
                                   التاريخ :
                                  </span>
                                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ moment(date).format('DD/MM/Y') }</strong></span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>رقم الفاتورة :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.tax_number}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>السيد / السيدة :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.customer?.name}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>الهاتف :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.customer?.phone}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='my-1'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>العنوان :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.shipping?.address}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='my-1'>
                    <Col>
                        <table className="table1">
                            <thead>
                            <tr>
                                <th>الرقم</th>
                                <th>البيان</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>الاجمالي</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [...order?.products || [], ...order?.extra_items || []].map((e, i) => (
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td>{e.quantity}</td>
                                        <td>{Number.parseFloat(e.price).toFixed(2)}</td>
                                        <td>{(e.quantity * e.price).toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td rowSpan="4" colSpan={2}><strong>البضاعة التي تباع لا ترد ولا تستبدل</strong></td>
                                <td colSpan={2}><strong>المجموع - Sub Total</strong></td>
                                <td><strong>{subtotal}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>الخصم - Discount</strong></td>
                                <td><strong>{discount}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>المجموع بعد الخصم - Sub Total</strong></td>
                                <td><strong>{subtotalDiscount}</strong></td>
                            </tr>
                            <tr>
                                <td rowSpan="1" colSpan={2}><strong>الضريبة (16%) - Tax</strong></td>
                                <td><strong>{taxAmount}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>{new toArabic(total, 'JOD').parse()}</strong></td>
                                <td colSpan={2}><strong>المجموع الكلي - Total</strong></td>
                                <td><strong>{total}</strong></td>
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
    return (
        <>
            <Row>
                <Col>
                    <p>عمان - شارع الملكة رانيا - طلوع نيفين - مجمع خليفة</p>
                    <p>الطابق الثالث - مكتب 308</p>
                    <p>هاتف : 065344772</p>
                    <p>فاكس : 065344778</p>
                    <p>بريد الكتروني: info@mikroelectron.com</p>
                    <p>الموقع الالكتروني: www.mikroelectron.com</p>
                </Col>
                <Col>
                    <div className='float-left'>
                        <img src="http://mikroelectron.com/assets/img/logo-1.png" width="325px" height='auto'
                             alt="Logo MikroElectron"/>
                        <p className='pb-1'>مؤسسة منتصر ومحمود للالكترونيات</p>
                        <p><strong>الرقم الضريبي : {order?.tax_number}</strong></p>
                        {/*<p className="text-center">{order?.number}</p>*/}
                    </div>
                </Col>
            </Row>
            <hr/>
        </>
    )
}

function InvoiceFooter({order}) {
    return (
        <>
            <br/>
            <Row className='mt-2'>
                <Col>
                    <h4>
                        <div className='d-flex mb-2'>
                            <strong className='font-20'>
                                توقيع المستلم :
                            </strong>
                            <strong className="underline-dotted flex-grow-1 pr-1"></strong>
                        </div>
                    </h4>
                </Col>
                <Col>
                    <h4>
                        <div className='d-flex mb-2'>
                            <strong className='font-20'>
                                اسم البائع :
                            </strong>
                            <strong className="underline-dotted flex-grow-1 pr-1">Muntasir</strong>
                        </div>
                    </h4>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col>
                    <h4>
                        <div className='d-flex mb-2'>
                            <strong className='font-20'>ملاحظات :</strong>
                            <strong className="underline-dotted flex-grow-1 pr-1">
                                {order?.invoice_notes}
                            </strong>
                        </div>
                    </h4>
                </Col>
            </Row>
            <p className="text-center">{order?.number}</p>
        </>
    )
}

export default Print
