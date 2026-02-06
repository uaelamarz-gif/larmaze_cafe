import React from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'

const SocialBtns = () => {
  return (
                         <div className="social flex justify-end gap-4">
                              <a
                                   href="https://www.facebook.com"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="rounded-md p-2 bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center text-xl text-white"
                              >
                                   <FaFacebook />
                              </a>
                              <a
                                   href="https://www.instagram.com"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="rounded-md p-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-colors flex items-center justify-center text-xl text-white"
                              >
                                   <FaInstagram />
                              </a>
                              <a
                                   href="https://wa.me/1234567890"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="rounded-md p-2 bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-xl text-white"
                              >
                                   <FaWhatsapp />
                              </a>
                              <a
                                   href="https://maps.google.com"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="rounded-md p-2 bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-xl text-white"
                              >
                                   <MdLocationOn />
                              </a>
                         </div>
  )
}

export default SocialBtns
