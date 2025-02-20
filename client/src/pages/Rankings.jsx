import { useEffect, useState } from "react";
import { getLeaderboard } from "../Util/ApiUtil";
import globals from '../globals';
import steamDefault from '../assets/steamDefault.png'

const gColors = globals.globalColors;

const BACKEND_URL = "http://localhost:5000"; // Update if backend is hosted remotely

const regionMap = {
    "North America": "NAmerica",
    "Europe": "Europe",
    "Southeast Asia": "SEAsia",
    "South America": "SAmerica",
    "Russia": "Russia",
    "Oceania": "Oceania",
    "All Regions": "Row"
};

const Rankings = () => {
    const [region, setRegion] = useState("Row"); 
    const [leaderboard, setLeaderboard] = useState([]);
    const [page, setPage] = useState(1); 
    const [hasNextPage, setHasNextPage] = useState(true); 
    const [steamProfiles, setSteamProfiles] = useState({});
    const limit = 25; 

    useEffect(() => {
        async function loadLeaderboard() {
            console.log(`Loading leaderboard for region: ${region}, Page: ${page}`);
            try {
                const data = await getLeaderboard(region, (page - 1) * limit + 1, limit);
                const entries = Object.values(data);
                setLeaderboard(entries); 

                setHasNextPage(entries.length === limit);

                // Extract Deadlock `account_id` and fetch Steam profiles
                const steamIds = entries.map(player => player.account_id).join(",");
                if (steamIds) {
                    fetchSteamProfiles(steamIds);
                }

                console.log(`Leaderboard updated for ${region}, Page: ${page}, Entries: ${entries.length}`);
            } catch (error) {
                console.error(`Error loading rankings for ${region}, Page: ${page}:`, error);
            }
        }

        loadLeaderboard();
    }, [region, page]);

    async function fetchSteamProfiles(steamIds) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/steam-profiles?steamIds=${steamIds}`);
            const data = await response.json();
            console.log("Fetched Steam Profiles:", data);
            setSteamProfiles(data);
        } catch (error) {
            console.error("Error fetching Steam profiles:", error);
        }
    }

    return (
        <div className="flex justify-center mb-50 mt-10 mx-5" style={{ width: "100%" }}>
            <div className={`flex border-x-2 border-b-4 border-t-1 border-stone-600 rounded-lg self-center p-4 mb-15 ${gColors.stoneBackgroundGradient}`}>
                <div className={`p-2 text-center min-w-100 min-h-150`}>
                    <h1 className="text-3xl underline font-bold border-stone-200 text-stone-200 forevs2">ʀᴀɴᴋɪɴɢꜱ</h1>

                    {/* Region Selector */}
                    <div className={`flex justify-center space-x-5 my-4`}>
                        {Object.entries(regionMap).map(([label, apiValue]) => (
                            <button 
                                key={apiValue} 
                                className={`border-x-2 border-b-4 border-t-1 border-stone-500 rounded-b-md rounded-t-lg px-2 bg-stone-800 text-stone-200 forevs2 pt-1 
                                    transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:cursor-pointer ${
                                    region === apiValue ? "bg-stone-700 text-stone-200" : ""
                                }`}
                                onClick={() => {
                                    console.log(`Switching to region: ${apiValue}`);
                                    setRegion(apiValue);
                                    setPage(1); 
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Table */}
                    <section className="p-4 bg-stone-900 border-x-2 border-b-4 border-t-1 border-stone-600 rounded-b-lg rounded-t-sm">
                    <table className="min-w-full border border-stone-600 text-stone-200 bg-stone-800">
                        <thead>
                            <tr className="bg-stone-700">
                                <th className="px-4 py-1.5 forevs2 text-md underline">Rank</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Player</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Matches Played</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Wins</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Kills</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Deaths</th>
                                <th className="px-4 py-1.5 forevs2 text-md underline">Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length > 0 ? (
                                leaderboard.map((player, index) => {
                                    const steamProfile = steamProfiles[player.account_id] || {};
                                    
                                     // console.log("Steam Profiles State:", steamProfiles); // Shows all Steam Profiles

                                    return (
                                        <tr key={index} className="border-b border-stone-600">
                                            <td className="px-4 py-2">{player.leaderboard_rank}</td>
                                            <td className="px-4 py-2 flex items-center">
                                                <img 
                                                    src={steamProfile.avatar || steamDefault} 
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <div>{steamProfile.name || "Private Profile"}</div>
                                            </td>
                                            <td className="px-4 py-2">{player.matches_played}</td>
                                            <td className="px-4 py-2">{player.wins}</td>
                                            <td className="px-4 py-2">{player.kills}</td>
                                            <td className="px-4 py-2">{player.deaths}</td>
                                            <td className="px-4 py-2">{player.assists}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-2 text-center text-stone-400">
                                        No data available for this region.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </section>

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-5">
                        <button 
                            className={`text-indigo-400 hover:underline forevs2 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`} 
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="text-stone-200 forevs2">Page {page}</span>
                        <button 
                            className={`text-indigo-400 hover:underline forevs2 ${!hasNextPage ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`} 
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={!hasNextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rankings;