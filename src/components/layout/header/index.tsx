
import React from "react";
import {Container, FlexBox} from "../../styled";
import {AuthDebugButtons} from "../../auth/DebugButtons";
import {IS_DEBUG} from "../../../utils/constants";

//todo height calculate flex
export const AppHeader = () => {
    return <Container className="header" style={{textAlign: 'end'}}>
        <FlexBox flex-direction='row'>
            <div className='made-in' style={{paddingLeft: '42px', flex: '1 0 auto', textAlign: 'center'}}>
                Сделано в
                <a href="https://lobanovsky.ru" target="_blank"
                   style={{textTransform: 'none', margin: '0 4px', color: '#1976d2', textDecoration: 'none'}}>Бюро Лобановского</a>
            </div>
            <AuthDebugButtons/>
        </FlexBox>

    </Container>
}
