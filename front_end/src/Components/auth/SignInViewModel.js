import { useState } from 'react';
import axios from 'axios';
import { useStore } from './../../store';

const useSignInViewModel = (navigate) => {
  const { dispatch } = useStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);

    if (response.status === 200) {
      dispatch({ type: 'SET_TOKEN', payload: response.data.token });

      const user = {
        id: response.data.author.id,
        username: response.data.author.displayName,
        profileImage: response.data.author.profileImage,
        gitHub: response.data.author.gitHub,
      };
      dispatch({ type: 'SET_USER', payload: user });
      
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
