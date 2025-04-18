import {Button, Container, styled} from "@mui/material";
import React from "react";
import {FlexBox} from "../../styled";

const StyledContainer = styled(Container)`
    padding: 1em 1em`

//todo height calculate flex
export const AppHeader = () => {
    return <StyledContainer className="footer" style={{height: 'calc(100vh - 732px)'}}>
        {/*@ts-ignore*/}
        <FlexBox justifyContent='center'>
            <div>
                сделано в
                {' '}
                <Button size="small" href="https://lobanovsky.ru">Бюро Лобановского</Button>
                ♡
            </div>

        </FlexBox>

    </StyledContainer>
}
