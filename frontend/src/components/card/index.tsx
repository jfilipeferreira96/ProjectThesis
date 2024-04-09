import React from "react";
import { useEffect, useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem, Card } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import styled from 'styled-components';

const StyledCard = styled(Card)`
  perspective: 1000px; /* Define a perspectiva para o efeito 3D */
  transform-style: preserve-3d; /* Mantém a transformação 3D dos elementos filhos */

  &:hover {
    transform: rotateY(10deg); /* Rotaciona a carta em relação ao eixo Y ao passar o mouse sobre ela */
  }
`;

interface Props {
  children: React.ReactNode;
  defaultHeight?: string; 
}

export function GiggleCard(props: Props) {
  const { children, defaultHeight } = props;

  return (
    <StyledCard style={{ height: defaultHeight }} withBorder radius="md">
      {children}
    </StyledCard>
  );
}
