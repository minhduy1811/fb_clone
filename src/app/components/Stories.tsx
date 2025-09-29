import Image from "next/image";
import Meo from "../../../assets/meo.jpg";
import meme from "../../../assets/meme.jpg";

const Stories = () => {

    const stories = [
        { profile: Meo, name: "Minh Duy" },
        { profile: Meo, name: "Minh Duy" },
        { profile: meme, name: "Minh Duy" },
        { profile: Meo, name: "Minh Duy" },
        { profile: Meo, name: "Minh Duy" },
    ]

    return (

        <div className="flex pb-4">
            {stories.map((story) => (
                <div className="relative inline-block mr-2 last:mr-0 cursor-pointer overflow-hidden" key={story.name}>
                    <Image src={story.profile} alt={story.name} className="rounded-[1rem] w-118 h-50  hover:scale-101 transition-transform duration-200 ease-in-out" />
                    <div className="flex absolute w-11 h-11 top-3 left-3" key={story.name}>
                        <Image src={story.profile} alt={story.name} className="rounded-full object-cover border-4 border-blue-500" />
                    </div>
                </div>

            ))}
        </div>
    )
}

export default Stories;