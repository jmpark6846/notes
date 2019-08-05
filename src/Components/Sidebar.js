import React from "react";
import { Pane, Menu, Text, Position, Popover, Avatar } from "evergreen-ui";
import { userContext } from "../Context";


const Sidebar = props => {
  return (
    <userContext.Consumer>
      {user => (
        <Pane height="100%" background="tint1" data-testid="sidebar" id="sidebar">
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
                          onSelect={props.onLogout}
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
                        name={user.username}
                        size={25}
                        sizeLimitOneCharacter={25}
                        marginRight={5}
                      />
                      <Text fontWeight={600}>{user.username}</Text>
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
                {props.noteList.map(note => (
                  <Menu.Item
                    key={note.id}
                    onSelect={() => props.onNoteSelect(note.id)}
                  >
                    <Text
                      fontWeight={note.id === props.selected ? 700 : 500}
                    >
                      {note.title || "제목 없음"}
                    </Text>
                  </Menu.Item>
                ))}
              </Menu.Group>
            </Pane>
            <Pane>
              <Menu.Group>
                <Menu.Item onSelect={props.onAddNote} icon="edit">
                  새 노트 작성하기
                </Menu.Item>
              </Menu.Group>
            </Pane>
          </Menu>
        </Pane>
      )}
    </userContext.Consumer>
  );
};

export default Sidebar;
