## Main End-to-End Flow: Student Enrolls in a Paid Course

```mermaid
sequenceDiagram
  autonumber

  actor Student as S
  participant "Web Client" as WC
  participant "API Gateway\n/ HTTP Controller" as API
  participant "Application Service\n(EnrollInCourseService)" as APP
  participant "Domain Layer\n(Entities, Policies)" as DOMAIN
  participant "Payment Provider Adapter" as PAY_ADAPTER
  participant "Payment Provider" as PAY
  participant "Enrollment Repository" as ENR_REPO
  participant "Course Repository" as COURSE_REPO
  participant "User Repository" as USER_REPO

  S->>WC: Click "Enroll" on course
  WC->>API: POST /courses/{courseId}/enroll
  API->>APP: enrollInCourse(studentId, courseId)

  APP->>USER_REPO: loadStudent(studentId)
  USER_REPO-->>APP: Student

  APP->>COURSE_REPO: loadCourse(courseId)
  COURSE_REPO-->>APP: Course

  APP->>DOMAIN: validateEnrollmentRules(Student, Course)
  DOMAIN-->>APP: OK or error

  alt course is paid
    APP->>PAY_ADAPTER: createPaymentIntent(Student, Course.price)
    PAY_ADAPTER->>PAY: API request with amount and metadata
    PAY-->>PAY_ADAPTER: payment link / client secret
    PAY_ADAPTER-->>APP: PaymentDetails
    APP-->>API: EnrollmentPendingPayment + PaymentDetails
    API-->>WC: 200 + payment info

    S->>PAY: Complete payment via hosted checkout
    PAY-->>PAY_ADAPTER: payment success webhook
    PAY_ADAPTER->>APP: onPaymentCompleted(paymentId, studentId, courseId)

    APP->>DOMAIN: confirmPaidEnrollment()
    APP->>ENR_REPO: saveEnrollment(Student, Course, PAID)
    ENR_REPO-->>APP: Enrollment
  else course is free
    APP->>ENR_REPO: saveEnrollment(Student, Course, FREE)
    ENR_REPO-->>APP: Enrollment
    APP-->>API: Enrollment
    API-->>WC: 200 + enrollment
  end

  note over WC,S: Student can now access lessons for enrolled course
```
