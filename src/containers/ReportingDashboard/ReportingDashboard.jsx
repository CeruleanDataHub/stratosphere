import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment-timezone';

import {
  getLastMonthKPIData,
  getCurrentMonthKPIData,
} from '@denim/iot-platform-middleware-redux';

import {Grid, Cell, Line, KPICard} from '@ceruleandatahub/react-components';

const ReportingDashboardContainer = styled.section`
  padding: 2em 5em 5em 10em;
  background-color: #ffffff;
`;

const KPICardContainer = styled.section`
  border: 1px solid;
`;

const activeDevicesUsersCosts = [
  {
    id: 1,
    title: 'Active Device Costs',
    value: 14850,
  },
  {
    id: 2,
    title: 'Active Users Costs',
    value: 14850,
  },
  {
    id: 3,
    title: 'Active Devices Costs',
    value: 14850,
  },
  {
    id: 4,
    title: 'Active Users Costs',
    value: 14850,
  },
];
const ReportingDashboard = () => {
  const numberOfDaysInLastMonth = moment().subtract(1, 'month').daysInMonth();
  const numberOfDaysInCurrentMonth = moment().daysInMonth();

  const previousMonthSeries = [
    {name: 'Devices', data: []},
    {name: 'Users', data: []},
  ];

  const currentMonthSeries = [
    {name: 'Devices', data: []},
    {name: 'Users', data: []},
  ];

  const renderKPIRow = kpis => {
    //console.log('kois', kpis)
    return (
      <div style={{marginBottom: '8px'}}>
        <Grid>
          {kpis &&
            kpis.map(kpi => {
              return (
                <Cell key={kpi.id}>
                  <KPICardContainer>
                    <KPICard
                      title={kpi.title}
                      value={kpi.value}
                      growth={kpi.growth}
                      redValue={kpi.color === 'redValue'}
                      blueValue={kpi.color === 'blueValue'}
                    />
                  </KPICardContainer>
                </Cell>
              );
            })}
        </Grid>
      </div>
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const current = moment();
    const startOfCurrentMonth = current.startOf('month').format('MM/DD/YYYY');
    const endOfCurrentMonth = current.endOf('month').format('MM/DD/YYYY');

    const last = current.subtract(1, 'month');
    const startOfLastMonth = last.startOf('month').format('MM/DD/YYYY');
    const endOfLastMonth = last.endOf('month').format('MM/DD/YYYY');

    dispatch(
      getLastMonthKPIData({
        type: 'DAILY',
        startDate: startOfLastMonth,
        endDate: endOfLastMonth,
      }),
    );
    dispatch(
      getCurrentMonthKPIData({
        type: 'DAILY',
        startDate: startOfCurrentMonth,
        endDate: endOfCurrentMonth,
      }),
    );
  }, []);

  const lastMonthActiveUsers = useSelector(
    state => state.userActivity.lastMonthKPIData,
  );
  const currentMonthActiveUsers = useSelector(
    state => state.userActivity.currentMonthKPIData,
  );

  const activeDevicesUsersGrowth = () => [
    {
      id: 1,
      title: 'Active devices',
      value: 1485,
      growth: 0.15,
      color: '',
    },
    {
      id: 2,
      title: 'Active users',
      value: (lastMonthActiveUsers && lastMonthActiveUsers.total) || 0,
      growth: 0,
      color: '',
    },
    {
      id: 3,
      title: 'Active devices',
      value: 1485,
      growth: 0.15,
      color: '',
    },
    {
      id: 4,
      title: 'Active users',
      value: (currentMonthActiveUsers && currentMonthActiveUsers.total) || 0,
      growth: 0.15,
      color: '',
    },
  ];

  const prepareKPIData = (monthActiveUsers, numberOfDays) => {
    if (monthActiveUsers && monthActiveUsers.days) {
      const activeUsersPerDay = new Array(numberOfDays).fill(0);
      monthActiveUsers.days.map(day => {
        const arrayDay = new Date(day.time).getDate() - 1;
        activeUsersPerDay[arrayDay] = day.activeusercount;
      });
      return activeUsersPerDay;
    }
    return [];
  };

  previousMonthSeries[1].data = prepareKPIData(
    lastMonthActiveUsers,
    numberOfDaysInLastMonth,
  );

  currentMonthSeries[1].data = prepareKPIData(
    currentMonthActiveUsers,
    numberOfDaysInCurrentMonth,
  );

  return (
    <ReportingDashboardContainer>
      <Grid>
        <Cell>
          <div style={{textAlign: 'center'}}>June</div>
        </Cell>
        <Cell>
          <div style={{textAlign: 'center'}}>July forecast</div>
        </Cell>
      </Grid>
      {renderKPIRow(activeDevicesUsersGrowth())}
      {renderKPIRow(activeDevicesUsersCosts)}
      <Grid>
        <div
          style={{
            marginBottom: '12px',
          }}
        >
          <Line
            title=""
            xAxis={[
              {
                categories: Array.from(
                  Array(numberOfDaysInLastMonth),
                  (_, i) => i + 1,
                ),
              },
            ]}
            series={previousMonthSeries}
          />
        </div>
        <div
          style={{
            marginBottom: '12px',
          }}
        >
          <Line
            title=""
            xAxis={[
              {
                categories: Array.from(
                  Array(numberOfDaysInCurrentMonth),
                  (_, i) => i + 1,
                ),
              },
            ]}
            series={currentMonthSeries}
          />
        </div>
      </Grid>
    </ReportingDashboardContainer>
  );
};

export default ReportingDashboard;
