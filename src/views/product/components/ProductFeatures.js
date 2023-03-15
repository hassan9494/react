import {
    Col,
    Input,
    Button,
    Card,
    CardBody,
    Row,
     CardHeader
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Plus, Trash } from 'react-feather'

export default function Features({ form: {register, errors, control, setValue, watch} }) {

    const fieldName = 'features'

    const data = watch(fieldName)

    const addRow = () => {
        const newData = data || []
        setValue(fieldName, [...newData, {}])
    }

    const deleteRow = i => {
        const newData = data
        newData.splice(i, 1)
        setValue(fieldName, newData)
    }

    const updateRow = (i, row, event) => {
        const newData = data
        newData[i] = { ...row, [event.target.name]: event.target.value }
        setValue(fieldName, newData)
    }

    const renderRow = ({ onChange, value, name, ref }) => (
        <>
            {
                value?.map((row, i) => (
                    <section key={i}>
                        <Row className='justify-content-between align-items-center'>
                            <Col md={4} className='mb-1'>
                                <Input type='text' name='name' placeholder='Name' value={row.name} required onChange={(event) => updateRow(i, row, event)} />
                            </Col>
                            <Col md={7} className='mb-1'>
                                <Input type='text' name='value' placeholder='Value' value={row.value} required onChange={(event) => updateRow(i, row, event)} />
                            </Col>
                            <Col md={1} className='text-center mb-1'>
                                <Button.Ripple block className='btn-icon' color='light' onClick={() => deleteRow(i)}>
                                    <Trash size={20} />
                                </Button.Ripple>
                            </Col>
                        </Row>
                        <hr className='m-0 mb-1'/>
                    </section>
                ))
            }
        </>
    )

    return (
        <Card>
            <CardHeader>
                <h4>Features</h4>
            </CardHeader>
            <CardBody>
                <Controller
                    control={control}
                    defaultValue={null}
                    name={fieldName}
                    render={renderRow}
                />
                <Button.Ripple className='btn-icon' color='light' onClick={addRow}>
                    <Plus size={14} />
                    <span className='align-middle ml-25'>Add New</span>
                </Button.Ripple>
            </CardBody>
        </Card>
    )

}
