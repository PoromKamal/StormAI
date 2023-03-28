import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { MdHistoryEdu } from 'react-icons/md';
import aiService from '../../../services/aiService';

const StoryNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);
  const [storyText, setStoryText] = useState('');
  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { label: e.target.value },
    });
    setStoryText(e.target.value);
  }, [])

  const onFinishStoryClick = () => {
    aiService.finishStory(storyText).then((res) => {
        setStoryText(res[0].generated_text);
    });
  }

  return (
    <div className='bg-gray-200 h-72 w-72 p-3 border rounded flex' style={{
      transition: "transform 1s linear",
    }}>
        <div className='flex flex-col'>
            <MdHistoryEdu/>
            <textarea
                spellCheck={false}
                placeholder="Start a story, and I'll complete it!"
                rows={100}
                cols={100}
                onChange={onChange}
                className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
                value={storyText}
            />
            <button className='bg-gray-300 rounded-md hover:bg-gray-400'
                onClick={onFinishStoryClick}>
                Finish!
            </button>
        </div>

    </div>
  )
}

export default StoryNode