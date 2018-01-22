import React, { Component } from "react";
import Cloud from 'react-d3-cloud';
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

function WordCloud(props) {
  const fontSizeMapper = word => Math.log2(word.value) * 5;
  const rotate = word => word.value % 360;

  return (
    <div style={{display:'flex',flexDirection:'column'}}>
    <Cloud 
      data={props.data}
      fontSizeMapper={fontSizeMapper}
      rotate={rotate}
      width={800}
      height={600}
    ></Cloud>
    </div>
  )
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
    let wordCloudSet = new Set();
    let wordCloud = [];

    this.unsubscribe = db.collection("comments").onSnapshot(querySnapshot => {
      comments = [];
      wordCloud = [];

      querySnapshot.forEach(doc => {
        let comment = {};
        comment.name = doc.get("name");
        comment.text = doc.get("text");
        comment.rating = doc.get("rating");
        comment.avatar = doc.get("avatar");
        let labels = doc.get("labels");

        if (labels !== undefined) {
          labels.forEach((label)=>{
            let tag = {};
            tag.text = label;
            tag.value = label.length * 10;
            if (!wordCloudSet.has(label)) {
              wordCloud.push(tag);
              wordCloudSet.add(label);
            }
          });
          comment.labels = labels.join(",");
        }
        comments.push(comment);
      });

      this.setState(() => {
        return {
          comments: comments,
          wordCloud: wordCloud
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
        <WordCloud data={this.state.wordCloud}/>
      </div>
    );
  }
}

export default Comments;