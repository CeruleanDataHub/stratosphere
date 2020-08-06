import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {getHierarchyTree} from '@ceruleandatahub/middleware-redux';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {
  Button,
  Cell,
  Grid,
  Icon,
  DataTable,
  Select,
} from '@ceruleandatahub/react-components';
import {useAuth0} from '../../auth0-spa.jsx';
import env from '../../config';
import PropTypes from 'prop-types';

const StyledCell = styled(Cell)`
  width: 300px;
  margin: 10px 0 10px auto;
`;

const StyledButton = styled.button`
  margin: 10px;
  height: 40px;
`;

const TextRightDiv = styled.div`
  width: 100%;
  text-align: right;
`;

const envVar = env();
const auth0ProxyUrl = `${envVar.BASE_API_URL}/auth0`;

const HierarchyTab = ({user}) => {
  const [usersPermissions, setUsersPermissions] = useState();
  const [userHierarchies, setUserHierarchies] = useState();
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [flatHierarchies, setFlatHierarchies] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const hierarchiesTree = useSelector(state => state.hierarchies.tree);
  const dispatch = useDispatch();

  const {getTokenSilently} = useAuth0();

  const removePermissionFromTheUser = async uuid => {
    const permissionsToDelete = usersPermissions
      .filter(uP => uP.permission_name.includes(uuid))
      .map(perm => ({
        permission_name: perm.permission_name,
        resource_server_identifier: perm.resource_server_identifier,
      }));

    const token = await getTokenSilently();
    await Axios.delete(`${auth0ProxyUrl}/users/${user.userId}/permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {permissions: permissionsToDelete},
    }).then(() => {
      setUsersPermissions(
        usersPermissions.filter(uP => !uP.permission_name.includes(uuid)),
      );
      setUserHierarchies(userHierarchies.filter(uH => uH.uuid !== uuid));
    });
  };

  // eslint-disable-next-line react/prop-types
  const ModalDataTableToolCell = ({uuid}) => (
    <Button onClick={() => removePermissionFromTheUser(uuid)}>
      <Icon name="trash" />
    </Button>
  );

  const manageUsersModalDataColumns = [
    {id: 1, name: 'Name', selector: 'name'},
    {
      id: 2,
      name: '',
      selector: 'actions',
      // eslint-disable-next-line react/prop-types,react/display-name
      cell: ({uuid}) => <ModalDataTableToolCell uuid={uuid} />,
    },
  ];

  const getAllHierarchies = () => {
    dispatch(getHierarchyTree());
  };

  const getUsersPermissions = async () => {
    const token = await getTokenSilently();
    Axios.get(`${auth0ProxyUrl}/users/${user.userId}/permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.data.status === 404) {
          console.log('Error fetching roles');
        } else {
          setUsersPermissions(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const iterateHierarchy = (hierarchy, indent, uiHierarchies) => {
    uiHierarchies.push({
      name: hierarchy.title,
      value: hierarchy.title,
      id: hierarchy.id,
      uuid: hierarchy.uuid,
      indentLevel: indent,
    });
    hierarchy.children.map(child => {
      iterateHierarchy(child, indent + 4, uiHierarchies);
    });
  };

  const formatHierarchies = () => {
    const uiHierarchies = [];
    hierarchiesTree.map(hierarchy =>
      iterateHierarchy(hierarchy, 0, uiHierarchies),
    );
    return uiHierarchies;
  };

  const mapPermissionUUIDToHieracrchy = hierarchies => {
    const userPermissionUUIDs = usersPermissions
      .filter(userPermission => {
        const regexp = /uuid:.*:read/g;
        return userPermission.permission_name.match(regexp);
      })
      .map(perm => perm.permission_name.split(':')[1]);
    const filteredHierarchies = hierarchies.filter(hierarchy =>
      userPermissionUUIDs.some(userPerm => userPerm === hierarchy.uuid),
    );
    setUserHierarchies(filteredHierarchies);
  };

  useEffect(() => {
    const setupTree = () => {
      if (!hierarchiesTree || hierarchiesTree.length === 0) {
        getAllHierarchies();
      }

      if (!usersPermissions || usersPermissions.length === 0) {
        getUsersPermissions();
      }
    };
    setupTree();
  }, []);

  useEffect(() => {
    const getAllPermissions = async () => {
      const token = await getTokenSilently();
      Axios.get(
        `${auth0ProxyUrl}/resource-servers/${envVar.AUTH0_RESOURCE_SERVER_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then(({data}) => {
        setAllPermissions(data.scopes);
      });
    };
    getAllPermissions();
  }, []);

  if (!hierarchiesTree || !usersPermissions) {
    return <div>Loading...</div>;
  } else if (!userHierarchies) {
    const formattedHierarchies = formatHierarchies();
    setFlatHierarchies(formattedHierarchies);
    mapPermissionUUIDToHieracrchy(formattedHierarchies);
  }

  const filterSelectHierarchies = () => {
    return flatHierarchies.filter(
      flat => !userHierarchies.some(userHier => userHier.uuid === flat.uuid),
    );
  };

  const handleGrantAccess = async () => {
    const token = await getTokenSilently();

    const hierarchy = flatHierarchies.find(
      hier => hier.name === selectedHierarchy,
    );
    const filteredHierarchies = allPermissions
      .filter(perm => perm.value.includes(hierarchy.uuid))
      .map(permission => ({
        resource_server_identifier: envVar.AUTH0_AUDIENCE,
        permission_name: permission.value,
      }));
    Axios.post(
      `${auth0ProxyUrl}/users/${user.userId}/permissions`,
      {
        permissions: filteredHierarchies,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      const currentUserHierarchies = [...userHierarchies, hierarchy];
      setUserHierarchies(currentUserHierarchies);
    });
  };

  return (
    <>
      <Grid columns="6fr 1fr">
        <StyledCell>
          <Select
            onChange={event => {
              setSelectedHierarchy(event.target.value);
            }}
            items={filterSelectHierarchies()}
            selectedOption={selectedHierarchy}
          />
        </StyledCell>
        <Cell>
          <Button
            as={StyledButton}
            onClick={() => {
              handleGrantAccess();
            }}
          >
            Grant Access
          </Button>
        </Cell>
      </Grid>
      <DataTable columns={manageUsersModalDataColumns} data={userHierarchies} />
      <TextRightDiv>
        <a href="/manage">Manage Hierarchies</a>
      </TextRightDiv>
    </>
  );
};

export default HierarchyTab;

HierarchyTab.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,
};
