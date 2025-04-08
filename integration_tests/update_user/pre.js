
const token = insomnia.environment.get("access_token");

insomnia.request.method = 'PUT';

insomnia.request.addHeader({ key: 'Authorization', value: 'Bearer ' + token });

insomnia.request.body.update({
    mode: 'raw',
    raw: '{"email": "272724@example.com"}',
});
