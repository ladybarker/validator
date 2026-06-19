import http.server, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
port = int(os.environ.get('PORT', 8080))
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=port, bind='127.0.0.1')
