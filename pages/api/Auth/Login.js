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
      `SELECT us.userid, e.employeeid, name, surname, email, password, phone, idnumber, rl.rolename 
       FROM public.users us
       LEFT JOIN public.userroles ur ON us.userid = ur.userid
       LEFT JOIN public.roles rl ON ur.roleid = rl.roleid
       LEFT JOIN public.employees e ON e.userid = us.userid
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
