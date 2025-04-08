
insomnia.test('Check if status is 200', () => {
    insomnia.expect(insomnia.response.code).to.eql(200);
});

const jsonBody = insomnia.response.json();

insomnia.test('Response has all required keys and valid status', function () {

    insomnia.expect(jsonBody).to.have.all.keys(
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'firstName',
        'lastName',
        'username',
        'email',
        'bio',
        'avatarURL',
        'backgroundURL'
    );
});

insomnia.test('Check types', () => {
    insomnia.expect(jsonBody.id).to.be.a('string');
    insomnia.expect(jsonBody.createdAt).to.be.a('string');
    insomnia.expect(jsonBody.updatedAt).to.be.a('string');
    insomnia.expect(jsonBody.username).to.be.a('string');
    insomnia.expect(jsonBody.email).to.be.a('string');

    insomnia.expect(jsonBody.deletedAt).to.satisfy(function (val) {
        return val === null || typeof val === 'string';
    });
});

insomnia.environment.set("id", jsonBody.id);

