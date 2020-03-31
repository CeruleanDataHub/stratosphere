import React from "react";
import styled from "styled-components";
import header from "../assets/images/Header.png"

const Main = styled.article`
    min-height: 100vh;
    background-image: url(${ props => props.image });
    background-repeat: no-repeat;
    background-color: #ffffff;
    background-attachment: fixed;
    background-position: left -15em;
`;

export default class Application extends React.Component {

    render() {
        return (
            <Main id="header" image={ header }>
                { this.props.children }
            </Main>
        );
    }
}