import { Eye, Trash } from 'react-feather'
import { Link } from 'react-router-dom'


export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {
            row.sales > 0 &&
            <Link to={`/reports/product-sales/${row.id}`}>
                <Eye size={17} className='mx-1' />
            </Link>
        }
    </div>
)