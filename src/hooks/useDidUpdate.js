import { useEffect, useRef } from 'react';

// dependency list has to be an array of elems
export default function useDidUpdate(callback, deps) {
    const hasMount = useRef(false);

    useEffect(() => {
        if (hasMount.current) {
            callback()
        } else {
            hasMount.current = true
        }
    }, deps)
}

