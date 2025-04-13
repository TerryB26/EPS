import { query } from '@/library/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Fetch user details from the database
    const result = await query(
      `SELECT us.userid, name, surname, email, password, phone, idnumber, rl.rolename 
       FROM public.users us
       LEFT JOIN public.userroles ur ON us.userid = ur.userid
       LEFT JOIN public.roles rl ON ur.roleid = rl.roleid
       WHERE us.email = $1`,
      [email]
    );

    // Check if the user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    const user = result.rows[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userid: user.userid,
        email: user.email,
        role: user.rolename,
      },
      process.env.JWT_SECRET, // Ensure this is set in your .env file
      { expiresIn: '1h' }
    );

    // Remove sensitive data before sending the response
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/*
add a loading button on login
a loader while redirecting
and a success message on login
fix the error message on login frontend
implement with auth
fix password bycrypt


// Example usage of withAuth
import withAuth from '@/auth/withAuth';

const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your role: {user.rolename}</p>
    </div>
  );
};

export default withAuth(Dashboard);
*/