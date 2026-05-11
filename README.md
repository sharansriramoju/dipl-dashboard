# DIPL Analytics Dashboard

Product Ratings & Review Analytics Dashboard — React + MUI + Redux Toolkit + Recharts.

## Stack

- **React 18** — UI framework
- **MUI v5** — component library & theming (dark mode)
- **Redux Toolkit** — state management & API calls via `createAsyncThunk`
- **Recharts** — charts (Bar, Histogram)
- **Axios** — HTTP client
- **React Router v6** — navigation

## Pages

| Route       | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `/`         | Dashboard — all 4 charts with global filters                                                |
| `/products` | Products table — search, filter by category/rating, paginated, expandable rows with reviews |
| `/upload`   | File upload — drag & drop .xlsx/.csv, live job progress polling                             |
| `/jobs`     | Job history — all bulk upload jobs with progress breakdown                                  |

## API Endpoints Used

| Method | URL                                                     | Purpose                                  |
| ------ | ------------------------------------------------------- | ---------------------------------------- |
| POST   | `/bulk-upload/products`                                 | Upload Excel/CSV                         |
| GET    | `/bulk-upload/products/latest-job-queue`                | Poll upload job status                   |
| GET    | `/products`                                             | List products (search, filter, paginate) |
| GET    | `/categories`                                           | List categories                          |
| GET    | `/job-queues`                                           | List all upload jobs                     |
| GET    | `/dashboard/products-per-category/bargraph`             | Bar chart data                           |
| GET    | `/dashboard/average-rating-per-category/bargraph`       | Avg rating chart data                    |
| GET    | `/dashboard/discount-percentage-distribution/histogram` | Discount histogram data                  |
| GET    | `/dashboard/top-reviewed-products`                      | Top reviewed products chart              |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:3001

# 3. Start dev server
npm start
```

The app will open at http://localhost:3000 (or next available port).

## Notes

- Backend must have CORS enabled for `http://localhost:3000`
- Job status polling runs every 3 seconds after upload; stops automatically on completion/failure
