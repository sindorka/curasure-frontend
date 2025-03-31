# **CuraSure - Patient & Health Insurance Management System**  

CuraSure is a comprehensive **Patient & Health Insurance Management System** that allows patients, doctors, and insurance providers to interact efficiently. The system provides appointment booking, medical history access, insurance quotes, COVID-19 tracking, and secure authentication. 

---

## **Table of Contents** 
- [Project Structure](#project-structure) 
- [Setup & Installation](#setup--installation)
- [Routes](#routes)

---

## **Project Structure**
```
CuraSure/
│-- curasure/       
│   ├── src/           
│       ├── core/               #Common components for all 3 roles              
│       ├── doctor              #Components exclusive for doctor role          
│       ├── insurance-provider  #Components exclusive for insurance provider role   
        ├── patient             #Components exclusive for patient role
    ├── App/                    #Project entry point 
    ├── Routes/                 #Navigation paths   
│   ├── package.json            # Dependencies & scripts
│
│-- README.md                   # Project documentation
```

---

## **Setup & Installation**
### **1. Clone the Repository**
```bash
git clone https://github.com/sindorka/curasure-frontend.git
cd CuraSure/curasure
```

### **2. Switch to `dev` Branch**
```bash
git checkout dev
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Run the Server**
```bash
npm run dev
```
Frontend will run at: **http://localhost:5173**

---

## **Routes**

### **Home Page**
**URL:**
```
http://localhost:5173/curasure
```

### **Login Page**
**URL:**
```
http://localhost:5173/curasure/login
```

### **Register Page**
**URL:**
```
http://localhost:5173/curasure/register
```

---