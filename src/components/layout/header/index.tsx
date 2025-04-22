import {Button, Card, CardContent, Container, styled, Typography} from "@mui/material";
import React from "react";
import {FlexBox} from "../../styled";

const StyledContainer = styled(Container)`
    padding: 1em 1em`

//todo height calculate flex
export const AppHeader = () => {
    return <StyledContainer className="footer" style={{height: 'calc(100vh - 732px)'}}>
        {/*@ts-ignore*/}
        <Card style={{height:'100%', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
            <CardContent style={{height: '100%'}}>
                <FlexBox justifyContent='center'>
                    <div>
                        Сделано в
                        {' '}
                        <a href="https://lobanovsky.ru" target="_blank" style={{textTransform: 'none', color: '#1976d2', textDecoration: 'none'}}>Бюро Лобановского</a>
                        &nbsp;
                        <span style={{color: 'red'}}>❤️</span>
                    </div>
                </FlexBox>
            </CardContent>
        </Card>
    </StyledContainer>
}
