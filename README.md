# Novalance

**PREVIEW:** https://novalance.onrender.com

## How to start

First clone the repo

```bash
git clone https://github.com/kadik23/Novalance <directory-name>
```

Then change directory to that project

```bash
cd <directory-name>
```

Then you need to create a copy of **.env.example** and name it **.env** or run this command

```bash
copy .env.example .env
```

then install all necessary composer dependencies by running

```bash
composer install
```

Then since this is laravel you need to generate new key so run

```bash
php artisan key:generate
```

and Generate the secret key for JWT

```bash
php artisan jwt:secret
```

also you need to link the storage to show the public images, just run this command
```bash
php artisan storage:link
```

And for the frontend you need to change directory to the frontend
```bash
cd frontend
```

then run

```bash
npm install
```

then you can run the development server, make sure you have laravel server running in another terminal so the frontend can intract with the api.

```bash
npm run dev
```

