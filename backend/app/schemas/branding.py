from typing import Literal

from pydantic import BaseModel, Field, field_validator

Direction = Literal["Bold", "Minimal", "Modern", "Technical"]
Placement = Literal["Front", "Back", "Left Sleeve", "Right Sleeve"]


class BrandingRequest(BaseModel):
    idea: str = Field(min_length=3, max_length=500)
    direction: Direction = "Bold"

    @field_validator("idea")
    @classmethod
    def normalize_idea(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 3:
            raise ValueError("Idea must be at least 3 characters long.")
        return cleaned


class BrandingResponse(BaseModel):
    name: str
    slogan: str
    description: str
    missionStatement: str
    placement: Placement

