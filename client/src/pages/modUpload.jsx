import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import globals from '../globals';
const gColors = globals.globalColors

const Upload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
    
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
            console.log('Success:', data);
            navigate('/skins');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Saves Form Response as Mod Data
    const saveModInfo = (modData) => {
        fetch('/assets/mods/saveModInfo.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Mod submitted:', data);
        })
        .catch(error => {
            console.error('Error saving mod info:', error);
        });
    };

    return (
        <div className={`max-w-xl mx-auto p-8 px-12 rounded-lg shadow-lg mt-20 border-b-4 border-l-2 border-stone-600 ${gColors.stoneBackgroundGradient}`}>
            <h1 className="text-3xl font-bold text-stone-300 forevs2 mb-6 text-center underline">Upload a Skin</h1>

            {/* Skin/Mod Info Form */}
            <form className="" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col">
                    <label className="block text-stone-300 font-bold mb-2 forevs2">Skin Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full p-2 rounded bg-stone-600 text-stone-300 focus:outline-none focus:ring-0" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-stone-300 font-bold mb-2 forevs2">Skin Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="w-full p-2 rounded bg-stone-600 text-stone-300 focus:outline-none focus:ring-0" 
                        required 
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-stone-300 font-bold mb-2 forevs2">Upload File</label>
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="w-full p-2 rounded bg-stone-600 text-stone-300 focus:outline-none focus:ring-0" 
                        required 
                    />
                </div>
                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        className="text-indigo-500 hover:underline hover:opacity-80 forevs2 text-lg py-2 px-4 rounded-md hover:cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Upload;
