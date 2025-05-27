import { useState } from "react";
import { loginUser } from "../../../services/authServices";
import backgroundImage from '../../../assets/img/background.png';
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await loginUser(formData)
      .then(() => (window.location.href = "/dashboard"))
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
        <h2 className="text-2xl font-semibold text-center text-gray-700 m-5">Connexion</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#005B70] text-white p-4 rounded-lg font-medium cursor-pointer transition duration-200 hover:bg-[#005B70]/80"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Lien pour s'inscrire */}
        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-blue-500 underline ml-2 hover:text-blue-700 transition duration-200">
            Inscrivez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
}
