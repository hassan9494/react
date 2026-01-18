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
import { needsToExcelWithImages} from "@helpers/NeedWithImages"
import {useSources} from "@data/use-source"


const TypeOptions = [
    { value: 'nwaqes', label: 'النواقص' },
    { value: 'stock', label: 'كمية الستوك والقيمة' }
]
const SourceTypeOptions = [
    { value: 'air', label: 'Air' },
    { value: 'sea', label: 'Sea' },
    { value: 'local', label: 'Local' }
]


const Tables = ({ onChange }) => {

    const [type, setType] = useState(null)
    const [sourceType, setSourceType] = useState(null)
    const [source, setSource] = useState(null)
    const {data: sources} = useSources()

    const sourcesSelect = [
        { value: 0, label: 'No Choice' },
        ...sources.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]
    const onPrint = () => {
        const needConditionReport = [type]
        const params = new URLSearchParams(pickBy({needConditionReport}, identity)).toString()
        window.open(`/reports/needs/print?${params}`)
    }

    const handleExport = async () => {
        const needConditionReport = [type]
        const source_id = source

        const params = new URLSearchParams(pickBy({
            needConditionReport,
            sourceType, // ADD THIS
            source_id
        }, identity)).toString()

        console.log(params)
        const data = await stockApi.order(params)
        let fileName =  `product-need`

        if (type) fileName += `__${type}`
        if (sourceType) fileName += `__${sourceType}`

        needsToExcel(data, fileName)
    }
    const oldhandleExportWithImages = async () => {
        const needConditionReport = [type, sourceType]
        const params = new URLSearchParams(pickBy({needConditionReport}, identity)).toString()
        const data = await stockApi.order(params)
        let fileName =  `product-need`

        if (type) fileName += `__${type}`

        needsToExcelWithImages(data, fileName)
    }

    const handleExportWithImages = async () => {
        const baseURL = process.env.REACT_APP_ADMIN_API
        const params = new URLSearchParams(pickBy({
            needConditionReport: type ? [type] : null,
            sourceType, // ADD THIS LINE
            source_id: source
        }, identity)).toString()

        try {
            const response = await fetch(`${baseURL}/reports/stock/export-images-zip?${params}`)
            const { export_id, total_chunks, download_base } = await response.json()

            // Create download UI
            const container = document.createElement('div')
            container.style.position = 'fixed'
            container.style.top = '20px'
            container.style.right = '20px'
            container.style.padding = '15px'
            container.style.background = 'white'
            container.style.border = '1px solid #ddd'
            container.style.borderRadius = '5px'
            container.style.zIndex = '1000'
            container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
            container.style.maxWidth = '400px'

            const title = document.createElement('h3')
            title.textContent = 'Export Products with Images'

            const info = document.createElement('p')
            info.textContent = `Your export contains ${total_chunks} files:`

            const instruction = document.createElement('p')
            instruction.innerHTML = `
            <strong>How to use:</strong><br>
            1. Download each part individually<br>
            2. Each file is a complete Excel sheet<br>
            3. Images are embedded in the Excel files
        `

            const downloadAllBtn = document.createElement('button')
            downloadAllBtn.textContent = 'Download All as ZIP'
            downloadAllBtn.style.marginTop = '10px'
            downloadAllBtn.style.padding = '8px 15px'
            downloadAllBtn.style.background = '#7367f0'
            downloadAllBtn.style.color = 'white'
            downloadAllBtn.style.border = 'none'
            downloadAllBtn.style.borderRadius = '4px'
            downloadAllBtn.style.cursor = 'pointer'

            const list = document.createElement('div')
            list.style.marginTop = '15px'
            list.style.maxHeight = '300px'
            list.style.overflowY = 'auto'

            container.appendChild(title)
            container.appendChild(info)
            container.appendChild(instruction)
            container.appendChild(downloadAllBtn)
            container.appendChild(list)
            document.body.appendChild(container)

            // Create download links for each chunk
            for (let i = 0; i < total_chunks; i++) {
                const link = document.createElement('a')
                link.textContent = `Download Part ${i + 1}`
                link.href = `${download_base}/${i}`
                link.download = `products_part_${i + 1}.xlsx` // .xlsx extension
                link.style.display = 'block'
                link.style.padding = '5px 0'
                link.style.color = '#7367f0'
                link.style.textDecoration = 'none'

                list.appendChild(link)
            }

            // Download all handler
            downloadAllBtn.onclick = () => {
                window.location.href = `${baseURL}/reports/download-all/${export_id}`
            }

            // Add close button
            const closeBtn = document.createElement('button')
            closeBtn.textContent = 'Close'
            closeBtn.style.marginTop = '10px'
            closeBtn.style.padding = '5px 10px'
            closeBtn.style.float = 'right'
            closeBtn.onclick = () => {
                document.body.removeChild(container)
            }
            container.appendChild(closeBtn)
        } catch (error) {
            console.error('Export failed', error)
            alert(`Export failed: ${error.message}`)
        }
    }

    const newhandleExportWithImages = async () => {
        const baseURL = process.env.REACT_APP_ADMIN_API
        const params = new URLSearchParams(pickBy({
            needConditionReport: [type],
            source_id: source
        }, identity)).toString()

        window.open(`${baseURL}/reports/stock/export-images-zip?${params}`)
    }

    useEffect(() => {
        onChange(pickBy({  type, source, sourceType}, identity))
    }, [type, source, sourceType])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='3'>
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
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='نوع المصدر'
                            options={SourceTypeOptions}
                            onChange={item => setSourceType(item?.value)}
                        />
                    </Col>
                    <Col md='3'>

                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='المصدر'
                            options={sourcesSelect}
                            onChange={item => setSource(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExport()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple>
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExportWithImages()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel with image</span>
                        </Button.Ripple>
                    </Col>
                    {/*<Col md='2'>*/}
                    {/*    <Button.Ripple size='block' color='danger' onClick={e => onPrint()}>*/}
                    {/*        <File size={14} />*/}
                    {/*        <span className='align-middle ml-25'>Print & PDF</span>*/}
                    {/*    </Button.Ripple>*/}
                    {/*</Col>*/}
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables
