import { Eye } from 'react-feather'
import { Link } from 'react-router-dom'

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        <Link to={`/reports/product-purchases/${row.product_id}`}>
            <Eye size={17} className='mx-1' />
        </Link>
    </div>
)