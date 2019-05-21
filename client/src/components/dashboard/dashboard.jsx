import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import TaskCreatorForm from '../taskCreatorForm/taskCreatorForm';
import Task from '../task/task'; 

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            tasks: [],
            user: null
        }
    }

    componentWillMount() {
        this.getUserData();
    }

    getUserData = () => {
        let headers = {
            'x-auth-token': localStorage.getItem('mern-todo-token')
        }

        axios.get('/api/user/get-user-data', { headers }).then(res => {
            if (res.data.success) {
                this.setState({ tasks: res.data.body.tasks})
            }
        })
    }

    updateTasks = (tasks) => {
        // Updats state with data passed up from child components
        this.setState({tasks: tasks})
    }

    logout = () => {
        localStorage.removeItem('mern-todo-token');
        this.props.history.push('/');
    }


    renderTasks = () => {
        if(this.state.tasks.length === 0){
            return (<p className="mx-auto my-md italic">No tasks ...</p>)
        } else {
                return (this.state.tasks.map(task => (
                    <Task key={task._id} data={task} refreshTasks={(data) => this.updateTasks(data)}></Task>
                )))
        }
    }

    render() {
        return (
            <div className="flex-col-start">
                <button className="btn btn-danger align-end mx-md my-md" onClick={() => this.logout()}>Log out</button>

                <h1 className="mx-auto my-lg">Simple Task List</h1>

                <div className="flex-row-center mx-auto wrap">
                    <div className="align-start my-md mx-md shadow-sm bg-white"><TaskCreatorForm refreshTasks={(data) => this.updateTasks(data)} /></div>
                    <div className="align-start flex-col-start mx-md width-500-px">
                        {this.renderTasks()}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Dashboard);