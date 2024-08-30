import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Database, File } from 'react-feather'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import { stockApi } from '@data/use-report'
import { needsToExcel  } from '@helpers/Need'


const TypeOptions = [
    { value: 'need', label: 'النواقص' },
    { value: 'stock', label: 'كمية الستوك والقيمة' }
]


const Tables = ({ onChange }) => {

    const [type, setType] = useState(null)

    const onPrint = () => {
        const needConditionReport = [type]
        const params = new URLSearchParams(pickBy({needConditionReport}, identity)).toString()
        console.log(params)
        window.open(`/reports/needs/print?${params}`)
    }

    const handleExport = async () => {
        const needConditionReport = [type]
        const params = new URLSearchParams(pickBy({needConditionReport}, identity)).toString()
        const data = await stockApi.order(params)
        console.log(params)
        let fileName =  `product-need`

        if (type) fileName += `__${type}`

        needsToExcel(data, fileName)
    }

    useEffect(() => {
        onChange(pickBy({  type }, identity))
    }, [type])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='4'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='النوع'
                            options={TypeOptions}
                            onChange={item => setType(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExport()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple>
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='danger' onClick={e => onPrint()}>
                            <File size={14} />
                            <span className='align-middle ml-25'>Print & PDF</span>
                        </Button.Ripple>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables
