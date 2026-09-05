from fastapi import FastAPI

app = FastAPI(title="Our Little Oven")


@app.get("/api/health")
def health():
    return {"status": "preheating"}
