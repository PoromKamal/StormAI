import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { MdQuestionAnswer } from 'react-icons/md';
import aiService from '../../../services/aiService';
import ClipLoader from "react-spinners/ClipLoader";

const ChatNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [asked, setAsked] = useState(false);
  const [loading, setLoading] = useState(false);
  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { label: e.target.value },
    });
    setQuestionText(e.target.value);
  }, [])

  const onAskClick = () => {
    setLoading(true);
    aiService.askQuestion(questionText).then((res) => {
        if(!res.completion)
            alert('Error asking question! Try again later.');
        console.log(res);
        setAsked(true);
        setLoading(false);
        setAnswer(res.completion);
    });
  }

  return (
    <div className='bg-gray-200 h-96 w-96 p-3 border rounded flex justify-center' style={{
      transition: "transform 1s linear",
    }}>
        <div className='flex flex-col items-center w-full gap-3'>
            <MdQuestionAnswer
                className='w-6 h-6'/>
            <input
                placeholder='Ask away!'
                onChange={onChange}
                className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
                />
            <button className='w-12 bg-gray-300 rounded-md hover:bg-gray-400'
                onClick={onAskClick}>
                Ask!
            </button>
            <ClipLoader
                    color='0000FF'
                    loading={loading}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    />
            {
                asked &&
                <textarea                
                    spellCheck={false}
                    rows={10}
                    cols={10}
                    className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
                    value={answer}
                    />
            }
        </div>

    </div>
  )
}

export default ChatNode;