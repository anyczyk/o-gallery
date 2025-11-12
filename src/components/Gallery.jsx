import {useState, useRef, useEffect} from 'react';
// import {data} from "autoprefixer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const LazyLoaded = ({src,alt}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {/*loading="lazy"*/}
            <img onLoad={() => setLoaded(true)} src={src} alt={alt}
                 className={`w-full h-full object-cover aspect-square transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
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
    const [activeFilePopup, setActiveFilePopup] = useState(null);
    const [isPrevExist, setIsPrevExist] = useState(true);
    const [isNextExist, setIsNextExist] = useState(true);
    const refFullImage = useRef();

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
                item.files.map((file,index) => {
                    if(file === activeFilePopup) {
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

    const handleClick = (index) => {
        if(activeIndexTab === index) {
            setActiveIndexTab(null);
        } else {
            setActiveIndexTab(index);
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

    const downloadZip = async (files) => {
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
        saveAs(content, "pictures.zip");
    };

    return (
        <>
            {activeFilePopup ? <div className="flex bg-black fixed inset-0 z-2">
                <img ref={refFullImage}
                     alet={`image`}
                     className="max-w-full h-auto max-h-[100vh] mt-auto mb-auto ml-auto mr-auto transition-background-image duration-300"
                     src={activeFilePopup}/>



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

                <button className="absolute right-2 top-2 cursor-pointer p-2"
                        onClick={() => setActiveFilePopup(null)}>
                    <svg className="w-10 h-10 text-white [filter:drop-shadow(0px_0px_1px_black)]" fill="none"
                         stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/>
                    </svg>
                </button>
            </div> : <>
                <h1 className="p-4 text-3xl font-bold text-blue-600">Gallery</h1>
                {photos.map((item, index) => (

                    <div key={index} className={`mb-2 ${activeIndexTab === index ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <h2 tabIndex="0" role="button" className="p-4 flex mb-0 text-1xl font-bold text-blue-600 cursor-pointer border-b-[1px] border-white"
                            onClick={() => handleClick(index)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleClick(index);
                                }
                            }}
                        >{item.title} ({photos[index].files.length})
                            <svg className={`inline-block ml-auto mt-auto mb-auto w-5 h-5 text-black [filter:drop-shadow(0px_0px_1px_white)] transition-rotate duration-300 ${activeIndexTab === index ? 'rotate-180' : 'rotate-0'}`} fill="none"
                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7"/>
                            </svg>
                        </h2>
                        {activeIndexTab === index ?
                            <>
                                <div className="p-4 border-b-[1px] border-white"><button onClick={() => downloadZip(item.files)}>Download zip</button></div>
                                <ul className="p-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
                                    {item.files.map((url, index) => (
                                        <li className="bg-black p-1" key={index}>
                                            <a className="relative block w-full h-full" target="_blank" href={url}
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
            </>}
        </>
    );
};

export default Gallery;
