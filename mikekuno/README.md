# PortfolioForge

PortfolioForge is an online portfolio template generator for creating, saving, editing, deleting, and previewing personal portfolios.

## Features

- Portfolio information form for personal details, profile image URL, education, skills, projects, experience, and social links.
- Exactly three noticeably different templates: Simple, Modern, and Creative.
- Full create, retrieve, update, and delete flow.
- Supabase cloud database integration.
- Responsive pages for Home, Create Portfolio, Template Selection, Preview, and Manage Portfolio.
- Vercel-ready static deployment.

## Technologies

- HTML, CSS, and JavaScript modules
- Supabase (`@supabase/supabase-js` via ESM CDN)
- Vercel

## Setup

1. Create a project at [Supabase](https://supabase.com).
2. Open Supabase SQL Editor and run [`supabase-schema.sql`](./supabase-schema.sql).
3. Copy the Supabase Project URL and public `anon` key.
4. Replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top of [`app.js`](./app.js). The anon key is designed for browser use; never place a service-role key in this project.
5. Open the folder in Vercel or run `vercel` from the project folder. The included `vercel.json` makes the hash-routed app work from the public URL.

When the Supabase values are still placeholders, the app uses browser local storage so the interface can be tested locally. Replace the values before deployment to satisfy the online database requirement.

## Database structure

The `portfolios` table contains:

`id`, `full_name`, `profile_picture`, `email`, `contact_number`, `address`, `about_me`, `education`, `skills`, `projects`, `work_experience`, `social_links`, `template`, `created_at`, and `updated_at`.

The schema enables row-level security with policies for the public CRUD flow. For a production app with user accounts, replace the public policies with authenticated-user policies and add ownership columns.

## Submission checklist

- Published Vercel URL
- Complete source code
- Supabase project name and database platform (do not submit private credentials)
- Screenshots of the home page, information form, manage page, and all three templates
