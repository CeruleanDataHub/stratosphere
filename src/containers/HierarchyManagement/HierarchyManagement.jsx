import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
} from 'react-sortable-tree';
import Axios from 'axios';

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
  const [hierarchy, setHierarchy] = useState([]);
  const [showNewHierarchyModal, setShowNewHierarchyModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [currentNode, setCurrentNode] = useState({});
  const {getTokenSilently} = useAuth0();
  const hierarchyNameRef = useRef(null);
  const hierarchyTypeRef = useRef(null);

  const getHierarchyTree = async () => {
    const token = await getTokenSilently();
    Axios.get(`${envVar.BASE_API_URL}/hierarchy/tree`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => {
      setHierarchy(resp.data);
    });
  };

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
  };

  useEffect(() => {
    getHierarchyTree();
  }, []);

  const addNodeToDb = async () => {
    const hierarchyName = hierarchyNameRef.current.value;
    const hierarchyType = hierarchyTypeRef.current.value;
    const token = await getTokenSilently();

    const hierarchyToAdd = {
      type: hierarchyType,
      name: hierarchyName,
      parent: currentNode.parentId,
    };

    const addedHierarchy = await Axios.post(
      `${envVar.BASE_API_URL}/hierarchy/`,
      hierarchyToAdd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(resp => resp.data);
    addedHierarchy.title = addedHierarchy.name;
    addedHierarchy.subtitle = addedHierarchy.description;

    console.log(currentNode);

    const newHierarchy = addNodeUnderParent({
      treeData: hierarchy,
      parentKey: currentNode.parentKey,
      expandParent: true,
      getNodeKey: ({treeIndex}) => treeIndex,
      newNode: addedHierarchy,
      addAsFirstChild: true,
    }).treeData;

    setHierarchy(newHierarchy);
  };

  const handleAddNodeClick = (ev, node, path) => {
    ev.preventDefault();
    setCurrentNode({
      parentId: node.id,
      parentName: node.name,
      parentKey: path[path.length - 1],
    });
    setShowNewHierarchyModal(true);
  };

  const handleRemoveNodeClick = async (ev, node, path) => {
    ev.preventDefault();
    setCurrentNode({
      name: node.name,
    });
    const token = await getTokenSilently();

    await Axios.delete(`${envVar.BASE_API_URL}/hierarchy/${node.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const newHierarchy = removeNodeAtPath({
          treeData: hierarchy,
          path,
          getNodeKey: ({treeIndex}) => treeIndex,
        });
        setHierarchy(newHierarchy);
      })
      .catch(err => {
        if (
          err.response.data.message &&
          err.response.data.message.includes('contains children')
        ) {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
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
      {showNotification ? (
        <NotificationPanel
          text={`Cannot delete ${currentNode.name} because it contains children`}
        />
      ) : (
        <div style={{height: '55px'}}></div>
      )}
      <SortableTree
        treeData={hierarchy}
        onChange={treeData => {
          setHierarchy(treeData);
        }}
        onMoveNode={setNewNodePosition}
        generateNodeProps={handleGenerateNodeProps}
      />
    </HierarchyManagementContainer>
  );
};

export default HierarchyManagement;
