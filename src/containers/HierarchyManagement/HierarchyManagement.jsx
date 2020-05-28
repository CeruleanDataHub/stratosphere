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
  width: 500px;
  height: 300px;
  z-index: 100;
  background-color: white;
  border: 1px black solid;
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

  const hierarchyNameRef = useRef(null);
  const hierarchyTypeRef = useRef(null);
  const newHierarchyNameRef = useRef(null);
  const {getTokenSilently} = useAuth0();
  const dispatch = useDispatch();

  const hierarchies = useSelector(state => state.hierarchies.tree);
  console.log('hierarchies', hierarchies);

  /*    
  // Move node code, could be used in the future
  const setNewNodePosition = async data => {
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
  }; */

  const getUsers = async () => {
    const token = await getTokenSilently();
    console.log(token);
    await Axios({
      method: 'GET',
      url: `${envVar.AUTH0_PROXY_URL}/users?fields=user_id%2Cemail%2Cname&include_fields=true`,
      headers: {authorization: 'Bearer ' + token},
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
      parent: currentNode.d,
    };

    dispatch(addHierarchy(hierarchyToAdd)).then(() => {
      dispatch(getHierarchyTree());
    });
    /*
    addedHierarchy.title = addedHierarchy.name;
    addedHierarchy.subtitle = addedHierarchy.description;

    const newHierarchy = addNodeUnderParent({
      treeData: hierarchy,
      parentKey: currentNode.parentKey,
      expandParent: true,
      getNodeKey: ({treeIndex}) => treeIndex,
      newNode: addedHierarchy,
      addAsFirstChild: true,
    }).treeData;
    */
  };

  const handleAddNodeClick = (ev, node) => {
    ev.preventDefault();
    setCurrentNode({
      parentId: node.id,
    });
    setShowNewHierarchyModal(true);
  };

  const handleRemoveNodeClick = async (ev, node) => {
    ev.preventDefault();
    setCurrentNode({
      name: node.name,
    });

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
  /*
  const addPermissionToAUser = async userId => {
    const token = await getTokenSilently();

    const permissions = [
      {
        resource_server_identifier: envVar.AUTH0_APP_SERVER_ID,
        permission_name: `uuid:${currentNode.uuid}:read`,
      },
      {
        resource_server_identifier: envVar.AUTH0_APP_SERVER_ID,
        permission_name: `uuid:${currentNode.uuid}:write`,
      },
      {
        resource_server_identifier: envVar.AUTH0_APP_SERVER_ID,
        permission_name: `uuid:${currentNode.uuid}:execute`,
      },
    ];
    Axios.post(
      `${auth0ProxyUrl}/users/${userId}/permissions`,
      {
        permissions: permissions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {});
  };
*/
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
  console.log('USERS : ', users);
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
            <div>
              New Hierarchy Name:
              <input
                type="text"
                ref={newHierarchyNameRef}
                defaultValue={currentNode.name}
              />
            </div>
            <select name="users">
              {users.map(user => {
                <option value={user.user_id}>{user.name}</option>;
              })}
            </select>
            <button
              onClick={() => {
                handleEditHierarchy();
                setShowEditHierarchyModal(false);
              }}
            >
              Save
            </button>
            <button onClick={() => setShowEditHierarchyModal(false)}>
              Cancel
            </button>
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
