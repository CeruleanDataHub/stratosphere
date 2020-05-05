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
            <Field name="name" component="input" type="text" />
            <label htmlFor="level">Level</label>
            <Field name="level" component="select">
              <option value="alert">Alert</option>
              <option value="warning">Warning</option>
            </Field>
            <label htmlFor="field">Field</label>
            <Field name="field" component="select">
              {fields.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Field>
            <label htmlFor="operator">Operator</label>
            <Field name="operator" component="select">
              <option value=">">&#62;</option>
              <option value="<">&#60;</option>
            </Field>
            <label>Value</label>
            <Field name="value" component="input" type="number" />
            <button type="submit">Submit</button>
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
