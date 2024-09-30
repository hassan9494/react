import {
    Button,
    FormGroup,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Table
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { PlusCircle, Trash } from 'react-feather'
import { useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { confirm } from '@components/sweetalert'
import NumberInput from '@components/number-input'
import { api } from '@data/use-product'

export default function RelatedProduct ({ disabled, form }) {

    const handleChanges = (products, id, event, update) => {
        if (disabled) return
        const updated = products.map(product => {
            if (product.id === id) product[event.name] = event.value
            return product
        })
        update(updated)
    }

    const handleDelete = (products, id, update) => {
        if (disabled) return
        const updated = products.filter(e => e.id !== id).map(e => e)
        confirm(() => {
            update(updated)
        })
    }

    const handleNewProduct = (products, product, update) => {
        if (disabled) return
        products = products ?? []
        product.quantity = 1
        const exists = products?.some(e => e.id === product.id)
        if (!exists) {
            update([...products, product])
        }
    }

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th>Product</th>
                <th width={'15%'} className="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <Controller
                control={form.control}
                defaultValue={null}
                name="related"
                render={
                    ({ onChange, value, name, ref }) => {
                        return (
                            <>
                                {
                                    (value || []).map(
                                        e => (
                                            <tr key={e.id}>
                                                <td>
                                                    <img className='mr-75' src={e.image} alt='angular' height='60' width='60' />
                                                    <span className='align-middle font-weight-bold'>{ e.name }</span>
                                                </td>

                                                <td className="text-center">
                                                    <Trash
                                                        className='cursor-pointer'
                                                        size={20}
                                                        onClick={() => handleDelete(value, e.id, onChange)}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )
                                }
                                <tr>
                                    <td></td>
                                    <td className="text-center p-2">
                                        <AddProductForm  products={[]} onSubmit={product => handleNewProduct(value, product, onChange)}/>
                                    </td>
                                </tr>
                            </>
                        )
                    }
                }
            />
            </tbody>
        </Table>
    )

}
function AddProductForm({ products, onSubmit }) {
    const [formModal, setFormModal] = useState(false)
    const [data, setData] = useState(null)

    const onChange = (value, { action, removedValue }) => {
        setData(value?.item)
    }

    const handleSubmit = () => {
        if (onSubmit && data) onSubmit(data)
        // setFormModal(false)
    }

    const renderItem = ({ id, name, image, price, quantity }) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="avatar mr-50" width="32" height="32">
                <img src={image} height="32" width="32" />
            </div>
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ name }</h6><small
                className="text-truncate text-muted mb-0">Available Quantity: { quantity }</small>
            </div>
        </div>
    )

    const promiseOptions = async inputValue => {
        const data = await api.autocomplete(inputValue)
        return data.map(({ id, name, image, price, quantity, min_price, normal_price }) => {
            return {
                label: renderItem({ id, name, image, price, quantity }),
                value: id,
                item: { id, name, image, quantity, price, min_price, normal_price }
            }
        })
    }

    return (
        <>
            <PlusCircle
                className='cursor-pointer'
                size={22}
                onClick={() => setFormModal(true)}
            />
            <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
                <ModalHeader toggle={() => setFormModal(!formModal)}>Add Product</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <AsyncSelect
                            isClearable={true}
                            className='react-select'
                            classNamePrefix='select'
                            loadOptions={promiseOptions}
                            cacheOptions
                            onChange={onChange}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={handleSubmit}>
                        Save
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    )
}
