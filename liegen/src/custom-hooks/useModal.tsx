import { useState } from 'react'

const useModal = (): [
    isShowing: boolean,
    toggle: () => void
] => {
    const [isShowing, setIsShowing] = useState(false);

    function toggle() {
        setIsShowing(!isShowing);
    }

    return [
        isShowing,
        toggle
    ];
}

export default useModal;