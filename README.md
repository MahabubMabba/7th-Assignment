# বাজার দর (Bazar Dor)

A responsive Bangladesh market price tracking website for everyday products. Browse current prices, compare market rates, and see which products have become more or less expensive.

## Features

- View product prices fetched from the Bazar Dor API
- Browse products by category
- See products with rising and falling prices
- Sort products by price
- View product details, including minimum, maximum, and average prices
- See market-wise prices on product detail pages
- Protect product details behind login
- Sign up and sign in with email and password
- Sign in with Google or GitHub
- Update profile name and sign out
- Responsive design for mobile, tablet, and desktop

## Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS and DaisyUI
- Better Auth
- MongoDB
- React Toastify

## API

Products and categories are loaded from the Bazar Dor API.

- Base URL: `https://openapi.programming-hero.com/api/bazardor`
- Products: `/products`
- Categories: `/categories`
- Product details: `/products/:id`
- Category products: `/products?category=:slug`

## Getting Started

Install the dependencies:

```bash
npm install
