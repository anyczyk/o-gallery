import {useState, useRef, useEffect} from 'react';
// import {data} from "autoprefixer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const LazyLoaded = ({src,alt}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <img loading="lazy" onLoad={() => setLoaded(true)} src={src} alt={alt}
                 className={`rounded-lg w-full h-full object-cover aspect-square transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!loaded ? <span
                className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                role="status"
                aria-label="Loading"
            ></span> : ''}
        </>
    );
};

const Gallery = () => {
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
                console.log('Data JSON:', data);
                setPhotos(data);
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

    const handleClick = (e,index) => {
        if(activeIndexTab === index) {
            setActiveIndexTab(null);
        } else {
            setActiveIndexTab(index);
        }
        setTimeout(() => {
            e.target.scrollIntoView({
                behavior: "auto",
                block: "start"
            });
        },0);
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

    const downloadZip = async (files, title) => {
        console.log("Download zip: ", files);

        const zip = new JSZip();

        for (const url of files) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const filename = url.split("/").pop();
                zip.file(filename, blob);
            } catch (err) {
                console.error("Error download:", url, err);
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `pictures-${title}.zip`);
    };

    const closePopup = () => {
        setActiveFilePopup(null);
        console.log(photos[activeIndexTab]);
        setTimeout(() => {
            console.log(refMainListWrap.current);
            refMainListWrap.current.querySelector(`.o-item-photo:nth-child(${activeIndexPhoto}) a`).focus();
            refMainListWrap.current.querySelector(`.o-item-photo:nth-child(${activeIndexPhoto}) a`).scrollIntoView({
                behavior: "auto",
                block: "start"
            });
            window.scrollBy(0, -12);
        }, 0);
    };

    // Touch Start
    const startX = useRef(null);
    const isDown = useRef(false);
    const handleStart = (x) => {
        startX.current = x;
        isDown.current = true;
    };
    const handleEnd = (x) => {
        if (startX.current === null) return;
        const diffX = x - startX.current;
        startX.current = null;
        isDown.current = false;

        if (Math.abs(diffX) > 50) {
            chooseImage(diffX < 0 ? 'next' : 'prev');
        }
    };
    const handleTouchStart = (e) => {
        if (e.touches.length > 1) return;
        handleStart(e.touches[0].clientX);
    };
    const handleTouchEnd = (e) => {
        if (e.changedTouches.length > 1) return;
        handleEnd(e.changedTouches[0].clientX);
    };
    const handleMouseDown = (e) => handleStart(e.clientX);
    const handleMouseUp = (e) => {
        if (!isDown.current) return;
        handleEnd(e.clientX);
    };

    return (
        <>
            {activeFilePopup ? <div className="flex bg-black fixed inset-0 z-2"
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}>
                <img ref={refFullImage}
                     alet={`image`}
                     className="max-w-full h-auto max-h-[100vh] mt-auto mb-auto ml-auto mr-auto transition-background-image duration-300"
                     src={activeFilePopup}

                     draggable="false"
                    />



                {isPrevExist ? <button onClick={() => chooseImage('prev')}
                                       className="text-center p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer">
                    <svg className="inline-block w-10 h-10 text-white [filter:drop-shadow(0px_0px_1px_black)]"
                         fill="none"
                         stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7"/>
                    </svg>
                </button> : ''}

                {isNextExist ? <button onClick={() => chooseImage('next')}
                                       className="text-center p-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer">
                    <svg className="inline-block w-10 h-10 text-white [filter:drop-shadow(0px_0px_1px_black)]"
                         fill="none"
                         stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                </button> : ''}

                {/*Close button*/}
                <button className="absolute right-2 top-2 cursor-pointer p-2"
                        onClick={() => closePopup()}>
                    <svg className="w-10 h-10 text-white [filter:drop-shadow(0px_0px_1px_black)]" fill="none"
                         stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/>
                    </svg>
                </button>

                <div className="absolute bottom-4 text-center left-0 right-0 z-3 text-white font-bold [filter:drop-shadow(0px_0px_1px_black)]">{activeIndexPhoto} / {activeCountPhotos}</div>

            </div> : <>
                <h1 className="flex mb-2 p-4 text-3xl font-bold text-white bg-lime-500">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         className="mr-3 w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                         strokeWidth="1.5"
                         strokeLinecap="round"
                         strokeLinejoin="round">

                        <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>

                        <path d="M3 18l5-6 4 5 6-8 4 6"/>

                        <circle cx="17" cy="7" r="2"/>
                    </svg>
                    oGallery
                </h1>
                <div ref={refMainListWrap}>
                    {photos.map((item, index) => (

                        <div key={index} className={`mb-2 ${activeIndexTab === index ? 'bg-green-100' : 'bg-yellow-300'}`}>
                            <h2 tabIndex="0" role="button"
                                className="p-4 flex mb-0 text-1xl font-bold text-blue-600 cursor-pointer border-b-[1px] border-white"
                                onClick={(e) => handleClick(e,index)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleClick(index);
                                    }
                                }}
                            >{item.title} ({photos[index].files.length})
                                <svg
                                    className={`inline-block ml-auto mt-auto mb-auto w-5 h-5 text-black [filter:drop-shadow(0px_0px_1px_white)] transition-rotate duration-300 ${activeIndexTab === index ? 'rotate-180' : 'rotate-0'}`}
                                    fill="none"
                                    stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7"/>
                                </svg>
                            </h2>
                            {activeIndexTab === index ?
                                <>
                                    <div className="p-4 flex border-b-[1px] border-white">
                                        <button title={`Download pictures-${item.title}.zip`} aria-label="Download file"
                                                className="py-2 px-4 ml-auto flex cursor-pointer text-white bg-amber-500 hover:bg-orange-300 transition-bg duration-200 rounded-lg"
                                                onClick={() => downloadZip(item.files, item.title)}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24"
                                                 fill="none"
                                                 stroke="currentColor"
                                                 className="w-6 h-6 text-white"
                                                 strokeWidth="1.5"
                                                 strokeLinecap="round"
                                                 strokeLinejoin="round">
                                                <path d="M12 3v12.75"/>
                                                <path d="M8.25 12.75L12 16.5l3.75-3.75"/>
                                                <path d="M4.5 21h15"/>
                                            </svg>
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
                                                    {/*<img loading="lazy" className="w-full h-full object-cover aspect-square" src={url} alt={`Photo ${index}`}/>*/}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </> : ''}
                        </div>
                    ))}
                </div>
                <footer className="mt-auto flex p-4 text-white bg-lime-500">
                    <p>&copy; semDesign / oGallery</p>
                </footer>
            </>}
        </>
    );
};

export default Gallery;
