import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import axios from 'axios';
import swal from 'sweetalert2'
import md5 from 'md5';
import './css/login.css';
import './css/style.css';
import './css/bootstrap.min.css';
import './font-awesome/css/font-awesome.css';
import './css/animate.css';
import appConfig from './config/config.js'

class Regestration extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            useremail: '',
            userpassword: '',
            confirmpassword: '',
            address:'',
            sex:'male',
            birthday:'',
            strenth:'0',
            probar:''
        };

        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this);
        this.userCheck = this.userCheck.bind(this);
        this.validation = this.validation.bind(this);
    }

    alarm(msg){
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada'
        })
    }
      
    validation(psw){
        
        var strength = 0;

        if(psw.length<=7){
            strength = psw.length*10;
        }else{
            strength = 70;
        }

        var re = {
            'capital' : /[A-Za-z]/,
            'digit'   : /[0-9]/,
            'charactor' : /[ !@#$%^&*()_+\-=\]{};':"\\|,.<>?]/,
        };

        if( re.capital.test(psw)){
            strength = strength + 10;
        }
        if( re.digit.test(psw)){
            strength = strength + 10;
        }
        if( re.charactor.test(psw)){
            strength = strength + 10;
        }
        
        if(strength<40){
            this.setState({probar:"lower"})
        }else if(strength<70){
            this.setState({probar:"middle"})
        }else{
            this.setState({probar:"strong"})            
        }
        this.setState({strenth:strength});  
        this.setState({userpassword:psw});
        
    }

    onhandleChange(event) {
        if (event.target.name === "username") {
            this.setState({ username: event.target.value });
        }else if (event.target.name === "useremail") {
            this.setState({ useremail: event.target.value });
        }else if (event.target.name === "userpassword") {
            this.validation(event.target.value);            
        } else if (event.target.name === "confirmpassword") {
            this.setState({ confirmpassword: event.target.value });
        }else if (event.target.name === "radio") {
            this.setState({ sex: event.target.value });
        }else if (event.target.name === "birthday") {
            this.setState({ birthday: event.target.value });
        }else if (event.target.name === "address") {
            this.setState({ address: event.target.value });
        }
    }

    onhandleSubmit(event) {
        var self = this;
        if (event.target.value !== "Login") {
            if(!this.state.useremail){
                this.alarm("Please Input UserEmail!");
                return;
            }
            if (this.state.userpassword !== this.state.confirmpassword) {
                this.alarm('Do not match user password!');
                return;
            }
            axios.post('/regester', {
                username: this.state.username,
                useremail: this.state.useremail,
                userpassword: md5(this.state.userpassword),
                sex: this.state.sex,
                address: this.state.address,
                birthday: this.state.birthday
            })
            .then(function (response) {
                if (response.data === 'Exist') {
                    self.alarm('This user already exist!');
                } else {
                    browserHistory.push('/login');
                }
            }).then(function (body) {
            });
        } else {
            browserHistory.push('/');
        }
    }

    userCheck(event){
        var self = this;
        if(this.state.useremail===""){
            this.alarm("Input UserEmail!");
        }else{
            axios.post('/usercheck', {
                useremail: self.state.useremail,
            })
            .then(function (response) {
                if (response.data === 'New') {
                    self.alarm('This is new User !');
                } else {
                    self.alarm('You already regestered !');
                }
            }).then(function (body) {
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
                        <h3 className="welcome">User Registeration</h3>
                    </div>
                    <form className="m-t" >
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Name" name="username" value={this.state.username} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control re-useremail" placeholder="Email" name="useremail" value={this.state.useremail} onChange={this.onhandleChange} required="" />
                            <a  value="Check" id="usercheck" className="re-emailcheck btn btn-white btn-bitbucket" onClick={this.userCheck}><i className="fa fa-user-md"></i></a>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" name="userpassword" value={this.state.userpassword} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Confirm Password" name="confirmpassword" value={this.state.confirmpassword} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="radio">
                            <p className="sex-label">Sex :</p>
                            <input id="radio-1" name="radio" type="radio" value="male" onChange={this.onhandleChange} checked />
                            <label htmlFor="radio-1" className="radio-label">Male</label>
                            <input id="radio-2" name="radio" type="radio" value="female" onChange={this.onhandleChange} />
                            <label  htmlFor="radio-2" className="radio-label">Female</label>
                        </div>
                        <div className="form-group">
                            <input type="date" className="form-control" placeholder="Birthday" name="birthday" value={this.state.birthday} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Address" name="address" value={this.state.address} onChange={this.onhandleChange} required="" />
                        </div>
                        <Progress
                            percent={this.state.strenth}
                            status= {this.state.probar}
                            theme={{
                                lower: {
                                color: 'rgb(197, 21, 21)'
                                },
                                middle: {
                                color: 'rgb(218, 170, 16)'
                                },
                                strong: {
                                color: 'rgb(4, 134, 4)'
                                }
                            }}
                        />
                        <a  className="btn btn-primary block full-width m-b" value="Registration"  onClick={this.onhandleSubmit}>Register</a>
                        <p className="text-muted text-center"><small>Already have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/login">Login</a>
                    </form>
                </div>
            </div>
        );
    }
}

export default Regestration;


