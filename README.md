# TshirtDesigner.

## SETUP USING DOCKER COMPOSE

### Step 1

```sh
docker build -t tshirt-designer .
```

### Step 2

```sh
docker-compose up
```

### Step 2

```sh
Run URL: http://localhost:8000/
```

## SETUP ON LOCAL INSTALLATION

### Step 1

```sh
npm i
```

### Step 2

```sh
npx nx run-many -t serve
```

### Step 3

```sh
Run URL: http://localhost:4200/
```

### Optional steps

```sh
# ONLY RUN FRONTEND
npx nx serve tshirt-designer-frontend
# RUN FRONTEND TESTS
npx nx test tshirt-designer-frontend

# ONLY RUN BACKEND
npx nx serve tshirt-designer-backend
# RUN BACKEND TESTS
npx nx test tshirt-designer-backend
```
