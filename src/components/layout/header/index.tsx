
import React, {useState} from "react";
import {IconButton, Tooltip} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {Container, FlexBox} from "../../styled";
import {AuthDebugButtons} from "../../auth/DebugButtons";

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

    const onRefresh = async () => {
        setRefreshing(true);
        await handleUpdate();
    };

    return <Container className="header" style={{textAlign: 'end'}}>
        <FlexBox flex-direction='row'>
            <Tooltip title="Обновить приложение">
                <IconButton onClick={onRefresh} disabled={refreshing} size="small">
                    <RefreshIcon style={{animation: refreshing ? 'spin 0.8s linear infinite' : undefined}}/>
                </IconButton>
            </Tooltip>
            <div style={{flex: '1 0 auto', textAlign: 'center'}}>
                <a href="https://tbank.ru/cf/8ccZXC5ZbA3" target="_blank"
                   style={{
                       textDecoration: 'none',
                       color: '#ff3b6b',
                       fontWeight: 600,
                       fontSize: '0.9rem',
                       letterSpacing: '0.01em',
                   }}>
                    ☕ Поблагодарить разработчика
                </a>
            </div>
            <AuthDebugButtons/>
        </FlexBox>
    </Container>
}
