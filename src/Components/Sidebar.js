import React from "react";
import { Pane, Menu, Text } from "evergreen-ui";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const Sidebar = props => {
  const handleAddProject = () => {
    
  }
  return (
    <Pane
      // width={this.props.isMobile ? this.props.width - 70 : 250}
      width={250}
      height="100%"
    >
      <Pane background="tint1" height="100%" className="sidebar">
        <Menu>
          <Pane>
            <Menu.Group>
              <Menu.Item>
                <Text>hi</Text>
              </Menu.Item>
            </Menu.Group>
          </Pane>
          <Pane>
            <Menu.Group>
              <Menu.Item onSelect={handleAddProject} icon="edit">새 프로젝트 추가하기</Menu.Item>
            </Menu.Group>
          </Pane>
        </Menu>
      </Pane>
      <Pane />
    </Pane>
  );
};

export default compose(withRouter)(Sidebar);
