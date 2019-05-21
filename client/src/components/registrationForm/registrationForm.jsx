import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isRequired, minLength, passwordsMatch, isValidEmail, isAlphaOnly, isAlphaNumeric } from '../formValidators';
import axios from 'axios';

class RegistrationForm extends Component {

    constructor() {
        super();
        this.state = {
            firstNameValue: '',
            lastNameValue: '',
            usernameValue: '',
            emailAddressValue: '',
            passwordValue: '',
            password2Value: '',
            firstNameErrors: [],
            lastNameErrors: [],
            usernameErrors: [],
            emailAddressErrors: [],
            passwordErrors: [],
            password2Errors: []
        }
    }

    formSubmitHandler = (e) => {
        e.preventDefault();
        // If all validations met, then submit to server for auth
        Promise.all([
            this.validateField('firstName', e.target.firstName.value),
            this.validateField('lastName', e.target.lastName.value),
            this.validateField('username', e.target.username.value),
            this.validateField('emailAddress', e.target.emailAddress.value),
            this.validateField('password', e.target.password.value),
            this.validateField('password2', e.target.password2.value)
        ]).then(() => {
            if (this.isFormValid(e) === true) {
                // Make api call to server

                let formData = {
                    firstName: this.state.firstNameValue,
                    lastName: this.state.lastNameValue,
                    username: this.state.usernameValue,
                    emailAddress: this.state.emailAddressValue,
                    password: this.state.passwordValue,
                    password2: this.state.password2Value
                }

                axios.post('/api/auth/register', formData).then(res => {
                    console.log(res)
                    this.setState({ serverRes: res }, () => {
                        if (res.data.success) {
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
        for (let i = 0; i < this.state.firstNameErrors.length; i++) {
            if (this.state.firstNameErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.lastNameErrors.length; i++) {
            if (this.state.lastNameErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.usernameErrors.length; i++) {
            if (this.state.usernameErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.emailAddressErrors.length; i++) {
            if (this.state.emailAddressErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.passwordErrors.length; i++) {
            if (this.state.passwordErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.password2Errors.length; i++) {
            if (this.state.password2Errors[i] !== true) return false;
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
                case 'firstName':
                    this.setState({
                        firstNameErrors: [
                            isRequired(value),
                            isAlphaOnly(value)
                        ]
                    }, resolve());
                    break;

                case 'lastName':
                    this.setState({
                        lastNameErrors: [
                            isRequired(value),
                            isAlphaOnly(value)
                        ]
                    }, resolve());
                    break;

                case 'username':
                    this.setState({
                        usernameErrors: [
                            isRequired(value),
                            isAlphaNumeric(value)
                        ]
                    }, resolve());
                    break;

                case 'emailAddress':
                    this.setState({
                        emailAddressErrors: [
                            isRequired(value),
                            isValidEmail(value)
                        ]
                    }, resolve());
                    break;

                case 'password':
                    this.setState({
                        passwordErrors: [
                            isRequired(value),
                            minLength(value, 6)
                        ]
                    }, resolve());
                    break;

                case 'password2':
                    this.setState({
                        password2Errors: [
                            isRequired(value),
                            passwordsMatch(this.state.passwordValue, value)
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
                    <label onClick={this.test}>First Name</label>
                    <input type="text" name="firstName" placeholder="First name" value={this.state.firstNameValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('firstNameErrors')}
                </div>

                <div className="my-sm">
                    <label onClick={this.test}>Last Name</label>
                    <input type="text" name="lastName" placeholder="Last name" value={this.state.lastNameValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('lastNameErrors')}
                </div>

                <div className="my-sm">
                    <label onClick={this.test}>Username</label>
                    <input type="text" name="username" placeholder="Username" value={this.state.usernameValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('usernameErrors')}
                </div>

                <div className="my-sm">
                    <label onClick={this.test}>Email address</label>
                    <input type="text" name="emailAddress" placeholder="Email address" value={this.state.emailAddressValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('emailAddressErrors')}
                </div>

                <div className="my-sm">
                    <label>Choose a password</label>
                    <input type="password" name="password" placeholder="password" value={this.state.passwordValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('passwordErrors')}
                </div>

                <div className="my-sm">
                    <label>Re-enter password</label>
                    <input type="password" name="password2" placeholder="Re-enter password" value={this.state.password2Value} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('password2Errors')}
                </div>

                <input className="btn btn-success" type="submit" name="submit" />
            </form>
        )
    }
}

export default withRouter(RegistrationForm);