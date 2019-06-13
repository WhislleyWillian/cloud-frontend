import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';
import { logout, getTokenName } from "../../services/auth";

import { MdFolder } from 'react-icons/md'

import logo from '../../assets/logo.svg'
import styles from "./Boxes.module.css"

export default class Boxes extends Component {
  state = { 
    username: '',
    box: [],
    newBox: ''
  }

  async componentDidMount() {

    this.subcribeToNewFiles();

    try {
      const response = await api.get(`boxes-view`);
      // console.log("resposta do backend", response);
      this.setState({ box: response.data });
    } catch (err) {
      // console.log("erro do backend", err);
      this.props.history.push(`/`);
    }
  }

  subcribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://cloud-backend.herokuapp.com');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({ 
        box: { ...this.state.box, files: [data, ...this.state.box.files ] } 
      });
    });
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append('file', file);

      api.post(`boxes/${box}/files`, data);
    });
  };

  handleOpenBoxe = (e) => {
    this.props.history.push(`/box/${e.currentTarget.id}`);
  };

  createBox = async (e) => {
    e.preventDefault();

    const response = await api.post(`new-box`, {
        title: this.state.newBox,
    });

    this.props.history.push(`/box/${response.data._id}`);
  }

  newBoxInputChange = (e) => {
      this.setState({ newBox: e.target.value });
  }

  handleLogout = () => {
    logout();
  }

  render() {
    return (
      <div className={styles.boxContainer}>
        <header>
          <img src={logo} alt="" />
          <h1>{getTokenName()}</h1>
          <form onSubmit={this.handleLogout}>
            <button type="submit" >Sair</button>
          </form>
        </header>


        <div id="main-container">
            <form onSubmit={this.createBox}>
                <input required placeholder="Criar um box" value={this.state.newBox} onChange={this.newBoxInputChange} />
                <button type="submit">Criar</button>
            </form>
        </div>

        <ul>
          { this.state.box && this.state.box.map(boxes => (
            <li key={ boxes._id } id={ boxes._id } onDoubleClick={ this.handleOpenBoxe } >

              <div className={styles.fileInfo} >
                <MdFolder className={styles.icon} size={24} color="#A5Cfff"/>
                <strong>{boxes.title}</strong>
              </div>

              <span>modificado há: {distanceInWords(boxes.updatedAt, new Date(), {
                locale: pt
              })}</span>

            </li>
          )) }
        </ul>
      </div>
    );
  }
}
