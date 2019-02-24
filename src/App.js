import React, { Component, Fragment } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './MainPage';
import AdminPage from './AdminPage';
import styled from 'styled-components';
import image from './image001.jpg';

const client = new ApolloClient({
    uri: 'https://api-euwest.graphcms.com/v1/cjsasi0m3cz8y01gjwy0sp65f/master'
});

const Wrapper = styled.div`
    display: grid;
    height: 100vh;
    grid-template-areas: 'header' 'main' 'footer';
`;

const Header = styled.header`
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    background-color: white;
    border-bottom: 5px solid #333;
`;

const Main = styled.main`
    grid-area: main;
    max-width: 960px;
    margin: auto;
`;

const Footer = styled.footer`
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dcdde1;
`;


const NotFoundPage = ({location}) => (
    <React.Fragment>
        <h1>404 - Page Not Found</h1>
        <p>Unfortunately, the page {location.pathname} does not exist on our servers. Please return to the home page to view this website.</p>
    </React.Fragment>
)
class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Wrapper>
                    <Router>
                        <Fragment>
                            <Header>
                                <img src={image} style={{width: 960, height: 'auto'}}/>
                            </Header>
                            <Main>
                                <Switch>
                                    <Route path="/" exact>
                                        <div>
                                        <h1>Welcome to the Mannclan Barn Dance of 2019 web page.</h1>
                                        <p>Information</p>
                                        </div>
                                    </Route>
                                    <Route path="/mannclan-admin" exact component={AdminPage} />
                                    <Route path="/:token" component={MainPage} />
                                    <Route component={NotFoundPage}/>
                                </Switch>
                            </Main>
                            <Footer>
                                <h3>We look forward to seeing you!</h3>
                            </Footer>
                        </Fragment>
                    </Router>
                </Wrapper>
            </ApolloProvider>
        );
    }
}

export default App;
