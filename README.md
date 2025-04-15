# API Key Management Dashboard

A modern dashboard for managing API keys built with Next.js and Supabase.

## Features

- Create, read, update, and delete API keys
- Secure storage of API keys in Supabase
- Toggle visibility of API keys
- Copy API keys to clipboard
- Regenerate API keys
- Track API key usage
- Responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- A Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/api-key-management.git
   cd api-key-management
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your Supabase project:
   - Create a new project in [Supabase](https://supabase.com)
   - Go to the SQL Editor and run the SQL script in `supabase/migrations/create_api_keys_table.sql`
   - Get your Supabase URL and anon key from the project settings

4. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## API Routes

The application provides the following API routes for managing API keys:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/keys` | Get all API keys |
| POST | `/api/keys` | Create a new API key |
| GET | `/api/keys/[id]` | Get a specific API key |
| PUT | `/api/keys/[id]` | Update an API key |
| DELETE | `/api/keys/[id]` | Delete an API key |
| POST | `/api/keys/[id]/regenerate` | Regenerate an API key |
| POST | `/api/keys/[id]/increment-usage` | Increment the usage count of an API key |

### Example API Usage

```javascript
// Get all API keys
const response = await fetch('/api/keys');
const { success, data } = await response.json();

// Create a new API key
const response = await fetch('/api/keys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My API Key',
    description: 'Description of my API key',
  }),
});
const { success, data } = await response.json();

// Update an API key
const response = await fetch('/api/keys/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated API Key',
    description: 'Updated description',
    active: true,
  }),
});
const { success, data } = await response.json();

// Delete an API key
const response = await fetch('/api/keys/123e4567-e89b-12d3-a456-426614174000', {
  method: 'DELETE',
});
const { success } = await response.json();

// Regenerate an API key
const response = await fetch('/api/keys/123e4567-e89b-12d3-a456-426614174000/regenerate', {
  method: 'POST',
});
const { success, data } = await response.json();

// Increment usage count
const response = await fetch('/api/keys/123e4567-e89b-12d3-a456-426614174000/increment-usage', {
  method: 'POST',
});
const { success, data } = await response.json();
```

## Database Schema

The `api_keys` table has the following structure:

| Column      | Type                     | Description                    |
|-------------|--------------------------|--------------------------------|
| id          | UUID                     | Primary key                    |
| name        | TEXT                     | Name of the API key            |
| description | TEXT                     | Description of the API key     |
| key         | TEXT                     | The actual API key value       |
| active      | BOOLEAN                  | Whether the key is active      |
| usage       | INTEGER                  | Number of times the key was used|
| created_at  | TIMESTAMP WITH TIME ZONE | When the key was created       |
| updated_at  | TIMESTAMP WITH TIME ZONE | When the key was last updated  |

## Security Considerations

- API keys are stored securely in the database
- Row Level Security (RLS) is enabled to restrict access to authenticated users
- Keys are hidden by default and can be revealed with a click
- The dashboard uses client-side rendering for sensitive operations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
