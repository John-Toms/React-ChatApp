import React, { Component } from 'react';
import { Redirect, browserHistory } from 'react-router';
import axios from 'axios'
import './login.css';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            userpassword: '',
            confirmpassword: '',
        };
        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this);
    }
    onhandleChange(event) {
        if (event.target.name === "username") {
            this.setState({ username: event.target.value });
        } else if (event.target.name === "userpassword") {
            this.setState({ userpassword: event.target.value });
        }
    }
    onhandleSubmit(event) {
        if (event.target.value == "Login") {
            // fetch('/login',{
            //     method: 'POST',
            //     body: JSON.stringify({
            //       username: this.state.username,
            //       userpassword:this.state.userpassword
            //     }),
            //     headers: {"Content-Type": "application/json"}
            //   })
            //   .then(
            //       function(err){console.log(response.body);
            //       if(response.status=='201'){
            //           alert('Unregestration User');
            //       }else if(response.status=='202'){
            //         alert('Invalid Password !');
            //       }else if(response.status=="200"){
            //         browserHistory.push('/home');
            //       }
            //   }
            // ).then(function(body){
            // console.log(body);
            //   });
            axios.post('/login', {
                username: this.state.username,
                userpassword: this.state.userpassword
            })
            .then(function (response) {
                if(response.data === "InvalidUsername"){
                alert('Unregestration User');
                }else if(response.data=='WrongPassword'){
                alert('Invalid Password !');
                }else if(response.data=="Successful"){
                    browserHistory.push('/home');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        } else {
            browserHistory.push('/regestration');
        }
    }

    render() {
        return (
            <div className="Login">
                <form>
                    <h2>User Login form</h2>
                    <label>
                        User Name :
                <input type="text" name="username" value={this.state.username} onChange={this.onhandleChange} className="usernamel" />
                    </label>
                    <label>
                        User Password :
                <input type="password" name="userpassword" value={this.state.userpassword} onChange={this.onhandleChange} className="userpassword" />
                    </label>
                    <label>
                        <input type="button" value="Login" id="login" className="submitbtn" onClick={this.onhandleSubmit} />
                        <input type="button" value="Registration" id="registration" className="submitbtn" onClick={this.onhandleSubmit} />
                    </label>
                </form>
            </div>
        );
    }

}

export default Login;


