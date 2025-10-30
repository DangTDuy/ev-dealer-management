# TODO: UserService Enhancement - User Management CRUD

## 🎯 Current Status
- [x] Analyzed existing UserService code
- [x] Created implementation plan
- [x] Got user approval to proceed

## 📋 Tasks to Complete

### Phase 1: Update User Model & Database
- [x] Add new fields to User entity: Email, FullName, CreatedAt, UpdatedAt, IsActive
- [x] Create EF migration for schema changes
- [x] Update UserDbContext with new configurations

### Phase 2: Add DTOs & Validation
- [x] Create UserDto for API responses
- [x] Create UpdateUserRequest DTO
- [x] Create ChangeRoleRequest DTO
- [x] Add validation attributes (email format, required fields)

### Phase 3: Enhance IUserService Interface
- [x] Add GetUsersAsync() method
- [x] Add GetUserByIdAsync(int id) method
- [x] Add UpdateUserAsync(int id, UpdateUserRequest request) method
- [x] Add DeleteUserAsync(int id) method
- [x] Add ChangeUserRoleAsync(int id, string newRole) method

### Phase 4: Implement Service Methods
- [x] Implement all new methods in UserService class
- [x] Add proper error handling and validation
- [x] Add role-based business logic

### Phase 5: Add API Endpoints
- [x] GET /api/users - List all users (Admin only)
- [x] GET /api/users/{id} - Get user by ID (self or Admin)
- [x] PUT /api/users/{id} - Update user (self or Admin)
- [x] DELETE /api/users/{id} - Delete user (Admin only)
- [x] PUT /api/users/{id}/role - Change role (Admin only)

### Phase 6: Add Authorization Policies
- [x] Create authorization policies for Admin, Manager roles
- [x] Apply [Authorize] attributes with policies to endpoints
- [x] Update existing endpoints with proper authorization

### Phase 7: Testing & Validation
- [x] Test all new endpoints with Postman/Swagger
- [x] Test role-based access control
- [x] Test error scenarios (not found, unauthorized)
- [x] Update README.md with new endpoints

## 🔧 Technical Details
- Use existing BCrypt for password hashing
- Soft delete by setting IsActive = false
- JWT tokens include user ID, username, role
- Admin role can manage all users
- Users can update their own profile

## 📁 Files to Modify/Create
- `Program.cs` - Add new endpoints and authorization
- `User.cs` - Update entity model
- `UserService.cs` - Implement new methods
- `IUserService.cs` - Update interface
- Create new DTO files
- `appsettings.json` - Update if needed

## 🎯 Success Criteria
- [x] All CRUD operations work correctly
- [x] Role-based access control enforced
- [x] Proper validation and error messages
- [x] Swagger documentation updated
- [x] No breaking changes to existing auth endpoints
- [x] Database migrations applied successfully
