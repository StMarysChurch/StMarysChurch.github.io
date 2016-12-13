<p align="center">
  <h1 align="center">Server Side</h1>
  <p align="center">How to run backend?</p>
</p>

-----------

1) Clone the repo.

2) Install Docker.

3) Build Docker image 
```shell
$ cd StMarysChurch.github.io/
$ docker build -t alpine/restify:1.0 .
```

4) Run Docker image
```shell
$ docker run -p 8080:8080 -d alpine/restify:1.0
```

6) To access the website go to http://localhost:8080/
