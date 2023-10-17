import { useState } from 'react';
import axios from 'axios';

const useSignInViewModel = (navigate) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);

    if (response.status === 200) {
      localStorage.setItem('token', response.data.token);

      const user = {
        id: response.data.author.id,
        username: response.data.author.displayName,
        profileImage: response.data.author.profileImage,
        gitHub: response.data.author.gitHub,
      };
      localStorage.setItem('user', JSON.stringify(user));

      setFormData({
        username: '',
        password: '',
      });

      navigate('/home');
    } else {
      console.error('Login failed');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
  };
};

export default useSignInViewModel;
