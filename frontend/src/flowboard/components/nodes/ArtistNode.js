import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { FaPaintBrush } from 'react-icons/fa';
import { MdHistoryEdu } from 'react-icons/md';
import aiService from '../../../services/aiService';
import ClipLoader from "react-spinners/ClipLoader";

const ArtistNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);
  const [storyText, setStoryText] = useState('');
  const [imageGenerated, setImageGenerated] = useState(false);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { label: e.target.value },
    });
    setStoryText(e.target.value);
  }, [])

  const onFinishStoryClick = () => {
    setLoading(true);
    aiService.generateImage(storyText).then((blob) => {
        if(blob.err !== undefined)
          alert('Artist Bot is currently rate limited!');
        console.log(blob);
        setImageGenerated(true);
        setLoading(false);
        setImage(URL.createObjectURL(blob));
    });
  }

  return (
        imageGenerated ? (
            <>
                <img src={image} alt="drawing" width="500" height="600"/>
            </>
        ) : 
        <>
            <div className='flex flex-col bg-gray-200 h-32 w-72 p-3 border rounded' style={{
                transition: "transform 1s linear",
              }}>
                    <div className='flex flex-col items-center'>
                      <FaPaintBrush/>
                      <textarea
                          spellCheck={false}
                          placeholder="What would you like me to draw?"
                          rows={2}
                          cols={100}
                          onChange={onChange}
                          className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
                          value={storyText}
                      />
                      <button className='bg-gray-300 w-64 rounded-md hover:bg-gray-400'
                          onClick={onFinishStoryClick}>
                          Finish!
                      </button>
                      <ClipLoader
                          color='0000FF'
                          loading={loading}
                          size={25}
                          aria-label="Loading Spinner"
                          data-testid="loader"  
                          />
                    </div>
            </div>
        </>
  )
}

export default ArtistNode