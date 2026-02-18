Title: ShopCore - Modular E-commerce Backend System

Scope:
A scalable backend API designed to handle core e-commerce operations including user management, inventory tracking, and order processing. The system focuses on modular architecture to allow easy integration of various payment gateways and notification services.

Key Features:

Role-Based Access Control (RBAC): Distinct interfaces and permissions for Admins (inventory management) and Customers (shopping).

Inventory Management: Real-time tracking of stock levels with atomic updates to prevent overselling.

Order Processing Engine: A transactional flow that handles order creation, status updates (Pending, Shipped, Delivered), and history tracking.

Pluggable Payment Architecture: Designed using the Strategy Pattern to support multiple payment processors without changing core logic.

Search & Filtering: optimized queries for filtering products by category and price range.

Tech Stack:

Backend: Node.js/Express (with TypeScript for strong typing).

Database: MongoDB (or PostgreSQL if preferred).

Architecture: MVC with Service Repository pattern.
