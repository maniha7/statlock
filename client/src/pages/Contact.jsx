import globals from '../globals';
const gColors = globals.globalColors

import { Link } from "react-router-dom";

const Contact = () => {
    return(
        <>
        <div className="flex justify-center" style={{width:'100%'}}> 
            <div className={`flex border-b-4 border-l-2 border-r-1 rounded-lg self-center p-4 ${gColors.stoneBackgroundGradient}`}> 
                <div className="p-2 text-center" >
                    <h1 className="text-3xl text-white underline font-bold">ᴄᴏɴᴛᴀᴄᴛ ᴜꜱ</h1>
              <form action="#" method="POST" className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 ">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="given-name"
                      placeholder="name"
                      className="peer bg-inherit w-full border-b py-1 px-4 text-white placeholder-transparent shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                    />
                    <label htmlFor="name" className="absolute left-0 -top-3.5 text-white text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                    ɴᴀᴍᴇ
                  </label>
                  </div>
                <div className="">
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      placeholder="email"
                      className="peer bg-inherit w-full border-b py-1 px-4 text-white placeholder-transparent shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                    />
                    <label for="email" className="absolute left-0 -top-3.5 text-white text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                    ᴇᴍᴀɪʟ
                  </label>
                  </div>
                </div>
                  <div className="relative flex justify-center col-span-2">
                    <input
                      type="text"
                      name="subject"
                      placeholder="subject"
                      id="subject"
                      className="peer bg-inherit w-full border-b py-1 px-4 text-white placeholder-transparent  shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                    />
                    <label htmlFor="subject" className="absolute  left-0 -top-3.5 text-white text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                    ꜱᴜʙᴊᴇᴄᴛ
                  </label>
                  </div>
                <div className="sm:col-span-2">
                  <div className="flex justify-between">
                    <label htmlFor="message" className="block bold text-md text-white">
                     ᴍᴇꜱꜱᴀɢᴇ
                    </label>
                  </div>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className={`bg-inherit text-sm block w-full h-flex border-white py-3 px-4 text-white shadow-sm focus:outline-none focus:ring-0 border-b-2 border-l-1`}
                      aria-describedby="message-max"
                      defaultValue={''}
                      style={{}}
                    />
                  </div>
                </div>
                <div className=" text-white flex justify-center col-span-2">
                  <button
                    type="submit"
                    onClick="Submited!"
                    className="hover:opacity-80 hover:underline hover:cursor-pointer text-xl mb-5"
                  >
                    ꜱᴜʙᴍɪᴛ
                  </button>
                </div>
              </form>
            </div>
            </div>
            </div>
        
        </>
    )
}




export default Contact