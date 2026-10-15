
import React, {useState} from "react";
import {IconButton, Tooltip} from "@mui/material";
import {styled} from "@mui/material/styles";
import RefreshIcon from '@mui/icons-material/Refresh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LogoutIcon from '@mui/icons-material/Logout';
import {Container} from "../../styled";
import {AuthDebugButtons} from "../../auth/DebugButtons";
import {useSelector, useDispatch} from "react-redux";
import {getSoundEnabled, getAuth} from "store/auth/selectors";
import {toggleSound, logout} from "store/auth/reducer";

const HeaderRoot = styled(Container)`
    flex-shrink: 0;
    padding-top: max(8px, env(safe-area-inset-top));
    border-bottom: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
`;

const HeaderStack = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const HeaderBar = styled('div')`
    display: flex;
    align-items: center;
    width: 100%;
`;

const HeaderSlot = styled('div')<{ align: 'flex-start' | 'center' | 'flex-end' }>`
    flex: 1;
    display: flex;
    justify-content: ${(p) => p.align};
`;

const DonateLink = styled('a')`
    color: #64748b;
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        color: #3568ad;
        text-decoration: underline;
        text-underline-offset: 3px;
    }
`;

const handleUpdate = async () => {
    if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n)));
    }
    if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
    }
    window.location.reload();
};

export const AppHeader = () => {
    const [refreshing, setRefreshing] = useState(false);
    const soundEnabled = useSelector(getSoundEnabled);
    const {isUserLoggedIn, isCheckingToken, user} = useSelector(getAuth);
    const dispatch = useDispatch();

    const onRefresh = async () => {
        setRefreshing(true);
        await handleUpdate();
    };

    return <HeaderRoot className="header" padding='0.5em'>
        <HeaderStack>
            <HeaderBar>
                <HeaderSlot align="flex-start">
                    <Tooltip title="Обновить приложение">
                        <IconButton aria-label="Обновить приложение" onClick={onRefresh} disabled={refreshing} size="small">
                            <RefreshIcon style={{animation: refreshing ? 'spin 0.8s linear infinite' : undefined}}/>
                        </IconButton>
                    </Tooltip>
                </HeaderSlot>
                <HeaderSlot align="center">
                    <Tooltip title={soundEnabled ? "Звук: вкл" : "Звук: выкл"}>
                        <IconButton aria-label={soundEnabled ? "Выключить звук" : "Включить звук"} aria-pressed={soundEnabled} onClick={() => dispatch(toggleSound())} size="small">
                            {soundEnabled ? <VolumeUpIcon/> : <VolumeOffIcon/>}
                        </IconButton>
                    </Tooltip>
                </HeaderSlot>
                <HeaderSlot align="flex-end">
                    {isUserLoggedIn && !isCheckingToken && user.user.id > 0 &&
                        <Tooltip title="Выйти">
                            <IconButton aria-label="Выйти" onClick={() => dispatch(logout())} size="small">
                                <LogoutIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                    <AuthDebugButtons/>
                </HeaderSlot>
            </HeaderBar>
            <div style={{textAlign: 'center'}}>
                <DonateLink href="https://t.tb.ru/pm_short/8ccZXC5ZbA3" target="_blank">
                    Поблагодарить разработчика
                </DonateLink>
            </div>
        </HeaderStack>
    </HeaderRoot>
}
