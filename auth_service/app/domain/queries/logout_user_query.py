from pydantic import BaseModel


class LogoutUserQuery(BaseModel):
    """
    Request model for logging out user.

    Atrybuty:
        userID (str): User identifier as a UUID format.

    Example:
        >>> LogoutUserQuery.example()
        {'userID': '2f13c670-8e76-4a3b-b35f-cb93c1f8edb0'}
    """

    userID: str

    @staticmethod
    def example():
        return {"userID": "2f13c670-8e76-4a3b-b35f-cb93c1f8edb0"}
