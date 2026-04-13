
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
            <div className='made-in' style={{flex: '1 0 auto', textAlign: 'center'}}>
                Сделано в
                <a href="https://lobanovsky.ru" target="_blank"
                   style={{textTransform: 'none', margin: '0 4px', color: '#1976d2', textDecoration: 'none'}}>Бюро Лобановского</a>
            </div>
            <AuthDebugButtons/>
        </FlexBox>
    </Container>
}
