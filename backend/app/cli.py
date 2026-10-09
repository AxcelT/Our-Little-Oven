"""Usage: python -m app.cli add-user zoie --role member"""
import argparse
import getpass
import sys

from sqlalchemy import select

from app.db import SessionLocal
from app.models import Role, User
from app.services.auth import hash_password


def add_user(name: str, role: Role) -> None:
    name = name.strip().lower()
    password = getpass.getpass("Password: ")
    if password != getpass.getpass("Again: "):
        sys.exit("Passwords don't match.")
    if len(password) < 8:
        sys.exit("Use at least 8 characters.")

    with SessionLocal() as db:
        if db.scalar(select(User).where(User.name == name)):
            sys.exit(f"{name} already exists.")
        db.add(User(name=name, password_hash=hash_password(password), role=role))
        db.commit()
    print(f"Added {name} ({role.value}).")


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    commands = parser.add_subparsers(dest="command", required=True)

    add = commands.add_parser("add-user", help="create an account")
    add.add_argument("name")
    add.add_argument("--role", choices=[r.value for r in Role], required=True)

    args = parser.parse_args()
    if args.command == "add-user":
        add_user(args.name, Role(args.role))


if __name__ == "__main__":
    main()
