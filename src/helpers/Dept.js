import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (dept) => {
    const name = dept.name
    const date = dept.date
    const amount = (Number.parseFloat(dept.amount || 0))
    const paid = dept.paid === 1 ? 'Paid' : 'Not Paid'
    const notes = dept.notes
    return {
        dept: name,
        dept_notes: notes,
        dept_amount: amount.toFixed(2),
        dept_date: date,
        dept_paid: paid
    }
}

export const deptsToExcel = (depts, name) => {
    jsonToExcel(depts.map(e => {
        const {
            name,
            amount,
            date,
            paid,
            notes
        } = calcFinancial(e)
        return {
            Name : e.name,
            Note : e.notes,
            Date: moment(e.date).format('DD/MM/Y'),
            Amount :e.amount,
            Paid :e.paid
        }
    }), name || 'depts-report')
}