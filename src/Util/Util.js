import React, { useState, useRef, useEffect } from 'react';

export function IsOnScreen(options) {
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting);
        }, options)

        if (ref) {
            observer.observe(ref);
        }
        return () => {
            if (ref) {
                observer.unobserve(ref);
            }
        }
    }, [ref, options])
    return [setRef, visible];
}