import styled from 'styled-components';
import BackgroundImg from 'images/background.svg';
import BackgroundPage from 'images/AI-Camera.jpg';
import { Button } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
  
  background-size: cover;
  display: flex;
  background-image: repeating-linear-gradient(
    45deg,
    hsla(312, 0%, 63%, 0.05) 0px,
    hsla(312, 0%, 63%, 0.05) 10px,
    transparent 10px,
    transparent 100px
  ),
  repeating-linear-gradient(
    90deg,
    hsla(312, 0%, 63%, 0.05) 0px,
    hsla(312, 0%, 63%, 0.05) 50px,
    transparent 50px,
    transparent 100px
  ),
  linear-gradient(90deg, hsl(80, 0%, 20%), hsl(80, 0%, 20%));
  background-image: url("${BackgroundPage}");
`;
export const LoginContainer = styled.div`
  & {
    display: flex;
    margin: auto;
    width: 620px;
    box-shadow: -5px 2px 50px 8px rgba(0, 0, 0, 0.25);
    flex-direction: row;
    border-radius: 20px
  }
  @media (max-width: 900px) {
    & {
      flex-direction: column;
      max-width: 34.5rem;
    }
  }
}
`;
export const LogoImageDesktop = styled.div`
  & {
    flex: 1;
    align-self: center;
    text-align: center;
    border-radius: 20px;
  }
  @media (max-width: 900px) {
    & {
      display: none;
    }
  }
`;
export const LoginFormContainer = styled.div`
  & {
    flex-basis: 100%;
    min-height: fit-content;
    padding: 40px 80px;
    background-color: #fff;
    border-radius: 20px;
  }
  @media (max-width: 900px) {
    & {
      border-radius: 20px;
    }
  }
`;
export const LogoImageMobile = styled.div`
  text-align: center;
  @media (min-width: 900px) {
    & {
      display: none;
    }
  }
`;
export const LoginForm = styled.div`
  & .item {
    width: 100%;
    padding: 0 10px;
    margin-top: 6px;
    background: #f6f6f6;
    box-sizing: border-box;
    border-radius: 23px;
  }
`;

export const FormTitle = styled.div`
  margin: 0px;
  font-family: Roboto;
  display: flex;
  & button {
    padding: 0;
    border: none;
    margin-right: 25px;
    background-color: #fff;
    cursor: pointer;
  }
  & p {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 42px;
    color: rgba(0, 0, 0, 0.8);
    flex: 1;
    text-align: center;
  }
`;

export const FormContent = styled.div`
  margin: 52px 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
`;

export const Label = styled.div`
  & {
    margin-top: 24px;
    height: 18px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #999999;
  }
`;

export const SubmitButton = styled(Button)`
  border-radius: 20px !important;
  width: 100%;
  height: 42px;
  padding: 8px 18px !impotant;
`;

export const LinkContainer = styled.div`
  text-align: center;
  margin-top: 52px;
`;

export const A = styled.a`
  font-size: 16px;
  line-height: 19px;
  color: #00554a !important;
  text-decoration: none;

  &:hover {
    color: #6cc0e5;
  }
`;
export const ErrorText = styled.span`
  margin-top: 6px;
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #ff0000;
`;
