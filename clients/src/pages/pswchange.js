import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import swal from 'sweetalert2';
import md5 from 'md5';
import './css/login.css';
import './css/style.css';
import './css/bootstrap.min.css';
import './font-awesome/css/font-awesome.css';
import './css/animate.css';


class Pswupdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userpassword: '',
            confirmpassword: '',
        };
        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this);
    }

    alarm(msg){
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada'
        })
    }

    validation(psw){
        
        // console.log(this.props.match.params.id);
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
        if (event.target.name === "userpassword") {
            this.validation(event.target.value);
        } else if (event.target.name === "confirmpassword") {
            this.setState({ confirmpassword: event.target.value });
        }
    }
    onhandleSubmit(event) {
        var self = this;
        if(self.state.userpassword===""){
            self.alarm("Please input UserPassword!");
            return;
        }
        if(self.state.confirmpassword===""){
            self.alarm("Please input Confirm Password!");
            return;
        }
        if(self.state.userpassword !== self.state.confirmpassword){
            self.alarm("Password does not match!");
            return;
        }

        axios.post('/pswupdate', {
            useremail: self.props.params.id,       
            userpassword: md5(self.state.userpassword)
        })
        .then(function (response) {
            if(response.data === "Successful"){
                self.alarm('Password was changed successfully!');
                browserHistory.push('/login');
            }else {
                self.alarm('Server error, Please retry!');                    
            }
        })
        .catch(function (error) {
        });
    }


    render() {
        return (
            <div className="middle-box text-center loginscreen  animated fadeInDown">
                <div>
                    <div>
                        <img className="logo-img" src="./img/logo.jpg" alt="" />
                    </div>
                    <div>
                        <h3 className="welcome">Password change form</h3>
                    </div>
                    <form className="m-t" >
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" name="userpassword" value={this.state.userpassword} onChange={this.onhandleChange} required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Confirm Password" name="confirmpassword" value={this.state.confirmpassword} onChange={this.onhandleChange} required="" />
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
                        <button type="button" className="btn btn-primary block full-width m-b" value="Login" onClick={this.onhandleSubmit} >Accept</button>
                        &nbsp;<br />
                        <a className="btn btn-sm btn-white btn-block" href="/login">Login</a>
                    </form>
                </div>
            </div>
        );
    }

}

export default Pswupdate;


