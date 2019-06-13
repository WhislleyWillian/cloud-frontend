import React, { Component } from 'react';

import logo from '../../assets/logo.svg';
import styles from "./Login.module.css";
import api from '../../services/api';
import { login, usernameIn } from "../../services/auth";

export default class Login extends Component {

    state = {
        username: "",
        password: ""
    };

    handleLogin = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        if (!username || !password) {
            alert("Preencha o campo de usuário e senha para continuar!");
        } else {
            try {
                const response = await api.post(`login`, { username, password });
                console.log("response", response);
                if (response.status === 201) {
                    login(response.data.user._id);
                    usernameIn(username);
                    this.props.history.push(`/boxes-view`);
                }
            } catch (err) {
                alert("Houve um problema com o login, verifique suas credenciais.");
            }
        }
    }

    handleUserChange = (e) => {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handleRegister = () => {
        this.props.history.push(`/register`);
    }

    render() {
        return (
            <div className={styles.mainContainer}>
                <form onSubmit={this.handleLogin}>
                    <img src={logo} alt=""/>
                    <input required placeholder="User" value={this.state.username} onChange={this.handleUserChange} />
                    <input required placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    <button type="submit">Entrar</button>
                    <button onClick={this.handleRegister}>Cadastrar</button>
                </form>
            </div>
        );
    }
}
