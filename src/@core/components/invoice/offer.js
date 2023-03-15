import { Row, Col } from 'reactstrap'
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'

const Print = ({ order, meta: { total, subtotal, discount, subtotalDiscount, fixedDiscount } }) => {
    const date = order?.taxed_at || order?.completed_at || order?.created_at
    return (
        <div className="invoice">
            <div>
                <h2 className='text-center my-3'><strong>عرض سعر - Price Offer</strong></h2>
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
                                <span className='font-20'>رقم العرض :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.number}</strong>
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
                                <td rowSpan="3" colSpan={2}><strong>البضاعة التي تباع لا ترد ولا تستبدل</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>المجموع - Sub Total</strong></td>
                                <td colSpan={3}><strong>{subtotal}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>الخصم - Discount</strong></td>
                                <td colSpan={3}><strong>{fixedDiscount}</strong></td>
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
                <Row className='mt-3'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <strong className='font-20'>ملاحظات :</strong>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{order?.invoice_notes}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Print
