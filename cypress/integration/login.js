describe('login', () => {
  it('should successfully log into our app', () => {
    console.log('before login');
    cy.login()
      .then(resp => {
        console.log('auth0 login body', resp.body);
        return resp.body;
      })
      .then(body => {
        const {access_token, expires_in, id_token} = body;
        const auth0State = {
          nonce: '',
          state: 'some-random-state',
        };
        console.log('BEFORE CALLBACK ');
        const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        cy.visit(callbackUrl, {
          onBeforeLoad(win) {
            win.document.cookie =
              'com.auth0.auth.some-random-state=' + JSON.stringify(auth0State);
          },
        });
      });
  });
});
