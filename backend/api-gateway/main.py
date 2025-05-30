from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="API Gateway")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = {
    "auth": "http://localhost:8007/api/auth",
    "patient": "http://localhost:8000/api/patient",
    "doctor": "http://localhost:8001/api/doctor",
    "administration": "http://localhost:8002/api/admin",
    "staff": "http://localhost:8003/api/staff",
    "appointment": "http://localhost:8004/api/appointment",
    "clinic-report": "http://localhost:8005/api/clinic-report",
    "payment": "http://localhost:8006/api/payment"
}

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        response = requests.post(f"{SERVICES['auth']}/verify-token/", json={"token": token})
        if response.status_code == 200 and response.json().get("valid"):
            return response.json()
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

def forward_request(service_name: str, endpoint: str, method: str, data=None, headers=None, payload=None):
    service_url = SERVICES.get(service_name)
    if not service_url:
        raise HTTPException(status_code=404, detail="Service not found")
    
    if not endpoint.endswith('/'):
        endpoint = f"{endpoint}/"
    
    url = f"{service_url}/{endpoint}"
    headers = headers or {}
    if payload and 'user_id' in payload:
        headers['X-User-ID'] = str(payload['user_id'])
    logger.info(f"Forwarding {method} request to {url} with headers: {headers}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=data)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            raise HTTPException(status_code=405, detail="Method not allowed")
        
        response.raise_for_status()
        return response.json() if response.content else {"message": "Success"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Error forwarding request to {url}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Auth Service
@app.post("/auth/login/")
async def auth_login(data: dict):
    return forward_request("auth", "login", "POST", data=data)

@app.post("/auth/register/")
async def auth_register(data: dict):
    return forward_request("auth", "register", "POST", data=data)

# Patient Service
@app.post("/patient/login/")
async def patient_login(data: dict):
    return forward_request("auth", "login", "POST", data=data)

@app.post("/patient/register/")
async def patient_register(data: dict):
    return forward_request("auth", "register", "POST", data=data)

@app.post("/patient/token/refresh/")
async def patient_token_refresh(data: dict):
    return forward_request("auth", "token/refresh", "POST", data=data)

@app.post("/patient/logout/")
async def patient_logout(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("patient", "logout", "POST", data=data, headers=headers, payload=payload)

@app.get("/patient/{endpoint:path}")
async def patient_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("patient", endpoint, "GET", headers=headers, payload=payload)

@app.post("/patient/{endpoint:path}")
async def patient_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("patient", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/patient/{endpoint:path}")
async def patient_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("patient", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/patient/{endpoint:path}")
async def patient_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("patient", endpoint, "DELETE", headers=headers, payload=payload)

# Doctor Service
@app.post("/doctor/login/")
async def doctor_login(data: dict):
    return forward_request("auth", "login", "POST", data=data)

@app.post("/doctor/register/")
async def doctor_register(data: dict):
    return forward_request("auth", "register", "POST", data=data)

@app.post("/doctor/token/refresh/")
async def doctor_token_refresh(data: dict):
    return forward_request("doctor", "token/refresh", "POST", data=data)

@app.post("/doctor/logout/")
async def doctor_logout(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("doctor", "logout", "POST", data=data, headers=headers, payload=payload)

@app.get("/doctor/{endpoint:path}")
async def doctor_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("doctor", endpoint, "GET", headers=headers, payload=payload)

@app.post("/doctor/{endpoint:path}")
async def doctor_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("doctor", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/doctor/{endpoint:path}")
async def doctor_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("doctor", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/doctor/{endpoint:path}")
async def doctor_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("doctor", endpoint, "DELETE", headers=headers, payload=payload)

# Administration Service
@app.post("/administration/login/")
async def administration_login(data: dict):
    return forward_request("auth", "login", "POST", data=data)

@app.post("/administration/register/")
async def administration_register(data: dict):
    return forward_request("auth", "register", "POST", data=data)

@app.post("/administration/token/refresh/")
async def administration_token_refresh(data: dict):
    return forward_request("administration", "token/refresh", "POST", data=data)

@app.post("/administration/logout/")
async def administration_logout(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("administration", "logout", "POST", data=data, headers=headers, payload=payload)

@app.get("/administration/{endpoint:path}")
async def administration_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("administration", endpoint, "GET", headers=headers, payload=payload)

@app.post("/administration/{endpoint:path}")
async def administration_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("administration", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/administration/{endpoint:path}")
async def administration_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("administration", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/administration/{endpoint:path}")
async def administration_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("administration", endpoint, "DELETE", headers=headers, payload=payload)

# Staff Service
@app.post("/staff/login/")
async def staff_login(data: dict):
    return forward_request("auth", "login", "POST", data=data)

@app.post("/staff/register/")
async def staff_register(data: dict):
    return forward_request("auth", "register", "POST", data=data)

@app.post("/staff/token/refresh/")
async def staff_token_refresh(data: dict):
    return forward_request("staff", "token/refresh", "POST", data=data)

@app.post("/staff/logout/")
async def staff_logout(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("staff", "logout", "POST", data=data, headers=headers, payload=payload)

@app.get("/staff/{endpoint:path}")
async def staff_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("staff", endpoint, "GET", headers=headers, payload=payload)

@app.post("/staff/{endpoint:path}")
async def staff_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("staff", "endpoint", "POST", data=data, headers=headers, payload=payload)

@app.put("/staff/{endpoint:path}")
async def staff_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("staff", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/staff/{endpoint:path}")
async def staff_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("staff", endpoint, "DELETE", headers=headers, payload=payload)

# Appointment Service
@app.get("/appointment/{endpoint:path}")
async def appointment_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("appointment", endpoint, "GET", headers=headers, payload=payload)

@app.post("/appointment/{endpoint:path}")
async def appointment_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("appointment", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/appointment/{endpoint:path}")
async def appointment_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("appointment", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/appointment/{endpoint:path}")
async def appointment_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("appointment", endpoint, "DELETE", headers=headers, payload=payload)

# Clinic Report Service
@app.get("/clinic-report/{endpoint:path}")
async def clinic_report_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("clinic-report", endpoint, "GET", headers=headers, payload=payload)

@app.post("/clinic-report/{endpoint:path}")
async def clinic_report_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("clinic-report", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/clinic-report/{endpoint:path}")
async def clinic_report_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("clinic-report", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/clinic-report/{endpoint:path}")
async def clinic_report_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("clinic-report", endpoint, "DELETE", headers=headers, payload=payload)

# Payment Service
@app.get("/payment/{endpoint:path}")
async def payment_get(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("payment", endpoint, "GET", headers=headers, payload=payload)

@app.post("/payment/{endpoint:path}")
async def payment_post(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("payment", endpoint, "POST", data=data, headers=headers, payload=payload)

@app.put("/payment/{endpoint:path}")
async def payment_put(endpoint: str, data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("payment", endpoint, "PUT", data=data, headers=headers, payload=payload)

@app.delete("/payment/{endpoint:path}")
async def payment_delete(endpoint: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await verify_token(credentials)
    headers = {"Authorization": f"Bearer {credentials.credentials}"}
    return forward_request("payment", endpoint, "DELETE", headers=headers, payload=payload)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)