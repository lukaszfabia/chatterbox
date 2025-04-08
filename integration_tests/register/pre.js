
insomnia.request.method = 'POST';


insomnia.globals.set("username", "LukaszFabia");
insomnia.globals.set("password", "lukasz");


insomnia.request.body.update({
    mode: 'raw',
    raw: JSON.stringify({
        email: "lukaszfabia@example.com",
        password: insomnia.globals.get("password"),
        username: insomnia.globals.get("username")
    }),
});
