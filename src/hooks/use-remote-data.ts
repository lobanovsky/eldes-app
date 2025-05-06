import { useCallback, useEffect, useState } from 'react';
import { useLoading } from './use-loading';

function useRemoteData<T, OutputT = T>({
                                           loader,
                                           dataConverter,
    loadOnInit = true
                                       }: {
    loader: (options?: any) => Promise<T>,
    errorMsg?: string,
    loadOnInit?: boolean,
    dataConverter?: (data: T) => OutputT
}): [OutputT | null, boolean, () => void] {
    const [loading, showLoading, hideLoading] = useLoading();
    const [data, setData] = useState<OutputT | null>(null);

    const loadData = useCallback(() => {
        showLoading();
        // @ts-ignore
        loader()
            .then((responseData: T) => {
                hideLoading();
                const result = dataConverter ? dataConverter(responseData) : responseData;
                setData(result as OutputT);
            })
            .catch((e: any) => {
                // showError(errorMsg, e);
                hideLoading();
            });
    }, []);

    useEffect(() => {
        if (loadOnInit) {
            loadData();
        }
    }, []);

    return [data, loading, loadData];
}

export default useRemoteData;
