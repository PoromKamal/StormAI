import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { FaPaintBrush } from 'react-icons/fa';
import { MdHistoryEdu } from 'react-icons/md';
import aiService from '../../../services/aiService';
import ClipLoader from "react-spinners/ClipLoader";

const ArtistNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);
  const [storyText, setStoryText] = useState('');
  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { text: e.target.value },
    });
    setStoryText(e.target.value);
  }, []);

  const onGenerateImageClick = () => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: {loading: true},
    });
    setLoading(true);
    aiService.generateImage(storyText).then((blob) => {
        if(blob.err !== undefined)
          alert('Artist Bot is currently rate limited!');
        const url = URL.createObjectURL(blob);
        yDoc.getMap('nodes').set(id, {
          ...currentNode,
          data: { imageGenerated: true, imageSrc: url, loading: false},
        });
    });
  }

  return (
        data.imageGenerated ? (
            <>
                <img src={data.imageSrc ? data.imageSrc : ""} alt="drawing" width="500" height="600"/>
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
                          value={data.text}
                          required
                      />
                      <button className='bg-gray-300 w-64 rounded-md hover:bg-gray-400'
                          onClick={onGenerateImageClick}>
                          Finish!
                      </button>
                      <ClipLoader
                          color='0000FF'
                          loading={data.loading ? data.loading : false}
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