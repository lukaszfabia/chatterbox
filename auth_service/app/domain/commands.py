class CreateUserCommand:
    def __init__(self, user_id: str | int, username: str):
        self.user_id = user_id
        self.username = username
