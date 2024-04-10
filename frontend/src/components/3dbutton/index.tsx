import { Box, Paper } from '@mantine/core';
import React, { ReactNode } from 'react'
import styled from 'styled-components';

const Pushable = styled.button<{ width?: number }>`
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  width: 100%;

  &:hover {
    filter: brightness(110%);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    &:hover {
      filter: none;
    }
  }
`;

const Shadow = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: hsl(0deg 0% 0% / 0.25);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
`;

const Edge = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: ${(props) => props.color};
`;

const Front = styled.span<{ disabled?: boolean; smaller?: boolean }>`
  display: block;
  position: relative;
  padding: ${(props) => props.smaller ? "6px 42px" : "12px 42px" };
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--mantine-color-white);
  background: hsl(345deg 100% 47%);
  background: ${(props) => `var(--mantine-color-${props.color}-filled)`};
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  min-width: 230px;

  ${(props) =>
    props.disabled
      ? `
        filter: brightness(80%);
      `
      : `
        &:hover {
          transform: translateY(-6px);
          transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
        }

        &:active {
          transform: translateY(-2px);
          transition: transform 34ms;
        }
      `}
`;


type Props = {
  children: ReactNode;
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "white";
  onClick?: () => void;
  disabled?: boolean;
  smaller?: boolean;
  mt?: "sm" | "md" | "lg" | "xl";
  type?: any;
  width?: number;
};

function ThreeDButton(props:Props) {
    const { children, color, onClick, disabled, mt, smaller } = props;
    
    const colorStyles: Record<string, string> = {
      blue: "linear-gradient(to left, #145d9c 0%, #104e80 8%, #0d3e64 92%, #104e80 100%)",
      red: "linear-gradient(to left, #b02a2a 0%, #8c2424 8%, #671d1d 92%, #421616 100%)",
      green: "linear-gradient(to left, #007a5a 0%, #00664d 8%, #00523f 92%, #00664d 100%)",
      yellow: "linear-gradient(to left, #ffd000 0%, #e6b800 8%, #cc9e00 92%, #e6b800 100%)",
      purple: "linear-gradient(to left, #7a36b1 0%, #643097 8%, #4d257d 92%, #643097 100%)",
    };

    const bgColor = color ? colorStyles[color] : colorStyles.blue;
    
  return (
    <Box mt={mt}>
      <Pushable onClick={onClick} disabled={disabled}>
        <Shadow></Shadow>
        <Edge color={bgColor}></Edge>
        <Front color={color} disabled={disabled} smaller={smaller}>
          {children}
        </Front>
      </Pushable>
    </Box>
  );
}

export default ThreeDButton