import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faVolumeUp, faStop, faGlobe } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const languages = [
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'ur-PK', name: 'Urdu (Pakistan)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'pa-IN', name: 'Punjabi (India)' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-BD', name: 'Bengali (Bangladesh)' }
  ];
  
  const [record, setRecord] = useState(false);
  const [language, setLanguage] = useState(languages[1].code);
  const copyRef = useRef(null);

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const start = () => {
    SpeechRecognition.startListening({ continuous: true, language: language });
    setRecord(true);
  };

  const stop = () => {
    SpeechRecognition.stopListening();
    setRecord(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  // copy to clipboard
  const textToClipBoard = () => {
    if(copyRef.current) {
      navigator.clipboard.writeText(copyRef.current.textContent).then(()=> {
        toast.success('Copied to Clipboard.');
      })
      .catch((err)=> {
        toast.error(`Failed: ${err}`);
      })
    }
  }
  // button style and icons size
  const btnStyle = 'w-[160px] h-[40px] border-none outline-none rounded-md bg-gray-500 text-white flex items-center justify-center gap-2 hover:bg-gray-600 transition duration-200';
  const iconSize = 'text-lg';

  return (
    <div className='w-full h-screen bg-gray-300 flex flex-col items-center justify-center'>
      <h3 className='text-4xl font-bold mb-9'>Welcome to Textualize—convert speech to text easily</h3>
      <p className='text-lg font-medium text-gray-700 mb-4'>
        This app converts speech to text. Use the buttons below to interact with the speech recognition functionality.
      </p>
      <div className='w-[80%] h-[400px] bg-white p-2 mb-4 border rounded-md resize-none outline-none' ref={copyRef}>
        {transcript}
      </div>
      <div className='flex flex-row gap-3'>
        <button className={`${btnStyle}`} onClick={textToClipBoard}>
          <FontAwesomeIcon icon={faCopy} className={iconSize} />
          <span>Copy</span>
        </button>
        <button
          className={`${btnStyle} ${record ? 'bg-gray-700 cursor-not-allowed' : ''}`}
          onClick={start}
          disabled={record}
        >
          <FontAwesomeIcon icon={faVolumeUp} className={iconSize} />
          <span>Listening</span>
          {record && <div className='w-3 h-3 rounded-full bg-red-600'></div>}
        </button>
        <button
          className={`${btnStyle}`}
          onClick={stop}
        >
          <FontAwesomeIcon icon={faStop} className={iconSize} />
          <span>Stop Listening</span>
        </button>
        <button className='w-[190px] h-[40px] border-none outline-none rounded-md bg-gray-500 text-white flex items-center justify-center gap-2 hover:bg-gray-600 transition duration-200'>
        <FontAwesomeIcon icon={faGlobe} className={iconSize} />
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
            className='bg-gray-500 w-[145px] border-none outline-none'
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
