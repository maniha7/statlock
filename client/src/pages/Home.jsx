import globals from '../globals';
import logo from '../assets/statlock_logo2.png'
import patchData from '../assets/patch_notes.json';

const gColors = globals.globalColors

const categoryColors = {
    "Character Patches": "text-[#f0dfbf]",      
    "Weapon Item Patches": "text-[#d08d3e]", 
    "Vitality Item Patches": "text-[#74b01c]", 
    "Spirit Item Patches": "text-[#c288f0]",
    "General Updates": "text-[#f0dfbf]",         
};

import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
    const [latestPatch, setLatestPatch] = useState(null);

    useEffect(() => {
        const latest = patchData.find(patch => patch.latest);
        setLatestPatch(latest);
    }, []);


    return (
    <>
        <div className={`flex-1 flex flex-col mt-2 mb-2 ml-5 mr-10 p-2 border-b-4 border-l-1 border-r-1 border-stone-600 rounded-lg  min-h-200 w-400 ${gColors.stoneBackgroundGradient}`} style={{}}> 
            <div className="flex justify-center mt-1 mb-5"><img className="object-center w-40 transition spin-slow duration-1 ease-in-out hover:-translate-y-0.5 hover:scale-110" src={logo} /></div>
            {/*Main*/}
            <div className="mb-10 border-b-4 border-x-2 border-t-2 bg-stone-900 rounded-lg w-[80%] self-center text-stone-500">

                {/*Steam Profile Search Bar*/}
                <div className="flex flex-row">
                    <MagnifyingGlassCircleIcon class="h-8 w-8 text-stone-400 mx-2 my-0.5" />
                    <input 
                    type="search"
                    placeholder="Search for Player Profile via SteamURL"
                    className="peer bg-inherit w-full text-white mx-0.5 focus:outline-none focus:ring-0 text-sm font-bold"
                    /> 
                </div>
            </div>

            {/*Preview of Site Functionality*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 ml-5 mr-5 gap-y-10 gap-x-2"> 
                
                {/* Most Recent Patch Notes */}
                <div className="w-flex self-center justify-center rounded-lg text-stone-500 bg-stone-800 p-4 border-1 border-stone-900">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold text-center mb-5">ʟᴀᴛᴇꜱᴛ ᴘᴀᴛᴄʜ ᴘʀᴇᴠɪᴇᴡ</h2>
                    {latestPatch ? (
                        <div className="text-stone-200 mt-2">
                            <h3 className="text-2xl font-bold mx-2 forevs2">{latestPatch.title}</h3>
                                <Link to="./patchnotes" className="text-indigo-400 underline font-bold text-sm flex mx-2 mb-3 hover:opacity-80">
                                    View Full Patch Notes
                                </Link>
                                    
                                <div className="border-t-4 border-b-2 border-stone-600 bg-stone-800 py-3">
                                    
                                    {/* Display Preview: First 3 Updates */}
                                    {Object.entries(latestPatch.categories).map(([category, lines]) => (
                                        lines.length > 0 && (
                                            <div key={category} className="mt-3">
                                                <h4 className={`text-xl font-bold forevs2 ${categoryColors[category] || "text-white"}`}>{category}:</h4>
                                                <ul className="ml-2 text-stone-300 text-sm">
                                                    {lines.slice(0, 2).map((line, idx) => (
                                                        <li key={idx}>{line}...</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    ))}
                                </div>
                        </div>
                    ) : (
                        <div className="text-stone-400">error</div>
                    )}
                </div>

                {/*Item Builder*/}
                <div className="w-flex justify-center rounded-lg text-stone-500 bg-stone-800 p-4 border-1 border-stone-900">
                    <h2 className="text-2xl text-stone-200 underline font-bold text-center mb-5">ɪᴛᴇᴍ ʙᴜɪʟᴅᴇʀ</h2>
                        <div className="text-stone-200 mt-5 text-center forevs text-lg"></div>
                </div>

                {/*Undecided*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ᴛɪᴛʟᴇ</h2>
                        <div className="text-stone-200"></div>
                </div>

                {/*Undecided*/}
                <div className="w-flex min-h-50 self-center text-center grid grid-rows-2 justify-center rounded-lg text-stone-500">
                    <h2 className="h-[50%] text-2xl text-stone-200 underline font-bold">ᴛɪᴛʟᴇ</h2>
                        <div className="text-stone-200"></div>
                </div>
                
            </div>
         </div>

        {/*Right Side AdSpace*/}
         <div className={`mt-2 mb-2 border-b-4 border-l-2 border-r-1 border-stone-600 rounded-lg mr-5 w-[15%] ${gColors.stoneBackgroundGradient2}`}>
            AdSpace
         </div>
    </>
        
    )
}


export default Home