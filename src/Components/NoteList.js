import React, { Component } from "react";
import Note from "./Note";

export default class NoteList extends Component {
  state = {
    notes: {
      1: {
        id: 1,
        content:
          "Two of the creators of Tailwind Adam Watham and Steve Schoger, the masterminds behind Refactoring"
      },
      2: {
        id: 2,
        content:
          "Today we can't imagine coding without our favorite CSS framework"
      },
      3: {
        id: 3,
        content:
          "Semantic is a development framework that helps create beautiful, responsive"
      },
      4: {
        id: 4,
        content:
          "Two of the creators of Tailwind Adam Watham and Steve Schoger, the masterminds behind Refactoring"
      },
      5: {
        id: 5,
        content:
          "Today we can't imagine coding without our favorite CSS framework"
      }
    }
  };
  render() {
    const { notes } = this.state;
    return (
      <section className="content container">
      </section>
    );
  }
}
