// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'
import {React} from "react"

const Print = ({ products }) => {
    const { REACT_APP_WEBSITE } = process.env

    return (
        <div className="invoice">
            <InvoiceHeader/>
            <div>
                <h2 className='text-center my-3'><strong>كمية الستوك والنواقص - Needs</strong></h2>
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <h4>*/}
                {/*            <div className='d-flex mb-2'>*/}
                {/*                  <span className='font-20'>*/}
                {/*                   التاريخ :*/}
                {/*                  </span>*/}
                {/*                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ moment(date).format('DD/MM/Y') }</strong></span>*/}
                {/*            </div>*/}
                {/*        </h4>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className='my-1'>
                    <Col>
                        <table className="table1">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Min quantity</th>
                                <th>Price</th>
                                <th>Price All</th>
                                <th>Real Price</th>
                                <th>Real Price All</th>
                                <th>Source Sku</th>
                                <th>Link</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                products?.map((e, i) => (
                                    <tr>
                                        <td>{e.name}</td>
                                        <td>{e.stock}</td>
                                        <td>{e.min_qty}</td>
                                        <td>{e.price}</td>
                                        <td>{e.priceAll}</td>
                                        <td>{e.real_price}</td>
                                        <td>{e.allRealPrice}</td>
                                        <td>{e.source_sku}</td>
                                        <td><a href={`${REACT_APP_WEBSITE}product/${e.sku}`} > {`${REACT_APP_WEBSITE}product/${e.sku}`} </a></td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                {/*{*/}
                {/*    <InvoiceFooter/>*/}
                {/*}*/}
            </div>
        </div>
    )
}

function InvoiceHeader() {
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
                        {/*<p><strong>الرقم الضريبي : 013461320</strong></p>*/}
                        {/*<p className="text-center">{order?.number}</p>*/}
                    </div>
                </Col>
            </Row>
            <hr/>
        </>
    )
}

function InvoiceFooter() {
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
                            {/*<strong className="underline-dotted flex-grow-1 pr-1">*/}
                            {/*    {order?.invoice_notes}*/}
                            {/*</strong>*/}
                        </div>
                    </h4>
                </Col>
            </Row>
            {/*<p className="text-center">{order?.number}</p>*/}
        </>
    )
}

export default Print
