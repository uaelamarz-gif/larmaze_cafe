import React from 'react'
import { TiStarFullOutline } from "react-icons/ti";
const PopularTag = ({prop}) => {
  return (
    <div className={`bg-orange-100 rounded-lg text-orange-400 flex gap-1 py-1 px-2 content-fit items-center ${prop}`}>
        <TiStarFullOutline />
        <p className='text-xs font-secondary text-orange-400 font-bold'>Popular</p>
    </div>
  )
}

export default PopularTag
