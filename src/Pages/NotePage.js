import React, { Component } from "react";
import { debounce } from "lodash";
import { Pane, minorScale, Heading, Menu, Text } from "evergreen-ui";
import { Editor } from "slate-react";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
import uuid from "uuid/v4";
import { db } from "../App";
import firebase from "firebase";

export default class NotePage extends Component {
  state = {
    selected: "",
    notes: {},
    title: {},
    content: {},
    isLoading: true
  };

  async componentDidMount() {
    const initialValue = {
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    };

    let res = await db
      .collection("notes")
      .orderBy("createdAt")
      .limit(20)
      .get();

    let notes = {};
    res.forEach(doc => {
      let note = doc.data();
      notes[note.id] = {
        ...note,
        title: Value.fromJSON(JSON.parse(note.title)),
        content: Value.fromJSON(JSON.parse(note.content))
      };
    });
    let latestNote = Object.values(notes)[0];
    this.setState({
      selected: latestNote.id,
      title: latestNote.title || initialValue,
      content: latestNote.content || initialValue,
      isLoading: false,
      notes
    });
  }

  _handleNoteSelect = noteId => {
    this.setState({
      selected: noteId,
      title: this.state.notes[noteId].title,
      content: this.state.notes[noteId].content
    });
  };

  _autoSave = debounce(async () => {
    await db
      .collection("notes")
      .doc(this.state.selected)
      .update({
        title: JSON.stringify(this.state.title.toJSON()),
        content: JSON.stringify(this.state.content.toJSON())
      })
      .catch(error => console.log("error updating doc: " + error));
  }, 500);

  _handleTitleChange = ({ value }) => {
    const newNotes = {
      ...this.state.notes,
      [this.state.selected]: {
        ...this.state.notes[this.state.selected],
        title: value
      }
    };
    this.setState({ notes: newNotes, title: value });
    this._autoSave();
  };

  _handleContentChange = ({ value }) => {
    const newNotes = {
      ...this.state.notes,
      [this.state.selected]: {
        ...this.state.notes[this.state.selected],
        content: value
      }
    };
    this.setState({ notes: newNotes, content: value });
    this._autoSave();
  };

  _handleAddNoteButton = async () => {
    let id = uuid();
    const newNote = {
      id,
      title: Plain.deserialize(""),
      content: Plain.deserialize(""),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      user: ""
    };
    await db
      .collection("notes")
      .doc(id)
      .set({
        ...newNote,
        title: JSON.stringify(newNote.title.toJSON()),
        content: JSON.stringify(newNote.content.toJSON())
      });

    this.setState({
      notes: { ...this.state.notes, [id]: newNote },
      selected: id,
      title: newNote.title,
      content: newNote.content
    });
  };
  render() {
    const { notes, title, content, isLoading, selected } = this.state;
    return (
      <Pane display="flex" height="100%">
        <Pane width={240} height="100%" background="tint1" className="sidebar">
          <Menu>
            {/* display: flex */}
            <Pane>
              <Menu.Group>
                <Menu.Item icon="search">검색하기</Menu.Item>
              </Menu.Group>
            </Pane>
            <Pane
              className="note-list"
              flex={1}
              overflowX="hidden"
              overflowY="auto"
            >
              <Menu.Group>
                {Object.values(notes).map(note => (
                  <Menu.Item
                    key={note.id}
                    onSelect={() => this._handleNoteSelect(note.id)}
                  >
                    {Plain.serialize(note.title)}
                  </Menu.Item>
                ))}
              </Menu.Group>
            </Pane>
            <Pane>
              <Menu.Group>
                <Menu.Item onSelect={this._handleAddNoteButton} icon="edit">
                  새 노트 작성하기
                </Menu.Item>
              </Menu.Group>
            </Pane>
          </Menu>
        </Pane>
        <Pane flex={1} display="flex" flexDirection="column">
          <Pane padding={minorScale(4)} background="yellowTint">
            breadcumb(needs to be implemented)
          </Pane>
          <Pane padding={minorScale(4)} flex={1}>
            <Pane width={730} marginX="auto" marginTop={60}>
              <Pane marginBottom={45}>
                <Heading size={900}>
                  {isLoading ? (
                    <Text>title..</Text>
                  ) : (
                    <Editor
                      value={title}
                      onChange={({ value }) => {
                        this._handleTitleChange({ value });
                      }}
                    />
                  )}
                </Heading>
              </Pane>
              <Pane>
                {isLoading ? (
                  <Text>content..</Text>
                ) : (
                  <Editor
                    value={content}
                    onChange={({ value }) =>
                      this._handleContentChange({ value })
                    }
                  />
                )}
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}
