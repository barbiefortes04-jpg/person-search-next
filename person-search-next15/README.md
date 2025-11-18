# Person Search - OAuth Secured Edition

## Description

Person Search is a Next.js application upgraded to leverage **Next.js 15.5** and **React 19**. This OAuth-secured edition demonstrates advanced search functionality using Next.js Server Components with **Google OAuth authentication**, **Prisma ORM**, and **PostgreSQL database** integration. Users must authenticate before accessing the Person CRUD operations, which include searching, adding, editing, and deleting people from a database-backed system.

**Originally forked from [Callum Bir's Person Search](https://github.com/gocallum/person-search)** and modified to implement OAuth authentication, database persistence with Prisma, and comprehensive security documentation for an ECA project submission.

The upgrade to Next.js 15.5 introduced significant breaking changes, including a shift in how `params` and `searchParams` are handled, leading to a complete redesign of the `user-search` component to fully align with Server Components.

## Features

- 🔐 **OAuth 2.0 Authentication** with Google (Auth.js v5)
- 🛡️ **Protected Routes** with middleware-based authorization
- 💾 **Database-Backed CRUD** operations with Prisma ORM
- 🔍 **Asynchronous search** functionality
- 👤 **Session Management** with user menu and sign-out
- 📚 **Comprehensive Documentation** pages (/auth-setup, /security, /github)
- 🎨 **Responsive design** using Tailwind CSS
- ♿ **Accessibility-focused** UI components from Radix UI
- 🚀 **Serverless-Ready** with Neon PostgreSQL
- 🔒 **Secure credential storage** with environment variables
- ⚡ **Edge Runtime compatible** middleware
- 📝 **Type-safe** forms with Zod validation

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

### Minimum Node.js Version

The application has been tested with **Node.js 20.17.0**. Features such as ECMAScript modules and async server components require Node.js 20 or newer, making this the minimum requirement.

## Getting Started

### Prerequisites

- Node.js 20.17.0 or newer
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/marcos-njp/person-search.git
   cd person-search
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following:

   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

   # Auth.js
   AUTH_SECRET="your-secret-from-npx-auth-secret"
   
   # Google OAuth (from Google Cloud Console)
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

4. Set up the database:

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to sign in with Google.

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
**OAuth Edition:** Modified by Marcos for ECA project submission  
**Repository:** [https://github.com/marcos-njp/person-search](https://github.com/marcos-njp/person-search)

### Key Modifications
- Added Google OAuth 2.0 authentication with Auth.js
- Implemented Prisma ORM with PostgreSQL database
- Created protected routes with Edge Runtime middleware
- Added comprehensive security documentation
- Converted from mock data to database-backed CRUD operations
### Note: Future Refactoring for `ActionState` with React 19

The `MutableDialog` component currently uses a custom `ActionState` type to handle the result of form submissions. However, React 19 introduces built-in support for `ActionState` in Server Actions, which can simplify this implementation. 

#### Improvements to Make:
- Replace the custom `ActionState` interface with React 19's built-in `ActionState`.
- Use the `ActionState` directly within the form submission logic to align with React 19 best practices.
- Refactor error handling and success notifications to leverage React's server-side error handling.

This will be addressed in a future update to ensure the `MutableDialog` component remains aligned with React 19's capabilities.

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

