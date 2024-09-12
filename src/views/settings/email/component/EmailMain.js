import {
    Card,
    CardBody,
    Button
} from 'reactstrap'
import moment from 'moment'
import EmailCustomer from './EmailCustomer'
import { Send} from "react-feather"

const PreviewCard = ({  form, isCompleted, isReorder }) => {


    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>New Email </strong>
                    </div>
                    <div>
                        Date: <span className='invoice-number'>{moment().format('Y-MM-DD')}</span>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing'/>

            {/* Address and Contact */}
            <CardBody className='px-2 pt-0'>
                <EmailCustomer form={form} disabled={isCompleted} />
            </CardBody>
            {/* /Address and Contact */}

            <CardBody className='invoice-padding pt-0 d-flex'>
            <Button.Ripple color='primary' type='submit' >
                <Send size={14} />
                <span className='align-middle ml-25'>Send Email</span>
            </Button.Ripple>
            </CardBody>

        </Card>
    )
}

export default PreviewCard
