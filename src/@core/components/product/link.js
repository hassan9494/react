// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Proptypes from 'prop-types'
import classnames from 'classnames'
import { ChevronUp } from 'react-feather'
import { Collapse, Card, CardHeader, CardBody, CardTitle } from 'reactstrap'

const ProductLink = props => {
  // ** Props
  const { data } = props
    return (
      <a className='text-dark' href={`${process.env.REACT_APP_WEBSITE}/product/${data.sku}`} target='_blank'>{ data.name }</a>
    )
}

export default ProductLink

// ** PropTypes
ProductLink.propTypes = {
  data: Proptypes.any.isRequired
}
