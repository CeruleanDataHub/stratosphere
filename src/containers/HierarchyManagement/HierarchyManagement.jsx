import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import SortableTree from 'react-sortable-tree';
import Axios from 'axios';
import {useAuth0} from '../../auth0-spa.jsx';
const HierarchyManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const HierarchyManagement = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const {getTokenSilently} = useAuth0();

  const getHierarchyTree = async () => {
    const token = await getTokenSilently();
    Axios.get(`https://ddh-api.azure-api.net/api/v1/hierarchy/tree`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => {
      console.log(resp.data);
      setHierarchy(resp.data);
    });
  };

  useEffect(() => {
    getHierarchyTree();
  }, []);

  return (
    <HierarchyManagementContainer>
      <div>Hierarchy Management</div>

      <SortableTree
        treeData={hierarchy}
        onChange={treeData => {
          setHierarchy(treeData);
        }}
      />
    </HierarchyManagementContainer>
  );
};

export default HierarchyManagement;
