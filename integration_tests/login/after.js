
insomnia.test('Check if status is 200', () => {
    insomnia.expect(insomnia.response.code).to.eql(200);
});

insomnia.test('Are valid keys', () => {

    const jsonBody = insomnia.response.json();


    insomnia.expect(jsonBody).to.have.all.keys('access_token', 'refresh_token');
});



const jsonBody = insomnia.response.json();
insomnia.environment.set("access_token", jsonBody.access_token);
console.log(insomnia.environment.get("access_token"))
