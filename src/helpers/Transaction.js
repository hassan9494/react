import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const transactionsToExcel = (orders, name) => {
    jsonToExcel(orders.map(e => {

        return {
            Number: e.id,
            'Transaction Id': e.transaction_id,
            Note: e.note,
            Type: e.type,
            Amount: e.amount,
            Commission: e.commission,
            Shipping: e.shipping,
            'Total Amount': e.type === 'deposit' ? e.total_amount : e.total_amount * -1,
            'Order Id': e.order_id,
            'Payment Method': e.paymentMethod,
            date: moment(e.created_at).format('DD/MM/Y')
        }
    }), name || 'transactions-report')
}