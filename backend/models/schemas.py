from pydantic import BaseModel

class VerifyRequest(BaseModel):
    claim: str