import http.server
import socketserver

port = 8000
handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", port), handler) as httpd:
    print("Server started at localhost" + str(port))
    httpd.serve_forever()
