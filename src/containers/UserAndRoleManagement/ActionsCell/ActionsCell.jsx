import React, {useRef, useState} from 'react';
import {
  Button,
  Icon,
  Popover,
  useOutsideClick,
} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Action from './Action.jsx';

const BorderlessButton = styled.span`
  border: 0px;
  transform: rotate(90deg);
`;

const ActionsCell = ({setModalOpenTab, actionsData}) => {
  const moreRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useOutsideClick(popoverRef, () => setPopoverOpen(false));

  return (
    <>
      <Button
        onClick={() => setPopoverOpen(!popoverOpen)}
        ref={moreRef}
        as={BorderlessButton}
      >
        <Icon name="more-alt" />
      </Button>
      <Popover
        isOpen={popoverOpen}
        containerRef={moreRef}
        popoverRef={popoverRef}
      >
        {actionsData.map(({icon, modalToOpen, text}, key) => (
          <Action
            key={key}
            onClick={() => setModalOpenTab(modalToOpen)}
            icon={icon}
            text={text}
          />
        ))}
      </Popover>
    </>
  );
};

ActionsCell.propTypes = {
  setModalOpenTab: PropTypes.func.isRequired,
  actionsData: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      modalToOpen: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
};

export default ActionsCell;
