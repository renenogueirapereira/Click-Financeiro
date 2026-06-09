from locust import HttpUser, task, between

class Jogador(HttpUser):

    wait_time = between(0.1, 0.5)

    @task
    def clicar(self):
        self.client.post("/clicar")