import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';
import { logout, getTokenName } from "../../services/auth";

import {MdInsertDriveFile} from 'react-icons/md'

import logo from '../../assets/logo.svg'
import styles from "./Box.module.css"

export default class Box extends Component {
  state = { 
    box: {} ,
    shareUser: ''
  }

  async componentDidMount() {
    this.subcribeToNewFiles();

    try {
      const box = this.props.match.params.id;
      const response = await api.get(`box/${box}`);

      this.setState({ box: response.data });
    } catch (err) {
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
  }

  handleLogout = () => {
    logout();
  }

  shareBox = () => {
    const box = this.props.match.params.id;
    let shareUser = this.state.shareUser;
    api.post(`share-box`, { shareUser, box});
  }

  shareUserInputChange = (e) => {
    this.setState({ shareUser: e.target.value });
  }

  render() {
    return (
      <div className={styles.boxContainer}>
        <header>
          <img src={logo} alt="" />
          <h1>{getTokenName() + " - " + this.state.box.title}</h1>
          <form onSubmit={this.handleLogout}>
            <button type="submit" >Sair</button>
          </form>
        </header>

        <Dropzone onDropAccepted={ this.handleUpload }>
          {({ getRootProps, getInputProps }) => (
            <div className={styles.upload} { ...getRootProps() }>
              <input { ...getInputProps() } />

              <p>Arrate arquivos ou clique aqui.</p>
            </div>
          )}
        </Dropzone>

        <div id="main-container">
            <form onSubmit={this.shareBox}>
                <input placeholder="Compartilhar pasta com outro usuário" value={this.state.shareUser} onChange={this.shareUserInputChange} />
                <button type="submit">Compartilhar</button>
            </form>
        </div>

        <ul>
          { this.state.box.files && this.state.box.files.map(file => (
            <li key={ file._id }>
              <a className={styles.fileInfo} href={file.url} target="_blank">
                <MdInsertDriveFile size={24} color="#A5Cfff"/>
                <strong>{file.title}</strong>
              </a>
              <span>há {distanceInWords(file.createdAt, new Date(), {
                locale: pt
              })}</span>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}
