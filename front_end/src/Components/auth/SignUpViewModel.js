import { useState } from 'react';
import axios from 'axios';
import { useStore } from './../../store';

const useSignUpViewModel = (navigate) => {
  const { dispatch } = useStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);

    if (response.status === 201) {
      dispatch({ type: 'SET_TOKEN', payload: response.data.token });

      const user = {
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
      console.error('Registration failed');
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

export default useSignUpViewModel;
