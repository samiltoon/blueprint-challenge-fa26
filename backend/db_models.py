from __future__ import annotations

from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from .database import Base
except ImportError:
    from database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    genre: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    publisher_email: Mapped[str] = mapped_column(String(255), nullable=False)
    shelf_location: Mapped[str] = mapped_column(String(64), nullable=False)

    checkouts: Mapped[list["Checkout"]] = relationship(
        "Checkout", back_populates="book", cascade="all, delete-orphan"
    )


class Checkout(Base):
    __tablename__ = "checkouts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patron_name: Mapped[str] = mapped_column(String(255), nullable=False)
    book_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("books.id"), index=True, nullable=False
    )
    date: Mapped[date] = mapped_column(Date, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)

    book: Mapped[Book] = relationship("Book", back_populates="checkouts")
