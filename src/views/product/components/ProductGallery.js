import { Swiper, SwiperSlide } from 'swiper/react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'
import Uppy from '@uppy/core'

export default ({ isRtl, gallery }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Gallery</CardTitle>
      </CardHeader>
      <CardBody>
        {/*<Swiper>*/}
        {/*    {*/}
        {/*        gallery.map(e => (*/}
        {/*            <SwiperSlide dir={isRtl ? 'rtl' : 'ltr'}>*/}
        {/*                <img src={e.url } alt='swiper 1' className='img-fluid' />*/}
        {/*            </SwiperSlide>*/}
        {/*        ))*/}
        {/*    }*/}
        {/*</Swiper>*/}
      </CardBody>
    </Card>
  )
}
