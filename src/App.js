import React, { Component, Fragment } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './MainPage';
import AdminPage from './AdminPage';
import styled from 'styled-components';

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
    background-color: #273c75;
    color: white;
    text-align: center;
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
                                <h1>Mannclan Barn Dance</h1>
                            </Header>
                            <Main>
                                <Switch>
                                    <Route path="/" exact>
                                        <h1>Welcome to the Mannclan Barn Dance of 2019 web page.</h1>
                                        <p>Information</p>
                                    </Route>
                                    <Route path="/mannclan-admin" component={AdminPage} />
                                    <Route path="/:token" component={MainPage} />
                                    <Route component={NotFoundPage}/>
                                </Switch>
                            </Main>
                            <Footer>
                                <h3>Powered by Mann Power</h3>
                            </Footer>
                        </Fragment>
                    </Router>
                </Wrapper>
            </ApolloProvider>
        );
    }
}

export default App;