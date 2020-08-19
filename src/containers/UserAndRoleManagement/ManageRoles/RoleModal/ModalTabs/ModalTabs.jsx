import React from 'react';
import {Tab} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;

const ModalTabs = ({activeTab, setActiveTab, tabs}) => (
  <TabsContainer>
    {tabs.map((tab, key) => (
      <Tab
        text={tab}
        active={activeTab === tab}
        onClick={() => setActiveTab(tab)}
        key={key}
      />
    ))}
  </TabsContainer>
);

ModalTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ModalTabs;
