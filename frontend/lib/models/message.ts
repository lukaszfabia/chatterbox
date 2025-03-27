export type Message = {
    ID: string,
    SenderID: string,
    ReceiverID: string
    Conent: string,
    Timestamp: Date,
}

function GetDummyMessage(): Message {
    return {
        ID: "as43ogu5",
        SenderID: "asasa",
        ReceiverID: "ghahgaa",
        Conent: "TESTTESTETST",
        Timestamp: new Date(1, 1, 1901)
    }
}