import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { FormGroup, Label } from 'reactstrap'
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import '@uppy/progress-bar/dist/style.css'
import { Controller } from 'react-hook-form'

const CustomUploader = ({ form,  name, label, rules = {}, maxNumberOfFiles = 1, ...props }) => {

    const uppy = new Uppy({
        autoProceed: true
    })

    uppy.use(thumbnailGenerator)

    uppy.use(XHRUpload, {
        endpoint: process.env.REACT_APP_ADMIN_API_UPLOAD
    })

    uppy.on('thumbnail:generated', (file, preview) => {
        // const arr = files
        // arr.push({ id: file.id, preview, uploaded: false })
        // setFiles([...arr])
    })

    uppy.on('upload-success', (file, response) => {
        const res = response.body?.data
        const newFile = {
            id: file.id,
            url: res.url,
            key: res.key,
            new: true
        }
        if (res) {
            if (maxNumberOfFiles === 1) {
                form.setValue('media', [newFile])
            } else {
                const old = form.getValues('media') ?? []
                form.setValue('media', [...old, newFile])
            }
        }
    })

    const remove = (id) => {
        if (confirm("Are you sure to delete?")) {
            const arr = form.getValues('media').map(e => {
                e.deleted = id === e.id ? true : e.deleted
                return e
            })
            form.setValue('media', arr)
        }
    }

    const renderPreview = ({value}) => {
        console.log(value)
        if (!value) return <></>
        return value.filter(e => !e?.deleted).map(
            (e, index) => <img
                key={index}
                className='rounded mt-2 mr-1'
                src={e.url || e.original_url}
                alt='avatar'
                onClick={() => remove(e.id)} width={'60px'} height={'60px'}
            />
        )
    }

    return (
        <FormGroup>
            {
                label &&
                <Label>{ label }</Label>
            }
            <DragDrop uppy={uppy} />
            <Controller
                control={form.control}
                defaultValue={null}
                name={'media'}
                render={
                    renderPreview
                }
            />
        </FormGroup>
    )

}

export default CustomUploader
