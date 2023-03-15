// ** States
import { useState } from 'react'
import { Input, Label } from 'reactstrap'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const DatatableSearch = ({ handleFilter, initialSearchValue }) => {

    const [searchValue, setSearchValue] = useState(initialSearchValue || '')
    const [timer, setTimer] = useState()

    const onChange = (e) => {
        // if (timer) clearTimeout(timer)
        setSearchValue(e.target.value)
        // setTimer(
        //     setTimeout(() => {
        //         handleFilter(e.target.value)
        //     }, 1000)
        // )
    }

    const onBlur = (e) => {
        handleFilter(e.target.value)
    }
    
    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFilter(e.target.value)
        }
    }

    return (
        <>
            <Label className='mr-1' for='search-input'>
                Search
            </Label>
            <Input
                className='dataTable-filter mr-50'
                type='text'
                id='search-input'
                value={searchValue}
                onChange={onChange}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
            />
        </>
    )
}

export default DatatableSearch