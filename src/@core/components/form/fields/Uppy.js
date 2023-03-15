import React from 'react'
import { Dashboard } from '@uppy/react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

export default function Uploader () {
    const uppy = React.useMemo(() => {
        return new Uppy()
            .use(XHRUpload, {
                endpoint: process.env.REACT_APP_ADMIN_API_UPLOAD
            })
    }, [])
    React.useEffect(() => {
        return () => uppy.close()
    }, [])

    return (
        <Dashboard
            uppy={uppy}
            plugins={['Webcam']}
        />
    )
}