import styled from "styled-components";

export type StyledComponentProps<T> = T & { children?: JSX.Element | JSX.Element[] };

interface FlexBoxProps {
    gap?: string;
    height?: string;
    inline?: boolean,
    'flex-direction'?: 'column' | 'row' | 'row-reverse' | 'column-reverse',
    justifyContent?: string;
    widthPercent?: number
}

export const FlexBox = styled.div<StyledComponentProps<FlexBoxProps>>`
    display: ${(p: any) => (p.inline ? 'inline-flex' : 'flex')};
    gap: ${(p: any) => `${p.gap || '1em'}`};
    align-items: center;
    flex-direction: ${(p: any) => p['flex-direction'] || 'column'};
    justify-content:  ${(p: any) => p.justifyContent || 'flex-end'};
    width: ${(p: any) => (p?.widthPercent || 0) > 0 ? `${p.widthPercent}%` : 'auto'};
    height: ${(p: any) => p.height || '100%'};
`;
