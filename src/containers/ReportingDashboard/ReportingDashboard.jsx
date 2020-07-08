import React from 'react';
import styled from 'styled-components';
import {Grid, Cell, Line, KPICard} from '@ceruleandatahub/react-components';

const ReportingDashboardContainer = styled.section`
  padding: 2em 5em 5em 10em;
  background-color: #ffffff;
`;

const KPICardContainer = styled.section`
  border: 1px solid;
`;

const activeDevicesUsersGrowth = [
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
    value: 1485,
    growth: 0.15,
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
    value: 1485,
    growth: 0.15,
    color: '',
  },
];

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

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const currentDate = new Date();
const numberOfDaysInLastMonth = getDaysInMonth(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  0,
);
const numberOfDaysInCurrentMonth = getDaysInMonth(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0,
);

const getDummyData = numberOfDays => {
  const randomData = [];
  for (let i = 0; i < numberOfDays; i++) {
    randomData.push(Math.floor(Math.random() * Math.floor(100)));
  }
  return randomData;
};
const prevMonthSeries = [
  {name: 'Devices', data: getDummyData(numberOfDaysInLastMonth)},
  {name: 'Users', data: getDummyData(numberOfDaysInLastMonth)},
];

const currentMonthSeries = [
  {name: 'Devices', data: getDummyData(numberOfDaysInCurrentMonth)},
  {name: 'Users', data: getDummyData(numberOfDaysInCurrentMonth)},
];

const renderKPIRow = kpis => {
  return (
    <div style={{marginBottom: '8px'}}>
      <Grid>
        {kpis.map(kpi => {
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

const ReportingDashboard = () => {
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
      {renderKPIRow(activeDevicesUsersGrowth)}
      {renderKPIRow(activeDevicesUsersCosts)}
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
          series={prevMonthSeries}
        />
      </div>
      <div>
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
    </ReportingDashboardContainer>
  );
};

export default ReportingDashboard;
