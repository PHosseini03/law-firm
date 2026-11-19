"""Request models with strict validation."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from .validators import check_name, check_phone, clean_text

PracticeArea = Literal[
    "business-litigation", "personal-injury", "estate-planning",
    "family-law", "real-estate-law", "employment-law", "other",
]


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class ConsultationRequest(Strict):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    practice_area: PracticeArea
    contact_method: Literal["phone", "email", "video"] = "phone"
    urgency: Literal["standard", "urgent"] = "standard"
    description: str = Field(min_length=20, max_length=2000)
    consent: bool

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return check_phone(v)

    @field_validator("description")
    @classmethod
    def _description(cls, v: str) -> str:
        return clean_text(v)

    @field_validator("consent")
    @classmethod
    def _consent(cls, v: bool) -> bool:
        if v is not True:
            raise ValueError("Sie müssen den Hinweis bestätigen")
        return v
