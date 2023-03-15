import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import moment from "moment"

export function jsonToExcel(data, fileName, appendDateToName = false) {
    if (appendDateToName) {
        fileName = `${fileName}-${moment().format('Y-MM-DD')}`
    }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(blob, fileName + fileExtension)
}

