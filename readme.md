# 🚀 StartUp Forge - Server

The StartUp Forge Server powers the backend of the StartUp Forge platform. It provides secure APIs for authentication, startup management, opportunity posting, application tracking, and role-based access control.
<!-- 
## 🌐 Live API

Add your deployed API URL here:

```bash
https://your-server-url.vercel.app
``` -->

---

# ✨ Features

### 🔐 Authentication & Security

* Better Auth Authentication
* Email & Password Login
* Google OAuth Login
* JWT Token Verification
* Protected Routes
* Role-Based Authorization
* Secure API Access

### 👨‍💼 Founder Features

* Create Startup Profiles
* Update Startup Information
* Delete Startups
* Create Opportunities
* Manage Opportunities
* View Applicants

### 👨‍💻 Collaborator Features

* Apply for Opportunities
* View Application History
* Track Application Status

### 👑 Admin Features

* Manage Users
* Manage Opportunities
* Manage Startups
* Platform Monitoring

### 📈 Additional Features

* Pagination Support
* Filtering & Searching
* MongoDB Aggregation
* RESTful API Design
* Error Handling
* Validation Middleware

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* MongoDB Atlas

### Authentication

* Better Auth
* JWT Verification

### Additional Packages

* CORS
* Dotenv
* MongoDB Driver
* Jose
* Better Auth Mongo Adapter

---

 

# 🔑 Authentication Flow

### User Registration

* User creates an account
* Better Auth stores user information
* Default role assigned
* JWT generated

### User Login

* User logs in
* Access token generated
* Protected routes become accessible

### Google Login

* Authenticate with Google OAuth
* User information stored automatically
* JWT issued for API access

---


# 🔒 Authorization Levels

| Role         | Access                           |
| ------------ | -------------------------------- |
| Admin        | Full platform access             |
| Founder      | Startup & opportunity management |
| Collaborator | Apply to opportunities           |

---

# 📄 Example Protected Route

```javascript
app.get("/api/startups", verifyToken, async (req, res) => {
  const founderEmail = req.user.email;

  const startups = await startupCollection
    .find({ founderEmail })
    .toArray();

  res.send(startups);
});
```

---

# 📊 Pagination Example

Request:

```http
GET /api/opportunities?page=1&limit=12
```

Response:

```json
{
  "data": [],
  "page": 1,
  "totalPage": 5
}
```

---

# 🔮 Future Improvements

* Real-time Chat System
* Notifications API
* Team Management
* Stripe Payment Integration
* Premium Subscription System
* Analytics Dashboard
* AI-Based Opportunity Matching

---

# 👨‍💻 Developer

**Amit Chandra Das**

GitHub:
https://github.com/amitchandradas2004

LinkedIn:
https://www.linkedin.com/in/amitchandradas2004
 