insomnia.test('Check if status is 201', () => {
    insomnia.expect(insomnia.response.code).to.eql(201);
});

insomnia.test('Check if conains valid keys', () => {


    const jsonBody = insomnia.response.json();


    insomnia.expect(jsonBody).to.have.all.keys('access_token', 'refresh_token');

});