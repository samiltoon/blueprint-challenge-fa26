from __future__ import annotations

import enum
from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BookGenre(str, enum.Enum):
    FICTION = "Fiction"
    NON_FICTION = "Non-Fiction"
    CHILDREN = "Children"
    REFERENCE = "Reference"
    PERIODICAL = "Periodical"
    OTHER = "Other"


class BookCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=255)
    genre: BookGenre
    description: str = Field(min_length=1)
    author: str = Field(min_length=1, max_length=255)
    publisher_email: EmailStr = Field(max_length=255)
    shelf_location: str = Field(min_length=1, max_length=64)


class BookResponse(BookCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CheckoutCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    patron_name: str = Field(min_length=1, max_length=255)
    book_id: int = Field(gt=0)
    date: date
    notes: str


class CheckoutResponse(CheckoutCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
