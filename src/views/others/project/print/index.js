import { useEffect } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useModel } from '@data/use-project'
import Project from '@components/project/project'

const Print = () => {

    const {id} = useParams()
    const {
        data: model
    } = useModel(id)

    useEffect(() => {
        if (model) {
            setTimeout(() => {
                window.print()
            }, 200)
        }
    }, [model])

    // if (!order) return <></>

    return (
        <Project project={model} />
    )
}

export default Print
