import globals from '../globals';
import { useState, useEffect } from 'react';
import Matches from "../Components/ProfileComponents/Matches";

const gColors = globals.globalColors;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [activeSection, setActiveSection] = useState('PROFILE'); 

    // Fetch the logged-in user's Steam profile data
    useEffect(() => {
        fetch("http://localhost:5000/auth/user", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.steamid) {
                setUser(data);
                setAccountId(data.steamid); // Set SteamID
            }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }, []);

    return (
        <section className={`border-b-4 border-x-2 border-t-1 border-stone-700 rounded-lg mx-5 my-10 min-h-200 flex flex-col md:flex-row lg:flex-row xl:flex-row overflow-hidden ${gColors.stoneBackgroundGradient2}`} style={{width: "100%"}}>
            
            <section className="">

                {/* Navigation */}
                <div className="flex flex-row h-6 ml-2 mt-2">
                    {['PROFILE', 'SHOWCASE', 'STATS', 'SETTINGS'].map((section) => (
                        <button
                            key={section}
                            className={`border-t-2 border-x-1 border-b-1 rounded-t-lg px-1.5 forevs2 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:cursor-pointer 
                                ${activeSection === section ? 'bg-stone-600 text-stone-200 border-stone-400' : 'bg-stone-700 text-stone-300 border-stone-500'}`}
                            onClick={() => setActiveSection(section)}
                        >
                            {section}
                        </button>
                    ))}
                </div>

                {/* Profile Header Overlay */}
                <section className={`border-b-4 border-x-2 border-t-1 border-stone-700 rounded-x-md rounded-b-md min-w-75 max-w-100 mx-2 ${gColors.stoneBackgroundGradient}`}>
                    <div className="flex flex-wrap">
                        <img 
                            className="w-30 h-flex rounded-lg border-b-4 border-x-2 border-t-1 border-stone-800 m-2" 
                            src={user?.avatarfull || ""} 
                            alt="Profile Pic" 
                        />
                        <h1 className="mx-2 font-bold text-xl text-stone-300 forevs2 mt-5">
                            {user?.displayName || ""}
                        </h1>
                    </div>
                </section>

                {/* Career Stats */}
                <section className={`border-b-4 border-x-2 border-t-1 border-stone-700 rounded-md min-w-75 max-w-200 mx-2 my-5 min-h-40 ${gColors.stoneBackgroundGradient}`}>
                    <div className="mx-2 space-y-5">
                        <h1 className="text-center text-xl forevs2 mt-1 text-stone-300 underline">Career Stats</h1>
                        <div>Row1</div>
                        <div>Row2</div>
                        <div>Row3</div>
                        <div>Row4</div>
                        <div>Row5</div>
                        <div>Row6</div>
                    </div>
                </section>

            </section>

            {/* Content Section */}
            <section 
                className={`m-10 text-stone-300 border-b-4 border-x-2 border-t-1 rounded-md border-stone-700 bg-stone-800`}
                style={{
                    width: "100%",
                    maxHeight: "700px", 
                    overflowY: "auto",
                    padding: "0.5rem" 
                }}
            >
                {/* Profile Section */}
                {activeSection === 'PROFILE' &&  accountId &&
                    <section>
                        <div className="m-5">
                            <Matches accountId={accountId} />
                        </div>
                    </section>
                }

                {activeSection === 'SHOWCASE' && <section>Showcase Content Here</section>}
                {activeSection === 'STATS' && <section>Stats Content Here</section>}
                {activeSection === 'SETTINGS' && <section>Settings Content Here</section>}
            </section>
        </section>
    );
};

export default Profile;