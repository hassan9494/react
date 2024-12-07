// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import moment from 'moment'
import toArabic from './toArabic'

const Print = ({ receipt }) => {

    return (
        <div className="invoice">
            <InvoiceHeader order={receipt}/>
            <div>
                <h2 className='text-center my-3'><strong>سـند قـبــض</strong></h2>
                <h2 className='text-center my-1'>
                    <strong className='p-1 mx-1 receipt-total'>{ Number.parseInt(receipt?.amount)}</strong>
                    <strong className='p-1 receipt-total'>{ Number.parseInt(receipt?.amount).toFixed(2).toString().split('.')[1]}</strong>
                </h2>
                <h2 className='text-center my-2'>
                    <strong className='p-1'>فلس</strong>
                    <strong className='p-1 mx-1'>دينار</strong>
                </h2>
                <Row>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                  <span className='font-20'>
                                   التاريخ :
                                  </span>
                                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ moment(receipt?.date).format('DD/MM/Y') }</strong></span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                  <span className='font-20'>الرقم :</span>
                                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ receipt?.tax_number || receipt?.number }</strong></span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>وصلني من السيد / السيدة :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{receipt?.name}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='my-1'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>مبلغًا وقدره :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{new toArabic(receipt?.amount || 0, 'JOD').parse()}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='my-1'>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>وذلك عن :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{receipt?.explanation}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                {
                    <InvoiceFooter type={receipt?.type}/>
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
                        <img
                            src="http://mikroelectron.com/assets/img/logo-1.png"
                            width="325px"
                            height='auto'
                            alt="Logo MikroElectron"
                        />
                        <p className='pb-1'>مؤسسة منتصر ومحمود للالكترونيات</p>
                        <p><strong>الرقم الضريبي : 013461320</strong></p>

                    </div>
                </Col>
            </Row>
            <hr/>
        </>
    )
}

function InvoiceFooter({ type }) {
    return (
        <>
            <br/>
            <Row className='mt-2'>
                <Col>
                    <h4>
                        <div className='d-flex mb-2'>
                            <strong className='font-20'>
                                نقدًا / شيك :
                            </strong>
                            <strong className="underline-dotted flex-grow-1 pr-1">{ type }</strong>
                        </div>
                    </h4>
                </Col>
            </Row>
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
            </Row>
            <p className="text-left">{order?.number}</p>
        </>
    )
}

export default Print
