import globals from '../globals';
const gColors = globals.globalColors;





const Install = () => {
    return(
        <section className="flex flex-col justify-center mb-50 mt-10 mx-5" style={{ width: "100%" }}>
            <div className={`flex border-x-2 border-b-4 border-t-1 border-stone-600 rounded-lg self-center p-4 mb-15 ${gColors.stoneBackgroundGradient}`}>
                <div className={`p-2 min-w-100 min-h-150 `}>
                    <h1 className="forevs2 text-3xl text-stone-200 underline mb-5 text-center">Mod Installation Guide</h1>
                        <p className="text-stone-200">
                            {/* StatLock Guide Video Embed Here */}
                        </p>
                </div>
            </div>
        </section>  
    )
}


export default Install