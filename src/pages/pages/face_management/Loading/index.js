import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingContainer = styled.div`
  position: fixed;
  z-index: var(--z-index-loading);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export function Loading() {

  return (
    <LoadingContainer>
      <CircularProgress />
    </LoadingContainer>
  );
}

Loading.propTypes = {};

export default Loading;
