import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import './font-awesome/css/font-awesome.css';
import './css/agency.min.css';
import './css/bootstrap.min.css';
import './css/login.css';
import io from "socket.io-client";
import axios from 'axios';


class Chat extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: []
        };

        this.socket = io('localhost:3001');
        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });
        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };
        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message
            });
            this.setState({message: ''});
        }

        this.getUser = data => {
            axios.post('/getUser', {
                useremail: data,
            })
            .then(function (response) {
                if(response.data === "InvalidUserEmail"){
                    alert('Unregistration UserEmail!');
                }else if(response.data==='WrongPassword'){
                    alert('Invalid UserPassword!');
                }else if(response.data==="Successful"){
                    browserHistory.push('/');
                }
            })
        }
        
    }
    componentDidMount() {
        this.getUser("toms63@yahoo.com");
    }
    render() {
        return (
            <div className="Chat">
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-content">

                                    <strong>Chat room v.1</strong> can be used to create chat room in your app. In first version there is a html template.
                                    In next versions of Inspinia we will add more design options. Feel free to write to us on <span className="text-navy">support@webapplayer.com</span>  if you need any help with implemnetation.

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">

                                <div className="ibox chat-view">

                                    <div className="ibox-title">
                                        <small className="pull-right text-muted">Last message:  Mon Jan 26 2015 - 18:39:23</small>
                                        Chat room panel
                                    </div>


                                    <div className="ibox-content">

                                        <div className="chatroom">

                                            <div className="col-md-3">
                                                <div className="chat-users">


                                                    <div className="users-list">
                                                        <div className="chat-user">
                                                            <img className="chat-avatar" src="img/team/a4.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Karl Jordan</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <img className="chat-avatar" src="img/team/a1.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Monica Smith</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <span className="pull-right label label-primary">Online</span>
                                                            <img className="chat-avatar" src="img/team/a2.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Michael Smith</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <span className="pull-right label label-primary">Online</span>
                                                            <img className="chat-avatar" src="img/team/a3.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Janet Smith</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <img className="chat-avatar" src="img/team/a5.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Alice Smith</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <img className="chat-avatar" src="img/team/a6.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Monica Cale</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <img className="chat-avatar" src="img/team/a2.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Mark Jordan</a>
                                                            </div>
                                                        </div>
                                                        <div className="chat-user">
                                                            <span className="pull-right label label-primary">Online</span>
                                                            <img className="chat-avatar" src="img/team/a3.jpg" alt="" />
                                                            <div className="chat-user-name">
                                                                <a href="">Janet Smith</a>
                                                            </div>
                                                        </div>


                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-md-9 ">
                                                <div className="chat-discussion">
                                                    {this.state.messages.map(message => {
                                                        return (
                                                            <div className="chat-message">
                                                                <img className="message-avatar" src="img/team/a6.jpg" alt="" />
                                                                <div className="message">
                                                                    <a className="message-author" href="">{message.author}</a>
                                                                    <span className="message-date">  Fri Jan 25 2015 - 11:12:36 </span>
                                                                    <span className="message-content">
                                                                        {message.message}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    
                                                </div>

                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="chat-message-form">

                                                    <div className="form-group">

                                                        {/* <textarea className="form-control message-input" name="message" placeholder="Enter message text"></textarea> */}
                                                        <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
                                                        <br/>
                                                        <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                                                        <br/>
                                                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                                                        </div>

                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

}

export default Chat;