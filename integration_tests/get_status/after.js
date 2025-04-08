
const id = insomnia.environment.get("id");


insomnia.test('Check if status is 200', () => {
    insomnia.expect(insomnia.response.code).to.eql(200);
});

insomnia.test('Have all valid keys', () => {
    insomnia.expect({ userID: 1, isOnline: 2 }).to.have.all.keys('userID', 'isOnline');
});


insomnia.test('The same id as in url', () => {

    const jsonBody = insomnia.response.json();
    insomnia.expect(jsonBody.userID).to.eql(id);
});