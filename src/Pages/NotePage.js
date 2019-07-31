import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import withSizes from "react-sizes";
import { compose } from "recompose";
import { debounce } from "lodash";
import uuid from "uuid/v4";
import {
  Pane,
  Heading,
  Menu,
  Text,
  Avatar,
  Popover,
  IconButton,
  SideSheet,
  Position,
  Spinner,
  majorScale
} from "evergreen-ui";
import { Editor } from "slate-react";
import { Value } from "slate";
import Plain from "slate-plain-serializer";

import firebase, { db } from "../db";
import { MOBILE_WIDTH } from "../common";

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


class NotePage extends Component {
  state = {
    selected: "",
    notes: {},
    title: {},
    content: {},
    isLoading: true,
    isShown: false,
    user: null
  };
  componentWillUnmount() {
    this._ismounted = false;
  }

  async componentDidMount() {
    const that = this;
    this._ismounted = true;

    firebase.auth().onAuthStateChanged(user => {
      if (user && that._ismounted) {
        that.setState({ user });
      } else {
        that.props.history.push('/signin')
      }
    });
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.user == null && this.state.user != null) {
      let { user } = this.state;
      let res = await db
        .collection("notes")
        .where("user", "==", user.email)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      let notes = {};
      if (res.size === 0) {
        await this._handleAddNoteButton({ email: user.email });
      } else {
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
          notes
        });
      }

      this.setState({
        isLoading: false,
        username: user.displayName,
        email: user.email
      });
    }
  }
  _handleAddNoteButton = async ({ email } = { email: null }) => {
    let id = uuid();
    const newNote = {
      id,
      title: Plain.deserialize(""),
      content: Plain.deserialize(""),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      user: email || this.state.user.email
    };

    try {
      await db
        .collection("notes")
        .doc(id)
        .set({
          ...newNote,
          title: JSON.stringify(newNote.title.toJSON()),
          content: JSON.stringify(newNote.content.toJSON())
        });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      notes: { ...this.state.notes, [id]: newNote },
      selected: id,
      title: newNote.title,
      content: newNote.content,
      isShown: false
    });
  };

  _handleNoteSelect = noteId => {
    this.setState({
      selected: noteId,
      title: this.state.notes[noteId].title,
      content: this.state.notes[noteId].content,
      isShown: false
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

  _handleLogOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.history.push("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  _handleEditorKeyDown = (event, editor, next) => {
    if (event.key === "Enter") {
      event.preventDefault();
    } else {
      return next();
    }
  };

  _handleNoteDelete = async ({ noteId }) => {
    try {
      await db
        .collection("notes")
        .doc(noteId)
        .delete();
      if (Object.keys(this.state.notes).length === 1) {
        this.setState({ notes: {} });
        await this._handleAddNoteButton();
      } else {
        let updatedNotes = { ...this.state.notes };
        let updatedNotesArray = Object.values(updatedNotes).sort(
          (a, b) => b.createdAt.seconds - a.createdAt.seconds
        );

        let deletedIndex = 0;
        updatedNotesArray.forEach((note, index) => {
          if (note.id === noteId) {
            deletedIndex = index;
            return;
          }
        });
        updatedNotesArray.splice(deletedIndex, 1);
        let newSelectedIndex = deletedIndex - 1 >= 0 ? deletedIndex - 1 : 0;
        delete updatedNotes[noteId];

        this.setState({
          notes: updatedNotes,
          selected: updatedNotesArray[newSelectedIndex].id,
          title: updatedNotesArray[newSelectedIndex].title,
          content: updatedNotesArray[newSelectedIndex].content
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { notes, title, content, isLoading, user } = this.state;
    return (
      <React.Fragment>
        {!user ? (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={400}
          >
            <Spinner />
          </Pane>
        ) : (
          <Pane height="100%">
            <SideSheet
              position={Position.LEFT}
              isShown={this.state.isShown}
              width={this.props.isMobile ? this.props.width - 70 : 250}
              onCloseComplete={() => this.setState({ isShown: false })}
            >
              <Pane height="100%" background="tint1" className="sidebar">
                {/* display: flex */}
                <Menu>
                  <Pane>
                    <Menu.Group>
                      <Popover
                        position={Position.BOTTOM_RIGHT}
                        content={
                          <Menu>
                            <Menu.Group>
                              <Menu.Item
                                icon="log-out"
                                onSelect={this._handleLogOut}
                              >
                                로그아웃
                              </Menu.Item>
                            </Menu.Group>
                          </Menu>
                        }
                      >
                        <Menu.Item>
                          <Pane display="flex" alignItems="center">
                            <Avatar
                              name={user.displayName}
                              size={25}
                              sizeLimitOneCharacter={25}
                              marginRight={5}
                            />
                            <Text fontWeight={600}>{user.displayName}</Text>
                          </Pane>
                        </Menu.Item>
                      </Popover>
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
                          <Text fontWeight={ note.id === this.state.selected ? 700 : 500 }>{Plain.serialize(note.title) || "제목 없음"}</Text>
                        </Menu.Item>
                      ))}
                    </Menu.Group>
                  </Pane>
                  <Pane>
                    <Menu.Group>
                      <Menu.Item
                        onSelect={this._handleAddNoteButton}
                        icon="edit"
                      >
                        새 노트 작성하기
                      </Menu.Item>
                    </Menu.Group>
                  </Pane>
                </Menu>
              </Pane>
            </SideSheet>
            <Pane display="flex" flexDirection="column" height="100%">
              <Pane
                display="flex"
                justifyContent="space-between"
                marginX={majorScale(2)}
                marginTop={majorScale(2)}
              >
                <IconButton
                  appearance="minimal"
                  icon="menu"
                  iconSize={18}
                  onClick={() => this.setState({ isShown: true })}
                />
                <Popover
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item
                          icon="delete"
                          onSelect={() =>
                            this._handleNoteDelete({
                              noteId: this.state.selected
                            })
                          }
                        >
                          노트 삭제
                        </Menu.Item>
                      </Menu.Group>
                    </Menu>
                  }
                >
                  <IconButton appearance="minimal" icon="more" iconSize={18} />
                </Popover>
              </Pane>
              <Pane
                paddingX={this.props.isMobile ? 15 : 0}
                width={this.props.isMobile ? "100%" : MOBILE_WIDTH}
                marginX="auto"
                paddingTop={15}
              >
                <Pane marginBottom={20}>
                  <Heading size={900}>
                    {isLoading ? (
                      <Text>title..</Text>
                    ) : (
                      <Editor
                        placeholder="Title here.."
                        value={title}
                        onKeyDown={this._handleEditorKeyDown}
                        onChange={({ value }) => {
                          this._handleTitleChange({ value });
                        }}
                      />
                    )}
                  </Heading>
                </Pane>
                <Pane flex={1} overflowY="auto">
                  {isLoading ? (
                    <Text>content..</Text>
                  ) : (
                    <Editor
                      placeholder="Content here.."
                      value={content}
                      style={{ height: "100%" }}
                      onChange={({ value }) =>
                        this._handleContentChange({ value })
                      }
                    />
                  )}
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withSizes(({ width }) => ({ isMobile: width < MOBILE_WIDTH, width })),
  withRouter
)(NotePage);
