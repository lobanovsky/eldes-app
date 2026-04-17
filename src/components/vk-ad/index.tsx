import {useEffect} from "react";

declare global {
    interface Window {
        MRGtag: object[];
    }
}

export const VkAd = () => {
    useEffect(() => {
        (window.MRGtag = window.MRGtag || []).push({});
    }, []);

    return (
        <div style={{width: '100%', overflowX: 'hidden'}}>
            <ins
                className="mrg-tag"
                style={{display: 'inline-block', width: '950px', height: '300px'}}
                data-ad-client="ad-1999255"
                data-ad-slot="1999255"
            />
        </div>
    );
};
