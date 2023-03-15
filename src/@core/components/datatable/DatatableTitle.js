import { CardHeader, CardTitle } from 'reactstrap'

export default function DatatableTitle({ title = '' }) {
    return (
        <>
            {
                title &&
                <CardHeader className='py-1'>
                    <CardTitle>{ title }</CardTitle>
                </CardHeader>
            }
        </>
    )
}
