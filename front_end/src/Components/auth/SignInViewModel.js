import { useState } from "react";
import axios from "axios";
import { useStore } from "./../../store";

const useSignInViewModel = (navigate) => {
  const { dispatch } = useStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/login/`,
      formData
    );

    if (response.status === 200) {
      dispatch({ type: "SET_TOKEN", payload: response.data.token });

      const user = {
        id: response.data.author.id,
        username: response.data.author.displayName,
        profileImage: response.data.author.profileImage,
        github: response.data.author.github,
      };
      dispatch({ type: "SET_USER", payload: user });

      setFormData({
        username: "",
        password: "",
      });
      const segments = response.data.author.id.split("/");
      const id = segments[segments.length - 1];
      navigate(`/profile/${id}`);
    } else {
      console.error("Login failed");
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
