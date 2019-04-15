import React, { Component } from 'react';

import logo from '../../assets/logo.svg'
import './styles.css';

export default class Login extends Component {

    state = {
        user: '',
        password: ''
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.user === "Whislley" && this.state.password === "123456") {
            this.props.history.push(`/boxes-view`);
        } else {
            alert("Login inválido!");
        }

    }

    handleUserChange = (e) => {
        this.setState({ user: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt=""/>
                    <input placeholder="User" value={this.state.user} onChange={this.handleUserChange} />
                    <input placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    <button type="submit">Entrar</button>
                </form>
            </div>
        );
    }
}
