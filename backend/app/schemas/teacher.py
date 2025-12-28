from pydantic import BaseModel, EmailStr

class InviteStudentSchema(BaseModel):
    email: EmailStr
    full_name: str
