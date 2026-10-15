
import React, {useState} from "react";
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import RefreshIcon from '@mui/icons-material/Refresh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
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

const DonateLink = styled('button')`
    border: 0;
    padding: 4px 8px;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
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
    const [donateOpen, setDonateOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);

    const openDonate = () => {
        setCopied(false);
        setCopyError(false);
        setDonateOpen(true);
    };

    const copyPhone = async () => {
        try {
            await navigator.clipboard.writeText('+79267936363');
            setCopied(true);
            setCopyError(false);
        } catch {
            setCopied(false);
            setCopyError(true);
        }
    };
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
                <DonateLink type="button" onClick={openDonate}>
                    Поблагодарить разработчика
                </DonateLink>
            </div>
        </HeaderStack>
        <Dialog
            open={donateOpen}
            onClose={() => setDonateOpen(false)}
            fullWidth
            maxWidth="xs"
            aria-labelledby="donate-title"
            aria-describedby="donate-description"
            slotProps={{paper: {sx: {borderRadius: '20px', m: 2, width: 'calc(100% - 32px)'}}}}
        >
            <DialogTitle id="donate-title" sx={{pr: 7, fontSize: '1.15rem', fontWeight: 700}}>
                Поблагодарить разработчика
            </DialogTitle>
            <IconButton
                aria-label="Закрыть"
                onClick={() => setDonateOpen(false)}
                sx={{position: 'absolute', right: 12, top: 12}}
            >
                <CloseIcon/>
            </IconButton>
            <DialogContent sx={{pb: 3}}>
                <Typography id="donate-description" color="text.secondary" sx={{mb: 3}}>
                    Перевод любой суммы на Сбер или Т-Банк
                </Typography>
                <Box sx={{p: 2.5, mb: 3, borderRadius: '12px', bgcolor: 'background.default', textAlign: 'center'}}>
                    <Typography sx={{fontSize: {xs: '1.35rem', sm: '1.5rem'}, fontWeight: 700, userSelect: 'text', whiteSpace: 'nowrap'}}>
                        +7-926-793-63-63
                    </Typography>
                    <Typography color="text.secondary" sx={{mt: 0.75}}>
                        Евгений Л.
                    </Typography>
                </Box>
                <Button fullWidth variant="contained" size="large" onClick={copyPhone}
                        startIcon={copied ? <CheckIcon/> : <ContentCopyIcon/>}
                        sx={{minHeight: 52}}>
                    Копировать номер телефона
                </Button>
                <Box role="status" aria-live="polite" sx={{mt: 1.5, minHeight: 20, textAlign: 'center'}}>
                    <Typography variant="body2" color={copyError ? 'error' : 'text.secondary'}>
                        {copied ? 'Номер скопирован' : copyError ? 'Не удалось скопировать. Выделите номер и скопируйте вручную.' : 'Спасибо за поддержку!'}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    </HeaderRoot>
}
