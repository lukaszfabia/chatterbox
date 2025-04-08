
insomnia.test('Check if status is 200', () => {
    insomnia.expect(insomnia.response.code).to.eql(200);
});

