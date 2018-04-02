import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import swal from 'sweetalert2';
import './font-awesome/css/font-awesome.css';
import './css/agency.min.css';
import './css/bootstrap.min.css';
import './css/login.css';
import io from "socket.io-client";
import axios from 'axios';
import appConfig from './config/config.js'
import moment  from 'moment';
import Textarea from 'react-textarea-autosize';
import ReactDOM from 'react-dom';
import Notifier from "react-desktop-notification"

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: [],
            users: [],
            useremail: '',
            searchInput: true,
            newemail: '',
            selUserIndex: 0,
            userstate: ''
       };

        this.socket = io(appConfig.originUrl);

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            if (data.sender === this.state.useremail) {
                this.setState({ messages: [...this.state.messages, data] });
            } else if (data.receiver === this.state.useremail) {
                document.title = "* Slack(React)";
                let userIndex = this.state.users.map(function (e) { return e.useremail; }).indexOf(data.sender)
                let count = (this.state.users[userIndex].unreadCount || 0)+1;
                let statusCopy = Object.assign({}, this.state);
                statusCopy.users[userIndex].unreadCount = count;
                this.desktopAlarm("New message from "+this.state.users[userIndex].username,data.message);
                this.setState(statusCopy);
                this.setState({ messages: [...this.state.messages, data] });
            }
        };

        this.sendMessage = () => {
            // ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                sender: this.state.useremail,
                receiver: this.state.users[this.state.selUserIndex].useremail,
                message: this.state.message,
                date: moment().unix()
            });
            this.setState({ message: '' });
        }

        this.getUser = data => {
            let self = this;
            axios.post('/getUserContact', {
                useremail: data,
            })
            .then(function (response) {
                try {
                    if (response.data.status === "success") {
                        self.setState({ users: response.data.users });
                        self.setState({ user: response.data.user });
                        // this.getMessages(0);
                    } else {
                        swal("Your contact is empty!");
                    }
                } catch (error) {
                    swal("Server Error");
                    return;
                }
            })
        }

        this.getMessages = (index) => {
            let self = this;
            axios.post('/getMessages', {
                sender: this.state.useremail,
                receiver: this.state.users[index].useremail
            })
                .then(function (response) {
                    try {
                        if (response.data.status === "success") {
                            document.title = "* Slack(React)";
                            self.setState({ messages: response.data.data });
                        } else {
                            swal("No messages!");
                        }
                    } catch (error) {
                        swal("Server Error");
                        return;
                    }
                })
        }

        this.controlEvent = (id, e) => {
            if (id === "add") {
                if (this.state.searchInput) {
                    this.setState({ searchInput: '' })
                } else {
                    this.setState({ searchInput: true })
                }
            } else if (id === "save") {
                if (this.state.newemail !== '') {
                    this.addNewContact(this.state.newemail);
                } else {
                    swal("Please input new Email to add on your contact!")
                }
            } else if (id === "sel") {
                let statusCopy = Object.assign({}, this.state);
                statusCopy.users[e.target.alt].unreadCount = 0;
                this.setState(statusCopy);
                this.setState({ selUserIndex: 1 });
                this.getMessages(e.target.alt);
            } else if (id === "logout") {
                localStorage.removeItem("slack");
                browserHistory.push('/');

            }
        }

        this.addNewContact = data => {
            let self = this;
            axios.post('/addNewContact', {
                useremail: this.state.useremail,
                newemail: this.state.newemail
            })
                .then(function (response) {
                    try {
                        self.setState({ newemail: '' });
                        if (response.data.status === "success") {
                            self.setState({ searchInput: true })
                            self.getUser(self.state.useremail);
                        } else {
                            swal("Invalid Email address!");
                        }
                    } catch (error) {
                        swal("Server Error")
                    }
                })
        }

        this.handlechange = (e) => {
            if (e.target.name === "newemail") {
                this.setState({ newemail: e.target.value });
            }
        }

        this.handleKeyPress = (e) => {
            // (function() {
            //     if ("Notification" in window) {
            //       let permission = Notification.permission;
              
            //       if (permission === "denied" || permission === "granted") {
            //         return;
            //       }
              
            //       Notification
            //         .requestPermission()
            //         .then(function() {
            //           let notification = new Notification("Hello, world!");
            //         });
            //     }
            //   })();
            if (e.nativeEvent.keyCode === 13) {
                if (e.nativeEvent.shiftKey) {
                }else{
                    this.sendMessage("e");
                }
            }
        }
        window.addEventListener('focus', function() {
            document.title = 'Slack(React)';
        });
        
        window.addEventListener('blur', function() {
        });

        this.desktopAlarm = (title,content)=>{
            Notifier.focus(title, content, "google.com", "icon_url")
        }
        this.getDateState = (index) =>{
            let lastDate="00:00:0000";
            let currentDate = moment.unix(this.state.messages[index].date).format('dddd, MMMM Do');
            if(index>0){
              lastDate  = moment.unix(this.state.messages[index-1].date).format('dddd, MMMM Do');
            }
            if(lastDate === currentDate){
                return false;
            }else{
                return true;
            }
           
        }
    }

    scrollToBottom = () => {
        const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    componentDidUpdate(){
        this.scrollToBottom();
    }
    componentDidMount() {
        try {
            const data = JSON.parse(atob(this.props.params.id));
            if (data[0].status !== "success") {
                browserHistory.push('/');
            } else {
                this.getUser(data[0].email);
                this.setState({ useremail: data[0].email });
            }
        } catch (error) {
            browserHistory.push('/');
        }       
    }
    render() {
        return (
            <div className="Chat">
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-content room-title">
                                    <h2><strong>Chat room</strong></h2>
                                    <ul className="logout">
                                        <li>
                                            <a className="logout" onClick={(e) => this.controlEvent("logout", e)}>
                                                <i className="fa fa-sign-out"></i> Log out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="ibox chat-view">

                                <div className="ibox-title">
                                    <small className="pull-right text-muted">Last message:  Mon Jan 26 2015 - 18:39:23</small>
                                    {/* <h4>Chat room panel</h4> */}
                                </div>


                                <div className="ibox-content">

                                    <div className="chatroom">

                                        <div className="col-md-3 chat-users-area">
                                            <div className="ibox-title chat-control">
                                                <h5>My Contact</h5>
                                                <div className="ibox-tools">
                                                    <a className="collapse-link binded" onClick={(e) => this.controlEvent("add", e)}>
                                                        <i className="fa fa-plus"></i>
                                                    </a>
                                                    <a className={this.state.searchInput ? 'hidden dropdown-toggle' : 'dropdown-toggle'} data-toggle="dropdown" onClick={(e) => this.controlEvent("save", e)}>
                                                        <i className="fa fa-save"></i>
                                                    </a>
                                                    <a className="close-link binded" onClick={(e) => this.controlEvent("close", e)}>
                                                        <i className="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={this.state.searchInput ? 'hidden add-user-find' : 'add-user-find'} >
                                                <input type="email" className="add-user-input" value={this.state.newemail} name="newemail" onChange={this.handlechange} />
                                            </div>
                                            <div className="chat-users">

                                                <div className="users-list">
                                                    {this.state.users.map((user, index) => {
                                                        let imgPath = "../img/team/a" + index + ".jpg";
                                                        return (
                                                            <div className={this.state.selUserIndex === index ? 'seletedUser chat-user' : 'chat-user'}>
                                                                <span className={user.unreadCount>0?"pull-right label label-primary unreadCount":"hidden"}>{user.unreadCount}</span>
                                                                <img className="chat-avatar" src={imgPath} alt={index} onClick={(e) => this.controlEvent("sel", e)} />
                                                                <i className="user-online fa fa-check">&nbsp;</i>
                                                                <div className="chat-user-name">
                                                                    <p>{user.username}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-9 ">
                                            <div>
                                                <img className="img-circle clientavatar" src={"../img/team/a" + this.state.selUserIndex + ".jpg"} alt="images" />
                                                <span className="clientname">{this.state.users.length >= 1 ? this.state.users[this.state.selUserIndex].username : "undefiend"}</span>
                                                <img className="img-circle myavatar" src="../img/team/a1.jpg" alt="images" />
                                                <span className="myname">{this.state.user ? this.state.user.username : "undefined"}</span>

                                            </div>
                                            <div className="chat-discussion" ref={(el) => { this.messagesContainer = el; }}>
                                                {/* <img  className="img-circle myavatar" src="../img/team/a1.jpg" alt="images" /><span>{this.state.user?this.state.user.username:"undefined"}</span> */}
                                                {   
                                                    this.state.messages.map((message, index) => {
                                                    let alignstatus = "1";
                                                    let dateShow_flag = true;
                                                    let date = moment.unix(message.date).format('dddd, MMMM Do, YYYY h:mm:ss A');
                                                    let currentDate = moment.unix(message.date).format('dddd, MMMM Do, YYYY');
                                                  
                                                    dateShow_flag = this.getDateState(index);

                                                    if (message.sender === this.state.useremail) {
                                                        alignstatus = "1";
                                                    } else {
                                                        alignstatus = "0";
                                                        let indexSender = this.state.users.map(function (e) { return e.useremail; }).indexOf(message.sender);
                                                        var receiverName = this.state.users[indexSender].username;
                                                    }

                                                    return (
                                                        <div>
                                                            <div className={dateShow_flag===true?"date-area":"hidden"}>
                                                                <span className="leftline">&nbsp;</span>
                                                                <h3 className="date-title">{currentDate}</h3>
                                                                <span className="rightline">&nbsp;</span>
                                                            </div>
                                                            <div className="chat-message">
                                                                <img className="message-avatar" src="../img/team/a6.jpg" alt="" />
                                                                <div className={alignstatus === "1" ? "message message-right" : "message message-left"}>
                                                                    <a className="message-author" href="">{alignstatus === "1" ? this.state.user.username : receiverName}</a>
                                                                    <span className={alignstatus === "1" ? "message-date message-date-left" : "message-date message-date-right"}>  {date} </span>
                                                                    <p className="message-content">
                                                                        {message.message}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                    </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="row text-input">
                                                <div className="col-lg-12">
                                                    <div className="chat-message-form">

                                                        <div className="form-group">
                                                            <Textarea className="message-text form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} onKeyUp={this.handleKeyPress.bind(this)} >
                                                            </Textarea>

                                                            <button onClick={this.sendMessage} className="btn btn-primary form-control send-btn">Send</button>
                                                            <br />
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
                </div>
            </div>
        );
    }

}

export default Chat;