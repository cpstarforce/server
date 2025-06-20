import os
import sys
import json
import time
import requests
import websocket

status = os.getenv("status")
custom_status = os.getenv("custom_status")
usertoken = os.getenv("token")

if not custom_status:
  print("Error: Environment variable 'custom_status' does not exist.")
  sys.exit()
if not usertoken:
  print("Error: Environment variable 'token' does not exist.")
  sys.exit()

headers = {
  "Authorization": usertoken,
  "Content-Type": "application/json"
}

validate = requests.get("https://canary.discordapp.com/api/v9/users/@me", headers = headers)

if validate.status_code != 200:
  print("Error: The token provided in environment variable 'token' is invalid.")
  sys.exit()

userinfo = requests.get("https://canary.discordapp.com/api/v9/users/@me", headers = headers).json()
username = userinfo["username"]
discriminator = userinfo["discriminator"]
userid = userinfo["id"]

def onliner(token, status):
  ws = websocket.WebSocket()
  ws.connect("wss://gateway.discord.gg/?v=9&encoding=json")
  start = json.loads(ws.recv())
  heartbeat = start["d"]["heartbeat_interval"]
  auth = {
    "op": 2,
    "d": {
      "token": token,
      "properties": {
        "$os": "Windows 10",
        "$browser": "Google Chrome",
        "$device": "Windows",
      },
      "presence": {"status": status, "afk": False},
    },
    "s": None,
    "t": None,
  }
  ws.send(json.dumps(auth))
  cstatus = {
    "op": 3,
    "d": {
      "since": 0,
      "activities": [
        {
          "type": 4,
          "state": custom_status,
          "name": "Custom Status",
          "id": "custom",
          # Uncomment the below lines if you want an emoji in the status
          #"emoji": {
            #"name": "emoji name",
            #"id": "emoji id",
            #"animated": False,
          #},
        }
      ],
      "status": status,
      "afk": False,
    },
  }
  ws.send(json.dumps(cstatus))
  online = {"op": 1, "d": "None"}
  time.sleep(heartbeat / 1000)
  ws.send(json.dumps(online))

def run_onliner():
  os.system("clear")
  print(f"Logged in as @{username} ({userid}) indefinitely.")
  while True:
    onliner(usertoken, status)
    time.sleep(30)

run_onliner()