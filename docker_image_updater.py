#!/usr/bin/env python
"""
Very simple HTTP server that updates docker image based on the webhook
Send a GET request::
    curl http://localhost:9090
Send a HEAD request::
    curl -I http://localhost:9090
Send a POST request::
    curl -d "foo=bar&bin=baz" http://localhost:9090
"""
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from subprocess import call


class Server(BaseHTTPRequestHandler):
    """Server Class"""

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        """Handles GET request"""
        self._set_headers()
        self.wfile.write("Hi from Image Updater")

    def do_HEAD(self):
        """Handles HEAD request"""
        self._set_headers()

    def do_POST(self):
        """Handles POST request"""
        # Doesn't do anything with posted data
        content_length = int(self.headers['Content-Length'])  # <--- Gets the size of data
        post_data = self.rfile.read(content_length)  # <--- Gets the data itself
        print post_data
        self._set_headers()
        self.wfile.write("Yes POST sucess ")
        call(["dcoker", "kill", "$(docker ps -q)"])
        call(["docker", "pull", "stmaryschurch/backend"])
        call(["docker", "run", "stmaryschurch/backend"])


def run(server_class=HTTPServer, handler_class=Server, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting httpd...'
    httpd.serve_forever()


if __name__ == "__main__":
    run()
