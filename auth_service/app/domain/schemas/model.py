from pydantic import BaseModel

# What we return in response


class TokenDTO(BaseModel):
    access_token: str
    refresh_token: str

    @staticmethod
    def example():
        return {"access_token": "sljdgf2435r", "refresh_token": "alfhskjdfadf"}
