import { useCallback, useState } from 'react';

export function useLoading(defaultShown = false): [boolean, () => void, () => void] {
    const [isLoading, setIsLoading] = useState(defaultShown);

    const showLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    return [isLoading, showLoading, hideLoading];
}
