import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authServices";
import { User } from "../../../types/User";
import backgroundImage from '../../../assets/img/background.png';

export default function Register() {
  const [formData, setFormData] = useState<User>({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await registerUser(formData)
      .then(() => navigate("/login"))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4 min-w-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-8">
        Roadtoo<span className="text-white">.</span>
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 m-2">
          Créer un compte
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-3/4"
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-3/4"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-3/4"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-3/4"
            required
          />
          <button
            type="submit"
            className="bg-[#005B70] text-white p-4 rounded-lg font-medium transition duration-200 cursor-pointer hover:bg-[#005B70]/80"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Déjà un compte ?
          <button
            onClick={() => navigate("/login")}
            disabled={loading}
            className="text-blue-500 underline ml-2 hover:text-blue-700 transition duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}