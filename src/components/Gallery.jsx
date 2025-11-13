import {useState, useRef, useEffect} from 'react';
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { downloadZip } from "../utils/downloadZip";
import {LazyLoaded} from './LazyLoaded';
import {IcoPrev, IcoNext, IcoClose, IcoLogo, IcoLogout, IcoChevronDown, IcoDownload} from '../icons/iconsSVG';

const Gallery = ({setPassCorrect, deleteCookie}) => {
    const [photos, setPhotos] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState(null);
    const [activeIndexPhoto, setActiveIndexPhoto] = useState(null);
    const [activeFilePopup, setActiveFilePopup] = useState(null);
    const [activeCountPhotos, setActiveCountPhotos] = useState(null);
    const [isPrevExist, setIsPrevExist] = useState(true);
    const [isNextExist, setIsNextExist] = useState(true);
    const refFullImage = useRef();
    const refMainListWrap = useRef();

    useEffect(() => {
        fetch('./o-gallery.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('error uploads');
                }
                return response.json();
            })
            .then(data => {
                setPhotos(data);
                const cleanHash = window.location.hash.substring(1);
                data.map((item,index) => {
                    const hashFormat = cleanHash.replace("%20", " ");
                    if(item.title === hashFormat) {
                        setTimeout(() => {
                            const el = refMainListWrap.current.querySelector(`.o-sector:nth-child(${index+1}) .o-title`);
                            handleClickOpenTab(el, index);
                        },0);
                    }
                });


            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        photos.map((item,index) => {
            if(activeIndexTab === index) {
                // console.log("active index: ", activeIndexTab);
                setActiveCountPhotos(item.files.length);
                item.files.map((file,index) => {
                    if(file === activeFilePopup) {
                        setActiveIndexPhoto(index+1);
                        if(item.files[index-1]) {
                            // console.log("exist prev");
                            setIsPrevExist(true);
                        } else {
                            // console.log("no exist prev");
                            setIsPrevExist(false);
                        }

                        if(item.files[index+1]) {
                            // console.log("exist next");
                            setIsNextExist(true);
                        } else {
                            // console.log("no exist next");
                            setIsNextExist(false);
                        }
                    }
                });
            }
        });
    }, [activeFilePopup]);

    const handleClickOpenTab = (e, index) => {
        const isSame = activeIndexTab === index;

        if (isSame) {
            setActiveIndexTab(null);
            window.location.hash = '';
        } else {
            setActiveIndexTab(index);
        }

        if (e && !isSame) {
            setTimeout(() => {
                if (e && e.target && typeof e.target === 'object') {
                    e.target.scrollIntoView({
                        behavior: "auto",
                        block: "start"
                    });
                    window.location.hash = `#${photos[index].title}`;
                } else if (e && e.nodeType === 1) {
                    e.scrollIntoView({
                        behavior: "auto",
                        block: "start"
                    });
                }
            }, 0);
        }
    };

    const openPopup = (event,url) => {
        event.preventDefault();
        // alert(url);
        setActiveFilePopup(url);
    };

    const chooseImage = (direction) => {
        const url = refFullImage.current.src;
        // console.log('current image: ', url);
        photos.map(item => {
            // console.log(item.title);
            item.files.map( (src,index) => {
                if(src === url) {
                    // console.log("this id picture: ", index);
                    const d = (direction === 'prev' ? (index-1) : (index+1));
                    if(item.files[d]) {
                        // console.log("next file exist: ", item.files[d]);
                        setActiveFilePopup(item.files[d]);
                    } else {
                        console.log("next file no exist");
                    }
                }
            });
        });
    };

    const swipeHandlers = useSwipeNavigation(chooseImage);

    const logout = () => {
        deleteCookie('password');
        setPassCorrect(false);
        window.location.hash = '';
    };

    const closePopup = () => {
        setActiveFilePopup(null);
        // console.log(photos[activeIndexTab]);
        setTimeout(() => {
            // console.log(refMainListWrap.current);
            refMainListWrap.current.querySelector(`.o-item-photo:nth-child(${activeIndexPhoto}) a`).focus();
            refMainListWrap.current.querySelector(`.o-item-photo:nth-child(${activeIndexPhoto}) a`).scrollIntoView({
                behavior: "auto",
                block: "start"
            });
            window.scrollBy(0, -100);
        }, 0);
    };

    return (
        <>
            {activeFilePopup ? <div className="flex bg-black fixed inset-0 z-2"
                                    {...swipeHandlers}
            >
                <img ref={refFullImage}
                     alet={`image`}
                     className="max-w-full h-auto max-h-[100vh] mt-auto mb-auto ml-auto mr-auto transition-background-image duration-300"
                     src={activeFilePopup}

                     draggable="false"
                    />


                {isPrevExist ? <button onClick={() => chooseImage('prev')} className="text-center p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer"><IcoPrev /></button> : ''}
                {isNextExist ? <button onClick={() => chooseImage('next')} className="text-center p-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer"><IcoNext /></button> : ''}

                {/*Close button*/}
                <button className="absolute right-2 top-2 cursor-pointer p-2"
                        onClick={() => closePopup()}>
                    <IcoClose />
                </button>

                <div className="absolute bottom-4 text-center left-0 right-0 z-3 text-white font-bold [filter:drop-shadow(0px_0px_1px_black)]">{activeIndexPhoto} / {activeCountPhotos}</div>

            </div> : <>
                <header className="flex mb-2 p-4 text-white bg-lime-500">
                    <IcoLogo />
                    <h1 className="text-3xl font-bold">oGallery</h1>
                    <button className="ml-auto cursor-pointer flex items-center" onClick={logout}>
                        <IcoLogout />
                        Logout
                    </button>
                </header>
                <div className="container mx-auto px-2" ref={refMainListWrap}>
                    {photos.map((item, index) => (
                        <div key={index}
                             className={`o-sector mb-2 ${activeIndexTab === index ? 'bg-green-100' : 'bg-yellow-300'}`}>
                            <h2 tabIndex="0" role="button"
                                className="o-title p-4 flex mb-0 text-1xl font-bold text-blue-600 cursor-pointer border-b-[1px] border-white"
                                onClick={(e) => handleClickOpenTab(e,index)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleClickOpenTab(index);
                                    }
                                }}
                            >{item.title} ({photos[index].files.length})
                                <IcoChevronDown activeIndexTab={activeIndexTab} index={index} />
                            </h2>
                            {activeIndexTab === index ?
                                <>
                                    <div className="p-4 flex border-b-[1px] border-white">
                                        <button title={`Download pictures-${item.title}.zip`} aria-label="Download file"
                                                className="py-2 px-4 ml-auto flex cursor-pointer text-white bg-amber-500 hover:bg-orange-300 transition-bg duration-200 rounded-lg"
                                                onClick={() => downloadZip(item.files, item.title)}>
                                            <IcoDownload />
                                            Download zip
                                        </button>
                                    </div>
                                    <ul className="p-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
                                        {item.files.map((url, index) => (
                                            <li className="o-item-photo bg-black rounded-lg shadow-[0_0_3px_black] transition-transform duration-200 hover:scale-105"
                                                key={index}>
                                                <a className="relative block w-full h-full focus:outline-[3px] focus:outline-[#ff0000] focus:outline-dotted focus-visible:outline-[3px] focus-visible:outline-[#ff0000] focus-visible:outline-dotted focus:rounded-lg focus-visible:rounded-lg" target="_blank" href={url}
                                                   onClick={(e) => openPopup(e, url)}>
                                                    <LazyLoaded src={url} alt={`Photo ${index}`}/>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </> : ''}
                        </div>
                    ))}
                </div>
                <footer className="mt-auto p-4 text-white bg-lime-500">
                    <p className="text-center">&copy; semDesign / oGallery</p>
                </footer>
            </>}
        </>
    );
};
export default Gallery;
