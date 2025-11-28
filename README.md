# Backend Feature Technical Documentation

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# docker
$ docker build .

$ docker compose up -d

# for first time user, you will need to run migration to create the entities

#prisma
$ npx prisma migrate dev --name init

$ npx prisma generate


# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Overview

This document describes the backend features responsible for uploading images, creating comments, and associating comments with specific images. The implementation is based on **NestJS**, **Prisma ORM**, and **PostgreSQL**. The backend exposes RESTful endpoints that allow clients to:

1. Upload an image
2. Store metadata of the uploaded image in the `Post` table
3. Add comments to a specific image using the `Comment` table
4. Retrieve posts along with their associated comments

---

## Database Schema

The system uses two relational tables: **Post** and **Comment**. These tables are defined using Prisma ORM with the following schema:

```prisma
model Post {
  id        String   @id
  createdAt DateTime @default(now())
  createdBy String
  filename  String
  url       String
  isHidden  Boolean  @default(false)
  comments  Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  postId    String?
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdBy String
  createdAt DateTime
  content   String
}
```

### Schema Explanation

- **Post**
  - Stores metadata about an uploaded image
  - `isHidden` can be used for soft visibility control
  - One-to-many relationship with `Comment`

- **Comment**
  - Stores a user comment
  - Contains `postId` which links the comment to a specific image
  - `onDelete: Cascade` ensures comments are deleted when their associated post is removed

---

## Feature 1: Upload an Image

### Workflow

1. Client uploads an image using `multipart/form-data`
2. Backend stores the file on disk or cloud storage
3. Backend inserts metadata into the `Post` table
4. API returns the `Post` record including its generated `id`

### Endpoint

**POST /posts/upload**

#### Request

```
Content-Type: multipart/form-data
file: <image>
createdBy: string
```

#### Response

```json
{
  "id": "unique-id",
  "createdAt": "2025-11-28T03:34:00.000Z",
  "createdBy": "user123",
  "filename": "abc.jpg",
  "url": "https://your-domain.com/uploads/abc.jpg",
  "isHidden": false
}
```

---

## Feature 2: Create a Comment for an Image

### Workflow

1. Client provides `postId`, `content`, and `createdBy`
2. Backend inserts a new entry into the `Comment` table
3. The comment is associated with the post via `postId`

### Endpoint

**POST /comments**

#### Request

```json
{
  "postId": "<post-id>",
  "createdBy": "user123",
  "content": "This is my new comment"
}
```

#### Response

```json
{
  "id": "uuid-value",
  "postId": "<post-id>",
  "createdBy": "user123",
  "createdAt": "2025-11-28T03:35:00.000Z",
  "content": "This is my new comment"
}
```

---

## Feature 3: Retrieve Comments by Post's id

### Endpoint

**GET /comments/:postId**

### Response

```json
{
  "comments": [
    {
      "id": "comment-uuid",
      "createdBy": "john",
      "createdAt": "2025-11-28T03:35:00.000Z",
      "content": "Nice picture!"
    }
  ]
}
```

---

## Feature 4: Retrieve All Posts

### Endpoint

**GET /posts**

### Response

```json
{
  "data": [
    {
      "id": "a9302d10-d42c-4009-a68e-9bdc06e54355",
      "createdAt": "2025-11-28T03:39:11.588Z",
      "createdBy": "admin",
      "filename": "upload-file-a9302d10-d42c-4009-a68e-9bdc06e54355",
      "url": "D:\\sandbox\\qode\\be\\uploads\\a9302d10-d42c-4009-a68e-9bdc06e54355.JPG",
      "isHidden": false
    },
    {
      "id": "a4c81207-d902-4092-b562-790f0bb8e026",
      "createdAt": "2025-11-28T03:39:00.126Z",
      "createdBy": "admin",
      "filename": "upload-file-a4c81207-d902-4092-b562-790f0bb8e026",
      "url": "D:\\sandbox\\qode\\be\\uploads\\a4c81207-d902-4092-b562-790f0bb8e026.JPG",
      "isHidden": false
    }
  ]
}
```

---

## System Architecture

### Components

- **Controller Layer:** Receives HTTP requests and validates input
- **Service Layer:** Business logic for upload, comment creation, and data retrieval
- **Prisma Client:** Communicates with PostgreSQL
- **Storage Provider:** Local disk or cloud (AWS S3, Google Cloud Storage, etc.)

### Relationship Diagram

```
Post (1) ----- (∞) Comment
```

---

## Error Handling

| Scenario                           | Action                           |
| ---------------------------------- | -------------------------------- |
| Invalid image format               | Return 400 Bad Request           |
| Missing postId on comment creation | Return 400 Bad Request           |
| postId not found                   | Return 404 Not Found             |
| Server storage error               | Return 500 Internal Server Error |

---

## Security Considerations

- Validate uploaded file types (JPEG, PNG, etc.)
- Limit file size
- Implement authentication for `createdBy`
- Use access control on hidden posts (`isHidden`)

---

## Conclusion

This backend system supports uploading images, storing post metadata, creating comments, and retrieving relational data between posts and comments. The design is modular, scalable, and easy to integrate with a modern frontend such as Next.js.
