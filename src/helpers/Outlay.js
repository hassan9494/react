import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (outlay) => {
    const name = outlay.name
    const sub_type = outlay.sub_type
    const date = outlay.date
    const amount = (Number.parseFloat(outlay.amount || 0))
    const total_amount = (Number.parseFloat(outlay.total_amount || 0))
    const invoice = outlay.invoice
    const tax = outlay.tax
    const notes = outlay.notes
    return {
        outlay: name,
        outlay_sub_type: sub_type,
        outlay_date: date,
        outlay_amount: amount.toFixed(2),
        outlay_total_amount: total_amount.toFixed(2),
        outlay_invoice: invoice,
        outlay_tax: tax,
        outlay_notes: notes
    }
}

export const outlaysToExcel = (outlays, name) => {
    jsonToExcel(outlays.map(e => {
        const {
            name,
            sub_type,
            date,
            amount,
            total_amount,
            invoice,
            tax,
            notes
        } = calcFinancial(e)
        return {
            Name : e.name,
            OutlayType : e.sub_type,
            Date: moment(e.date).format('DD/MM/Y'),
            Amount :e.amount,
            Total :e.total_amount,
            Invoice : e.invoice,
            Tax :e.tax,
            Notes : e.notes
        }
    }), name || 'outlays-report')
}