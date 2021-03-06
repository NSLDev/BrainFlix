import React, { Component } from "react";
import TopVideo from "../TopVideo/TopVideo";
import About from "../About/About";
import CommentArea from "../CommentArea/CommentArea";
import CommentForm from "../CommentForm/CommentForm";
import VideoList from "../VideoList/VideoList";
import axios from "axios";

const API_URL = "http://localhost:8080";
let defaultVideoId = '1af0jruup5gu';
let paramsId;

export default class Home extends Component {
  state = {
    topVideo: {},
    sideVideos: [],
  };

  componentDidMount() {
    axios.get(`${API_URL}/videos`)
    .then((response) => {
      const sideVideos = response.data;
      this.setState({ sideVideos });
      if(defaultVideoId !== this.props.match.params.id) {
        if(this.props.match.params.id === undefined) {
          this.props.match.params.id = defaultVideoId
        }
        paramsId = this.props.match.params.id;

      axios.get(`${API_URL}/videos/${paramsId}`)
        .then((topVideoResponse) => {
          const topVideo = topVideoResponse.data;
          this.setState({ topVideo });
        })
        .catch((err) => {
          console.log(err);
        });
    }});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      if (this.props.match.params.id === undefined) {
        this.props.match.params.id = "1af0jruup5gu";
      }

      axios.get(`${API_URL}/videos/${this.props.match.params.id}`)
      .then((newVideo) => {
          let topVideo;
          if (Array.isArray(newVideo.data)) {
            topVideo = newVideo.data[0];
          } else {
            topVideo = newVideo.data;
          }
          this.setState({ topVideo });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className="Home">
        <TopVideo topVideoData={this.state.topVideo} />
        <div className="desktop__container">
          <div className="desktop__subcontainer">
            <About aboutData={this.state.topVideo} />
            <CommentForm />
            <CommentArea commentData={this.state.topVideo} />
          </div>
          <VideoList data={this.state.sideVideos} videoData={this.state.topVideo} />
        </div>
      </div>
    );
  }
}
