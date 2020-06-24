import {mount} from 'enzyme';
import React from 'react';
import {StaticRouter} from 'react-router';

import DeviceDashboard from './DeviceDashboard';

describe('DeviceDashboard', () => {
  it('renders', () => {
    const context = {};
    const component = mount(
      <StaticRouter location="someLocation" context={context}>
        <DeviceDashboard
          devices={{
            all: [
              {
                type: 'node',
                external_id: 'some-device-id',
                parent: {external_id: 'some-parent-id'},
              },
              {
                type: 'node',
                external_id: 'some-other-device-id',
                parent: {external_id: 'some-parent-id'},
              },
            ],
          }}
          url="some-url"
        />
      </StaticRouter>,
    );

    expect(component).toMatchSnapshot();
  });
});
