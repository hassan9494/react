import { Button } from 'reactstrap'
import { useState } from 'react'
import { confirm } from '@components/sweetalert'

const OrderToFatora = ({ onMigrate, order }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [xmlModal, setXmlModal] = useState({
        show: false,
        content: ''
    })

    const handleClick = () => {

        confirm(async () => {
            setIsLoading(true)
            try {
                await onMigrate()
            } finally {
                setIsLoading(false)
            }
        })
    }

    return (
        <Button.Ripple
            color={!order?.is_migrated ? 'primary' : 'dark'}
            style={{ marginTop: 100, opacity: !order?.is_migrated ? '1' : '0.5' }}
            block
            onClick={handleClick}
            disabled={isLoading || order?.is_migrated}
        >
            {isLoading ? 'Migrating...' : 'Migration to the billing system'}
        </Button.Ripple>
    )
}

export default OrderToFatora