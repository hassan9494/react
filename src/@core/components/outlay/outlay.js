// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import toArabic from './toArabic'
import moment from 'moment'

const Print = ({ outlay, meta: { name, amount, date, invoice, sub_type, total_amount, tax, notes } }) => {
    const outlay_date = outlay.date
    return (
        <div className="invoice">
            <InvoiceHeader outlay={outlay}/>
            <div>
                <h2 className='text-center my-3'><strong>المصاريف - Outlays</strong></h2>


                <Row className='my-1'>
                    <Col>
                        <table className="table1">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>OutlayType</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Total</th>
                                <th>Invoice</th>
                                <th>Tax</th>
                                <th>Notes</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*{*/}
                            {/*    outlay?.map((e, i) => (*/}
                            {/*        <tr>*/}
                            {/*            <td>{e.name}</td>*/}
                            {/*            <td>{e.sub_type}</td>*/}
                            {/*            <td>{e.date}</td>*/}
                            {/*            <td>{Number.parseFloat(e.amount).toFixed(2)}</td>*/}
                            {/*            <td>{Number.parseFloat(e.outlay_total_amount).toFixed(2)}</td>*/}
                            {/*            <td>{e.outlay_invoice}</td>*/}
                            {/*            <td>{e.tax}</td>*/}
                            {/*            <td>{e.notes}</td>*/}
                            {/*        </tr>*/}
                            {/*    ))*/}
                            {/*}*/}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                {
                    <InvoiceFooter outlay={outlay}/>
                }
            </div>
        </div>
    )
}

function InvoiceHeader({outlay}) {
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
                        <p><strong>الرقم الضريبي : 013461320</strong></p>
                        <p className="text-center">{outlay?.outlay_invoice}</p>
                    </div>
                </Col>
            </Row>
            <hr/>
        </>
    )
}

function InvoiceFooter({outlay}) {
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
                                {outlay?.notes}
                            </strong>
                        </div>
                    </h4>
                </Col>
            </Row>
        </>
    )
}

export default Print
