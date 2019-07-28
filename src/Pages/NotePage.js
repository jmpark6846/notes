import React, { Component } from "react";
import { debounce } from "lodash";
import { Pane, minorScale, Heading, Menu, Text } from "evergreen-ui";
import { Editor } from "slate-react";
import { Value } from "slate";
import uuid from "uuid/v4";
import { db } from "../App";

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
      .limit(1)
      .get();
    let latestNote = res.docs[0].data();

    this.setState({
      selected: latestNote.id,
      title: Value.fromJSON(JSON.parse(latestNote.title) || initialValue),
      content: Value.fromJSON(JSON.parse(latestNote.content) || initialValue),
      isLoading: false
    });
  }

  _handleNoteSelect = noteId => {
    this.setState({
      selected: noteId
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
  }, 1000);

  _handleEditorChange = ({ value, type }) => {
    this.setState({ [type]: value });
    this._autoSave();
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
                      value={title}
                      onChange={({ value }) => {
                        this._handleEditorChange({ type: "title", value });
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
                      this._handleEditorChange({
                        type: "content",
                        value
                      })
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
