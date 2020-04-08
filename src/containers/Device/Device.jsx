import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';

const baseApiUrl = process.env.DB_API_URL;

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

export default class Device extends React.Component {

  newRuleNameField = ""
  newRuleLevelField = ""
  newRuleFieldField = ""
  newRuleOperatorField = ""
  newRuleValueField = ""

  constructor() {
    super();
    this.state = { device: {}, dirty: false, infoMessage: "", errorMessage: "" };
  }

  componentDidMount() {
    this.getDevice(this.props.match.params.id);
  }

  getDevice(id) {
    axios
        .get(baseApiUrl + '/api/twin/' + id)
        .then((res) => {
          this.setState({ device: res.data });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ errorMessage: "Error fetching device twin: " + err.message });
        })
        .finally(() => {});
  }

  containsOnlyNullFields(object) {
    return Object.keys(object).every((k) => object[k] === null);
  }

  deleteSubRule(ruleId, subRuleId, level) {
    return () => {
      const newDevice = cloneDeep(this.state.device);
      newDevice.properties.desired[level][ruleId][subRuleId] = null;
      if (this.containsOnlyNullFields(newDevice.properties.desired[level][ruleId])) {
        newDevice.properties.desired[level][ruleId] = null;
      }
      this.setState({ device: newDevice, dirty: true });
    }
  }

  addSubRule(ruleId, level) {
    return () => {
      const newDevice = cloneDeep(this.state.device);
      newDevice.properties.desired[level][ruleId][this.randomId()] = {
        field: INITIAL_FIELD,
        operator: ">",
        value: ""
      }
      this.setState({ device: newDevice, dirty: true });
    }
  }

  addRule = (event) => {
    event.preventDefault();
    const newRuleName = this.newRuleNameField.value;
    const newRuleLevel = this.newRuleLevelField.value;
    const newRuleField = this.newRuleFieldField.value;
    const newRuleOperator = this.newRuleOperatorField.value;
    const newRuleValue = this.newRuleValueField.value;
    const newDevice = cloneDeep(this.state.device);
    if (!newDevice.properties.desired[newRuleLevel]) {
      newDevice.properties.desired[newRuleLevel] = {}
    }
    newDevice.properties.desired[newRuleLevel][newRuleName] = {};
    newDevice.properties.desired[newRuleLevel][newRuleName][this.randomId()] = {
      field: newRuleField,
      operator: newRuleOperator,
      value: newRuleValue
    }
    this.setState({ device: newDevice, dirty: true });
    document.getElementById("newRuleForm").reset();
  }

  randomId = () => {
    return Math.random().toString(36).substring(7);
  }

  save = () => {
    const data = {
      id: this.state.device.deviceId,
      state: {
        properties: {
          desired: {
            alerts: this.state.device.properties.desired.alerts,
            warnings: this.state.device.properties.desired.warnings
          }
        }
      }
    };

    axios
        .post(baseApiUrl + '/api/twin/update', data)
        .then((res) => {
          this.showInfoMessage("Rules saved")
          this.setState({ dirty: false })
        })
        .catch((err) => {
          console.log(err);
          this.showErrorMessage("Error saving rules: " + err.message)
        });
  }

  showInfoMessage(message) {
    this.setState({ infoMessage: message });
    setTimeout(() => {
      this.setState({ infoMessage: "" });
    }, 2000);
  }

  showErrorMessage(message) {
    this.setState({ errorMessage: message });
    setTimeout(() => {
      this.setState({ errorMessage: "" });
    }, 2000);
  }

  handleChange(ruleId, subRuleId, field, level) {
    return (event) => {
      const newDevice = cloneDeep(this.state.device);
      newDevice.properties.desired[level][ruleId][subRuleId][field] = event.target.value;
      this.setState({ device: newDevice, dirty: true });
    }
  }

  render() {
    if (!this.state.device.properties) {
      return null
    }
    const alertRules = this.state.device.properties.desired.alerts;
    const warningRules = this.state.device.properties.desired.warnings;

    return (
        <DeviceContainer>
          <InfoMessage>{ this.state.infoMessage }</InfoMessage>
          <ErrorMessage>{ this.state.errorMessage }</ErrorMessage>
          <div style={{ margin: "1em" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1>{this.props.match.params.id}</h1>
              <button onClick={this.save} disabled={ !this.state.dirty } style={{ marginRight: "1em" }}>Save</button>
            </div>
            { Object.keys(alertRules).some((k) => alertRules[k] !== null) &&
              <>
                <h2>Alert rules</h2>
                <RulesContainer>
                  { this.renderRules(alertRules, "alerts")}
                </RulesContainer>
              </>
            }
            { Object.keys(warningRules).some((k) => warningRules[k] !== null) &&
              <>
                <h2>Warning rules</h2>
                <RulesContainer>
                  { this.renderRules(warningRules, "warnings") }
                </RulesContainer>
              </>
            }
            <NewRuleFormContainer>
              <h2>New rule</h2>
              <NewRuleForm id="newRuleForm" onSubmit={this.addRule}>
                <span>Name</span><input type="text" ref={input => this.newRuleNameField = input}/>
                <span>Level</span>
                <select ref={select => this.newRuleLevelField = select}>
                  <option value="alerts">Alert</option>
                  <option value="warnings">Warning</option>
                </select>
                <span>Field</span>
                <select ref={select => this.newRuleFieldField = select}>
                  { FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <span>Operator</span>
                <select ref={select => this.newRuleOperatorField = select}>
                  <option value=">">&#62;</option>
                  <option value="<">&#60;</option>
                </select>
                <span>Value</span>
                <input type="number" ref={input => this.newRuleValueField = input}/>
                <button type="submit">Submit</button>
              </NewRuleForm>
            </NewRuleFormContainer>
          </div>
        </DeviceContainer>
    )
  }

  renderRules = (rules, level) => {
    return Object.keys(rules).filter((ruleKey) => { return rules[ruleKey] !== null }).map((ruleKey) => {
      return this.renderRule(rules, ruleKey, level);
    })
  }

  renderRule = (rules, ruleKey, level) => {
    return [
        <div style={{ margin: "0.2em 0" }} key={ruleKey}>{ruleKey}</div>,
        <div key={ruleKey + "_subrules"}>{ this.renderSubRules(rules, ruleKey, level) }</div>
      ]
  }

  renderSubRules = (rules, ruleKey, level) => {
    const rule = rules[ruleKey];
    return Object.keys(rule).filter((subRuleKey) => { return rules[ruleKey][subRuleKey] !== null}).map((subRuleKey, index) => {
      const subRule = rules[ruleKey][subRuleKey];
      return <div key={subRuleKey} style={{ marginLeft: "1em", display: "grid", gridTemplateColumns: "repeat(5, min-content)", gridGap: "5px", marginBottom: "5px" }}>
        <select value={subRule.field} onChange={this.handleChange(ruleKey, subRuleKey, "field", level)}>
          { FIELDS.map((field) => {
            return <option key={field} value={field}>{field}</option>
          })}
        </select>
        <select value={subRule.operator} onChange={this.handleChange(ruleKey, subRuleKey, "operator", level)}>
          <option key=">" value=">">&#62;</option>
          <option key="<" value="<">&#60;</option>
        </select>
        <input type="number" defaultValue={subRule.value} onChange={this.handleChange(ruleKey, subRuleKey, "value", level)} />
        <AddOrRemoveIcon onClick={this.deleteSubRule(ruleKey, subRuleKey, level)}>-</AddOrRemoveIcon>
        {index === 0 &&
          <AddOrRemoveIcon onClick={this.addSubRule(ruleKey, level)}>+</AddOrRemoveIcon>
        }
      </div>
    });
  }
}
