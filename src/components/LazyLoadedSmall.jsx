import {useState} from 'react';

export const LazyLoadedSmall = ({src,alt}) => {
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
