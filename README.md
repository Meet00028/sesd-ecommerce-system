# ShopCore API (SESD Project)

A modular, full-stack e-commerce system built to demonstrate clean software engineering practices, object-oriented principles, and scalable system design.

## 🏗 Architecture Focus (75% Backend)
This backend is structured using a strict layered architecture:
* **Controllers:** Handle HTTP requests and responses.
* **Services:** Contain core business logic.
* **Repositories:** Manage data access and storage abstraction.

## 🧠 Core Engineering Principles Applied
* **OOP & Inheritance:** Implemented a base `User` class extended by `Admin` and `Customer`, utilizing strong encapsulation for data integrity.
* **Design Patterns:** Utilized the **Strategy Pattern** for the `PaymentProcessor`, allowing seamless swapping between UPI and Credit Card payment methods without modifying core order logic.

## 📂 Project Structure
* `idea.md` - Scope and features
* `*Diagram.md` - UML and Flow diagrams (Mermaid)
* `/src` - Backend Source (Node.js/Express API)
* `/frontend` - React view layer (Vite/TypeScript)

**Author:** Meet Kumar
