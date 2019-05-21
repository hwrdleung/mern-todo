import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isRequired, isAlphaOnly } from '../formValidators';
import axios from 'axios';

class TaskCreatorForm extends Component {

    constructor() {
        super();
        this.state = {
            subjectValue: '',
            bodyValue: '',
            dueDateValue: '',
            subjectErrors: [],
            bodyErrors: [],
            dueDateErrors: [],
        }
    }

    formSubmitHandler = (e) => {
        e.preventDefault();
        // If all validations met, then submit to server for auth
        Promise.all([
            this.validateField('subject', e.target.subject.value),
            this.validateField('body', e.target.body.value),
            this.validateField('dueDate', e.target.dueDate.value)
        ]).then(() => {
            if (this.isFormValid(e) === true) {
                // Make api call to server

                let formData = {
                    subject: this.state.subjectValue,
                    body: this.state.bodyValue,
                    dueDate: this.state.dueDateValue
                }

                let headers = {
                    'x-auth-token': localStorage.getItem('mern-todo-token')
                }

                axios.post('/api/user/create-task', formData, { headers }).then(res => {
                    if(res.data.success){
                        this.props.refreshTasks();
                    }
                })
            }
        })
    }

    isFormValid = (e) => {
        // Check for errors.  If no errors, return true.  Otherwise, return false.
        for (let i = 0; i < this.state.subjectErrors.length; i++) {
            if (this.state.subjectErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.bodyErrors.length; i++) {
            if (this.state.bodyErrors[i] !== true) return false;
        }

        for (let i = 0; i < this.state.dueDateErrors.length; i++) {
            if (this.state.dueDateErrors[i] !== true) return false;
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
                case 'subject':
                    this.setState({
                        subjectErrors: [
                            isRequired(value),
                        ]
                    }, resolve());
                    break;

                case 'body':
                    this.setState({
                        bodyErrors: [
                            isRequired(value),
                        ]
                    }, resolve());
                    break;

                case 'dueDate':
                    this.setState({
                        dueDateErrors: [
                            isRequired(value),
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

    render() {
        return (
            <form onSubmit={(e) => this.formSubmitHandler(e)}
                className="form flex-col-evenly">

                <h4>Create a new task:</h4>

                <div className="my-sm">
                    <label>Subject:</label>
                    <input type="text" name="subject" placeholder="Subject" value={this.state.subjectValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('subjectErrors')}
                </div>

                <div className="my-sm">
                    <label>Due Date:</label>
                    <input type="text" name="dueDate" placeholder="Due Date" value={this.state.dueDateValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('dueDateErrors')}
                </div>

                <div className="my-sm">
                    <label>Details:</label>
                    <input type="text" name="body" placeholder="Details..." value={this.state.bodyValue} onChange={(e) => this.formChangeHandler(e)} />
                    {this.renderErrors('bodyErrors')}
                </div>

                <input className="btn btn-success" type="submit" name="submit" />
            </form>
        )
    }
}

export default withRouter(TaskCreatorForm);