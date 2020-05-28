import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import SortableTree from 'react-sortable-tree';
import Axios from 'axios';
import {
  getHierarchyTree,
  addHierarchy,
  deleteHierarchy,
  setHierarchyTree,
  editHierarchy,
} from '@denim/iot-platform-middleware-redux';

import env from '../../config';
import {useAuth0} from '../../auth0-spa.jsx';
import NotificationPanel from '../NotificationPanel/NotificationPanel.jsx';

import './HierarchyManagement.css';

const HierarchyManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -250px;
  padding: 20px 30px;
  width: 500px;
  height: 300px;
  z-index: 100;
  background-color: white;
  border: 1px black solid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Cover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
`;

const envVar = env();

const HierarchyManagement = () => {
  const [showNewHierarchyModal, setShowNewHierarchyModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showEditHierarchyModal, setShowEditHierarchyModal] = useState(false);
  const [currentNode, setCurrentNode] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionAdded, setShowPermissionAdded] = useState(false);
  const [permissionAddedMsg, setPermissionAddedMsg] = useState(false);

  const hierarchyNameRef = useRef(null);
  const hierarchyTypeRef = useRef(null);
  const newHierarchyNameRef = useRef(null);
  const {getTokenSilently} = useAuth0();
  const dispatch = useDispatch();

  const hierarchies = useSelector(state => state.hierarchies.tree);

  // Move node code, could be used in the future
  /*const setNewNodePosition = async data => {
    const {node, nextParentNode} = data;
    const token = await getTokenSilently();

    const hierarchy = {
      parent: nextParentNode.id,
    };
    Axios.put(`${envVar.BASE_API_URL}/hierarchy/${node.id}`, hierarchy, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => console.log('Resp : ' + resp));
  }*/

  const getUsers = async () => {
    await Axios({
      method: 'GET',
      url: `${envVar.AUTH0_PROXY_URL}/users?fields=user_id%2Cemail%2Cname&include_fields=true`,
      headers: {authorization: 'Bearer ' + (await getTokenSilently())},
    })
      .then(resp => {
        setUsers(resp.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(getHierarchyTree());
    getUsers();
  }, []);

  const addNodeToDb = async () => {
    const hierarchyName = hierarchyNameRef.current.value;
    const hierarchyType = hierarchyTypeRef.current.value;

    const hierarchyToAdd = {
      type: hierarchyType,
      name: hierarchyName,
      parent: currentNode.id,
    };

    dispatch(addHierarchy(hierarchyToAdd)).then(() => {
      dispatch(getHierarchyTree());
    });
  };

  const handleAddNodeClick = (ev, node) => {
    ev.preventDefault();
    setCurrentNode(node);
    setShowNewHierarchyModal(true);
  };

  const handleRemoveNodeClick = async (ev, node) => {
    ev.preventDefault();
    setCurrentNode(node);

    dispatch(deleteHierarchy(node.id)).then(resp => {
      if (resp.error) {
        {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }
      dispatch(getHierarchyTree());
    });
  };

  const handleEditNodeClick = async (ev, node) => {
    ev.preventDefault();
    setCurrentNode(node);
    setShowEditHierarchyModal(true);
  };

  const handleEditHierarchy = () => {
    const hierarchyName = newHierarchyNameRef.current.value;
    dispatch(editHierarchy({id: currentNode.id, name: hierarchyName})).then(
      dispatch(getHierarchyTree()),
    );
  };

  const handleAddPermissionToAUser = async () => {
    const token = await getTokenSilently();

    const permissions = [
      {
        resource_server_identifier: envVar.AUTH0_AUDIENCE,
        permission_name: `uuid:${currentNode.uuid}:read`,
      },
      {
        resource_server_identifier: envVar.AUTH0_AUDIENCE,
        permission_name: `uuid:${currentNode.uuid}:write`,
      },
      {
        resource_server_identifier: envVar.AUTH0_AUDIENCE,
        permission_name: `uuid:${currentNode.uuid}:execute`,
      },
    ];
    Axios.post(
      `${envVar.AUTH0_PROXY_URL}/users/${selectedUser}/permissions`,
      {
        permissions: permissions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(() => {
        setPermissionAddedMsg('Added permission');
      })
      .catch(() => {
        setPermissionAddedMsg('Error adding permission');
      })
      .finally(() => {
        setShowPermissionAdded(true);
        setTimeout(() => {
          setShowPermissionAdded(false);
        }, 5000);
      });
  };

  const handleGenerateNodeProps = ({node, path}) => ({
    buttons: [
      <button
        key={path}
        style={{
          border: '0px',
          cursor: 'pointer',
          backgroundColor: 'lightgreen',
        }}
        onClick={ev => handleAddNodeClick(ev, node, path)}
      >
        +
      </button>,
      <button
        key={path}
        style={{
          border: '0px',
          cursor: 'pointer',
          backgroundColor: 'orange',
        }}
        onClick={ev => handleEditNodeClick(ev, node, path)}
      >
        e
      </button>,
      <button
        key={path}
        style={{
          border: '0px',
          cursor: 'pointer',
          backgroundColor: 'lightcoral',
        }}
        onClick={ev => handleRemoveNodeClick(ev, node, path)}
      >
        -
      </button>,
    ],
  });
  return (
    <HierarchyManagementContainer>
      <div>Hierarchy Management</div>

      {showNewHierarchyModal && (
        <Cover>
          <Modal>
            <div>
              Hierarchy Name:
              <input type="text" ref={hierarchyNameRef} />
              Hierarchy Type:
              <input type="text" ref={hierarchyTypeRef} />
            </div>
            <button
              onClick={() => {
                addNodeToDb();
                setShowNewHierarchyModal(false);
              }}
            >
              Save
            </button>
            <button onClick={() => setShowNewHierarchyModal(false)}>
              Cancel
            </button>
          </Modal>
        </Cover>
      )}
      {showEditHierarchyModal && users && (
        <Cover>
          <Modal>
            <div className="new-hierarchy-dialog">
              <div>
                New Hierarchy Name:
                <input
                  type="text"
                  ref={newHierarchyNameRef}
                  defaultValue={currentNode.name}
                />
              </div>
              <button
                onClick={() => {
                  handleEditHierarchy();
                  setShowEditHierarchyModal(false);
                }}
              >
                Save
              </button>
            </div>
            <div className="user-permission-dialog">
              <select
                name="users"
                onChange={e => {
                  setSelectedUser(e.target.value);
                }}
              >
                <option value={null}>Select user</option>
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedUser}
                onClick={handleAddPermissionToAUser}
              >
                Add permission
              </button>
            </div>
            {showPermissionAdded ? (
              <div>{permissionAddedMsg}</div>
            ) : (
              <div style={{height: '20px'}}></div>
            )}

            <div className="cancel-btn">
              <button onClick={() => setShowEditHierarchyModal(false)}>
                Cancel
              </button>
            </div>
          </Modal>
        </Cover>
      )}
      {showNotification ? (
        <NotificationPanel text={`Cannot delete ${currentNode.name}`} />
      ) : (
        <div style={{height: '55px'}}></div>
      )}
      {hierarchies && (
        <SortableTree
          treeData={hierarchies}
          onChange={treeData => {
            dispatch(setHierarchyTree(treeData));
          }}
          // onMoveNode={setNewNodePosition}
          canDrag={false}
          generateNodeProps={handleGenerateNodeProps}
        />
      )}
    </HierarchyManagementContainer>
  );
};

export default HierarchyManagement;
