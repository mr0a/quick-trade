import requests
import hashlib
from auth.server import run_local_server

APIKEY = "eeb720dffaea4402a641478c627ae32f"
APISECRET = "2022.905726f415814b48911d13538a307ad98e39db36a0f5f987"
HOST = "localhost"
PORT = 8080

AUTH_URL = f"https://auth.flattrade.in/?app_key={APIKEY}"
API_TOKEN_URL = "https://authapi.flattrade.in/trade/apitoken"


def get_api_token():
    query_params = run_local_server(AUTH_URL)
    hash_obj = hashlib.sha256()
    request_code = query_params.get("code")[0]
    hash_str = APIKEY + request_code + APISECRET
    hash_obj.update(hash_str.encode('utf-8'))
    json_data = {
        "api_key": APIKEY,
        "request_code": request_code,
        "api_secret": hash_obj.hexdigest()
    }
    response = requests.post(API_TOKEN_URL, json=json_data)
    print(response)
    if response.status_code != 200:
        raise Exception("Error in obtaining token!")
    response_json = response.json()
    if response_json.get("stat") != "Ok":
        raise Exception("Error in the data given to obtain token!")
    return response_json


