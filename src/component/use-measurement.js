import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export function useMeasurement(ref) {
    const element = useRef()
    const [size, setSize] = useState({ width: 0.0000001, height: 0.0000001 })
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
            observer.observe(target)
        }
    }

    function measure() {
        requestAnimationFrame(() => {
            const e = element.current
            setSize({
                height: e.scrollHeight || e.offsetHeight,
                width: e.offsetWidth,
            })
        })
    }
}
