import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export function useClearableState(initialValue, setter) {
    let [value, setValue] = useState(initialValue)
    useEffect(() => {
        return () => {
            setValue = null
        }
    }, [])
    const update = (v) => setValue && setValue(v)
    setter && setter(update)
    return [value, update]
}

export function useMeasurement(ref) {
    const element = useRef()
    const [size, setSize] = useState({
        width: 0.0000001,
        height: 0.0000001,
    })
    const [observer] = useState(() => new ResizeObserver(measure))
    useLayoutEffect(() => {
        return () => {
            observer.disconnect()
        }
    }, [observer])
    return [size, attach]

    function attach(target) {
        element.current = target
        ref && ref(target)
        if (target) {
            const update = {height: target.scrollHeight || target.offsetHeight, width: target.offsetWidth}
            if(size.width !== update.width || size.height !== update.height) {
                setSize(update)
            }
            observer.observe(target)
        }
    }

    function measure(entries) {
        let contentRect = entries[0].contentRect
        if (contentRect.height > 0) {
            setSize({
                height: contentRect.height,
                width: contentRect.width,
                left: contentRect.left,
                top: contentRect.top,
                element: entries[0].target,
            })
        }

    }
}
