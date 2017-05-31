<p align="center">
  <h1 align="center">Appengine cron job for Firebase function</h1>
  <p align="center">Cron jobs post daily to cloud pub/sub which trigers firbase functions.</p>
</p>

-----------

1) Install the following tools
    * [`git`](https://git-scm.com/downloads)
    * [Python 2.7](https://www.python.org/download/releases/2.7/)
    * [Google Cloud SDK](http://cloud.google.com/sdk/)

```shell
$ cd appengine
```

2) Use pip from python2.7.
```shell
$ pip install -t lib -r requirements.txt
```

3) Create appengine app
```shell
$ gcloud app create
```

4) Deploy to appengine
```shell
$ gcloud app deploy app.yaml cron.yaml
```