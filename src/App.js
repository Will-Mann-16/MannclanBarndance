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

const Image = styled.img`
    width: 960px;
    height: auto;
    @media(max-width: 960px){
        width: 100%;
    }
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
    height: 100%;
`;

const Footer = styled.footer`
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
                                <Image src={image}/>
                            </Header>
                            <Main>
                                <Switch>
                                    <Route path="/" exact>
                                        <div>
                                        <h1>Welcome to the Mannclan Barn Dance of 2019!</h1>
                                        <p>Information about this event can be seen on your emails, or on this webpage here. Each link sent to the recipients are unique, so are required to sign up with this site.</p>
                                        </div>
                                    </Route>
                                    <Route path="/mannclan-admin" exact component={AdminPage} />
                                    <Route path="/:token" component={MainPage} />
                                    <Route component={NotFoundPage}/>
                                </Switch>
                            </Main>
                            <Footer>
                                <h3>We look forward to seeing you!</h3>
                                <p>Lockram House can be found about halfway along Lockram Lane, set back from the road in between the grass triangle and the cream half-timbered cottage (we are NOT Lockram Farmhouse).</p>
                                <p>Call <a href="tel:+447831171097">07831 171097</a> if you get lost.</p>
                            </Footer>
                        </Fragment>
                    </Router>
                </Wrapper>
            </ApolloProvider>
        );
    }
}

export default App;
