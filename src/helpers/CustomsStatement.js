import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (customStatment) => {
    const name = customStatment.name
    const date = customStatment.date
    const amount = (Number.parseFloat(customStatment.amount || 0))
    const invoice = customStatment.invoice
    const invoice_2_percent = customStatment.invoice_2_percent
    const notes = customStatment.notes
    return {
        custom_statment: name,
        custom_statment_date: date,
        custom_statment_amount: amount.toFixed(2),
        custom_statment_invoice: invoice,
        custom_statment_invoice_2_percent: invoice_2_percent,
        custom_statment_notes: notes
    }
}

export const CustomsStatementToExcel = (customStatments, name) => {
    jsonToExcel(customStatments.map(e => {
        const {
            name,
            date,
            amount,
            invoice,
            invoice_2_percent,
            notes
        } = calcFinancial(e)
        return {
            Name : e.name,
            Date: moment(e.date).format('DD/MM/Y'),
            Amount :e.amount,
            Invoice : e.invoice,
            Invoice_2_percent : e.invoice_2_percent,
            Notes : e.notes
        }
    }), name || 'customStatments-report')
}