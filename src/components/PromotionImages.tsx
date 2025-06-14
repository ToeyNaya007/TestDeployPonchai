import React from 'react'
import PromotionImageSlider from './PromotionImageSlider'
import PromotionImages2Mini from './PromotionImages2Mini'

const PromotionImages = () => {
  return (
    <div className='flex pt-2'>
         <PromotionImageSlider />
         <PromotionImages2Mini />
    </div>
  )
}

export default PromotionImages