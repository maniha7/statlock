import globals from '../globals';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const gColors = globals.globalColors;

const Skins = () => {
    const [mods, setMods] = useState([]);

    useEffect(() => {
        fetch('/assets/mods/saveModInfo.json')
            .then(response => response.json())
            .then(data => setMods(data))
            .catch(error => console.error('Error fetching mods:', error));
    }, []);

    return (
        <>
            <section className={`self-center border-l-2 border-b-4 border-r-1 border-t-1 rounded-lg mx-10 min-h-210 ${gColors.stoneBackgroundGradient}`} style={{ width: "100%" }}>
                <div className="flex justify-center items-center p-5">
                    <button className="text-indigo-400 font-bold py-2 px-4 border-x-2 border-y-4 bg-stone-800 rounded-lg border-black hover:cursor-pointer hover:opacity-80">
                        <Link to="/modupload">
                            ᴜᴘʟᴏᴀᴅ ᴀ ꜱᴋɪɴ
                        </Link>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
                    {mods.length > 0 ? mods.map((mod, index) => (
                        <div key={index} className={`border-4 rounded-lg border-black text-center p-4 ${gColors.stoneBackgroundGradient2}`}>
                            <div className="h-40 bg-stone-500 rounded mb-4">
                                <img src={`/assets/mods/${mod.fileName}`} alt={mod.title} className="h-full w-full object-cover rounded" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">{mod.title}</h2>
                            <p className="text-gray-400">By {mod.description}</p>
                            <button className="mt-4 bg-indigo-700 hover:bg-indigo-400 text-white font-bold py-1 px-3 rounded hover:cursor-pointer">
                                <a href={`/assets/mods/${mod.fileName}`} download>Download</a>
                            </button>
                        </div>
                    )) : (
                        <p className="text-white text-center col-span-full">No mods uploaded yet. Be the first to upload!</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Skins;