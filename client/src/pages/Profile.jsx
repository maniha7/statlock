import globals from '../globals';
import testPFP from '../assets/luffy.jpg'

const gColors = globals.globalColors




    const Profile = () => {
        return (
            <section className={`border-b-4 border-x-2 border-t-1 border-stone-700 rounded-lg mx-5 my-10 min-h-150 ${gColors.stoneBackgroundGradient2}`} style={{width: "100%"}}>
                <div className="">
                <div className="flex flex-row h-6 ml-10">
                    <button className="border-t-2 border-x-1 rounded-sm px-2 border-stone-700 forevs2 bg-stone-600">PROFILE</button>
                    <button className="border-t-2 border-x-1 rounded-sm px-2 border-stone-700 forevs2 bg-stone-600">SHOWCASE</button>
                    <button className="border-t-2 border-x-1 rounded-sm px-2 border-stone-700 forevs2 bg-stone-600">STATS</button>
                    <button className="border-t-2 border-x-1 rounded-sm px-2 border-stone-700 forevs2 bg-stone-600">SETTINGS</button>
                </div>
                    {/* Profile Header */}
                    <div className={`border-b-4 border-x-2 border-t-1 border-stone-700 rounded-md min-w-75 max-w-100 mx-2 ${gColors.stoneBackgroundGradient}`}>
                        <div className="flex flex-wrap">

                            {/* Insert Steam API Profile Icon Here */}
                            <img className="w-30 h-flex rounded-lg border-b-4 border-x-2 border-t-1 border-stone-800 m-2" src={[testPFP]} />

                            {/* Insert Steam API Profile Name */}
                            <h1 className="mt-5 mx-2 font-bold text-xl text-stone-300 forevs2">Profile Name</h1>
                            
                        </div>
                    </div>

                    <div>

                    </div>

                </div>
            </section>
        )
    }


    export default Profile 