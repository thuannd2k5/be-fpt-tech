export const ADMIN_ROLE = "SUPER ADMIN";
export const USER_ROLE = "NORMAL USER";

export const INIT_PERMISSION = [
    {
        name: "Login",
        path: "/api/v1/auth/login",
        method: "POST",
        module: "AUTH",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Register a new user",
        path: "/api/v1/auth/register",
        method: "POST",
        module: "AUTH",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get account information",
        path: "/api/v1/auth/account",
        method: "GET",
        module: "AUTH",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Refresh token",
        path: "/api/v1/auth/refresh",
        method: "GET",
        module: "AUTH",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Logout user",
        path: "/api/v1/auth/logout",
        method: "POST",
        module: "AUTH",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new user",
        path: "/api/v1/users",
        method: "POST",
        module: "USERS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all users",
        path: "/api/v1/users",
        method: "GET",
        module: "USERS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get user by id",
        path: "/api/v1/users/:id",
        method: "GET",
        module: "USERS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update user",
        path: "/api/v1/users",
        method: "PATCH",
        module: "USERS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete user",
        path: "/api/v1/users/:id",
        method: "DELETE",
        module: "USERS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new role",
        path: "/api/v1/roles",
        method: "POST",
        module: "ROLES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all roles",
        path: "/api/v1/roles",
        method: "GET",
        module: "ROLES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get role by id",
        path: "/api/v1/roles/:id",
        method: "GET",
        module: "ROLES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update role",
        path: "/api/v1/roles/:id",
        method: "PATCH",
        module: "ROLES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete role",
        path: "/api/v1/roles/:id",
        method: "DELETE",
        module: "ROLES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new permission",
        path: "/api/v1/permissions",
        method: "POST",
        module: "PERMISSIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all permissions",
        path: "/api/v1/permissions",
        method: "GET",
        module: "PERMISSIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get permission by id",
        path: "/api/v1/permissions/:id",
        method: "GET",
        module: "PERMISSIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update permission",
        path: "/api/v1/permissions/:id",
        method: "PATCH",
        module: "PERMISSIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete permission",
        path: "/api/v1/permissions/:id",
        method: "DELETE",
        module: "PERMISSIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new course",
        path: "/api/v1/courses",
        method: "POST",
        module: "COURSES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all courses",
        path: "/api/v1/courses",
        method: "GET",
        module: "COURSES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get course by id",
        path: "/api/v1/courses/:id",
        method: "GET",
        module: "COURSES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update course",
        path: "/api/v1/courses/:id",
        method: "PATCH",
        module: "COURSES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete course",
        path: "/api/v1/courses/:id",
        method: "DELETE",
        module: "COURSES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new classroom",
        path: "/api/v1/classrooms",
        method: "POST",
        module: "CLASSROOMS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all classrooms",
        path: "/api/v1/classrooms",
        method: "GET",
        module: "CLASSROOMS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get classroom by id",
        path: "/api/v1/classrooms/:id",
        method: "GET",
        module: "CLASSROOMS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update classroom",
        path: "/api/v1/classrooms/:id",
        method: "PATCH",
        module: "CLASSROOMS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete classroom",
        path: "/api/v1/classrooms/:id",
        method: "DELETE",
        module: "CLASSROOMS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new lead",
        path: "/api/v1/leads",
        method: "POST",
        module: "LEADS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all leads",
        path: "/api/v1/leads",
        method: "GET",
        module: "LEADS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get lead by id",
        path: "/api/v1/leads/:id",
        method: "GET",
        module: "LEADS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update lead",
        path: "/api/v1/leads/:id",
        method: "PATCH",
        module: "LEADS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete lead",
        path: "/api/v1/leads/:id",
        method: "DELETE",
        module: "LEADS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new enrollment",
        path: "/api/v1/enrollments",
        method: "POST",
        module: "ENROLLMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all enrollments",
        path: "/api/v1/enrollments",
        method: "GET",
        module: "ENROLLMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get enrollment by id",
        path: "/api/v1/enrollments/:id",
        method: "GET",
        module: "ENROLLMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update enrollment",
        path: "/api/v1/enrollments/:id",
        method: "PATCH",
        module: "ENROLLMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete enrollment",
        path: "/api/v1/enrollments/:id",
        method: "DELETE",
        module: "ENROLLMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new invoice",
        path: "/api/v1/invoices",
        method: "POST",
        module: "INVOICES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all invoices",
        path: "/api/v1/invoices",
        method: "GET",
        module: "INVOICES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get invoice by id",
        path: "/api/v1/invoices/:id",
        method: "GET",
        module: "INVOICES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update invoice",
        path: "/api/v1/invoices/:id",
        method: "PATCH",
        module: "INVOICES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete invoice",
        path: "/api/v1/invoices/:id",
        method: "DELETE",
        module: "INVOICES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new payment",
        path: "/api/v1/payments",
        method: "POST",
        module: "PAYMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all payments",
        path: "/api/v1/payments",
        method: "GET",
        module: "PAYMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get payment by id",
        path: "/api/v1/payments/:id",
        method: "GET",
        module: "PAYMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update payment",
        path: "/api/v1/payments/:id",
        method: "PATCH",
        module: "PAYMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete payment",
        path: "/api/v1/payments/:id",
        method: "DELETE",
        module: "PAYMENTS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new notification",
        path: "/api/v1/notifications",
        method: "POST",
        module: "NOTIFICATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all notifications",
        path: "/api/v1/notifications",
        method: "GET",
        module: "NOTIFICATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get notification by id",
        path: "/api/v1/notifications/:id",
        method: "GET",
        module: "NOTIFICATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update notification",
        path: "/api/v1/notifications/:id",
        method: "PATCH",
        module: "NOTIFICATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete notification",
        path: "/api/v1/notifications/:id",
        method: "DELETE",
        module: "NOTIFICATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new conversation",
        path: "/api/v1/conversations",
        method: "POST",
        module: "CONVERSATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all conversations",
        path: "/api/v1/conversations",
        method: "GET",
        module: "CONVERSATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get conversation by id",
        path: "/api/v1/conversations/:id",
        method: "GET",
        module: "CONVERSATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update conversation",
        path: "/api/v1/conversations/:id",
        method: "PATCH",
        module: "CONVERSATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete conversation",
        path: "/api/v1/conversations/:id",
        method: "DELETE",
        module: "CONVERSATIONS",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Create new message",
        path: "/api/v1/messages",
        method: "POST",
        module: "MESSAGES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get all messages",
        path: "/api/v1/messages",
        method: "GET",
        module: "MESSAGES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Get message by id",
        path: "/api/v1/messages/:id",
        method: "GET",
        module: "MESSAGES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Update message",
        path: "/api/v1/messages/:id",
        method: "PATCH",
        module: "MESSAGES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    },
    {
        name: "Delete message",
        path: "/api/v1/messages/:id",
        method: "DELETE",
        module: "MESSAGES",
        createdBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        },
        updatedBy: {
            _id: "6a9090869b43a4c186ecc99c",
            email: "admin@gmail.com"
        }
    }
];