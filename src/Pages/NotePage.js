import React, { Component } from "react";
import { Pane, minorScale, Heading, Menu, Text } from "evergreen-ui";
import { Editor } from "slate-react";
import { Value } from "slate";
import uuid from 'uuid/v4'
import { db } from "../App";

export default class NotePage extends Component {
  state = {
    selected: "",
    notes: {},
    noteTitle: {},
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
      .limit(1)
      .get();
    let latestNote = res.docs[0].data();
    console.log(Value.fromJSON(JSON.parse(latestNote.title)))
    this.setState({
      selected: latestNote.id,
      noteTitle: Value.fromJSON(JSON.parse(latestNote.title) || initialValue),
      isLoading: false
    });
  }

  _handleNoteSelect = noteId => {
    this.setState({
      selected: noteId
    });
  };

  _handleEditorChange = async ({ value }) => {
    if (value.document != this.state.noteTitle.document) {
      let res = await db.collection("notes").doc(this.state.selected).update({
        title: JSON.stringify(value.toJSON())
      })

      console.log(res)
    }
    this.setState({ noteTitle: value });
  };

  render() {
    const { notes, noteTitle, isLoading, selected } = this.state;
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
                    {note.title}
                  </Menu.Item>
                ))}
              </Menu.Group>
            </Pane>
            <Pane>
              <Menu.Group>
                <Menu.Item icon="edit">새 노트 작성하기</Menu.Item>
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
                      value={noteTitle}
                      onChange={({ value }) =>
                        this._handleEditorChange({ value })
                      }
                    />
                  )}
                </Heading>
              </Pane>
              <Pane>
                {/* <Editor
                  value={content}
                  onChange={({ value }) =>
                    this._handleEditorChange({
                      value,
                      type: "content"
                    })
                  }
                /> */}
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}
