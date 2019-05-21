import React, { Component } from 'react';
import { getFormattedDate } from '../helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './style.css';

class Task extends Component {

    constructor() {
        super();
        this.state = {
            displayDetails: false,
            editMode: false
        }
    }

    toggleDetails = () => {
        this.setState(state => ({ displayDetails: !state.displayDetails }));
    }

    handleCompleteTask = (e) => {
        e.stopPropagation();

        let headers = {
            'x-auth-token': localStorage.getItem('mern-todo-token')
        }

        axios.put('/api/user/toggle-completion', this.props.data, { headers }).then(res => {
            if (res.data.success) this.props.refreshTasks(res.data.body.tasks);
        }).catch(error => console.log(error));
    }

    handleDeleteTask = (e) => {
        e.stopPropagation();

        let headers = {
            'x-auth-token': localStorage.getItem('mern-todo-token')
        }

        axios.post('/api/user/delete-task', this.props.data, { headers }).then(res => {
            if (res.data.success) this.props.refreshTasks(res.data.body.tasks);
        })
    }

    render() {
        return (
            <div className="flex-col-evenly shadow-sm bg-white my-sm width-100 clickable task-container"
                onClick={() => this.toggleDetails()}>

                <div className="flex-row-between mx-md">
                    <p className="task-subject">{this.props.data.subject}</p>
                    <div className="flex-row-end">
                        <FontAwesomeIcon className="icon icon-sm mx-sm my-sm" icon={['fas', 'check']} onClick={(e) => this.handleCompleteTask(e)} />
                        <FontAwesomeIcon className="icon icon-sm mx-sm my-sm" icon={['fas', 'trash']} onClick={(e) => this.handleDeleteTask(e)} />
                    </div>
                </div>

                <p className="mx-md my-sm task-due-date">Due: {getFormattedDate(this.props.data.dueDate, false)}</p>

                {this.state.displayDetails ? <div className="flex-col-between mx-md my-sm">
                    <h5 className="my-sm">Details:</h5>
                    <p>{this.props.data.body}</p>
                </div> : null}

                {this.props.data.completed ? <h1 className="task-completed">DONE</h1> : null}


            </div>
        )
    }
}

export default Task;