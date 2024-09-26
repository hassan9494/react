import { CkeEditor } from '@components/form/fields'

export default function ProductDescription({ form }) {

    return (
        <>
            <CkeEditor
                label={'Description'}
                name={'description'}
                // rules={{required: true}}
                form={form}
            />
            <CkeEditor
                label={'Features'}
                name={'features'}
                form={form}
            />
            <CkeEditor
                label={'Code'}
                name={'code'}
                form={form}
            />
            <CkeEditor
                label={'Documents'}
                name={'documents'}
                form={form}
            />
            <CkeEditor
                label={'Product Include'}
                name={'packageInclude'}
                form={form}
            />
        </>
    )
}

