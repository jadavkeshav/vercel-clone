# Vercel Clone 2.0

A full-stack platform inspired by [Vercel](https://vercel.com), enabling users to deploy, manage, and preview web projects with instant builds, custom domains, and real-time logs.

---

## Features

- **User Authentication**: Sign up, login, email verification, password reset.
- **Project Management**: Create, view, and delete projects linked to Git repositories.
- **Automated Builds**: Projects are built in isolated containers using AWS ECS.
- **Live Build Logs**: Real-time build logs via WebSockets (Socket.IO + Redis).
- **Static Hosting**: Deployments are uploaded to AWS S3 and served via a reverse proxy.
- **Custom Domains**: Assign custom or generated subdomains to projects.
- **Modern Frontend**: Built with React, TypeScript, Vite, and Tailwind CSS.

---

## Project Structure

```
.
├── api-server/           # Express.js API (auth, projects, domains)
├── build-server/         # Build runner (ECS task, builds & uploads to S3)
├── frontend/             # React + Vite + Typescript frontend
├── s3-reverse-proxy/     # Express reverse proxy for S3 static hosting
└── Readme.md

```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for build-server)
- AWS account (S3, ECS, IAM setup)
- Redis instance

### 1. Clone the Repository

```sh
git clone https://github.com/jadavkeshav/vercel-clone.git
cd vercel-clone
```

### 2. Environment Variables

Create `.env` files in `api-server/`, `build-server/`, and `s3-reverse-proxy/` with the following variables:

**api-server/.env**

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=vc-build-server
AWS_ECS_CLUSTER=your_ecs_cluster
AWS_ECS_TASK_DEFINITION=your_task_def
AWS_ECS_IMAGE_NAME=your_image_name
AWS_ECS_CLUSTER_SUBNETS=your_subnet_id
AWS_ECS_CLUSTER_SECURITY_GROUP=your_sg_id
AWS_API_GATEWAY_URL=your_api_gateway_url
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
```

**build-server/.env**

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
REDIS_URL=redis://host:port
PROJECT_ID=will_be_set_by_ecs
GIT_REPOSITORY_URL=will_be_set_by_ecs
```

**s3-reverse-proxy/.env**

```
# (if needed)
```

### 3. Install Dependencies

```sh
cd api-server && npm install
cd ../build-server && npm install
cd ../s3-reverse-proxy && npm install
cd ../frontend && npm install
```

### 4. Start Services

- **API Server**:

  ```sh
  cd api-server
  node index.js
  ```
- **Frontend**:

  ```sh
  cd frontend
  npm run dev
  ```
- **S3 Reverse Proxy**:

  ```sh
  cd s3-reverse-proxy
  node index.js
  ```
- **Build Server**:
  Deploy via Docker/ECS as per your AWS setup.

---

## Usage

1. Register and verify your email.
2. Create a new project by importing a Git repository.
3. Watch build logs in real-time.
4. Access your deployed site via the provided subdomain.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Build System**: AWS ECS, Docker, Node.js, AWS S3
- **Real-time**: Redis, Socket.IO
- **Proxy**: Express, http-proxy

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgements

- [Vercel](https://vercel.com) for inspiration
- [AWS](https://aws.amazon.com/) for cloud infrastructure
- [Socket.IO](https://socket.io/) for real-time logs
