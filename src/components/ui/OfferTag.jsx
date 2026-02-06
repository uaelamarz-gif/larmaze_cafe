import React from 'react'
import { BiSolidOffer } from "react-icons/bi";

const OfferTag = ({prop}) => {
  return (
    <div className={`bg-green-100 rounded-lg text-green-400 flex gap-1 py-1 px-2 content-fit items-center ${prop}`}>
        <BiSolidOffer />
        <p className='text-xs font-secondary text-green-400 font-bold'>Special Offer</p>
    </div>
  )
}

export default OfferTag
