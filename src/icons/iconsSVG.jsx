export const IcoPrev = () => {
    return (
        <svg className="inline-block w-10 h-10 text-light [filter:drop-shadow(0px_0px_1px_black)]"
             fill="none"
             stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7"/>
        </svg>
    );
};

export const IcoNext = () => {
    return (
        <svg className="inline-block w-10 h-10 text-light [filter:drop-shadow(0px_0px_1px_black)]"
             fill="none"
             stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
    );
};

export const IcoClose = () => {
    return (
        <svg className="w-10 h-10 text-light [filter:drop-shadow(0px_0px_1px_black)]" fill="none"
             stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/>
        </svg>
    );
};

export const IcoLogo = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             className="mr-3 w-10 h-10 text-neutral-50 transition-colors duration-200"
             strokeWidth="1.5"
             strokeLinecap="round"
             strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
            <path d="M3 18l5-6 4 5 6-8 4 6"/>
            <circle cx="17" cy="7" r="2"/>
        </svg>
    );
};

export const IcoLogout = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             className="w-6 h-6 stroke-current"
             strokeWidth="1.5">
            <path
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 12H9.75" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12l-3-3m0 6 3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export const IcoChevronDown = ({activeIndexTab,index}) => {
    return (
        <svg
            className={`inline-block ml-auto mt-auto mb-auto w-5 h-5 text-light [filter:drop-shadow(0px_0px_1px_light)] transition-rotate duration-300 ${activeIndexTab === index ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7"/>
        </svg>
    );
};

export const IcoDownload = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             className="w-6 h-6 text-light"
             strokeWidth="1.5"
             strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M12 3v12.75"/>
            <path d="M8.25 12.75L12 16.5l3.75-3.75"/>
            <path d="M4.5 21h15"/>
        </svg>
    );
};
