// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/base/pages/invoice.scss'
import moment from 'moment'
import toArabic from './toArabic'
import logo from "../../assets/images/logo.png"

const Print = ({ project }) => {
console.log(project)
    return (
        <div className="invoice">
            <InvoiceHeader order={project}/>
            <div>
                <h2 className='text-center my-3'><strong>مشروع</strong></h2>
                <h2 className='text-center my-1'>
                    <strong className='p-1 mx-1 receipt-total'>{ Number.parseInt(project?.amount)}</strong>
                    <strong className='p-1 receipt-total'>{ Number.parseFloat(project?.amount).toFixed(3).toString().split('.')[1]}</strong>
                </h2>
                <h2 className='text-center my-2'>
                    <strong className='p-1'>فلس</strong>
                    <strong className='p-1 mx-1'>دينار</strong>
                </h2>
                <Row>
                    <Col md={8} sm={8}>
                        <h4>
                            <div className='d-flex mb-2'>
                                  <span className='font-20'>
                                   التاريخ :
                                  </span>
                                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ moment(project?.date).format('DD/MM/Y') }</strong></span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex mb-2'>
                                  <span className='font-20'>الرقم :</span>
                                <span className="underline-dotted flex-grow-1 pr-1"><strong>{ project?.tax_number || project?.number }</strong></span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col md={8} sm={8}>
                        <h4>
                            <div className='d-flex mb-2'>
                                <span className='font-20'>وصلني من السيد / السيدة :</span>
                                <span className="underline-dotted flex-grow-1 pr-1">
                                    <strong>{project?.name}</strong>
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
                                    <strong>{new toArabic(project?.cost || 0, 'JOD').parse()}</strong>
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
                                    <strong>{project?.explanation}</strong>
                                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>
                {
                    <InvoiceFooter type={project?.type} number={project?.check_number}/>
                }
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

function InvoiceFooter({ type, number }) {
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
                            <span className='font-20'>رقم الشيك :</span>
                            <span className="underline-dotted flex-grow-1 pr-1"><strong>{ number || '' }</strong></span>
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
            <p className="text-left">{type?.number}</p>
        </>
    )
}

export default Print
