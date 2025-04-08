const token = insomnia.environment.get("access_token");



insomnia.request.addHeader({ key: 'Authorization', value: 'Bearer ' + token });

insomnia.request.method = 'GET';

