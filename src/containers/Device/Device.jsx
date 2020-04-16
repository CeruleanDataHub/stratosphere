import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import NotificationPanel from '../NotificationPanel/NotificationPanel.jsx';
import io from 'socket.io-client';

const baseApiUrl = process.env.BASE_DB_API_URL;

const DeviceContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const RulesContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-gap: 20px;
`;

const NewRuleFormContainer = styled.section`
  margin-top: 1em;
  border: 1px solid #000000;
  border-radius: 0.25em;
  background-color: lightgrey;
  padding: 0 1em 1em;
`;

const NewRuleForm = styled.form`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  justify-items: start;
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
  "temperature",
  "humidity",
  "pressure",
  "txpower",
  "rssi",
  "voltage"
];

const INITIAL_FIELD = "temperature";

const Device = () => {

  const [ device, setDevice ] = useState({});
  const [ infoMessage, setInfoMessage ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ dirty, setDirty ] = useState(false);
  const [ deviceData, setDeviceData ] = useState('');
  const { deviceId } = useParams();

  let newRuleNameField = ""
  let newRuleLevelField = ""
  let newRuleFieldField = ""
  let newRuleOperatorField = ""
  let newRuleValueField = ""

  useEffect(() => {
    axios
        .get(baseApiUrl + '/api/twin/' + deviceId)
        .then((res) => {
          if (res.data.status === 404) {
            setErrorMessage("Error fetching device twin for " + deviceId + ": Not found");
          } else {
            setDevice(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("Error fetching device twin: " + err.message);
        });
  }, []);

  useEffect(() => {
    const socket = io(process.env.BASE_API_URL);
    const data = {
      deviceId,
    };
    socket.emit('UPDATE_DEVICE_SELECTION', {
      ...data,
      prop: 'ADD',
    });
    socket.on('DEVICE_DATA', deviceData => {
      console.log("DEVICE DATA", deviceData);
      setDeviceData(deviceData);
    });
    return function () {
      socket.emit('UPDATE_DEVICE_SELECTION', {
        ...data,
        prop: 'REMOVE',
      });
    };
  }, []);

  const containsOnlyNullFields = (object) => {
    return Object.keys(object).every((k) => object[k] === null);
  }

  const deleteSubRule = (ruleId, subRuleId, level) => {
    return () => {
      const newDevice = cloneDeep(device);
      newDevice.properties.desired[level][ruleId][subRuleId] = null;
      if (containsOnlyNullFields(newDevice.properties.desired[level][ruleId])) {
        newDevice.properties.desired[level][ruleId] = null;
      }
      setDevice(newDevice);
      setDirty(true);
    }
  }

  const addSubRule = (ruleId, level) => {
    return () => {
      const newDevice = cloneDeep(device);
      newDevice.properties.desired[level][ruleId][randomId()] = {
        field: INITIAL_FIELD,
        operator: ">",
        value: ""
      }
      setDevice(newDevice);
      setDirty(true);
    }
  }

  const addRule = (event) => {
    event.preventDefault();
    const newRuleName = newRuleNameField.value;
    const newRuleLevel = newRuleLevelField.value;
    const newRuleField = newRuleFieldField.value;
    const newRuleOperator = newRuleOperatorField.value;
    const newRuleValue = newRuleValueField.value;
    const newDevice = cloneDeep(device);
    if (!newDevice.properties.desired[newRuleLevel]) {
      newDevice.properties.desired[newRuleLevel] = {}
    }
    newDevice.properties.desired[newRuleLevel][newRuleName] = {};
    newDevice.properties.desired[newRuleLevel][newRuleName][randomId()] = {
      field: newRuleField,
      operator: newRuleOperator,
      value: newRuleValue
    }
    setDevice(newDevice);
    setDirty(true);
    document.getElementById("newRuleForm").reset();
  }

  const randomId = () => {
    return Math.random().toString(36).substring(7);
  }

  const save = () => {
    const data = {
      id: device.deviceId,
      state: {
        properties: {
          desired: {
            alerts: device.properties.desired.alerts,
            warnings: device.properties.desired.warnings
          }
        }
      }
    };

    axios
        .post(baseApiUrl + '/api/twin/update', data)
        .then((res) => {
          if (res.status !== 201) {
            showErrorMessage("Error saving rules: " + res.data.message);
          } else {
            showInfoMessage("Rules saved");
            setDirty(false);
          }
        })
        .catch((err) => {
          console.log(err);
          showErrorMessage("Error saving rules: " + err.message);
        });
  }

  const showInfoMessage = (message) => {
    setInfoMessage(message);
    setTimeout(() => {
      setInfoMessage("");
    }, 2000);
  }

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }

  const handleChange = (ruleId, subRuleId, field, level) => {
    return (event) => {
      const newDevice = cloneDeep(device);
      newDevice.properties.desired[level][ruleId][subRuleId][field] = event.target.value;
      setDevice(newDevice);
      setDirty(true);
    }
  }

  const render = () => {
    let alertRules;
    let warningRules;
    if (device.properties) {
      alertRules = device.properties.desired.alerts || [];
      warningRules = device.properties.desired.warnings || [];
    }
    return (
        <DeviceContainer>
          <InfoMessage>{infoMessage}</InfoMessage>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          { device.properties &&
            <div style={{margin: "1em"}}>
              <NotificationPanel text={deviceData.level}> </NotificationPanel>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h1>{device.deviceId}</h1>
                <button onClick={save} disabled={!dirty} style={{marginRight: "1em"}}>Save</button>
              </div>
              { Object.keys(alertRules).some((k) => alertRules[k] !== null) &&
              <>
                <h2>Alert rules</h2>
                <RulesContainer>
                  {renderRules(alertRules, "alerts")}
                </RulesContainer>
              </>
              }
              { Object.keys(warningRules).some((k) => warningRules[k] !== null) &&
              <>
                <h2>Warning rules</h2>
                <RulesContainer>
                  {renderRules(warningRules, "warnings")}
                </RulesContainer>
              </>
              }
              <NewRuleFormContainer>
                <h2>New rule</h2>
                <NewRuleForm id="newRuleForm" onSubmit={addRule}>
                  <span>Name</span><input type="text" ref={input => newRuleNameField = input}/>
                  <span>Level</span>
                  <select ref={select => newRuleLevelField = select}>
                    <option value="alerts">Alert</option>
                    <option value="warnings">Warning</option>
                  </select>
                  <span>Field</span>
                  <select ref={select => newRuleFieldField = select}>
                    {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <span>Operator</span>
                  <select ref={select => newRuleOperatorField = select}>
                    <option value=">">&#62;</option>
                    <option value="<">&#60;</option>
                  </select>
                  <span>Value</span>
                  <input type="number" ref={input => newRuleValueField = input}/>
                  <button type="submit">Submit</button>
                </NewRuleForm>
              </NewRuleFormContainer>
            </div>
          }
        </DeviceContainer>
    )
  }

  const renderRules = (rules, level) => {
    return Object.keys(rules).filter((ruleKey) => { return rules[ruleKey] !== null }).map((ruleKey) => {
      return renderRule(rules, ruleKey, level);
    })
  }

  const renderRule = (rules, ruleKey, level) => {
    return [
        <div style={{ margin: "0.2em 0" }} key={ruleKey}>{ruleKey}</div>,
        <div key={ruleKey + "_subrules"}>{ renderSubRules(rules, ruleKey, level) }</div>
      ]
  }

  const renderSubRules = (rules, ruleKey, level) => {
    const rule = rules[ruleKey];
    return Object.keys(rule).filter((subRuleKey) => { return rules[ruleKey][subRuleKey] !== null}).map((subRuleKey) => {
      const subRule = rules[ruleKey][subRuleKey];
      return <div key={subRuleKey} style={{ marginLeft: "1em", display: "grid", gridTemplateColumns: "repeat(5, min-content)", gridGap: "5px", marginBottom: "5px" }}>
        <select value={subRule.field} onChange={handleChange(ruleKey, subRuleKey, "field", level)}>
          { FIELDS.map((field) => {
            return <option key={field} value={field}>{field}</option>
          })}
        </select>
        <select value={subRule.operator} onChange={handleChange(ruleKey, subRuleKey, "operator", level)}>
          <option key=">" value=">">&#62;</option>
          <option key="<" value="<">&#60;</option>
        </select>
        <input type="number" defaultValue={subRule.value} onChange={handleChange(ruleKey, subRuleKey, "value", level)} />
        <AddOrRemoveIcon onClick={deleteSubRule(ruleKey, subRuleKey, level)}>-</AddOrRemoveIcon>
        <AddOrRemoveIcon onClick={addSubRule(ruleKey, level)}>+</AddOrRemoveIcon>
      </div>
    });
  }

  return render()
}

export default Device;
