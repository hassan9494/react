import React, { useEffect, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { Button, Card, CardBody, CardHeader, Col, Input, Row, Spinner } from "reactstrap"
import {Download, Printer, Trash} from "react-feather"
import axiosInstance from '../../../utility/axiosIsntance'

function makeid(length = 10) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`
}

function Basic({onChange, files = []}) {

    const [forSend, setForSend] = useState([])

    const uploader = async (file) => {
        const formData = new FormData()
        formData.append('file', file.file)
        formData.append('id', file.id)
        const { data } = await axiosInstance.post('media/order', formData)
        const newFiles = files.map(e => {
            if (e.id === data.id) {
                e.url = data.url
                e.key = data.key
                e.name = data.name
                e.new = true
            }
            return e
        })
        onChange(newFiles)
    }

    const {acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 5,
        multiple: true,
        onDropAccepted: newFiles => {
            newFiles = newFiles.map(file => {
                return { id: makeid(), file }
            })
            onChange([...files, ...newFiles])
            setForSend(newFiles)
        }
    })

    useEffect(() => {
        for (const file of forSend) uploader(file)
    }, [forSend])

    useEffect(() => {
        onChange(files)
    }, [files])

    const deleteRow = (index) => {
        const newFiles = [...files]
        if (newFiles[index].new) {
            newFiles.splice(index, 1)
        } else {
            newFiles[index].deleted = true
        }
        onChange(newFiles)
    }

    const printFiles = files.filter(e => !e.deleted).map(({file, id, url, name, size}, index) => (
        <section key={id}>
            <Row className='justify-content-between align-items-center'>
                <Col md={10} className='mb-1'>
                    <Input type='text' disabled value={`[${formatBytes(size || file.size)}] - ${name || url || file.path}`} />
                </Col>
                <Col md={1} className='text-center mb-1'>
                    <a href={url} target='_blank'>
                        <Button.Ripple
                            block
                            className='btn-icon'
                            color='light'
                            // onClick={() => deleteRow(i)}
                        >
                            { url ? <Download size={20} /> : <Spinner size={'sm'}/> }
                        </Button.Ripple>
                    </a>
                </Col>
                <Col md={1} className='text-center mb-1'>
                    <Button.Ripple
                        block
                        className='btn-icon'
                        color='light'
                        onClick={() => deleteRow(index)}
                    >
                        <Trash size={20} />
                    </Button.Ripple>
                </Col>
            </Row>
            <hr className='m-0 mb-1'/>
        </section>
    ))

    return (
        <Card>
            <CardHeader>
                <h4>Attachments</h4>
            </CardHeader>
            <CardBody>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p className="attachments-box">Drag 'n' drop some files here, or click to select files</p>
                </div>
                {printFiles}
            </CardBody>
        </Card>
    )
}

export default Basic