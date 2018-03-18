import React, { Component } from 'react';
import { Redirect, browserHistory } from 'react-router';
import axios from 'axios'
// import Progress from 'react-progressbar';
import { Line, Circle } from 'rc-progress';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";


import './login.css';


class Regestration extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            userpassword: '',
            confirmpassword: '',
            address:'',
            sex:'',
            birthday:'',
            strenth:'0',
            users: [],
            probar:''
        };
        this.state = {
            render: false //Set render state to false
        }
        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this);
        this.userCheck = this.userCheck.bind(this);
        this.validation = this.validation.bind(this);
    }
    componentDidMount() {
        setTimeout(function(){
            this.setState({render: true})
        }.bind(this),100)
    }
      
    validation(){
        var psw = this.state.userpassword;
        
        var strength = 0;
        var re = {
            'capital' : /[A-Za-z]/,
            'digit'   : /[0-9]/,
            'charactor':/[@#]/,
            'full'    : /^[@#][A-Za-z0-9]{7,13}$/
        };
        console.log(psw);
        if( re.capital .test(psw)){
            strength = strength + 10;
        }else{
            // alert("You have to contain English Letters!");
            // return;
        }
        if( re.digit .test(psw)){
            strength = strength + 10;
        }else{
            // alert("You have to contain Digit !");
            // return;            
        }
        if( re.charactor .test(psw)){
            strength = strength + 10;
        }else{
            // alert("You have to contain Special characters!");
            // return;            
        }
        
        console.log("step1=",strength);
            if(psw.length<=7){
                strength = psw.length*10;
            }else {
                strength = 70 + strength;
                // strength = 70 - 30 + strength;
            }   
            console.log("step2=",strength);
            if(strength<40){
                this.setState({probar:"lower"})
            }else if(strength<70){
                this.setState({probar:"middle"})
            }else{
                this.setState({probar:"strong"})            
            }
            this.setState({strenth:strength});  
            if(psw.count<10){
                // alert("Userpassword must be at least 10 letters!")
            }  
        
    }

    onhandleChange(event) {
        if (event.target.name === "username") {
            this.setState({ username: event.target.value });
        } else if (event.target.name === "userpassword") {
            this.setState({ userpassword: event.target.value });
            setTimeout(function(){
                this.validation();
            }.bind(this),300)
            
        } else if (event.target.name === "confirmpassword") {
            this.setState({ confirmpassword: event.target.value });
        }else if (event.target.name === "gender") {
            this.setState({ sex: event.target.value });
        }else if (event.target.name === "birthday") {
            this.setState({ birthday: event.target.value });
        }else if (event.target.name === "address") {
            this.setState({ address: event.target.value });
        }
    }
    onhandleSubmit(event) {
        if (event.target.value != "Login") {
            this.validation();
            if (this.state.userpassword != this.state.confirmpassword) {
                alert('Do not match user password!');
                return;
            }
            // fetch('/regester',{
            //     method: 'POST',
            //     body: JSON.stringify({
            //       username: this.state.username,
            //       userpassword:this.state.userpassword,
            //     }),
            //     headers: {"Content-Type": "application/json"}
            //   })
                axios.post('/regester', {
                    username: this.state.username,
                    userpassword: this.state.userpassword,
                    sex: this.state.sex,
                    address: this.state.address,
                    birthday: this.state.birthday
                })
                .then(function (response) {
                    if (response.data == 'Exist') {
                        alert('This user already exist!');
                    } else {
                        browserHistory.push('/');
                    }
                }).then(function (body) {
                    // console.log(body);
                });
        } else {
            browserHistory.push('/');
        }
    }

    userCheck(event){
        if(this.state.username==""){
            alert("Input UserEmail!");
        }else{
            axios.post('/usercheck', {
                username: this.state.username,
            })
            .then(function (response) {
                if (response.data == 'New') {
                    alert('This is new User !');
                } else {
                    alert('You already regestered !');
                }
            }).then(function (body) {
                // console.log(body);
            });
        }
    }
    componentDidMount() {
    }

  

    render() {
        return (
            <div className="Regestration">
                <form>
                    <h2>User Regestration form</h2>
                    <label>
                        User Name :
                        <span className="userArea">
                <input type="text" name="username" value={this.state.username} onChange={this.onhandleChange} className="username" />
                <input type="button" value="Check" id="usercheck" className="check" onClick={this.userCheck} /></span>
                    </label>
                    <label>
                        User Password :
                <input type="password" name="userpassword" value={this.state.userpassword} onChange={this.onhandleChange} className="userpassword" />
                    </label>
                    <label>
                        Confirm Password :
                <input type="password" name="confirmpassword" value={this.state.confirmpassword} onChange={this.onhandleChange} className="confirmpassword" />
                    </label>
                    <label>
                        Sex :
                    </label>
                        <input type="radio" name="gender" value="male" className="gender" onChange={this.onhandleChange} /> Male 
                        <input type="radio" name="gender" value="female" className="gender" onChange={this.onhandleChange} /> Female
                    <label>
                        Birthday :
                <input type="date" name="birthday" value={this.state.birthday} onChange={this.onhandleChange} className="confirmpassword" />
                    </label>
                    <label>
                        Address :
                <input type="text" name="address" value={this.state.address} onChange={this.onhandleChange} className="confirmpassword" />
                    </label>
                    <div className="progressarea">
                        {/* <Progress completed={this.state.strenth} /> */}
                        {/* <Line percent={this.state.strenth} strokeWidth="4" className={this.state.probar} /> */}
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
                    </div>
                    <label>
                        <input type="button" value="Login" id="login" className="submitbtn" onClick={this.onhandleSubmit} />
                        <input type="button" value="Registration" id="registration" className="submitbtn" onClick={this.onhandleSubmit} />
                    </label>
                </form>
            </div>
        );
    }

}

export default Regestration;


