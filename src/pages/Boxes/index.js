import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import {MdInsertDriveFile, MdFolder} from 'react-icons/md'

import logo from '../../assets/logo.svg'
import styles from "./Boxes.module.css"

export default class Boxes extends Component {
  state = { box: [] }

  async componentDidMount() {
    this.subcribeToNewFiles();

    const response = await api.get(`boxes-view`);

    this.setState({ box: response.data });
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

  render() {
    return (
      <div className={styles.boxContainer}>
        <header>
          <img src={logo} alt="" />
          <h1>User: Whislley</h1>
        </header>

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
