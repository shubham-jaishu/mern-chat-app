# Installation & Migration Guide

After these improvements, follow these steps to get your application running:

## Prerequisites
- Node.js 16+
- MongoDB running locally or cloud instance (MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 2. Environment Configuration

Copy the `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Edit `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGO_DB_URI=mongodb://localhost:27017/chatapp  # or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Key Features Added

### Security Enhancements ✅
- **Rate Limiting**: 100 requests/15min per IP (5 requests for auth endpoints)
- **JWT Cookies**: HttpOnly, SameSite=strict, Secure in production
- **Password Validation**: Minimum 6 characters enforced
- **Configurable CORS**: Via environment variable
- **No Secret Logging**: JWT secret no longer logged

### Code Quality ✅
- **Consistent Naming**: All variables follow camelCase convention
- **JSDoc Comments**: All functions documented
- **Better Error Messages**: Consistent, descriptive error responses
- **Input Validation**: Server-side validation on all endpoints
- **Proper Cleanup**: Socket event listeners properly cleaned up

### Configuration ✅
- **Environment Variables**: `.env.example` for easy setup
- **Better .gitignore**: Comprehensive file exclusion list
- **Error Handling**: Process exits on database connection failure
- **Production Ready**: Secure defaults for production use

---

## File Changes Summary

### 🔧 Backend Files
```
backend/
├── server.js (added rate limiting)
├── controllers/
│   ├── auth.controller.js (validation + JSDoc)
│   ├── message.controller.js (validation + JSDoc)
│   └── user.controller.js (improved errors + JSDoc)
├── middleware/
│   └── protectRoute.js (JSDoc + consistency)
├── utils/
│   └── generateToken.js (JSDoc + formatting)
├── socket/
│   └── socket.js (configurable CORS)
├── db/
│   └── connectToMongoDB.js (error handling)
└── routes/
    └── auth.routes.js (auth rate limiting)
```

### 🎨 Frontend Files
```
frontend/
└── src/hooks/
    ├── useSignup.js (variable naming + validation)
    ├── useGetMessages.js (formatting)
    ├── useGetConversations.js (function shadowing fix)
    └── useListenMessages.js (cleanup fix)
```

### 📄 Config Files
```
package.json (added express-rate-limit, description, keywords)
.env.example (created)
.gitignore (enhanced)
```

---

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**
   ```env
   NODE_ENV=production
   MONGO_DB_URI=<your production MongoDB URI>
   JWT_SECRET=<generate a strong random secret>
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Enable HTTPS**
   - Configure SSL certificates
   - Update socket.io CORS secure flag

3. **Database Security**
   - Use MongoDB Atlas with IP whitelist
   - Enable database authentication
   - Use strong passwords

4. **Build Frontend**
   ```bash
   npm run build --prefix frontend
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm run server
```

### MongoDB Connection Error
- Verify MongoDB is running
- Check `MONGO_DB_URI` in `.env`
- Ensure network access for MongoDB Atlas

### CORS Errors
- Update `CORS_ORIGIN` in `.env`
- Ensure frontend URL matches exactly

### Rate Limit Issues
- Clear browser cache and cookies
- Wait 15 minutes for rate limit to reset
- Check IP address matches

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (protected)

### Messages
- `GET /api/messages/:id` - Get messages with user (protected)
- `POST /api/messages/send/:id` - Send message to user (protected)

---

## Performance Tips

1. **Database Indexes**: Ensure MongoDB has indexes on frequently queried fields
2. **Pagination**: Consider implementing pagination for long message threads
3. **Caching**: Cache user list if not changing frequently
4. **Socket.io Events**: Minimize event emissions for large user bases

---

For detailed improvements documentation, see [IMPROVEMENTS.md](./IMPROVEMENTS.md)
