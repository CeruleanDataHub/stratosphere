import React from 'react';
import {Tab} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;

const ModalTabs = ({roleModalOpenTab, setRoleModalOpenTab, tabs}) => (
  <TabsContainer>
    {tabs.map((tab, key) => (
      <Tab
        text={tab}
        active={roleModalOpenTab === tab}
        onClick={() => setRoleModalOpenTab(tab)}
        key={key}
      />
    ))}
  </TabsContainer>
);

ModalTabs.propTypes = {
  roleModalOpenTab: PropTypes.string.isRequired,
  setRoleModalOpenTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ModalTabs;
