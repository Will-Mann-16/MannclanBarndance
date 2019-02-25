import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import InviteeForm from './InviteeForm';
import styled from 'styled-components';

const InviteeQuery = gql`
    query InviteeQuery($token: String!){
      invitees(where:{token: $token}){
        id
        name
        email
        phone
        noOfAttendees
        attendees {
            id
            firstname
            lastname
            attending
            dietary
            accommodation
            additional
        }
      }
    }
`;


const Flex = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: stretch;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    & > * {
        padding: 10px;
    }
`;
export default class MainPage extends Component {
    render() {
        return this.props.match.params.token === '' ? (<h1>You need a token</h1>) : (
                <Query query={InviteeQuery} variables={{token: this.props.match.params.token}}>
                    {({data, loading}) => {
                        if(loading) return <p>Loading</p>;
                        return data.invitees.map((invitee, key) => <div key={key}>
                            <h1>Dear {invitee.name}</h1>
                            <h3>We hope you can join us on Saturday March 30th at 7pm for our Barn Dance.</h3>
                            <Flex>
                            {invitee.attendees.map((attendee, i) => <InviteeForm inviteeID={invitee.id} attendee={attendee} id={attendee.id} />)}
                            {[...Array(invitee.noOfAttendees - invitee.attendees.length)].map((x, i) => <InviteeForm inviteeID={invitee.id}/>)}
                            </Flex>
                        </div>)
                    }}
                </Query>
        );
    }
}