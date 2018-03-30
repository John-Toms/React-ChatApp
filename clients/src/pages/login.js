import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import swal from 'sweetalert2';
import md5 from 'md5';

import './css/login.css';
import './css/style.css';
import './css/bootstrap.min.css';
import './font-awesome/css/font-awesome.css';
import './css/animate.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            useremail: '',
            userpassword: '',
            confirmpassword: '',
            stateMsg:'',
            rememberStatus:false,
        };
        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.rememeberAction = this.rememeberAction.bind(this);
    }

    alarm(msg){
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada'
        })
    }

    onhandleChange(event) {
        if (event.target.name === "useremail") {
            this.setState({ useremail: event.target.value });
        } else if (event.target.name === "userpassword") {
            this.setState({ userpassword: event.target.value });
        }
    }
    onhandleSubmit(event) {
        var self = this;
        if (event.target.value === "Login") {
            if(self.state.useremail===""){
                self.alarm("Please input UserEmail!");
                return;
            }
            if(! /@/.test(this.state.useremail)){
                self.alarm("It is not correct email type!");
                return;
            }
            if(self.state.userpassword===""){
                self.alarm("Please input UserPassword!");
                return;
            }

            axios.post('/login', {
                useremail: self.state.useremail,
                userpassword: md5(self.state.userpassword)
            })
            .then(function (response) {
                if(response.data.msg === "InvalidUserEmail"){
                    self.alarm('Unregistration UserEmail!');
                }else if(response.data.msg==='WrongPassword'){
                    self.alarm('Invalid UserPassword!');
                }else if(response.data.msg==="Successful"){
                    if(self.state.rememberStatus){
                        localStorage.setItem('slack', JSON.stringify(response.data.data));
                        const userStr = btoa(JSON.stringify([{email:response.data.data.useremail,status:"success"}]));
                        browserHistory.push('/chat/'+userStr);
                    }else{
                        localStorage.setItem('slack', JSON.stringify(response.data.data));
                        const userStr = btoa(JSON.stringify([{email:response.data.data.useremail,status:"success"}]));
                        browserHistory.push('/chat/'+userStr);                        
                    }
                    // localStorage.setItem('slack', response.data.data)
                }
            })
            .catch(function (error) {
            });
        } else {
            browserHistory.push('/register');
        }
    }

    sendEmail(e,value){
        var self = this;
        swal({
            title: 'Please input your email!',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (email) => {
                axios.post('/re-password', {
                    useremail: email,
                })
                .then(function (response) {
                    self.setState({stateMsg:response.data})
                })
                .catch(function (error) {
                });    
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 4000)
                })        
            },
            allowOutsideClick: () => !swal.isLoading()
          })
          .then((result) => { 
            if(self.state.stateMsg==="Please check your mailbox!"){
                var state_flag = "success"; 
            }else{
                state_flag ="error";
            }
            if (result) {
              swal({
                type: state_flag,
                title: self.state.stateMsg 
              })
            }
          })
    }

    rememeberAction(value){
        this.setState({rememberStatus:value});
        console.log(value)
    }
    componentDidMount(){
        
        const usersSession = localStorage.getItem("slack");
        var temp2 = JSON.parse(usersSession)
        if (temp2) {
            console.log(temp2.userpassword)
            var self = this;
            axios.post('/login', {
                useremail: temp2.useremail,
                userpassword: temp2.userpassword
            })
            .then(function (response) {
                if(response.data.msg === "InvalidUserEmail"){
                    self.alarm('Unregistration UserEmail!');
                }else if(response.data.msg==='WrongPassword'){
                    self.alarm('Invalid UserPassword!');
                }else if(response.data.msg==="Successful"){    
                    const userStr = btoa(JSON.stringify([{email:response.data.data.useremail,status:"success"}]));
                    browserHistory.push('/chat/'+userStr);
                }
            })
            .catch(function (error) {
            });
        }
        
    }
    render() {

        return (

            <div className="middle-box text-center loginscreen  animated fadeInDown">
                <div>
                    <div>
                        <img className="logo-img" src="./img/logo.jpg" alt="" />
                    </div>
                    <div>
                        <h3 className="welcome">User Login</h3>
                    </div>
                    <form className="m-t" >
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="UserEmail" name="useremail" value={this.state.useremail} onChange={this.onhandleChange} required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" name="userpassword" value={this.state.userpassword} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="pretty p-default p-curve p-has-hover remember-area">
                            <input type="checkbox" onChange={(e) => this.rememeberAction(e.target.checked)}/>
                            <label className="remember">Remember me</label>
                        </div>
                        <button type="button" className="btn btn-primary block full-width m-b" value="Login" onClick={this.onhandleSubmit} >Login</button>

                        <a onClick={this.sendEmail}><small>Forgot password?</small></a>
                        <p className="text-muted text-center"><small>Do not have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/register">Create an account</a>
                    </form>
                </div>
            </div>
        );
    }

}

export default Login;


