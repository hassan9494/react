// src\views\product\components\DragDropMedia.js
import { useState, useEffect } from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { Controller } from 'react-hook-form'
import { CardBody, Badge} from 'reactstrap'
import CardAction from '@components/card-actions'
import { ReactSortable } from "react-sortablejs"
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import '@uppy/progress-bar/dist/style.css'

const DragDropMedia = ({ form }) => {
    const [files, setFiles] = useState([])
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null, index: 0 })
    const MAX_IMAGES = 13
    // Initialize Uppy
    const uppy = new Uppy({
        autoProceed: true,
        allowMultipleUploadBatches: false,
        restrictions: {
            maxNumberOfFiles: MAX_IMAGES,
            allowedFileTypes: ['image/*']
        }
    })

    uppy.use(thumbnailGenerator)
    uppy.use(XHRUpload, {
        endpoint: process.env.REACT_APP_ADMIN_API_UPLOAD,
        fieldName: 'media'
    })

    // Update files when form media changes
    useEffect(() => {
        const media = form.getValues('media') || []
        const filteredMedia = media.filter(item => !item?.deleted)
        setFiles(filteredMedia)
    }, [form.watch('media')])

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu({ visible: false, x: 0, y: 0, file: null, index: 0 })
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    uppy.on('thumbnail:generated', (file, preview) => {
        // Thumbnail generated callback
    })

    uppy.on('upload-success', (file, response) => {
        const res = response.body?.data
        if (res) {
            const currentMedia = form.getValues('media') || []

            // Check if we've reached the maximum
            if (currentMedia.filter(item => !item?.deleted).length >= MAX_IMAGES) {
                alert(`Maximum ${MAX_IMAGES} images allowed. Please delete some images before adding new ones.`)
                return
            }
            const newFile = {
                id: file.id,
                url: res.url || res[0]?.url,
                key: res.key || res[0]?.key,
                new: true,
                uploaded: true
            }
            form.setValue('media', [...currentMedia, newFile])
        }
    })

    // Handle drag and drop sorting
    const handleSort = (sortedFiles) => {
        setFiles(sortedFiles)
        form.setValue('media', sortedFiles)
        setContextMenu({ visible: false, x: 0, y: 0, file: null, index: 0 })
    }

    // Remove image - LEFT CLICK
    const handleImageClick = (file, index, e) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this image?")) {
            const currentMedia = form.getValues('media') || []
            const updatedMedia = currentMedia.map(item => {
                if (item.id === file.id) {
                    return {
                        ...item,
                        deleted: true
                    }
                }
                return item
            })

            form.setValue('media', updatedMedia, { shouldValidate: true, shouldDirty: true })
            const filteredMedia = updatedMedia.filter(item => !item?.deleted)
            setFiles(filteredMedia)
        }
    }

    // Show context menu - RIGHT CLICK
    const handleRightClick = (file, index, e) => {
        e.preventDefault()
        e.stopPropagation()

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            file,
            index
        })
    }

    // Set as main image from context menu
    const setAsMain = () => {
        if (!contextMenu.file) return

        const currentMedia = form.getValues('media') || []
        const mediaArray = currentMedia.filter(item => !item?.deleted)

        const mainItemIndex = mediaArray.findIndex(item => item.id === contextMenu.file.id)
        if (mainItemIndex > -1 && mainItemIndex !== 0) {
            const [mainItem] = mediaArray.splice(mainItemIndex, 1)
            const newOrder = [mainItem, ...mediaArray]
            form.setValue('media', newOrder)
        }
        setContextMenu({ visible: false, x: 0, y: 0, file: null, index: 0 })
    }

    const renderMediaPreview = () => {
        if (!files.length) {
            return (
                <div className="text-center py-0">
                    <p className="text-muted">No images uploaded yet.</p>
                </div>
            )
        }

        return (
            <div className="mt-1">
                <ReactSortable
                    list={files}
                    setList={handleSort}
                    className="d-flex flex-wrap gap-1"
                >
                    {files.map((file, index) => (
                        <div key={file.id} className="position-relative">
                            <div
                                className={`media-thumbnail ${index === 0 ? 'main-image' : ''}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    border: index === 0 ? '3px solid #FE5E00' : '2px solid #133595',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    margin:'5px'
                                }}
                                onClick={(e) => handleImageClick(file, index, e)}
                                onContextMenu={(e) => handleRightClick(file, index, e)}
                                title="Left-click to delete | Right-click for menu"
                            >
                                <img
                                    src={file.url || file.original_url}
                                    alt={`Product ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />

                                {index === 0 && (
                                    <Badge
                                        color="success"
                                        className="position-absolute top-0 start-0"
                                        style={{ fontSize: '0.6rem' }}
                                    >
                                        Main
                                    </Badge>
                                )}

                                {/* Delete indicator - always visible */}
                                <div
                                    className="position-absolute top-0 end-0"
                                    style={{
                                        background: 'rgba(220, 53, 69, 0.9)',
                                        color: 'white',
                                        fontSize: '10px',
                                        padding: '1px 4px',
                                        borderBottomLeftRadius: '4px'
                                    }}
                                >
                                    ×
                                </div>

                                {/* Image number */}
                                <div
                                    className="position-absolute bottom-0 start-0"
                                    style={{
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        fontSize: '10px',
                                        padding: '1px 4px',
                                        borderTopRightRadius: '4px'
                                    }}
                                >
                                    {index + 1}
                                </div>
                            </div>

                            {/* Hover effect */}
                            <style>
                                {`
                                    .media-thumbnail:hover {
                                        opacity: 0.8;
                                        transform: scale(1.05);
                                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                                    }
                                `}
                            </style>
                        </div>
                    ))}
                </ReactSortable>

                {/* Context Menu */}
                {contextMenu.visible && (
                    <div
                        className="context-menu"
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            zIndex: 1000,
                            background: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            // minWidth: '150px',
                            padding: '8px 0',
                            width:'fit-content'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="context-menu-item"
                            style={{
                                padding: '2px',
                                fontSize: '10px',
                                cursor: contextMenu.index === 0 ? 'not-allowed' : 'pointer',
                                background: contextMenu.index === 0 ? '#f8f9fa' : 'transparent',
                                color: contextMenu.index === 0 ? '#6c757d' : '#000'
                            }}
                            onClick={contextMenu.index === 0 ? undefined : setAsMain}
                        >
                            ⭐Set Main Image
                        </div>
                        <div
                            className="context-menu-item"
                            style={{
                                padding: '2px',
                                fontSize: '9px',
                                color: '#6c757d',
                                borderTop: '1px solid #eee',
                                marginTop: '4px'
                            }}
                        >
                            Image {contextMenu.index + 1}
                        </div>
                    </div>
                )}

                <div className="mt-0">
                    <small className="text-muted">
                        {files.length} image(s) uploaded.
                    </small>
                </div>
            </div>
        )
    }

    return (
        <CardAction title='Images' actions='collapse' isOpen={false}>
            <CardBody>
                <div className="mb-1">
                    <DragDrop
                        uppy={uppy}
                        locale={{
                            strings: {
                                dropHereOr: 'Drop product images here or %{browse}',
                                browse: 'browse'
                            }
                        }}
                    />
                </div>

                <Controller
                    control={form.control}
                    name={'media'}
                    render={renderMediaPreview}
                />
            </CardBody>
        </CardAction>
    )
}

export default DragDropMedia