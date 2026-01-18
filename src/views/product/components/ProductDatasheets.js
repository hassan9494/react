import {
    Col,
    Input,
    Button,
    Card,
    CardBody,
    Row,
    CardHeader,
    InputGroup,
    InputGroupText,
    Spinner,
    Badge
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Plus, Trash, Upload, Link as LinkIcon, X, File, ExternalLink, Info, List } from 'react-feather'
import { useState } from 'react'
import { api } from '@data/use-file'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

export default function Datasheets({ form: {register, errors, control, setValue, watch} }) {

    const fieldName = 'datasheets'
    const data = watch(fieldName)
    const [uploadingIndex, setUploadingIndex] = useState(null)
    const [showLinkInput, setShowLinkInput] = useState(null)
    const history = useHistory()

    const addRow = () => {
        const newData = data || []
        setValue(fieldName, [{ name: '', value: '', type: 'link' }, ...newData])
    }

    const goToFileList = () => {
        history.push('/file/list')
    }

    const deleteRow = i => {
        const newData = data || []
        newData.splice(i, 1)
        setValue(fieldName, newData)
    }

    const updateRow = (i, row, event) => {
        const newData = data || []
        newData[i] = { ...row, [event.target.name]: event.target.value }
        setValue(fieldName, newData)
    }

    const handleFileUpload = async (i, row, file) => {
        if (!file) return

        setUploadingIndex(i)
        try {
            const formData = new FormData()
            formData.append('name', file.name)
            formData.append('file', file)

            const response = await api.create(formData)

            console.log('File upload response:', response)

            // Update the row with the file link from response
            const newData = [...(data || [])]
            newData[i] = {
                ...row,
                value: response?.link || response?.data?.link,
                name: row.name || file.name,
                type: 'file',
                fileName: file.name
            }
            setValue(fieldName, newData)
            toast.success('File uploaded successfully')
        } catch (error) {
            console.error('File upload failed:', error)
            toast.error('File upload failed')

            // On failure, keep the file reference but mark as failed
            const newData = [...(data || [])]
            newData[i] = {
                ...row,
                name: row.name || file.name,
                type: 'file',
                fileName: file.name,
                uploadFailed: true
            }
            setValue(fieldName, newData)
        } finally {
            setUploadingIndex(null)
        }
    }

    const removeFile = (i, row) => {
        const newData = [...(data || [])]
        newData[i] = { ...row, value: '', type: 'link', fileName: '', uploadFailed: false }
        setValue(fieldName, newData)
    }

    const toggleLinkInput = (i) => {
        setShowLinkInput(showLinkInput === i ? null : i)
    }

    const handleManualLink = (i, row, event) => {
        const newData = [...(data || [])]
        newData[i] = {
            ...row,
            value: event.target.value,
            type: 'link',
            fileName: ''
        }
        setValue(fieldName, newData)
    }

    const getFileExtension = (filename) => {
        return filename?.split('.').pop()?.toUpperCase() || 'FILE'
    }

    const renderRow = ({ onChange, value, name, ref }) => (
        <>
            {
                value?.map((row, i) => (
                    <Card key={i} className='mb-2 border'>
                        <CardBody className='p-2'>
                            <Row className='align-items-center'>
                                <Col md={4} className='mb-1'>
                                    <Input
                                        type='text'
                                        name='name'
                                        placeholder='Enter title...'
                                        value={row.name || ''}
                                        required
                                        onChange={(event) => updateRow(i, row, event)}
                                        bsSize='sm'
                                    />
                                </Col>
                                <Col md={7} className='mb-1'>
                                    {/* Show uploaded file with link */}
                                    {row.type === 'file' && row.value ? (
                                        <InputGroup size='sm'>
                                            <InputGroupText className='bg-light'>
                                                <File size={14} className='text-primary' />
                                                <Badge color='light' className='ms-1 text-dark'>
                                                    {getFileExtension(row.fileName)}
                                                </Badge>
                                            </InputGroupText>
                                            <Input
                                                type='text'
                                                value={row.fileName || 'Uploaded file'}
                                                disabled
                                                className='bg-light'
                                            />
                                            <InputGroupText>
                                                <a
                                                    href={row.value}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-success mx-1'
                                                    title='Open file'
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                                <X
                                                    size={16}
                                                    className='text-danger cursor-pointer mx-1'
                                                    onClick={() => removeFile(i, row)}
                                                    title='Remove file'
                                                />
                                            </InputGroupText>
                                        </InputGroup>
                                    ) : row.type === 'file' && row.uploadFailed ? (
                                        <InputGroup size='sm'>
                                            <Input
                                                type='text'
                                                value={row.fileName || 'Upload failed'}
                                                disabled
                                                className='bg-danger text-white'
                                                placeholder='Upload failed - click X to remove'
                                            />
                                            <InputGroupText>
                                                <Button
                                                    color='danger'
                                                    size='sm'
                                                    onClick={() => removeFile(i, row)}
                                                    className='p-0'
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </InputGroupText>
                                        </InputGroup>
                                    ) : showLinkInput === i ? (
                                        <InputGroup size='sm'>
                                            <InputGroupText>
                                                <LinkIcon size={14} className='text-info' />
                                            </InputGroupText>
                                            <Input
                                                type='text'
                                                name='value'
                                                placeholder='Paste link here...'
                                                value={row.value || ''}
                                                required
                                                onChange={(event) => handleManualLink(i, row, event)}
                                            />
                                            <InputGroupText>
                                                <X
                                                    size={14}
                                                    className='cursor-pointer text-danger'
                                                    onClick={() => {
                                                        toggleLinkInput(i)
                                                        const newData = [...(data || [])]
                                                        newData[i] = { ...row, value: '', type: 'link' }
                                                        setValue(fieldName, newData)
                                                    }}
                                                    title='Cancel link'
                                                />
                                            </InputGroupText>
                                        </InputGroup>
                                    ) : row.type === 'link' && row.value ? (
                                        // Show link preview when link is filled
                                        <InputGroup size='sm'>
                                            <InputGroupText className='bg-light'>
                                                <LinkIcon size={14} className='text-info' />
                                            </InputGroupText>
                                            <Input
                                                type='text'
                                                value={row.value}
                                                disabled
                                                className='bg-light'
                                                placeholder='Link added'
                                            />
                                            <InputGroupText>
                                                <a
                                                    href={row.value}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-success mx-1'
                                                    title='Open link'
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                                <X
                                                    size={16}
                                                    className='text-danger cursor-pointer mx-1'
                                                    onClick={() => {
                                                        const newData = [...(data || [])]
                                                        newData[i] = { ...row, value: '', type: 'link' }
                                                        setValue(fieldName, newData)
                                                    }}
                                                    title='Remove link'
                                                />
                                            </InputGroupText>
                                        </InputGroup>
                                    ) : (
                                        // Show file upload only when no link is filled and not in link input mode
                                        <InputGroup size='sm'>
                                            <Input
                                                type='file'
                                                onChange={(e) => {
                                                    const file = e.target.files[0]
                                                    if (file) {
                                                        handleFileUpload(i, row, file)
                                                        e.target.value = ''
                                                    }
                                                }}
                                                disabled={uploadingIndex === i}
                                                accept="*/*"
                                                className='cursor-pointer'
                                            />
                                            <InputGroupText>
                                                {uploadingIndex === i ? (
                                                    <Spinner size='sm' color='primary' />
                                                ) : (
                                                    <Button
                                                        color='outline-info'
                                                        size='sm'
                                                        onClick={() => toggleLinkInput(i)}
                                                        className='p-0 px-1 border-0'
                                                        title='Add link instead'
                                                    >
                                                        <LinkIcon size={14} />
                                                    </Button>
                                                )}
                                            </InputGroupText>
                                        </InputGroup>
                                    )}
                                </Col>
                                <Col md={1} className='text-center mb-1'>
                                    <Button.Ripple
                                        className='btn-icon'
                                        color='outline-danger'
                                        size='sm'
                                        onClick={() => deleteRow(i)}
                                        disabled={uploadingIndex === i}
                                    >
                                        <Trash size={14} />
                                    </Button.Ripple>
                                </Col>
                            </Row>

                            {/* Show file upload status */}
                            {uploadingIndex === i && (
                                <Row>
                                    <Col md={12}>
                                        <div className='d-flex align-items-center mt-1'>
                                            <Spinner size='sm' color='primary' className='me-1' />
                                            <small className='text-primary'>
                                                <strong>Uploading...</strong>
                                            </small>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {row.type === 'file' && !row.value && !row.uploadFailed && uploadingIndex !== i && (
                                <Row>
                                    <Col md={12}>
                                        <small className='text-muted'>
                                            <i>Select a file to upload</i>
                                        </small>
                                    </Col>
                                </Row>
                            )}
                        </CardBody>
                    </Card>
                ))
            }
        </>
    )

    return (
        <Card className='shadow-sm'>
            <CardHeader className='bg-light py-2'>
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <div className='d-flex align-items-center'>
                        <h5 className='mb-0 fw-bold'>Datasheets</h5>
                        <Badge color='primary' pill className='ms-2'>
                            {data?.length || 0}
                        </Badge>
                    </div>
                    <div className='d-flex gap-1'>
                        <Button
                            color='secondary'
                            onClick={goToFileList}
                            size='sm'
                            className='d-flex align-items-center btn-icon-sm'
                            title='Go to File Manager'
                        >
                            <List size={16} />
                            <span className='d-none d-md-inline ms-1'>File Manager</span>
                        </Button>
                        <Button
                            color='primary'
                            onClick={addRow}
                            disabled={uploadingIndex !== null}
                            size='sm'
                            className='d-flex align-items-center btn-icon-sm'
                        >
                            <Plus size={16} />
                            <span className='d-none d-md-inline ms-1'>Add New</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className='p-3'>
                <Controller
                    control={control}
                    defaultValue={[]}
                    name={fieldName}
                    render={renderRow}
                />
            </CardBody>
        </Card>
    )
}
