import React, { Component } from 'react';

import logo from '../../assets/logo.svg';
import styles from "./Login.module.css";
import api from '../../services/api';

export default class Register extends Component {

    state = {
        username: "",
        password: "",
        password2: "",
        email: ""
    };

    handleRegister = async (e) => {
        e.preventDefault();
        const { username, password, password2, email } = this.state;
        if (!username || !password || !password2 || !email) {
            alert("É necessário preencher todos os campos para continuar!");
        } else {
            try {
                const response = await api.post(`register`, { username, password, password2, email });
                if (response.status === 201) {
                    alert("Cadastro realizado com sucesso!");
                    this.props.history.push(`/`);
                }
            } catch (err) {
                alert("Houve um problema ao realizar o cadastro, verifique suas credenciais.");
            }
        }
    }

    handleUserChange = (e) => {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handlePassword2Change = (e) => {
        this.setState({ password2: e.target.value });
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    render() {
        return (
            <div className={styles.mainContainer}>
                <form onSubmit={this.handleRegister}>
                    <img src={logo} alt=""/>
                    <input required placeholder="User" value={this.state.username} onChange={this.handleUserChange} />
                    <input required placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    <input required placeholder="Retry the Password" type="password" value={this.state.password2} onChange={this.handlePassword2Change} />
                    <input required placeholder="E-mail" value={this.state.email} onChange={this.handleEmailChange} />
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        );
    }
}
