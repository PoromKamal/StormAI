import React, {useId, useState} from "react";
import {Collapse} from "react-collapse";
import aiService from "../service/aiService";
export default function ArtistBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [storyText, setStoryText] = useState("");
    const textAreaId = useId();
    const handleCompleteStory = () => {
        aiService.askStoryBot(storyText).then((response) => {
            console.log(response);
            const textArea = document.getElementById(textAreaId);
            textArea.value = response[0].generated_text;
        });
    }

    return (<div>
        <div className="fixed bg-slate-400 rounded-md top-80 right-10 w-16 h-16 text-center cursor-pointer" onClick={() =>{setIsOpen(!isOpen)}}>
            Story Bot
        </div>
        <div className={`${isOpen ? "flex-col" : "hidden"} fixed bg-slate-400 rounded-md top-96 right-10 w-96 h-96 text-center pt-5 px-10`}>
            <div>
            Hey I'm Story Bot, let's write a story.
            </div>
            <textarea id = {textAreaId} cols={40} className="resize-none rounded-md h-72" placeholder="Start writing, and I'll finish it for you :)" 
                        onChange={(text) => setStoryText(text.target.value)}/>
            <button className="bg-white p-1 rounded-md" onClick={handleCompleteStory}>Complete Story!</button>
        </div>
    </div>);
}