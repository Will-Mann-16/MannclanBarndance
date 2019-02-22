import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';

const createAttendee = gql`
    mutation createAttendee($firstname: String!, $lastname: String!, $attending: Boolean!, $dietary: String!, $accommodation: Boolean!, $additional: String!, $invitee: ID!){
        createAttendee(data: {status: PUBLISHED, firstname: $firstname, lastname: $lastname, attending: $attending, dietary: $dietary, accommodation: $accommodation, additional: $additional, invitee: {connect: {id: $invitee}}}){
            id
        }
    }
`;


const editAttendee = gql`
    mutation editAttendee($id: ID!, $firstname: String!, $lastname: String!, $attending: Boolean!, $dietary: String!, $accommodation: Boolean!, $additional: String!){
        updateAttendee(data: {status: PUBLISHED, firstname: $firstname, lastname: $lastname,  attending: $attending, dietary: $dietary, accommodation: $accommodation, additional: $additional}, where: {id: $id}){
            id
        }
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  border: 2px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    margin: 10px;
    input {
  padding: 12px 20px;
  margin: 8px 0;
    border: 2px solid #ccc;
      border-radius: 4px;
        background-color: #f8f8f8;
    }
    textarea {
  height: 150px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  resize: none;
}
button {
    margin: 10px 0;
    padding: 8px 16px;
    color: white;
    background-color: #2ecc71;
    &:hover{
        background-color: #27ae60;
    }
    cursor: pointer;
}
`;

export default class InviteeForm extends React.Component{
    state = {
        firstname: '',
        lastname: '',
        dietary: '',
        attending: true,
        accommodation: false,
        additional: '',
        success: false
    }
    componentWillMount(){
        this.setState({...this.state, invitee: this.props.inviteeID});
        if(this.props.attendee){
            this.setState({...this.state, ...this.props.attendee});
        }
    }

    handleChange = e => this.setState({...this.state, [e.target.name]: e.target.value});

    handleSwitchChange = e => this.setState({...this.state, [e.target.name]: e.target.value === 'on'});

    render(){
        return (
            <Mutation mutation={this.props.id ? editAttendee : createAttendee} variables={this.props.id ? {...this.state, id: this.props.id} : this.state}>
                {attendeeFunction => <Form onSubmit={(e) => {
                    e.preventDefault();
                    attendeeFunction().then(({data}) => {
                        if((this.props.id && data.updateAttendee.id) || (!this.props.id && data.createAttendee.id)){
                            this.setState({...this.state, success: true});
                        }
                    });
                }}>
                    <h2>New Person</h2>
                    {this.state.success && <div>
                        <h2>Thank you!</h2>
                        <p>{this.state.firstname} {this.state.lastname} {this.props.id ? 'updated' : 'registered'}!</p>
                    </div>}
                    <input onChange={this.handleChange} value={this.state.firstname} name="firstname" placeholder='Firstname' />
                    <input onChange={this.handleChange} value={this.state.lastname} name="lastname" placeholder='Lastname' />
                    <label>Attending?</label>
                    <input type="checkbox" onChange={this.handleSwitchChange} checked={this.state.attending} name='attending'/>
                    <textarea onChange={this.handleChange} value={this.state.dietary} name="dietary" placeholder='Dietary Requirements' />
                    <label>Do you need accommodation under canvas?</label>
                    <input type="checkbox" onChange={this.handleSwitchChange} checked={this.state.accommodation} name='accommodation'/>
                    <textarea onChange={this.handleChange} value={this.state.additional} name="additional" placeholder='Additional Notes' />
                    <button type="submit">Submit</button>
                </Form>
                }
            </Mutation>
        );
    }
}