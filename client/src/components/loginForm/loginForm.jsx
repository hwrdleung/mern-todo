import React, { Component } from 'react';
import { isRequired } from '../formValidators';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            usernameValue: '',
            passwordValue: '',
            usernameErrors: [],
            passwordErrors: [],
            serverRes: null
        }
    }

    formSubmitHandler = (e) => {
        e.preventDefault();
        // If all validations met, then submit to server for auth
        Promise.all([
            this.validateField('username', e.target.username.value),
            this.validateField('password', e.target.password.value)
        ]).then(() => {
            if(this.isFormValid(e) === true) {
                // Make api call to server
  
                let formData = {
                    username: this.state.usernameValue,
                    password: this.state.passwordValue
                }

                axios.post('/api/auth/login', formData).then(res => {
                    this.setState({serverRes: res}, () => {
                        if(res.data.success) {
                            localStorage.setItem('mern-todo-token', res.data.body.token);
                            this.props.history.push('/dashboard');
                        }
                    })
                })
            }
        })
    }

    isFormValid = (e) => {
        // Check for errors.  If no errors, return true.  Otherwise, return false.
        for(let i = 0; i < this.state.usernameErrors.length; i++){
            if(this.state.usernameErrors[i] !== true) return false;
        }

        for(let i = 0; i < this.state.passwordErrors.length; i++){
            if(this.state.passwordErrors[i] !== true) return false;
        }

        return true
    }


    formChangeHandler = (e) => {
        // Set state from e.target.value
        this.setState({ [e.target.name + 'Value']: e.target.value });
        this.setState({ [e.target.name + 'Touched']: true });
        this.validateField(e.target.name, e.target.value);
    }

    validateField = (name, value) => {
        // Specify validations for each input field
        // ** this.setState is async
        return new Promise((resolve, reject) => {
            switch (name) {
                case 'username':
                    this.setState({
                        usernameErrors: [
                            isRequired(value)
                        ]
                    }, resolve());
                    break;
                case 'password':
                    this.setState({
                        passwordErrors: [
                            isRequired(value)
                        ]
                    }, resolve());
                    break;
                default: break;
            }
        })
    }

    renderErrors = (key) => {
        let errorsArr = this.state[key];

        for (let i = 0; i < errorsArr.length; i++) {
            if (errorsArr[i] !== true) {
                return (<p className="error">{errorsArr[i]}</p>);
            }
        }
    }

    test = () => {
        console.log(this.state);
    }

    render() {
        return (
            <form onSubmit={(e) => this.formSubmitHandler(e)}
                className="form flex-col-evenly">

                <div className="my-sm">
                    <label onClick={this.test}>Username:</label>
                    <input type="text" name="username" placeholder="Username" value={this.state.usernameValue} onChange={(e) => this.formChangeHandler(e)}/>
                    {this.renderErrors('usernameErrors')}
                </div>

                <div className="my-sm">
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="password" value={this.state.passwordValue} onChange={(e) => this.formChangeHandler(e)}/>
                    {this.renderErrors('passwordErrors')}
                </div>

                <input className="btn btn-success" type="submit" name="submit" />
            </form>
        )
    }
}

export default withRouter(LoginForm);