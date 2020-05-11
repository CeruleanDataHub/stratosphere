import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {cloneDeep} from 'lodash';
import NotificationPanel from '../NotificationPanel/NotificationPanel.jsx';
import io from 'socket.io-client';
import env from '../../config';
import {useDispatch} from 'react-redux';
import {getTwin, updateTwin} from '@denim/iot-platform-middleware-redux';
import NewRuleForm from './NewRuleForm.jsx';

const DeviceContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const RulesContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-gap: 20px;
`;

const AddOrRemoveIcon = styled.div`
  cursor: pointer;
  font-size: 24px;
  margin-left: 5px;
  display: inline-block;
`;

const Message = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
`;

const InfoMessage = styled(Message)`
  color: green;
`;

const ErrorMessage = styled(Message)`
  color: red;
`;

const FIELDS = [
  'temperature',
  'humidity',
  'pressure',
  'txpower',
  'rssi',
  'voltage',
];

const INITIAL_FIELD = 'temperature';
const INITIAL_LEVEL = 'alert';
const INITIAL_OPERATOR = '>';

const envVar = env();
const baseApiUrl = envVar.BASE_API_URL;

const Device = () => {
  const [device, setDevice] = useState({});
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const [deviceData, setDeviceData] = useState('');
  const {deviceId} = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTwin(deviceId)).then(response => {
      if (response.payload.error) {
        setErrorMessage(`Error fetching device twin for device ${deviceId}`);
      } else {
        setDevice({
          id: response.payload.body.deviceId,
          state: {
            properties: {
              desired: {
                alerts: response.payload.body.properties.desired.alerts,
                warnings: response.payload.body.properties.desired.warnings,
              },
            },
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    let socket;
    let cancelled = false;
    if (!cancelled) {
      socket = io(baseApiUrl);
      const data = {
        deviceId,
      };
      socket.emit('UPDATE_DEVICE_SELECTION', {
        ...data,
        prop: 'ADD',
      });
      socket.on('DEVICE_DATA', deviceData => {
        setDeviceData(deviceData);
      });
      return function () {
        socket.emit('UPDATE_DEVICE_SELECTION', {
          ...data,
          prop: 'REMOVE',
        });
      };
    }
    return () => {
      cancelled = true;
      socket.close();
    };
  }, []);

  const containsOnlyNullFields = object => {
    return Object.keys(object).every(k => object[k] === null);
  };

  const deleteSubRule = (ruleId, subRuleId, level) => {
    return () => {
      const newDevice = cloneDeep(device);
      newDevice.state.properties.desired[level][ruleId][subRuleId] = null;
      if (
        containsOnlyNullFields(
          newDevice.state.properties.desired[level][ruleId],
        )
      ) {
        newDevice.state.properties.desired[level][ruleId] = null;
      }
      setDevice(newDevice);
      setDirty(true);
    };
  };

  const addSubRule = (ruleId, levelKey) => {
    return () => {
      const newDevice = cloneDeep(device);
      newDevice.state.properties.desired[levelKey][ruleId][randomId()] = {
        field: INITIAL_FIELD,
        operator: INITIAL_OPERATOR,
        value: '',
      };
      setDevice(newDevice);
      setDirty(true);
    };
  };

  const addRule = values => {
    const levelKey = values.level === 'alert' ? 'alerts' : 'warnings';

    const newDevice = cloneDeep(device);

    if (!newDevice.state.properties.desired[levelKey]) {
      newDevice.state.properties.desired[levelKey] = {};
    }
    newDevice.state.properties.desired[levelKey][values.name] = {};
    newDevice.state.properties.desired[levelKey][values.name][randomId()] = {
      field: values.field,
      operator: values.operator,
      value: values.value,
    };
    setDevice(newDevice);
    setDirty(true);
  };

  const randomId = () => {
    return Math.random().toString(36).substring(7);
  };

  const save = async () => {
    dispatch(updateTwin(device)).then(response => {
      if (response.payload.error) {
        console.log(response.payload.error);
        showErrorMessage('Error saving rules');
      } else {
        showInfoMessage('Rules saved');
        setDirty(false);
      }
    });
  };

  const showInfoMessage = message => {
    setInfoMessage(message);
    setTimeout(() => {
      setInfoMessage('');
    }, 2000);
  };

  const showErrorMessage = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);
  };

  const handleChange = (ruleId, subRuleId, field, level) => {
    return event => {
      const newDevice = cloneDeep(device);
      newDevice.state.properties.desired[level][ruleId][subRuleId][field] =
        event.target.value;
      setDevice(newDevice);
      setDirty(true);
    };
  };

  const render = () => {
    let alertRules = [];
    let warningRules = [];

    if (device.state && device.state.properties) {
      alertRules = device.state.properties.desired.alerts;
      warningRules = device.state.properties.desired.warnings;
    }

    return (
      <DeviceContainer>
        <InfoMessage>{infoMessage}</InfoMessage>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        {device.state && (
          <div style={{margin: '1em'}}>
            <NotificationPanel text={deviceData.level}> </NotificationPanel>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1>{device.deviceId}</h1>
              <button
                onClick={save}
                disabled={!dirty}
                style={{marginRight: '1em'}}
              >
                Save
              </button>
            </div>
            {Object.keys(alertRules).some(k => alertRules[k] !== null) && (
              <>
                <h2>Alert rules</h2>
                <RulesContainer>
                  {renderRules(alertRules, 'alerts')}
                </RulesContainer>
              </>
            )}
            {Object.keys(warningRules).some(k => warningRules[k] !== null) && (
              <>
                <h2>Warning rules</h2>
                <RulesContainer>
                  {renderRules(warningRules, 'warnings')}
                </RulesContainer>
              </>
            )}
            <NewRuleForm
              onSubmit={addRule}
              fields={FIELDS}
              initialField={INITIAL_FIELD}
              initialLevel={INITIAL_LEVEL}
              initialOperator={INITIAL_OPERATOR}
            />
          </div>
        )}
      </DeviceContainer>
    );
  };

  const renderRules = (rules, levelKey) => {
    return Object.keys(rules)
      .filter(ruleKey => {
        return rules[ruleKey] !== null;
      })
      .map(ruleKey => {
        return renderRule(rules, ruleKey, levelKey);
      });
  };

  const renderRule = (rules, ruleKey, levelKey) => {
    return [
      <div style={{margin: '0.2em 0'}} key={ruleKey}>
        {ruleKey}
      </div>,
      <div key={ruleKey + '_subrules'}>
        {renderSubRules(rules, ruleKey, levelKey)}
      </div>,
    ];
  };

  const renderSubRules = (rules, ruleKey, levelKey) => {
    const rule = rules[ruleKey];
    return Object.keys(rule)
      .filter(subRuleKey => {
        return rules[ruleKey][subRuleKey] !== null;
      })
      .map(subRuleKey => {
        const subRule = rules[ruleKey][subRuleKey];
        return (
          <div
            key={subRuleKey}
            style={{
              marginLeft: '1em',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, min-content)',
              gridGap: '5px',
              marginBottom: '5px',
            }}
          >
            <select
              value={subRule.field}
              onChange={handleChange(ruleKey, subRuleKey, 'field', levelKey)}
            >
              {FIELDS.map(field => {
                return (
                  <option key={field} value={field}>
                    {field}
                  </option>
                );
              })}
            </select>
            <select
              value={subRule.operator}
              onChange={handleChange(ruleKey, subRuleKey, 'operator', levelKey)}
            >
              <option key=">" value=">">
                &#62;
              </option>
              <option key="<" value="<">
                &#60;
              </option>
            </select>
            <input
              type="number"
              defaultValue={subRule.value}
              onChange={handleChange(ruleKey, subRuleKey, 'value', levelKey)}
            />
            <AddOrRemoveIcon
              onClick={deleteSubRule(ruleKey, subRuleKey, levelKey)}
            >
              -
            </AddOrRemoveIcon>
            <AddOrRemoveIcon onClick={addSubRule(ruleKey, levelKey)}>
              +
            </AddOrRemoveIcon>
          </div>
        );
      });
  };

  return render();
};

export default Device;
