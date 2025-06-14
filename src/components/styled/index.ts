import styled from "styled-components";
import {Button, Container as MuiContainer, TextField} from "@mui/material";

export type StyledComponentProps<T> = T & { children?: JSX.Element | JSX.Element[] };

interface FlexBoxProps {
    gap?: string;
    height?: string;
    inline?: boolean,
    'flex-direction'?: 'column' | 'row' | 'row-reverse' | 'column-reverse',
    'justify-content'?: string;
    widthPercent?: number
}

export const FlexBox = styled.div<StyledComponentProps<FlexBoxProps>>`
    display: ${(p: any) => (p.inline ? 'inline-flex' : 'flex')};
    gap: ${(p: any) => `${p.gap || '1em'}`};
    align-items: ${(p: any) => p['align-items'] || 'center'};;
    flex-direction: ${(p: any) => p['flex-direction'] || 'column'};
    justify-content:  ${(p: any) => p['justify-content'] || 'flex-end'};
    width: ${(p: any) => (p?.widthPercent || 0) > 0 ? `${p.widthPercent}%` : 'auto'};
    height: ${(p: any) => p.height || 'auto'};
`;

export const SimpleButton = styled(Button)`
    text-transform: none !important;
`

export const FormInput = styled(TextField)`
    width: 100%;
    margin-bottom: 1.5em !important;
`

export const Container = styled(MuiContainer)<{padding?: string}>`
    padding: ${(p: any) => p.padding || '1em'};
`
