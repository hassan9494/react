import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FormGroup, Label, Spinner } from 'reactstrap'
import { Controller } from 'react-hook-form'

const EditorField = ({ form, name, label, rules = {}, list = [], ...props }) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 1000)
        return () => clearTimeout(timer) // Cleanup function to clear the timeout
    }, [])

    return (
        <FormGroup>
            { label && <Label>{label}</Label> }
            <Controller
                control={form.control}
                name={name}
                innerRef={form.register(rules)}
                invalid={form.errors[name] && true}
                render={
                    ({ value, onChange }) => {
                        if (!show) return <Spinner />
                        return (
                            <CKEditor
                                editor={ ClassicEditor }
                                data={value || ''}
                                config={ {
                                    ckfinder: {
                                        uploadUrl: `${process.env.REACT_APP_ADMIN_API_UPLOAD}/content`
                                    }
                                } }
                                onReady={ editor => {
                                    if (editor) {
                                        editor.editing.view.change((writer) => {
                                            writer.setStyle(
                                                "min-height",
                                                "200px",
                                                editor.editing.view.document.getRoot()
                                            )
                                        })
                                    }
                                } }
                                onChange={(event, editor) => onChange(editor?.getData())}
                                onBlur={ (event, editor) => {
                                    // console.log('Blur.', editor)
                                } }
                                onFocus={ (event, editor) => {
                                    // console.log('Focus.', editor)
                                } }
                            />
                        )
                    }
                }
            />
        </FormGroup>
    )
}

export default EditorField
