from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

pontuacao_global = 0

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return FileResponse("static/index.html")

@app.post("/clicar")
def clicar():
    global pontuacao_global

    pontuacao_global += 1

    return {
        "pontos": pontuacao_global
    }

@app.get("/placar")
def placar():
    return {
        "pontos": pontuacao_global
    }