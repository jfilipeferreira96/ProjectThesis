import React from "react";
import { useEffect, useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem, Card } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import styled from 'styled-components';

const StyledCard = styled(Card)`
  border-width: 2px;
  border-bottom-width: 4px;
  min-height: 540px;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: border-bottom-width 0.2s ease; 

  &:hover {
    filter: brightness(90%);
    transition: filter 0.2s ease; 
  }

  &:active{
    border-bottom-width: 2px;
  }
`;

interface Props {
  children: React.ReactNode;
  defaultHeight?: string; 
  onClick?: any
}

export function GiggleCard(props: Props) {
  const { children, defaultHeight, onClick } = props;

  return (
    <StyledCard withBorder radius="md" onClick={onClick}>
      {children}
    </StyledCard>
  );
}
