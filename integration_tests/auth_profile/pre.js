const accessToken = insomnia.environment.get("access_token");

console.log(accessToken);


if (accessToken) {
    insomnia.request.addHeader({ key: 'Authorization', value: 'Bearer ' + accessToken });
}


insomnia.request.method = 'GET';



