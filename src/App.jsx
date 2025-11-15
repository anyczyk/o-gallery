import {useState, useRef, useEffect} from 'react'
import './App.css'
import Gallery from './components/Gallery.jsx';
import { setCookie, getCookie, deleteCookie, hasCookie, getAllCookies } from "./utils/cookies";
import { verifyPassword } from "./utils/passwordUtils";
function App() {
    const [password, setPassword] = useState('');
    const [passCorrect, setPassCorrect] = useState(false);
    const [passInfo, setPassInfo] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(()=> {
        if(hasCookie("password")) {
            setPassCorrect(true);
        }
    }, []);

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const checkPassword = async () => {
        if(password.length > 0) {
            setPassword('');

            const storedHash = "e0bc60c82713f64ef8a57c0c40d02ce24fd0141d5cc3086259c19b1e62a62bea";
            const isValid = await verifyPassword(password, storedHash);
            if (isValid) {
                setCookie('password', 'true', 365);
                setPassCorrect(true);
                setPassInfo(false);
            } else {
                setPassInfo(true);
                if(timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setPassInfo(false);
                },5000);
            }
        }
    };

    const handleKeyDownPassword = (e) => {
        if (e.key === "Enter") {
            checkPassword();
        }
    };

    return (
        <>
            {passCorrect ? <Gallery deleteCookie={deleteCookie} setPassCorrect={setPassCorrect} /> : <div className="p-4 flex w-full min-h-screen text-white bg-black">
                <div className="m-auto">
                    <input onKeyDown={handleKeyDownPassword} value={password} onChange={handlePassword} placeholder="Password"
                           className="bg-white text-black p-4" type="password"/>
                    <button onClick={checkPassword} className="p-4 bg-warning">Submit</button>
                    {passInfo ? <p className="text-red-500 mt-2">Wrong password, try again</p> : <p className="pt-2">Enter password</p>}
                </div>
            </div>}
        </>
    );
}

export default App;
