import React from "react";
import styled from "styled-components";

const DashboardContainer = styled.section`
    margin-left: 18em;
    display: grid;
    grid-template-columns: auto auto auto;
`;

const CardDash = styled.div`
    margin: 2em;
    border-radius: 0.5em;
    border: 2px dashed #ffffff;
`
const Card = styled.div`
    margin: 1em;
    border-radius: 0.25em;
    border: 1px solid #000000;
    background-color: #ffffff;
    height: 20em;
`

export default class Dashboard extends React.Component {

    render() {
        return (
            <DashboardContainer id="dashboard">
                <CardDash>
                    <Card></Card>
                </CardDash>
                <CardDash>
                    <Card></Card>
                </CardDash>
                <CardDash>
                    <Card></Card>    
                </CardDash>    
            </DashboardContainer>
        )
    }
   ;
}