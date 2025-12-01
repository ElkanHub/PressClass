Rewritten Instruction (Improved Version)

Implement a full authentication system that supports four user types: Teacher, Student, School, and Regular User.

1. School Registration

When a school signs up, the system should generate a unique School Access Key.
This key is what the school will give to their teachers so they can join the platform under that institution.

Each school account should capture:

School Name

School Email

Admin/Contact Person (optional)

Automatically generated School Access Key

This key must be stored securely in the database.

2. Teacher Registration & Login

Teachers must authenticate using:

Their Name

Their School Name

The School Access Key provided by their institution

Email + Password

During signup, the app should verify the School Name and Key against the school record in the database.
If the details match, the teacher is allowed to create their account. If not, the system rejects the registration with a clear error message.

Once registered, teachers log in using their email + password as usual.

3. Student Registration

Students sign up normally with:

Name

Class Level

Email + Password

Students don’t need a school key unless you decide to link them to an institution later.

4. Regular User Registration

Regular users (non-school, non-teacher, non-student) sign up with only:

Email

Password

They get direct access to the app after onboarding.

5. Onboarding Flow (All User Types)

After signup, the app should check whether the user has completed onboarding.
If not, it must automatically route the user into the onboarding process before granting full access.

The onboarding should:

Collect all relevant user information

Ask about their goals, how they plan to use the app, and what they expect from it

Capture any additional details depending on their user type

Use a progress bar or step indicator

Deliver a polished and visually pleasing UI and UX

At the end of onboarding:

Show a warm Welcome Message from the team

Include a Call to Action button that officially takes the user into the main app

The onboarding data must be saved in the database and checked during login so the app knows whether to show onboarding or skip it.