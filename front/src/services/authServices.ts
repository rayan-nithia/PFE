import { User } from "../types/User";

export async function loginUser(formData: {
  email: string;
  password: string;
}): Promise<{
  user: User;
  token: string;
}> {
  try {
    const response = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la connexion");
    }

    const data = await response.json();
    console.log('Login response:', data); // Debug log

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log('Token stored:', localStorage.getItem('token')); // Debug log
    console.log('User stored:', localStorage.getItem('user')); // Debug log

    return data;
  } catch (error) {
    console.error("Erreur :", error);
    throw new Error("Une erreur est survenue lors de la connexion");
  }
}

export const registerUser = async (formData: User) => {
  try {
    const response = await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    throw new Error("Une erreur est survenue lors de l'inscription");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log('Getting token:', token); // Debug log
  return token;
};

export const isAuthenticated = () => {
  const token = getToken();
  console.log('Checking authentication:', !!token); // Debug log
  return !!token;
};
