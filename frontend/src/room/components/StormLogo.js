import axios from "axios"
import { RiThunderstormsFill } from "react-icons/ri"
import { useState } from "react"
import { redirect } from "react-router-dom"

const StormLogo = () => {
    const [hover, setHover] = useState(false)

    const onHover = () => {
        setHover(true);
    }

    const onLeave = () => {
        setHover(false);
    }

    return (
        <a href="/">
            <div className="flex left-0 top-0 justify-center items-center absolute z-10 m-10 text-4xl font-lilita-one font-normal text-storm-blue cursor-pointer"
                href>
                <div className={hover ? "animate-logo" : "invisible"}>
                    st
                </div>
                <RiThunderstormsFill 
                    onMouseEnter={onHover}
                    onMouseLeave={onLeave}
                    className={`transition-all translate-x-3 w-8 h-8 mt-2 scale-150 hover:scale-100 hover:translate-x-0 ${hover? "" : ""}`}/>
                <div className={hover ? "animate-logo" : "invisible"}>
                    orm.ai
                </div>  
            </div>
        </a>

    )

}
export default StormLogo;