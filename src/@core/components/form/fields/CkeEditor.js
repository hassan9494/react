import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FormGroup, Label, Spinner, Button } from 'reactstrap'
import { Controller } from 'react-hook-form'

const EditorField = ({ form, name, label, rules = {}, list = [], ...props }) => {
    const [show, setShow] = useState(false)
    const [editorInstance, setEditorInstance] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    // Function to clear all formatting
    const handleClearFormat = () => {
        if (editorInstance) {
            // Get current HTML content
            const currentContent = editorInstance.getData()

            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = currentContent

            // Function to recursively clean nodes while preserving structure and media
            const cleanNode = (node) => {
                // If it's a text node, just return the text
                if (node.nodeType === Node.TEXT_NODE) {
                    return document.createTextNode(node.textContent)
                }

                // If it's an element node
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase()

                    // List of tags to preserve completely (structure and media)
                    const preservedTags = [
                        // Media tags
                        'img', 'video', 'audio', 'iframe', 'embed', 'object',
                        'figure', 'picture', 'source', 'track', 'oembed',
                        // Structural tags (preserve new lines)
                        'p', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'ul', 'ol', 'li', 'blockquote', 'pre'
                    ]

                    // If it's a preserved element, keep it but clean its children
                    if (preservedTags.includes(tagName)) {
                        const newNode = node.cloneNode(false) // Clone without children

                        // Copy only essential attributes for media elements
                        if (['img', 'video', 'audio', 'iframe', 'embed', 'source'].includes(tagName)) {
                            Array.from(node.attributes).forEach(attr => {
                                if (['src', 'alt', 'width', 'height', 'controls', 'type'].includes(attr.name)) {
                                    newNode.setAttribute(attr.name, attr.value)
                                }
                            })
                        }

                        // Process all child nodes
                        Array.from(node.childNodes).forEach(child => {
                            const cleanedChild = cleanNode(child)
                            if (cleanedChild) {
                                newNode.appendChild(cleanedChild)
                            }
                        })

                        return newNode
                    }

                    // For formatting tags (bold, italic, etc.), just return their text content
                    // This will remove the formatting but keep the text
                    const newNode = document.createDocumentFragment()
                    Array.from(node.childNodes).forEach(child => {
                        const cleanedChild = cleanNode(child)
                        if (cleanedChild) {
                            newNode.appendChild(cleanedChild)
                        }
                    })
                    return newNode
                }

                return null
            }

            // Clean the content
            const cleanedContent = cleanNode(tempDiv)

            // Get the cleaned HTML
            const cleanHTML = cleanedContent.innerHTML || tempDiv.innerHTML

            // Set cleaned content back to editor
            editorInstance.setData(cleanHTML)

            // Update form value
            form.setValue(name, cleanHTML, { shouldValidate: true, shouldDirty: true })
        }
    }


    return (
        <FormGroup>
            <div className="d-flex justify-content-between align-items-center">
                { label && <Label>{label}</Label> }

                {/* Add Clear Format Button */}
                <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                    <Button
                        size="sm"
                        color="outline-secondary"
                        onClick={handleClearFormat}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                        Clear Format
                    </Button>
                </div>
            </div>
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
                                    setEditorInstance(editor)
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