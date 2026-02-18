## Use Case Diagram

```mermaid
usecaseDiagram
  actor Student as S
  actor Instructor as I
  actor Admin as A
  actor "Payment Provider" as PP

  rectangle "Online Course Platform" {
    usecase "Browse Courses" as UC_BROWSE
    usecase "View Course Details" as UC_VIEW_COURSE
    usecase "Register Account" as UC_REGISTER
    usecase "Authenticate" as UC_AUTH
    usecase "Enroll in Course" as UC_ENROLL
    usecase "Access Lessons" as UC_ACCESS_LESSONS
    usecase "Track Progress" as UC_PROGRESS

    usecase "Create/Update Course" as UC_MANAGE_COURSE
    usecase "Publish/Unpublish Course" as UC_PUBLISH
    usecase "Manage Lessons" as UC_MANAGE_LESSON

    usecase "Process Payment" as UC_PAYMENT

    usecase "Moderate Courses" as UC_MODERATE
    usecase "Manage Users & Roles" as UC_MANAGE_USERS
  }

  S --> UC_REGISTER
  S --> UC_AUTH
  S --> UC_BROWSE
  S --> UC_VIEW_COURSE
  S --> UC_ENROLL
  S --> UC_ACCESS_LESSONS
  S --> UC_PROGRESS

  I --> UC_AUTH
  I --> UC_MANAGE_COURSE
  I --> UC_MANAGE_LESSON
  I --> UC_PUBLISH

  A --> UC_AUTH
  A --> UC_MODERATE
  A --> UC_MANAGE_USERS

  UC_ENROLL --> UC_PAYMENT
  PP --> UC_PAYMENT
```
