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
  Popover,
  IconButton,
  SideSheet,
  Position,
  majorScale,
  TextInput
} from "evergreen-ui";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import firebase, { db, auth } from "../db";
import { MOBILE_WIDTH } from "../common";
import { userContext } from "../Context";
import Sidebar from "../Components/Sidebar";

class NotePage extends Component {
  static contextType = userContext;
  state = {
    selected: "",
    notes: {},
    title: {},
    content: EditorState.createEmpty(),
    isLoading: true,
    isShown: false
  };

  async componentDidMount() {
    const user = this.context;
    let res = await db
      .collection("notes")
      .where("user", "==", user.email)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    let notes = {};
    let latestNote = null;
    if (res.size === 0) {
      await this._handleAddNoteButton();
    } else {
      res.forEach(doc => {
        let { id, title, createdAt, content } = doc.data();
        if (latestNote == null) {
          latestNote = { id, title, createdAt, content };
        }
        notes[id] = {
          id,
          title,
          createdAt
        };
      });
      this.setState({
        selected: latestNote.id,
        title: latestNote.title,
        content: EditorState.createWithContent(
          convertFromRaw(latestNote.content)
        ),
        isLoading: false,
        notes
      });
    }
  }

  _handleAddNoteButton = async () => {
    let id = uuid();
    const newNote = {
      id,
      title: "",
      content: EditorState.createEmpty(),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      user: this.context.email
    };

    try {
      await db
        .collection("notes")
        .doc(id)
        .set({
          ...newNote,
          title: newNote.title,
          content: convertToRaw(newNote.content.getCurrentContent())
        });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      notes: { ...this.state.notes, [id]: newNote },
      selected: id,
      title: newNote.title,
      content: newNote.content,
      isShown: false,
      isLoading: false
    });
  };

  _handleNoteSelect = async noteId => {
    const res = await db
      .collection("notes")
      .doc(noteId)
      .get();
    const note = res.data();
    console.log(note);
    this.setState({
      selected: note.id,
      title: note.title,
      content: EditorState.createWithContent(convertFromRaw(note.content)),
      isShown: false
    });
  };

  _autoSave = debounce(async () => {
    await db
      .collection("notes")
      .doc(this.state.selected)
      .update({
        title: this.state.title,
        content: convertToRaw(this.state.content.getCurrentContent())
      })
      .catch(error => console.log("error updating doc: " + error));
  }, 500);

  _handleContentChange = editorState => {
    if (this.state.content != editorState) {
      this.setState({ content: editorState });
      this._autoSave();
    }
  };

  _handleLogOut = async () => {
    try {
      await auth.signOut();
      this.context.updateUser({isLoggedIn: false})
      this.props.history.push("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  _getNotesArraySorted = () => {
    let notesArray = Object.values(this.state.notes).sort(
      (a, b) => b.createdAt.seconds - a.createdAt.seconds
    );
    return notesArray;
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
    const { selected } = this.state;
    return (
      <Pane height="100%" display="flex">
        {this.props.isMobile ? (
          <SideSheet
            position={Position.LEFT}
            isShown={this.state.isShown}
            width={this.props.width - 70}
            onCloseComplete={() => this.setState({ isShown: false })}
          >
            <Sidebar
              onLogout={this._handleLogOut}
              onNoteSelect={this._handleNoteSelect}
              noteList={this._getNotesArraySorted()}
              selected={selected}
              onAddNote={this._handleAddNoteButton}
            />
          </SideSheet>
        ) : (
          <Pane width={250} height="100%">
            <Sidebar
              onLogout={this._handleLogOut}
              onNoteSelect={this._handleNoteSelect}
              noteList={this._getNotesArraySorted()}
              selected={selected}
              onAddNote={this._handleAddNoteButton}
            />
          </Pane>
        )}

        <Pane display="flex" flex={1} flexDirection="column" height="100%">
          <Pane
            display="flex"
            justifyContent={this.props.isMobile ? "space-between" : "flex-end"} 
            marginX={majorScale(2)}
            marginTop={majorScale(2)}
          >
            <IconButton
              appearance="minimal"
              display={ this.props.isMobile ? "block" : "none" }
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
            width={this.props.width < MOBILE_WIDTH + 250 ? "100%" : MOBILE_WIDTH}
            marginX="auto"
            paddingTop={15}
          >
            <Pane>
              <Heading size={900}>
                {this.state.isLoading ||
                  <TextInput
                    padding={0}
                    width="100%"
                    className="title-input"
                    boxShadow="none"
                      fontWeight={500}
                      placeholder="title.."
                    spellCheck={false}
                    fontSize={majorScale(3)}
                    value={this.state.title}
                    onChange={e =>
                      this.setState({
                        notes: {
                          ...this.state.notes,
                          [selected]: {
                            ...this.state.notes[selected],
                            title: e.target.value
                          }
                        },
                        title: e.target.value
                      })
                    }
                  />
                }
              </Heading>
            </Pane>
            <Pane flex={1} overflowY="auto">
              {this.state.isLoading || (
                <Editor
                  placeholder="content here.."
                  editorState={this.state.content}
                  toolbarHidden={true}
                  onEditorStateChange={this._handleContentChange}
                />
              )}
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default compose(
  withSizes(({ width }) => ({ isMobile: width < MOBILE_WIDTH, width })),
  withRouter
)(NotePage);
