insomnia.request.method = 'POST';

const username = "LukaszFabia"
const password = "lukasz"


insomnia.request.body.update({
    mode: 'raw',
    raw: JSON.stringify({
        email_or_username: username,
        password: password,
    }),
});







