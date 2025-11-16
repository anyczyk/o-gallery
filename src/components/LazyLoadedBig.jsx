import { useState, useEffect, forwardRef } from "react";

export const LazyLoadedBig = forwardRef(({ activeFilePopup, alt }, ref) => {
    const [loaded, setLoaded] = useState(false);

    // Reset loading when src changes
    useEffect(() => {
        setLoaded(false);
    }, [activeFilePopup]);

    return (
        <>
            <img
                ref={ref}
                alt={alt}
                className={`max-w-full h-auto max-h-[100vh] mt-auto mb-auto ml-auto mr-auto transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                src={activeFilePopup}
                onLoad={() => setLoaded(true)}
                draggable="false"
            />

            {!loaded && (
                <span
                    className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    role="status"
                    aria-label="Loading"
                ></span>
            )}
        </>
    );
});


// import {useState, forwardRef} from "react";
//
// export const LazyLoadedBig = forwardRef(({activeFilePopup,alt}, ref) => {
//     const [loaded, setLoaded] = useState(false);
//
//     return (
//         <>
//             <img ref={ref}
//                  alt={alt}
//                  className={`max-w-full h-auto max-h-[100vh] mt-auto mb-auto ml-auto mr-auto transition-background-image duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
//                  src={activeFilePopup}
//                  onLoad={() => setLoaded(true)}
//                  draggable="false"
//             />
//             {!loaded ? <span
//                 className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//                 role="status"
//                 aria-label="Loading"
//             ></span> : ''}
//         </>
//     );
// });
