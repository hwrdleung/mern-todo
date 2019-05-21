import React, { Component } from 'react';
import LoginForm from '../loginForm/loginForm';
import { withRouter } from 'react-router-dom';
import RegistrationForm from '../registrationForm/registrationForm';
import '../../App.css';

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            displayRegistrationForm: false,
            displayLoginForm: true
        }
    }

    componentWillMount() {
        this.detectUserSession();
    }

    detectUserSession = () => {
        let token = localStorage.getItem('mern-todo-token');
        if(token){
            console.log('user session detected');
            this.props.history.push('/dashboard')
        }
    }

    displayForm = (form) => {
        switch (form) {
            case 'register':
                this.setState({ displayRegistrationForm: true, displayLoginForm: false });
                break;
            case 'login':
                this.setState({ displayLoginForm: true, displayRegistrationForm: false });
                break;
            default: break;
        }
    }

    render() {
        return (
            <div className="width-full flex-col-start">
                <h1 className="mx-auto my-lg">Simple Task List</h1>

                <h4 className="mx-auto my-lg">
                    <span className="clickable" onClick={() => this.displayForm('login')}>Log in</span> |
                    <span className="clickable" onClick={() => this.displayForm('register')}> Register</span></h4>

                <div className="mx-auto shadow-sm">

                    {this.state.displayRegistrationForm ? <RegistrationForm /> : null}
                    {this.state.displayLoginForm ? <LoginForm /> : null}
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage);