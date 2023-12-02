// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import Flatpickr from 'react-flatpickr'
import { User, MapPin } from 'react-feather'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Row, Col, Button, Label, FormGroup, Input, CustomInput, Form } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

export default function () {
  // ** State
  const [data, setData] = useState(null)

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm({
    defaultValues: { gender: 'gender-female', dob: null }
  })
  return (
    <Form
      onSubmit={handleSubmit(data => {
        trigger()
        setData(data)
      })}
    >
      <Row className='mt-1'>
        <Col md='6'>
          <FormGroup>
            <Label for='mobileNumber'>Mobile</Label>
            <Controller
              as={Cleave}
              control={control}
              id='mobileNumber'
              name='mobileNumber'
              defaultValue='+6595895857'
              placeholder='1 234 567 8900'
              options={{ phone: true, phoneRegionCode: 'US' }}
              className={classnames('form-control', {
                'is-invalid': data !== null && (data.mobileNumber === undefined || data.mobileNumber === null)
              })}
            />
          </FormGroup>
        </Col>

        <Col md='6'>
          <FormGroup>
            <Label for='website'>Percentage</Label>
            <Input
                type='url'
                id='website'
                name='website'
                placeholder='https://google.com'
                defaultValue='https://rowboat.com/insititious/Angelo'
            />
          </FormGroup>
        </Col>

        <Col md='12'>
          <FormGroup>
            <Label for='website'>Address</Label>
            <Input
              type='url'
              id='website'
              name='website'
              placeholder='https://google.com'
              defaultValue='https://rowboat.com/insititious/Angelo'
            />
          </FormGroup>
        </Col>

        <Col md='12'>
          <FormGroup>
            <Label for='country'>Notes</Label>
            <Input
              type='textarea'
              id='country'
              name='country'
              innerRef={register({ required: true })}
              invalid={errors.country && true}
            />
          </FormGroup>
        </Col>
        <Col className='d-flex flex-sm-row flex-column mt-2'>
          <Button type='submit' color='primary' className='mb-1 mb-sm-0 mr-0 mr-sm-1'>
            Save Changes
          </Button>
          <Button type='reset' color='secondary' outline>
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
