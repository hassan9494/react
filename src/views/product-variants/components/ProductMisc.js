import {
    Label,
    Input,
    FormGroup,
    Card,
    CardBody,
    CustomInput
} from 'reactstrap'

export default ({ form }) => {
    const {register, errors} = form
    return (
        <Card>

            <CardBody>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-featured'>
                        Featured
                    </Label>
                    <CustomInput
                        id='product-featured'
                        type='switch'
                        name='options.featured'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-available'>
                        Available
                    </Label>
                    <CustomInput
                        id='product-available'
                        type='switch'
                        name='options.available'
                        innerRef={register()}
                    />
                </div>
            </CardBody>
        </Card>
    )
}