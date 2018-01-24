import React, { Component } from "react";
import {db} from "./firebase";

function SelectRating(props) {
  let ratings = ["1", "2", "3", "4", "5"];
  return (
    <ul className="ratings">
      {ratings.map((rating, index) => {
        return (
          <li
            key={index}
            style={
              rating === props.selectedRating ? { color: "#d0021b" } : null
            }
            onClick={props.onSelect.bind(null, rating)}
          >
            {rating}
          </li>
        );
      })}
    </ul>
  );
}

function CommentsGrid(props) {
  return (
    <ul className="popular-list">
      {props.comments
        .filter(comment => {
          return comment.rating === props.selectedRating;
        })
        .map((comment, index) => {
          return (
            <li className="popular-item" key={index}>
              <ul className="space-list-item">
                <li>
                  <img
                    className="avatar"
                    src={comment.avatar !== "" ? comment.avatar : "https://api.adorable.io/avatars/150/" + comment.name }
                    alt={"Avatar for " + comment.name}
                    title={comment.labels}
                  />
                </li>
                <li>@{comment.name}</li>
                <div className="comment">{comment.text}</div>
                <div className="labels">{comment.labels}</div>
              </ul>
            </li>
          );
        })}
    </ul>
  );
}

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRating: "1",
      comments: [],
      wordCloud : []
    };
    this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {

    let comments = [];

    this.unsubscribe = db.collection("comments").onSnapshot(querySnapshot => {
      comments = [];

      querySnapshot.forEach(doc => {
        let comment = {};
        comment.name = doc.get("name");
        comment.text = doc.get("text");
        comment.rating = doc.get("rating");
        comment.avatar = doc.get("avatar");
        let labels = doc.get("labels");

        if (labels !== undefined) {
          comment.labels = labels.join(",");
        }
        comments.push(comment);
      });

      this.setState((prevState) => {
        return {
          comments: comments
        };
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateRating(rating) {
    this.setState(() => {
      return {
        selectedRating: rating
      };
    });
  }

  render() {
    return (
      <div>
        <SelectRating
          selectedRating={this.state.selectedRating}
          onSelect={this.updateRating}
        />
        <CommentsGrid
          comments={this.state.comments}
          selectedRating={this.state.selectedRating}
        />
      </div>
    );
  }
}

export default Comments;