import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import moment from 'moment-timezone';

import {Grid, Cell, Card, KPICard} from '@ceruleandatahub/react-components';
import {
  getMaxUserLoginCountInADay,
  getLastMonthUsersKPIData,
  getCurrentMonthUsersKPIData,
} from '@ceruleandatahub/middleware-redux';

const UsersAndRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const MarginBottomStyle = styled.div`
  margin-bottom: 5em;
`;

const KPICardContainer = styled.section`
  border: 1px solid;
`;

const UsersAndRoles = () => {
  const [nameOfCurrentMonth, setNameOfCurrentMonth] = useState('');
  const [nameOfLastMonth, setNameOfLastMonth] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const current = moment();
    const startOfCurrentMonth = current.startOf('month').format('MM/DD/YYYY');
    const endOfCurrentMonth = current.endOf('month').format('MM/DD/YYYY');
    setNameOfCurrentMonth(current.format('MMMM'));

    const last = current.subtract(1, 'month');
    const startOfLastMonth = last.startOf('month').format('MM/DD/YYYY');
    const endOfLastMonth = last.endOf('month').format('MM/DD/YYYY');
    setNameOfLastMonth(current.format('MMMM'));

    dispatch(
      getLastMonthUsersKPIData({
        type: 'DAILY',
        startDate: startOfLastMonth,
        endDate: endOfLastMonth,
      }),
    );
    dispatch(
      getCurrentMonthUsersKPIData({
        type: 'DAILY',
        startDate: startOfCurrentMonth,
        endDate: endOfCurrentMonth,
      }),
    );
    dispatch(getMaxUserLoginCountInADay());
  }, []);

  const maxUserLoginCountInADay = useSelector(
    state => state.userActivity.maxUserLoginCountInADay,
  );

  const lastMonthActiveUsers = useSelector(
    state => state.userActivity.lastMonthKPIData,
  );
  const currentMonthActiveUsers = useSelector(
    state => state.userActivity.currentMonthKPIData,
  );

  return (
    <UsersAndRolesContainer>
      <Grid as={MarginBottomStyle}>
        <Cell>
          <KPICardContainer>
            <KPICard
              title="Most numbers of login in a day"
              value={maxUserLoginCountInADay && maxUserLoginCountInADay.count}
              showPercentage={false}
            />
          </KPICardContainer>
        </Cell>
        <Cell>
          <KPICardContainer>
            <KPICard
              title={`Active Users in ${nameOfLastMonth}`}
              value={lastMonthActiveUsers && lastMonthActiveUsers.total}
              showPercentage={false}
            />
          </KPICardContainer>
        </Cell>
        <Cell>
          <KPICardContainer>
            <KPICard
              title={`Active Users in ${nameOfCurrentMonth}(so far)`}
              value={currentMonthActiveUsers && currentMonthActiveUsers.total}
              showPercentage={false}
            />
          </KPICardContainer>
        </Cell>
        <Cell>
          <KPICardContainer>
            <KPICard
              title={`Active Users in ${nameOfCurrentMonth}`}
              value={currentMonthActiveUsers && currentMonthActiveUsers.total}
              showPercentage={false}
            />
          </KPICardContainer>
        </Cell>
      </Grid>
      <Grid>
        <Cell>
          <Link
            to={{
              pathname: '/manage-users',
            }}
          >
            <Card title="Manage Users" icon="user" />
          </Link>
        </Cell>
        <Cell>
          <Link to="/manage-roles">
            <Card title="Manage Roles" icon="rocket" />
          </Link>
        </Cell>
        {/* <Cell>
          <Link to="/manage-groups">
            <Card title="Manage Groups" icon="users" />
          </Link>
        </Cell> */}
      </Grid>
    </UsersAndRolesContainer>
  );
};

export default UsersAndRoles;
