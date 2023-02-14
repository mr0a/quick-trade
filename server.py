import webbrowser
import wsgiref.simple_server
import logging
from urllib import parse

_LOGGER = logging.getLogger(__name__)


SUCCESS_MESSAGE = "The authentication flow has completed. You may close this window."

class _RedirectWSGIApp:
    """WSGI app to handle the authorization redirect.

    Stores the request URI and displays the given success message.
    """

    def __init__(self, success_message):
        """
        Args:
            success_message (str): The message to display in the web browser
                the authorization flow is complete.
        """
        self.last_request_uri = None
        self._success_message = success_message

    def __call__(self, environ, start_response):
        """WSGI Callable.

        Args:
            environ (Mapping[str, Any]): The WSGI environment.
            start_response (Callable[str, list]): The WSGI start_response
                callable.

        Returns:
            Iterable[bytes]: The response body.
        """
        start_response("200 OK", [("Content-type", "text/plain; charset=utf-8")])
        self.last_request_uri = wsgiref.util.request_uri(environ)
        return [self._success_message.encode("utf-8")]


class _WSGIRequestHandler(wsgiref.simple_server.WSGIRequestHandler):
    """Custom WSGIRequestHandler.

    Uses a named logger instead of printing to stderr.
    """

    def log_message(self, format, *args):
        # pylint: disable=redefined-builtin
        # (format is the argument name defined in the superclass.)
        _LOGGER.info(format, *args)


def run_local_server(redirect_url, host="localhost", bind_addr=None, port=8080):
    wsgi_app = _RedirectWSGIApp(SUCCESS_MESSAGE)
    # Fail fast if the address is occupied
    wsgiref.simple_server.WSGIServer.allow_reuse_address = False
    local_server = wsgiref.simple_server.make_server(
        bind_addr or host, port, wsgi_app, handler_class=_WSGIRequestHandler
    )
    print(f"Please visit this URL to authorize this application: {redirect_url}")
    webbrowser.open(redirect_url)
    local_server.timeout = None
    local_server.handle_request()
    authorization_response = wsgi_app.last_request_uri.replace("http", "https")
    print(authorization_response)
    local_server.server_close()
    return parse.parse_qs(parse.urlsplit(authorization_response).query)

