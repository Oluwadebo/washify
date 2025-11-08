import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from './endpoint';

const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/users/profile`, { headers: { Authorization: `Bearer ${token}` }});
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  return { user, loading };
};

export default useUserProfile;
