import { useState } from "react";
import emailjs from "emailjs-com";
import globals from '../globals';

const gColors = globals.globalColors;

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            "service_3ljnv4b",  // Service ID
            "template_ycpthlm",  //  Template ID
            {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_email: "management@statlock.live", 
            },
            "_8gWc4-FRYw3-RFzf" // Public Key
        )
        .then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
                setSuccessMessage("Message Received!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            },
            (error) => {
                console.log("FAILED...", error);
                setSuccessMessage("Failed to send the message. Please try again.");
            }
        );
    };

    return (
        <div className="flex justify-center mb-50 mt-20 forevs2 mx-5" style={{ width: "100%" }}>
            <div className={`flex border-x-2 border-b-4 border-t-1 border-stone-600 rounded-lg self-center p-4 mb-15 ${gColors.stoneBackgroundGradient}`}>
                <div className="p-2 text-center">
                    <h1 className="text-3xl underline font-bold border-stone-200 text-stone-200">ᴄᴏɴᴛᴀᴄᴛ ᴜꜱ</h1>
                    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8">
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="peer bg-inherit w-full border-b py-1 px-4 text-stone-300 placeholder-transparent border-stone-200 shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                                required
                            />
                            <label className="absolute left-0 -top-3.5 text-stone-200 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                                Name
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="peer bg-inherit w-full border-b py-1 px-4 text-stone-300 placeholder-transparent border-stone-200 shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                                required
                            />
                            <label className="absolute left-0 -top-3.5 text-stone-200 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                                Email
                            </label>
                        </div>

                        <div className="relative flex justify-center col-span-2">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="peer bg-inherit w-full border-b py-1 px-4 text-stone-300 placeholder-transparent border-stone-200 shadow-sm focus:border-b-2 focus:outline-none focus:ring-0"
                                required
                            />
                            <label className="absolute left-0 -top-3.5 text-stone-200 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm">
                                Subject
                            </label>
                        </div>

                        <div className="sm:col-span-2">
                            <div className="flex justify-between">
                                <label htmlFor="message" className="block bold text-md text-stone-200">
                                    Message
                                </label>
                            </div>
                            <div className="mt-1">
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="bg-inherit text-md block w-full h-flex min-h-50 border-white py-3 px-4 text-stone-300 shadow-sm focus:outline-none focus:ring-0 border-x-2 border-b-4 border-t-1 rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-white flex justify-center col-span-2">
                            <button
                                type="submit"
                                className="hover:opacity-80 hover:underline hover:cursor-pointer text-xl mb-5 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </form>

                    {successMessage && (
                        <p className="text-green-500 mt-4">{successMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;