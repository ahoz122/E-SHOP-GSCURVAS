import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const luxphesUsers = [
    {
      user: "Shurdy",
      password: "0907",
    },
    {
      user: "Daniel",
      password: "262002",
    },
    {
      user: "admin",
      password: "123"
    }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = luxphesUsers.find(
      (user) => user.user === username && user.password === password
    );

    if (user) {
      onLogin();
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-200 text-white px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg shadow-md bg-neutral-800 border border-neutral-700"
          variants={formVariants}
          initial="hidden"
          whileHover={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          animate={
            isError
              ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.5 },
                }
              : "visible"
          }
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-extrabold tracking-wide text-white">
              GS CURVAS
            </h1>
          </motion.div>

          <motion.h2
            className="text-xl font-medium text-center text-neutral-300 mb-8"
            variants={itemVariants}
          >
            Modo Admin
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-neutral-300">
                Usuario
              </label>
              <motion.div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 bg-neutral-700 border-neutral-600 text-white focus:ring-neutral-500 placeholder-neutral-400"
                  whileFocus={{
                    boxShadow: "0 0 0 2px rgba(160, 160, 160, 0.15)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-neutral-300">
                Contraseña
              </label>
              <motion.div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="1234"
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 bg-neutral-700 border-neutral-600 text-white focus:ring-neutral-500 placeholder-neutral-400"
                  whileFocus={{
                    boxShadow: "0 0 0 2px rgba(160, 160, 160, 0.15)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full px-4 py-3 font-medium text-white rounded-lg transition bg-neutral-700 hover:bg-neutral-600"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Iniciar Sesión
            </motion.button>
          </form>

          <AnimatePresence>
            {isError && (
              <motion.div
                className="p-3 text-sm rounded-md border flex items-center gap-2 bg-neutral-700 text-neutral-300 border-neutral-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Credenciales incorrectas. Inténtalo de nuevo.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginExpiration = localStorage.getItem("adminLogin");
    if (loginExpiration) {
      const expiration = parseInt(loginExpiration, 10);
      if (Date.now() < expiration) {
        navigate("/admin/products");
      } else {
        localStorage.removeItem("adminLogin");
      }
    }
  }, []);

  const handleLogin = () => {
    const expirationTime = Date.now() + 3600 * 1000;
    localStorage.setItem("adminLogin", expirationTime.toString());
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoginForm onLogin={handleLogin} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
