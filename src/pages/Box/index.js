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
    shareUser: '',
    newTitle: ''
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

  handleHome = () => {
    this.props.history.push(`/boxes-view`);
  }

  shareBox = async (e) => {
    e.preventDefault();
    const box = this.props.match.params.id;
    let shareUser = this.state.shareUser;
    if (getTokenName() === shareUser) {
      alert("Não é possível compartilhar a pasta com o próprio usuário!");
      window.location.reload();
    } else {
      try {
        const response = await api.post(`share-box`, { shareUser, box});
        if (response.status === 201) {
          alert("A pasta foi compartilhada com o usuário: " + shareUser);
          window.location.reload();
        }
      } catch(err) {
        alert("Usuário inexistente.");
        window.location.reload();
      }
    }
    
  }

  shareUserInputChange = (e) => {
    this.setState({ shareUser: e.target.value });
  }

  deleteBox = async (e) => {
    e.preventDefault();
    const box = this.props.match.params.id;
    try {
      const response = await api.post(`delete-box`, { box });
      if (response.status === 201) {
        alert("A pasta foi excluída com sucesso!");
        this.props.history.push(`/boxes-view`);
      }
    } catch(err) {
      alert("Houve um problema com o login, verifique suas credenciais.");
      window.location.reload();
    }
  }

  newTitleInputChange = (e) => {
    this.setState({ newTitle: e.target.value });
  }

  renameBox = async (e) => {
    e.preventDefault();
    const box = this.props.match.params.id;
    let title = this.state.newTitle;
    try {
      const response = await api.post(`rename-box`, { box, title });
      if (response.status === 201) {
        alert("A pasta foi renomeada com sucesso!");
        window.location.reload();
      }
    } catch(err) {
      alert("Houve um problema ao renomear a pasta.");
      window.location.reload();
    }
  }

  render() {
    return (
      <div className={styles.boxContainer}>
        <header>
          <img src={logo} alt="" />
          <h1>{getTokenName() + " - " + this.state.box.title}</h1>
          <button onClick={this.handleHome} >Início</button>
          <form onSubmit={this.handleLogout}>
            <button type="submit" >Sair</button>
          </form>
        </header>

        

        <div id="main-container">
            <form onSubmit={this.shareBox}>
                <input required placeholder="Nome do usuário" value={this.state.shareUser} onChange={this.shareUserInputChange} />
                <button type="submit">Compartilhar</button>
            </form>
            <form onSubmit={this.renameBox}>
                <input required placeholder="Novo título" value={this.state.newTitle} onChange={this.newTitleInputChange} />
                <button type="submit">Renomear Pasta</button>
            </form>
            <form onSubmit={this.deleteBox}>
                <button type="submit">Excluir Pasta</button>
            </form>
        </div>

        <Dropzone onDropAccepted={ this.handleUpload }>
          {({ getRootProps, getInputProps }) => (
            <div className={styles.upload} { ...getRootProps() }>
              <input { ...getInputProps() } />

              <p>Arraste arquivos ou clique aqui.</p>
            </div>
          )}
        </Dropzone>

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
