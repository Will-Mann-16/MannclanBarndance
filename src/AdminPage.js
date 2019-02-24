import React from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import styled from 'styled-components';
import uuid from 'uuid/v1';

const Form = styled.form`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: row;
    & > *{
        flex-grow: 1;
    }
`;

const AdminQuery = gql`
    query AdminQuery{
        invitees{
            name
            email
            noOfAttendees
            token
        }
        attendees{
            firstname
            lastname
            dietary
            attending
            additional
            accommodation
        }
    }
`;

const CREATE_INVITEE = gql`
    mutation createInvitee($name: String!, $email: String, $phone: String, $token: String!, $noOfAttendees: Int!){
        createInvitee(data: {status: PUBLISHED, name: $name, email: $email, phone: $phone, token: $token, noOfAttendees: $noOfAttendees}){
            id
        }
    }
`;

export default class AdminPage extends React.Component{
    state = {
        invitees: [],
        newInvitee: {
            name: '',
            email: '',
            noOfAttendees: 0,
            token: uuid()
        }
    }
    countWords = (str) => {
        if(!str) return 0;
        var matches = str.match(/[\w\d\’\'-]+/gi);
        return matches ? matches.length : 0;
    }

    handleImport = (e) => {
        const selectedFile = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, {type: "binary"});
            const sheetName = workbook.SheetNames[0];
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const invitees = [];
            for(let i = 0; i < json.length; i++){
                const {Salutation, email} = json[i];
                if(Salutation !== '*'){
                    if(i + 1 < json.length){
                        var newSalutation = json[i + 1].Salutation;
                        var counter = 1;
                        while(newSalutation === '*' && counter + 1 + i < json.length){
                                newSalutation = json[counter + 1 + i].Salutation;
                                counter += 1;
                        }
                    }
                    invitees.push({name: Salutation, email, noOfAttendees: counter >= this.countWords(Salutation) ? counter : this.countWords(Salutation), token: uuid()});
                }
            }
            this.setState({...this.state, invitees});
        }
        reader.readAsBinaryString(selectedFile);
    }
    downloadExcel(data){
        var jsonArr = [];
        data.forEach(row => {
            jsonArr.push({
                Salutation: row.name,
                Email: row.email,
                NumberOfPeople: row.noOfAttendees,
                Token: row.token
            });
        });
        var ws = XLSX.utils.json_to_sheet(jsonArr, {
            header: ['Salutation', 'Email', 'NumberOfPeople', 'Token']
        });
        var wb = XLSX.utils.book_new();
        wb.SheetNames.push('Barndance');
        wb.Sheets['Barndance'] = ws;
        const s2ab = function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };
        var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        var wbout = XLSX.write(wb, wopts);
        FileSaver.saveAs(
            new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
            'barndance.xlsx'
        );

    }
    render(){
        return (
          <div>
            <h1>Admin Page</h1>
              <Query query={AdminQuery}>
                  {({data, loading}) => loading ? <p>Loading</p> :
                      <div>
                      <h2>Import Excel File</h2>
                          <input type="file" onChange={this.handleImport}/>
                          {this.state.invitees.map((invitee, key) =>
                          <Mutation mutation={CREATE_INVITEE} variables={invitee} key={key}>
                              {createInvitee =>
                                  <button onClick={createInvitee}>{invitee.name}</button>
                              }
                          </Mutation>
                          )}
                          <h2>Invited</h2>
                          <Mutation mutation={CREATE_INVITEE} variables={this.state.newInvitee}>
                              {createInvitee =>
                                  <Form onSubmit={e => {
                                      e.preventDefault();
                                      createInvitee().then(() => this.setState({...this.state, newInvitee: {
                                          name: '',
                                              email: '',
                                              noOfAttendees: 0,
                                              token: uuid()
                                      }}));
                                  }}>
                                      <input onChange={e => this.setState({...this.state, newInvitee: {...this.state.newInvitee, name: e.target.value}})} placeholder="Name"/>
                                      <input onChange={e => this.setState({...this.state, newInvitee: {...this.state.newInvitee, email: e.target.value}})} placeholder="Email"/>
                                      <input onChange={e => this.setState({...this.state, newInvitee: {...this.state.newInvitee, noOfAttendees: parseInt(e.target.value)}})} placeholder="Number of people coming" type="number"/>
                                      <button type='submit'>Submit</button>
                                  </Form>
                              }
                          </Mutation>
                          <button onClick={() => this.downloadExcel(data.invitees)}>Download Excel</button>
                          <table>
                              <tbody>
                              <tr>
                                  <th>
                                      Name
                                  </th>
                                  <th>
                                      Email
                                  </th>
                                  <th>
                                      No. Of People
                                  </th>
                                  <th>Token</th>
                              </tr>
                              {data.invitees.map((invitee) =>
                                  <tr>
                                      <td>{invitee.name}</td>
                                      <td>{invitee.email}</td>
                                      <td>{invitee.noOfAttendees}</td>
                                      <td>{invitee.token}</td>
                                  </tr>
                              )}
                              </tbody>
                          </table>
                          <h2>Attendees</h2>

                      <table>
                      <tbody>
                      <tr>
                          <th>
                              Firstname
                          </th>
                          <th>
                              Lastname
                          </th>
                          <th>
                              Attending?
                          </th>
                          <th>Dietary Requirements</th>
                          <th>Accommodation?</th>
                          <th>Additional Notes</th>
                      </tr>
                          {data.attendees.map((attendee) =>
                            <tr>
                                <td>{attendee.firstname}</td>
                                <td>{attendee.lastname}</td>
                                <td>{attendee.attending ? 'Yes' : 'No'} </td>
                                <td>{attendee.dietary}</td>
                                <td>{attendee.accommodation ? 'Yes' : 'No'}</td>
                                <td>{attendee.additional}</td>
                            </tr>
                          )}
                      </tbody>
                  </table>

                      </div>}
              </Query>
          </div>
        );
    }
}