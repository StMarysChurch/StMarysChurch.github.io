Server Side
========== 

How to run backend?
-----------

1) Clone the repo.

2) Install Docker.

3) Build Docker image 
```shell
$ docker build -t alpine/server-side:1.0 .
```

4) Run Docker image
```shell
$ docker run -p 8080:8080 -d alpine/server-side:1.0
```

5) Find your docker-machine ip
```shell
$ docker-machine ip
```

6) To access the website go to docker-machine ip:8080
e.g http://192.168.99.100:8080/
