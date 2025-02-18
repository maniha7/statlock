import { useEffect, useState } from "react";
import { getLeaderboard } from "../Util/ApiUtil";
import globals from '../globals';

const gColors = globals.globalColors;

// Mapping for user-friendly button names to API region names
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
    const [region, setRegion] = useState("Row"); // Default to all regions
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        async function loadLeaderboard() {
            console.log(`Loading leaderboard for region: ${region}`);
            try {
                const data = await getLeaderboard(region, 1, 1000);
                setLeaderboard(Object.values(data)); // Convert object to array for display
                console.log(`Leaderboard updated for ${region}, entries: ${Object.keys(data).length}`);
            } catch (error) {
                console.error(`Error loading rankings for ${region}:`, error);
            }
        }

        loadLeaderboard();
    }, [region]); // Runs when region changes

    return (
        <div className="flex justify-center mb-50 mt-20 mx-5" style={{ width: "100%" }}>
            <div className={`flex border-x-2 border-b-4 border-t-1 border-stone-600 rounded-lg self-center p-4 mb-15 ${gColors.stoneBackgroundGradient}`}>
                <div className={`p-2 text-center min-w-100 min-h-150`}>
                    <h1 className="text-3xl underline font-bold border-stone-200 text-stone-200 forevs2">ʀᴀɴᴋɪɴɢꜱ</h1>

                    {/* Region Selector */}
                    <div className="flex justify-center space-x-5 my-4">
                        {Object.entries(regionMap).map(([label, apiValue]) => (
                            <button 
                                key={apiValue} 
                                className={`border-x-2 border-b-4 border-t-1 border-stone-500 rounded-b-md rounded-t-lg px-2 bg-stone-800 text-stone-200 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 ${
                                    region === apiValue ? "bg-stone-700 text-white" : ""
                                }`}
                                onClick={() => {
                                    console.log(`Switching to region: ${apiValue}`);
                                    setRegion(apiValue);
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Table */}
                    <table className="min-w-full border border-stone-600 text-stone-200">
                        <thead>
                            <tr className="bg-stone-700">
                                <th className="px-4 py-2">Rank</th>
                                <th className="px-4 py-2">Player ID</th>
                                <th className="px-4 py-2">Matches Played</th>
                                <th className="px-4 py-2">Wins</th>
                                <th className="px-4 py-2">Kills</th>
                                <th className="px-4 py-2">Deaths</th>
                                <th className="px-4 py-2">Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length > 0 ? (
                                leaderboard.map((player, index) => (
                                    <tr key={index} className="border-b border-stone-600">
                                        <td className="px-4 py-2">{player.leaderboard_rank}</td>
                                        <td className="px-4 py-2">{player.account_id}</td>
                                        <td className="px-4 py-2">{player.matches_played}</td>
                                        <td className="px-4 py-2">{player.wins}</td>
                                        <td className="px-4 py-2">{player.kills}</td>
                                        <td className="px-4 py-2">{player.deaths}</td>
                                        <td className="px-4 py-2">{player.assists}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-2 text-center text-stone-400">
                                        No data available for this region.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Rankings;