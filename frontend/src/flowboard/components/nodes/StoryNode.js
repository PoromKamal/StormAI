import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { MdHistoryEdu } from 'react-icons/md';
import aiService from '../../../services/aiService';
import ClipLoader from "react-spinners/ClipLoader";

const StoryNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);
  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { ...currentNode.data, text: e.target.value },
    });
  }, [])

  const onFinishStoryClick = () => {
    if(data.text.trim().length===0){
      alert("Please fill in the prompt to generate a story!");
      return;
    }
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { loading: true },
    });
    aiService.finishStory(data.text).then((res) => {
        yDoc.getMap('nodes').set(id, {
          ...currentNode,
          data: { text: res[0].generated_text, loading: false },
        });
    });
  }

  return (
    <div className='bg-gray-200 h-72 w-72 p-3 border rounded flex' style={{
      transition: "transform 1s linear",
    }}>
        <div className='flex flex-col items-center'>
            <MdHistoryEdu/>
            <textarea
                spellCheck={false}
                placeholder="Start a story, and I'll complete it!"
                rows={100}
                cols={100}
                onChange={onChange}
                className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
                value={data.text}
                required
            />
            <ClipLoader
                color='white'
                loading={data.loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"  
                />
            <button className='mt-10 bg-gray-300 rounded-md hover:bg-gray-400 w-20'
                onClick={onFinishStoryClick}>
                Finish!
            </button>

        </div>

    </div>
  )
}

export default StoryNode