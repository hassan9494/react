import { Alert } from 'reactstrap'

export default function ({ errors }) {
    if (!errors) return <></>
    return (
        <Alert color='danger'>
            { Object.keys(errors).map(e => <div className='alert-body'>{errors[e][0]}</div>) }
        </Alert>
    )
}
