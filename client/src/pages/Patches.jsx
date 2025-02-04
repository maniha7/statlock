import { useEffect, useState } from "react"
import { getPatchNotes } from '../Util/ApiUtil'
import globals from '../globals';
const gColors = globals.globalColors


export default function Patches() {
    const [ patchNotes, setPatchNotes ] = useState([]);

    useEffect(() => {
        fetchPatchNotes();
    }, []);

    async function fetchPatchNotes() {
        const notes = await getPatchNotes();
        setPatchNotes(Object.values(notes));
    }

    {/* Image and Link Filter */}
    function cleanHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
    
       
        doc.querySelectorAll("img").forEach(img => img.remove());
    
        
        doc.querySelectorAll("a").forEach(a => {
            const textNode = document.createTextNode(a.textContent);
            a.replaceWith(textNode);
        });
    
        return doc.body.innerHTML;
    }

    return (
    <>
        <div className={`flex-1 flex flex-col mt-2 mb-2 ml-5 mr-10 p-2 border-b-4 border-l-2 border-r-1 border-black border-black rounded-lg text-center min-h-200 w-400 ${gColors.stoneBackgroundGradient}`}>
            <h1 className="text-5xl font-bold mt-10 text-stone-200 forevs2 underline">Patch Notes</h1>
                <div className="mt-5">
                <ul>
                    {patchNotes.map((note, index) => (
                        <li key={index}>
                            <h3 className="font-">{note.title}</h3>
                            <p className="patch-description" dangerouslySetInnerHTML={{__html:cleanHTML(note.content_encoded)}} />
                        </li>
                    ))} 
                </ul>


            </div>
            
        </div>

        {/*AdSpace*/}
        <div className={`mt-2 mb-2 border-b-4 border-r-1 rounded-lg mr-5 w-[15%] ${gColors.stoneBackgroundGradient2}`}>
            AdSpace
         </div>
    </>
    )
}