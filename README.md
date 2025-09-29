# Database Connection with Supabase
This project uses Supabase as the database solution with Transaction pooler for connection management. Below you'll find information about setting up and configuring the database connection.

## Prerequisites
- Node.js installed on your system
- Supabase project created at [Supabase Dashboard](https://app.supabase.com)
- Supabase project URL and anon key (public API key)
- Access to Supabase project settings for connection string

## Installation
Install the required dependencies using npm:

## Environment Variables
Create a `.env` file in your project root and add the following variables:

## Getting the Connection String
1. Go to your Supabase project dashboard
2. Navigate to Project Settings > Database
3. Scroll down to "Connection string"
4. Select "URI" format
5. Choose "Transaction pooler" from the dropdown
6. Copy the connection string

The connection string will be in this format:
###### postgres://postgres.[project-ref]:[database-password]@aws-0-[region].pooler.supabase.com:6543/postgres?options=transaction-mode%3Dread-write
