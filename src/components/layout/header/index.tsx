import {Button, Card, CardContent, Container, styled, Typography} from "@mui/material";
import React from "react";
import {FlexBox} from "../../styled";

const StyledContainer = styled(Container)`
    padding: 1em 1em`

//todo height calculate flex
export const AppHeader = () => {
    return <StyledContainer className="footer" style={{height: 'calc(100vh - 732px)'}}>
        {/*@ts-ignore*/}
        <Card style={{height:'100%', backgroundColor: 'rgba(255, 255, 255, 0.85)'}}>
            <CardContent style={{height: '100%'}}>
                <FlexBox justifyContent='center'>
                    <div>
                        сделано в
                        {' '}
                        <Button size="small" href="https://lobanovsky.ru">Бюро Лобановского</Button>
                        ♡
                    </div>
                </FlexBox>
            </CardContent>
        </Card>
    </StyledContainer>
}
