import styled from 'styled-components';
import {Form, Field} from 'react-final-form';
import React from 'react';
import PropTypes from 'prop-types';

const RuleFormContainer = styled.section`
  margin-top: 1em;
  border: 1px solid #000000;
  border-radius: 0.25em;
  background-color: lightgrey;
  padding: 0 1em 1em;
`;

const RuleForm = styled.form`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  justify-items: start;
`;

const NewRuleForm = props => {
  const fields = props.fields;
  const initialField = props.initialField;
  const initialLevel = props.initialLevel;
  const initialOperator = props.initialOperator;
  const onSubmit = props.onSubmit;

  return (
    <RuleFormContainer>
      <h2>New rule</h2>
      <Form
        initialValues={{
          field: initialField,
          level: initialLevel,
          operator: initialOperator,
        }}
        onSubmit={onSubmit}
      >
        {({handleSubmit, form}) => (
          <RuleForm
            onSubmit={async event => {
              await handleSubmit(event);
              form.reset();
            }}
          >
            <label htmlFor="name">Name</label>
            <Field
              name="name"
              data-cy="rule-name-input-e2e-test"
              component="input"
              type="text"
            />
            <label htmlFor="level">Level</label>
            <Field
              name="level"
              data-cy="rule-level-select-e2e-test"
              component="select"
            >
              <option value="alert">Alert</option>
              <option value="warning">Warning</option>
            </Field>
            <label htmlFor="field">Field</label>
            <Field
              name="field"
              data-cy="rule-field-select-e2e-test"
              component="select"
            >
              {fields.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Field>
            <label htmlFor="operator">Operator</label>
            <Field
              name="operator"
              data-cy="rule-operator-select-e2e-test"
              component="select"
            >
              <option value=">">&#62;</option>
              <option value="<">&#60;</option>
            </Field>
            <label>Value</label>
            <Field
              name="value"
              data-cy="rule-value-select-e2e-test"
              component="input"
              type="number"
            />
            <button data-cy="new-rule-submit-button-e2e-test" type="submit">
              Submit
            </button>
          </RuleForm>
        )}
      </Form>
    </RuleFormContainer>
  );
};

NewRuleForm.propTypes = {
  fields: PropTypes.array,
  initialField: PropTypes.string,
  initialLevel: PropTypes.string,
  initialOperator: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default NewRuleForm;
