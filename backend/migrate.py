import sys
sys.path.insert(0, '.')
from database import engine
import sqlalchemy as sa

columns = [
    ("avatar_emoji", "TEXT DEFAULT 'bot'"),
    ("avatar_img",   "TEXT"),
    ("has_files",    "BOOLEAN DEFAULT 0"),
    ("file_names",   "TEXT"),
    ("created_at",   "DATETIME"),
]

with engine.connect() as conn:
    for col_name, col_def in columns:
        try:
            conn.execute(sa.text(f"ALTER TABLE bots ADD COLUMN {col_name} {col_def}"))
            conn.commit()
            print(f"[OK] Added column: {col_name}")
        except Exception as e:
            print(f"[--] Skipped {col_name} (already exists)")

print("\nDone! All columns are ready.")
print("Now run: python -m uvicorn main:app --reload")
