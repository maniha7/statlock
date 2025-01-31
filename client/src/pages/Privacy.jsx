import globals from '../globals';
const gColors = globals.globalColors

import { Link } from "react-router-dom";


const Privacy = () => {
    return(
        <>
        <div className="flex justify-center " style={{width:'100%'}}>
            <div className={` border-b-4 border-l-2 border-r-1 rounded-lg p-4 ${gColors.stoneBackgroundGradient}`}>
                <div className="ml-5 mr-5">
                <h1 className="text-white text-3xl underline mb-5 text-center font-bold">Privacy Policy</h1>

                   <h2 className="text-white text-xl underline mb-5 font-bold">1. Introduction</h2> 
                        <p className="text-md text-white">
                            Welcome to StatLock ("we," "our," or "us"). This Privacy Policy describes how we collect, use, and share information when you use our third-party, unaffiliated, website to track in-game statistics for Deadlock by Valve.
                        </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">2. Information We Collect</h2>
                    <p className="text-md text-white space-y-2">
                        We collect the following types of information:

                        <li className="mt-2 ml-5 text-sm">
                        <div className="font-bold">User-Provided Data:</div> When you register or link your game account, we may collect your Steam ID, username, and related profile data.
                        </li>

                        <li className="ml-5 text-sm">
                        <div className="font-bold">Game Data:</div> We track in-game statistics, including match history, performance metrics, rankings, and other publicly available game-related data.
                        </li>

                        <li className="ml-5 text-sm">
                        <div className="font-bold">Technical Data:</div> We collect IP addresses, browser type, operating system, and cookies to improve our website functionality and security.
                        </li>
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">3. How We Use Your Information</h2>
                    <p className="text-md text-white space-y-2">
                        We use the collected data to:

                        <li className="mt-2 ml-5 text-sm">
                        Provide personalized in-game statistics and analytics.
                        </li>

                        <li className="mt-2 ml-5 text-sm">
                        Improve our website and services.
                        </li>
                    </p>


                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">4. How We Share Your Information</h2>
                    <p className="text-md text-white space-y-2">
                        We do not sell your personal information. However, we may share data in the following ways:

                        <li className="ml-5 text-sm">
                            <div className="font-bold">Public Profiles:</div>Some in-game statistics may be displayed publicly if they are part of your profile.
                        </li>

                        <li className="ml-5 text-sm">
                            <div className="font-bold">Third-Party Services:</div>We may use analytics providers (e.g., Google Analytics) to enhance our website.
                        </li>

                        <li className="ml-5 text-sm">
                            <div className="font-bold">Legal Requirements:</div>We may disclose information if required by law or to protect our rights.
                        </li>
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">5. Data Security</h2>
                    <p className="text-md text-white space-y-2">
                        We implement security measures to protect your data, but no system is entirely secure. Users should take precautions to protect their accounts.
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">6. Your Choices and Rights</h2>

                    <p className="text-md text-white space-y-2">
                        <li className="ml-5 text-sm">You may update or request deletion of your account information.</li>
                        <li className="ml-5 text-sm">You can disable cookies through your browser settings.</li>
                        <li className="ml-5 text-sm">You may opt out of certain tracking features by adjusting your preferences.</li>
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">7. Third-Party Links</h2>
                    <p className="text-md text-white space-y-2">
                        Our website may link to third-party websites, including Valve’s services. We are not responsible for their privacy policies or practices.
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">8. Changes to This Privacy Policy</h2>
                    <p className="text-md text-white space-y-2">
                        We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date
                    </p>

                <h2 className="text-white text-xl underline mb-5 mt-5 font-bold">9. Contact Us</h2>
                    <p className="text-md text-white space-y-2 mb-5">
                        If you have any questions or concerns, contact us <Link className="underline hover:opacity-80" to="/contact">here</Link>.
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}




export default Privacy