# Person Search - Next.js 15 + Auth.js + Prisma

## Description

Person Search is a Next.js application built with **Next.js 15.5** and **React 19**. This application demonstrates advanced search functionality using Next.js Server Components with **Google OAuth authentication**, **Prisma ORM**, and **PostgreSQL database** integration. Users must authenticate before accessing the Person CRUD operations, which include searching, adding, editing, and deleting people from a database-backed system.

**Originally forked from [Callum Bir's Person Search](https://github.com/gocallum/person-search)** and enhanced for the ECA Tech Bootcamp curriculum. Enhanced by [barbiefortes04-jpg](https://github.com/barbiefortes04-jpg) with Model Context Protocol (MCP) integration, comprehensive setup documentation, and production-ready deployment features.

## Live Demo

**Production URL:** [https://person-search-next.vercel.app](https://person-search-next.vercel.app)  
**GitHub Repository:** [https://github.com/barbiefortes04-jpg/person-search-next](https://github.com/barbiefortes04-jpg/person-search-next)

## Features

- **OAuth 2.0 Authentication** with Google (Auth.js v5)
- **Protected Routes** with middleware-based authorization
- **Database-Backed CRUD** operations with Prisma ORM
- **Asynchronous search** functionality with real-time filtering
- **Session Management** with user menu and sign-out
- **Comprehensive Documentation** pages (/auth-setup, /security, /github, /database)
- **Responsive design** using Tailwind CSS and shadcn/ui
- **Accessibility-focused** UI components from Radix UI
- **Serverless-Ready** with Neon PostgreSQL
- **Secure credential storage** with environment variables
- **Edge Runtime compatible** middleware
- **Type-safe** forms with Zod validation
- **Model Context Protocol (MCP)** server integration
- **Sample Data Seeding** with 10 pre-loaded person records

## Technologies Used

### Frontend
- **Next.js 15.5.6** - React framework with App Router and Server Components
- **React 19** - Latest React version with concurrent rendering improvements
- **TypeScript 5** - Strongly-typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components built on Radix UI
- **React Hook Form** - Performant and flexible forms library
- **Zod** - TypeScript-first schema declaration and validation library

### Backend & Authentication
- **Auth.js (NextAuth v5)** - Modern authentication for Next.js with Google OAuth 2.0
- **Prisma ORM 6.19.0** - Type-safe database client
- **PostgreSQL** - Robust relational database (Neon serverless)
- **@auth/prisma-adapter** - Database adapter for Auth.js sessions

### Infrastructure
- **Node.js 20.17.0** - Required for compatibility with Next.js 15.5
- **Neon PostgreSQL** - Serverless PostgreSQL with connection pooling
- **Vercel** - Deployment platform optimized for Next.js

## Getting Started

### Prerequisites

- Node.js 20.17.0 or newer
- npm or pnpm
- Google Cloud Console account (for OAuth)
- Neon Database account (for PostgreSQL)

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/barbiefortes04-jpg/person-search-next.git
   cd person-search-next
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory:

   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   
   # Auth.js
   NEXTAUTH_SECRET="your-secret-from-npx-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (from Google Cloud Console)
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

4. Set up the database:

   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to sign in with Google.

## Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login and deploy:
   ```bash
   vercel login
   vercel --prod
   ```

### Required Environment Variables for Production

In your Vercel dashboard, add these environment variables:

```env
DATABASE_URL=your-neon-postgresql-connection-string
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important:** Update your Google OAuth redirect URIs to include your production domain:
- Add: `https://your-vercel-domain.vercel.app/api/auth/callback/google`

## Database Setup

This application uses Neon PostgreSQL for production and development. The database includes:

- **Person Table**: Stores person records with id, name, email, phoneNumber, createdAt, updatedAt
- **Auth.js Tables**: User, Account, Session, and VerificationToken tables for authentication
- **Sample Data**: 10 pre-loaded person records for testing

### Database Schema

```sql
-- Person table for CRUD operations
CREATE TABLE "Person" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Auth.js tables (generated automatically)
-- User, Account, Session, VerificationToken
```

## How It Works (Next.js 15.1 & React 19)

### Key Changes in `UserSearch` Component

1. **Server Component Design**:
   - The `user-search` component is now a **Server Component**, leveraging `searchParams` and fetching user details server-side.
   - `searchParams` are asynchronous in Next.js 15.1, so the `user-search` component resolves them before rendering.

   ```tsx
   export default async function UserSearch({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
     const resolvedSearchParams = await searchParams;
     const selectedUserId = resolvedSearchParams?.userId || null;
     const user = selectedUserId ? await getUserById(selectedUserId) : null;

     return (
       <div className="space-y-6">
         <SearchInput />
         {selectedUserId && (
           <Suspense fallback={<p>Loading user...</p>}>
             {user ? <UserCard user={user} /> : <p>User not found</p>}
           </Suspense>
         )}
       </div>
     );
   }
   ```

2. **Improved Performance**:
   - Data fetching has been optimized to avoid redundant calls. The user object is fetched once in `user-search` and passed as a prop to child components like `UserCard` and `DeleteButton`.
   - This eliminates multiple fetches, improving performance and reducing server load.

3. **Interaction with `SearchInput`**:
   - `SearchInput` remains a **Client Component**, responsible for interacting with the user through `react-select`'s `AsyncSelect`.
   - When a user is selected, the URL is updated with the user's ID using `window.history.pushState`. This triggers a re-render of `user-search` to reflect the updated state.

4. **Improved Error Handling**:
   - Validations and controlled/uncontrolled input warnings have been resolved by ensuring consistent handling in forms using React Hook Form and Zod.

5. **Concurrency & Hydration**:
   - React 19's concurrent rendering and Next.js 15.1's support for server components ensure seamless server-client hydration, reducing potential mismatches.

### Known Issues

1. **Toast Messages**:
   - Notifications in `DeleteButton` and `MutableDialog` are currently not showing. This requires debugging the integration of the `Sonner` toast library.

2. **Theme Support**:
   - The `theme-provider` for managing dark and light modes has been removed temporarily. The Tailwind stylesheets need to be updated to align with the new Next.js configuration.

3. **Hydration Warnings**:
   - Some hydration warnings may occur due to external browser extensions like Grammarly or differences in runtime environments. Suppression flags have been added, but further testing is recommended.

---

### Updated Project Structure

```
person-search/
├── app/
│   ├── components/
│   │   ├── user-search.tsx
│   │   ├── search-input.tsx
│   │   ├── user-card.tsx
│   │   ├── user-dialog.tsx
│   │   └── user-form.tsx
│   ├── actions/
│   │   ├── actions.ts
│   │   └── schemas.ts
│   └── page.tsx
├── public/
├── .eslintrc.json
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### Using `MutableDialog`

The `MutableDialog` component is a reusable dialog framework that can be used for both "Add" and "Edit" operations. It integrates form validation with Zod and React Hook Form, and supports passing default values for edit operations.

#### How `MutableDialog` Works

`MutableDialog` accepts the following props:
- **`formSchema`**: A Zod schema defining the validation rules for the form.
- **`FormComponent`**: A React component responsible for rendering the form fields.
- **`action`**: A function to handle the form submission (e.g., adding or updating a user).
- **`defaultValues`**: Initial values for the form fields, used for editing existing data.
- **`triggerButtonLabel`**: Label for the button that triggers the dialog.
- **`addDialogTitle` / `editDialogTitle`**: Titles for the "Add" and "Edit" modes.
- **`dialogDescription`**: Description displayed inside the dialog.
- **`submitButtonLabel`**: Label for the submit button.

#### Example: Add Operation

To use `MutableDialog` for adding a new user:

```tsx
import { MutableDialog } from './components/mutable-dialog';
import { userFormSchema, UserFormData } from './actions/schemas';
import { addUser } from './actions/actions';
import { UserForm } from './components/user-form';

export function UserAddDialog() {
  const handleAddUser = async (data: UserFormData) => {
    try {
      const newUser = await addUser(data);
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleAddUser}
      triggerButtonLabel="Add User"
      addDialogTitle="Add New User"
      dialogDescription="Fill out the form below to add a new user."
      submitButtonLabel="Save"
    />
  );
}
```

#### Example: Edit Operation

To use `MutableDialog` for editing an existing user:

```tsx
import { MutableDialog } from './components/mutable-dialog';
import { userFormSchema, UserFormData } from './actions/schemas';
import { updateUser } from './actions/actions';
import { UserForm } from './components/user-form';

export function UserEditDialog({ user }: { user: UserFormData }) {
  const handleUpdateUser = async (data: UserFormData) => {
    try {
      const updatedUser = await updateUser(user.id, data);
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleUpdateUser}
      defaultValues={user} // Pre-fill form fields with user data
      triggerButtonLabel="Edit User"
      editDialogTitle="Edit User Details"
      dialogDescription="Modify the details below and click save to update the user."
      submitButtonLabel="Update"
    />
## Credits

**Original Project:** [Callum Bir's Person Search](https://github.com/gocallum/person-search)  
**Enhanced Version:** [barbiefortes04-jpg](https://github.com/barbiefortes04-jpg) - ECA Tech Bootcamp Project  
**Repository:** [https://github.com/barbiefortes04-jpg/person-search-next](https://github.com/barbiefortes04-jpg/person-search-next)

### Key Enhancements
- Added Google OAuth 2.0 authentication with Auth.js v5
- Implemented Prisma ORM with PostgreSQL database (Neon)
- Created protected routes with Edge Runtime middleware
- Added comprehensive security and setup documentation
- Converted from mock data to database-backed CRUD operations
- Integrated Model Context Protocol (MCP) server
- Added sample data seeding and production deployment guides

### ECA Tech Bootcamp Curriculum
This enhanced version was developed as part of the ECA Tech Bootcamp curriculum provided by [AusBiz Consulting](https://ausbizconsulting.com.au). The project demonstrates full-stack Next.js development with modern authentication, database integration, and production deployment practices.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Enhanced by:** [barbiefortes04-jpg](https://github.com/barbiefortes04-jpg)  
**Original by:** Callum Bir - [@callumbir](https://twitter.com/callumbir)  
**Project Link:** [https://github.com/barbiefortes04-jpg/person-search-next](https://github.com/barbiefortes04-jpg/person-search-next)

## Contributing

Contributions are welcome! Please submit a Pull Request with your changes.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Next.js team for the framework
- Radix UI for accessible components
- All contributors of the open-source libraries used in this project

## Contact

Callum Bir - [@callumbir](https://twitter.com/callumbir)  
Project Link: [https://github.com/gocallum/person-search](https://github.com/gocallum/person-search)  

